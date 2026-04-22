"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Grid3x3, User, MapPin, CheckCircle, Package, LogOut, Settings, DollarSign, Activity, Users, Cog } from "lucide-react"
import { usePosStore } from "@/store/posStore"

interface TopbarProps {
  setActiveModule: (module: string) => void
  setActiveSubMenu: (sub: string) => void
  activeModule?: string
}

export default function Topbar({ setActiveModule, setActiveSubMenu, activeModule = "" }: TopbarProps) {
  const [sedeActiva, setSedeActiva] = useState("1")
  const [isSyncing, setIsSyncing] = useState(false)
  const [openMenu, setOpenMenu] = useState<"bell" | "grid" | "user" | "admin" | null>(null)
  const logout = usePosStore(s => s.logout)
  const currentUser = usePosStore(s => s.currentUser)
  const currentRole = usePosStore(s => s.currentRole)

  // Recupera persistencia standalone
  useEffect(() => {
    const s = localStorage.getItem("milan_context_sede")
    if (s) setSedeActiva(s)
  }, [])

  const handleSedeChange = (val: string) => {
    setSedeActiva(val)
    localStorage.setItem("milan_context_sede", val)
    setIsSyncing(true)
    // Simula retardo de Red mientras el Frontend filtra
    setTimeout(() => setIsSyncing(false), 900)
  }

  return (
    <>
      <div className="fixed top-[5px] right-0 left-[90px] h-[47px] bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30 shadow-sm" >
        
        {/* Sync Progress Bar */}
        {isSyncing && (
           <div className="absolute top-full left-0 right-0 h-[2px] bg-gray-100 overflow-hidden z-20">
             <div className="h-full bg-green-500 w-1/3 progress-indeterminate"></div>
           </div>
        )}

        <style jsx>{`
          .progress-indeterminate { animation: indeterminate 1.2s infinite linear; }
          @keyframes indeterminate { 0% { transform: translateX(-100%) scaleX(0.2); } 100% { transform: translateX(300%) scaleX(1); } }
        `}</style>
        
        <div className="flex items-center gap-2 relative">
          <MapPin className="w-5 h-5 text-gray-500" />
          <select 
             value={sedeActiva}
             onChange={(e) => handleSedeChange(e.target.value)}
             className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-green-400 font-medium cursor-pointer"
          >
            <option value="1">Sede Principal (Centro)</option>
            <option value="2">Sucursal Norte (Boutique)</option>
            <option value="3">Bodega Outlet (Descuentos)</option>
          </select>
        </div>

        <div className="flex items-center gap-3 relative">
          
          {/* Grid Quick Actions */}
          <div className="relative">
            <button 
              onClick={() => setOpenMenu(openMenu === "grid" ? null : "grid")}
              className={`p-1.5 rounded-md transition-colors ${openMenu === 'grid' ? 'bg-gray-100 text-green-600' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            {openMenu === "grid" && (
              <div className="absolute top-10 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-50 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => { setActiveModule("vender"); setActiveSubMenu(""); setOpenMenu(null) }}
                  className="flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-600 transition-colors"
                >
                   <DollarSign className="w-6 h-6 mb-1 text-green-600"/> <span className="text-xs font-bold">Cobrar</span>
                </button>
                <button 
                  onClick={() => { setActiveModule("inventario"); setActiveSubMenu(""); setOpenMenu(null) }}
                  className="flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-600 transition-colors"
                >
                   <Package className="w-6 h-6 mb-1 text-blue-600"/> <span className="text-xs font-bold">Kardex</span>
                </button>
                <button 
                  onClick={() => { setActiveModule("ventas"); setActiveSubMenu("Cierres de Caja"); setOpenMenu(null) }}
                  className="flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-600 transition-colors col-span-2 border border-gray-100"
                >
                   <Activity className="w-5 h-5 mb-1 text-purple-600"/> <span className="text-xs font-bold">Auditoría Cajas</span>
                </button>
              </div>
            )}
          </div>

          {/* Admin Menu - Usuarios y Sistema */}
          <div className="relative">
            <button 
              onClick={() => setOpenMenu(openMenu === "admin" ? null : "admin")}
              className={`p-1.5 rounded-md transition-colors ${openMenu === 'admin' ? 'bg-gray-100 text-green-600' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Cog className="w-5 h-5" />
            </button>
            {openMenu === "admin" && (
              <div className="absolute top-10 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
                <div className="bg-gray-50 border-b border-gray-100 px-3 py-2">
                  <p className="text-xs font-bold text-gray-500 uppercase">Administración</p>
                </div>
                <button 
                  onClick={() => { setActiveModule("usuarios"); setActiveSubMenu(""); setOpenMenu(null) }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50"
                >
                  <Users className="w-4 h-4" />
                  Usuarios
                </button>
                <button 
                  onClick={() => { setActiveModule("configuracion"); setActiveSubMenu(""); setOpenMenu(null) }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50"
                >
                  <Cog className="w-4 h-4" />
                  Configuración
                </button>
                <button 
                  onClick={() => { setActiveModule("informes"); setActiveSubMenu(""); setOpenMenu(null) }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Activity className="w-4 h-4" />
                  Informes
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setOpenMenu(openMenu === "bell" ? null : "bell")}
              className={`relative p-1.5 rounded-md transition-colors ${openMenu === 'bell' ? 'bg-gray-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold shadow-sm ring-2 ring-white">
                2
              </span>
            </button>
            {openMenu === "bell" && (
              <div className="absolute top-10 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
                 <div className="bg-gray-50 border-b border-gray-100 p-3 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-800">Alertas Supabase</h3>
                    <span className="text-[10px] text-blue-600 hover:underline cursor-pointer">Marcar leídas</span>
                 </div>
                 <div className="max-h-64 overflow-y-auto">
                    <div className="p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3">
                       <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>
                       <div>
                         <p className="text-xs font-bold text-gray-800">Stock Crítico: Sede Centro</p>
                         <p className="text-xs text-gray-500 mt-1">El producto "Jean Clásico" alcanzó 4 uds.</p>
                       </div>
                    </div>
                    <div className="p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 opacity-60">
                       <span className="w-2 h-2 bg-transparent rounded-full mt-1.5 flex-shrink-0 border border-gray-400"></span>
                       <div>
                         <p className="text-xs font-bold text-gray-800">Caja Cerrada Exitosamente</p>
                         <p className="text-xs text-gray-500 mt-1">Juan Pérez ha cerrado turno (#CJ-1049)</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setOpenMenu(openMenu === "user" ? null : "user")}
              className={`p-1.5 rounded-md transition-colors ${openMenu === 'user' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <User className="w-5 h-5" />
            </button>
            {openMenu === "user" && (
                <div className="absolute top-10 right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col z-50 overflow-hidden">
                   <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4">
                      <p className="text-sm font-bold text-white capitalize">{currentUser || 'Usuario'}</p>
                      <p className="text-xs text-gray-300 capitalize">{currentRole || 'Sin rol'}</p>
                   </div>
<div className="p-1 flex flex-col items-stretch">
                       <button 
                         onClick={() => { setActiveModule("configuracion"); setActiveSubMenu(""); setOpenMenu(null) }}
                         className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-sm text-gray-700 font-medium w-full text-left transition-colors"
                       ><Settings className="w-4 h-4"/> Configuración</button>
                       <button 
                         onClick={() => logout()}
                         className="flex items-center gap-2 p-2 hover:bg-red-50 rounded text-sm font-medium text-red-600 w-full text-left transition-colors border-t border-gray-100"
                       ><LogOut className="w-4 h-4"/> Cerrar Sesión</button>
                    </div>
                </div>
            )}
          </div>

        </div>

        {/* Backdrop invisible to close popovers on click outside */}
        {openMenu && (
           <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setOpenMenu(null)}></div>
        )}

      </div>
    </>
  )
}
