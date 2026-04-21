"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { useSede } from "@/components/pos/providers/SedeContext"
import { TrendingUp, FileText, TrendingDown, DollarSign, ChevronRight, ShoppingBag, AlertTriangle, Package, UserCheck, MapPin } from "lucide-react"

// Lazy Loading para las gráficas (Evita sobrecargar el hilo principal)
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false })
const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false })
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false })
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false })
const BarChart = dynamic(() => import("recharts").then(mod => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import("recharts").then(mod => mod.Bar), { ssr: false })
const LineChart = dynamic(() => import("recharts").then(mod => mod.LineChart), { ssr: false })
const Line = dynamic(() => import("recharts").then(mod => mod.Line), { ssr: false })

const hourlyData = [
  { h: "1", v: 50000 }, { h: "2", v: 120000 }, { h: "3", v: 200000 },
  { h: "4", v: 150000 }, { h: "5", v: 300000 }, { h: "6", v: 280000 },
  { h: "7", v: 420000 }, { h: "8", v: 800000 }, { h: "9", v: 450000 },
  { h: "10", v: 350000 }, { h: "11", v: 600000 }, { h: "12", v: 250000 },
]

const weeklyData = [
  { d: "Lun", v: 1200000 }, { d: "Mar", v: 900000 }, { d: "Mie", v: 1500000 },
  { d: "Jue", v: 800000 }, { d: "Vie", v: 2100000 }, { d: "Sab", v: 2690700 }, { d: "Dom", v: 500000 },
]

const weeklyTrend = [
  { d: "Lun", v: 1800000 }, { d: "Mar", v: 1200000 }, { d: "Mie", v: 2100000 },
  { d: "Jue", v: 950000 }, { d: "Vie", v: 2400000 }, { d: "Sab", v: 2690700 }, { d: "Dom", v: 650000 },
]

const paymentMethods = [
  { method: "Efectivo", amount: 1888700, color: "#4CAF50" },
  { method: "Tarjeta C/D", amount: 750000, color: "#2196F3" },
  { method: "Transferencia", amount: 52000, color: "#FF9800" },
]

const lowStockAlerts = [
  { item: "Camiseta Básica - M", remaining: 2 },
  { item: "Jean Clásico Slim - 32", remaining: 1 },
  { item: "Chaqueta Cuero - L", remaining: 0 },
  { item: "Gorra Urbana - Única", remaining: 3 },
]

const topSellers = [
  { name: "Sara Navarro", total: "$ 1,200,000", sales: 12 },
  { name: "Carlos Bernal", total: "$ 850,000", sales: 8 },
  { name: "Andrea Rivas", total: "$ 640,700", sales: 5 },
]

const formatCOP = (v: number) => "$ " + v.toLocaleString("es-CO")

export default function Dashboard() {
  const { sedeId, isSyncing } = useSede()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Mapeo dinámico del nombre de la Sede en base al Contexto Global
  const sedeName = useMemo(() => {
     if (sedeId === "1") return "Sede Principal (Centro)"
     if (sedeId === "2") return "Sucursal Norte (Boutique)"
     if (sedeId === "3") return "Bodega Outlet (Descuentos)"
     return "Sede Desconocida"
  }, [sedeId])

  if (!isClient) return null // Evita fallos de hidratación SSR de las gráficas

  return (
    <div className="flex flex-col xl:flex-row gap-6 pb-12">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Almacén selector (Sincronizado vía Contexto/Encabezado) */}
        <div className="flex items-center justify-between mb-5 bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-all duration-300">
           <div>
             <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Contexto de Análisis Activo</span>
             <h2 className="text-xl font-black text-gray-800 flex items-center gap-2 mt-1">
                <MapPin className="w-5 h-5 text-green-500" />
                {sedeName}
             </h2>
           </div>
           {isSyncing && (
             <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full animate-pulse border border-blue-200">
                Resincronizando Datos...
             </span>
           )}
        </div>

        {/* KPI Cards (Grid Autoadaptable) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {[
            { label: "Ventas Netas Hoy", value: "$ 2,690,700", trend: "+12.5%", isUp: true, icon: TrendingUp, bg: "bg-green-50", color: "text-green-500" },
            { label: "Ticket Promedio", value: "$ 179,380", trend: "+5.2%", isUp: true, icon: FileText, bg: "bg-blue-50", color: "text-blue-500" },
            { label: "Prendas Vendidas", value: "45", trend: "-2.1%", isUp: false, icon: ShoppingBag, bg: "bg-purple-50", color: "text-purple-500" },
            { label: "Devoluciones", value: "$ 0", trend: "0.0%", isUp: true, icon: AlertTriangle, bg: "bg-yellow-50", color: "text-yellow-500" },
          ].map((kpi) => {
            const Icon = kpi.icon
            return (
              <div key={kpi.label} className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between transition-opacity duration-300 ${isSyncing ? 'opacity-40 animate-pulse' : 'opacity-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${isSyncing ? 'bg-gray-200' : kpi.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${isSyncing ? 'text-gray-400' : kpi.color}`} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5 font-medium">{kpi.label}</p>
                    <p className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">{isSyncing ? '---' : kpi.value}</p>
                  </div>
                </div>
                {!isSyncing && (
                  <div className={`flex flex-col items-end gap-1 ${kpi.isUp ? 'text-green-600' : 'text-red-500'}`}>
                    <span className="text-xs font-bold">{kpi.trend}</span>
                    <span className="text-[9px] text-gray-400 font-medium">vs ayer</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Ventas por hora */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Ventas por hora (Hoy)</h3>
            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="h" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}k`}
                  />
                  <Tooltip formatter={(value: number) => [formatCOP(value), "Ventas"]} />
                  <Area type="monotone" dataKey="v" stroke="#4CAF50" strokeWidth={2} fill="url(#greenGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ventas por método de pago */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Ventas por método de pago (Hoy)</h3>
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <div key={pm.method} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: pm.color + "20" }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pm.color }} />
                    </div>
                    <span className="text-sm text-gray-700">{pm.method}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{formatCOP(pm.amount)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-700">Total</span>
                <span className="text-sm font-bold text-gray-900">{formatCOP(2690700)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Ventas por día (Semana)</h3>
            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${v / 1000}k`}
                />
                <Tooltip formatter={(value: number) => [formatCOP(value), "Ventas"]} />
                <Bar dataKey="v" fill="#4CAF50" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Tendencia semanal de ventas</h3>
            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${v / 1000}k`}
                />
                <Tooltip formatter={(value: number) => [formatCOP(value), "Ventas"]} />
                <Line type="monotone" dataKey="v" stroke="#4CAF50" strokeWidth={2} dot={{ fill: "#4CAF50", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Panels */}
      <div className="w-full xl:w-80 flex-shrink-0 space-y-4">
        
        {/* Alertas de Inventario Crítico */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-red-50/50">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-red-500" />
              Stock Crítico (Bajo 5 unds)
            </h3>
          </div>
          <div className="p-0 max-h-[300px] overflow-y-auto no-scrollbar">
            {lowStockAlerts.map((alert, i) => (
              <div key={i} className="flex justify-between items-center p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <span className="text-xs font-semibold text-gray-700">{alert.item}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${alert.remaining === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                  {alert.remaining} und
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Vendedores */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-blue-50/40">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-500" />
              Top Vendedores (Hoy)
            </h3>
          </div>
          <div className="p-0 max-h-[350px] overflow-y-auto no-scrollbar">
            {topSellers.map((seller, i) => (
              <div key={i} className="flex flex-col p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                 <div className="flex justify-between items-center mb-1">
                   <div className="flex gap-2 items-center">
                     <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                       {i + 1}
                     </span>
                     <span className="text-xs font-bold text-gray-700">{seller.name}</span>
                   </div>
                   <span className="text-xs font-bold text-[#4CAF50]">{seller.total}</span>
                 </div>
                 <div className="pl-7">
                   <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{seller.sales} prendas vendidas</span>
                 </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
