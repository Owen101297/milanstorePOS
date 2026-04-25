/**
 * Tests: useVenderStore hook
 * Tarea #26 — Verifica la lógica de negocio del módulo Vender
 */

import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useVenderStore } from '@/components/pos/modules/vender/useVenderStore'
import { mockProducts } from '@/components/pos/modules/vender/types'

describe('useVenderStore', () => {
  describe('addToCart', () => {
    it('agrega un producto al carrito', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.addToCart(mockProducts[0])
      })

      expect(result.current.cart).toHaveLength(1)
      expect(result.current.cart[0].nombre_producto).toBe('Camiseta Básica Algodón')
      expect(result.current.cart[0].unidades).toBe(1)
    })

    it('incrementa cantidad si el producto ya existe', () => {
      const { result } = renderHook(() => useVenderStore())

      // addToCart con el mismo producto en la MISMA act batch usa el mismo id_producto
      // pero el rowId tiene Date.now(). Dos act separados pueden tener el mismo timestamp.
      act(() => {
        result.current.addToCart(mockProducts[0])
      })
      act(() => {
        result.current.addToCart(mockProducts[0])
      })

      // El dedup compara id_producto + precio_venta, so it should merge
      expect(result.current.cart).toHaveLength(1)
      expect(result.current.cart[0].unidades).toBe(2)
    })

    it('permite múltiples productos distintos', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.addToCart(mockProducts[0])
        result.current.addToCart(mockProducts[1])
        result.current.addToCart(mockProducts[2])
      })

      expect(result.current.cart).toHaveLength(3)
    })
  })

  describe('updateQty', () => {
    it('incrementa la cantidad del ítem', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.addToCart(mockProducts[0])
      })

      const cartItemId = result.current.cart[0].cartItemId

      act(() => {
        result.current.updateQty(cartItemId, 3)
      })

      expect(result.current.cart[0].unidades).toBe(4) // 1 initial + 3
    })

    it('elimina el ítem si la cantidad llega a 0', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.addToCart(mockProducts[0])
      })

      const cartItemId = result.current.cart[0].cartItemId

      act(() => {
        result.current.updateQty(cartItemId, -1)
      })

      expect(result.current.cart).toHaveLength(0)
    })
  })

  describe('removeItem', () => {
    it('elimina un ítem específico del carrito', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.addToCart(mockProducts[0])
        result.current.addToCart(mockProducts[1])
      })

      const firstItemId = result.current.cart[0].cartItemId

      act(() => {
        result.current.removeItem(firstItemId)
      })

      expect(result.current.cart).toHaveLength(1)
      expect(result.current.cart[0].nombre_producto).toBe('Jean Clásico Slim')
    })
  })

  describe('computed values', () => {
    it('calcula subtotal correctamente', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.addToCart(mockProducts[0]) // $35,000
        result.current.addToCart(mockProducts[1]) // $95,000
      })

      expect(result.current.subtotal).toBe(130000)
    })

    it('calcula impuesto (IVA 19%)', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.addToCart(mockProducts[0]) // $35,000 con 19% IVA
      })

      expect(result.current.impuesto).toBe(35000 * 0.19)
    })

    it('total = subtotal + impuesto', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.addToCart(mockProducts[0]) // $35,000 + 19% IVA
      })

      const expected = 35000 + (35000 * 0.19) // $41,650
      expect(result.current.total).toBe(expected)
    })
  })

  describe('holdSale / resumeHoldSale', () => {
    it('pausar una venta la mueve a holdSales y limpia carrito', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.addToCart(mockProducts[0])
        result.current.addToCart(mockProducts[1])
      })

      expect(result.current.cart).toHaveLength(2)

      act(() => {
        result.current.holdSale()
      })

      expect(result.current.cart).toHaveLength(0)
      expect(result.current.holdSales).toHaveLength(1)
      expect(result.current.holdSales[0].cart).toHaveLength(2)
    })

    it('reanudar restaura el carrito', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.addToCart(mockProducts[0])
      })
      act(() => {
        result.current.holdSale()
      })

      expect(result.current.holdSales).toHaveLength(1)
      const holdId = result.current.holdSales[0].id

      act(() => {
        result.current.resumeHoldSale(holdId)
      })

      expect(result.current.cart).toHaveLength(1)
      expect(result.current.holdSales).toHaveLength(0)
    })

    it('no pausa si el carrito está vacío', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.holdSale()
      })

      expect(result.current.holdSales).toHaveLength(0)
    })
  })

  describe('payment forms', () => {
    it('agrega una forma de pago', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.addToCart(mockProducts[0])
      })

      act(() => {
        result.current.setCurrentPaymentMethod('efectivo')
        result.current.setCurrentPaymentAmount('50000')
      })

      act(() => {
        result.current.addPaymentForm()
      })

      expect(result.current.paymentForms).toHaveLength(1)
      expect(result.current.paymentForms[0].valor_entregado).toBe(50000)
      expect(result.current.paymentForms[0].forma_pago).toBe('efectivo')
    })

    it('no agrega si el monto es 0', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.setCurrentPaymentAmount('0')
        result.current.addPaymentForm()
      })

      expect(result.current.paymentForms).toHaveLength(0)
    })

    it('calcula remaining y change correctamente', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.addToCart(mockProducts[0]) // $35k + IVA
      })

      const total = result.current.total // Should be 35000 + 6650 = 41650

      act(() => {
        result.current.setCurrentPaymentAmount((total + 5000).toString())
      })
      act(() => {
        result.current.addPaymentForm()
      })

      expect(result.current.remaining).toBe(0)
      expect(result.current.change).toBe(5000)
    })
  })

  describe('filteredProducts', () => {
    it('filtra por término de búsqueda', () => {
      const { result } = renderHook(() => useVenderStore())

      act(() => {
        result.current.setSearchTerm('camiseta')
      })

      expect(result.current.filteredProducts.length).toBeGreaterThan(0)
      for (const p of result.current.filteredProducts) {
        expect(p.nombre.toLowerCase()).toContain('camiseta')
      }
    })

    it('muestra todos con categoría 0 (Todos)', () => {
      const { result } = renderHook(() => useVenderStore())
      expect(result.current.selectedCategory).toBe(0)
      expect(result.current.filteredProducts.length).toBe(mockProducts.length)
    })
  })
})
