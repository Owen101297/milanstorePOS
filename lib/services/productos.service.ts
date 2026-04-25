/**
 * Productos Service — Tarea #13
 * CRUD completo contra Supabase para productos, variantes y categorías.
 */

import { createClient } from '@/lib/supabase/client'
import type {
  Producto,
  Variante,
  Categoria,
  ProductoConVariantes,
  InsertProducto,
  UpdateProducto,
  InsertVariante,
  UpdateVariante,
  StockFisico,
} from '@/lib/database.types'

// ============================================================
// SINGLETON CLIENT (evita recrear en cada llamada)
// ============================================================
let _supabase: ReturnType<typeof createClient> | null = null
function getClient() {
  if (!_supabase) _supabase = createClient()
  return _supabase
}

// ============================================================
// CATEGORÍAS
// ============================================================

export async function getCategorias(): Promise<Categoria[]> {
  const { data, error } = await getClient()
    .from('categorias')
    .select('*')
    .eq('activa', true)
    .order('nombre')

  if (error) throw new Error(`Error al cargar categorías: ${error.message}`)
  return data ?? []
}

export async function createCategoria(
  nombre: string,
  parentId?: string,
  impuestoPorcentaje?: number,
  colorHex?: string
): Promise<Categoria> {
  const { data, error } = await getClient()
    .from('categorias')
    .insert({
      nombre,
      parent_id: parentId ?? null,
      impuesto_porcentaje: impuestoPorcentaje ?? 0,
      color_hex: colorHex ?? '#6366F1',
    })
    .select()
    .single()

  if (error) throw new Error(`Error al crear categoría: ${error.message}`)
  return data
}

// ============================================================
// PRODUCTOS
// ============================================================

export async function getProductos(sedeId?: string): Promise<ProductoConVariantes[]> {
  const { data, error } = await getClient()
    .from('productos')
    .select(`
      *,
      categoria:categorias(*),
      variantes(
        *,
        stock:stock_fisico(*)
      )
    `)
    .eq('archived', false)
    .order('nombre')

  if (error) throw new Error(`Error al cargar productos: ${error.message}`)

  // Filtrar stock por sede si se especifica
  const productos = (data ?? []) as unknown as ProductoConVariantes[]
  if (sedeId) {
    return productos.map(p => ({
      ...p,
      variantes: p.variantes.map(v => ({
        ...v,
        stock: v.stock?.filter(s => s.sede_id === sedeId) ?? [],
      })),
    }))
  }
  return productos
}

export async function getProductoById(id: string): Promise<ProductoConVariantes | null> {
  const { data, error } = await getClient()
    .from('productos')
    .select(`
      *,
      categoria:categorias(*),
      variantes(
        *,
        stock:stock_fisico(*),
        libro_precios:libro_precios(*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(`Error al cargar producto: ${error.message}`)
  }
  return data as unknown as ProductoConVariantes
}

export async function createProducto(producto: InsertProducto): Promise<Producto> {
  const { data, error } = await getClient()
    .from('productos')
    .insert(producto)
    .select()
    .single()

  if (error) throw new Error(`Error al crear producto: ${error.message}`)
  return data
}

export async function updateProducto(id: string, changes: UpdateProducto): Promise<Producto> {
  const { data, error } = await getClient()
    .from('productos')
    .update(changes)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Error al actualizar producto: ${error.message}`)
  return data
}

export async function archiveProducto(id: string): Promise<void> {
  const { error } = await getClient()
    .from('productos')
    .update({ archived: true })
    .eq('id', id)

  if (error) throw new Error(`Error al archivar producto: ${error.message}`)
}

// ============================================================
// VARIANTES
// ============================================================

export async function createVariante(variante: InsertVariante): Promise<Variante> {
  const { data, error } = await getClient()
    .from('variantes')
    .insert(variante)
    .select()
    .single()

  if (error) throw new Error(`Error al crear variante: ${error.message}`)
  return data
}

export async function updateVariante(id: string, changes: UpdateVariante): Promise<Variante> {
  const { data, error } = await getClient()
    .from('variantes')
    .update(changes)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Error al actualizar variante: ${error.message}`)
  return data
}

// ============================================================
// BÚSQUEDA (POS: buscar por nombre, SKU o código de barras)
// ============================================================

export async function buscarProductos(
  query: string,
  sedeId?: string
): Promise<ProductoConVariantes[]> {
  const q = `%${query}%`

  // Buscar en productos por nombre o SKU base
  const { data: porNombre, error: e1 } = await getClient()
    .from('productos')
    .select(`
      *,
      categoria:categorias(*),
      variantes(*, stock:stock_fisico(*))
    `)
    .eq('archived', false)
    .or(`nombre.ilike.${q},sku_base.ilike.${q}`)
    .limit(20)

  if (e1) throw new Error(`Error en búsqueda: ${e1.message}`)

  // Buscar en variantes por SKU o código de barras
  const { data: porBarcode, error: e2 } = await getClient()
    .from('variantes')
    .select(`
      *,
      producto:productos(*, categoria:categorias(*)),
      stock:stock_fisico(*)
    `)
    .eq('activo', true)
    .or(`sku.ilike.${q},codigo_barras.eq.${query}`)
    .limit(10)

  if (e2) throw new Error(`Error en búsqueda por barcode: ${e2.message}`)

  // Combinar resultados, eliminar duplicados por producto ID
  const results = [...(porNombre ?? [])] as unknown as ProductoConVariantes[]
  const existingIds = new Set(results.map(p => p.id))

  for (const v of porBarcode ?? []) {
    const prod = (v as Record<string, unknown>).producto as ProductoConVariantes | undefined
    if (prod && !existingIds.has(prod.id)) {
      results.push({ ...prod, variantes: [v as unknown as Variante & { stock: StockFisico[] }] })
      existingIds.add(prod.id)
    }
  }

  return results
}

// ============================================================
// STOCK (consulta directa)
// ============================================================

export async function getStockBySede(sedeId: string): Promise<(StockFisico & { variante: Variante & { producto: Producto } })[]> {
  const { data, error } = await getClient()
    .from('stock_fisico')
    .select(`
      *,
      variante:variantes(*, producto:productos(*))
    `)
    .eq('sede_id', sedeId)
    .order('cantidad', { ascending: true })

  if (error) throw new Error(`Error al cargar stock: ${error.message}`)
  return data as unknown as (StockFisico & { variante: Variante & { producto: Producto } })[]
}
