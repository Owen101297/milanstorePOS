"use client"

import { useState } from "react"
import { Search, Plus, Calendar, Wallet, CheckCircle, FileText } from "lucide-react"

const mockCreditos = [
  { id: "CRE-0003", tipo: "PLAN_SEPARE", cliente: "Carlos Ruiz", fecha: "2026-04-14", total: 150000, saldo: 45000, vence: "2026-05-14", estado: "VIGENTE" },
  { id: "CRE-0002", tipo: "CREDITO", cliente: "Carmen Vega", fecha: "2026-04-08", total: 80000, saldo: 80000, vence: "2026-04-30", estado: "MORA" },
  { id: "CRE-0001", tipo: "PLAN_SEPARE", cliente: "Luis Mora", fecha: "2026-03-20", total: 200000, saldo: 0, vence: "2026-04-20", estado: "ENTREGADO" },
]

export default function Creditos() {
  const [search, setSearch] = useState("")

  const formatCOP = (v: number) => "$ " + v.toLocaleString("es-CO")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Créditos y Plan Separe</h2>
          <p className="text-sm text-gray-500">Gestión de cartera, apartados de mercancía y recibos de caja.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-bold">
          <Plus className="w-4 h-4" /> Nuevo Enganche
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Cartera Activa", value: formatCOP(125000), desc: "Saldo pdte. por cobrar", icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Planes Separe", value: "2", desc: "Mercancía bloqueada", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Finalizados", value: "1", desc: "Pagados este mes", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl ${s.bg}`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-black text-gray-900 mt-0.5`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
        </div>
        
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Obligación", "Cliente", "Fechas", "Progreso", "Saldo", "Estado", "Acciones"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockCreditos.filter(c => c.cliente.toLowerCase().includes(search.toLowerCase())).map(c => (
              <tr key={c.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-bold text-gray-800">{c.id}</div>
                  <div className="text-xs font-semibold text-gray-500">{c.tipo.replace('_', ' ')}</div>
                </td>
                <td className="px-5 py-4 font-medium text-gray-700">{c.cliente}</td>
                <td className="px-5 py-4 text-gray-500 text-xs gap-1 flex flex-col">
                   <span><strong className="text-gray-400 font-normal">Gen:</strong> {c.fecha}</span>
                   <span><strong className="text-gray-400 font-normal">Vence:</strong> <span className={c.estado === 'MORA' ? 'text-red-600 font-bold' : ''}>{c.vence}</span></span>
                </td>
                <td className="px-5 py-4">
                   <div className="w-24 bg-gray-200 rounded-full h-2">
                     <div className={`h-2 rounded-full ${c.saldo === 0 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${((c.total - c.saldo) / c.total) * 100}%` }}></div>
                   </div>
                   <div className="text-xs text-gray-400 mt-1">{formatCOP(c.total - c.saldo)} / {formatCOP(c.total)}</div>
                </td>
                <td className="px-5 py-4 font-black text-gray-900">{formatCOP(c.saldo)}</td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border
                    ${c.estado === "VIGENTE" ? "bg-blue-50 border-blue-200 text-blue-700" : 
                      c.estado === "ENTREGADO" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                    {c.estado}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition">Abonar</button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition"><FileText className="w-4 h-4"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
