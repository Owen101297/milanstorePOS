"use client"

import { useState } from "react"
import {
  ShoppingCart, Users, DollarSign, Package, Heart,
  ShoppingBag, FileText, BarChart2, Store, X, Home, Settings
} from "lucide-react"

interface SidebarProps {
  activeModule: string
  setActiveModule: (module: string) => void
  activeSubMenu: string
  setActiveSubMenu: (sub: string) => void
}

const navItems = [
  { id: "vender", label: "Vender", icon: ShoppingCart, subMenu: [] },
  {
    id: "nomina", label: "Nómina Electr.", icon: Users, subMenu: [
      "Empleados", "Liquidaciones", "Nómina Electrónica", "Configuración Nómina"
    ]
  },
  {
    id: "ventas", label: "Ventas", icon: DollarSign, subMenu: [
      "Remisiones", "Histórico de Ventas", "Histórico de Remisiones",
      "Ingresar Efectivo", "Cerrar Caja (Cajero)", "Cierres de Caja",
      "Plan Separe", "Ventas Online", "Cotizaciones", "Créditos"
    ]
  },
  {
    id: "inventario", label: "Inventario", icon: Package, subMenu: [
      "Productos", "Categorías", "Movimientos", "Libro de Precios",
      "Producción", "Auditoría Inventario"
    ]
  },
  {
    id: "fidelizacion", label: "Fidelización", icon: Heart, subMenu: [
      "Gift Cards", "Puntos", "Promociones"
    ]
  },
  {
    id: "compras", label: "Compras", icon: ShoppingBag, subMenu: [
      "Documento Soporte", "Historico de Doc. Soporte", "Gastos",
      "Órdenes de Compras", "Bancos", "Movimientos bancarios", "Conciliaciones"
    ]
  },
  {
    id: "contactos", label: "Contactos", icon: FileText, subMenu: [
      "Clientes", "Vendedores", "Proveedores", "Domiciliarios"
    ]
  },
  {
    id: "informes", label: "Informes", icon: BarChart2, subMenu: [
      "Mis Reportes"
    ]
  },
  {
    id: "tienda", label: "Tienda", icon: Store, subMenu: [
      "Configurar Tienda", "Pedidos Online", "Categorías Tienda"
    ]
  },
]

export default function Sidebar({ activeModule, setActiveModule, activeSubMenu, setActiveSubMenu }: SidebarProps) {
  const [openFlyout, setOpenFlyout] = useState<string | null>(null)

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.subMenu.length === 0) {
      setActiveModule(item.id)
      setActiveSubMenu("")
      setOpenFlyout(null)
    } else {
      setOpenFlyout(openFlyout === item.id ? null : item.id)
      setActiveModule(item.id)
    }
  }

  const handleSubMenuClick = (sub: string) => {
    setActiveSubMenu(sub)
    setOpenFlyout(null)
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 bottom-0 w-[90px] flex flex-col items-center py-3 gap-0.5 z-40"
        style={{ backgroundColor: "#2d2d2d" }}
      >
        {/* Logo */}
        <button
          onClick={() => { setActiveModule("dashboard"); setActiveSubMenu(""); setOpenFlyout(null) }}
          className="flex flex-col items-center mb-2 px-2 w-full py-2 hover:bg-[#3a3a3a] rounded transition-colors"
        >
          <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-md">
            <img 
              src="/milan-logo.png" 
              alt="Milan POS" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback in case image is not found yet
                e.currentTarget.src = "https://via.placeholder.com/64x64/000000/FFFFFF?text=MILAN";
              }}
            />
          </div>
        </button>

        {/* Nav Items */}
        <nav className="flex flex-col items-center gap-0 w-full flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeModule === item.id
            return (
              <div key={item.id} className="relative w-full">
                <button
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex flex-col items-center justify-center py-3 px-1 gap-1 transition-colors cursor-pointer
                    ${isActive ? "bg-[#3a3a3a]" : "hover:bg-[#3a3a3a]"}`}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <span className="text-white text-[9px] font-medium text-center leading-tight px-1">{item.label}</span>
                </button>
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Flyout submenu */}
      {openFlyout && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpenFlyout(null)}
          />
          <div
            className="fixed left-[90px] top-0 bottom-0 w-56 z-40 flex flex-col shadow-2xl overflow-hidden"
            style={{ backgroundColor: "#3a3a3a" }}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#4a4a4a]">
              <span className="text-white font-semibold text-sm">
                {navItems.find(n => n.id === openFlyout)?.label}
              </span>
              <button onClick={() => setOpenFlyout(null)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {navItems.find(n => n.id === openFlyout)?.subMenu.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubMenuClick(sub)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-[#444]
                    ${activeSubMenu === sub
                      ? "text-[#4CAF50] bg-[#2d2d2d] font-medium"
                      : "text-gray-200 hover:text-white hover:bg-[#4a4a4a]"
                    }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
