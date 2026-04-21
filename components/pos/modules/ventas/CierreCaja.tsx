"use client"

import { useState } from "react"
import { Lock, Calculator, AlertTriangle, CheckCircle, Printer } from "lucide-react"

export default function CierreCaja() {
  const [efectivoDeclarado, setEfectivoDeclarado] = useState<string>("")
  const [paso, setPaso] = useState<1 | 2>(1)
  
  // Data inmutable simulada proveniente de la Sessión
  const mockCalculoBackend = {
    base_inicial: 200000,
    efectivo_ventas: 850000,
    tarjetas_ventas: 320000,
    transferencias: 140000,
    gastos_retirados: 50000,
  }
  
  const esperadoEnCajaFisica = mockCalculoBackend.base_inicial + mockCalculoBackend.efectivo_ventas - mockCalculoBackend.gastos_retirados
  const declarado = Number(efectivoDeclarado.replace(/\D/g, ''))
  const diferencia = declarado - esperadoEnCajaFisica
  
  const formatCOP = (v: number) => "$ " + v.toLocaleString("es-CO")

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-600"/> Cierre de Caja (Arqueo Ciego)
        </h2>
        <p className="text-sm text-gray-500 mt-1">Sede Principal • Cajero: Juan Pérez • ID Sesión: #CJ-1049</p>
      </div>

      {paso === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-xl mx-auto text-center">
          <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Declaración Física de Efectivo</h3>
          <p className="text-sm text-gray-500 mb-6">
            Por favor, cuenta los billetes y monedas de tu gaveta física y digita el valor total exacto. 
            El sistema registrará esta declaración bajo una restricción inmutable.
          </p>
          
          <div className="relative max-w-xs mx-auto mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
            <input 
              type="text" 
              value={efectivoDeclarado}
              onChange={(e) => {
                 const num = e.target.value.replace(/\D/g, '')
                 setEfectivoDeclarado(num ? Number(num).toLocaleString('es-CO') : "")
              }}
              className="w-full text-center text-3xl font-black text-gray-800 border-2 border-gray-300 rounded-xl py-3 focus:outline-none focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <button 
             onClick={() => {
                if(!efectivoDeclarado) return alert("Debes declarar el monto físico.")
                setPaso(2)
             }}
             className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors w-full max-w-xs"
          >
             Procesar Auditoría Mágica
          </button>
        </div>
      )}

      {paso === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-0 overflow-hidden max-w-xl mx-auto">
          {diferencia === 0 ? (
             <div className="bg-green-50 p-6 flex flex-col items-center border-b border-green-100">
                <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                <h3 className="text-lg font-black text-green-800">¡Cuadre Perfecto!</h3>
                <p className="text-sm text-green-700">El efectivo físico coincide exactamente con el sistema.</p>
             </div>
          ) : (
             <div className="bg-red-50 p-6 flex flex-col items-center border-b border-red-100">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-2" />
                <h3 className="text-lg font-black text-red-800">Descuadre Detectado</h3>
                <p className="text-sm text-red-700 font-bold mt-1">Diferencia: {formatCOP(diferencia)}</p>
                <p className="text-xs text-red-600 mt-2 text-center">Un registro inmutable ha sido enviado al log de auditoría del administrador.</p>
             </div>
          )}

          <div className="p-6">
             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Resumen de Cierre Generado</h4>
             <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Base Inicial:</span> <span className="font-medium text-gray-800">{formatCOP(mockCalculoBackend.base_inicial)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Ventas Efectivo:</span> <span className="font-medium text-gray-800">+{formatCOP(mockCalculoBackend.efectivo_ventas)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Salidas / Gastos Gaveta:</span> <span className="font-medium text-red-600">-{formatCOP(mockCalculoBackend.gastos_retirados)}</span></div>
                <div className="flex justify-between pt-2 border-t border-gray-100"><span className="text-gray-800 font-bold">Efectivo Físico Declarado:</span> <span className="font-black text-gray-900">{formatCOP(declarado)}</span></div>
             </div>

             <div className="mt-6 pt-4 border-t border-gray-100 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Ventas Tarjeta Datafono:</span> <span className="font-medium text-blue-600">{formatCOP(mockCalculoBackend.tarjetas_ventas)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Transferencias Bancarias:</span> <span className="font-medium text-purple-600">{formatCOP(mockCalculoBackend.transferencias)}</span></div>
             </div>

             <div className="mt-8 flex gap-3">
               <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition-colors">
                  <Printer className="w-4 h-4"/> Imprimir Ticket Cierre
               </button>
               <button onClick={() => alert("Sesión Cajero Finalizada con Éxito. Bloqueando terminal.")} className="flex-1 py-3 bg-[#2d2d2d] hover:bg-black text-white font-bold rounded-lg transition-colors shadow-sm">
                  Finalizar y Bloquear POS
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
