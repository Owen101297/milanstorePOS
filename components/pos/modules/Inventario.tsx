"use client"

import React, { useState, useEffect, useCallback } from "react"
import { 
  Package, Search, Plus, RefreshCcw, Filter, 
  MoreHorizontal, Edit, Trash2, Eye, Download,
  Tag, Layers, ArrowUpDown, AlertCircle, Image as ImageIcon,
  X, Check, Save
} from "lucide-react"
import { useSede } from "@/components/pos/providers/SedeContext"
import { productos, inventario } from "@/lib/services"
import type { ProductoConVariantes, Categoria } from "@/lib/database.types"
import type { StockConProducto, KardexConDetalle } from "@/lib/services/inventario.service"

const fmtCOP = (v: number) => "$ " + Math.round(v).toLocaleString("es-CO")

interface InventarioProps {
  subMenu: string
}

export default function Inventario({ subMenu }: InventarioProps) {
  const { sedeId } = useSede()
  const [activeSub, setActiveSub] = useState(subMenu || "productos")
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  
  // Data States
  const [prods, setProds] = useState<ProductoConVariantes[]>([])
  const [cats, setCats] = useState<Categoria[]>([])
  const [kardex, setKardex] = useState<KardexConDetalle[]>([])
  
  // UI States
  const [showNewModal, setShowNewModal] = useState(false)

  const loadAllData = useCallback(async () => {
    setLoading(true)
    try {
      const [pData, cData, kData] = await Promise.all([
        productos.getProductos(sedeId),
        productos.getCategorias(),
        inventario.getHistorialKardex(sedeId, { limit: 100 })
      ])
      setProds(pData)
      setCats(cData)
      setKardex(kData)
    } catch (err) {
      console.error("Error loading inventory data:", err)
    } finally {
      setLoading(false)
    }
  }, [sedeId])

  useEffect(() => { loadAllData() }, [loadAllData])
  useEffect(() => { setActiveSub(subMenu || "productos") }, [subMenu])

  return (
    <div className="flex flex-col h-full bg-[#f4f7f6] overflow-hidden">
      
      {/* Module Header - Professional & Minimalist */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <Package className="text-[#62cb31]" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight">Inventario</h1>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
              Gestión de productos y existencias • {activeSub}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={loadAllData} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#62cb31] text-white text-sm font-bold rounded shadow-lg shadow-green-500/20 hover:bg-[#58b72c] transition-all"
          >
            <Plus size={18} />
            <span>NUEVO PRODUCTO</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col p-8">
        
        {/* Module Content Switcher */}
        <div className="bg-white rounded border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
          {activeSub === "productos" && <ProductosList data={prods} loading={loading} search={search} setSearch={setSearch} />}
          {activeSub === "categorias" && <CategoriasList data={cats} loading={loading} />}
          {activeSub === "movimientos" && <KardexList data={kardex} loading={loading} />}
        </div>
      </main>

      {/* Modals */}
      {showNewModal && <NewProductModal onClose={() => setShowNewModal(false)} cats={cats} onCreated={loadAllData} />}
    </div>
  )
}

// --- SUB-COMPONENTS ---

const ProductosList = ({ data, loading, search, setSearch }: any) => {
  const filtered = data.filter((p: any) => 
    p.nombre.toLowerCase().includes(search.toLowerCase()) || 
    p.sku_base?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* List Filters */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o código..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50">
            <Filter size={14} /> FILTRAR
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50">
            <Download size={14} /> EXPORTAR
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white shadow-sm z-10">
            <tr className="bg-gray-100/80 border-b border-gray-200">
              <th className="px-6 py-3 text-[11px] font-black text-gray-500 uppercase tracking-widest w-12">Imagen</th>
              <th className="px-6 py-3 text-[11px] font-black text-gray-500 uppercase tracking-widest">Producto</th>
              <th className="px-6 py-3 text-[11px] font-black text-gray-500 uppercase tracking-widest">Referencia (SKU)</th>
              <th className="px-6 py-3 text-[11px] font-black text-gray-500 uppercase tracking-widest text-right">Precio Venta</th>
              <th className="px-6 py-3 text-[11px] font-black text-gray-500 uppercase tracking-widest text-center">Stock Total</th>
              <th className="px-6 py-3 text-[11px] font-black text-gray-500 uppercase tracking-widest text-center">Estado</th>
              <th className="px-6 py-3 text-[11px] font-black text-gray-500 uppercase tracking-widest text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="px-6 py-4 bg-gray-50/20 h-16"></td>
                </tr>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((p: any) => {
                const totalStock = p.variantes?.reduce((acc: number, v: any) => acc + (v.stock?.[0]?.cantidad || 0), 0) || 0
                return (
                  <tr key={p.id} className="hover:bg-green-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                        {p.imagen_url ? <img src={p.imagen_url} className="w-full h-full object-cover rounded" /> : <ImageIcon size={18} className="text-gray-300" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-700">{p.nombre}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase">{p.categoria?.nombre || "Sin Categoría"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">{p.sku_base || "—"}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-black text-gray-800">{fmtCOP(p.variantes?.[0]?.precio_venta || 0)}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-black ${totalStock > 0 ? "text-gray-700" : "text-red-500"}`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${totalStock > 5 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {totalStock > 0 ? "En Stock" : "Agotado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"><Edit size={16} /></button>
                        <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-colors"><Eye size={16} /></button>
                        <button className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Package size={48} strokeWidth={1} />
                    <p className="text-sm font-bold">No se encontraron productos</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const CategoriasList = ({ data, loading }: any) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
         <h2 className="text-sm font-bold text-gray-700">Categorías Activas</h2>
         <button className="text-xs font-bold text-green-600 hover:underline">Gestionar Orden</button>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             [...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />)
          ) : data.map((c: any) => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 hover:shadow-md transition-all group relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: c.color_hex || '#62cb31' }} />
               <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50">
                    <Tag size={20} className="text-gray-400" />
                  </div>
                  <button className="p-1 text-gray-300 hover:text-gray-600"><MoreHorizontal size={18} /></button>
               </div>
               <h3 className="text-sm font-black text-gray-800 uppercase mb-1">{c.nombre}</h3>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {c.impuesto_porcentaje}% Impuesto
               </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const KardexList = ({ data, loading }: any) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
       <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-gray-700">Historial de Movimientos</h2>
            <div className="h-4 w-[1px] bg-gray-200" />
            <span className="text-[10px] font-bold text-gray-400 uppercase">Últimos 100 registros</span>
          </div>
       </div>
       <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white border-b border-gray-200">
               <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Fecha/Hora</th>
                  <th className="px-6 py-4">Módulo</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4 text-center">Cantidad</th>
                  <th className="px-6 py-4 text-right">Saldo</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? null : data.map((k: any) => (
                  <tr key={k.id} className="text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 font-mono">{new Date(k.created_at).toLocaleString()}</td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          k.tipo_mov === 'VENTA' ? 'bg-red-50 text-red-600' : 
                          k.tipo_mov === 'COMPRA' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {k.tipo_mov}
                        </span>
                     </td>
                     <td className="px-6 py-4">
                        <p className="font-bold text-gray-700">{k.variante?.producto?.nombre}</p>
                        <p className="text-[10px] text-gray-400 italic">{k.motivo || 'Sin observaciones'}</p>
                     </td>
                     <td className={`px-6 py-4 text-center font-black ${k.cantidad_mov > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {k.cantidad_mov > 0 ? '+' : ''}{k.cantidad_mov}
                     </td>
                     <td className="px-6 py-4 text-right font-bold text-gray-400">
                        —
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
       </div>
    </div>
  )
}

const NewProductModal = ({ onClose, cats, onCreated }: any) => {
  const [form, setForm] = useState({ nombre: '', sku: '', categoria_id: '', precio_venta: '', impuesto: '0' })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.nombre || !form.precio_venta) return
    setSaving(true)
    try {
      const prod = await productos.createProducto({
        nombre: form.nombre,
        sku_base: form.sku,
        categoria_id: form.categoria_id || null,
        tipo: 'FISICO'
      })
      
      await productos.createVariante({
        producto_id: prod.id,
        sku: form.sku || `${prod.nombre.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*1000)}`,
        precio_venta: Number(form.precio_venta),
        impuesto_porcentaje: Number(form.impuesto)
      })

      onCreated()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between">
           <h3 className="text-white text-sm font-black uppercase tracking-widest">Nuevo Producto</h3>
           <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-8 space-y-6">
           <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Nombre del Producto</label>
                 <input 
                   autoFocus
                   type="text" 
                   value={form.nombre}
                   onChange={e => setForm({...form, nombre: e.target.value})}
                   placeholder="Ej: Camiseta Oversize Milan"
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                 />
              </div>
              <div>
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Referencia (SKU)</label>
                 <input 
                   type="text" 
                   value={form.sku}
                   onChange={e => setForm({...form, sku: e.target.value})}
                   placeholder="MIL-001"
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                 />
              </div>
              <div>
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Categoría</label>
                 <select 
                   value={form.categoria_id}
                   onChange={e => setForm({...form, categoria_id: e.target.value})}
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                 >
                    <option value="">Seleccionar...</option>
                    {cats.map((c: any) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                 </select>
              </div>
              <div>
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Precio de Venta</label>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input 
                      type="number" 
                      value={form.precio_venta}
                      onChange={e => setForm({...form, precio_venta: e.target.value})}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                 </div>
              </div>
              <div>
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Impuesto (%)</label>
                 <select 
                   value={form.impuesto}
                   onChange={e => setForm({...form, impuesto: e.target.value})}
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                 >
                    <option value="0">Exento (0%)</option>
                    <option value="19">IVA (19%)</option>
                    <option value="8">INC (8%)</option>
                 </select>
              </div>
           </div>
        </div>

        <div className="p-6 bg-gray-50 flex gap-3">
           <button 
             onClick={onClose}
             className="flex-1 py-3 border border-gray-200 rounded text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
           >
             Cancelar
           </button>
           <button 
             onClick={handleSave}
             disabled={saving}
             className="flex-1 py-3 bg-[#62cb31] text-white rounded font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-[#58b72c] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
           >
             {saving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
             <span>{saving ? 'Guardando...' : 'Guardar Producto'}</span>
           </button>
        </div>
      </div>
    </div>
  )
}
