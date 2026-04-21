"use client"

import { useState } from "react"
import Sidebar from "@/components/pos/Sidebar"
import Topbar from "@/components/pos/Topbar"
import Dashboard from "@/components/pos/Dashboard"
import Vender from "@/components/pos/modules/Vender"
import Ventas from "@/components/pos/modules/Ventas"
import Inventario from "@/components/pos/modules/Inventario"
import Fidelizacion from "@/components/pos/modules/Fidelizacion"
import Compras from "@/components/pos/modules/Compras"
import Contactos from "@/components/pos/modules/Contactos"
import Informes from "@/components/pos/modules/Informes"
import Nomina from "@/components/pos/modules/Nomina"
import Tienda from "@/components/pos/modules/Tienda"
import ConfiguracionNegocio from "@/components/pos/modules/ConfiguracionNegocio"

// MEJORAS PRO: Hydration + Network + RBAC
import { HydrationBoundary, useNetworkMonitor } from "@/hooks"
import { usePosStore } from "@/store/posStore"
import { hasModuleAccess } from "@/lib/rbac"
import { ShieldAlert, WifiOff, Wifi } from "lucide-react"

function MilanPOSApp() {
  const [activeModule, setActiveModule] = useState("dashboard")
  const [activeSubMenu, setActiveSubMenu] = useState("")

  // MEJORA 2: Estado de red en tiempo real
  useNetworkMonitor()
  const isOnline = usePosStore(s => s.isOnline)
  const offlineQueue = usePosStore(s => s.offlineQueue)
  const currentRole = usePosStore(s => s.currentRole)

  const renderContent = () => {
    // MEJORA 4: RBAC Frontend - Bloqueo de módulos por rol
    if (!hasModuleAccess(activeModule, currentRole) && activeModule !== 'dashboard') {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-2xl border border-red-100 p-12">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-xl font-black text-gray-800 mb-2">Acceso Restringido</h3>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Tu perfil de <span className="font-bold text-red-500 uppercase">{currentRole}</span> no tiene 
            permisos para acceder a este módulo.
          </p>
        </div>
      )
    }

    switch (activeModule) {
      case "vender":
        return <Vender />
      case "nomina":
        return <Nomina subMenu={activeSubMenu} />
      case "ventas":
        return <Ventas subMenu={activeSubMenu} />
      case "inventario":
        return <Inventario subMenu={activeSubMenu} />
      case "fidelizacion":
        return <Fidelizacion subMenu={activeSubMenu} />
      case "compras":
        return <Compras subMenu={activeSubMenu} />
      case "contactos":
        return <Contactos subMenu={activeSubMenu} />
      case "informes":
        return <Informes subMenu={activeSubMenu} />
      case "tienda":
        return <Tienda subMenu={activeSubMenu} />
      case "configuracion":
        return <ConfiguracionNegocio />
      default:
        return <Dashboard />
    }
  }

  const getTitle = () => {
    if (activeSubMenu) return activeSubMenu
    const titles: Record<string, string> = {
      dashboard: "Inicio",
      vender: "Punto de Venta",
      nomina: "Nómina Electrónica",
      ventas: "Ventas",
      inventario: "Inventario",
      fidelizacion: "Fidelización",
      compras: "Compras",
      contactos: "Contactos",
      informes: "Informes",
      tienda: "Tienda Online",
      configuracion: "Configuración y Red",
    }
    return titles[activeModule] || "Inicio"
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0f2f5" }}>
      {/* Green top stripe */}
      <div className="fixed top-0 left-0 right-0 h-[5px] z-50" style={{ backgroundColor: "#4CAF50" }} />

      {/* MEJORA 2: Banner de estado offline */}
      {!isOnline && (
        <div className="fixed top-[5px] left-0 right-0 z-[60] bg-amber-500 text-white text-center py-1.5 text-xs font-bold flex items-center justify-center gap-2 shadow-lg animate-pulse">
          <WifiOff className="w-4 h-4" /> MODO OFFLINE — Las ventas se guardarán localmente
          {offlineQueue.filter(s => s.status === 'pending').length > 0 && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full ml-2">
              {offlineQueue.filter(s => s.status === 'pending').length} pendientes
            </span>
          )}
        </div>
      )}

      {/* Topbar */}
      <Topbar />

      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={(mod) => {
          setActiveModule(mod)
          setActiveSubMenu("")
        }}
        activeSubMenu={activeSubMenu}
        setActiveSubMenu={setActiveSubMenu}
      />

      {/* Main content */}
      <main className={`ml-[90px] min-h-screen ${!isOnline ? 'pt-[80px]' : 'pt-[52px]'}`}>
        <div className="p-5">
          {/* Breadcrumb + Network Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button
                onClick={() => { setActiveModule("dashboard"); setActiveSubMenu("") }}
                className="hover:text-green-600 transition-colors"
              >
                Inicio
              </button>
              {activeModule !== "dashboard" && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-700 font-medium">{getTitle()}</span>
                </>
              )}
            </div>
            {/* Indicador de red sutil */}
            <div className="flex items-center gap-2">
              {isOnline ? (
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <Wifi className="w-3 h-3" /> Online
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                  <WifiOff className="w-3 h-3" /> Offline
                </span>
              )}
            </div>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

import Login from "@/components/pos/auth/Login"

 // MEJORA 1: Wrapping con HydrationBoundary para prevenir SSR mismatch
 export default function MilanPOS() {
  const currentUser = usePosStore(s => s.currentUser)
  
  if (currentUser === '') {
    return <Login />
  }

  return (
    <HydrationBoundary>
      <MilanPOSApp />
    </HydrationBoundary>
  )
}
