"use client"

import React from 'react'
import { Printer, Eye, Lock, Unlock } from 'lucide-react'

export default function CierresCaja() {
  const mockClosures = [
    { id: 'C-045', dateOpen: '2026-04-23 08:00', dateClose: '---', initial: '$ 100.000', sales: '$ 450.000', status: 'Abierta' },
    { id: 'C-044', dateOpen: '2026-04-22 08:00', dateClose: '2026-04-22 22:00', initial: '$ 100.000', sales: '$ 1.250.000', status: 'Cerrada' },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Caja</th>
            <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Apertura</th>
            <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Cierre</th>
            <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Inicial</th>
            <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Ventas</th>
            <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Estado</th>
            <th className="p-3 text-[11px] font-bold text-gray-400 uppercase text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mockClosures.map((c) => (
            <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="p-3 text-sm font-bold text-gray-700">{c.id}</td>
              <td className="p-3 text-xs text-gray-500">{c.dateOpen}</td>
              <td className="p-3 text-xs text-gray-500">{c.dateClose}</td>
              <td className="p-3 text-sm text-gray-600">{c.initial}</td>
              <td className="p-3 text-sm font-bold text-gray-800">{c.sales}</td>
              <td className="p-3">
                <div className="flex items-center gap-1.5">
                  {c.status === 'Abierta' ? (
                    <Unlock className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                  )}
                  <span className={`text-[10px] font-bold ${c.status === 'Abierta' ? 'text-green-600' : 'text-gray-500'}`}>
                    {c.status.toUpperCase()}
                  </span>
                </div>
              </td>
              <td className="p-3 flex justify-center gap-2">
                <button title="Ver detalle" className="p-1.5 border border-gray-100 rounded bg-white text-gray-400 hover:text-blue-500 hover:border-blue-200 transition-all">
                  <Eye className="w-4 h-4" />
                </button>
                <button title="Imprimir tira" className="p-1.5 border border-gray-100 rounded bg-white text-gray-400 hover:text-gray-600 hover:border-gray-200 transition-all">
                  <Printer className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
