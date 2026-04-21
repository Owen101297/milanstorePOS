"use client"

import { Wrench } from "lucide-react"
import ProductosModule from "./ProductosModule" 

// ==========================================
// COMPONENTE: PLACEHOLDER DE DESARROLLO
// ==========================================
const ModuloPlaceholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full p-10 bg-white rounded-3xl border border-dashed border-gray-300 m-4">
    <Wrench className="w-16 h-16 text-gray-300 mb-4 animate-bounce" />
    <h2 className="text-2xl font-black text-gray-800 mb-2">{title}</h2>
    <p className="text-sm font-medium text-gray-500 mb-8 max-w-sm text-center">Estamos construyendo las conexiones de bases de datos y la UI para esta vista.</p>
    
    <div className="w-full max-w-2xl space-y-4 opacity-50">
       <div className="h-10 bg-gray-100 rounded-xl w-1/3 animate-pulse"></div>
       <div className="h-40 bg-gray-100 rounded-xl w-full animate-pulse"></div>
       <div className="h-10 bg-gray-100 rounded-xl w-full animate-pulse"></div>
    </div>
  </div>
)

interface InventarioProps {
  subMenu: string
}

// ==========================================
// COMPONENTE PADRE CONTENEDOR: Inventario
// ==========================================
export default function Inventario({ subMenu }: InventarioProps) {
  
  // 1 & 2. ESTADO ÚNICO DE NAVEGACIÓN
  // Utiliza el subMenu inyectado desde el Sidebar principal (Flyout Gris Oscuro)
  // eliminando la duplicidad local por completo.
  const seccionActiva = subMenu || "Productos"

  // 3. RENDERIZADO INDIVIDUAL ROBUSTO (Switch)
  const renderContenido = () => {
    switch (seccionActiva) {
      case "Productos":
        return <ProductosModule />
      case "Categorías":
        return <ModuloPlaceholder title="Categorias.tsx - Árbol jerárquico de organización" />
      case "Movimientos":
        return <ModuloPlaceholder title="Kardex.tsx - Historial inmutable" />
      case "Libro de Precios":
        return <ModuloPlaceholder title="Precios.tsx - Listas y Reglas Omnicanal" />
      case "Producción":
        return <ModuloPlaceholder title="Produccion.tsx - Transformación de Insumos" />
      case "Auditoría Inventario":
        return <ModuloPlaceholder title="Auditoria.tsx - Conteo ciego y reportes" />
      default:
        // Renderizado por defecto o caída de seguridad
        return <ProductosModule />
    }
  }

  return (
    <div className="flex h-full min-h-[calc(100vh-120px)] w-full overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
      {/* 
        El Panel Izquierdo / Aside que duplicaba la interfaz fue completamente eliminado.
        Respetamos la arquitectura maestra donde el Menú Flyout (Sidebar.tsx) transmite
        la navegación.
      */}
      <main className="flex-1 overflow-y-auto relative w-full bg-slate-50">
         {renderContenido()}
      </main>
    </div>
  )
}
