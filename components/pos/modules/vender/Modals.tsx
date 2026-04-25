"use client"

import { 
  Tag, Calculator, UserPlus, Clock, Lock, X, 
  Trash2, CheckCircle, AlertTriangle, FileText, Bike, HandCoins
} from "lucide-react"
import { formatCOP, parseNumber } from "./types"
import type { VenderStore } from "./useVenderStore"

/** 
 * DISEÑO ESTÁNDAR PARA MODALES VENDTY:
 * - Header: #2b2b2b (Gris muy oscuro / Negro)
 * - Títulos: Blanco, uppercase, bold.
 * - Inputs: Bordes finos, gris claro, fuentes legibles.
 * - Botones Acción: #62cb31 (Verde Vendty).
 */

/** Modal: Aplicar Descuento */
export function DiscountModal({ store }: { store: VenderStore }) {
  if (!store.showDiscountForm) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => store.setShowDiscountForm(false)}>
      <div className="bg-white rounded shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between">
           <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
             <Tag size={16} /> Aplicar Descuento
           </h3>
           <button onClick={() => store.setShowDiscountForm(false)} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Tipo de descuento</label>
            <div className="flex bg-gray-100 p-1 rounded">
               <button 
                 onClick={() => store.setDiscountType("%")}
                 className={`flex-1 py-2 text-xs font-bold rounded transition-all ${store.discountType === '%' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
               >Porcentaje (%)</button>
               <button 
                 onClick={() => store.setDiscountType("$")}
                 className={`flex-1 py-2 text-xs font-bold rounded transition-all ${store.discountType === '$' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
               >Valor ($)</button>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Valor</label>
            <input 
              type="number" 
              value={store.discountValueInput} 
              onChange={(e) => store.setDiscountValueInput(e.target.value)}
              className="w-full border border-gray-200 rounded px-4 py-4 text-3xl font-black text-center focus:border-[#62cb31] outline-none transition-all"
              placeholder="0" autoFocus 
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex gap-3">
            <button onClick={() => store.setShowDiscountForm(false)} className="flex-1 py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-white border border-transparent hover:border-gray-200 rounded transition-all">Cancelar</button>
            <button onClick={store.applyDiscount} className="flex-1 py-3 bg-[#62cb31] text-white rounded font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-[#58b72c] transition-all">Aplicar</button>
        </div>
      </div>
    </div>
  )
}

/** Modal: Modificar Precio */
export function ManualPriceModal({ store }: { store: VenderStore }) {
  if (!store.showCalculatePrice) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => store.setShowCalculatePrice(false)}>
      <div className="bg-white rounded shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between">
           <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
             <Calculator size={16} /> Modificar Precio
           </h3>
           <button onClick={() => store.setShowCalculatePrice(false)} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="p-8">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block text-center">Nuevo precio de venta</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-300">$</span>
            <input 
              type="number" 
              value={store.manualPriceValue} 
              onChange={(e) => store.setManualPriceValue(e.target.value)}
              className="w-full border border-gray-200 rounded pl-10 pr-4 py-5 text-3xl font-black text-gray-800 focus:border-[#62cb31] outline-none transition-all text-right"
              placeholder="0" autoFocus 
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex gap-3">
          <button onClick={() => store.setShowCalculatePrice(false)} className="flex-1 py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-white border border-transparent hover:border-gray-200 rounded transition-all">Cancelar</button>
          <button onClick={store.applyManualPrice} className="flex-1 py-3 bg-[#62cb31] text-white rounded font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-[#58b72c] transition-all">Confirmar</button>
        </div>
      </div>
    </div>
  )
}

/** Modal: Nota del Producto */
export function ItemNotesModal({ store }: { store: VenderStore }) {
  if (!store.showNotaForm) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => store.setShowNotaForm(false)}>
      <div className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between">
           <h3 className="text-white text-xs font-black uppercase tracking-widest">Nota del Producto</h3>
           <button onClick={() => store.setShowNotaForm(false)} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="p-8">
          <textarea 
            autoFocus
            value={store.itemNotes} 
            onChange={(e) => store.setItemNotes(e.target.value)}
            className="w-full border border-gray-200 rounded px-4 py-3 text-sm h-32 resize-none focus:border-[#62cb31] outline-none transition-all"
            placeholder="Agregue notas sobre este producto..." 
          />
        </div>
        <div className="p-4 bg-gray-50 flex gap-3">
          <button onClick={() => store.setShowNotaForm(false)} className="flex-1 py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-white border border-transparent hover:border-gray-200 rounded transition-all">Cancelar</button>
          <button onClick={store.applyItemNotes} className="flex-1 py-3 bg-[#62cb31] text-white rounded font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-[#58b72c] transition-all">Guardar</button>
        </div>
      </div>
    </div>
  )
}

/** Modal: IMEI/Serial */
export function ImeiModal({ store }: { store: VenderStore }) {
  if (!store.showImeiForm) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => store.setShowImeiForm(false)}>
      <div className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between">
           <h3 className="text-white text-xs font-black uppercase tracking-widest">Seriales / IMEI</h3>
           <button onClick={() => store.setShowImeiForm(false)} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="p-8">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Ingrese los seriales (uno por línea)</label>
          <textarea 
            autoFocus
            value={store.imeiValues} 
            onChange={(e) => store.setImeiValues(e.target.value)}
            className="w-full border border-gray-200 rounded px-4 py-3 text-sm h-48 font-mono resize-none focus:border-[#62cb31] outline-none transition-all"
            placeholder={"IMEI001\nIMEI002\nIMEI003"} 
          />
        </div>
        <div className="p-4 bg-gray-50 flex gap-3">
          <button onClick={() => store.setShowImeiForm(false)} className="flex-1 py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-white border border-transparent hover:border-gray-200 rounded transition-all">Cancelar</button>
          <button onClick={store.applyImei} className="flex-1 py-3 bg-[#62cb31] text-white rounded font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-[#58b72c] transition-all">Guardar</button>
        </div>
      </div>
    </div>
  )
}

/** Modal: Plan Separe (Rediseño 1:1) */
export function PlanSepareModal({ store }: { store: VenderStore }) {
  if (!store.showPlanSepare) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => store.setShowPlanSepare(false)}>
      <div className="bg-white rounded shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between">
           <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
             <HandCoins size={16} /> Plan Separe
           </h3>
           <button onClick={() => store.setShowPlanSepare(false)} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        
        <div className="p-8 grid grid-cols-2 gap-6">
            <div className="col-span-2 bg-gray-50 p-4 rounded border border-gray-100 flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total a pagar:</span>
              <span className="text-2xl font-black text-gray-800">{formatCOP(store.total)}</span>
            </div>
            
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Valor abonado</label>
              <input type="number" className="w-full border border-gray-200 rounded px-4 py-3 text-sm font-bold focus:border-[#62cb31] outline-none transition-all" placeholder="0" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Fecha vencimiento</label>
              <input type="date" className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:border-[#62cb31] outline-none transition-all" />
            </div>
            
            <div className="col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Observaciones</label>
              <textarea 
                value={store.planSepareNota}
                onChange={e => store.setPlanSepareNota(e.target.value)}
                className="w-full border border-gray-200 rounded px-4 py-3 text-sm h-24 resize-none focus:border-[#62cb31] outline-none transition-all" 
                placeholder="Indique los términos del plan separe..."
              />
            </div>
        </div>

        <div className="p-4 bg-gray-50 flex gap-3">
          <button onClick={() => store.setShowPlanSepare(false)} className="flex-1 py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-white border border-transparent hover:border-gray-200 rounded transition-all">Cancelar</button>
          <button onClick={store.savePlanSepare} className="flex-1 py-3 bg-[#62cb31] text-white rounded font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-[#58b72c] transition-all">Guardar Plan</button>
        </div>
      </div>
    </div>
  )
}

/** Modal: Notas Venta (Opcional) */
export function SaleNotesModal({ store }: { store: VenderStore }) {
  if (!store.showSaleNotesForm) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => store.setShowSaleNotesForm(false)}>
      <div className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between">
           <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
             <FileText size={16} /> Nota de Venta
           </h3>
           <button onClick={() => store.setShowSaleNotesForm(false)} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="p-8 space-y-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nota para el cliente (aparece en factura)</label>
            <textarea 
              autoFocus
              value={store.saleNotes} 
              onChange={(e) => store.setSaleNotes(e.target.value)} 
              className="w-full border border-gray-200 rounded px-4 py-3 text-sm h-24 resize-none focus:border-[#62cb31] outline-none transition-all"
              placeholder="Ej: Garantía de 30 días..."
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nota Comanda (uso interno)</label>
            <textarea 
              className="w-full border border-gray-200 rounded px-4 py-3 text-sm h-24 resize-none focus:border-[#62cb31] outline-none transition-all"
              placeholder="Ej: Empacar para regalo..."
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex gap-3">
          <button onClick={() => store.setShowSaleNotesForm(false)} className="w-full py-3 bg-[#62cb31] text-white rounded font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-[#58b72c] transition-all">Aceptar</button>
        </div>
      </div>
    </div>
  )
}

/** Modal: Domicilio (Rediseño 1:1) */
export function DomicilioModal({ store }: { store: VenderStore }) {
  if (!store.showDomicilioForm) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => store.setShowDomicilioForm(false)}>
      <div className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between">
           <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
             <Bike size={16} /> Gestión de Domicilio
           </h3>
           <button onClick={() => store.setShowDomicilioForm(false)} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        
        <div className="p-8">
           <div className="flex justify-around mb-8">
              <button className="flex flex-col items-center group">
                 <div className="w-14 h-14 rounded-full bg-[#f8f9fa] border-2 border-transparent group-hover:border-red-500 flex items-center justify-center mb-1 transition-all">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Rappi_logo.png" className="w-8 h-8 object-contain opacity-40 group-hover:opacity-100" />
                 </div>
                 <span className="text-[9px] font-black text-gray-400 group-hover:text-red-500 uppercase">Rappi</span>
              </button>
              <button className="flex flex-col items-center group">
                 <div className="w-14 h-14 rounded-full bg-[#f8f9fa] border-2 border-transparent group-hover:border-green-600 flex items-center justify-center mb-1 transition-all">
                    <Bike size={24} className="text-gray-300 group-hover:text-green-600" />
                 </div>
                 <span className="text-[9px] font-black text-gray-400 group-hover:text-green-600 uppercase">Propio</span>
              </button>
              <button className="flex flex-col items-center group">
                 <div className="w-14 h-14 rounded-full bg-[#f8f9fa] border-2 border-transparent group-hover:border-blue-500 flex items-center justify-center mb-1 transition-all">
                    <UserPlus size={24} className="text-gray-300 group-hover:text-blue-500" />
                 </div>
                 <span className="text-[9px] font-black text-gray-400 group-hover:text-blue-500 uppercase">Otro</span>
              </button>
           </div>

           <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Dirección de Entrega</label>
                <input type="text" className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:border-[#62cb31] outline-none transition-all" placeholder="Ej: Calle 10 # 5-20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Teléfono</label>
                  <input type="text" className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:border-[#62cb31] outline-none transition-all" placeholder="300..." />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Valor Domicilio</label>
                  <input type="number" className="w-full border border-gray-200 rounded px-4 py-3 text-sm font-bold focus:border-[#62cb31] outline-none transition-all" placeholder="0" />
                </div>
              </div>
           </div>
        </div>

        <div className="p-4 bg-gray-50 flex gap-3">
          <button onClick={() => store.setShowDomicilioForm(false)} className="flex-1 py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-white border border-transparent hover:border-gray-200 rounded transition-all">Cancelar</button>
          <button onClick={store.saveDomicilio} className="flex-1 py-3 bg-[#62cb31] text-white rounded font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-[#58b72c] transition-all">Guardar</button>
        </div>
      </div>
    </div>
  )
}

/** Modal: Ventas en Espera */
export function HoldSalesModal({ store }: { store: VenderStore }) {
  if (!store.showHoldSales) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => store.setShowHoldSales(false)}>
      <div className="bg-white rounded shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between">
           <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
             <Clock size={16} /> Ventas en Espera ({store.holdSales.length})
           </h3>
           <button onClick={() => store.setShowHoldSales(false)} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {store.holdSales.length === 0 ? (
            <div className="text-center text-gray-400 py-12 flex flex-col items-center gap-4">
              <Clock size={48} strokeWidth={1} />
              <p className="text-sm font-bold">No hay ventas en espera</p>
            </div>
          ) : (
            store.holdSales.map((h) => (
              <div key={h.id} className="border border-gray-100 rounded-lg p-4 hover:border-green-300 hover:bg-green-50/20 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-gray-800 uppercase tracking-tight">{h.client.nombre_comercial}</span>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{h.createdAt}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-500 mb-4">
                  <span>{h.cart.reduce((a,b) => a + b.unidades, 0)} productos</span>
                  <span className="font-bold text-[#62cb31]">{formatCOP(h.total)}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => store.deleteHoldSale(h.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                    <Trash2 size={16} />
                  </button>
                  <button onClick={() => store.resumeHoldSale(h.id)} className="flex-1 py-2 bg-gray-800 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded shadow-md transition-all">
                    Reanudar Venta
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 bg-gray-50">
          <button onClick={() => store.setShowHoldSales(false)} className="w-full py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-white border border-transparent hover:border-gray-200 rounded transition-all">Cerrar</button>
        </div>
      </div>
    </div>
  )
}

/** Modal: Arqueo / Cerrar Caja */
export function CloseSessionModal({ store }: { store: VenderStore }) {
  if (!store.showCloseSession) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between">
           <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
             <Lock size={16} /> Arqueo de Caja
           </h3>
           {store.showCloseStep === 1 && (
             <button onClick={() => store.setShowCloseSession(false)} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
           )}
        </div>
        
        {store.showCloseStep === 1 && (
          <div className="p-10 text-center">
            <Calculator size={48} strokeWidth={1} className="text-gray-200 mx-auto mb-6" />
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-2">Declaración de Efectivo</h3>
            <p className="text-xs text-gray-400 mb-8 leading-relaxed">Cuenta minuciosamente los billetes y monedas de tu gaveta física e ingresa el valor total.</p>
            
            <div className="relative mb-8">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-200">$</span>
              <input 
                type="text" 
                autoFocus
                value={store.declaredCash}
                onChange={(e) => {
                  const num = e.target.value.replace(/\D/g, "")
                  store.setDeclaredCash(num ? Number(num).toLocaleString("es-CO") : "")
                }}
                className="w-full text-center text-4xl font-black text-gray-800 border-b-2 border-gray-100 py-4 focus:outline-none focus:border-[#62cb31] transition-colors"
                placeholder="0" 
              />
            </div>
            
            <button 
              onClick={store.closeSession}
              className="w-full py-4 bg-[#62cb31] text-white font-black text-xs uppercase tracking-widest rounded shadow-xl shadow-green-500/20 hover:bg-[#58b72c] transition-all"
            >
              Auditar e Imprimir Reporte Z
            </button>
          </div>
        )}
        
        {store.showCloseStep === 2 && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {store.auditResult === 0 ? (
              <div className="bg-green-50 p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                   <CheckCircle className="text-green-500" size={32} />
                </div>
                <h3 className="text-lg font-black text-green-800 uppercase tracking-tighter">¡Cuadre Perfecto!</h3>
                <p className="text-xs text-green-700 font-medium mt-1 uppercase tracking-wider">El efectivo físico es idéntico al sistema.</p>
              </div>
            ) : (
              <div className="bg-red-50 p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                   <AlertTriangle className="text-red-500" size={32} />
                </div>
                <h3 className="text-lg font-black text-red-800 uppercase tracking-tighter">Descuadre Detectado</h3>
                <p className="text-sm text-red-700 font-black mt-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  Diferencia: {formatCOP(store.auditResult)}
                </p>
              </div>
            )}
            <div className="p-8">
              <button onClick={() => { store.setShowCloseSession(false); }} className="w-full py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded shadow-xl hover:bg-black transition-all">
                Finalizar Turno
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Modal: Selector de Variantes (Talla/Color) */
export function VariantSelectorModal({ store }: { store: VenderStore }) {
  if (!store.showVariantSelector || !store.productForVariants) return null
  const p = store.productForVariants

  return (
    <div className="fixed inset-0 bg-black/40 z-[110] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => store.setShowVariantSelector(false)}>
      <div className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between">
           <h3 className="text-white text-xs font-black uppercase tracking-widest">Seleccionar Variante</h3>
           <button onClick={() => store.setShowVariantSelector(false)} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        
        <div className="p-6">
           <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Producto: <span className="text-gray-800">{p.nombre}</span></p>
           
           <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {p.variantes?.map((v: any) => (
                <button 
                  key={v.id}
                  onClick={() => store.addToCart(p, v)}
                  className="w-full flex items-center justify-between p-4 border border-gray-100 rounded hover:border-[#62cb31] hover:bg-green-50/20 transition-all text-left group"
                >
                   <div>
                      <p className="text-sm font-black text-gray-700 uppercase tracking-tighter group-hover:text-[#62cb31]">{v.nombre || v.sku}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ref: {v.sku}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-gray-800">{formatCOP(v.precio_venta)}</p>
                      <p className={`text-[10px] font-black uppercase ${v.stock?.[0]?.cantidad > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {v.stock?.[0]?.cantidad > 0 ? `Stock: ${v.stock[0].cantidad}` : 'Agotado'}
                      </p>
                   </div>
                </button>
              ))}
           </div>
        </div>

        <div className="p-4 bg-gray-50 flex gap-3">
          <button onClick={() => store.setShowVariantSelector(false)} className="w-full py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-white border border-transparent hover:border-gray-200 rounded transition-all">Cancelar</button>
        </div>
      </div>
    </div>
  )
}

/** Modal: Nuevo Cliente */
export function NewClientModal({ store }: { store: VenderStore }) {
  if (!store.showClientForm) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[120] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => store.setShowClientForm(false)}>
      <div className="bg-white rounded shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between">
           <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
             <UserPlus size={16} /> Registrar Nuevo Cliente
           </h3>
           <button onClick={() => store.setShowClientForm(false)} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        
        <div className="p-8 grid grid-cols-2 gap-5">
           <div className="col-span-2 sm:col-span-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Identificación / NIT</label>
              <input 
                type="text" 
                value={store.newClientDoc}
                onChange={e => store.setNewClientDoc(e.target.value)}
                className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:border-[#62cb31] outline-none transition-all" 
                placeholder="Ej: 1010..."
              />
           </div>
           <div className="col-span-2 sm:col-span-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nombre Completo</label>
              <input 
                type="text" 
                value={store.newClientName}
                onChange={e => store.setNewClientName(e.target.value)}
                className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:border-[#62cb31] outline-none transition-all" 
                placeholder="Nombre del cliente o empresa"
              />
           </div>
           <div className="col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Email</label>
              <input 
                type="email" 
                value={store.newClientEmail}
                onChange={e => store.setNewClientEmail(e.target.value)}
                className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:border-[#62cb31] outline-none transition-all" 
                placeholder="correo@ejemplo.com"
              />
           </div>
           <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Teléfono</label>
              <input 
                type="text" 
                value={store.newClientTelefono}
                onChange={e => store.setNewClientTelefono(e.target.value)}
                className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:border-[#62cb31] outline-none transition-all" 
                placeholder="300..."
              />
           </div>
           <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Ciudad</label>
              <input 
                type="text" 
                value={store.newClientCiudad}
                onChange={e => store.setNewClientCiudad(e.target.value)}
                className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:border-[#62cb31] outline-none transition-all" 
                placeholder="Bogotá"
              />
           </div>
           <div className="col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Dirección</label>
              <input 
                type="text" 
                value={store.newClientDireccion}
                onChange={e => store.setNewClientDireccion(e.target.value)}
                className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:border-[#62cb31] outline-none transition-all" 
                placeholder="Calle 00 # 00-00"
              />
           </div>
        </div>

        <div className="p-4 bg-gray-50 flex gap-3">
          <button onClick={() => store.setShowClientForm(false)} className="flex-1 py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-white border border-transparent hover:border-gray-200 rounded transition-all">Cancelar</button>
          <button onClick={store.saveNewClient} className="flex-1 py-3 bg-[#62cb31] text-white rounded font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-[#58b72c] transition-all">Crear Cliente</button>
        </div>
      </div>
    </div>
  )
}
