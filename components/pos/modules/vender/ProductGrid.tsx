"use client"

import React, { useState } from "react"
import { Search, ChevronLeft, ChevronRight, Package, Grid } from "lucide-react"
import type { VenderStore } from "./useVenderStore"

export function ProductGrid({ store }: { store: VenderStore }) {
  const [catOffset, setCatOffset] = useState(0)

  return (
    <div className="flex-1 flex flex-col bg-[#fcfcfc] overflow-hidden">
      {/* Search Bar (Vendty Style) */}
      <div className="p-4 bg-white flex gap-4 items-center">
        <div className="flex-1 relative group">
           <input 
             type="text"
             placeholder="Buscar Producto (Nombre / SKU / Código)..."
             value={store.searchTerm}
             onChange={(e) => store.setSearchTerm(e.target.value)}
             className="w-full bg-white border border-gray-200 rounded-full pl-12 pr-4 py-2.5 text-sm outline-none focus:border-[#62cb31] transition-all"
           />
           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#62cb31] transition-colors">
             <Search size={20} />
           </div>
        </div>
      </div>

      {/* Categories (Circular Icons - 1:1 Vendty) */}
      <div className="bg-white border-b border-gray-100 px-4 py-6 relative">
         <div className="flex items-center gap-8 overflow-hidden">
            {/* Scroll Buttons */}
            <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400"><ChevronLeft size={24} /></button>
            
            <div className="flex-1 flex gap-8 justify-center">
               {["Todos", "General", "Camiseta", "Polo"].map((cat) => (
                 <button 
                   key={cat}
                   onClick={() => store.setSelectedCategory(cat)}
                   className="flex flex-col items-center gap-2 group"
                 >
                   <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                     store.selectedCategory === cat ? 'border-[#62cb31] bg-green-50/20' : 'border-gray-100 bg-[#f8f8f8] group-hover:border-gray-300'
                   }`}>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                         <span className="text-[10px] text-gray-400 font-bold uppercase">No Image</span>
                      </div>
                   </div>
                   <span className={`text-[12px] font-medium ${store.selectedCategory === cat ? 'text-[#62cb31]' : 'text-gray-600'}`}>{cat}</span>
                 </button>
               ))}
            </div>

            <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400"><ChevronRight size={24} /></button>
         </div>
      </div>

      {/* Grid Area */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {store.filteredProducts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4">
             <Package size={64} strokeWidth={1} />
             <p className="text-sm font-bold uppercase tracking-widest">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {store.filteredProducts.map((p) => (
              <div 
                key={p.id_producto}
                onClick={() => store.addToCart(p)}
                className="bg-white border border-gray-200 rounded p-2 hover:shadow-xl hover:border-[#62cb31] transition-all cursor-pointer flex flex-col group h-full"
              >
                <div className="aspect-square bg-gray-50 rounded-sm mb-3 flex items-center justify-center overflow-hidden relative">
                   {p.imagen ? (
                     <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   ) : (
                     <div className="text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                           <Package size={32} className="text-gray-300" />
                        </div>
                        <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">No Image</span>
                     </div>
                   )}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <h3 className="text-[12px] font-bold text-gray-700 leading-tight mb-2 uppercase line-clamp-2">
                    {p.nombre}
                  </h3>
                  <div className="mt-auto">
                    <p className="text-[14px] font-black text-[#62cb31] tracking-tighter">
                      $ {p.precio_venta.toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
