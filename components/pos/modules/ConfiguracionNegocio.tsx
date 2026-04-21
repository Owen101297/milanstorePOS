"use client"

import { useState } from "react"
import { Building2, Settings2, BarChart4, ArrowRightLeft, Plus, MapPin, Search, Edit2, ShieldOff, Truck, Briefcase } from "lucide-react"

export default function ConfiguracionNegocio() {
  const [activeTab, setActiveTab] = useState("sedes")
  const [searchSede, setSearchSede] = useState("")

  const mockSedes = [
    { id: 1, name: "Sede Principal - Centro", type: "Punto de Venta", city: "Bogotá", status: "Activa", sales: 12500000 },
    { id: 2, name: "Sucursal Norte Boutique", type: "Punto de Venta", city: "Bogotá", status: "Activa", sales: 8400000 },
    { id: 3, name: "Bodega Outlet Principal", type: "Bodega", city: "Cota", status: "Inactiva (Logística)", sales: 0 },
    { id: 4, name: "Torre Administrativa", type: "Sede Administrativa", city: "Medellín", status: "Activa", sales: 0 }
  ]

  const formatCOP = (v: number) => "$ " + v.toLocaleString("es-CO")

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Sidebar de Configuración de Negocio */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
        <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
           <Settings2 className="w-5 h-5"/> Config Global
        </h2>
        
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab("sedes")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'sedes' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
            <Building2 className="w-4 h-4"/> Gestión de Sedes
          </button>
          <button onClick={() => setActiveTab("traslados")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'traslados' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
            <ArrowRightLeft className="w-4 h-4"/> Traslados (Logística)
          </button>
          <button onClick={() => setActiveTab("parametros")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'parametros' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
            <Briefcase className="w-4 h-4"/> Parámetros y DIAN
          </button>
          <div className="pt-4 mt-2 border-t border-gray-200">
            <span className="text-[10px] uppercase font-bold text-gray-400 ml-2 mb-2 block">Analítica Dueño</span>
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
              <BarChart4 className="w-4 h-4"/> Rentabilidad (Dash)
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 overflow-y-auto p-8">
        
        {activeTab === "sedes" && (
           <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                 <div>
                   <h3 className="text-2xl font-black text-gray-800">Directorio de Sucursales</h3>
                   <p className="text-sm text-gray-500 mt-1">Si creas una sede, el Triger de Supabase inicializará automáticamente todo su Kardex en cero (0).</p>
                 </div>
                 <button className="flex items-center gap-2 px-4 py-2 bg-[#4CAF50] text-white rounded-lg font-bold shadow hover:bg-[#45a049] transition">
                    <Plus className="w-4 h-4"/> Nueva Sede Físisca
                 </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Filtrar por ciudad o nombre de la sede..." value={searchSede} onChange={(e) => setSearchSede(e.target.value)} className="w-full bg-transparent text-sm focus:outline-none"/>
                </div>
                <table className="w-full">
                  <thead className="bg-white border-b border-gray-100">
                     <tr>
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500">Sede / Ubicación</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500">Tipo de Hub</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500">Estado Técnico</th>
                        <th className="text-right px-6 py-4 text-xs font-bold text-gray-500">Acciones CRUD</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {mockSedes.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-6 py-4">
                              <p className="font-bold text-gray-800">{s.name}</p>
                              <p className="flex items-center gap-1 text-[11px] text-gray-500 font-medium mt-1"><MapPin className="w-3 h-3"/> {s.city}</p>
                           </td>
                           <td className="px-6 py-4">
                             <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{s.type}</span>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${s.status === 'Activa' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>{s.status}</span>
                           </td>
                           <td className="px-6 py-4 flex justify-end gap-2">
                             <button className="p-2 border border-gray-200 text-gray-600 rounded hover:bg-gray-100" title="Editar Metadatos"><Edit2 className="w-4 h-4"/></button>
                             <button className="p-2 border border-red-200 text-red-600 rounded bg-red-50 hover:bg-red-100" title="Desactivar (Soft-delete)"><ShieldOff className="w-4 h-4"/></button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
                </table>
              </div>
           </div>
        )}

        {activeTab === "traslados" && (
           <div className="max-w-4xl mx-auto">
             <h3 className="text-2xl font-black text-gray-800 mb-2">Protocolo de Movilidad Logística</h3>
             <p className="text-sm text-gray-500 mb-6">Ejecución RPC Supabase: Atómico y Libre de Fugas. Origen - Destino.</p>
             
             <div className="bg-white border text-center p-12 border-gray-200 rounded-xl shadow-sm text-gray-400">
                <Truck className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                <p className="font-bold text-gray-600">Simulador de Traslado Seguro</p>
                <p className="text-sm mt-2 max-w-sm mx-auto">La función `tx_traslado_inventario` en Supabase requiere Parámetros Origen y Destino.</p>
             </div>
           </div>
        )}

        {activeTab === "dashboard" && (
           <div className="max-w-6xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-800">Consolidado de Rentabilidad</h3>
                <span className="text-xs bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full border border-purple-200">Vista Exclusiva RLS (CEO)</span>
             </div>

             <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-b-4 border-b-purple-500">
                   <p className="text-xs font-bold text-gray-400 uppercase">Facturación Global Mensual</p>
                   <h4 className="text-4xl font-black text-gray-900 mt-2">{formatCOP(20900000)}</h4>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <p className="text-xs font-bold text-gray-400 uppercase">Sede Top Rentable</p>
                   <h4 className="text-2xl font-black text-[#4CAF50] mt-2">Sede Principal (Centro)</h4>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <p className="text-xs font-bold text-gray-400 uppercase">Costo Logístico Activo</p>
                   <h4 className="text-2xl font-black text-red-500 mt-2">{formatCOP(1400000)}</h4>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                <h4 className="font-bold text-gray-800 mb-4">Métricas de Competencia Geográfica</h4>
                <div className="space-y-4">
                   {mockSedes.filter(s=>s.sales>0).map(s => (
                     <div key={s.id}>
                        <div className="flex justify-between text-sm mb-1">
                           <span className="font-bold text-gray-700">{s.name}</span>
                           <span className="font-medium text-gray-500">{formatCOP(s.sales)}</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-purple-400 to-blue-500" style={{ width: s.sales > 10000000 ? '80%' : '50%'}}></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           </div>
        )}

        {activeTab === "parametros" && (
           <div className="max-w-3xl mx-auto p-12 bg-white border border-gray-200 rounded-xl text-center text-gray-400 shadow-sm">
              <Settings2 className="w-12 h-12 mx-auto mb-4 text-gray-300"/>
              <p className="font-bold text-gray-700 text-lg">Parámetros Maestros</p>
              <p className="text-sm mt-2">Aquí va el formulario para Tabla: configuracion_global_franquicia: Rango DIAN, logo comercial, prefijos de factura.</p>
           </div>
        )}

      </div>
    </div>
  )
}
