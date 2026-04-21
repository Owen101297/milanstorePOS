"use client"

import { useState } from "react"
import { ArrowDownCircle, ArrowUpCircle, CheckCircle, RefreshCcw, DollarSign } from "lucide-react"

export default function IngresarEfectivo() {
  const [tipo, setTipo] = useState<"INGRESO" | "EGRESO">("INGRESO")
  const [monto, setMonto] = useState("")
  const [categoria, setCategoria] = useState("BASE_INICIAL")
  const [descripcion, setDescripcion] = useState("")
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simula guardado en Supabase caja_movimientos y actualiza cálculo de cierre
    setTimeout(() => {
      setLoading(false)
      setExito(true)
      setTimeout(() => {
        setExito(false)
        setMonto("")
        setDescripcion("")
      }, 3000)
    }, 1500)
  }

  const opcionesCategoria = tipo === "INGRESO" ? [
    { id: "BASE_INICIAL", label: "Base Inicial / Sencillo del Día" },
    { id: "INGRESO_EXTRA", label: "Ingreso Extraordinario" },
  ] : [
    { id: "PAGO_PROVEEDOR", label: "Pago a Proveedor desde Caja" },
    { id: "GASTOS_VARIOS", label: "Gastos Varios (Alimentación, Transporte)" },
    { id: "RETIRO_PARCIAL", label: "Retiro Parcial de Efectivo (Consignación)" },
  ];

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-600"/> Gestión de Efectivo Físico
        </h2>
        <p className="text-sm text-gray-500 mt-1">Registra las entradas o salidas de efectivo que no corresponden a ventas, para no descuadrar el arqueo.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button 
             onClick={() => { setTipo("INGRESO"); setCategoria("BASE_INICIAL"); }}
             className={`flex-1 py-4 text-sm font-bold flex justify-center items-center gap-2 transition-colors ${tipo === "INGRESO" ? 'bg-green-50 text-green-700 border-b-2 border-green-500' : 'text-gray-500 hover:bg-gray-50'}`}
          >
             <ArrowDownCircle className="w-4 h-4"/> INGRESAR A CAJA
          </button>
          <button 
             onClick={() => { setTipo("EGRESO"); setCategoria("PAGO_PROVEEDOR"); }}
             className={`flex-1 py-4 text-sm font-bold flex justify-center items-center gap-2 transition-colors ${tipo === "EGRESO" ? 'bg-red-50 text-red-700 border-b-2 border-red-500' : 'text-gray-500 hover:bg-gray-50'}`}
          >
             <ArrowUpCircle className="w-4 h-4"/> RETIRAR DE CAJA
          </button>
        </div>

        <form onSubmit={handleGuardar} className="p-6 space-y-5">
            {exito && (
               <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                 <CheckCircle className="w-5 h-5 text-green-500" />
                 <span className="text-sm font-medium">Movimiento registrado de forma segura. El arqueo se ha actualizado.</span>
               </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Categoría</label>
                <select 
                   value={categoria} 
                   onChange={e => setCategoria(e.target.value)}
                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                   {opcionesCategoria.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Monto (COP)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input 
                    type="text" 
                    required
                    value={monto} 
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setMonto(val ? Number(val).toLocaleString('es-CO') : '');
                    }}
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-lg font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Descripción / Observaciones</label>
              <textarea 
                required
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                placeholder={tipo === "EGRESO" ? "Ej: Pago de factura de internet a Tigo..." : "Ej: Billetes de 10 mil para devolver..."}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
              />
            </div>

            <button 
               type="submit" 
               disabled={loading || !monto}
               className={`w-full py-3 rounded-lg text-white font-bold transition-colors flex justify-center items-center gap-2
                 ${tipo === "INGRESO" ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                 ${(loading || !monto) ? 'opacity-50 cursor-not-allowed' : ''}
               `}
            >
               {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : (tipo === "INGRESO" ? "Añadir a mi Gabeta" : "Restar de mi Gabeta")}
            </button>
        </form>
      </div>
    </div>
  )
}
