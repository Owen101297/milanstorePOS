"use client"

import React, { useState, useEffect, useCallback } from "react"
import { 
  ShoppingCart, FileText, Banknote, RefreshCcw, 
  ChevronDown, ArrowRight, MessageCircle, Menu, 
  CreditCard, Settings, Utensils, ShoppingBag, 
  CircleDollarSign, X, Loader2, Coins
} from "lucide-react"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts"
import { useSede } from "@/components/pos/providers/SedeContext"
import { usePosStore } from "@/store/posStore"
import { reportes } from "@/lib/services"
import type { 
  DashboardMetrics, VentaPorHora, VentaPorMetodo, VentaPorDia, TendenciaSemanal 
} from "@/lib/services/reportes.service"

const fmtCOP = (v: number) => "$ " + Math.round(v).toLocaleString("es-CO")

const Dashboard = ({ onModuleChange }: { onModuleChange: (m: string) => void }) => {
  const { sedeId, sedeNombre } = useSede()
  const currentUser = usePosStore(s => s.currentUser)
  const [activeTab, setActiveTab] = useState("inicializacion")
  
  const [metrics, setMetrics] = useState<DashboardMetrics>({ ventasHoy: 0, facturasHoy: 0, gastosHoy: 0, utilidadHoy: 0 })
  const [hourlyData, setHourlyData] = useState<VentaPorHora[]>([])
  const [metodosData, setMetodosData] = useState<VentaPorMetodo[]>([])
  const [dailyData, setDailyData] = useState<VentaPorDia[]>([])
  const [tendencia, setTendencia] = useState<TendenciaSemanal>({ currentWeek: 0, previousWeek: 0, growth: 0 })
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    if (!sedeId) return
    setLoading(true)
    try {
      const [m, h, mp, d, t] = await Promise.all([
        reportes.getDashboardMetrics(sedeId),
        reportes.getVentasPorHora(sedeId),
        reportes.getVentasPorMetodo(sedeId),
        reportes.getVentasUltimos7Dias(sedeId),
        reportes.getTendenciaSemanal(sedeId)
      ])
      setMetrics(m); setHourlyData(h); setMetodosData(mp); setDailyData(d); setTendencia(t)
    } catch (err) {
      console.error("Dashboard Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }, [sedeId])

  useEffect(() => { fetchAll() }, [fetchAll])

  // --- Components ---
  
  const MetricCard = ({ icon: Icon, title, value, color, type }: any) => (
    <div className="bg-white rounded border border-gray-100 shadow-sm flex items-center p-6 flex-1 min-w-[220px]">
      <div className="mr-6">
        <div className={`p-0 rounded-lg`}>
          <Icon className={color} size={48} strokeWidth={1} />
        </div>
      </div>
      <div>
        <p className="text-[14px] text-gray-400 font-medium mb-1">{title}</p>
        <p className="text-2xl font-medium text-gray-700 tracking-tight">
          {loading ? "..." : (type === "count" ? `# ${value}` : fmtCOP(value))}
        </p>
      </div>
    </div>
  )

  return (
    <div className="bg-[#f0f3f4] min-h-full font-sans">
      
      {/* Selector de Almacén - Vendty Style Header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[14px] text-gray-600">Almacén</span>
        <div className="relative">
          <div className="flex items-center bg-white border border-gray-200 rounded shadow-sm px-3 py-1.5 min-w-[200px] justify-between cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-[13px] text-gray-700">{sedeNombre || "General"}</span>
            <div className="flex items-center gap-2">
              <X size={14} className="text-gray-300 hover:text-gray-500" />
              <div className="w-[1px] h-4 bg-gray-200"></div>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </div>
        <button onClick={fetchAll} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#62cb31]" aria-label="Actualizar datos">
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* Row 1: Metrics */}
          <div className="flex flex-wrap gap-4">
            <MetricCard icon={ShoppingCart} title="Ventas de hoy" value={metrics.ventasHoy} color="text-[#6fc1a1]" type="currency" />
            <MetricCard icon={FileText} title="Facturas de hoy" value={metrics.facturasHoy} color="text-[#5dade2]" type="count" />
            <MetricCard icon={Banknote} title="Gastos de hoy" value={metrics.gastosHoy} color="text-[#e74c3c]" type="currency" />
            <MetricCard icon={Coins} title="Utilidad de hoy" value={metrics.utilidadHoy} color="text-[#f1c40f]" type="currency" />
          </div>

          {/* Row 2: Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Chart 1: Sales Hourly */}
            <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
              <div className="p-4 flex justify-between items-center">
                <h3 className="text-[13px] text-gray-400 font-medium uppercase tracking-tight">Ventas por hora (Hoy)</h3>
                <button className="text-gray-400 p-1 hover:bg-gray-50 rounded">
                  <Menu size={18} />
                </button>
              </div>
              <div className="flex-1 p-4 pb-8">
                {hourlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#999' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#666' }} />
                      <Tooltip formatter={(v:any) => [fmtCOP(v), 'Venta']} />
                      <Area type="monotone" dataKey="value" stroke="#62cb31" strokeWidth={2} fillOpacity={0.1} fill="#62cb31" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : <EmptyState label="Sin ventas registradas hoy" />}
              </div>
            </div>

            {/* Chart 2: Method Distribution */}
            <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
              <div className="p-4 flex justify-between items-center">
                <h3 className="text-[13px] text-gray-400 font-medium uppercase tracking-tight">Ventas por método de pago (Hoy)</h3>
              </div>
              <div className="flex-1 p-4 pb-8">
                {metodosData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metodosData.map(m => ({ name: m.metodo, value: m.total }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#666' }} />
                      <Tooltip formatter={(v:any) => [fmtCOP(v), 'Total']} />
                      <Bar dataKey="value" fill="#3498db" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <EmptyState label="No hay datos para mostrar" />}
              </div>
            </div>
          </div>

          {/* Row 3: Bottom Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
             <div className="bg-white rounded border border-gray-100 shadow-sm p-4 flex flex-col h-[320px]">
                <h3 className="text-[13px] text-gray-400 font-medium mb-4">Ventas por día (Últimos 7 días)</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                      <XAxis dataKey="dayName" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#999' }} />
                      <Tooltip formatter={(v:any) => [fmtCOP(v), 'Ventas']} />
                      <Bar dataKey="value" fill="#62cb31" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-white rounded border border-gray-100 shadow-sm p-6 flex flex-col h-[320px] items-center justify-center">
                <h3 className="text-[13px] text-gray-400 font-medium mb-6 uppercase">Tendencia semanal de ventas</h3>
                <div className="flex flex-col items-center gap-2">
                   <div className="w-16 h-12 bg-[#ebf5fb] rounded flex items-center justify-center mb-2 overflow-hidden border border-gray-100">
                      <CreditCard className="text-[#3498db]" size={32} strokeWidth={1.5} />
                   </div>
                   <p className="text-[14px] text-gray-400">No hay datos para mostrar</p>
                </div>
             </div>
          </div>

        </div>

        {/* Right Sidebar: Primeros Pasos */}
        <div className="w-full lg:w-[350px]">
          <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden h-full">
            <div className="p-4 flex justify-between items-center border-b border-gray-50">
              <h3 className="text-[14px] text-gray-500 font-medium uppercase tracking-tight">Primeros pasos</h3>
              <button className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="p-4 grid grid-cols-2 gap-2">
              {[
                { id: "inicializacion", label: "GENERAL", icon: <Settings size={14} />, color: "bg-[#4c505d]" },
                { id: "restaurante", label: "RESTAU.", icon: <Utensils size={14} />, color: "bg-[#8e44ad]" },
                { id: "retail", label: "RETAIL", icon: <ShoppingBag size={14} />, color: "bg-[#2980b9]" },
                { id: "ventas", label: "VENTAS", icon: <CircleDollarSign size={14} />, color: "bg-[#d35400]" }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded text-[11px] font-bold transition-all ${
                    activeTab === tab.id ? `${tab.color} text-white` : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-4">
              {STEPS[activeTab].map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 border border-gray-100 rounded hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-6 h-6 rounded-full bg-[#62cb31] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium flex-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/573053107953" target="_blank" className="fixed bottom-6 right-6 w-14 h-14 bg-[#25d366] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <MessageCircle size={32} fill="currentColor" />
      </a>
    </div>
  )
}

const EmptyState = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="w-16 h-12 bg-[#ebf5fb] rounded flex items-center justify-center mb-4 overflow-hidden border border-gray-100">
       <CreditCard className="text-[#3498db]" size={32} strokeWidth={1.5} />
    </div>
    <p className="text-[14px] text-gray-400">{label}</p>
  </div>
)

const STEPS: Record<string, string[]> = {
  inicializacion: [
    "¿Cómo realizo la Configuración Inicial?",
    "Configuración de mis medios de pago",
    "¿Cómo creo un usuario?",
    "Configura la información general de tu almacén o restaurante",
    "¿Cómo creo los Impuestos?",
    "Configura la impresión de tu factura",
    "Problemas con la impresión de la factura"
  ],
  restaurante: ["Mesas y zonas", "Menú digital", "Modificadores", "Comandas"],
  retail: ["Importación masiva", "Códigos de barras", "Tallas y colores", "Inventario"],
  ventas: ["Realizar venta", "Cierres diarios", "Devoluciones", "Crédito y abonos"]
}

export default Dashboard
