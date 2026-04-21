"use client"

import { useState } from "react"
import { Search, Plus, X, Phone, Mail, MapPin, CheckCircle, Users, Award, Star, Truck, ShoppingBag, TrendingUp, FileText, Edit2, Trash2, Eye } from "lucide-react"

interface ContactosProps { subMenu: string }
const formatCOP = (v: number) => "$ " + Math.round(v).toLocaleString("es-CO")

// ==========================================
// 1. CLIENTES (CRM Enterprise)
// ==========================================
function ClientesManager() {
  const [clientes, setClientes] = useState([
    { id: 1, name: "Ana Torres Restrepo", doc: "1010101010", email: "ana@email.com", phone: "320-234-5678", ciudad: "Medellín", direccion: "Cra 70 #45-20", compras: 22, total: 2100000, ultimaVisita: "2026-04-14", tier: "Platino" as const, notas: "Prefiere prendas de lino" },
    { id: 2, name: "María López García", doc: "2020202020", email: "maria@email.com", phone: "312-456-7890", ciudad: "Bogotá", direccion: "Calle 85 #15-30", compras: 15, total: 1250000, ultimaVisita: "2026-04-12", tier: "Oro" as const, notas: "" },
    { id: 3, name: "Juan García Pérez", doc: "3030303030", email: "juan@email.com", phone: "300-123-4567", ciudad: "Medellín", direccion: "Cra 43A #1-50", compras: 8, total: 680000, ultimaVisita: "2026-04-10", tier: "Plata" as const, notas: "Solicita factura electrónica" },
    { id: 4, name: "Pedro Díaz Herrera", doc: "4040404040", email: "pedro@email.com", phone: "310-345-6789", ciudad: "Barranquilla", direccion: "Calle 72 #54-11", compras: 7, total: 560000, ultimaVisita: "2026-04-05", tier: "Plata" as const, notas: "" },
    { id: 5, name: "Carlos Ruiz Moreno", doc: "5050505050", email: "carlos@email.com", phone: "315-789-0123", ciudad: "Cali", direccion: "Av 6N #25-30", compras: 4, total: 320000, ultimaVisita: "2026-03-28", tier: "Bronce" as const, notas: "" },
  ])
  const [search, setSearch] = useState("")
  const [seleccionado, setSeleccionado] = useState<typeof clientes[0] | null>(null)
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState("")
  const [form, setForm] = useState({ name: "", doc: "", email: "", phone: "", ciudad: "", direccion: "" })

  const TIERS: Record<string, { color: string, icon: string }> = {
    Bronce: { color: "bg-orange-100 text-orange-700 border-orange-200", icon: "🥉" },
    Plata: { color: "bg-slate-100 text-slate-600 border-slate-200", icon: "🥈" },
    Oro: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: "🥇" },
    Platino: { color: "bg-violet-100 text-violet-700 border-violet-200", icon: "💎" },
  }

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000) }
  const filtered = clientes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.doc.includes(search) || c.phone.includes(search))
  const totalVentas = clientes.reduce((a, c) => a + c.total, 0)

  const handleCrear = () => {
    if (!form.name || !form.doc) return alert("Nombre y documento son obligatorios")
    setClientes([{ id: Date.now(), ...form, compras: 0, total: 0, ultimaVisita: "—", tier: "Bronce" as const, notas: "" }, ...clientes])
    setModal(false); setForm({ name: "", doc: "", email: "", phone: "", ciudad: "", direccion: "" })
    showToast("Cliente registrado exitosamente")
  }

  return (
    <div className="animate-in fade-in duration-500 flex flex-col lg:flex-row gap-6 h-full pb-6">
       <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${seleccionado ? 'lg:w-2/3' : 'w-full'}`}>
          <div className="flex justify-between items-end mb-6">
             <div><h2 className="text-2xl font-black text-slate-800">Clientes</h2><p className="text-sm text-slate-500 font-medium mt-1">CRM de clientes con historial de compras y niveles de lealtad.</p></div>
             <button onClick={() => setModal(true)} className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"><Plus className="w-5 h-5"/> Nuevo Cliente</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Clientes</p><p className="text-2xl font-black text-slate-800 mt-1">{clientes.length}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ventas Clientes</p><p className="text-2xl font-black text-emerald-600 mt-1">{formatCOP(totalVentas)}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket Promedio</p><p className="text-2xl font-black text-blue-600 mt-1">{formatCOP(Math.round(totalVentas / Math.max(1, clientes.reduce((a, c) => a + c.compras, 0))))}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VIP (Oro+)</p><p className="text-2xl font-black text-amber-600 mt-1">{clientes.filter(c => c.tier === "Oro" || c.tier === "Platino").length}</p></div>
          </div>
          <div className="relative mb-4 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/><input type="text" placeholder="Buscar por nombre, doc. o teléfono..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"/></div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] uppercase font-black tracking-widest text-slate-400"><th className="p-4">Cliente</th><th className="p-4">Documento</th><th className="p-4">Teléfono</th><th className="p-4">Ciudad</th><th className="p-4">Tier</th><th className="p-4 text-center">Compras</th><th className="p-4 text-right">Total Gastado</th></tr></thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                   {filtered.sort((a, b) => b.total - a.total).map(c => (
                      <tr key={c.id} onClick={() => setSeleccionado(c)} className={`cursor-pointer transition-colors ${seleccionado?.id === c.id ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}>
                         <td className="p-4"><p className="font-bold text-slate-800">{c.name}</p><p className="text-[11px] text-slate-400">{c.email}</p></td>
                         <td className="p-4 font-mono text-xs text-slate-500">{c.doc}</td>
                         <td className="p-4 text-slate-600 text-xs">{c.phone}</td>
                         <td className="p-4 text-slate-600">{c.ciudad}</td>
                         <td className="p-4"><span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded border ${TIERS[c.tier].color}`}>{TIERS[c.tier].icon} {c.tier}</span></td>
                         <td className="p-4 text-center font-bold text-slate-700">{c.compras}</td>
                         <td className="p-4 text-right font-black text-emerald-600">{formatCOP(c.total)}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

       {/* DRAWER FICHA CLIENTE */}
       {seleccionado && (
          <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col h-[calc(100vh-160px)] sticky top-0 animate-in fade-in slide-in-from-right-8">
             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl"><h3 className="font-black text-slate-800 text-sm">Ficha del Cliente</h3><button onClick={() => setSeleccionado(null)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-full"><X className="w-4 h-4"/></button></div>
             <div className="p-5 flex-1 overflow-y-auto space-y-5">
                <div className="text-center">
                   <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-black">{seleccionado.name.charAt(0)}</div>
                   <h4 className="font-black text-slate-800 text-lg">{seleccionado.name}</h4>
                   <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase rounded-md border mt-2 ${TIERS[seleccionado.tier].color}`}>{TIERS[seleccionado.tier].icon} {seleccionado.tier}</span>
                </div>
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white text-center">
                   <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Total Comprado</p>
                   <p className="text-3xl font-black mt-1">{formatCOP(seleccionado.total)}</p>
                   <p className="text-xs opacity-60 mt-1">{seleccionado.compras} compras realizadas</p>
                </div>
                <div className="space-y-2">
                   {[
                      { icon: <FileText className="w-3.5 h-3.5"/>, label: "Documento", value: seleccionado.doc },
                      { icon: <Phone className="w-3.5 h-3.5"/>, label: "Teléfono", value: seleccionado.phone },
                      { icon: <Mail className="w-3.5 h-3.5"/>, label: "Email", value: seleccionado.email },
                      { icon: <MapPin className="w-3.5 h-3.5"/>, label: "Ciudad", value: seleccionado.ciudad },
                      { icon: <MapPin className="w-3.5 h-3.5"/>, label: "Dirección", value: seleccionado.direccion },
                      { icon: <Star className="w-3.5 h-3.5"/>, label: "Última visita", value: seleccionado.ultimaVisita },
                   ].map(item => (
                      <div key={item.label} className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg">
                         <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">{item.icon} {item.label}</span>
                         <span className="text-xs font-black text-slate-700">{item.value || "—"}</span>
                      </div>
                   ))}
                </div>
                {seleccionado.notas && (
                   <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                      <p className="text-[10px] font-black text-amber-600 uppercase mb-1">Notas</p>
                      <p className="text-xs text-amber-800">{seleccionado.notas}</p>
                   </div>
                )}
             </div>
          </div>
       )}

       {/* MODAL CREAR CLIENTE */}
       {modal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-6 bg-emerald-500 text-white text-center"><div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"><Users className="w-7 h-7"/></div><h3 className="text-xl font-black">Nuevo Cliente</h3></div>
                <div className="p-6 space-y-4">
                   <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nombre Completo *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ej. Juan García Pérez" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"/></div>
                   <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Documento (CC) *</label><input type="text" value={form.doc} onChange={e => setForm({...form, doc: e.target.value})} placeholder="1010101010" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/></div>
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Teléfono</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="300-000-0000" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/></div>
                   </div>
                   <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="correo@mail.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"/></div>
                   <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Ciudad</label><input type="text" value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})} placeholder="Medellín" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/></div>
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Dirección</label><input type="text" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} placeholder="Cra 70 #45-20" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/></div>
                   </div>
                   <div className="flex gap-3 pt-4 border-t border-slate-100"><button onClick={() => setModal(false)} className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button><button onClick={handleCrear} className="flex-[2] py-3 font-black text-white bg-slate-900 hover:bg-black rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"><CheckCircle className="w-5 h-5"/> Registrar</button></div>
                </div>
             </div>
          </div>
       )}
       {toast && <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-[100] animate-in slide-in-from-bottom-8"><CheckCircle className="w-6 h-6 text-emerald-400"/>{toast}</div>}
    </div>
  )
}

// ==========================================
// 2. VENDEDORES
// ==========================================
function VendedoresManager() {
  const [vendedores, setVendedores] = useState([
    { id: 1, name: "Esteban Villa", doc: "1111111111", email: "esteban@milan.com", phone: "311-555-6666", sede: "Sede Principal", ventasMes: 52, comisionMes: 520000, totalVentas: 15600000, meta: 20000000, estado: "Activo" as const },
    { id: 2, name: "Camilo Rodríguez", doc: "2222222222", email: "camilo@milan.com", phone: "315-111-2222", sede: "Sede Principal", ventasMes: 45, comisionMes: 450000, totalVentas: 12500000, meta: 15000000, estado: "Activo" as const },
    { id: 3, name: "Daniela Mora", doc: "3333333333", email: "daniela@milan.com", phone: "314-333-4444", sede: "Sucursal Norte", ventasMes: 38, comisionMes: 380000, totalVentas: 9800000, meta: 12000000, estado: "Activo" as const },
    { id: 4, name: "Valentina Ríos", doc: "4444444444", email: "valentina@milan.com", phone: "320-777-8888", sede: "Sucursal Norte", ventasMes: 0, comisionMes: 0, totalVentas: 5200000, meta: 10000000, estado: "Inactivo" as const },
  ])
  const [search, setSearch] = useState("")
  const [seleccionado, setSeleccionado] = useState<typeof vendedores[0] | null>(null)
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState("")

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000) }
  const filtered = vendedores.filter(v => v.name.toLowerCase().includes(search.toLowerCase()))
  const totalComisiones = vendedores.reduce((a, v) => a + v.comisionMes, 0)

  return (
    <div className="animate-in fade-in duration-500 flex flex-col lg:flex-row gap-6 h-full pb-6">
       <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${seleccionado ? 'lg:w-2/3' : 'w-full'}`}>
          <div className="flex justify-between items-end mb-6">
             <div><h2 className="text-2xl font-black text-slate-800">Vendedores</h2><p className="text-sm text-slate-500 font-medium mt-1">Equipo comercial, rendimiento y comisiones.</p></div>
             <button onClick={() => setModal(true)} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"><Plus className="w-5 h-5"/> Nuevo Vendedor</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Equipo Activo</p><p className="text-2xl font-black text-slate-800 mt-1">{vendedores.filter(v => v.estado === "Activo").length}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ventas del Mes</p><p className="text-2xl font-black text-emerald-600 mt-1">{vendedores.reduce((a, v) => a + v.ventasMes, 0)}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comisiones Mes</p><p className="text-2xl font-black text-amber-600 mt-1">{formatCOP(totalComisiones)}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mejor Vendedor</p><p className="text-lg font-black text-blue-600 mt-1">🏆 {vendedores.sort((a, b) => b.ventasMes - a.ventasMes)[0]?.name.split(' ')[0]}</p></div>
          </div>
          <div className="relative mb-4 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/><input type="text" placeholder="Buscar vendedor..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/></div>
          <div className="space-y-3 flex-1 overflow-y-auto">
             {filtered.sort((a, b) => b.ventasMes - a.ventasMes).map((v, i) => (
                <div key={v.id} onClick={() => setSeleccionado(v)} className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${seleccionado?.id === v.id ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-100 shadow-sm'}`}>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{i === 0 ? '🏆' : i + 1}</div>
                         <div>
                            <h3 className="font-black text-slate-800">{v.name}</h3>
                            <p className="text-xs text-slate-400">{v.sede} · <span className={`font-bold ${v.estado === 'Activo' ? 'text-emerald-500' : 'text-red-400'}`}>{v.estado}</span></p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xl font-black text-blue-600">{v.ventasMes} <span className="text-xs font-bold text-slate-400">ventas</span></p>
                         <p className="text-xs font-bold text-amber-600">{formatCOP(v.comisionMes)} comisión</p>
                      </div>
                   </div>
                   {/* Barra de meta */}
                   <div className="mt-3">
                      <div className="flex justify-between text-[10px] mb-1"><span className="font-bold text-slate-400">Meta mensual</span><span className="font-black text-slate-600">{Math.round((v.totalVentas / v.meta) * 100)}%</span></div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-700 ${(v.totalVentas / v.meta) >= 1 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, (v.totalVentas / v.meta) * 100)}%` }}></div></div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* DRAWER FICHA VENDEDOR */}
       {seleccionado && (
          <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col h-[calc(100vh-160px)] sticky top-0 animate-in fade-in slide-in-from-right-8">
             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl"><h3 className="font-black text-slate-800 text-sm">Ficha del Vendedor</h3><button onClick={() => setSeleccionado(null)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-full"><X className="w-4 h-4"/></button></div>
             <div className="p-5 flex-1 overflow-y-auto space-y-5">
                <div className="text-center">
                   <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-black">{seleccionado.name.charAt(0)}</div>
                   <h4 className="font-black text-slate-800 text-lg">{seleccionado.name}</h4>
                   <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-black uppercase rounded ${seleccionado.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{seleccionado.estado}</span>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white text-center">
                   <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Ventas del Mes</p>
                   <p className="text-4xl font-black mt-1">{seleccionado.ventasMes}</p>
                   <p className="text-xs opacity-60 mt-1">Comisión: {formatCOP(seleccionado.comisionMes)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center"><p className="text-[9px] font-black text-slate-400 uppercase">Total Vendido</p><p className="text-sm font-black text-slate-800">{formatCOP(seleccionado.totalVentas)}</p></div>
                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center"><p className="text-[9px] font-black text-slate-400 uppercase">Meta</p><p className="text-sm font-black text-slate-800">{formatCOP(seleccionado.meta)}</p></div>
                </div>
                <div className="space-y-2">
                   {[["Sede", seleccionado.sede], ["Doc.", seleccionado.doc], ["Tel.", seleccionado.phone], ["Email", seleccionado.email]].map(([l, v]) => (
                      <div key={l} className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg"><span className="text-[10px] font-bold text-slate-400">{l}</span><span className="text-xs font-black text-slate-700">{v}</span></div>
                   ))}
                </div>
             </div>
          </div>
       )}

       {modal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-6 bg-blue-600 text-white text-center"><div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"><Users className="w-7 h-7"/></div><h3 className="text-xl font-black">Nuevo Vendedor</h3></div>
                <div className="p-6 text-center py-12 text-slate-400"><p className="font-bold">Formulario conectado al módulo de Nómina.</p><p className="text-sm mt-2">Completa los datos del empleado-vendedor.</p></div>
                <div className="p-5 border-t border-slate-100"><button onClick={() => setModal(false)} className="w-full py-3 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cerrar</button></div>
             </div>
          </div>
       )}
       {toast && <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-[100] animate-in slide-in-from-bottom-8"><CheckCircle className="w-6 h-6 text-emerald-400"/>{toast}</div>}
    </div>
  )
}

// ==========================================
// 3. PROVEEDORES
// ==========================================
function ProveedoresManager() {
  const [proveedores, setProveedores] = useState([
    { id: 1, name: "Makro Mayorista S.A.", nit: "800.123.456-7", contacto: "Laura Jiménez", email: "laura@makro.com", phone: "604-700-8000", ciudad: "Medellín", categoria: "Textiles", ordenesActivas: 2, totalCompras: 12500000, estado: "Activo" as const, diasCredito: 30 },
    { id: 2, name: "Distribuidora Norte Ltda", nit: "900.456.789-0", contacto: "Carlos Mejía", email: "carlos@dinorte.com", phone: "601-234-5678", ciudad: "Bogotá", categoria: "Confección", ordenesActivas: 1, totalCompras: 8900000, estado: "Activo" as const, diasCredito: 45 },
    { id: 3, name: "Fábrica Nacional SAS", nit: "811.000.913-0", contacto: "Andrés Pardo", email: "apardo@fabnacional.com", phone: "604-600-7000", ciudad: "Medellín", categoria: "Materia Prima", ordenesActivas: 0, totalCompras: 4200000, estado: "Activo" as const, diasCredito: 15 },
    { id: 4, name: "Importadora Moda Global", nit: "901.234.567-8", contacto: "Sofía Henao", email: "info@modaglobal.com", phone: "602-890-1234", ciudad: "Cali", categoria: "Importados", ordenesActivas: 0, totalCompras: 2100000, estado: "Inactivo" as const, diasCredito: 60 },
  ])
  const [search, setSearch] = useState("")
  const [seleccionado, setSeleccionado] = useState<typeof proveedores[0] | null>(null)
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState("")
  const [form, setForm] = useState({ name: "", nit: "", contacto: "", email: "", phone: "", ciudad: "", categoria: "Textiles", diasCredito: "30" })

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000) }
  const filtered = proveedores.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.nit.includes(search))

  const handleCrear = () => {
    if (!form.name || !form.nit) return alert("Nombre y NIT son obligatorios")
    setProveedores([{ id: Date.now(), ...form, diasCredito: Number(form.diasCredito), ordenesActivas: 0, totalCompras: 0, estado: "Activo" as const }, ...proveedores])
    setModal(false); setForm({ name: "", nit: "", contacto: "", email: "", phone: "", ciudad: "", categoria: "Textiles", diasCredito: "30" })
    showToast("Proveedor registrado exitosamente")
  }

  return (
    <div className="animate-in fade-in duration-500 flex flex-col lg:flex-row gap-6 h-full pb-6">
       <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${seleccionado ? 'lg:w-2/3' : 'w-full'}`}>
          <div className="flex justify-between items-end mb-6">
             <div><h2 className="text-2xl font-black text-slate-800">Proveedores</h2><p className="text-sm text-slate-500 font-medium mt-1">Directorio de proveedores con historial de compras y crédito.</p></div>
             <button onClick={() => setModal(true)} className="bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-600/30 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"><Plus className="w-5 h-5"/> Nuevo Proveedor</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proveedores</p><p className="text-2xl font-black text-slate-800 mt-1">{proveedores.length}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activos</p><p className="text-2xl font-black text-emerald-600 mt-1">{proveedores.filter(p => p.estado === "Activo").length}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Comprado</p><p className="text-2xl font-black text-blue-600 mt-1">{formatCOP(proveedores.reduce((a, p) => a + p.totalCompras, 0))}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Órdenes Activas</p><p className="text-2xl font-black text-amber-600 mt-1">{proveedores.reduce((a, p) => a + p.ordenesActivas, 0)}</p></div>
          </div>
          <div className="relative mb-4 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/><input type="text" placeholder="Buscar por nombre o NIT..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"/></div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] uppercase font-black tracking-widest text-slate-400"><th className="p-4">Proveedor</th><th className="p-4">NIT</th><th className="p-4">Contacto</th><th className="p-4">Categoría</th><th className="p-4 text-center">Crédito</th><th className="p-4 text-right">Total Compras</th><th className="p-4 text-center">Estado</th></tr></thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                   {filtered.map(p => (
                      <tr key={p.id} onClick={() => setSeleccionado(p)} className={`cursor-pointer transition-colors ${seleccionado?.id === p.id ? 'bg-violet-50' : 'hover:bg-slate-50'}`}>
                         <td className="p-4"><p className="font-bold text-slate-800">{p.name}</p><p className="text-[11px] text-slate-400">{p.ciudad}</p></td>
                         <td className="p-4 font-mono text-xs text-slate-500">{p.nit}</td>
                         <td className="p-4 text-slate-600 text-xs">{p.contacto}</td>
                         <td className="p-4"><span className="px-2 py-0.5 bg-violet-50 text-violet-700 rounded text-[10px] font-bold border border-violet-100">{p.categoria}</span></td>
                         <td className="p-4 text-center text-slate-600 font-bold">{p.diasCredito}d</td>
                         <td className="p-4 text-right font-black text-slate-800">{formatCOP(p.totalCompras)}</td>
                         <td className="p-4 text-center"><span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${p.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{p.estado}</span></td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

       {seleccionado && (
          <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col h-[calc(100vh-160px)] sticky top-0 animate-in fade-in slide-in-from-right-8">
             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl"><h3 className="font-black text-slate-800 text-sm">Ficha Proveedor</h3><button onClick={() => setSeleccionado(null)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-full"><X className="w-4 h-4"/></button></div>
             <div className="p-5 flex-1 overflow-y-auto space-y-5">
                <div className="text-center">
                   <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-black">{seleccionado.name.charAt(0)}</div>
                   <h4 className="font-black text-slate-800 text-base leading-tight">{seleccionado.name}</h4>
                   <p className="text-xs text-slate-400 font-mono mt-1">{seleccionado.nit}</p>
                </div>
                <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-white text-center">
                   <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Total Comprado</p>
                   <p className="text-3xl font-black mt-1">{formatCOP(seleccionado.totalCompras)}</p>
                   <p className="text-xs opacity-60 mt-1">{seleccionado.ordenesActivas} órdenes activas</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center"><p className="text-[9px] font-black text-slate-400 uppercase">Crédito</p><p className="text-sm font-black text-slate-800">{seleccionado.diasCredito} días</p></div>
                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center"><p className="text-[9px] font-black text-slate-400 uppercase">Categoría</p><p className="text-sm font-black text-slate-800">{seleccionado.categoria}</p></div>
                </div>
                <div className="space-y-2">
                   {[["Contacto", seleccionado.contacto], ["Tel.", seleccionado.phone], ["Email", seleccionado.email], ["Ciudad", seleccionado.ciudad]].map(([l, v]) => (
                      <div key={l} className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg"><span className="text-[10px] font-bold text-slate-400">{l}</span><span className="text-xs font-black text-slate-700">{v}</span></div>
                   ))}
                </div>
             </div>
          </div>
       )}

       {modal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
                <div className="p-6 bg-violet-600 text-white text-center flex-shrink-0"><div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"><ShoppingBag className="w-7 h-7"/></div><h3 className="text-xl font-black">Nuevo Proveedor</h3></div>
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                   <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Razón Social *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nombre de la empresa" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"/></div>
                   <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">NIT *</label><input type="text" value={form.nit} onChange={e => setForm({...form, nit: e.target.value})} placeholder="900.000.000-0" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"/></div>
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Contacto</label><input type="text" value={form.contacto} onChange={e => setForm({...form, contacto: e.target.value})} placeholder="Nombre" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"/></div>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"/></div>
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Teléfono</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"/></div>
                   </div>
                   <div className="grid grid-cols-3 gap-3">
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Ciudad</label><input type="text" value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"/></div>
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Categoría</label><select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"><option>Textiles</option><option>Confección</option><option>Materia Prima</option><option>Importados</option><option>Otros</option></select></div>
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Crédito (días)</label><input type="number" value={form.diasCredito} onChange={e => setForm({...form, diasCredito: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-center focus:outline-none focus:ring-2 focus:ring-violet-500"/></div>
                   </div>
                   <div className="flex gap-3 pt-4 border-t border-slate-100"><button onClick={() => setModal(false)} className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button><button onClick={handleCrear} className="flex-[2] py-3 font-black text-white bg-slate-900 hover:bg-black rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"><CheckCircle className="w-5 h-5"/> Registrar</button></div>
                </div>
             </div>
          </div>
       )}
       {toast && <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-[100] animate-in slide-in-from-bottom-8"><CheckCircle className="w-6 h-6 text-emerald-400"/>{toast}</div>}
    </div>
  )
}

// ==========================================
// 4. DOMICILIARIOS
// ==========================================
function DomiciliariosManager() {
  const [domiciliarios, setDomiciliarios] = useState([
    { id: 1, name: "Santiago Muñoz", doc: "1111000011", phone: "300-111-2233", vehiculo: "Moto", placa: "FGH-12C", zona: "Zona Sur", entregas: 145, calificacion: 4.8, estado: "Disponible" as const },
    { id: 2, name: "Jhon Castaño", doc: "2222000022", phone: "315-444-5566", vehiculo: "Moto", placa: "ABC-34D", zona: "Zona Norte", entregas: 98, calificacion: 4.5, estado: "En ruta" as const },
    { id: 3, name: "Miguel Ángel Ríos", doc: "3333000033", phone: "320-777-8899", vehiculo: "Bicicleta", placa: "N/A", zona: "Centro", entregas: 67, calificacion: 4.9, estado: "Disponible" as const },
    { id: 4, name: "David López", doc: "4444000044", phone: "311-222-3344", vehiculo: "Moto", placa: "XYZ-56E", zona: "Zona Oeste", entregas: 210, calificacion: 4.3, estado: "Inactivo" as const },
  ])
  const [seleccionado, setSeleccionado] = useState<typeof domiciliarios[0] | null>(null)
  const [toast, setToast] = useState("")
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000) }

  const STATUS_COLORS: Record<string, string> = { "Disponible": "bg-emerald-100 text-emerald-700", "En ruta": "bg-blue-100 text-blue-700", "Inactivo": "bg-red-100 text-red-600" }
  const totalEntregas = domiciliarios.reduce((a, d) => a + d.entregas, 0)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}/>
    ))
  }

  return (
    <div className="animate-in fade-in duration-500 flex flex-col lg:flex-row gap-6 h-full pb-6">
       <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${seleccionado ? 'lg:w-2/3' : 'w-full'}`}>
          <div className="flex justify-between items-end mb-6">
             <div><h2 className="text-2xl font-black text-slate-800">Domiciliarios</h2><p className="text-sm text-slate-500 font-medium mt-1">Flota de mensajeros con tracking de rendimiento y calificación.</p></div>
             <button className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"><Plus className="w-5 h-5"/> Nuevo Domiciliario</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flota Total</p><p className="text-2xl font-black text-slate-800 mt-1">{domiciliarios.length}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disponibles</p><p className="text-2xl font-black text-emerald-600 mt-1">{domiciliarios.filter(d => d.estado === "Disponible").length}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Entregas</p><p className="text-2xl font-black text-blue-600 mt-1">{totalEntregas}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating Promedio</p><p className="text-2xl font-black text-amber-600 mt-1">⭐ {(domiciliarios.reduce((a, d) => a + d.calificacion, 0) / domiciliarios.length).toFixed(1)}</p></div>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto">
             {domiciliarios.map(d => (
                <div key={d.id} onClick={() => setSeleccionado(d)} className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${seleccionado?.id === d.id ? 'border-orange-500 ring-4 ring-orange-500/10' : 'border-slate-100 shadow-sm'}`}>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${d.vehiculo === 'Moto' ? 'bg-orange-100' : 'bg-emerald-100'}`}>{d.vehiculo === 'Moto' ? '🏍️' : '🚴'}</div>
                         <div>
                            <h3 className="font-black text-slate-800">{d.name}</h3>
                            <p className="text-xs text-slate-400">{d.zona} · {d.vehiculo} {d.placa !== 'N/A' && <span className="font-mono ml-1 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] border border-slate-200">{d.placa}</span>}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${STATUS_COLORS[d.estado]}`}>{d.estado}</span>
                         <div className="flex items-center gap-0.5 mt-2 justify-end">{renderStars(d.calificacion)}</div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                      <span className="text-xs text-slate-400"><span className="font-black text-slate-700">{d.entregas}</span> entregas realizadas</span>
                      <span className="text-xs font-bold text-amber-600">{d.calificacion} / 5.0</span>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {seleccionado && (
          <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col h-[calc(100vh-160px)] sticky top-0 animate-in fade-in slide-in-from-right-8">
             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl"><h3 className="font-black text-slate-800 text-sm">Ficha Domiciliario</h3><button onClick={() => setSeleccionado(null)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-full"><X className="w-4 h-4"/></button></div>
             <div className="p-5 flex-1 overflow-y-auto space-y-5">
                <div className="text-center">
                   <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">{seleccionado.vehiculo === 'Moto' ? '🏍️' : '🚴'}</div>
                   <h4 className="font-black text-slate-800 text-lg">{seleccionado.name}</h4>
                   <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-black uppercase rounded ${STATUS_COLORS[seleccionado.estado]}`}>{seleccionado.estado}</span>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white text-center">
                   <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Entregas Totales</p>
                   <p className="text-4xl font-black mt-1">{seleccionado.entregas}</p>
                   <div className="flex items-center justify-center gap-0.5 mt-2">{renderStars(seleccionado.calificacion)} <span className="ml-1.5 text-xs opacity-70">{seleccionado.calificacion}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center"><p className="text-[9px] font-black text-slate-400 uppercase">Vehículo</p><p className="text-sm font-black text-slate-800">{seleccionado.vehiculo}</p></div>
                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center"><p className="text-[9px] font-black text-slate-400 uppercase">Placa</p><p className="text-sm font-black text-slate-800">{seleccionado.placa}</p></div>
                </div>
                <div className="space-y-2">
                   {[["Doc.", seleccionado.doc], ["Tel.", seleccionado.phone], ["Zona", seleccionado.zona]].map(([l, v]) => (
                      <div key={l} className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg"><span className="text-[10px] font-bold text-slate-400">{l}</span><span className="text-xs font-black text-slate-700">{v}</span></div>
                   ))}
                </div>
             </div>
             {seleccionado.estado !== "Inactivo" && (
                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl">
                   <button onClick={() => { setDomiciliarios(domiciliarios.map(d => d.id === seleccionado.id ? {...d, estado: d.estado === "Disponible" ? "En ruta" as const : "Disponible" as const} : d)); setSeleccionado({...seleccionado, estado: seleccionado.estado === "Disponible" ? "En ruta" as const : "Disponible" as const}); showToast("Estado actualizado") }}
                      className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${seleccionado.estado === 'Disponible' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                      {seleccionado.estado === "Disponible" ? <><Truck className="w-4 h-4"/> Asignar a Ruta</> : <><CheckCircle className="w-4 h-4"/> Marcar Disponible</>}
                   </button>
                </div>
             )}
          </div>
       )}
       {toast && <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-[100] animate-in slide-in-from-bottom-8"><CheckCircle className="w-6 h-6 text-emerald-400"/>{toast}</div>}
    </div>
  )
}

// ==========================================
// ROUTER PRINCIPAL
// ==========================================
export default function Contactos({ subMenu }: ContactosProps) {
  const renderModule = () => {
    switch (subMenu) {
      case "Clientes": return <ClientesManager />
      case "Vendedores": return <VendedoresManager />
      case "Proveedores": return <ProveedoresManager />
      case "Domiciliarios": return <DomiciliariosManager />
      default: return <ClientesManager />
    }
  }

  return (
    <div className="bg-slate-50 w-full h-[calc(100vh-120px)] overflow-y-auto p-2 sm:p-6 rounded-tl-2xl shadow-inner border-l border-slate-200">
       <div className="w-full h-full max-w-7xl mx-auto">
          {renderModule()}
       </div>
    </div>
  )
}
