import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/lib/rbac'

// ==========================================
// INTERFACES TIPADAS (Reemplazo de ORM)
// ==========================================

export interface CartItem {
  cartItemId: string
  id: number | string
  name: string
  price: number
  qty: number
  discount: number
  size?: string
  color?: string
  sku?: string
  codigoBarras?: string
}

export interface Client {
  id: number | string
  doc: string
  name: string
  email?: string
  phone?: string
}

export interface Seller {
  id: number | string
  name: string
}

/** Venta registrada para enviar a Supabase (o cola offline) */
export interface SaleRecord {
  id: string
  timestamp: string
  cart: CartItem[]
  subtotal: number
  tax: number
  total: number
  client: Client
  seller: Seller
  payments: { method: string; amount: number }[]
  change: number
  sedeId: string
  status: 'pending' | 'synced' | 'failed'
}

/** Producto maestro del catálogo */
export interface Product {
  id: number | string
  name: string
  description?: string
  price: number
  costPrice?: number
  category: string
  sku: string
  codigoBarras?: string
  sizes?: string[]
  colors?: string[]
  imageUrl?: string
  active: boolean
}

// ==========================================
// STORE PRINCIPAL DEL POS (Zustand)
// ==========================================

interface PosState {
  // === Auth & RBAC ===
  currentRole: UserRole
  currentUser: string
  setRole: (role: UserRole) => void
  setUser: (name: string) => void

  // === Estado de la Caja Activa ===
  isCajaAbierta: boolean
  valorBase: number
  cajaId?: string
  abrirCaja: (valor: number, idMod?: string) => void
  cerrarCaja: () => void

  // === Estado del Checkout Actual ===
  cart: CartItem[]
  selectedClient: Client
  selectedSeller: Seller

  addToCart: (item: CartItem) => void
  updateQty: (itemId: string, delta: number) => void
  removeItem: (itemId: string) => void
  setClient: (client: Client) => void
  setSeller: (seller: Seller) => void
  clearCart: () => void

  // === Motor Offline (Ventas Pendientes Network Outage) ===
  offlineQueue: SaleRecord[]
  queueSale: (saleData: SaleRecord) => void
  markSynced: (saleId: string) => void
  clearQueue: () => void

  // === Estado de Red ===
  isOnline: boolean
  setOnline: (status: boolean) => void
}

const defaultClient: Client = { id: 1, doc: "22222222", name: "Consumidor Final" }
const defaultSeller: Seller = { id: 1, name: "Sin Asesor (Venta Directa)" }

export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      // Auth
      currentRole: 'admin' as UserRole,
      currentUser: 'Administrador',
      setRole: (role) => set({ currentRole: role }),
      setUser: (name) => set({ currentUser: name }),

      // Caja
      isCajaAbierta: false,
      valorBase: 0,
      cart: [],
      selectedClient: defaultClient,
      selectedSeller: defaultSeller,
      offlineQueue: [],
      isOnline: true,

      abrirCaja: (valor, id) => set({ isCajaAbierta: true, valorBase: valor, cajaId: id }),
      cerrarCaja: () => set({ isCajaAbierta: false, valorBase: 0, cajaId: undefined }),

      addToCart: (item) => {
        const cart = get().cart
        const existing = cart.find(i => i.cartItemId === item.cartItemId)
        if (existing) {
          set({ cart: cart.map(i => i.cartItemId === item.cartItemId ? { ...i, qty: i.qty + 1 } : i) })
        } else {
          set({ cart: [...cart, { ...item, qty: 1 }] })
        }
      },

      updateQty: (itemId, delta) => {
        const cart = get().cart
        const updated = cart.map(i => i.cartItemId === itemId ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
        set({ cart: updated.filter(i => i.qty > 0) })
      },

      removeItem: (itemId) => set({ cart: get().cart.filter(i => i.cartItemId !== itemId) }),

      setClient: (client) => set({ selectedClient: client }),
      setSeller: (seller) => set({ selectedSeller: seller }),

      clearCart: () => set({ cart: [], selectedClient: defaultClient, selectedSeller: defaultSeller }),

      // MOTOR OFFLINE-FIRST: Encola ventas cuando no hay red
      queueSale: (sale) => set({ offlineQueue: [...get().offlineQueue, sale] }),
      markSynced: (saleId) => set({
        offlineQueue: get().offlineQueue.map(s =>
          s.id === saleId ? { ...s, status: 'synced' as const } : s
        )
      }),
      clearQueue: () => set({ offlineQueue: get().offlineQueue.filter(s => s.status !== 'synced') }),

      setOnline: (status) => set({ isOnline: status }),
    }),
    {
      name: 'milan-pos-storage',
      // Solo persistimos datos críticos, no funciones
      partialize: (state) => ({
        currentRole: state.currentRole,
        currentUser: state.currentUser,
        isCajaAbierta: state.isCajaAbierta,
        valorBase: state.valorBase,
        cajaId: state.cajaId,
        cart: state.cart,
        selectedClient: state.selectedClient,
        selectedSeller: state.selectedSeller,
        offlineQueue: state.offlineQueue,
      }),
    }
  )
)
