"use client"

import { Store, Package, ShoppingBag, Eye, CheckCircle, Clock } from "lucide-react"

interface TiendaProps { subMenu: string }

const mockPedidos = [
  { id: "PED-001", cliente: "Laura Fernández", productos: 3, total: 95000, estado: "Nuevo", fecha: "2026-04-14 10:23" },
  { id: "PED-002", cliente: "Sergio Moreno", productos: 1, total: 18000, estado: "En Preparación", fecha: "2026-04-14 09:45" },
  { id: "PED-003", cliente: "Valentina Cruz", productos: 5, total: 220000, estado: "Listo", fecha: "2026-04-14 08:12" },
  { id: "PED-004", cliente: "Andrés Pérez", productos: 2, total: 65000, estado: "Entregado", fecha: "2026-04-13 18:30" },
]

const formatCOP = (v: number) => "$ " + v.toLocaleString("es-CO")

function PedidosOnline() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800">Pedidos Online</h2>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Nuevos", value: "1", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "En Preparación", value: "1", color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Listos", value: "1", color: "text-green-600", bg: "bg-green-50" },
          { label: "Entregados hoy", value: "1", color: "text-gray-600", bg: "bg-gray-50" },
        ].map(s => (
          <div key={s.label} className={`rounded-lg p-3 ${s.bg}`}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["# Pedido", "Cliente", "Productos", "Total", "Estado", "Fecha", "Acciones"].map(h =>
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600">{h}</th>
            )}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockPedidos.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-green-600">{p.id}</td>
                <td className="px-4 py-3 text-gray-700">{p.cliente}</td>
                <td className="px-4 py-3 text-center text-gray-600">{p.productos}</td>
                <td className="px-4 py-3 font-semibold">{formatCOP(p.total)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${p.estado === "Nuevo" ? "bg-blue-100 text-blue-700" :
                      p.estado === "En Preparación" ? "bg-yellow-100 text-yellow-700" :
                        p.estado === "Listo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.estado}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{p.fecha}</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ConfigTienda() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-base font-bold text-gray-800 mb-5">Configurar Tienda Online</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        {[
          { label: "Nombre de la tienda", value: "Milan Store", type: "text" },
          { label: "Descripción", value: "Tu tienda de confianza", type: "text" },
          { label: "Dirección", value: "Medellín, Colombia", type: "text" },
          { label: "Teléfono de contacto", value: "604-123-4567", type: "text" },
          { label: "Email de contacto", value: "tienda@milan.com", type: "email" },
          { label: "WhatsApp", value: "+57 300 123 4567", type: "text" },
        ].map(f => (
          <div key={f.label} className="flex items-center gap-4">
            <label className="w-48 text-sm text-gray-600 flex-shrink-0">{f.label}:</label>
            <input defaultValue={f.value} type={f.type}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
        ))}
        <div className="flex items-center gap-4 pt-2">
          <label className="w-48 text-sm text-gray-600">Estado tienda:</label>
          <div className="flex items-center gap-2">
            <div className="w-10 h-5 bg-green-500 rounded-full flex items-center px-0.5 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full ml-auto" />
            </div>
            <span className="text-sm text-green-600 font-medium">Activa</span>
          </div>
        </div>
        <button className="px-6 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: "#4CAF50" }}>
          Guardar Configuración
        </button>
      </div>
    </div>
  )
}

export default function Tienda({ subMenu }: TiendaProps) {
  switch (subMenu) {
    case "Pedidos Online": return <PedidosOnline />
    case "Configurar Tienda": return <ConfigTienda />
    default: return <PedidosOnline />
  }
}
