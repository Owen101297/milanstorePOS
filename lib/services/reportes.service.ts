/**
 * Reportes Service — Tarea #16
 * Queries optimizados para el Dashboard y módulo de informes.
 * Alimenta las 4 métricas principales + gráficos.
 */

import { createClient } from '@/lib/supabase/client'
import type { MetodoPago } from '@/lib/database.types'

let _supabase: ReturnType<typeof createClient> | null = null
function getClient() {
  if (!_supabase) _supabase = createClient()
  return _supabase
}

function isValidUUID(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

// ============================================================
// TIPOS DE RESPUESTA
// ============================================================

export interface DashboardMetrics {
  ventasHoy: number
  facturasHoy: number
  gastosHoy: number
  utilidadHoy: number
}

export interface VentaPorHora {
  hour: string
  value: number
}

export interface VentaPorMetodo {
  metodo: MetodoPago
  total: number
  cantidad: number
}

export interface TopProducto {
  productoNombre: string
  varianteSku: string
  cantidadVendida: number
  totalVendido: number
}

export interface VentaPorDia {
  date: string
  dayName: string
  value: number
}

export interface TendenciaSemanal {
  currentWeek: number
  previousWeek: number
  growth: number
}

// ============================================================
// DASHBOARD PRINCIPAL
// ============================================================

/**
 * Obtener las 4 métricas principales del dashboard
 */
export async function getDashboardMetrics(sedeId: string): Promise<DashboardMetrics> {
  if (!isValidUUID(sedeId)) {
    return { ventasHoy: 0, facturasHoy: 0, gastosHoy: 0, utilidadHoy: 0 }
  }
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const hoyISO = hoy.toISOString()

  // Ventas completadas de hoy
  const { data: ventas, error } = await getClient()
    .from('ventas')
    .select('total, subtotal, estado')
    .eq('sede_id', sedeId)
    .gte('created_at', hoyISO)
    .in('estado', ['COMPLETADA'])

  if (error) throw new Error(`Error métricas ventas: ${error.message}`)

  const ventasData = ventas ?? []
  const ventasHoy = ventasData.reduce((sum, v) => sum + (v.total ?? 0), 0)
  const facturasHoy = ventasData.length

  // Gastos (kardex de tipo COMPRA hoy)
  const { data: compras, error: errorCompras } = await getClient()
    .from('kardex')
    .select('cantidad_mov, costo_unitario')
    .eq('sede_id', sedeId)
    .eq('tipo_mov', 'COMPRA')
    .gte('created_at', hoyISO)

  if (errorCompras) throw new Error(`Error métricas gastos: ${errorCompras.message}`)

  const gastosHoy = (compras ?? []).reduce(
    (sum, c) => sum + Math.abs(c.cantidad_mov) * (c.costo_unitario ?? 0), 0
  )

  const utilidadHoy = ventasHoy - gastosHoy

  return { ventasHoy, facturasHoy, gastosHoy, utilidadHoy }
}

/**
 * Obtener ventas agrupadas por hora (para el gráfico de línea)
 */
export async function getVentasPorHora(sedeId: string): Promise<VentaPorHora[]> {
  if (!isValidUUID(sedeId)) return []
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const { data, error } = await getClient()
    .from('ventas')
    .select('created_at, total')
    .eq('sede_id', sedeId)
    .eq('estado', 'COMPLETADA')
    .gte('created_at', hoy.toISOString())
    .order('created_at')

  if (error) throw new Error(`Error ventas por hora: ${error.message}`)

  // Agrupar por hora (0-23)
  const porHora: Record<number, number> = {}
  for (let h = 0; h < 24; h++) porHora[h] = 0

  for (const v of data ?? []) {
    const hora = new Date(v.created_at).getHours()
    porHora[hora] += v.total ?? 0
  }

  return Object.entries(porHora).map(([h, value]) => ({
    hour: formatHour(parseInt(h)),
    value: Math.round(value),
  }))
}

function formatHour(h: number): string {
  if (h === 0) return '12am'
  if (h < 12) return `${h}am`
  if (h === 12) return '12pm'
  return `${h - 12}pm`
}

/**
 * Obtener ventas agrupadas por método de pago (para el gráfico de barras)
 */
export async function getVentasPorMetodo(sedeId: string): Promise<VentaPorMetodo[]> {
  if (!isValidUUID(sedeId)) return []
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const { data, error } = await getClient()
    .from('ventas')
    .select('metodo_pago, total')
    .eq('sede_id', sedeId)
    .eq('estado', 'COMPLETADA')
    .gte('created_at', hoy.toISOString())

  if (error) throw new Error(`Error ventas por método: ${error.message}`)

  const agrupado: Record<string, { total: number; cantidad: number }> = {}
  for (const v of data ?? []) {
    const metodo = v.metodo_pago
    if (!agrupado[metodo]) agrupado[metodo] = { total: 0, cantidad: 0 }
    agrupado[metodo].total += v.total ?? 0
    agrupado[metodo].cantidad += 1
  }

  return Object.entries(agrupado).map(([metodo, stats]) => ({
    metodo: metodo as MetodoPago,
    ...stats,
  }))
}

/**
 * Obtener top productos más vendidos
 */
export async function getTopProductos(
  sedeId: string,
  limit: number = 10,
  periodo: 'hoy' | 'semana' | 'mes' = 'hoy'
): Promise<TopProducto[]> {
  if (!isValidUUID(sedeId)) return []
  const desde = new Date()
  if (periodo === 'hoy') desde.setHours(0, 0, 0, 0)
  else if (periodo === 'semana') desde.setDate(desde.getDate() - 7)
  else desde.setMonth(desde.getMonth() - 1)

  const { data, error } = await getClient()
    .from('ventas_detalle')
    .select(`
      cantidad,
      total,
      variante:variantes(
        sku,
        producto:productos(nombre)
      ),
      venta:ventas!inner(sede_id, estado, created_at)
    `)
    .eq('venta.sede_id', sedeId)
    .eq('venta.estado', 'COMPLETADA')
    .gte('venta.created_at', desde.toISOString())

  if (error) throw new Error(`Error top productos: ${error.message}`)

  // Agrupar por producto
  const agrupado: Record<string, TopProducto> = {}
  for (const d of data ?? []) {
    const variante = d.variante as unknown as { sku: string; producto: { nombre: string } } | null
    if (!variante) continue
    const key = variante.sku
    if (!agrupado[key]) {
      agrupado[key] = {
        productoNombre: variante.producto?.nombre ?? 'Sin nombre',
        varianteSku: variante.sku,
        cantidadVendida: 0,
        totalVendido: 0,
      }
    }
    agrupado[key].cantidadVendida += d.cantidad
    agrupado[key].totalVendido += d.total
  }

  return Object.values(agrupado)
    .sort((a, b) => b.totalVendido - a.totalVendido)
    .slice(0, limit)
}

/**
 * Obtener ventas de los últimos 7 días (para el gráfico de barras inferior)
 */
export async function getVentasUltimos7Dias(sedeId: string): Promise<VentaPorDia[]> {
  if (!isValidUUID(sedeId)) return []
  const data: VentaPorDia[] = []
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)

    const { data: sales, error } = await getClient()
      .from('ventas')
      .select('total')
      .eq('sede_id', sedeId)
      .eq('estado', 'COMPLETADA')
      .gte('created_at', date.toISOString())
      .lt('created_at', nextDay.toISOString())

    if (error) throw new Error(`Error ventas día ${i}: ${error.message}`)

    const total = (sales ?? []).reduce((sum, v) => sum + (v.total ?? 0), 0)
    
    data.push({
      date: date.toLocaleDateString(),
      dayName: days[date.getDay()],
      value: total
    })
  }
  
  return data
}

/**
 * Obtener tendencia semanal (comparativa semana actual vs anterior)
 */
export async function getTendenciaSemanal(sedeId: string): Promise<TendenciaSemanal> {
  if (!isValidUUID(sedeId)) return { currentWeek: 0, previousWeek: 0, growth: 0 }
  const hoy = new Date()
  const hace7 = new Date(); hace7.setDate(hace7.getDate() - 7)
  const hace14 = new Date(); hace14.setDate(hace14.getDate() - 14)

  const { data: week1 } = await getClient()
    .from('ventas')
    .select('total')
    .eq('sede_id', sedeId)
    .eq('estado', 'COMPLETADA')
    .gte('created_at', hace7.toISOString())

  const { data: week2 } = await getClient()
    .from('ventas')
    .select('total')
    .eq('sede_id', sedeId)
    .eq('estado', 'COMPLETADA')
    .gte('created_at', hace14.toISOString())
    .lt('created_at', hace7.toISOString())

  const currentWeek = (week1 ?? []).reduce((s, v) => s + (v.total ?? 0), 0)
  const previousWeek = (week2 ?? []).reduce((s, v) => s + (v.total ?? 0), 0)
  const growth = previousWeek > 0 ? ((currentWeek - previousWeek) / previousWeek) * 100 : 0

  return { currentWeek, previousWeek, growth }
}

// ============================================================
// REPORTES FINANCIEROS
// ============================================================

export interface ResumenPeriodo {
  totalVentas: number
  cantidadFacturas: number
  promedioTicket: number
  totalDescuentos: number
  totalImpuestos: number
  ventasPorMetodo: VentaPorMetodo[]
}

/**
 * Resumen financiero de un período
 */
export async function getResumenPeriodo(
  sedeId: string,
  desde: string,
  hasta: string
): Promise<ResumenPeriodo> {
  const { data, error } = await getClient()
    .from('ventas')
    .select('total, subtotal, descuento, impuesto, metodo_pago')
    .eq('sede_id', sedeId)
    .eq('estado', 'COMPLETADA')
    .gte('created_at', desde)
    .lte('created_at', hasta)

  if (error) throw new Error(`Error resumen período: ${error.message}`)

  const ventas = data ?? []
  const totalVentas = ventas.reduce((s, v) => s + (v.total ?? 0), 0)
  const cantidadFacturas = ventas.length
  const promedioTicket = cantidadFacturas > 0 ? totalVentas / cantidadFacturas : 0
  const totalDescuentos = ventas.reduce((s, v) => s + (v.descuento ?? 0), 0)
  const totalImpuestos = ventas.reduce((s, v) => s + (v.impuesto ?? 0), 0)

  // Agrupar por método de pago
  const metodos: Record<string, { total: number; cantidad: number }> = {}
  for (const v of ventas) {
    const m = v.metodo_pago
    if (!metodos[m]) metodos[m] = { total: 0, cantidad: 0 }
    metodos[m].total += v.total ?? 0
    metodos[m].cantidad += 1
  }

  const ventasPorMetodo = Object.entries(metodos).map(([metodo, stats]) => ({
    metodo: metodo as MetodoPago,
    ...stats,
  }))

  return {
    totalVentas,
    cantidadFacturas,
    promedioTicket: Math.round(promedioTicket),
    totalDescuentos,
    totalImpuestos,
    ventasPorMetodo,
  }
}
