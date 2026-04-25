"use client"

import React from "react"

interface SubMenuTabsProps {
  activeModule: string;
  activeSubMenu: string;
  setActiveSubMenu: (sub: string) => void;
}

const MENU_STRUCTURE: Record<string, { id: string; label: string }[]> = {
  ventas: [
    { id: "vender", label: "Vender" },
    { id: "historial", label: "Historial de Ventas" },
    { id: "cierres", label: "Cierres de Caja" },
    { id: "remisiones", label: "Remisiones" },
    { id: "cotizaciones", label: "Cotizaciones" },
    { id: "plan_separe", label: "Plan Separe" },
    { id: "creditos", label: "Créditos" },
  ],
  inventario: [
    { id: "productos", label: "Productos" },
    { id: "categorias", label: "Categorías" },
    { id: "atributos", label: "Atributos" },
    { id: "kardex", label: "Kardex" },
    { id: "ajustes", label: "Ajustes de Inventario" },
    { id: "traslados", label: "Traslados" },
    { id: "bodegas", label: "Almacenes / Bodegas" },
    { id: "etiquetas", label: "Imprimir Etiquetas" },
  ],
  contactos: [
    { id: "clientes", label: "Clientes" },
    { id: "proveedores", label: "Proveedores" },
    { id: "grupos", label: "Grupos de Clientes" },
  ],
  compras: [
    { id: "historial", label: "Historial de Compras" },
    { id: "gastos", label: "Gastos" },
    { id: "pagos", label: "Pagos" },
  ],
  fidelizacion: [
    { id: "puntos", label: "Puntos" },
    { id: "giftcards", label: "Gift Cards" },
    { id: "cupones", label: "Cupones" },
  ],
  informes: [
    { id: "dashboard", label: "Dashboard" },
    { id: "ventas", label: "Ventas" },
    { id: "inventario", label: "Inventario" },
    { id: "cierres", label: "Cierres" },
  ],
  configuracion: [
    { id: "empresa", label: "Mi Empresa" },
    { id: "fiscal", label: "Datos Fiscales" },
    { id: "almacenes", label: "Almacenes" },
    { id: "consecutivos", label: "Consecutivos" },
    { id: "impuestos", label: "Impuestos" },
    { id: "pagos", label: "Formas de Pago" },
  ]
}

export default function SubMenuTabs({ activeModule, activeSubMenu, setActiveSubMenu }: SubMenuTabsProps) {
  const tabs = MENU_STRUCTURE[activeModule]

  // Si el módulo no tiene submenús (ej. Dashboard, Tienda, Nómina), no renderizamos la barra
  if (!tabs || tabs.length === 0) return null;

  // Si no hay submenu seleccionado, por defecto seleccionamos el primero del grupo
  React.useEffect(() => {
    if (!activeSubMenu && tabs.length > 0) {
      setActiveSubMenu(tabs[0].id);
    }
  }, [activeModule, activeSubMenu, setActiveSubMenu, tabs]);

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 pt-3 flex overflow-x-auto no-scrollbar shadow-sm z-30 relative">
      <div className="flex gap-1">
        {tabs.map((tab) => {
          const isActive = activeSubMenu === tab.id || (!activeSubMenu && tabs[0].id === tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubMenu(tab.id)}
              className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? "border-[#62cb31] text-[#62cb31]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
