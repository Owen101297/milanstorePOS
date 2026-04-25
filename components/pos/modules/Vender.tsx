"use client"

/**
 * Vender Module — Orchestrator
 * 
 * Refactored from 1434 lines → thin shell.
 * All state in useVenderStore (connected to Supabase).
 * Barcode scanner integrated globally.
 */

import { useVenderStore } from "./vender/useVenderStore"
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner"
import { AperturaCaja } from "./vender/AperturaCaja"
import { ProductGrid } from "./vender/ProductGrid"
import { CartPanel } from "./vender/CartPanel"
import { PaymentModal } from "./vender/PaymentModal"
import {
  DiscountModal, ManualPriceModal, ItemNotesModal,
  ImeiModal, NewClientModal, HoldSalesModal, CloseSessionModal,
  PlanSepareModal, SaleNotesModal, DomicilioModal, VariantSelectorModal
} from "./vender/Modals"

export default function Vender() {
  const store = useVenderStore()

  // Barcode scanner — busca producto por código y lo agrega al carrito
  useBarcodeScanner((code) => {
    const found = store.products.find(
      p => p.codigo_producto === code || String(p.id_producto) === code
    )
    if (found) {
      store.addToCart(found)
      console.log(`🔊 Barcode: ${code} → ${found.nombre}`)
    } else {
      // Fallback: poner código en búsqueda
      store.setSearchTerm(code)
      console.warn(`🔊 Barcode: ${code} — no encontrado, buscando...`)
    }
  })

  // Apertura de Caja
  if (!store.isCajaAbierta) {
    return <AperturaCaja store={store} />
  }

  // Loading state
  if (store.isLoading) {
    return (
      <div className="flex h-[calc(100vh-130px)] bg-[#f8fafc] items-center justify-center rounded-tl-3xl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#62cb31] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Cargando productos desde Supabase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-130px)] bg-[#f8fafc] font-['Montserrat'] rounded-tl-3xl overflow-hidden border-l border-t border-slate-200 shadow-inner">
      <ProductGrid store={store} />
      <CartPanel store={store} />

      {/* Modales */}
      <PaymentModal store={store} />
      <DiscountModal store={store} />
      <ManualPriceModal store={store} />
      <ItemNotesModal store={store} />
      <ImeiModal store={store} />
      <NewClientModal store={store} />
      <HoldSalesModal store={store} />
      <CloseSessionModal store={store} />
      <PlanSepareModal store={store} />
      <SaleNotesModal store={store} />
      <DomicilioModal store={store} />
      <VariantSelectorModal store={store} />
    </div>
  )
}