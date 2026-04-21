"use client"

import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"

// Lazy Routing Implementation
const Empleados = dynamic(() => import("./nomina/Empleados"), { 
   loading: () => <div className="p-10 text-center text-gray-500 animate-pulse">Cargando Módulo de Empleados...</div>,
   ssr: false
})
const Liquidaciones = dynamic(() => import("./nomina/Liquidaciones"), { 
   loading: () => <div className="p-10 text-center text-gray-500 animate-pulse">Cargando Liquidador...</div>,
   ssr: false
})
const ReportesDIAN = dynamic(() => import("./nomina/ReportesDIAN"), { 
   loading: () => <div className="p-10 text-center text-gray-500 animate-pulse">Conectando DIAN...</div>,
   ssr: false
})
const Configuracion = dynamic(() => import("./nomina/Configuracion"), { 
   loading: () => <div className="p-10 text-center text-gray-500 animate-pulse">Abriendo Variables de Ley...</div>,
   ssr: false
})

export default function Nomina({ subMenu }: { subMenu?: string }) {
  const [activeTab, setActiveTab] = useState("Directorio")

  useEffect(() => {
     if (!subMenu) return;
     if (subMenu === "Empleados") setActiveTab("Directorio")
     else if (subMenu === "Liquidaciones") setActiveTab("Liquidaciones")
     else if (subMenu === "Nómina Electrónica") setActiveTab("Reportes DIAN")
     else if (subMenu === "Configuración Nómina") setActiveTab("Configuracion")
  }, [subMenu])

  const renderActiveModule = () => {
     switch(activeTab) {
        case "Directorio": return <Empleados />
        case "Liquidaciones": return <Liquidaciones />
        case "Reportes DIAN": return <ReportesDIAN />
        case "Configuracion": return <Configuracion />
        default: return <Empleados />
     }
  }

  const renderTitle = () => {
     switch (activeTab) {
        case "Directorio": return "Gestión de Empleados"
        case "Liquidaciones": return "Procesamiento de Liquidaciones"
        case "Reportes DIAN": return "Consola de Emisión Técnica (XML/DIAN)"
        case "Configuracion": return "Variables y Constantes de Ley Laboral"
        default: return "Recursos Humanos"
     }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <div>
           <h2 className="text-xl font-black text-gray-800">{renderTitle()}</h2>
           <p className="text-sm text-gray-500 mt-1">Módulo avanzado de Nómina Electrónica conectada a Supabase.</p>
        </div>
      </div>

      {/* Dynamic Content Container */}
      <div className="min-h-[400px]">
         <Suspense fallback={<div>Cargando UI...</div>}>
            {renderActiveModule()}
         </Suspense>
      </div>
    </div>
  )
}
