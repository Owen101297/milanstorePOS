"use client"

import { useState } from "react"
import { Search, Filter, Download, Eye, FileText, CheckCircle, RefreshCcw, Printer } from "lucide-react"

interface HistoricoVentasProps {
  soloRemisiones?: boolean
}

// Mock Data
const mockDocumentos = [
  { id: "FAC-0015", tipo: "VENTA", cliente: "Juan García", fecha: "2026-04-14", total: 85000, vendedor: "Cajero 1", estado: "Pagada", sede: "Principal" },
  { id: "REM-0005", tipo: "REMISION", cliente: "Empresa XYZ", fecha: "2026-04-14", total: 580000, vendedor: "Cajero 2", estado: "Pendiente", sede: "Principal" },
  { id: "FAC-0014", tipo: "VENTA", cliente: "María López", fecha: "2026-04-14", total: 230000, vendedor: "Cajero 1", estado: "Pagada", sede: "Norte" },
  { id: "FAC-0010", tipo: "VENTA", cliente: "Lucía Méndez", fecha: "2026-04-12", total: 56000, vendedor: "Cajero 1", estado: "Anulada", sede: "Principal" },
]

export default function HistoricoVentas({ soloRemisiones = false }: HistoricoVentasProps) {
  const [search, setSearch] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("TODOS")
  const [procesandoId, setProcesandoId] = useState<string | null>(null)

  const documentos = mockDocumentos.filter(d => 
    (soloRemisiones ? d.tipo === "REMISION" : d.tipo === "VENTA") &&
    (d.id.includes(search) || d.cliente.toLowerCase().includes(search.toLowerCase())) &&
    (filtroEstado === "TODOS" || d.estado === filtroEstado)
  )

  const formatCOP = (v: number) => "$ " + v.toLocaleString("es-CO")

  const handleConvertirRemision = async (id: string) => {
    setProcesandoId(id)
    // Simular llamada a Supabase rpc("convertir_remision_a_venta")
    setTimeout(() => {
      alert(`Remisión ${id} convertida a Factura exitosamente. Stock descontado y registrada en caja.`)
      setProcesandoId(null)
    }, 1500)
  }

  const handleImprimir = (id: string, tipo: string) => {
    // Aquí se llamaría a jspdf o un servicio de backend para generar el PDF.
    alert(`Generando PDF ${tipo === 'TERMICO' ? 'Térmico' : 'Carta'} para documento ${id}...`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {soloRemisiones ? "Cotizaciones / Remisiones" : "Histórico de Ventas"}
          </h2>
          <p className="text-sm text-gray-500">
            {soloRemisiones ? "Gestiona cotizaciones y conviértelas en ventas." : "Auditoría de facturas y descargas en PDF."}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm text-sm font-medium">
          <Download className="w-4 h-4" /> Exportar Reporte
        </button>
      </div>

      {/* Filtros Avanzados */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cliente o # Documento..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
        </div>
        <div className="w-40">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
            <option value="TODOS">Todos</option>
            <option value="Pagada">Pagada</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Anulada">Anulada</option>
          </select>
        </div>
        <div className="w-40">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha</label>
          <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors h-[38px]">
          <Filter className="w-4 h-4" /> Filtrar
        </button>
      </div>

      {/* Tabla Dinámica */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Documento", "Cliente", "Fecha / Sede", "Vendedor", "Total", "Estado", "Acciones"].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {documentos.map(v => (
                <tr key={v.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-5 py-4">
                    <span className="font-bold text-gray-900 group-hover:text-blue-600">{v.id}</span>
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-700">{v.cliente}</td>
                  <td className="px-5 py-4 text-gray-500">
                    <div className="font-medium">{v.fecha}</div>
                    <div className="text-xs">{v.sede}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{v.vendedor}</td>
                  <td className="px-5 py-4 font-black text-gray-800">{formatCOP(v.total)}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                      ${v.estado === "Pagada" ? "bg-green-100 text-green-700 border border-green-200" :
                        v.estado === "Pendiente" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                          "bg-red-100 text-red-700 border border-red-200"}`}>
                      {v.estado}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                       {soloRemisiones && v.estado === "Pendiente" && (
                         <button 
                            onClick={() => handleConvertirRemision(v.id)}
                            disabled={procesandoId === v.id}
                            title="Convertir a Factura"
                            className="p-1.5 hover:bg-green-100 bg-green-50 rounded-lg text-green-600 hover:text-green-700 transition"
                         >
                            {procesandoId === v.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                         </button>
                       )}
                       <button onClick={() => handleImprimir(v.id, 'TERMICO')} title="Imprimir Tirilla Térmica" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                         <Printer className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleImprimir(v.id, 'CARTA')} title="Descargar PDF Carta" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                         <FileText className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {documentos.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                    No se encontraron documentos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
