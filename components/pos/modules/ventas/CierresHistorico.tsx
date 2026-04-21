"use client"

import { useState } from "react"
import { Search, Download, Eye, AlertCircle } from "lucide-react"

const mockCierres = [
  { id: 1049, cajero: "Admin", fecha: "2026-04-14 18:30", apertura: 200000, sistema: 2690700, declarado: 2690700, diferencia: 0, estado: "CERRADA", sede: "Principal" },
  { id: 1048, cajero: "Juan Pérez", fecha: "2026-04-14 14:00", apertura: 100000, sistema: 1980000, declarado: 1970000, diferencia: -10000, estado: "CERRADA", sede: "Norte" },
  { id: 1047, cajero: "Ana M.", fecha: "2026-04-13 20:00", apertura: 50000, sistema: 1450000, declarado: 1500000, diferencia: 50000, estado: "CERRADA", sede: "Principal" },
  { id: 1050, cajero: "Carlos R.", fecha: "2026-04-15", apertura: 150000, sistema: 500000, declarado: 0, diferencia: 0, estado: "ABIERTA", sede: "Sur" },
]

export default function CierresHistorico() {
  const [search, setSearch] = useState("")

  const formatCOP = (v: number) => "$ " + v.toLocaleString("es-CO")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Cierres de Caja</h2>
          <p className="text-sm text-gray-500">Vista administrativa para auditar los cuadres de todas las sedes.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm text-sm font-medium">
          <Download className="w-4 h-4" /> Exportar a Excel
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por cajero o sede..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["ID Sesión", "Sede / Cajero", "Fecha", "Apertura", "Ventas Sist.", "Físico Declarado", "Diferencia", "Estado", "Acción"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockCierres.filter(c => c.cajero.toLowerCase().includes(search.toLowerCase()) || c.sede.toLowerCase().includes(search.toLowerCase())).map(c => (
              <tr key={c.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-5 py-4 font-bold text-gray-700">#{c.id}</td>
                <td className="px-5 py-4">
                  <div className="font-bold text-gray-800">{c.sede}</div>
                  <div className="text-xs text-gray-500">{c.cajero}</div>
                </td>
                <td className="px-5 py-4 text-gray-600">{c.fecha}</td>
                <td className="px-5 py-4 text-gray-600">{formatCOP(c.apertura)}</td>
                <td className="px-5 py-4 font-medium text-gray-800">{formatCOP(c.sistema)}</td>
                <td className="px-5 py-4 font-medium text-gray-800">{c.estado === 'ABIERTA' ? '---' : formatCOP(c.declarado)}</td>
                <td className="px-5 py-4">
                  {c.estado === 'ABIERTA' ? (
                     <span className="text-gray-400">---</span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className={`font-black ${c.diferencia === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCOP(Math.abs(c.diferencia))}
                      </span>
                      {c.diferencia !== 0 && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                    ${c.estado === "ABIERTA" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-gray-100 text-gray-700 border border-gray-200"}`}>
                    {c.estado}
                  </span>
                </td>
                <td className="px-5 py-4">
                   <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                     <Eye className="w-4 h-4"/>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
