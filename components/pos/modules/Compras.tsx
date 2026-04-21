"use client"

import { useState } from "react"
import { Plus, Eye, Search, X, FileText, CheckCircle, Clock, AlertTriangle, Download, Upload, Trash2, ArrowUpDown, Landmark, ArrowRightLeft, CreditCard, Building2, Receipt, ShoppingBag, TrendingUp, TrendingDown, Filter } from "lucide-react"

interface ComprasProps { subMenu: string }
const formatCOP = (v: number) => "$ " + Math.round(v).toLocaleString("es-CO")

// ==========================================
// 1. DOCUMENTO SOPORTE (Factura de Compra)
// ==========================================
function DocSoporte() {
  const [items, setItems] = useState([
    { id: 1, producto: "Camiseta Algodón Premium", qty: 50, costoUnit: 12000, subtotal: 600000 },
    { id: 2, producto: "Jean Slim Fit", qty: 30, costoUnit: 25000, subtotal: 750000 },
  ])
  const [proveedor, setProveedor] = useState("")
  const [facturaProv, setFacturaProv] = useState("")
  const [nuevoProducto, setNuevoProducto] = useState("")
  const [nuevoQty, setNuevoQty] = useState("")
  const [nuevoCosto, setNuevoCosto] = useState("")
  const [toast, setToast] = useState("")

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000) }

  const agregarItem = () => {
    if (!nuevoProducto || !nuevoQty || !nuevoCosto) return alert("Completa producto, cantidad y costo")
    const q = Number(nuevoQty), c = Number(nuevoCosto)
    setItems([...items, { id: Date.now(), producto: nuevoProducto, qty: q, costoUnit: c, subtotal: q * c }])
    setNuevoProducto(""); setNuevoQty(""); setNuevoCosto("")
  }

  const subtotal = items.reduce((a, i) => a + i.subtotal, 0)
  const iva = Math.round(subtotal * 0.19)
  const total = subtotal + iva

  const handleGuardar = () => {
    if (!proveedor) return alert("Selecciona un proveedor")
    if (items.length === 0) return alert("Agrega al menos un producto")
    showToast("Documento Soporte generado y registrado en Compras")
  }

  return (
    <div className="animate-in fade-in duration-500 pb-10">
       <div className="flex justify-between items-end mb-6">
          <div>
             <h2 className="text-2xl font-black text-slate-800">Documento Soporte de Compra</h2>
             <p className="text-sm text-slate-500 font-medium mt-1">Registra la entrada de mercancía al inventario con soporte fiscal.</p>
          </div>
          <button onClick={handleGuardar} className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all">
             <CheckCircle className="w-5 h-5"/> Generar Documento
          </button>
       </div>

       {/* Cabecera del documento */}
       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Proveedor *</label>
                <select value={proveedor} onChange={e => setProveedor(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                   <option value="">Seleccionar proveedor...</option>
                   <option>Distribuidora Norte</option>
                   <option>Makro Textiles</option>
                   <option>Fábrica Nacional SAS</option>
                   <option>Importadora Moda Global</option>
                </select>
             </div>
             <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nº Factura Proveedor</label>
                <input type="text" value={facturaProv} onChange={e => setFacturaProv(e.target.value)} placeholder="Ej. FAC-PRV-0921" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
             </div>
             <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Fecha del Documento</label>
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
             </div>
          </div>
       </div>

       {/* Agregar línea de producto */}
       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Agregar Producto al Documento</h3>
          <div className="flex gap-3 items-end flex-wrap">
             <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold text-slate-400 mb-1 block">Producto / SKU</label>
                <input type="text" value={nuevoProducto} onChange={e => setNuevoProducto(e.target.value)} placeholder="Buscar producto..." className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
             </div>
             <div className="w-24">
                <label className="text-[10px] font-bold text-slate-400 mb-1 block">Cantidad</label>
                <input type="number" value={nuevoQty} onChange={e => setNuevoQty(e.target.value)} placeholder="0" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
             </div>
             <div className="w-32">
                <label className="text-[10px] font-bold text-slate-400 mb-1 block">Costo Unitario</label>
                <input type="number" value={nuevoCosto} onChange={e => setNuevoCosto(e.target.value)} placeholder="$0" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
             </div>
             <button onClick={agregarItem} className="px-4 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-black transition-colors flex items-center gap-1.5"><Plus className="w-4 h-4"/> Agregar</button>
          </div>
       </div>

       {/* Tabla de ítems */}
       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <table className="w-full text-left">
             <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                   <th className="p-4">#</th><th className="p-4">Producto</th><th className="p-4 text-center">Cant.</th><th className="p-4 text-right">Costo Unit.</th><th className="p-4 text-right">Subtotal</th><th className="p-4 text-center">Acción</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 text-sm">
                {items.map((it, i) => (
                   <tr key={it.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-400 font-mono text-xs">{i + 1}</td>
                      <td className="p-4 font-bold text-slate-800">{it.producto}</td>
                      <td className="p-4 text-center font-bold text-slate-700">{it.qty}</td>
                      <td className="p-4 text-right text-slate-600">{formatCOP(it.costoUnit)}</td>
                      <td className="p-4 text-right font-black text-slate-800">{formatCOP(it.subtotal)}</td>
                      <td className="p-4 text-center"><button onClick={() => setItems(items.filter(x => x.id !== it.id))} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button></td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {/* Totales */}
       <div className="flex justify-end">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 w-full max-w-sm space-y-3">
             <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-bold text-slate-700">{formatCOP(subtotal)}</span></div>
             <div className="flex justify-between text-sm"><span className="text-slate-500">IVA (19%)</span><span className="font-bold text-slate-700">{formatCOP(iva)}</span></div>
             <div className="flex justify-between text-lg border-t border-slate-100 pt-3"><span className="font-black text-slate-800">Total Documento</span><span className="font-black text-emerald-600">{formatCOP(total)}</span></div>
          </div>
       </div>

       {toast && <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-[100] animate-in slide-in-from-bottom-8"><CheckCircle className="w-6 h-6 text-emerald-400"/>{toast}</div>}
    </div>
  )
}

// ==========================================
// 2. HISTÓRICO DE DOC. SOPORTE
// ==========================================
function HistoricoDocSoporte() {
  const docs = [
    { id: "DS-001", proveedor: "Distribuidora Norte", fecha: "2026-04-14", items: 5, total: 2850000, estado: "Registrado" as const, facProv: "FP-9201" },
    { id: "DS-002", proveedor: "Makro Textiles", fecha: "2026-04-10", items: 12, total: 5200000, estado: "Registrado" as const, facProv: "FP-8811" },
    { id: "DS-003", proveedor: "Fábrica Nacional SAS", fecha: "2026-04-05", items: 3, total: 890000, estado: "Anulado" as const, facProv: "FP-7522" },
    { id: "DS-004", proveedor: "Importadora Moda Global", fecha: "2026-03-28", items: 8, total: 4100000, estado: "Registrado" as const, facProv: "FP-6100" },
  ]
  const [search, setSearch] = useState("")
  const [detalle, setDetalle] = useState<typeof docs[0] | null>(null)
  const filtered = docs.filter(d => d.proveedor.toLowerCase().includes(search.toLowerCase()) || d.id.includes(search))

  return (
    <div className="animate-in fade-in duration-500 flex flex-col lg:flex-row gap-6 h-full pb-6">
       <div className={`flex-1 transition-all duration-300 ${detalle ? 'lg:w-2/3' : 'w-full'}`}>
          <div className="mb-6">
             <h2 className="text-2xl font-black text-slate-800">Histórico de Documentos Soporte</h2>
             <p className="text-sm text-slate-500 font-medium mt-1">Archivo completo de Compras y entradas de mercancía.</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documentos</p><p className="text-2xl font-black text-slate-800 mt-1">{docs.length}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Comprado</p><p className="text-2xl font-black text-blue-600 mt-1">{formatCOP(docs.filter(d => d.estado === "Registrado").reduce((a, d) => a + d.total, 0))}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Anulados</p><p className="text-2xl font-black text-red-500 mt-1">{docs.filter(d => d.estado === "Anulado").length}</p></div>
          </div>
          <div className="relative mb-4 max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
             <input type="text" placeholder="Buscar documento..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] uppercase font-black tracking-widest text-slate-400"><th className="p-4">Doc. ID</th><th className="p-4">Proveedor</th><th className="p-4">Fac. Prov.</th><th className="p-4 text-center">Líneas</th><th className="p-4 text-right">Total</th><th className="p-4">Fecha</th><th className="p-4 text-center">Estado</th></tr></thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                   {filtered.map(d => (
                      <tr key={d.id} onClick={() => setDetalle(d)} className={`cursor-pointer transition-colors ${detalle?.id === d.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                         <td className="p-4 font-mono text-blue-600 font-bold text-xs">{d.id}</td>
                         <td className="p-4 font-bold text-slate-800">{d.proveedor}</td>
                         <td className="p-4 text-slate-500 font-mono text-xs">{d.facProv}</td>
                         <td className="p-4 text-center text-slate-600">{d.items}</td>
                         <td className="p-4 text-right font-black text-slate-800">{formatCOP(d.total)}</td>
                         <td className="p-4 text-slate-500 font-mono text-xs">{d.fecha}</td>
                         <td className="p-4 text-center"><span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${d.estado === 'Registrado' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{d.estado}</span></td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
       {detalle && (
          <div className="w-full lg:w-72 bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col h-[calc(100vh-160px)] sticky top-0 animate-in fade-in slide-in-from-right-8">
             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl"><h3 className="font-black text-slate-800 text-sm">Detalle {detalle.id}</h3><button onClick={() => setDetalle(null)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-full"><X className="w-4 h-4"/></button></div>
             <div className="p-5 flex-1 overflow-y-auto space-y-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white text-center"><p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Total Documento</p><p className="text-3xl font-black mt-1">{formatCOP(detalle.total)}</p></div>
                <div className="space-y-2">
                   {[["Proveedor", detalle.proveedor], ["Fac. Proveedor", detalle.facProv], ["Fecha", detalle.fecha], ["Líneas", String(detalle.items)]].map(([l, v]) => (
                      <div key={l} className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg"><span className="text-[10px] font-bold text-slate-400">{l}</span><span className="text-xs font-black text-slate-700">{v}</span></div>
                   ))}
                </div>
                <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"><Download className="w-4 h-4"/> Descargar PDF</button>
             </div>
          </div>
       )}
    </div>
  )
}

// ==========================================
// 3. GASTOS ENTERPRISE
// ==========================================
function GastosManager() {
  const [gastos, setGastos] = useState([
    { id: "GAS-001", descripcion: "Pago servicios públicos", categoria: "Servicios", fecha: "2026-04-14", valor: 180000, proveedor: "EPM", metodo: "Transferencia" },
    { id: "GAS-002", descripcion: "Compra de insumos cocina", categoria: "Insumos", fecha: "2026-04-13", valor: 450000, proveedor: "Makro", metodo: "Efectivo" },
    { id: "GAS-003", descripcion: "Arriendo local comercial", categoria: "Arrendamiento", fecha: "2026-04-01", valor: 2500000, proveedor: "Inmobiliaria XYZ", metodo: "Transferencia" },
    { id: "GAS-004", descripcion: "Mantenimiento aires acondicionados", categoria: "Mantenimiento", fecha: "2026-04-10", valor: 350000, proveedor: "TecnoService", metodo: "Efectivo" },
    { id: "GAS-005", descripcion: "Publicidad redes sociales", categoria: "Marketing", fecha: "2026-04-08", valor: 200000, proveedor: "Meta Ads", metodo: "Tarjeta Crédito" },
  ])
  const [search, setSearch] = useState("")
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState("")
  const [form, setForm] = useState({ descripcion: "", categoria: "Servicios", valor: "", proveedor: "", metodo: "Efectivo" })

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000) }
  const totalMes = gastos.reduce((a, g) => a + g.valor, 0)
  const CATEGORIAS = ["Servicios", "Insumos", "Arrendamiento", "Mantenimiento", "Marketing", "Nómina", "Transporte", "Otros"]
  const filtered = gastos.filter(g => g.descripcion.toLowerCase().includes(search.toLowerCase()) || g.proveedor.toLowerCase().includes(search.toLowerCase()))

  const handleCrear = () => {
    if (!form.descripcion || !form.valor) return alert("Descripción y valor son obligatorios")
    setGastos([{ id: "GAS-" + Date.now().toString().slice(-4), descripcion: form.descripcion, categoria: form.categoria, fecha: new Date().toISOString().split('T')[0], valor: Number(form.valor), proveedor: form.proveedor || "Sin proveedor", metodo: form.metodo }, ...gastos])
    setModal(false); setForm({ descripcion: "", categoria: "Servicios", valor: "", proveedor: "", metodo: "Efectivo" })
    showToast("Gasto registrado exitosamente")
  }

  return (
    <div className="animate-in fade-in duration-500 pb-10">
       <div className="flex justify-between items-end mb-6">
          <div><h2 className="text-2xl font-black text-slate-800">Control de Gastos</h2><p className="text-sm text-slate-500 font-medium mt-1">Egresos operativos, fijos y variables del negocio.</p></div>
          <button onClick={() => setModal(true)} className="bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"><Plus className="w-5 h-5"/> Registrar Gasto</button>
       </div>
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gastos del Mes</p><p className="text-2xl font-black text-red-500 mt-1">{formatCOP(totalMes)}</p></div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registros</p><p className="text-2xl font-black text-slate-800 mt-1">{gastos.length}</p></div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mayor Gasto</p><p className="text-2xl font-black text-amber-600 mt-1">{formatCOP(Math.max(...gastos.map(g => g.valor)))}</p></div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categorías</p><p className="text-2xl font-black text-blue-600 mt-1">{new Set(gastos.map(g => g.categoria)).size}</p></div>
       </div>
       <div className="relative mb-4 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/><input type="text" placeholder="Buscar gasto..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"/></div>
       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] uppercase font-black tracking-widest text-slate-400"><th className="p-4">#</th><th className="p-4">Descripción</th><th className="p-4">Categoría</th><th className="p-4">Proveedor</th><th className="p-4">Método</th><th className="p-4">Fecha</th><th className="p-4 text-right">Valor</th></tr></thead>
             <tbody className="divide-y divide-slate-50 text-sm">
                {filtered.map(g => (
                   <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono text-xs text-slate-400">{g.id}</td>
                      <td className="p-4 font-bold text-slate-800">{g.descripcion}</td>
                      <td className="p-4"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold border border-blue-100">{g.categoria}</span></td>
                      <td className="p-4 text-slate-600">{g.proveedor}</td>
                      <td className="p-4"><span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{g.metodo}</span></td>
                      <td className="p-4 text-slate-500 font-mono text-xs">{g.fecha}</td>
                      <td className="p-4 text-right font-black text-red-500">{formatCOP(g.valor)}</td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
       {modal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-6 bg-red-500 text-white text-center"><div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"><TrendingDown className="w-7 h-7"/></div><h3 className="text-xl font-black">Registrar Gasto</h3></div>
                <div className="p-6 space-y-4">
                   <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Descripción *</label><input type="text" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Ej. Pago de servicios..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"/></div>
                   <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Categoría</label><select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-500">{CATEGORIAS.map(c => <option key={c}>{c}</option>)}</select></div>
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Valor ($) *</label><input type="number" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} placeholder="$0" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"/></div>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Proveedor</label><input type="text" value={form.proveedor} onChange={e => setForm({...form, proveedor: e.target.value})} placeholder="Opcional" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"/></div>
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Método de Pago</label><select value={form.metodo} onChange={e => setForm({...form, metodo: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"><option>Efectivo</option><option>Transferencia</option><option>Tarjeta Crédito</option><option>Tarjeta Débito</option></select></div>
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
// 4. ÓRDENES DE COMPRAS
// ==========================================
function OrdenesCompras() {
  const [ordenes, setOrdenes] = useState([
    { id: "OC-001", proveedor: "Distribuidora Norte", fecha: "2026-04-12", total: 2850000, estado: "Recibida" as const, items: 5, fechaEntrega: "2026-04-14" },
    { id: "OC-002", proveedor: "Makro Textiles", fecha: "2026-04-13", total: 1200000, estado: "Pendiente" as const, items: 3, fechaEntrega: "2026-04-18" },
    { id: "OC-003", proveedor: "Fábrica Nacional SAS", fecha: "2026-04-10", total: 540000, estado: "Recibida" as const, items: 2, fechaEntrega: "2026-04-12" },
    { id: "OC-004", proveedor: "Importadora Moda Global", fecha: "2026-04-08", total: 4600000, estado: "Parcial" as const, items: 8, fechaEntrega: "2026-04-20" },
    { id: "OC-005", proveedor: "Distribuidora Norte", fecha: "2026-04-05", total: 780000, estado: "Cancelada" as const, items: 2, fechaEntrega: "" },
  ])
  const [modal, setModal] = useState(false)
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<typeof ordenes[0] | null>(null)
  const [filtro, setFiltro] = useState<"todas" | "Pendiente" | "Recibida" | "Parcial" | "Cancelada">("todas")
  const [toast, setToast] = useState("")
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000) }

  const STATUS_COLORS: Record<string, string> = { Recibida: "bg-emerald-100 text-emerald-700", Pendiente: "bg-amber-100 text-amber-700", Parcial: "bg-blue-100 text-blue-700", Cancelada: "bg-red-100 text-red-600" }
  const filtradas = filtro === "todas" ? ordenes : ordenes.filter(o => o.estado === filtro)

  const handleRecibirOrden = (id: string) => {
    setOrdenes(ordenes.map(o => o.id === id ? { ...o, estado: "Recibida" as const } : o))
    if (ordenSeleccionada?.id === id) setOrdenSeleccionada({ ...ordenSeleccionada, estado: "Recibida" })
    showToast("Orden marcada como recibida — Inventario actualizado")
  }

  return (
    <div className="animate-in fade-in duration-500 flex flex-col lg:flex-row gap-6 h-full pb-6">
       <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${ordenSeleccionada ? 'lg:w-2/3' : 'w-full'}`}>
          <div className="flex justify-between items-end mb-6"><div><h2 className="text-2xl font-black text-slate-800">Órdenes de Compra</h2><p className="text-sm text-slate-500 font-medium mt-1">Gestión de pedidos a proveedores y recepción de mercancía.</p></div><button onClick={() => setModal(true)} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"><Plus className="w-5 h-5"/> Nueva Orden</button></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Órdenes</p><p className="text-2xl font-black text-slate-800 mt-1">{ordenes.length}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendientes</p><p className="text-2xl font-black text-amber-600 mt-1">{ordenes.filter(o => o.estado === "Pendiente").length}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monto Total</p><p className="text-2xl font-black text-blue-600 mt-1">{formatCOP(ordenes.filter(o => o.estado !== "Cancelada").reduce((a, o) => a + o.total, 0))}</p></div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proveedores</p><p className="text-2xl font-black text-violet-600 mt-1">{new Set(ordenes.map(o => o.proveedor)).size}</p></div>
          </div>
          <div className="flex gap-1.5 mb-5 flex-wrap">{(["todas", "Pendiente", "Recibida", "Parcial", "Cancelada"] as const).map(s => (<button key={s} onClick={() => setFiltro(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filtro === s ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>{s === "todas" ? "Todas" : s}</button>))}</div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] uppercase font-black tracking-widest text-slate-400"><th className="p-4"># Orden</th><th className="p-4">Proveedor</th><th className="p-4 text-center">Ítems</th><th className="p-4 text-right">Total</th><th className="p-4">Entrega</th><th className="p-4 text-center">Estado</th></tr></thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                   {filtradas.map(o => (
                      <tr key={o.id} onClick={() => setOrdenSeleccionada(o)} className={`cursor-pointer transition-colors ${ordenSeleccionada?.id === o.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                         <td className="p-4 font-mono font-bold text-blue-600 text-xs">{o.id}</td>
                         <td className="p-4 font-bold text-slate-800">{o.proveedor}</td>
                         <td className="p-4 text-center text-slate-600">{o.items}</td>
                         <td className="p-4 text-right font-black text-slate-800">{formatCOP(o.total)}</td>
                         <td className="p-4 text-slate-500 font-mono text-xs">{o.fechaEntrega || "—"}</td>
                         <td className="p-4 text-center"><span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${STATUS_COLORS[o.estado]}`}>{o.estado}</span></td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
       {ordenSeleccionada && (
          <div className="w-full lg:w-72 bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col h-[calc(100vh-160px)] sticky top-0 animate-in fade-in slide-in-from-right-8">
             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl"><h3 className="font-black text-slate-800 text-sm">Orden {ordenSeleccionada.id}</h3><button onClick={() => setOrdenSeleccionada(null)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-full"><X className="w-4 h-4"/></button></div>
             <div className="p-5 flex-1 overflow-y-auto space-y-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white text-center"><p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Total Orden</p><p className="text-3xl font-black mt-1">{formatCOP(ordenSeleccionada.total)}</p></div>
                <div className="space-y-2">
                   {[["Proveedor", ordenSeleccionada.proveedor], ["Fecha Orden", ordenSeleccionada.fecha], ["Entrega Est.", ordenSeleccionada.fechaEntrega || "—"], ["Ítems", String(ordenSeleccionada.items)]].map(([l, v]) => (
                      <div key={l} className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg"><span className="text-[10px] font-bold text-slate-400">{l}</span><span className="text-xs font-black text-slate-700">{v}</span></div>
                   ))}
                </div>
             </div>
             {ordenSeleccionada.estado === "Pendiente" && (
                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl">
                   <button onClick={() => handleRecibirOrden(ordenSeleccionada.id)} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"><CheckCircle className="w-4 h-4"/> Marcar como Recibida</button>
                </div>
             )}
          </div>
       )}
       {modal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-6 bg-blue-600 text-white text-center"><div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"><ShoppingBag className="w-7 h-7"/></div><h3 className="text-xl font-black">Nueva Orden de Compra</h3></div>
                <div className="p-6 text-center py-12 text-slate-400"><p className="font-bold">Módulo de creación conectado al catálogo de productos y proveedores.</p><p className="text-sm mt-2">Funcionalidad disponible con Supabase.</p></div>
                <div className="p-5 border-t border-slate-100"><button onClick={() => setModal(false)} className="w-full py-3 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cerrar</button></div>
             </div>
          </div>
       )}
       {toast && <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-[100] animate-in slide-in-from-bottom-8"><CheckCircle className="w-6 h-6 text-emerald-400"/>{toast}</div>}
    </div>
  )
}

// ==========================================
// 5. BANCOS
// ==========================================
function BancosManager() {
  const [bancos] = useState([
    { id: 1, banco: "Bancolombia", cuenta: "****4521", tipo: "Corriente", saldo: 8500000, color: "from-yellow-500 to-amber-600" },
    { id: 2, banco: "Davivienda", cuenta: "****8823", tipo: "Ahorros", saldo: 3200000, color: "from-red-500 to-red-700" },
    { id: 3, banco: "Nequi", cuenta: "****9012", tipo: "Digital", saldo: 1450000, color: "from-violet-500 to-purple-700" },
  ])
  const totalSaldo = bancos.reduce((a, b) => a + b.saldo, 0)

  return (
    <div className="animate-in fade-in duration-500 pb-10">
       <div className="mb-6"><h2 className="text-2xl font-black text-slate-800">Tesorería Bancaria</h2><p className="text-sm text-slate-500 font-medium mt-1">Cuentas bancarias del negocio y saldos consolidados.</p></div>
       <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 mb-6 text-white"><p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Saldo Consolidado Total</p><p className="text-4xl font-black mt-2">{formatCOP(totalSaldo)}</p><p className="text-xs opacity-50 mt-1">{bancos.length} cuentas registradas</p></div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {bancos.map(b => (
             <div key={b.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:-translate-y-0.5 transition-all">
                <div className={`bg-gradient-to-r ${b.color} p-4 text-white`}><div className="flex justify-between items-start"><div><p className="font-black text-lg">{b.banco}</p><p className="text-xs opacity-70">{b.tipo} · {b.cuenta}</p></div><Landmark className="w-6 h-6 opacity-50"/></div></div>
                <div className="p-4"><p className="text-[10px] font-bold text-slate-400 uppercase">Saldo Disponible</p><p className="text-2xl font-black text-slate-800 mt-1">{formatCOP(b.saldo)}</p></div>
             </div>
          ))}
       </div>
       <button className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"><Plus className="w-5 h-5"/> Agregar Cuenta Bancaria</button>
    </div>
  )
}

// ==========================================
// 6. MOVIMIENTOS BANCARIOS
// ==========================================
function MovimientosBancarios() {
  const movimientos = [
    { id: "MB-001", desc: "Consignación ventas del día", banco: "Bancolombia", tipo: "Ingreso" as const, valor: 1888700, fecha: "2026-04-14", ref: "VTA-2026-0414" },
    { id: "MB-002", desc: "Transferencia recibida Distribuidora Norte", banco: "Davivienda", tipo: "Ingreso" as const, valor: 450000, fecha: "2026-04-14", ref: "TRF-IN-001" },
    { id: "MB-003", desc: "Pago proveedor Makro Textiles", banco: "Bancolombia", tipo: "Egreso" as const, valor: 850000, fecha: "2026-04-12", ref: "OC-001" },
    { id: "MB-004", desc: "Pago arriendo local comercial", banco: "Bancolombia", tipo: "Egreso" as const, valor: 2500000, fecha: "2026-04-01", ref: "GAS-003" },
    { id: "MB-005", desc: "Débito automático servicios públicos", banco: "Bancolombia", tipo: "Egreso" as const, valor: 180000, fecha: "2026-04-14", ref: "GAS-001" },
    { id: "MB-006", desc: "Recaudo Nequi ventas online", banco: "Nequi", tipo: "Ingreso" as const, valor: 620000, fecha: "2026-04-13", ref: "VTA-ONL-012" },
  ]
  const [filtro, setFiltro] = useState<"todos" | "Ingreso" | "Egreso">("todos")
  const filtered = filtro === "todos" ? movimientos : movimientos.filter(m => m.tipo === filtro)
  const totalIngresos = movimientos.filter(m => m.tipo === "Ingreso").reduce((a, m) => a + m.valor, 0)
  const totalEgresos = movimientos.filter(m => m.tipo === "Egreso").reduce((a, m) => a + m.valor, 0)

  return (
    <div className="animate-in fade-in duration-500 pb-10">
       <div className="mb-6"><h2 className="text-2xl font-black text-slate-800">Movimientos Bancarios</h2><p className="text-sm text-slate-500 font-medium mt-1">Ingresos y egresos registrados en las cuentas del negocio.</p></div>
       <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ingresos</p><p className="text-2xl font-black text-emerald-600 mt-1">{formatCOP(totalIngresos)}</p></div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Egresos</p><p className="text-2xl font-black text-red-500 mt-1">{formatCOP(totalEgresos)}</p></div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flujo Neto</p><p className={`text-2xl font-black mt-1 ${totalIngresos - totalEgresos >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{formatCOP(totalIngresos - totalEgresos)}</p></div>
       </div>
       <div className="flex gap-1.5 mb-5">{(["todos", "Ingreso", "Egreso"] as const).map(s => (<button key={s} onClick={() => setFiltro(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filtro === s ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>{s === "todos" ? "Todos" : s + "s"}</button>))}</div>
       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-50">
             {filtered.map(m => (
                <div key={m.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.tipo === 'Ingreso' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>{m.tipo === 'Ingreso' ? <TrendingUp className="w-5 h-5"/> : <TrendingDown className="w-5 h-5"/>}</div>
                      <div>
                         <p className="text-sm font-bold text-slate-800">{m.desc}</p>
                         <p className="text-[11px] text-slate-400">{m.banco} · <span className="font-mono text-blue-500">{m.ref}</span></p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`font-black ${m.tipo === 'Ingreso' ? 'text-emerald-600' : 'text-red-500'}`}>{m.tipo === 'Ingreso' ? '+' : '-'}{formatCOP(m.valor)}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{m.fecha}</p>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  )
}

// ==========================================
// 7. CONCILIACIONES BANCARIAS
// ==========================================
function Conciliaciones() {
  const registros = [
    { id: "CON-001", banco: "Bancolombia", periodo: "Abril 2026", extracto: 8500000, sistema: 8500000, diferencia: 0, estado: "Conciliada" as const },
    { id: "CON-002", banco: "Davivienda", periodo: "Abril 2026", extracto: 3350000, sistema: 3200000, diferencia: 150000, estado: "Pendiente" as const },
    { id: "CON-003", banco: "Bancolombia", periodo: "Marzo 2026", extracto: 7200000, sistema: 7200000, diferencia: 0, estado: "Conciliada" as const },
  ]

  return (
    <div className="animate-in fade-in duration-500 pb-10">
       <div className="flex justify-between items-end mb-6"><div><h2 className="text-2xl font-black text-slate-800">Conciliaciones Bancarias</h2><p className="text-sm text-slate-500 font-medium mt-1">Comparativa entre extracto bancario real vs. registros del sistema.</p></div><button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"><ArrowRightLeft className="w-5 h-5"/> Nueva Conciliación</button></div>
       <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conciliadas</p><p className="text-2xl font-black text-emerald-600 mt-1">{registros.filter(r => r.estado === "Conciliada").length}</p></div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendientes</p><p className="text-2xl font-black text-amber-600 mt-1">{registros.filter(r => r.estado === "Pendiente").length}</p></div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diferencia Total</p><p className={`text-2xl font-black mt-1 ${registros.reduce((a, r) => a + r.diferencia, 0) === 0 ? 'text-emerald-600' : 'text-red-500'}`}>{formatCOP(registros.reduce((a, r) => a + r.diferencia, 0))}</p></div>
       </div>
       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] uppercase font-black tracking-widest text-slate-400"><th className="p-4">ID</th><th className="p-4">Banco</th><th className="p-4">Período</th><th className="p-4 text-right">Extracto Real</th><th className="p-4 text-right">Sist. POS</th><th className="p-4 text-right">Diferencia</th><th className="p-4 text-center">Estado</th></tr></thead>
             <tbody className="divide-y divide-slate-50 text-sm">
                {registros.map(r => (
                   <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono text-xs text-indigo-600 font-bold">{r.id}</td>
                      <td className="p-4 font-bold text-slate-800">{r.banco}</td>
                      <td className="p-4 text-slate-600">{r.periodo}</td>
                      <td className="p-4 text-right font-bold text-slate-700">{formatCOP(r.extracto)}</td>
                      <td className="p-4 text-right font-bold text-slate-700">{formatCOP(r.sistema)}</td>
                      <td className={`p-4 text-right font-black ${r.diferencia === 0 ? 'text-emerald-600' : 'text-red-500'}`}>{r.diferencia === 0 ? '✓ $0' : formatCOP(r.diferencia)}</td>
                      <td className="p-4 text-center"><span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${r.estado === 'Conciliada' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{r.estado}</span></td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  )
}

// ==========================================
// ROUTER PRINCIPAL DEL MÓDULO
// ==========================================
export default function Compras({ subMenu }: ComprasProps) {
  const renderModule = () => {
    switch (subMenu) {
      case "Documento Soporte": return <DocSoporte />
      case "Historico de Doc. Soporte": return <HistoricoDocSoporte />
      case "Gastos": return <GastosManager />
      case "Órdenes de Compras": return <OrdenesCompras />
      case "Bancos": return <BancosManager />
      case "Movimientos bancarios": return <MovimientosBancarios />
      case "Conciliaciones": return <Conciliaciones />
      default: return <DocSoporte />
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
