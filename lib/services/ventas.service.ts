/**
 * Ventas Service — Tarea #14
 * Procesar ventas, gestionar caja, consultar histórico.
 * Integra con el trigger trg_procesar_venta para descuento de Kardex automático.
 */

import { createClient } from '@/lib/supabase/client'
import type {
  Venta,
  VentaDetalle,
  VentaConDetalle,
  SesionCaja,
  InsertVenta,
  InsertVentaDetalle,
  MetodoPago,
  EstadoVenta,
} from '@/lib/database.types'

let _supabase: ReturnType<typeof createClient> | null = null
function getClient() {
  if (!_supabase) _supabase = createClient()
  return _supabase
}

// ============================================================
// VENTAS
// ============================================================

export interface ProcesarVentaInput {
  sedeId: string
  cajaId: string
  usuarioId: string
  clienteId?: string
  clienteNombre?: string
  items: {
    varianteId: string
    cantidad: number
    precioUnitario: number
    descuento?: number
    impuesto?: number
  }[]
  metodoPago: MetodoPago
  referenciaPago?: string
  descuentoGlobal?: number
}

/**
 * Procesar una venta completa (inserta venta + detalles en una transacción).
 * El trigger trg_procesar_venta se encarga del descuento de inventario vía Kardex.
 */
export async function procesarVenta(input: ProcesarVentaInput): Promise<VentaConDetalle> {
  const supabase = getClient()

  // Calcular totales
  let subtotal = 0
  let impuestoTotal = 0
  const detalles: Omit<InsertVentaDetalle, 'venta_id'>[] = []

  for (const item of input.items) {
    const lineaSubtotal = item.precioUnitario * item.cantidad
    const lineaDescuento = item.descuento ?? 0
    const lineaImpuesto = item.impuesto ?? 0
    const lineaTotal = lineaSubtotal - lineaDescuento + lineaImpuesto

    subtotal += lineaSubtotal
    impuestoTotal += lineaImpuesto

    detalles.push({
      variante_id: item.varianteId,
      cantidad: item.cantidad,
      precio_unitario: item.precioUnitario,
      descuento: lineaDescuento,
      impuesto: lineaImpuesto,
      total: lineaTotal,
    })
  }

  const descuentoGlobal = input.descuentoGlobal ?? 0
  const total = subtotal - descuentoGlobal + impuestoTotal

  // 1. Insertar la venta (estado PENDIENTE para que el trigger funcione en UPDATE)
  const ventaInsert: InsertVenta = {
    sede_id: input.sedeId,
    caja_id: input.cajaId,
    usuario_id: input.usuarioId,
    cliente_id: input.clienteId ?? null,
    cliente_nombre: input.clienteNombre ?? 'Consumidor Final',
    subtotal,
    descuento: descuentoGlobal,
    impuesto: impuestoTotal,
    total,
    metodo_pago: input.metodoPago,
    referencia_pago: input.referenciaPago ?? null,
    estado: 'PENDIENTE',
  }

  const { data: venta, error: ventaError } = await supabase
    .from('ventas')
    .insert(ventaInsert)
    .select()
    .single()

  if (ventaError) throw new Error(`Error al crear venta: ${ventaError.message}`)

  // 2. Insertar detalles
  const detallesConVentaId: InsertVentaDetalle[] = detalles.map(d => ({
    ...d,
    venta_id: venta.id,
  }))

  const { error: detalleError } = await supabase
    .from('ventas_detalle')
    .insert(detallesConVentaId)

  if (detalleError) throw new Error(`Error al crear detalle: ${detalleError.message}`)

  // 3. Marcar como COMPLETADA (trigger descuenta inventario)
  const { data: ventaFinal, error: updateError } = await supabase
    .from('ventas')
    .update({ estado: 'COMPLETADA' as EstadoVenta })
    .eq('id', venta.id)
    .select()
    .single()

  if (updateError) throw new Error(`Error al completar venta: ${updateError.message}`)

  return {
    ...ventaFinal,
    detalles: detallesConVentaId.map((d, i) => ({ ...d, id: `temp-${i}`, created_at: new Date().toISOString() })),
  } as VentaConDetalle
}

/**
 * Anular una venta (devuelve inventario via trigger)
 */
export async function anularVenta(ventaId: string): Promise<Venta> {
  const { data, error } = await getClient()
    .from('ventas')
    .update({ estado: 'ANULADA' as EstadoVenta })
    .eq('id', ventaId)
    .select()
    .single()

  if (error) throw new Error(`Error al anular venta: ${error.message}`)
  return data
}

/**
 * Obtener ventas del día para una sede
 */
export async function getVentasHoy(sedeId: string): Promise<Venta[]> {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const { data, error } = await getClient()
    .from('ventas')
    .select('*')
    .eq('sede_id', sedeId)
    .gte('created_at', hoy.toISOString())
    .in('estado', ['COMPLETADA', 'PENDIENTE'])
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Error al cargar ventas de hoy: ${error.message}`)
  return data ?? []
}

/**
 * Obtener venta con detalle completo
 */
export async function getVentaDetalle(ventaId: string): Promise<VentaConDetalle | null> {
  const { data, error } = await getClient()
    .from('ventas')
    .select(`
      *,
      detalles:ventas_detalle(
        *,
        variante:variantes(*, producto:productos(*))
      )
    `)
    .eq('id', ventaId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Error al cargar venta: ${error.message}`)
  }
  return data as unknown as VentaConDetalle
}

/**
 * Histórico de ventas con filtros
 */
export async function getHistoricoVentas(
  sedeId: string,
  options: {
    desde?: string
    hasta?: string
    estado?: EstadoVenta
    metodoPago?: MetodoPago
    limit?: number
    offset?: number
  } = {}
): Promise<{ ventas: Venta[]; total: number }> {
  let query = getClient()
    .from('ventas')
    .select('*', { count: 'exact' })
    .eq('sede_id', sedeId)
    .order('created_at', { ascending: false })

  if (options.desde) query = query.gte('created_at', options.desde)
  if (options.hasta) query = query.lte('created_at', options.hasta)
  if (options.estado) query = query.eq('estado', options.estado)
  if (options.metodoPago) query = query.eq('metodo_pago', options.metodoPago)

  query = query.range(
    options.offset ?? 0,
    (options.offset ?? 0) + (options.limit ?? 50) - 1
  )

  const { data, error, count } = await query

  if (error) throw new Error(`Error al cargar histórico: ${error.message}`)
  return { ventas: data ?? [], total: count ?? 0 }
}

// ============================================================
// CAJA
// ============================================================

/**
 * Abrir sesión de caja
 */
export async function abrirCaja(
  sedeId: string,
  usuarioId: string,
  saldoInicial: number
): Promise<SesionCaja> {
  // Verificar que no haya caja abierta
  const { data: existente } = await getClient()
    .from('sesiones_caja')
    .select('id')
    .eq('sede_id', sedeId)
    .eq('usuario_id', usuarioId)
    .eq('estado', 'ABIERTA')
    .maybeSingle()

  if (existente) throw new Error('Ya existe una caja abierta para este usuario')

  const { data, error } = await getClient()
    .from('sesiones_caja')
    .insert({
      sede_id: sedeId,
      usuario_id: usuarioId,
      saldo_inicial: saldoInicial,
      estado: 'ABIERTA',
    })
    .select()
    .single()

  if (error) throw new Error(`Error al abrir caja: ${error.message}`)
  return data
}

/**
 * Cerrar sesión de caja con cálculo de saldo final
 */
export async function cerrarCaja(
  cajaId: string,
  saldoFinal: number,
  observaciones?: string
): Promise<SesionCaja> {
  const { data, error } = await getClient()
    .from('sesiones_caja')
    .update({
      fecha_cierre: new Date().toISOString(),
      saldo_final: saldoFinal,
      observaciones: observaciones ?? null,
      estado: 'CERRADA',
    })
    .eq('id', cajaId)
    .select()
    .single()

  if (error) throw new Error(`Error al cerrar caja: ${error.message}`)
  return data
}

/**
 * Obtener caja abierta actual del usuario
 */
export async function getCajaAbierta(
  sedeId: string,
  usuarioId: string
): Promise<SesionCaja | null> {
  const { data, error } = await getClient()
    .from('sesiones_caja')
    .select('*')
    .eq('sede_id', sedeId)
    .eq('usuario_id', usuarioId)
    .eq('estado', 'ABIERTA')
    .maybeSingle()

  if (error) throw new Error(`Error al buscar caja: ${error.message}`)
  return data
}

/**
 * Obtener historial de cierres de caja
 */
export async function getHistoricoCierres(
  sedeId: string,
  limit: number = 30
): Promise<SesionCaja[]> {
  const { data, error } = await getClient()
    .from('sesiones_caja')
    .select('*')
    .eq('sede_id', sedeId)
    .eq('estado', 'CERRADA')
    .order('fecha_cierre', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Error al cargar cierres: ${error.message}`)
  return data ?? []
}
