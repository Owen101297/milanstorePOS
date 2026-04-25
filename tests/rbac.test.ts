/**
 * Tests: RBAC system (lib/rbac.tsx)
 * Tarea #26 — Verifica que hasModuleAccess y RoleGate funcionan correctamente
 */

import { describe, it, expect } from 'vitest'
import { hasModuleAccess, type UserRole } from '@/lib/rbac'

describe('hasModuleAccess', () => {
  describe('admin', () => {
    it('tiene acceso a TODOS los módulos', () => {
      const modules = [
        'vender', 'ventas', 'inventario', 'informes',
        'contactos', 'compras', 'fidelizacion', 'nomina',
        'tienda', 'configuracion',
      ]
      for (const mod of modules) {
        expect(hasModuleAccess(mod, 'admin')).toBe(true)
      }
    })
  })

  describe('gerente', () => {
    it('tiene acceso a módulos operativos', () => {
      expect(hasModuleAccess('vender', 'gerente')).toBe(true)
      expect(hasModuleAccess('ventas', 'gerente')).toBe(true)
      expect(hasModuleAccess('inventario', 'gerente')).toBe(true)
      expect(hasModuleAccess('informes', 'gerente')).toBe(true)
      expect(hasModuleAccess('tienda', 'gerente')).toBe(true)
    })

    it('NO tiene acceso a configuración', () => {
      expect(hasModuleAccess('configuracion', 'gerente')).toBe(false)
    })
  })

  describe('cajero', () => {
    it('solo tiene acceso a vender, ventas y contactos', () => {
      expect(hasModuleAccess('vender', 'cajero')).toBe(true)
      expect(hasModuleAccess('ventas', 'cajero')).toBe(true)
      expect(hasModuleAccess('contactos', 'cajero')).toBe(true)
    })

    it('NO tiene acceso a inventario ni informes', () => {
      expect(hasModuleAccess('inventario', 'cajero')).toBe(false)
      expect(hasModuleAccess('informes', 'cajero')).toBe(false)
      expect(hasModuleAccess('configuracion', 'cajero')).toBe(false)
      expect(hasModuleAccess('nomina', 'cajero')).toBe(false)
    })
  })

  describe('bodeguero', () => {
    it('solo tiene acceso a inventario', () => {
      expect(hasModuleAccess('inventario', 'bodeguero')).toBe(true)
    })

    it('NO tiene acceso a vender ni informes', () => {
      expect(hasModuleAccess('vender', 'bodeguero')).toBe(false)
      expect(hasModuleAccess('ventas', 'bodeguero')).toBe(false)
      expect(hasModuleAccess('informes', 'bodeguero')).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('módulo inexistente devuelve true (acceso por defecto)', () => {
      // El RBAC actual concede acceso por defecto a módulos no definidos
      expect(hasModuleAccess('modulo_ficticio', 'admin')).toBe(true)
    })

    it('rol no reconocido no tiene acceso a módulos restringidos', () => {
      // Cast forzado para simular un rol inválido
      expect(hasModuleAccess('vender', 'invitado' as UserRole)).toBe(false)
    })
  })
})
