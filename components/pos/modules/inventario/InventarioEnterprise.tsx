"use client"

import { useState, useEffect } from "react"
import { Search, Server, DollarSign, Eye, RefreshCw, BarChart2, Shield, Calendar, Layers, PenTool, Database, Plus, Check, AlertCircle, Filter, Loader2, X } from "lucide-react"
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Types Enterprise
type Movimiento = {
  id: string
  created_at: string
  variante_id: string
  sede_id: string
  tipo_mov: string
  cantidad_mov: number
  stock_anterior: number
  stock_nuevo: number
  costo_unitario: number | null
  referencia_tipo: string | null
  usuario_id: string | null
  variante?: { nombre: string; sku: string }
  usuario?: { nombre_completo: string }
  sede?: { nombre: string }
}

type InfoProduccion = { id: string; req: string; status: 'EN ESPERA' | 'EN PROCESO' | 'TERMINADO'; progreso: number; insumos_val: number }
type Promo = { id: string; sedes: string[]; regla: string; expires: string; isActive: boolean }

// Mock data para cuando no hay datos en Supabase
const mockKardex: Movimiento[] = [
  { id: "KX-9004", created_at: new Date().toISOString(), variante_id: "1", sede_id: "1", tipo_mov: "COMPRA", cantidad_mov: 50, stock_anterior: 2, stock_nuevo: 52, costo_unitario: 34500, referencia_tipo: null, usuario_id: null, variante: { nombre: "PROD-DENIM-ROJO", sku: "DEN-ROJ-001" }, usuario: { nombre_completo: "Admin - Sede Principal" }, sede: { nombre: "Tienda Principal" } },
  { id: "KX-9003", created_at: new Date(Date.now() - 3600000).toISOString(), variante_id: "2", sede_id: "1", tipo_mov: "VENTA", cantidad_mov: -1, stock_anterior: 18, stock_nuevo: 17, costo_unitario: 31000, referencia_tipo: "VENTA", usuario_id: null, variante: { nombre: "PROD-DENIM-AZUL", sku: "DEN-AZUL-001" }, usuario: { nombre_completo: "Cajero Juan - Sede Norte" }, sede: { nombre: "Sede Norte" } },
  { id: "KX-9002", created_at: new Date(Date.now() - 86400000).toISOString(), variante_id: "1", sede_id: "1", tipo_mov: "AJUSTE", cantidad_mov: -2, stock_anterior: 4, stock_nuevo: 2, costo_unitario: 34500, referencia_tipo: "AJUSTE", usuario_id: null, variante: { nombre: "PROD-DENIM-ROJO", sku: "DEN-ROJ-001" }, usuario: { nombre_completo: "Auditor J. - Sede Principal" }, sede: { nombre: "Tienda Principal" } },
]

export default function InventarioEnterprise() {
  const [activeTab, setActiveTab] = useState<number>(3) // Por defecto en Kardex (El más avanzado)

  const TABS = [
    { id: 1, name: "Matriz de Costeo (Productos)", icon: Layers },
    { id: 2, name: "Jerarquía e Impuestos", icon: Server },
    { id: 3, name: "Kardex Forense (Inmutable)", icon: Database },
    { id: 4, name: "Libro Omnicanal (Precios/Sede)", icon: DollarSign },
    { id: 5, name: "Engine de Producción", icon: PenTool },
    { id: 6, name: "Auditorías (Conteo Ciego)", icon: Shield },
  ]

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50 border border-slate-200 rounded-3xl mx-2 shadow-2xl font-sans">
       
       {/* SIDEBAR NAVEGADOR ENTERPRISE */}
       <div className="w-80 bg-white border-r border-slate-200 flex flex-col pt-6 pb-4 shadow-sm">
          <div className="px-6 mb-6">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 leading-tight">Milan ERP</h2>
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Enterprise Edition</p>
                </div>
             </div>
             <p className="text-xs text-slate-500 mt-3 border-b border-slate-100 pb-4">Consola administrativa nivel 3. Las alteraciones accionan triggers automáticos en PostgreSQL.</p>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 space-y-1">
             {TABS.map(t => (
               <button 
                 key={t.id} onClick={() => setActiveTab(t.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-sm
                   ${activeTab === t.id ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}
                 `}
               >
                 <t.icon className={`w-5 h-5 ${activeTab === t.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                 {t.name}
               </button>
             ))}
          </nav>
       </div>

       {/* MAIN CONTENT ERP */}
       <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
          {activeTab === 3 && <KardexForense />}
          {activeTab === 4 && <LibroOmnicanal />}
          {activeTab === 5 && <ModuloProduccion />}
          {activeTab === 6 && <AuditoriasCiegas />}
          
          {(activeTab === 1 || activeTab === 2) && (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Server className="w-16 h-16 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-slate-600">Módulo en Sincronización</h3>
                <p className="text-sm">Conectando la estructura de árboles relacionales con Supabase...</p>
             </div>
          )}
       </div>

    </div>
  )
}


// ==========================================
// 3. KARDEX INMUTABLE (Auditoría Forense)
// ==========================================
function KardexForense() {
  const [kardexData, setKardexData] = useState<Movimiento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)
  
  // Filtros
  const [filtroTipo, setFiltroTipo] = useState<string>("")
  const [filtroFecha, setFiltroFecha] = useState<string>("")
  const [busqueda, setBusqueda] = useState<string>("")

  const formatCOP = (v: number) => "$ " + Math.round(v || 0).toLocaleString("es-CO")
  const formatFecha = (fecha: string) => {
    const d = new Date(fecha)
    return d.toLocaleDateString("es-CO", { day: '2-digit', month: 'short', year: 'numeric' }) + 
           ' ' + d.toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit' })
  }

  useEffect(() => {
    fetchKardex()
  }, [])

  const fetchKardex = async () => {
    setLoading(true)
    setError(null)
    
    // Always show mock data first for demo
    setTimeout(() => {
      setUseMockData(true)
      setKardexData(mockKardex)
      setLoading(false)
    }, 500)
    
    // Try to fetch from Supabase in background
    try {
      const { data, error: err } = await supabase
        .from('kardex')
        .select(`
          *,
          variante:variantes(id, nombre, sku),
          usuario:usuario_id(id, nombre_completo),
          sede:sede_id(id, nombre)
        `)
        .order('created_at', { ascending: false })
        .limit(200)

      if (!err && data && data.length > 0) {
        console.log("Using real data from Supabase:", data.length)
        setKardexData(data as any)
        setUseMockData(false)
      }
    } catch (err: any) {
      console.warn("Supabase unavailable, using mock data")
    }
  }

  // Filtrar datos
  const kardexFiltrado = kardexData.filter(k => {
    if (filtroTipo && k.tipo_mov !== filtroTipo) return false
    if (busqueda) {
      const search = busqueda.toLowerCase()
      const matchVariante = k.variante?.nombre?.toLowerCase().includes(search)
      const matchSku = k.variante?.sku?.toLowerCase().includes(search)
      const matchUsuario = k.usuario?.nombre_completo?.toLowerCase().includes(search)
      if (!matchVariante && !matchSku && !matchUsuario) return false
    }
    if (filtroFecha) {
      const fechaMov = new Date(k.created_at)
      const hoy = new Date()
      const fechaFiltro = new Date(filtroFecha)
      
      if (filtroFecha === 'hoy') {
        if (fechaMov.toDateString() !== hoy.toDateString()) return false
      } else if (filtroFecha === 'semana') {
        const semanaAtras = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)
        if (fechaMov < semanaAtras) return false
      } else if (filtroFecha === 'mes') {
        const mesAtras = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000)
        if (fechaMov < mesAtras) return false
      }
    }
    return true
  })

  // Calcular totales
  const totalCostoAuditado = kardexFiltrado.reduce((acc, k) => {
    if (k.costo_unitario && k.tipo_mov === 'COMPRA') {
      return acc + (k.costo_unitario * Math.abs(k.cantidad_mov))
    }
    return acc
  }, 0)

  const totalInconsistencias = kardexFiltrado
    .filter(k => k.tipo_mov === 'AJUSTE')
    .reduce((acc, k) => acc + k.cantidad_mov, 0)

  const tiposMovimiento = ["COMPRA", "VENTA", "AJUSTE", "TRASLADO_IN", "TRASLADO_OUT", "PRODUCCION", "DEVOLUCION"]

  const limpiarFiltros = () => {
    setFiltroTipo("")
    setFiltroFecha("")
    setBusqueda("")
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Bitácora Transaccional y Costeos</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Registros inmutables validados por Triggers Postgres.
            {useMockData && <span className="ml-2 text-amber-600 font-bold">(Modo Demo - Sin datos en DB)</span>}
          </p>
        </div>
        <button 
          onClick={fetchKardex}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase">Filtros:</span>
          </div>
          
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por producto, SKU o usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
          >
            <option value="">Todos los tipos</option>
            {tiposMovimiento.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
          >
            <option value="">Todas las fechas</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Última semana</option>
            <option value="mes">Último mes</option>
          </select>

          {(filtroTipo || filtroFecha || busqueda) && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>
        
        <div className="mt-3 text-xs text-slate-500">
          Mostrando <span className="font-bold text-indigo-600">{kardexFiltrado.length}</span> de <span className="font-bold">{kardexData.length}</span> registros
        </div>
      </div>

      {/* Totales */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Costo Total Auditado</p>
           <h3 className="text-3xl font-black text-indigo-950">{formatCOP(totalCostoAuditado)}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
           <p className="text-xs font-bold text-red-500 tracking-widest uppercase mb-1">Inconsistencias (Ajustes)</p>
           <h3 className={`text-3xl font-black ${totalInconsistencias < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
             {totalInconsistencias > 0 ? '+' : ''}{totalInconsistencias} Unidades
           </h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
           <p className="text-xs font-bold text-emerald-600 tracking-widest uppercase mb-1">Total Movimientos</p>
           <h3 className="text-3xl font-black text-emerald-950">{kardexFiltrado.length}</h3>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border text-sm border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
            <p className="font-medium">Cargando movimientos del Kardex...</p>
          </div>
        ) : kardexFiltrado.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Database className="w-12 h-12 mb-3 opacity-50" />
            <p className="font-medium">No hay movimientos que coincidan con los filtros</p>
            <button onClick={limpiarFiltros} className="mt-2 text-indigo-600 font-bold text-sm hover:underline">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <table className="w-full text-left">
             <thead className="bg-slate-900 text-white font-bold text-[10px] tracking-widest uppercase">
               <tr>
                 <th className="px-5 py-4">ID</th>
                 <th className="px-5 py-4">Fecha</th>
                 <th className="px-5 py-4">Usuario</th>
                 <th className="px-5 py-4">Producto / SKU</th>
                 <th className="px-5 py-4">Tipo Movimiento</th>
                 <th className="px-5 py-4 text-center">Stock</th>
                 <th className="px-5 py-4">Costo Unit.</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {kardexFiltrado.map(k => (
                 <tr key={k.id} className="hover:bg-slate-50">
                   <td className="px-5 py-4 font-mono text-xs font-bold text-slate-400">{k.id.slice(0, 8)}</td>
                   <td className="px-5 py-4">
                      <div className="font-bold text-slate-700">{k.usuario?.nombre_completo || 'Sistema'}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3"/> 
                        {formatFecha(k.created_at)}
                      </div>
                   </td>
                   <td className="px-5 py-4">
                     <div className="font-bold text-slate-900 text-xs">{k.sede?.nombre || 'N/A'}</div>
                   </td>
                   <td className="px-5 py-4">
                     <div className="font-bold text-slate-900 text-xs">{k.variante?.nombre || 'N/A'}</div>
                     <div className="text-xs text-slate-500 font-mono">{k.variante?.sku || 'N/A'}</div>
                   </td>
                   <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded inline-block font-black text-[11px] uppercase tracking-wider 
                        ${k.tipo_mov === 'COMPRA' || k.tipo_mov === 'TRASLADO_IN' ? 'bg-emerald-100 text-emerald-700' : 
                          k.tipo_mov === 'VENTA' || k.tipo_mov === 'TRASLADO_OUT' ? 'bg-blue-100 text-blue-700' : 
                          'bg-red-100 text-red-700'}`}>
                        {k.tipo_mov} ({k.cantidad_mov > 0 ? `+${k.cantidad_mov}` : k.cantidad_mov})
                      </span>
                   </td>
                   <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold bg-slate-50 px-2 py-1 rounded border border-slate-200">
                         <span className="text-slate-400">{k.stock_anterior}</span>
                         <span className="text-slate-300">→</span>
                         <span className={k.stock_nuevo < k.stock_anterior ? 'text-red-500' : 'text-emerald-500'}>{k.stock_nuevo}</span>
                      </div>
                   </td>
                   <td className="px-5 py-4 font-black text-slate-800">
                     {k.costo_unitario ? formatCOP(k.costo_unitario) : '-'}
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ==========================================
// 4. LIBRO DE PRECIOS OMNICANAL
// ==========================================
function LibroOmnicanal() {
  const promos: Promo[] = [
    { id: "PRM-1", sedes: ['BODEGA_ONLINE', 'SEDE_NORTE'], regla: "Lleva 3 por $120.000", expires: "2026-11-30", isActive: true }
  ]
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-center">
         <div>
          <h2 className="text-2xl font-black text-slate-900">Estrategia Omnicanal</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Reglas de descuento de API, escalados por volumen y sub-precios geográficos.</p>
         </div>
         <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm uppercase tracking-wider text-xs"><Plus className="w-4 h-4"/> Nva. Promoción</button>
       </div>
       
       <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
             <div className="space-y-4 max-w-lg">
                <span className="px-3 py-1 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded-lg text-xs font-black tracking-widest uppercase">Motor Activo</span>
                <h3 className="text-3xl font-black">{promos[0].regla}</h3>
                <p className="text-emerald-100/70 text-sm font-medium leading-relaxed">Esta regla sobreescribe el precio unitario base cuando el volumen del carrito virtual o POS alcanza el Trigger objetivo. Sincronizado instantáneamente en {promos[0].sedes.length} entornos comerciales.</p>
                
                <div className="flex gap-4 pt-4">
                   <div className="bg-black/20 p-3 rounded-xl border border-white/10">
                      <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold mb-1">Aplica en</p>
                      <p className="font-bold text-sm">{promos[0].sedes.join(' | ').replace('_', ' ')}</p>
                   </div>
                   <div className="bg-black/20 p-3 rounded-xl border border-white/10">
                      <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold mb-1">Caducidad de Instancia</p>
                      <p className="font-bold text-sm tracking-wide">{promos[0].expires}</p>
                   </div>
                </div>
             </div>
             
             <div className="w-48 h-48 bg-white/5 rounded-full border-[8px] border-white/10 flex items-center justify-center backdrop-blur-md">
                <div className="text-center">
                   <p className="text-5xl font-black text-emerald-400">3x</p>
                   <p className="font-bold text-xs uppercase tracking-widest mt-1 text-emerald-100">Volumen</p>
                </div>
             </div>
          </div>
       </div>

    </div>
  )
}

// ==========================================
// 5. ENGINE DE PRODUCCIÓN (Costos Indirectos)
// ==========================================
function ModuloProduccion() {
  const producciones: InfoProduccion[] = [
    { id: "ORD-9912", req: "20 Uds. Chaqueta Cuero", status: "EN PROCESO", progreso: 65, insumos_val: 1250000 },
    { id: "ORD-9913", req: "15 Uds. Jean", status: "EN ESPERA", progreso: 0, insumos_val: 0 },
  ]
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black text-slate-900">Transformación y Manufactura</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {producciones.map(p => (
           <div key={p.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div>
                   <h4 className="font-black text-slate-800 text-lg">{p.id}</h4>
                   <p className="text-sm font-bold text-slate-500">{p.req}</p>
                 </div>
                 <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${p.status === 'EN PROCESO' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{p.status}</span>
              </div>
              
              <div className="space-y-2 mb-6">
                 <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Avance Físico</span>
                    <span>{p.progreso}%</span>
                 </div>
                 <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${p.progreso}%` }}></div>
                 </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                 <div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Valor en Insumos Bloqueados</p>
                   <p className="font-black text-slate-800">${p.insumos_val.toLocaleString()}</p>
                 </div>
                 <button disabled={p.status === 'EN ESPERA'} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg disabled:opacity-50">Declarar Terminado</button>
              </div>
           </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// 6. AUDITORÍA (CONTEO CIEGO)
// ==========================================
function AuditoriasCiegas() {
  return (
    <div className="max-w-2xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="bg-white border-2 text-center border-dashed border-indigo-200 rounded-[2rem] p-12">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-indigo-950 mb-2">Conteo Físico Ciego Activado</h2>
          <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed max-w-sm mx-auto">
             El personal de la Sede Norte no puede ver el stock de la base de datos en este momento. Obliga al conteo físico estricto con pistola de EAN-13.
          </p>
          <div className="space-y-4 max-w-xs mx-auto">
             <input type="text" placeholder="Escanear Código de Barras..." autoFocus className="w-full px-5 py-4 border-2 border-indigo-100 focus:border-indigo-500 bg-indigo-50/50 rounded-2xl outline-none font-bold text-center text-indigo-900 shadow-inner" />
             <div className="flex items-center gap-3 bg-red-50 p-4 rounded-2xl border border-red-100">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <p className="text-xs font-bold text-red-700 text-left">Al fin de sesión, Supabase inyectará los Ajustes Atómicos al Kardex para saldar variaciones.</p>
             </div>
             <button className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs rounded-2xl transition">Generar Acta de Cuadre</button>
          </div>
       </div>
    </div>
  )
}
