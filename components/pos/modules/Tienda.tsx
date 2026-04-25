"use client"

import { Store, Package, ShoppingBag, Eye, CheckCircle, Clock, Search, ExternalLink, Settings, Smartphone, Globe, MapPin } from "lucide-react"

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Nuevos", value: "1", color: "text-blue-600", bg: "bg-blue-50", icon: Clock },
          { label: "En Preparación", value: "1", color: "text-amber-600", bg: "bg-amber-50", icon: ShoppingBag },
          { label: "Listos", value: "1", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle },
          { label: "Entregados hoy", value: "12", color: "text-slate-600", bg: "bg-slate-100", icon: ExternalLink },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 border border-slate-100 shadow-sm bg-white`}>
            <div className="flex items-center justify-between mb-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
               <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className={`text-2xl font-black text-slate-800`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
           <div className="flex items-center gap-3 px-3 py-1.5 bg-white rounded-xl border border-slate-200 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Buscar pedido por ID o cliente..." className="bg-transparent text-xs font-bold focus:outline-none w-full" />
           </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400">
               <th className="px-6 py-4">ID Pedido</th>
               <th className="px-6 py-4">Cliente</th>
               <th className="px-6 py-4 text-center">Items</th>
               <th className="px-6 py-4">Total</th>
               <th className="px-6 py-4 text-center">Estado</th>
               <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockPedidos.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-black text-emerald-600 text-sm">{p.id}</td>
                <td className="px-6 py-4">
                   <p className="text-sm font-bold text-slate-800">{p.cliente}</p>
                   <p className="text-[10px] text-slate-400 font-medium">{p.fecha}</p>
                </td>
                <td className="px-6 py-4 text-center text-sm font-bold text-slate-600">{p.productos}</td>
                <td className="px-6 py-4 font-black text-slate-800">{formatCOP(p.total)}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider
                    ${p.estado === "Nuevo" ? "bg-blue-100 text-blue-700" :
                      p.estado === "En Preparación" ? "bg-amber-100 text-amber-700" :
                        p.estado === "Listo" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {p.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><Eye className="w-4 h-4" /></button>
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
               <Settings className="w-5 h-5"/>
            </div>
            <div>
               <h3 className="text-lg font-black text-slate-800">Parámetros de la Tienda Online</h3>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Control de visibilidad y contacto</p>
            </div>
         </div>
         <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Nombre Comercial", value: "Milan Store", type: "text", icon: Store },
              { label: "Descripción SEO", value: "Tu tienda de confianza", type: "text", icon: Globe },
              { label: "Dirección Física", value: "Medellín, Colombia", type: "text", icon: MapPin },
              { label: "WhatsApp Negocio", value: "+57 300 123 4567", type: "text", icon: Smartphone },
              { label: "Email Ventas", value: "tienda@milan.com", type: "email", icon: Globe },
            ].map(f => (
              <div key={f.label} className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                   <f.icon className="w-3 h-3"/> {f.label}
                </label>
                <input defaultValue={f.value} type={f.type}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
              </div>
            ))}
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mt-2">
              <div>
                 <p className="text-sm font-black text-emerald-800">Estado de la Tienda</p>
                 <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Visible al público actualmente</p>
              </div>
              <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1 cursor-pointer">
                 <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
              </div>
            </div>
         </div>
         <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-black shadow-lg hover:bg-black transition-all">
               Guardar Cambios en la Nube
            </button>
         </div>
      </div>
    </div>
  )
}

export default function Tienda({ subMenu }: TiendaProps) {
  const renderContent = () => {
    switch (subMenu) {
      case "Pedidos Online": return <PedidosOnline />
      case "Configurar Tienda": return <ConfigTienda />
      default: return <PedidosOnline />
    }
  }

  return (
    <div className="bg-slate-50 w-full h-[calc(100vh-120px)] overflow-y-auto p-2 sm:p-6 rounded-tl-2xl shadow-inner border-l border-slate-200">
       <div className="w-full h-full max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h2 className="text-2xl font-black text-slate-800">E-Commerce Milan</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Sincronización en tiempo real entre local físico y tienda web.</p>
            </div>
          </div>
          {renderContent()}
       </div>
    </div>
  )
}

