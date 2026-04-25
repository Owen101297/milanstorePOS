"use client"

import { 
  User, Trash2, Edit, MessageSquare, HandCoins, FileText, Bike, X, Search, Plus, Clock
} from "lucide-react"
import { formatCOP, getItemPrice } from "./types"
import type { VenderStore } from "./useVenderStore"

export function CartPanel({ store }: { store: VenderStore }) {
  const totalItems = store.cart.reduce((acc, item) => acc + item.unidades, 0)

  return (
    <div className="w-full h-full bg-white flex flex-col border-l border-gray-200">
      {/* Header: Cliente y Vendedor (Vendty Style) */}
      <div className="p-3 bg-[#f5f5f5] space-y-2">
        <div className="flex gap-2">
           <div className="flex-1 relative">
              <input 
                type="text"
                placeholder="Cliente"
                value={store.clientSearch}
                onChange={(e) => store.setClientSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-full pl-3 pr-10 py-1.5 text-[12px] outline-none focus:border-[#62cb31]"
              />
              <button 
                onClick={() => store.setShowClientForm(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#62cb31] hover:bg-green-50 p-1 rounded-full"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
           </div>
           <div className="flex-1 relative">
              <input 
                type="text"
                placeholder="Vendedor"
                className="w-full bg-white border border-gray-200 rounded-full pl-3 pr-10 py-1.5 text-[12px] outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300">
                <User size={16} />
              </div>
           </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_50px_80px_80px] px-4 py-2 bg-white border-b border-gray-100 text-[10px] font-bold text-gray-800 uppercase tracking-tight">
        <span>Productos ({totalItems})</span>
        <span className="text-center">Cant.</span>
        <span className="text-right">Total</span>
        <span className="text-right">Subtotal</span>
      </div>

      {/* Cart Items Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {store.cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 p-8">
            <p className="text-[12px] font-medium italic">No existen productos</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {store.cart.map((item) => (
              <div key={item.cartItemId} className="group relative">
                <div className="grid grid-cols-[1fr_50px_80px_80px] items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="pr-2">
                    <p className="text-[11px] font-bold text-gray-700 leading-tight uppercase">{item.nombre_producto}</p>
                    <div className="flex gap-2 mt-1">
                       <button onClick={() => store.openNotesForItem(item.cartItemId)} className="text-[9px] text-blue-500 hover:underline">Nota</button>
                       <button onClick={() => store.removeItem(item.cartItemId)} className="text-[9px] text-red-500 hover:underline">Eliminar</button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <input 
                      type="number"
                      value={item.unidades}
                      onChange={(e) => store.updateQty(item.cartItemId, parseInt(e.target.value) || 1)}
                      className="w-10 text-center text-[11px] font-bold border border-gray-200 rounded p-0.5 outline-none focus:border-[#62cb31]"
                    />
                  </div>

                  <div className="text-right text-[11px] font-bold text-gray-600">
                    {Math.round(getItemPrice(item)).toLocaleString("es-CO")}
                  </div>

                  <div className="text-right text-[11px] font-black text-gray-800">
                    {Math.round(getItemPrice(item) * item.unidades).toLocaleString("es-CO")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions & Totals */}
      <div className="bg-white border-t border-gray-100 p-4 space-y-4">
        {/* Action Buttons (The 3 gray boxes) */}
        <div className="grid grid-cols-3 gap-2">
          <ActionButton icon={HandCoins} label="Separar" onClick={() => store.setShowPlanSepare(true)} />
          <ActionButton icon={FileText} label="Nota" onClick={() => store.setShowSaleNotesForm(true)} />
          <ActionButton icon={Bike} label="Domicilio" onClick={() => store.setShowDomicilioForm(true)} />
        </div>

        {/* Totals Section */}
        <div className="space-y-1 py-2">
          <div className="flex justify-between items-center text-[11px] text-gray-500 font-bold">
            <span className="uppercase tracking-widest">Subtotal</span>
            <span>$ {store.subtotal.toLocaleString("es-CO")}</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-gray-500 font-bold">
            <span className="uppercase tracking-widest">Impuesto</span>
            <span>$ {store.impuesto.toLocaleString("es-CO")}</span>
          </div>
          <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
            <span className="text-[14px] font-black text-gray-800 uppercase tracking-tighter">Total</span>
            <span className="text-[20px] font-black text-gray-900">$ {store.total.toLocaleString("es-CO")}</span>
          </div>
        </div>

        {/* Bottom Bar: Cancelar, Espera, PAGAR */}
        <div className="grid grid-cols-[1fr_1fr_2fr] gap-3 pt-2">
          <button 
            onClick={() => store.clearCart()}
            className="py-3 bg-[#e74c3c] text-white text-[11px] font-black uppercase tracking-widest rounded hover:bg-red-700 transition-all shadow-sm"
          >
            Cancelar
          </button>
          <button 
            onClick={() => store.holdSale()}
            className="py-3 bg-[#e5e7eb] text-gray-600 text-[11px] font-black uppercase tracking-widest rounded hover:bg-gray-300 transition-all shadow-sm"
          >
            Espera
          </button>
          <button 
            onClick={() => store.openPaymentModal()}
            disabled={store.cart.length === 0}
            className="py-3 bg-[#62cb31] text-white text-[16px] font-black uppercase tracking-widest rounded hover:bg-[#58b72c] transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:shadow-none"
          >
            PAGAR
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionButton({ icon: Icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3 bg-[#e5e7eb] hover:bg-gray-300 rounded transition-all group"
    >
      <Icon size={20} className="text-gray-500 mb-1 group-hover:scale-110 transition-transform" />
      <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">{label}</span>
    </button>
  )
}
