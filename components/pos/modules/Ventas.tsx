"use client"

import HistoricoVentas from "./ventas/HistoricoVentas"
import IngresarEfectivo from "./ventas/IngresarEfectivo"
import CierresHistorico from "./ventas/CierresHistorico"
import Creditos from "./ventas/Creditos"
import CierreCaja from "./ventas/CierreCaja"

interface VentasProps {
  subMenu: string
}

export default function Ventas({ subMenu }: VentasProps) {
  // Enrutador de submódulos del panel de Ventas
  const renderContent = () => {
    switch (subMenu) {
      case "Histórico de Ventas":
        return <HistoricoVentas soloRemisiones={false} />
      case "Remisiones":
      case "Histórico de Remisiones":
      case "Cotizaciones":
        return <HistoricoVentas soloRemisiones={true} />
      case "Cerrar Caja (Cajero)":
        return <CierreCaja />
      case "Cierres de Caja":
        return <CierresHistorico />
      case "Ingresar Efectivo":
        return <IngresarEfectivo />
      case "Créditos":
      case "Plan Separe":
        return <Creditos />
      default:
        // Por defecto mostramos histórico de ventas
        return <HistoricoVentas soloRemisiones={false} />
    }
  }

  return (
    <div className="w-full h-full bg-[#f8f9fa] rounded-tl-2xl p-6">
      {renderContent()}
    </div>
  )
}
