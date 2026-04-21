"use client"

import { useState } from "react"
import { ChevronRight, Download, BarChart2, Package, ShoppingBag, FileText } from "lucide-react"

interface InformesProps { subMenu: string }

const reportesVentas = [
  "Exportar facturas (Transacciones)",
  "Exportar facturas Por Proveedor (Transacciones)",
  "Exportar devoluciones",
  "Ventas por domicilios",
  "Facturas con info del cliente",
  "Productos vendidos por cliente",
  "Transacciones Por Remisiones",
  "Ventas",
  "Ventas por Categoría",
  "Ventas por formas de pago",
  "Cambio de formas de pago",
  "Informe de Total de Ventas por Atributos",
  "Puntos Acumulados por Cliente",
  "Detalle de ventas por vendedor",
]

const reportesInventario = [
  "Existencias del inventario",
  "Inventario con Stock Mínimo",
  "Valor del Inventario",
  "Hábitos de Consumo por día",
  "Hábitos de Consumo por Mes",
  "Inventario con Menos Rotación",
  "Exportar Libro de Precios",
  "Productos Separados",
  "Total de Inventario por Atributos",
  "Listado de Seriales/Imei",
  "Listado de Productos compuestos",
]

const reportesGastos = [
  "Exportar gastos",
  "Exportar Ordenes de Compra",
  "Búsqueda Compras de un producto",
  "Búsqueda Saldo de Proveedor",
]

const mockMisReportes = [
  { id: 1, nombre: "Ventas diarias - Abril 2026", fecha: "2026-04-14", tipo: "Ventas" },
  { id: 2, nombre: "Inventario actual", fecha: "2026-04-13", tipo: "Inventario" },
  { id: 3, nombre: "Gastos del mes", fecha: "2026-04-01", tipo: "Gastos" },
]

function ReportSection({ icon: Icon, title, reports, color }: any) {
  const [expanded, setExpanded] = useState<number | null>(null)
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5" style={{ color }} />
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="space-y-0">
        {reports.map((report: string, i: number) => (
          <button
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-100 transition-colors text-left group"
          >
            <span className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-green-500 transition-colors" />
              {report}
            </span>
            {expanded === i && (
              <button
                onClick={e => { e.stopPropagation() }}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-green-700 bg-green-50 hover:bg-green-100"
              >
                <Download className="w-3 h-3" /> Exportar
              </button>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Informes({ subMenu }: InformesProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <BarChart2 className="w-6 h-6 text-gray-600" />
          <h2 className="text-base font-bold text-gray-800">Informes</h2>
          <span className="text-gray-300">|</span>
          <button className="p-1 hover:bg-gray-100 rounded text-gray-500" title="Ayuda">?</button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: "#4CAF50" }}>
          <FileText className="w-4 h-4" /> Mis Reportes
        </button>
      </div>

      {/* Mis reportes guardados */}
      {mockMisReportes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Mis Reportes Guardados</h3>
          <div className="space-y-2">
            {mockMisReportes.map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.nombre}</p>
                  <p className="text-xs text-gray-400">{r.tipo} · {r.fecha}</p>
                </div>
                <button className="flex items-center gap-1 px-2 py-1 rounded text-xs text-green-700 bg-green-50 hover:bg-green-100">
                  <Download className="w-3 h-3" /> Descargar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <ReportSection
            icon={BarChart2}
            title="Ventas"
            reports={reportesVentas}
            color="#4CAF50"
          />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <ReportSection
            icon={Package}
            title="Productos y Existencias"
            reports={reportesInventario}
            color="#2196F3"
          />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <ReportSection
            icon={ShoppingBag}
            title="Gastos y Compras"
            reports={reportesGastos}
            color="#FF9800"
          />
        </div>
      </div>
    </div>
  )
}
