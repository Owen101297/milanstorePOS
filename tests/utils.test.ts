/**
 * Tests: Utility functions (types.ts)
 * Tarea #26 — Tests para formatCOP, parseNumber, limpiarCampo, getItemPrice
 */

import { describe, it, expect } from 'vitest'
import { formatCOP, parseNumber, limpiarCampo, getItemPrice, type CartItem } from '@/components/pos/modules/vender/types'

describe('formatCOP', () => {
  it('formatea enteros correctamente', () => {
    expect(formatCOP(35000)).toBe('$ 35.000')
  })

  it('formatea 0', () => {
    expect(formatCOP(0)).toBe('$ 0')
  })

  it('redondea decimales', () => {
    expect(formatCOP(35000.7)).toBe('$ 35.001')
  })

  it('formatea números grandes', () => {
    expect(formatCOP(1500000)).toBe('$ 1.500.000')
  })

  it('formatea negativos', () => {
    expect(formatCOP(-5000)).toBe('$ -5.000')
  })
})

describe('parseNumber', () => {
  it('extrae números de strings', () => {
    expect(parseNumber('35.000')).toBe(35000)
  })

  it('devuelve 0 para string vacío', () => {
    expect(parseNumber('')).toBe(0)
  })

  it('devuelve 0 para texto sin números', () => {
    expect(parseNumber('abc')).toBe(0)
  })

  it('extrae de strings mixtos', () => {
    expect(parseNumber('$95.000 COP')).toBe(95000)
  })
})

describe('limpiarCampo', () => {
  it('elimina tags HTML', () => {
    expect(limpiarCampo('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
  })

  it('deja texto limpio intacto', () => {
    expect(limpiarCampo('Hola mundo')).toBe('Hola mundo')
  })
})

describe('getItemPrice', () => {
  const baseItem: CartItem = {
    cartItemId: '1',
    id_producto: 1,
    nombre_producto: 'Test',
    precio_venta: 35000,
    precio_original: 35000,
    precio_descuento: 0,
    unidades: 1,
    impuesto: 19,
    codigo_producto: 'TST-001',
    rowId: '1',
  }

  it('devuelve precio_descuento si existe', () => {
    const item = { ...baseItem, precio_descuento: 28000 }
    expect(getItemPrice(item)).toBe(28000)
  })

  it('devuelve precio_venta si precio_descuento es 0', () => {
    const item = { ...baseItem, precio_descuento: 0 }
    expect(getItemPrice(item)).toBe(35000)
  })
})
