"use client"

import { useState } from "react"
import { Search, Server, DollarSign, Eye, RefreshCw, BarChart2, Shield, Calendar, Layers, PenTool, Database, Plus, Check, AlertCircle } from "lucide-react"

// Types Enterprise
type Movimiento = { id: string; fecha: string; ref: string; tipo: string; cant: number; stock_ant: number; stock_nuevo: number; auth: string; costo_ponderado: number }
type InfoProduccion = { id: string; req: string; status: 'EN ESPERA' | 'EN PROCESO' | 'TERMINADO'; progreso: number; insumos_val: number }
type Promo = { id: string; sedes: string[]; regla: string; expires: string; isActive: boolean }

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
  // Simulando Data Inmutable extraída del trigger
  const mockKardex: Movimiento[] = [
    { id: "KX-9004", fecha: "Hoy 10:45 AM", ref: "PROD-DENIM-ROJO", tipo: "COMPRA", cant: 50, stock_ant: 2, stock_nuevo: 52, costo_ponderado: 34500, auth: "Admin - Sede Principal" },
    { id: "KX-9003", fecha: "Hoy 09:12 AM", ref: "PROD-DENIM-AZUL", tipo: "VENTA", cant: -1, stock_ant: 18, stock_nuevo: 17, costo_ponderado: 31000, auth: "Cajero Juan - Sede Norte" },
    { id: "KX-9002", fecha: "Ayer 18:30 PM", ref: "PROD-DENIM-ROJO", tipo: "AJUSTE", cant: -2, stock_ant: 4, stock_nuevo: 2, costo_ponderado: 34500, auth: "Auditor J. - Sede Principal" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Bitácora Transaccional y Costeos</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Registros inmutables validados por Triggers Postgres. El costo ponderado se re-evalúa matemáticamente por cada ciclo de compra.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Costo Total Auditado</p>
           <h3 className="text-3xl font-black text-indigo-950">$45,820,000</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
           <p className="text-xs font-bold text-red-500 tracking-widest uppercase mb-1">Inconsistencias (Ajustes Físicos)</p>
           <h3 className="text-3xl font-black text-red-950">-2 Unidades</h3>
        </div>
      </div>

      <div className="bg-white border text-sm border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-slate-900 text-white font-bold text-[10px] tracking-widest uppercase">
             <tr>
               <th className="px-5 py-4">ID Trans.</th>
               <th className="px-5 py-4">Firma & Fecha</th>
               <th className="px-5 py-4">Variante Afectada</th>
               <th className="px-5 py-4">Movilizado</th>
               <th className="px-5 py-4 text-center">Auditoría Stock</th>
               <th className="px-5 py-4">Valor Ponderado</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {mockKardex.map(k => (
               <tr key={k.id} className="hover:bg-slate-50">
                 <td className="px-5 py-4 font-mono text-xs font-bold text-slate-400">{k.id}</td>
                 <td className="px-5 py-4">
                    <div className="font-bold text-slate-700">{k.auth}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> {k.fecha}</div>
                 </td>
                 <td className="px-5 py-4 font-bold text-slate-900 text-xs">{k.ref}</td>
                 <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded inline-block font-black text-[11px] uppercase tracking-wider ${k.cant > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {k.tipo} ({k.cant > 0 ? `+${k.cant}` : k.cant})
                    </span>
                 </td>
                 <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold bg-slate-50 px-2 py-1 rounded border border-slate-200">
                       <span className="text-slate-400">{k.stock_ant}</span>
                       <span className="text-slate-300">→</span>
                       <span className={k.stock_nuevo < k.stock_ant ? 'text-red-500' : 'text-emerald-500'}>{k.stock_nuevo}</span>
                    </div>
                 </td>
                 <td className="px-5 py-4 font-black text-slate-800">${k.costo_ponderado.toLocaleString()}</td>
               </tr>
             ))}
           </tbody>
        </table>
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
