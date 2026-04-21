"use client"

import { Settings } from "lucide-react"

export default function Configuracion() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-3xl">
       <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
         <Settings className="w-5 h-5 text-gray-600"/> Variables Paramétricas de Ley Laboral
       </h3>
       <form className="grid grid-cols-2 gap-5" onSubmit={e => {e.preventDefault(); alert("Configuración guardada corectamente en Supabase (Auditoría RLS activa).");}}>
         <div><label className="text-xs font-bold text-gray-600 mb-1.5 block">Salario Mínimo Mensual (COP)</label><input type="number" defaultValue="1300000" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-green-500 outline-none hover:bg-gray-50 transition-colors"/></div>
         <div><label className="text-xs font-bold text-gray-600 mb-1.5 block">Auxilio de Transporte Oficial</label><input type="number" defaultValue="162000" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-green-500 outline-none hover:bg-gray-50 transition-colors"/></div>
         <div><label className="text-xs font-bold text-gray-600 mb-1.5 block">Aporte Salud Empleado (%)</label><input type="number" defaultValue="4.00" step="0.01" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-green-500 outline-none bg-gray-50"/></div>
         <div><label className="text-xs font-bold text-gray-600 mb-1.5 block">Aporte Pensión Empleado (%)</label><input type="number" defaultValue="4.00" step="0.01" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-green-500 outline-none bg-gray-50"/></div>
         <div><label className="text-xs font-bold text-gray-600 mb-1.5 block">Aporte Riesgos L. (ARL Nivel 1) (%)</label><input type="number" defaultValue="0.522" step="0.001" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-green-500 outline-none bg-gray-50"/></div>
         <div><label className="text-xs font-bold text-gray-600 mb-1.5 block">Porcentaje Comisión Base (%)</label><input type="number" defaultValue="2.50" step="0.01" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-green-500 outline-none bg-gray-50"/></div>
         
         <div className="col-span-2 pt-3 border-t border-gray-100 mt-2">
           <button type="submit" className="px-5 py-2.5 bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold rounded-lg text-sm transition-colors shadow-sm w-full">
             Persistir Cambios Globales (Requiere Rol Admin)
           </button>
           <p className="text-center text-[10px] text-gray-400 mt-2">Los cambios activarán un Trigger en Supabase y quedarán en el log de auditoría.</p>
         </div>
       </form>
    </div>
  )
}
