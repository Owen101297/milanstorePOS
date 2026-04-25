"use client"

import { X, Trash2, CreditCard, Banknote, Landmark, Gift, Ticket, Save, Check } from "lucide-react"
import { formatCOP } from "./types"
import type { VenderStore } from "./useVenderStore"

export function PaymentModal({ store }: { store: VenderStore }) {
  if (!store.showPayment) return null

  const methods = [
    { id: 'efectivo', label: 'Efectivo', icon: Banknote, color: 'text-green-600' },
    { id: 'tarjeta_credito', label: 'Tarjeta', icon: CreditCard, color: 'text-blue-600' },
    { id: 'Transferencia', label: 'Transferencia', icon: Landmark, color: 'text-purple-600' },
    { id: 'Gift_Card', label: 'Gift Card', icon: Gift, color: 'text-pink-600' },
    { id: 'Credito', label: 'Crédito', icon: Ticket, color: 'text-amber-600' },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => store.setShowPayment(false)}>
      <div className="bg-white rounded shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        
        {/* Header - Black background */}
        <div className="px-6 py-4 bg-[#2b2b2b] flex items-center justify-between">
          <h2 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Check size={18} className="text-[#62cb31]" /> Información de Pago
          </h2>
          <button onClick={() => store.setShowPayment(false)} className="text-white/60 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex h-[480px]">
          
          {/* Left Panel: Summary & Added Payments */}
          <div className="w-1/3 bg-gray-50 border-r border-gray-100 p-6 flex flex-col">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Resumen de Venta</h3>
            
            <div className="space-y-3 mb-8">
               <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatCOP(store.subtotal)}</span>
               </div>
               <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>Impuestos</span>
                  <span>{formatCOP(store.impuesto)}</span>
               </div>
               <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-xs font-black text-gray-800 uppercase">Total a Pagar</span>
                  <span className="text-lg font-black text-[#62cb31]">{formatCOP(store.total)}</span>
               </div>
            </div>

            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Pagos Registrados</h3>
            <div className="flex-1 overflow-y-auto space-y-2">
               {store.paymentForms.length === 0 ? (
                 <p className="text-[10px] text-gray-300 italic text-center py-4">No se han registrado pagos</p>
               ) : (
                 store.paymentForms.map((p, idx) => (
                   <div key={idx} className="bg-white border border-gray-100 p-3 rounded flex justify-between items-center shadow-sm group">
                      <div>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{p.forma_pago}</p>
                         <p className="text-xs font-bold text-gray-800">{formatCOP(p.valor_entregado)}</p>
                      </div>
                      <button onClick={() => store.removePaymentForm(idx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                   </div>
                 ))
               )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase">Restante</span>
                  <span className="text-sm font-black text-red-500">{formatCOP(store.remaining)}</span>
               </div>
            </div>
          </div>

          {/* Right Panel: Selection & Input */}
          <div className="flex-1 p-8 flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Seleccionar Medio de Pago</label>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
               {methods.map((m) => {
                 const Icon = m.icon
                 const isActive = store.currentPaymentMethod === m.id
                 return (
                   <button 
                     key={m.id}
                     onClick={() => store.setCurrentPaymentMethod(m.id)}
                     className={`flex flex-col items-center justify-center p-4 rounded border-2 transition-all ${
                       isActive ? 'border-[#62cb31] bg-green-50/30' : 'border-gray-50 hover:border-gray-200 bg-white'
                     }`}
                   >
                     <Icon size={24} className={isActive ? 'text-[#62cb31]' : 'text-gray-300'} />
                     <span className={`text-[9px] font-black uppercase mt-2 ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                       {m.label}
                     </span>
                   </button>
                 )
               })}
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block text-center">Monto a Entregar</label>
              <div className="relative mb-6">
                 <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-200">$</span>
                 <input 
                   type="number"
                   autoFocus
                   value={store.currentPaymentAmount}
                   onChange={(e) => store.setCurrentPaymentAmount(e.target.value)}
                   className="w-full text-center text-5xl font-black text-gray-800 border-b-2 border-gray-100 py-4 focus:outline-none focus:border-[#62cb31] transition-colors"
                   placeholder="0"
                 />
              </div>

              <button 
                onClick={store.addPaymentForm}
                className="w-full py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded shadow-xl hover:bg-black transition-all mb-4"
              >
                Registrar Pago
              </button>
              
              <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded">
                 <span className="text-[10px] font-black text-gray-400 uppercase">Cambio</span>
                 <span className="text-xl font-black text-gray-800">{formatCOP(store.change)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="fe"
              checked={store.facturacionElectronica}
              onChange={(e) => store.setFacturacionElectronica(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#62cb31] focus:ring-[#62cb31]" 
            />
            <label htmlFor="fe" className="text-[10px] font-black text-gray-500 uppercase tracking-widest cursor-pointer">Facturación Electrónica</label>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => store.setShowPayment(false)}
              className="px-8 py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-white border border-transparent hover:border-gray-200 rounded transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={store.completeSale}
              disabled={store.remaining > 0 && store.currentPaymentMethod !== "Credito"}
              className="px-10 py-3 bg-[#62cb31] text-white rounded font-black text-xs uppercase tracking-widest shadow-xl shadow-green-500/20 hover:bg-[#58b72c] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} /> Finalizar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
