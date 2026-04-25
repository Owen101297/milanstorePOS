"use client"

import React from 'react'
import { Calendar, Filter, Download, Search, MoreHorizontal } from 'lucide-react'

export default function HistoricoVentas() {
  const mockSales = [
    { id: 'V-001', date: '2026-04-23 10:30', client: 'Consumidor Final', total: '$ 45.000', status: 'Pagada' },
    { id: 'V-002', date: '2026-04-23 11:15', client: 'Juan Perez', total: '$ 120.000', status: 'Pagada' },
    { id: 'V-003', date: '2026-04-23 11:45', client: 'Consumidor Final', total: '$ 15.000', status: 'Anulada' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[300px]">
          <input 
            type="text" 
            placeholder="Buscar por factura, cliente o vendedor..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded text-sm text-gray-600 flex items-center gap-2 hover:bg-gray-50">
          <Calendar className="w-4 h-4" /> 23 Abr 2026
        </button>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded text-sm text-gray-600 flex items-center gap-2 hover:bg-gray-50">
          <Filter className="w-4 h-4" /> Filtros
        </button>
        <button className="px-4 py-2 bg-[#62cb31] text-white rounded text-sm font-bold flex items-center gap-2 hover:bg-[#55b02a] transition-colors ml-auto">
          <Download className="w-4 h-4" /> EXPORTAR
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">No. Factura</th>
              <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Fecha</th>
              <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Cliente</th>
              <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Total</th>
              <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Estado</th>
              <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mockSales.map((sale) => (
              <tr key={sale.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                <td className="p-3 text-sm font-bold text-[#3498db] cursor-pointer hover:underline">{sale.id}</td>
                <td className="p-3 text-xs text-gray-500">{sale.date}</td>
                <td className="p-3 text-sm text-gray-700">{sale.client}</td>
                <td className="p-3 text-sm font-bold text-gray-800">{sale.total}</td>
                <td className="p-3 text-[10px]">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${sale.status === 'Pagada' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {sale.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
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
