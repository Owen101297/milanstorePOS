"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Plus, Edit, Trash2, Upload, AlertCircle, CheckCircle, Image as ImageIcon, ChevronLeft, ChevronRight, Check } from "lucide-react"

// ==========================================
// MOCK DATA & TYPES (Simulan base de datos real)
// ==========================================
type Categoria = { id: string; nombre: string }
type Variante = { id?: string; producto_id?: string; talla: string; color: string; sku: string; codigo_barras: string }
type Producto = {
  id: string
  nombre: string
  descripcion: string
  precio_venta: number
  precio_costo: number
  imagen_url: string | null
  categoria_id: string
  estado: "ACTIVO" | "INACTIVO"
  variantes: Variante[]
}

const MOCK_CATEGORIAS: Categoria[] = [
  { id: "C1", nombre: "Ropa Deportiva" },
  { id: "C2", nombre: "Calzado" },
]

const MOCK_PRODUCTOS: Producto[] = [
  {
    id: "PROD-1",
    nombre: "Tenis Running Ultra",
    descripcion: "Tenis ligeros para correr maratones.",
    precio_costo: 120000,
    precio_venta: 250000,
    imagen_url: null,
    categoria_id: "C2",
    estado: "ACTIVO",
    variantes: [
      { id: "V1", talla: "40", color: "Azul", sku: "TRU-40-AZ", codigo_barras: "12345" },
      { id: "V2", talla: "42", color: "Rojo", sku: "TRU-42-RO", codigo_barras: "12346" },
    ]
  }
]

export default function ProductosGridManager() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("TODAS")
  
  const [page, setPage] = useState(1)
  const itemsPerPage = 5

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProd, setEditingProd] = useState<Producto | null>(null)

  // 1. useEffect: Simular carga de datos (React Query concept)
  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true)
      try {
        // Simulación Supabase const { data, error } = await supabase.from('productos').select('*, variantes(*)')
        await new Promise(resolve => setTimeout(resolve, 800))
        setProductos(MOCK_PRODUCTOS)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDatos()
  }, [])

  // Lógica de Paginación y Filtrado
  const filteredProducts = useMemo(() => {
    return productos.filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.variantes.some(v => v.sku.toLowerCase().includes(search.toLowerCase()))
      const matchCat = catFilter === "TODAS" || p.categoria_id === catFilter
      return matchSearch && matchCat
    })
  }, [productos, search, catFilter])

  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const toggleEstado = (id: string, actual: string) => {
    setProductos(prev => prev.map(p => p.id === id ? { ...p, estado: actual === "ACTIVO" ? "INACTIVO" : "ACTIVO" } : p))
  }

  const handleDelete = (id: string) => {
    if(window.confirm("¿Seguro que deseas eliminar este producto lógicamente?")) {
      setProductos(prev => prev.filter(p => p.id !== id))
    }
  }

  const openForm = (p?: Producto) => {
    setEditingProd(p || null)
    setModalOpen(true)
  }

  const saveProduct = (prod: Producto) => {
    if(editingProd) {
      setProductos(prev => prev.map(p => p.id === prod.id ? prod : p))
    } else {
      setProductos(prev => [{...prod, id: "PROD-" + Date.now()}, ...prev])
    }
    setModalOpen(false)
  }

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen p-6 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Maestro de Productos</h1>
          <p className="text-sm text-slate-500 font-medium">Gestiona tu catálogo, asigna variantes y establece rentabilidad.</p>
        </div>
        <button onClick={() => openForm()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all focus:ring-4 focus:ring-indigo-100">
          <Plus className="w-5 h-5"/> Agregar Producto
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"/>
          <input 
            type="text" value={search} onChange={e => {setSearch(e.target.value); setPage(1)}}
            placeholder="Buscar por Nombre o SKU..."
            className="w-full pl-10 pr-4 py-2 border-none bg-slate-50 focus:bg-white rounded-lg outline-none font-medium text-slate-700 transition"
          />
        </div>
        <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>
        <select 
          value={catFilter} onChange={e => {setCatFilter(e.target.value); setPage(1)}}
          className="px-4 py-2 bg-slate-50 border-none rounded-lg text-slate-700 font-medium focus:ring-0 outline-none"
        >
          <option value="TODAS">Categoría: Todas</option>
          {MOCK_CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>

      {/* ERROR / LOADING */}
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-2 font-bold mb-4"><AlertCircle className="w-5 h-5"/> Error: {error}</div>}
      
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-white border border-slate-100 rounded-xl animate-pulse"></div>)}
        </div>
      ) : (
        <>
          {/* TABLA PRINCIPAL */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Stock / Variants</th>
                  <th className="px-6 py-4">Costos y Precio</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {paginatedProducts.map(p => {
                  const catName = MOCK_CATEGORIAS.find(c => c.id === p.categoria_id)?.nombre || "N/A"
                  const margin = p.precio_venta > 0 ? (((p.precio_venta - p.precio_costo) / p.precio_venta) * 100).toFixed(1) : 0
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden flex-shrink-0">
                            {p.imagen_url ? <img src={p.imagen_url} alt="img" className="w-full h-full object-cover"/> : <ImageIcon className="w-6 h-6"/>}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-base">{p.nombre}</p>
                            <p className="text-xs text-slate-500 font-medium">{catName} • ID: {p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex flex-col gap-1">
                           <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border border-slate-200">{p.variantes.length} Variaciones Físicas</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-500 text-xs line-through mb-0.5">${p.precio_costo.toLocaleString()} (Cost)</div>
                        <div className="font-black text-emerald-600 text-sm">${p.precio_venta.toLocaleString()}</div>
                        <div className="text-[10px] text-indigo-500 font-bold mt-1">Margen: {margin}%</div>
                      </td>
                      <td className="px-6 py-4">
                        <span onClick={() => toggleEstado(p.id, p.estado)} className={`px-2.5 py-1 rounded-md text-xs font-black cursor-pointer border transition-colors ${p.estado === "ACTIVO" ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => openForm(p)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="w-4 h-4"/></button>
                          <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </td>
                    </tr>
                )})}
                {paginatedProducts.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400 font-bold">No se encontraron productos.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm font-medium text-slate-500">Mostrando {((page-1)*itemsPerPage)+1} a {Math.min(page*itemsPerPage, filteredProducts.length)} de {filteredProducts.length}</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(page-1)} className="p-2 border border-slate-200 bg-white rounded-lg disabled:opacity-50"><ChevronLeft className="w-5 h-5 text-slate-600"/></button>
                <div className="flex items-center px-4 font-bold text-slate-600 space-x-1"><span>{page}</span><span className="text-slate-400">/</span><span>{totalPages}</span></div>
                <button disabled={page === totalPages} onClick={() => setPage(page+1)} className="p-2 border border-slate-200 bg-white rounded-lg disabled:opacity-50"><ChevronRight className="w-5 h-5 text-slate-600"/></button>
              </div>
            </div>
          )}
        </>
      )}

      {/* FORMULARIO MODAL */}
      {modalOpen && <FormularioProductos 
         initialData={editingProd} 
         onClose={() => setModalOpen(false)} 
         onSave={saveProduct} 
      />}
    </div>
  )
}

// ==========================================
// COMPONENTE: FORMULARIO DE CREACIÓN/EDICIÓN
// ==========================================
function FormularioProductos({ initialData, onClose, onSave }: { initialData: Producto | null, onClose: () => void, onSave: (p: Producto) => void }) {
  
  // Estado Principal
  const [formData, setFormData] = useState<Producto>(initialData || {
    id: "", nombre: "", descripcion: "", precio_costo: 0, precio_venta: 0, imagen_url: null, categoria_id: "", estado: "ACTIVO", variantes: []
  })
  const [errorMsg, setErrorMsg] = useState("")

  // Margen de Utilidad
  const margen = formData.precio_venta > 0 ? (((formData.precio_venta - formData.precio_costo) / formData.precio_venta) * 100).toFixed(1) : "0"

  // Auto-generador de SKU para variantes
  const generateSKU = (talla: string, color: string) => {
    if(!formData.nombre) return ""
    const base = formData.nombre.substring(0,3).toUpperCase();
    const t = talla ? talla.substring(0,2).toUpperCase() : "XS";
    const c = color ? color.substring(0,3).toUpperCase() : "X";
    return `${base}-${t}-${c}-${Math.floor(Math.random()*1000)}`
  }

  const handleAddVariant = () => {
    setFormData({
      ...formData, 
      variantes: [...formData.variantes, { talla: "", color: "", sku: "", codigo_barras: "" }]
    })
  }

  const updateVariant = (index: number, key: keyof Variante, val: string) => {
    const newVars = [...formData.variantes]
    newVars[index] = { ...newVars[index], [key]: val }

    // Generar SKU automáticamente si cambian dimensiones
    if(key === 'talla' || key === 'color') {
       newVars[index].sku = generateSKU(newVars[index].talla, newVars[index].color)
    }

    setFormData({...formData, variantes: newVars})
  }

  const removeVariant = (idx: number) => {
    setFormData({...formData, variantes: formData.variantes.filter((_, i) => i !== idx)})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    // Validaciones
    if(!formData.nombre.trim()) return setErrorMsg("El nombre es requerido.")
    if(!formData.categoria_id) return setErrorMsg("Selecciona una categoría válida.")
    if(formData.precio_venta <= formData.precio_costo) return setErrorMsg("El precio de venta debe ser mayor al costo.")
    if(formData.variantes.length === 0) return setErrorMsg("Debes agregar al menos una variante (Talla/Color).")
    
    // Validación SKU duplicados
    const skus = formData.variantes.map(v => v.sku)
    if(new Set(skus).size !== skus.length) return setErrorMsg("Existen SKUs duplicados en las variantes.")

    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl flex flex-col my-auto max-h-[90vh]">
        
        {/* Cabecera Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white rounded-t-2xl sticky top-0 z-10">
          <h2 className="text-xl font-black text-slate-800">{initialData ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5"/> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} id="prod-form" className="space-y-8">
            
            {/* SECCIÓN 1: BÁSICOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Nombre del Producto</label>
                  <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium mt-1" placeholder="Ej. Zapatillas Urbanas..." required/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Descripción</label>
                  <textarea value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-medium mt-1 min-h-[100px] resize-none" placeholder="Descripción física..."/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Categoría</label>
                  <select value={formData.categoria_id} onChange={e => setFormData({...formData, categoria_id: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-medium mt-1 bg-white" required>
                    <option value="" disabled>Seleccionar una...</option>
                    {MOCK_CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>

              {/* UPLOAD E IMAGEN */}
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl hover:bg-slate-100 transition cursor-pointer group">
                  <div className="w-16 h-16 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="font-bold text-slate-700">Subir Imagen a Supabase</p>
                  <p className="text-xs font-medium text-slate-400 mt-1 text-center">Permite PNG, JPG. Max 2MB.</p>
                  <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>

            {/* SECCIÓN 2: PRECIOS Y MARGEN */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
               <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Estructura de Precios</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">Costo ($) <span className="text-red-400">*</span></label>
                   <input type="number" min="0" value={formData.precio_costo} onChange={e => setFormData({...formData, precio_costo: Number(e.target.value)})} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 outline-none font-black text-slate-700 mt-1" required/>
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">Venta ($) <span className="text-red-400">*</span></label>
                   <input type="number" min="0" value={formData.precio_venta} onChange={e => setFormData({...formData, precio_venta: Number(e.target.value)})} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 outline-none font-black text-emerald-600 mt-1" required/>
                 </div>
                 <div className="bg-indigo-600 rounded-xl p-4 text-white shadow-lg shadow-indigo-600/30 flex flex-col justify-center translate-y-2">
                    <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest block mb-0.5">Margen Generado</span>
                    <span className="text-3xl font-black">{margen}%</span>
                 </div>
               </div>
            </div>

            {/* SECCIÓN 3: VARIANTES CRÍTICO */}
            <div>
               <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                 <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Combinaciones Físicas (Variantes)</h3>
                 <button type="button" onClick={handleAddVariant} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"><Plus className="w-4 h-4"/> Añadir Variante</button>
               </div>
               
               <div className="bg-white border flex flex-col shadow-sm border-slate-200 rounded-xl overflow-hidden">
                 <div className="grid grid-cols-12 gap-2 bg-slate-100 p-3 text-xs font-bold text-slate-500 uppercase tracking-wider items-center">
                    <div className="col-span-2">Talla</div>
                    <div className="col-span-3">Color</div>
                    <div className="col-span-3">Auto SKU</div>
                    <div className="col-span-3">EAN / Código Barras</div>
                    <div className="col-span-1 text-center">Acc</div>
                 </div>
                 <div className="divide-y divide-slate-100">
                    {formData.variantes.map((v, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-slate-50 transition">
                         <div className="col-span-2"><input type="text" value={v.talla} onChange={e => updateVariant(idx, 'talla', e.target.value)} placeholder="Ej. M" className="w-full px-2 py-1.5 border border-slate-300 rounded focus:border-indigo-500 outline-none uppercase font-bold text-sm" required/></div>
                         <div className="col-span-3"><input type="text" value={v.color} onChange={e => updateVariant(idx, 'color', e.target.value)} placeholder="Ej. Rojo Pasión" className="w-full px-2 py-1.5 border border-slate-300 rounded focus:border-indigo-500 outline-none font-medium text-sm" required/></div>
                         <div className="col-span-3"><input type="text" value={v.sku} onChange={e => updateVariant(idx, 'sku', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 rounded focus:border-indigo-500 outline-none font-mono text-xs text-indigo-600 font-bold" required/></div>
                         <div className="col-span-3"><input type="text" value={v.codigo_barras} onChange={e => updateVariant(idx, 'codigo_barras', e.target.value)} placeholder="Lector Scanner..." className="w-full px-2 py-1.5 border border-slate-300 rounded focus:border-indigo-500 outline-none font-mono text-xs"/></div>
                         <div className="col-span-1 flex justify-center"><button type="button" onClick={() => removeVariant(idx)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"><Trash2 className="w-4 h-4"/></button></div>
                      </div>
                    ))}
                    {formData.variantes.length === 0 && <div className="p-6 text-center text-slate-400 font-bold text-sm bg-slate-50">Debes asociar al menos una variante para el inventario.</div>}
                 </div>
               </div>
            </div>
            
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition">Cancelar</button>
          <button type="submit" form="prod-form" className="px-6 py-2.5 font-bold text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition flex items-center gap-2"><Check className="w-4 h-4"/> Confirmar y Guardar</button>
        </div>

      </div>
    </div>
  )
}
