"use client"

import { useState, useEffect } from "react"
import { Download, Loader2 } from "lucide-react"

const formatCOP = (v: number) => "$ " + v.toLocaleString("es-CO")

const mockEmpleadosActivos = [
  { id: 1, nombre: "Camilo Rodríguez", cargo: "Cajero", salario: 1300000 },
  { id: 2, nombre: "Daniela Mora", cargo: "Vendedora", salario: 1300000 },
  { id: 3, nombre: "Esteban Villa", cargo: "Supervisor", salario: 2100000 }
]

export default function ModuloLiquidaciones() {
  const [isLoading, setIsLoading] = useState(true)
  const [liquidaciones, setLiquidaciones] = useState<{id: number, nombre: string, cargo: string, salario: number}[]>([])

  useEffect(() => {
    // Simulación de Supabase RPC para procesar pagos
    const fetchData = async () => {
       setTimeout(() => {
          setLiquidaciones(mockEmpleadosActivos)
          setIsLoading(false)
       }, 1000)
    }
    fetchData()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
         <h3 className="text-sm font-bold text-gray-800">Cálculo de Periodo (Abril 2026)</h3>
         <div className="flex gap-2">
           <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded shadow-sm hover:bg-gray-50 transition-colors">
              Pre-liquidar Mes
           </button>
           <button onClick={() => alert("Transacción atómica: Sellando históricos en Supabase. Registros Inmutables.")} className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded shadow-sm hover:bg-red-700 transition-colors">
              Sellar y Cerrar Mes (Inmutable)
           </button>
         </div>
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 text-gray-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#4CAF50]"/>
            <p className="text-sm font-medium">Cruzando salarios y comisiones con Supabase...</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-white border-b border-gray-100">
            <tr>{["Empleado", "Salario Base", "Comisiones POS", "Deducciones Ley", "Neto a Pagar", "Desprendible PDF"].map(h =>
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600">{h}</th>
            )}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {liquidaciones.map(e => {
              const isComm = e.cargo === "Vendedor" || e.cargo === "Cajera";
              const base = Number(e.salario);
              const deduccion = base * 0.08; 
              const comision = isComm ? 150000 : 0;
              const neto = base + comision - deduccion;
              return (
              <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-bold text-gray-800">{e.nombre}</td>
                <td className="px-4 py-3 text-gray-600">{formatCOP(base)}</td>
                <td className="px-4 py-3 text-[#4CAF50] font-medium">{isComm ? formatCOP(comision) : "-"}</td>
                <td className="px-4 py-3 text-red-500 font-medium">-{formatCOP(deduccion)}</td>
                <td className="px-4 py-3 font-black text-gray-900">{formatCOP(neto)}</td>
                <td className="px-4 py-3">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold text-gray-700 transition-colors">
                    <Download className="w-3.5 h-3.5"/> Descargar
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      )}
    </div>
  )
}
