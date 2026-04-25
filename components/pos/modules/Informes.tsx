"use client"

import React, { useState, useEffect, useCallback } from "react"
import { BarChart3, TrendingUp, DollarSign, Receipt, ShoppingBag, Calendar, RefreshCw } from "lucide-react"
import { useSede } from "@/components/pos/providers/SedeContext"
import { reportes } from "@/lib/services"
import type { DashboardMetrics, TopProducto, VentaPorMetodo, ResumenPeriodo } from "@/lib/services/reportes.service"

interface ModuleProps { subMenu: string }
const formatCOP = (v: number) => "$ " + Math.round(v).toLocaleString("es-CO")

export default function Informes({ subMenu }: ModuleProps) {
  const { sedeId } = useSede()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [topProducts, setTopProducts] = useState<TopProducto[]>([])
  const [metodos, setMetodos] = useState<VentaPorMetodo[]>([])
  const [resumen, setResumen] = useState<ResumenPeriodo | null>(null)
  const [periodo, setPeriodo] = useState<"hoy" | "semana" | "mes">("hoy")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getDesde = (p: string) => {
    const d = new Date()
    if (p === "hoy") d.setHours(0, 0, 0, 0)
    else if (p === "semana") d.setDate(d.getDate() - 7)
    else d.setMonth(d.getMonth() - 1)
    return d.toISOString()
  }

  const loadData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const desde = getDesde(periodo)
      const hasta = new Date().toISOString()
      const [m, top, met, res] = await Promise.all([
        reportes.getDashboardMetrics(sedeId),
        reportes.getTopProductos(sedeId, 10, periodo),
        reportes.getVentasPorMetodo(sedeId),
        reportes.getResumenPeriodo(sedeId, desde, hasta),
      ])
      setMetrics(m); setTopProducts(top); setMetodos(met); setResumen(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando informes")
    } finally { setLoading(false) }
  }, [sedeId, periodo])

  useEffect(() => { loadData() }, [loadData])

  if (loading) return <div className="flex items-center justify-center h-[calc(100vh-130px)]"><div className="w-10 h-10 border-4 border-[#62cb31] border-t-transparent rounded-full animate-spin" /></div>

  const metricCards = [
    { label: "Ventas Hoy", value: formatCOP(metrics?.ventasHoy ?? 0), icon: DollarSign, color: "emerald" },
    { label: "Facturas", value: String(metrics?.facturasHoy ?? 0), icon: Receipt, color: "blue" },
    { label: "Gastos", value: formatCOP(metrics?.gastosHoy ?? 0), icon: ShoppingBag, color: "red" },
    { label: "Utilidad", value: formatCOP(metrics?.utilidadHoy ?? 0), icon: TrendingUp, color: (metrics?.utilidadHoy ?? 0) >= 0 ? "emerald" : "red" },
  ]

  const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "text-emerald-500" },
    blue: { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-500" },
    red: { bg: "bg-red-50", text: "text-red-700", icon: "text-red-500" },
  }

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col bg-[#f8fafc] p-6 rounded-tl-3xl overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-xl font-black text-gray-800">
          <BarChart3 className="w-6 h-6 text-[#62cb31]" />Informes y Reportes
        </div>
        <div className="flex-1" />
        <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
          {(["hoy", "semana", "mes"] as const).map(p => (
            <button key={p} onClick={() => setPeriodo(p)}
              className={`px-4 py-2 text-xs font-bold capitalize transition-all ${periodo === p ? "bg-[#62cb31] text-white" : "text-gray-500 hover:bg-gray-50"}`}>{p}</button>
          ))}
        </div>
        <button onClick={loadData} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
      </div>

      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl mb-4 text-sm text-red-700">{error}</div>}

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {metricCards.map((m, i) => {
          const c = colorMap[m.color] ?? colorMap.blue
          return (
            <div key={i} className={`${c.bg} rounded-2xl p-5 border border-white/50`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{m.label}</span>
                <m.icon className={`w-5 h-5 ${c.icon}`} />
              </div>
              <p className={`text-2xl font-black ${c.text} tracking-tight`}>{m.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Top Productos */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-[#62cb31]" />Top 10 Productos</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sin datos para este período</p>
          ) : (
            <div className="space-y-2">
              {topProducts.map((p, i) => {
                const maxVenta = topProducts[0]?.totalVendido || 1
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-black text-gray-500">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{p.productoNombre}</p>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                        <div className="bg-[#62cb31] h-1.5 rounded-full transition-all" style={{ width: `${(p.totalVendido / maxVenta) * 100}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-800">{formatCOP(p.totalVendido)}</p>
                      <p className="text-[10px] text-gray-400">{p.cantidadVendida} uds</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Ventas por Método */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><DollarSign className="w-4 h-4 text-[#62cb31]" />Ventas por Método de Pago</h3>
          {metodos.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {metodos.map((m, i) => {
                const maxTotal = Math.max(...metodos.map(x => x.total), 1)
                const metodoColors = ["bg-emerald-400", "bg-blue-400", "bg-purple-400", "bg-amber-400", "bg-rose-400"]
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-700">{m.metodo}</span>
                      <span className="text-gray-500">{m.cantidad} ventas — {formatCOP(m.total)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className={`${metodoColors[i % metodoColors.length]} h-3 rounded-full transition-all`} style={{ width: `${(m.total / maxTotal) * 100}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Resumen del Período */}
      {resumen && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Resumen del Período</h3>
          <div className="grid grid-cols-5 gap-4 text-center">
            {[
              { label: "Total Ventas", value: formatCOP(resumen.totalVentas) },
              { label: "Facturas", value: String(resumen.cantidadFacturas) },
              { label: "Ticket Promedio", value: formatCOP(resumen.promedioTicket) },
              { label: "Descuentos", value: formatCOP(resumen.totalDescuentos) },
              { label: "Impuestos", value: formatCOP(resumen.totalImpuestos) },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-lg font-black text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
