"use client"

import React, { forwardRef } from 'react'

interface TicketProps {
  cart: any[]
  total: number
  clientName: string
  sellerName: string
  paymentInfo: { method: string, amount: number }[]
  vueltos: number
}

// Este componente utiliza un "ref" para que react-to-print u otra librería
// capture silenciosamente el DOOM renderizado y lo mande al spooler de impresión.
export const TicketImpreso = forwardRef<HTMLDivElement, TicketProps>(
  ({ cart, total, clientName, sellerName, paymentInfo, vueltos }, ref) => {
    
    const fecha = new Date().toLocaleString()
    const subtotal = total / 1.19
    const iva = total - subtotal

    return (
      <div ref={ref} className="bg-white p-4 font-mono text-black text-[12px] leading-tight" style={{ width: '80mm', minHeight: '100px', margin: '0 auto' }}>
         
         <div className="text-center mb-4 border-b border-dashed border-black pb-4 mt-8">
            <h1 className="text-xl font-bold uppercase mb-1 tracking-widest">MILAN RETAIL</h1>
            <p>NIT: 900.123.456-7</p>
            <p>Sede Principal - Centro</p>
            <p className="mt-1">Tel: +57 320 123 4567</p>
         </div>

         <div className="mb-4">
            <p><strong>Fecha:</strong> {fecha}</p>
            <p><strong>Factura de Venta POS:</strong> #FACT-002931</p>
            <p><strong>Cliente:</strong> {clientName}</p>
            <p><strong>Atendido por:</strong> {sellerName}</p>
         </div>

         <table className="w-full mb-4 border-t border-b border-black py-2">
           <thead>
             <tr className="text-left border-b border-black">
               <th className="pb-1 w-1/2">Cant x Artículo</th>
               <th className="pb-1 text-right">Total</th>
             </tr>
           </thead>
           <tbody>
             {cart.map((item, idx) => (
               <tr key={idx} className="align-top">
                 <td className="py-1">
                   {item.qty}x {item.name} 
                   {(item.size || item.color) && <div className="text-[10px] ml-4 text-gray-600">({item.size} {item.color})</div>}
                 </td>
                 <td className="py-1 text-right font-bold">${(item.price * item.qty).toLocaleString()}</td>
               </tr>
             ))}
           </tbody>
         </table>

         <div className="flex flex-col items-end mb-4 font-bold text-sm">
            <div className="w-full flex justify-between font-normal">
              <span>Subtotal:</span>
              <span>${Math.round(subtotal).toLocaleString()}</span>
            </div>
            <div className="w-full flex justify-between font-normal mb-1">
              <span>IVA (19%):</span>
              <span>${Math.round(iva).toLocaleString()}</span>
            </div>
            <div className="w-full flex justify-between text-[16px] mt-1 border-t border-dashed border-black pt-1">
              <span>TOTAL:</span>
              <span>${total.toLocaleString()}</span>
            </div>
         </div>

         <div className="mb-4 text-[11px]">
            <p className="font-bold border-b border-black mb-1">Caja y Pagos:</p>
            {paymentInfo.map((p, i) => (
              <div key={i} className="flex justify-between">
                 <span>Pago en {p.method}:</span>
                 <span>${p.amount.toLocaleString()}</span>
              </div>
            ))}
            {vueltos > 0 && (
              <div className="flex justify-between font-bold mt-1">
                 <span>Vueltos/Cambio:</span>
                 <span>${vueltos.toLocaleString()}</span>
              </div>
            )}
         </div>

         <div className="text-center text-[10px] uppercase font-bold border-t border-dashed border-black pt-4 pb-12 mt-6">
            <p>¡Gracias por tu compra en Milan!</p>
            <p className="mt-1">Conserva este ticket para cambios</p>
            <p>(Válido por 30 días)</p>
            
            <div className="mt-4 flex justify-center">
              {/* Espacio para simulación de un Código QR (o código de barras) de factura electrónica */}
              <div className="border border-black p-1 w-24 h-24 flex items-center justify-center">
                 [ QR DIAN ]
              </div>
            </div>
         </div>
      </div>
    )
  }
)

TicketImpreso.displayName = 'TicketImpreso'
