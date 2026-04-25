"use client"

import React from "react"
import { 
  ShoppingCart, User, TrendingUp, Package, Heart, 
  ShoppingBag, Users, BarChart2, Monitor, Tag, ChevronRight
} from "lucide-react"
import { usePosStore } from "@/store/posStore"
import { hasModuleAccess } from "@/lib/rbac"

interface SidebarProps {
  activeModule: string
  setActiveModule: (module: string) => void
  activeSubMenu: string
  setActiveSubMenu: (sub: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule, activeSubMenu, setActiveSubMenu }) => {
  const currentRole = usePosStore(s => s.currentRole)

  const menuItems = [
    { id: "vender", label: "Vender", icon: ShoppingCart, rbacId: "vender" },
    { id: "nomina", label: "Nómina Electr.", icon: User, rbacId: "nomina" },
    { 
      id: "ventas", label: "Ventas", icon: TrendingUp, rbacId: "ventas",
      subItems: [
        { id: "historial", label: "Histórico de Ventas" },
        { id: "ingresar_efectivo", label: "Ingresar Efectivo" },
        { id: "cerrar_caja", label: "Cierre de Caja" },
        { id: "plan_separe", label: "Plan Separe" },
        { id: "cotizaciones", label: "Cotizaciones" },
        { id: "creditos", label: "Créditos" },
      ]
    },
    { 
      id: "inventario", label: "Inventario", icon: Package, rbacId: "inventario",
      subItems: [
        { id: "productos", label: "Productos" },
        { id: "categorias", label: "Categorías" },
        { id: "movimientos", label: "Movimientos" },
        { id: "precios", label: "Libro de Precios" },
        { id: "produccion", label: "Producción" },
        { id: "auditoria", label: "Auditoría Inventario" },
      ]
    },
    { id: "fidelizacion", label: "Fidelización", icon: Heart, rbacId: "fidelizacion" },
    { id: "compras", label: "Compras", icon: ShoppingBag, rbacId: "compras" },
    { id: "contactos", label: "Contactos", icon: Users, rbacId: "contactos" },
    { id: "informes", label: "Informes", icon: BarChart2, rbacId: "informes" },
    { id: "tienda", label: "Tienda", icon: Monitor, rbacId: "tienda" },
  ]

  const filteredItems = menuItems.filter(item => hasModuleAccess(item.rbacId, currentRole))

  const handleModuleClick = (item: any) => {
    setActiveModule(item.id)
    if (item.subItems && item.subItems.length > 0) {
      setActiveSubMenu(item.subItems[0].id)
    } else {
      setActiveSubMenu("")
    }
  }

  const activeItem = filteredItems.find(item => item.id === activeModule)
  const hasSubMenu = activeItem && activeItem.subItems && activeItem.subItems.length > 0

  return (
    <div className="h-full flex z-[100] select-none">
      
      {/* Primary Sidebar Bar (Left) */}
      <div className="w-[100px] h-full bg-[#2b2b2b] flex flex-col border-r border-black/20 shrink-0">
        
        {/* Logo Area */}
        <div 
          className="h-[100px] bg-[#333] flex flex-col items-center justify-center cursor-pointer border-b border-white/5 relative"
          onClick={() => { setActiveModule("dashboard"); setActiveSubMenu(""); }}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#62cb31]" />
          <Tag className="text-white mb-1" size={28} />
          <span className="text-[16px] font-bold text-white tracking-tighter">Vendty</span>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleModuleClick(item)}
              className={`w-full py-4 flex flex-col items-center justify-center border-b border-white/5 transition-colors relative min-h-[90px] outline-none ${
                activeModule === item.id 
                  ? "bg-[#1a1a1a] text-white" 
                  : "text-gray-400 hover:bg-black/10 hover:text-white"
              } focus-visible:ring-2 focus-visible:ring-[#62cb31] focus-visible:ring-inset`}
              aria-current={activeModule === item.id ? 'page' : undefined}
            >
              <item.icon size={26} strokeWidth={1.5} className="mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-tight text-center px-1 leading-tight">
                {item.label}
              </span>
              {activeModule === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#62cb31]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* SubMenu Panel (Persistent when active) */}
      {hasSubMenu && (
        <div className="w-[200px] h-full bg-[#404040] flex flex-col border-r border-black/20 animate-in slide-in-from-left-4 duration-300">
           <div className="h-[100px] border-b border-white/5" /> {/* Spacer to align with logo */}
           
           <ul className="py-4 space-y-1">
             {activeItem.subItems?.map((sub) => (
               <li key={sub.id}>
<button
                    onClick={() => setActiveSubMenu(sub.id)}
                    className={`w-full text-left px-6 py-4 text-[13px] transition-all flex justify-between items-center outline-none ${
                      activeSubMenu === sub.id 
                        ? "text-white bg-black/10 font-black" 
                        : "text-gray-400 hover:text-white hover:bg-black/5 font-medium"
                    } focus-visible:ring-2 focus-visible:ring-[#62cb31] focus-visible:ring-inset`}
                  >
                    {sub.label}
                    {activeSubMenu === sub.id && <ChevronRight size={14} className="text-[#62cb31]" />}
                  </button>
               </li>
             ))}
           </ul>
        </div>
      )}
    </div>
  )
}

export default Sidebar
