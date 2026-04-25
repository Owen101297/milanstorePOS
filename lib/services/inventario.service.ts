/**
 * Inventario Service — Tarea #15
 * Stock, Kardex, Traslados entre sedes.
 * Los movimientos de Kardex disparan el trigger fn_procesar_kardex
 * que actualiza stock_fisico automáticamente.
 */

import { createClient } from '@/lib/supabase/client'
import type {
  StockFisico,
  Kardex,
  Variante,
  Producto,
  TipoMovKardex,
  InsertKardex,
} from '@/lib/database.types'

let _supabase: ReturnType<typeof createClient> | null = null
function getClient() {
  if (!_supabase) _supabase = createClient()
  return _supabase
}

// ============================================================
// STOCK QUERIES
// ============================================================

export interface StockConProducto extends StockFisico {
  variante: Variante & {
    producto: Producto
  }
}

/**
 * Obtener todo el stock de una sede con datos de producto
 */
export async function getStockSede(sedeId: string): Promise<StockConProducto[]> {
  const { data, error } = await getClient()
    .from('stock_fisico')
    .select(`
      *,
      variante:variantes(*, producto:productos(*))
    `)
    .eq('sede_id', sedeId)
    .order('cantidad', { ascending: true })

  if (error) throw new Error(`Error al cargar stock: ${error.message}`)
  return (data ?? []) as unknown as StockConProducto[]
}

/**
 * Obtener productos con stock bajo (bajo el mínimo)
 */
export async function getStockBajo(sedeId: string): Promise<StockConProducto[]> {
  const { data, error } = await getClient()
    .from('stock_fisico')
    .select(`
      *,
      variante:variantes(*, producto:productos(*))
    `)
    .eq('sede_id', sedeId)

  if (error) throw new Error(`Error al cargar stock bajo: ${error.message}`)
  
  const allStock = (data ?? []) as unknown as StockConProducto[]
  return allStock.filter(item => item.cantidad <= (item.stock_minimo ?? 5))
}

/**
 * Obtener stock de una variante específica en todas las sedes
 */
export async function getStockVariante(varianteId: string): Promise<StockFisico[]> {
  const { data, error } = await getClient()
    .from('stock_fisico')
    .select('*')
    .eq('variante_id', varianteId)

  if (error) throw new Error(`Error al cargar stock variante: ${error.message}`)
  return data ?? []
}

// ============================================================
// MOVIMIENTOS DE KARDEX
// ============================================================

/**
 * Registrar un movimiento de Kardex (ajuste manual, compra, etc.)
 * El trigger fn_procesar_kardex se encarga de actualizar stock_fisico.
 */
export async function registrarMovimiento(
  movimiento: InsertKardex
): Promise<Kardex> {
  const { data, error } = await getClient()
    .from('kardex')
    .insert(movimiento)
    .select()
    .single()

  if (error) {
    // El trigger puede lanzar STOCK_INSUFICIENTE
    if (error.message.includes('STOCK_INSUFICIENTE')) {
      throw new Error('Stock insuficiente para esta operación')
    }
    throw new Error(`Error al registrar movimiento: ${error.message}`)
  }
  return data
}

/**
 * Ajustar stock manualmente (inventario físico)
 */
export async function ajustarStock(
  varianteId: string,
  sedeId: string,
  cantidadNueva: number,
  usuarioId: string,
  motivo?: string
): Promise<Kardex> {
  // Obtener stock actual para calcular diferencia
  const { data: stockActual } = await getClient()
    .from('stock_fisico')
    .select('cantidad')
    .eq('variante_id', varianteId)
    .eq('sede_id', sedeId)
    .single()

  const cantidadActual = stockActual?.cantidad ?? 0
  const diferencia = cantidadNueva - cantidadActual

  if (diferencia === 0) throw new Error('No hay cambio en la cantidad')

  return registrarMovimiento({
    variante_id: varianteId,
    sede_id: sedeId,
    tipo_mov: 'AJUSTE',
    cantidad_mov: diferencia,
    costo_unitario: null,
    referencia_id: null,
    referencia_tipo: 'AJUSTE_MANUAL',
    metadata: { motivo: motivo ?? 'Ajuste de inventario', cantidad_anterior: cantidadActual },
    usuario_id: usuarioId,
  })
}

/**
 * Registrar una compra (entrada de mercancía)
 */
export async function registrarCompra(
  varianteId: string,
  sedeId: string,
  cantidad: number,
  costoUnitario: number,
  usuarioId: string,
  referenciaId?: string
): Promise<Kardex> {
  return registrarMovimiento({
    variante_id: varianteId,
    sede_id: sedeId,
    tipo_mov: 'COMPRA',
    cantidad_mov: cantidad,
    costo_unitario: costoUnitario,
    referencia_id: referenciaId ?? null,
    referencia_tipo: 'ORDEN_COMPRA',
    metadata: {},
    usuario_id: usuarioId,
  })
}

/**
 * Trasladar inventario entre sedes (usa la RPC traslada_inventario)
 */
export async function trasladarInventario(
  varianteId: string,
  sedeOrigenId: string,
  sedeDestinoId: string,
  cantidad: number,
  usuarioId: string
): Promise<void> {
  const { error } = await getClient()
    .rpc('traslada_inventario', {
      p_variante_id: varianteId,
      p_sede_origen: sedeOrigenId,
      p_sede_destino: sedeDestinoId,
      p_cantidad: cantidad,
      p_usuario_id: usuarioId,
    })

  if (error) {
    if (error.message.includes('STOCK_INSUFICIENTE')) {
      throw new Error('Stock insuficiente en sede origen')
    }
    throw new Error(`Error al trasladar: ${error.message}`)
  }
}

// ============================================================
// HISTORIAL DE KARDEX
// ============================================================

export interface KardexConDetalle extends Kardex {
  variante?: Variante & { producto?: Producto }
}

/**
 * Obtener historial de Kardex con filtros
 */
export async function getHistorialKardex(
  sedeId: string,
  options: {
    varianteId?: string
    tipoMov?: TipoMovKardex
    desde?: string
    hasta?: string
    limit?: number
  } = {}
): Promise<KardexConDetalle[]> {
  let query = getClient()
    .from('kardex')
    .select(`
      *,
      variante:variantes(*, producto:productos(nombre, sku_base))
    `)
    .eq('sede_id', sedeId)
    .order('created_at', { ascending: false })
    .limit(options.limit ?? 100)

  if (options.varianteId) query = query.eq('variante_id', options.varianteId)
  if (options.tipoMov) query = query.eq('tipo_mov', options.tipoMov)
  if (options.desde) query = query.gte('created_at', options.desde)
  if (options.hasta) query = query.lte('created_at', options.hasta)

  const { data, error } = await query

  if (error) throw new Error(`Error al cargar Kardex: ${error.message}`)
  return (data ?? []) as unknown as KardexConDetalle[]
}
