"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Receipt, Search, Calendar, Filter, Eye, X, Ban, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { useSede } from "@/components/pos/providers/SedeContext"
import { ventas } from "@/lib/services"
import type { Venta, VentaConDetalle } from "@/lib/database.types"

interface ModuleProps { subMenu: string }
const formatCOP = (v: number) => "$ " + Math.round(v).toLocaleString("es-CO")

const estadoColors: Record<string, string> = {
  COMPLETADA: "bg-emerald-100 text-emerald-700", PENDIENTE: "bg-amber-100 text-amber-700",
  ANULADA: "bg-red-100 text-red-700",
}

export default function Ventas({ subMenu }: ModuleProps) {
  const { sedeId } = useSede()
  const [ventasList, setVentasList] = useState<Venta[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [filterEstado, setFilterEstado] = useState<string>("")
  const [filterMetodo, setFilterMetodo] = useState<string>("")
  const [detalle, setDetalle] = useState<VentaConDetalle | null>(null)
  const [showDetalle, setShowDetalle] = useState(false)
  const pageSize = 25

  const loadVentas = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const { ventas: data, total } = await ventas.getHistoricoVentas(sedeId, {
        estado: (filterEstado || undefined) as undefined,
        metodoPago: (filterMetodo || undefined) as undefined,
        limit: pageSize, offset: page * pageSize,
      })
      setVentasList(data); setTotalCount(total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando ventas")
    } finally { setLoading(false) }
  }, [sedeId, filterEstado, filterMetodo, page])

  useEffect(() => { loadVentas() }, [loadVentas])

  const verDetalle = async (ventaId: string) => {
    try {
      const data = await ventas.getVentaDetalle(ventaId)
      if (data) { setDetalle(data); setShowDetalle(true) }
    } catch { alert("Error cargando detalle") }
  }

  const anular = async (ventaId: string) => {
    if (!confirm("¿Estás seguro de anular esta venta? Esta acción es irreversible.")) return
    try {
      await ventas.anularVenta(ventaId)
      await loadVentas()
    } catch (err) { alert(err instanceof Error ? err.message : "Error al anular") }
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col bg-[#f8fafc] p-6 rounded-tl-3xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-xl font-black text-gray-800">
          <Receipt className="w-6 h-6 text-[#62cb31]" />Historial de Ventas
        </div>
        <div className="flex-1" />
        <button onClick={loadVentas} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por cliente o referencia..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#62cb31]" />
        </div>
        <select value={filterEstado} onChange={e => { setFilterEstado(e.target.value); setPage(0) }}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium">
          <option value="">Todos los estados</option>
          <option value="COMPLETADA">Completadas</option><option value="PENDIENTE">Pendientes</option><option value="ANULADA">Anuladas</option>
        </select>
        <select value={filterMetodo} onChange={e => { setFilterMetodo(e.target.value); setPage(0) }}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium">
          <option value="">Todos los métodos</option>
          <option value="EFECTIVO">Efectivo</option><option value="TARJETA_CREDITO">Tarjeta Crédito</option>
          <option value="TARJETA_DEBITO">Tarjeta Débito</option><option value="TRANSFERENCIA">Transferencia</option>
        </select>
        <div className="flex items-center gap-2 px-4 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700">
          {totalCount} ventas
        </div>
      </div>

      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl mb-4 text-sm text-red-700">{error}</div>}

      {/* Table */}
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#62cb31] border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Método</th>
                <th className="px-4 py-3 text-center">Estado</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ventasList.filter(v => !search || (v.cliente_nombre ?? "").toLowerCase().includes(search.toLowerCase()) || v.id.includes(search)).map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(v.created_at).toLocaleString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{v.cliente_nombre ?? "Consumidor Final"}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600">{v.metodo_pago}</span></td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${estadoColors[v.estado] ?? "bg-gray-100 text-gray-600"}`}>{v.estado}</span></td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCOP(v.total)}</td>
                  <td className="px-4 py-3 text-center flex gap-1 justify-center">
                    <button onClick={() => verDetalle(v.id)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Eye className="w-3.5 h-3.5" /></button>
                    {v.estado === "COMPLETADA" && <button onClick={() => anular(v.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Ban className="w-3.5 h-3.5" /></button>}
                  </td>
                </tr>
              ))}
              {ventasList.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Sin ventas registradas</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-xs text-gray-500">Página {page + 1} de {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Detalle Modal */}
      {showDetalle && detalle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowDetalle(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[550px] max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Detalle Venta #{detalle.id.slice(0, 8)}</h3>
              <button onClick={() => setShowDetalle(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Cliente:</span> <span className="font-bold">{detalle.cliente_nombre}</span></div>
                <div><span className="text-gray-500">Método:</span> <span className="font-bold">{detalle.metodo_pago}</span></div>
                <div><span className="text-gray-500">Estado:</span> <span className={`px-2 py-0.5 rounded text-xs font-bold ${estadoColors[detalle.estado]}`}>{detalle.estado}</span></div>
                <div><span className="text-gray-500">Fecha:</span> <span className="font-bold">{new Date(detalle.created_at).toLocaleString("es-CO")}</span></div>
              </div>
              <div className="border-t pt-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Productos</h4>
                {(detalle.detalles ?? []).map((d, i) => {
                  const dAny = d as unknown as Record<string, unknown>
                  return (
                    <div key={i} className="flex justify-between py-2 border-b border-gray-100 text-sm">
                      <span className="text-gray-700">{String(dAny.variante_id ?? `Item ${i + 1}`)} × {d.cantidad}</span>
                      <span className="font-bold">{formatCOP(d.total)}</span>
                    </div>
                  )
                })}
              </div>
              <div className="border-t pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span><span>{formatCOP(detalle.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Descuento:</span><span className="text-red-500">-{formatCOP(detalle.descuento)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Impuesto:</span><span>{formatCOP(detalle.impuesto)}</span></div>
                <div className="flex justify-between text-lg font-black pt-2 border-t"><span>Total:</span><span className="text-[#62cb31]">{formatCOP(detalle.total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
