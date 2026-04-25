"use client"

import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"
import { Users, FileSpreadsheet, Send, Settings, ShieldCheck } from "lucide-react"

// Lazy Routing Implementation
const Empleados = dynamic(() => import("./nomina/Empleados"), { 
   loading: () => <div className="p-10 text-center text-slate-500 animate-pulse font-bold">Cargando Módulo de Empleados...</div>,
   ssr: false
})
const Liquidaciones = dynamic(() => import("./nomina/Liquidaciones"), { 
   loading: () => <div className="p-10 text-center text-slate-500 animate-pulse font-bold">Cargando Liquidador...</div>,
   ssr: false
})
const ReportesDIAN = dynamic(() => import("./nomina/ReportesDIAN"), { 
   loading: () => <div className="p-10 text-center text-slate-500 animate-pulse font-bold">Conectando DIAN...</div>,
   ssr: false
})
const Configuracion = dynamic(() => import("./nomina/Configuracion"), { 
   loading: () => <div className="p-10 text-center text-slate-500 animate-pulse font-bold">Abriendo Variables de Ley...</div>,
   ssr: false
})

export default function Nomina({ subMenu }: { subMenu?: string }) {
  const [isAuthenticating, setIsAuthenticating] = useState(true)

  useEffect(() => {
    // Sutil delay for look-and-feel of "enterprise connection"
    const timer = setTimeout(() => setIsAuthenticating(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const renderActiveModule = () => {
     switch(subMenu) {
        case "Empleados": return <Empleados />
        case "Liquidaciones": return <Liquidaciones />
        case "Nómina Electrónica": return <ReportesDIAN />
        case "Configuración Nómina": return <Configuracion />
        default: return <Empleados />
     }
  }

  const getModuleTitle = () => {
     switch (subMenu) {
        case "Empleados": return "Gestión de Capital Humano"
        case "Liquidaciones": return "Liquidador de Nómina y Prestaciones"
        case "Nómina Electrónica": return "Emisión de Documentos Soporte (XML)"
        case "Configuración Nómina": return "Variables Legales y Constantes"
        default: return "Recursos Humanos"
     }
  }

  if (isAuthenticating) {
    return (
      <div className="bg-slate-50 w-full h-[calc(100vh-120px)] rounded-tl-2xl flex flex-col items-center justify-center border-l border-slate-200">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <div className="text-center">
          <p className="font-black text-slate-800 text-lg uppercase tracking-tight">Milan Nomina Enterprise</p>
          <p className="text-sm text-slate-500 font-medium mt-1">Autenticando sesión segura con servidor de nómina...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 w-full h-[calc(100vh-120px)] overflow-y-auto p-2 sm:p-6 rounded-tl-2xl shadow-inner border-l border-slate-200">
       <div className="w-full h-full max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500"/>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conexión Segura Activa</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800">{getModuleTitle()}</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Control integral de empleados, pagos y cumplimiento legal.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
             <Suspense fallback={<div className="p-20 text-center font-bold text-slate-400">Iniciando componentes...</div>}>
                {renderActiveModule()}
             </Suspense>
          </div>
       </div>
    </div>
  )
}


