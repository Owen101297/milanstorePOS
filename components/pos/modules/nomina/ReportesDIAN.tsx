"use client"

import { FileCheck, Eye } from "lucide-react"

export default function ReportesDIAN() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-4xl">
       <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
         <FileCheck className="w-5 h-5 text-blue-500"/> Visor de Nómina Electrónica (DIAN)
       </h3>
       <div className="flex bg-blue-50 p-4 rounded-lg border border-blue-100 mb-5 gap-4 items-center">
         <div className="flex-1">
            <h4 className="font-bold text-blue-900 text-sm">Validación Pre-Transmisión DIAN</h4>
            <p className="text-xs text-blue-700 mt-1">El sistema verifica: Cédula, Dirección, Código DANE Municipal y Correo para evitar rechazos técnicos.</p>
         </div>
         <button className="px-4 py-2 bg-blue-600 text-white rounded font-bold text-xs shadow-sm hover:bg-blue-700 transition">
            Ejecutar Analizador XML
         </button>
       </div>
       <div className="space-y-4">
         {[ { pe: "Abril 2026", pre: "NOM", cons: "1025", cune: "f4b...39e", stat: "Aceptado DIAN", col: "text-green-600 bg-green-100" },
            { pe: "Marzo 2026", pre: "NOM", cons: "1024", cune: "a1c...9x2", stat: "Aceptado DIAN", col: "text-green-600 bg-green-100" },
            { pe: "Febrero 2026", pre: "NOM", cons: "1023", cune: "y3p...8m1", stat: "Rechazado", col: "text-red-600 bg-red-100" }
         ].map((n, i) => (
            <div key={i} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <p className="font-bold text-gray-800">Periodo de Envío: {n.pe}</p>
                     <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${n.col}`}>{n.stat}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">Prefijo/Num: {n.pre}-{n.cons} | Hash CUNE: {n.cune}</p>
               </div>
               <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded hover:bg-gray-200" title="Ver XML de transmisión">XML</button>
                  <button className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100" title="Acuse de Recibo"><Eye className="w-3.5 h-3.5"/></button>
               </div>
            </div>
         ))}
       </div>
    </div>
  )
}
