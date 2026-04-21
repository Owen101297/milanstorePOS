"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Plus, UploadCloud, Download, Image as ImageIcon, Filter, Layers, BarChart, X, Check, FileDown, FileUp, AlertCircle, Edit2, Archive } from "lucide-react"

// Tipos de Datos
type Variante = {
  id: string
  talla: string
  color: string
  sku: string
  codigoBarras: string
  costo: number
  precio: number
  oferta: number | null
  stockActual: number
}

type Producto = {
  id: string
  nombre: string
  skuBase: string
  categoria: string
  marca: string
  imagenUrl: string | null
  variantes: Variante[]
}

// Datos Mock (Simulan lectura a Supabase tras hidratación)
const categorias = ["Camisetas", "Pantalones", "Calzado", "Accesorios"]

const initialProducts: Producto[] = [
  {
    id: "P001",
    nombre: "Chaqueta Denim Vintage",
    skuBase: "CH-DEN",
    categoria: "Chaquetas",
    marca: "Levi's",
    imagenUrl: null,
    variantes: [
      { id: "v1", talla: "M", color: "Azul Claro", sku: "CH-DEN-M-AZ", codigoBarras: "7701234567890", costo: 65000, precio: 150000, oferta: null, stockActual: 4 },
      { id: "v2", talla: "L", color: "Azul Claro", sku: "CH-DEN-L-AZ", codigoBarras: "7701234567891", costo: 65000, precio: 150000, oferta: 130000, stockActual: 1 },
    ]
  }
]

export default function ProductosManager() {
  const [productos, setProductos] = useState<Producto[]>(initialProducts)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroAlerta, setFiltroAlerta] = useState(false) // Stock Bajo
  
  // Estado UI
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Skeletons de Carga Fake (Efecto WOW)
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  // Filtrado reactivo (Debounce simulado mediante dependencia directa en renders por simplicidad visual local)
  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const matchText = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.skuBase.toLowerCase().includes(searchTerm.toLowerCase())
      const matchStock = filtroAlerta ? p.variantes.some(v => v.stockActual <= 3) : true;
      return matchText && matchStock;
    })
  }, [productos, searchTerm, filtroAlerta])

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* CABECERA Y DASHBOARD COMPACTO */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
         <div>
           <h2 className="text-2xl font-black text-gray-900 tracking-tight">Catálogo y Variantes</h2>
           <p className="text-sm text-gray-500 font-medium">Gestiona tu Book de Precios, Códigos de Barra y Margen de Utilidad.</p>
         </div>
         <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-100 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-bold shadow-sm">
                <FileDown className="w-4 h-4 text-emerald-600" /> Exportar a Excel
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-100 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-bold shadow-sm">
                <FileUp className="w-4 h-4 text-blue-600" /> Importar CSV
             </button>
             <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition shadow-lg text-sm font-bold ml-2">
                <Plus className="w-5 h-5" /> Añadir Producto
             </button>
         </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
         <div className="relative flex-1">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
           <input 
             type="text" 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             placeholder="Buscar producto, categoría o SKU base..." 
             className="w-full pl-11 pr-4 py-3 bg-transparent text-sm font-semibold focus:outline-none text-gray-800 placeholder-gray-400"
           />
         </div>
         <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
         <button 
           onClick={() => setFiltroAlerta(!filtroAlerta)}
           className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition mr-2
             ${filtroAlerta ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
         >
           <AlertCircle className="w-4 h-4" /> Stock Bajo / Agotado
         </button>
         <button className="flex items-center justify-center p-2 rounded-xl text-gray-400 hover:bg-gray-50 transition mr-2">
           <Filter className="w-5 h-5" />
         </button>
      </div>

      {/* GRILLA DE PRODUCTOS (Master-Detail Style) */}
      {loading ? (
         <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="animate-pulse h-28 bg-gray-100 rounded-2xl"></div>)}
         </div>
      ) : (
         <div className="space-y-4">
           {productosFiltrados.map((prod) => (
              <ProductCard key={prod.id} producto={prod} onEdit={() => setShowModal(true)} />
           ))}
           {productosFiltrados.length === 0 && (
              <div className="py-16 text-center bg-white border-2 border-dashed border-gray-200 rounded-3xl">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Archive className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-500 text-lg">No se hallaron coincidencias.</h3>
                <p className="text-gray-400 text-sm">Ajusta tus filtros de búsqueda.</p>
              </div>
           )}
         </div>
      )}

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      {showModal && <FormularioProducto closeModal={() => setShowModal(false)} categorias={categorias} />}
      
    </div>
  )
}

// -------------------------------------------------------------
// UI: TARJETA DE PRODUCTO EXTENDIDA (Muestra Variantes Inline)
// -------------------------------------------------------------
function ProductCard({ producto, onEdit }: { producto: Producto, onEdit: () => void }) {
  const stockGlobal = producto.variantes.reduce((acc, v) => acc + v.stockActual, 0)
  const isAgotado = stockGlobal === 0;

  const formatCOP = (v: number) => "$" + v.toLocaleString("es-CO")

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row group transition-all hover:shadow-md hover:border-gray-300">
      
      {/* Área de Imagen y Datos Principales */}
      <div className="w-full md:w-80 p-5 bg-gray-50/50 flex gap-4 items-start border-r border-gray-100">
        <div className="w-20 h-20 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-300 overflow-hidden">
          {producto.imagenUrl ? <img src={producto.imagenUrl} alt={producto.nombre} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8" />}
        </div>
        <div>
           <div className="flex gap-2 mb-1">
             <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] uppercase font-black tracking-widest rounded">{producto.categoria}</span>
             <span className="px-2 py-0.5 border border-gray-300 text-gray-400 text-[10px] uppercase font-bold tracking-widest rounded">{producto.marca}</span>
           </div>
           <h3 className="font-black text-gray-900 text-base leading-tight mb-0.5 group-hover:text-blue-600 transition-colors">{producto.nombre}</h3>
           <p className="text-xs font-mono text-gray-500 mb-3">{producto.skuBase}</p>
           
           <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${isAgotado ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
              <Layers className="w-3.5 h-3.5"/> Global: {stockGlobal} Unds
           </div>
        </div>
      </div>

      {/* Área de Variantes */}
      <div className="flex-1 p-5 overflow-x-auto">
         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Inventario Físico (Desglose de Variantes)</h4>
         <table className="w-full text-sm">
           <thead>
             <tr className="text-left text-[11px] font-black text-gray-500 uppercase">
               <th className="pb-2">Talla / Color</th>
               <th className="pb-2">SKU Físico</th>
               <th className="pb-2">Costo</th>
               <th className="pb-2 text-blue-600">P. Venta</th>
               <th className="pb-2 text-center text-red-500">Stock Local</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             {producto.variantes.map(v => (
               <tr key={v.id} className="hover:bg-gray-50">
                 <td className="py-2.5">
                   <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded flex items-center justify-center bg-gray-900 text-white font-black text-xs">{v.talla}</span>
                      <span className="font-semibold text-gray-600 text-xs">{v.color}</span>
                   </div>
                 </td>
                 <td className="py-2.5 font-mono text-xs text-gray-400">{v.sku}</td>
                 <td className="py-2.5 font-medium text-gray-600">{formatCOP(v.costo)}</td>
                 <td className="py-2.5">
                    <span className={`font-black ${v.oferta ? 'text-green-600' : 'text-blue-600'}`}>{formatCOP(v.oferta || v.precio)}</span>
                    {v.oferta && <span className="block text-[10px] text-gray-400 line-through">{formatCOP(v.precio)}</span>}
                 </td>
                 <td className="py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-black ${v.stockActual <= 3 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {v.stockActual}
                    </span>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>

      {/* Botón Acción Lateral */}
      <div className="w-16 border-l border-gray-100 bg-gray-50/30 flex items-center justify-center">
         <button onClick={onEdit} className="w-10 h-10 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm text-gray-400 hover:text-blue-600 flex items-center justify-center transition-all">
           <Edit2 className="w-5 h-5"/>
         </button>
      </div>

    </div>
  )
}

// -------------------------------------------------------------
// MODAL: FORMULARIO ROBUSTO (Simulación Zod + Margen en Vivo)
// -------------------------------------------------------------
function FormularioProducto({ closeModal, categorias }: { closeModal: () => void, categorias: string[] }) {
  // Manejo Básico Form (Evitando librerías externas complejas en este sandbox)
  const [nombre, setNombre] = useState("")
  const [costoRef, setCostoRef] = useState<number>(0)
  const [precioVenta, setPrecioVenta] = useState<number>(0)
  
  // Utilidad Financiera
  const margenUtilidad = precioVenta > 0 ? (((precioVenta - costoRef) / precioVenta) * 100).toFixed(1) : "0"

  const [saving, setSaving] = useState(false)

  const handleGuardar = () => {
    // Aquí iría la validación de Zod, ej: ProductSchema.parse({nombre, costo...})
    if (!nombre) return alert("El nombre del producto es obligatorio (Aserción Zod simulada).")
    
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      closeModal()
      alert("Flujo multipart subido: Producto insertado + Variantes creadas + Storage guardado.")
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 overflow-y-auto">
       <div className="bg-white max-w-[1000px] w-full rounded-[2rem] shadow-2xl flex flex-col my-auto max-h-[90vh]">
          
          <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md rounded-t-[2rem] z-10">
             <div>
               <h2 className="text-xl font-black text-gray-800">Crear Nuevo Producto</h2>
               <p className="text-sm font-medium text-gray-500">Completa la ficha técnica y genera sus variantes de inventario.</p>
             </div>
             <button onClick={closeModal} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"><X className="w-5 h-5"/></button>
          </div>

          <div className="p-8 flex-1 overflow-y-auto">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA IZQUIERDA: Ficha Principal e Imagen */}
                <div className="lg:col-span-1 space-y-5">
                   
                   <div className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-colors cursor-pointer group">
                      <div className="p-4 bg-white shadow-sm rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <p className="font-bold text-sm">Subir Imagen</p>
                      <p className="text-[10px] font-medium text-gray-400 text-center px-4 mt-1">Supabase Storage se encarga del redimensionamiento automático.</p>
                   </div>

                   <div>
                     <label className="text-xs font-black uppercase text-gray-500 mb-1.5 block">Nombre del Producto *</label>
                     <input value={nombre} onChange={e => setNombre(e.target.value)} type="text" className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl text-sm font-bold text-gray-800 outline-none transition" placeholder="Ej. Air Force 1 Blancas" required />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black uppercase text-gray-500 mb-1.5 block">Marca</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl text-sm font-semibold outline-none" placeholder="Nike" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase text-gray-500 mb-1.5 block">SKU Base</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl text-sm font-mono uppercase outline-none" placeholder="NI-AF1" />
                      </div>
                   </div>

                   <div>
                     <label className="text-xs font-black uppercase text-gray-500 mb-1.5 block">Categoría Base</label>
                     <select className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl text-sm font-bold text-gray-800 outline-none">
                        <option value="">Selecciona...</option>
                        {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                   </div>

                </div>

                {/* COLUMNA DERECHA: Engine de Precios y Variantes */}
                <div className="lg:col-span-2 space-y-6">
                   
                   {/* Tarjeta de Simulador Financiero */}
                   <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 text-white shadow-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart className="w-5 h-5 text-blue-300" />
                        <h4 className="font-black text-sm uppercase tracking-widest text-blue-100">Reglas de Precio Máster</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-6 relative">
                         <div>
                           <label className="text-[10px] font-bold text-indigo-300 uppercase block mb-1">Costo ($)</label>
                           <input type="number" value={costoRef || ''} onChange={e => setCostoRef(Number(e.target.value))} className="w-full bg-indigo-950/50 border border-indigo-700/50 rounded-lg px-3 py-2 text-lg font-black outline-none focus:border-blue-400" placeholder="0" />
                         </div>
                         <div>
                           <label className="text-[10px] font-bold text-indigo-300 uppercase block mb-1">Precio Venta ($)</label>
                           <input type="number" value={precioVenta || ''} onChange={e => setPrecioVenta(Number(e.target.value))} className="w-full bg-indigo-950/50 border border-indigo-700/50 rounded-lg px-3 py-2 text-lg font-black text-green-400 outline-none focus:border-green-400" placeholder="0" />
                         </div>
                         <div className="flex flex-col justify-center">
                           <p className="text-[10px] font-bold text-indigo-300 uppercase mb-1">Margen Referencia</p>
                           <p className="text-3xl font-black text-white">{margenUtilidad}%</p>
                           <p className="text-[10px] text-indigo-200 mt-1">Beneficio Neto: ${(precioVenta - costoRef).toLocaleString()}</p>
                         </div>
                      </div>
                   </div>

                   {/* Editor de Variantes (Matriz de SKU Físico) */}
                   <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                         <div>
                           <h4 className="font-black text-gray-800 uppercase tracking-widest text-sm">Matriz de Variaciones</h4>
                           <p className="text-[11px] text-gray-500 font-medium">Cada fila genera un elemento único de stock (Código de Barras Independiente).</p>
                         </div>
                         <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black">
                            <Plus className="w-3 h-3"/> Agregar Variante
                         </button>
                      </div>

                      <div className="space-y-3">
                         {/* Fila Falsa Ilustrativa 1 */}
                         <div className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                            <div className="col-span-2"><input type="text" placeholder="Talla (Ej. L)" className="w-full text-xs font-bold px-2 py-2 rounded-lg border border-gray-200 bg-white" defaultValue="US 9.5" /></div>
                            <div className="col-span-3"><input type="text" placeholder="Color/Variante" className="w-full text-xs font-bold px-2 py-2 rounded-lg border border-gray-200 bg-white" defaultValue="Blanco Clásico" /></div>
                            <div className="col-span-4"><input type="text" placeholder="Código de Barras (EAN)" className="w-full text-xs font-mono px-2 py-2 rounded-lg border border-gray-200 bg-white" defaultValue="00194274844358" /></div>
                            <div className="col-span-2 text-center bg-white border border-gray-200 rounded-lg py-1.5">
                              <span className="text-[9px] font-black text-gray-400 block uppercase">Stock S1</span>
                              <span className="text-sm font-black text-gray-800">0</span>
                            </div>
                            <div className="col-span-1 flex justify-center"><button className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button></div>
                         </div>
                         {/* Fila Falsa Ilustrativa 2 */}
                         <div className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                            <div className="col-span-2"><input type="text" placeholder="Talla (Ej. L)" className="w-full text-xs font-bold px-2 py-2 rounded-lg border border-gray-200 bg-white" defaultValue="US 10.0" /></div>
                            <div className="col-span-3"><input type="text" placeholder="Color/Variante" className="w-full text-xs font-bold px-2 py-2 rounded-lg border border-gray-200 bg-white" defaultValue="Blanco Clásico" /></div>
                            <div className="col-span-4"><input type="text" placeholder="Código de Barras (EAN)" className="w-full text-xs font-mono px-2 py-2 rounded-lg border border-gray-200 bg-white" defaultValue="" /></div>
                            <div className="col-span-2 text-center bg-white border border-gray-200 rounded-lg py-1.5">
                              <span className="text-[9px] font-black text-gray-400 block uppercase">Stock S1</span>
                              <span className="text-sm font-black text-gray-800">0</span>
                            </div>
                            <div className="col-span-1 flex justify-center"><button className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button></div>
                         </div>
                      </div>
                   </div>

                </div>
             </div>
          </div>

          <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 rounded-b-[2rem] flex items-center justify-between sticky bottom-0">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <Check className="w-4 h-4 text-green-500" /> Autoguardado Zod Draft habilitado
             </div>
             <div className="flex items-center gap-3">
               <button onClick={closeModal} className="px-6 py-3 font-bold text-gray-600 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl transition">Cancelar Cambios</button>
               <button onClick={handleGuardar} disabled={saving} className="px-8 py-3 font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/30 transition disabled:opacity-70 flex justify-center items-center gap-2">
                 {saving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : "Publicar Producto a Base de Datos"}
               </button>
             </div>
          </div>
       </div>
    </div>
  )
}
