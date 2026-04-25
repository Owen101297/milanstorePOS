"use client"

import { Lock, LogIn, Calendar, Clock } from "lucide-react"
import { useSede } from "@/components/pos/providers/SedeContext"
import type { VenderStore } from "./useVenderStore"

export function AperturaCaja({ store }: { store: VenderStore }) {
  const { sedeNombre } = useSede()

  return (
    <div className="h-[calc(100vh-130px)] bg-[#f4f7f6] flex items-center justify-center rounded-tl-3xl border-l border-t border-gray-200">
      <div className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header - Vendty Dark Style */}
        <div className="px-6 py-4 bg-[#2b2b2b] flex items-center justify-between">
          <h2 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Lock size={16} className="text-[#62cb31]" /> Control de Caja
          </h2>
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Apertura</div>
        </div>
        
        <div className="p-10">
          {/* Sede Info Card */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 flex flex-col items-center border border-gray-100">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-gray-100">
                <LogIn className="w-8 h-8 text-[#62cb31]" />
             </div>
             <div className="text-center">
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">{sedeNombre || "Sede Principal"}</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Sesión de Venta Activa</p>
             </div>
          </div>

          {/* Form */}
          <div className="space-y-8">
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block text-center">Valor Base de Apertura (Efectivo)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-200">$</span>
                <input 
                  type="number" 
                  autoFocus
                  value={store.valorApertura || ""}
                  onChange={(e) => store.setValorApertura(Number(e.target.value))}
                  onKeyDown={(e) => { if (e.key === "Enter") store.handleAbrirCaja(); }}
                  className="w-full text-center px-4 py-4 border-b-2 border-gray-100 text-4xl font-black text-gray-800 focus:border-[#62cb31] outline-none transition-all placeholder:text-gray-100"
                  placeholder="0" 
                />
              </div>
            </div>

            {/* Date/Time Footer */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-gray-50 rounded text-gray-400"><Calendar size={14} /></div>
                 <div>
                    <p className="text-[9px] font-black text-gray-300 uppercase">Fecha</p>
                    <p className="text-[11px] font-bold text-gray-600">{new Date().toLocaleDateString()}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 justify-end text-right">
                 <div>
                    <p className="text-[9px] font-black text-gray-300 uppercase">Hora</p>
                    <p className="text-[11px] font-bold text-gray-600">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                 </div>
                 <div className="p-2 bg-gray-50 rounded text-gray-400"><Clock size={14} /></div>
              </div>
            </div>
          </div>

          <button 
            onClick={store.handleAbrirCaja}
            className="w-full mt-10 py-4 bg-[#62cb31] text-white font-black text-xs uppercase tracking-widest rounded shadow-xl shadow-green-500/20 hover:bg-[#58b72c] transition-all flex items-center justify-center gap-2"
          >
            Abrir Caja y Comenzar
          </button>
        </div>
      </div>
    </div>
  )
}
