"use client"

import React from 'react'
import { ShieldAlert } from 'lucide-react'

/**
 * Roles del Sistema Milan POS
 * 
 * admin     - Dueño / Gerente: Acceso total (Kardex, Auditoría, Config, Reportes)
 * gerente   - Gerente de Sede: Inventario, Ventas, Reportes de su sede
 * cajero    - Empleado de Caja: Solo POS (Vender), Cierre de Caja
 * bodeguero - Personal de Bodega: Inventario, Movimientos, Producción
 */
export type UserRole = 'admin' | 'gerente' | 'cajero' | 'bodeguero'

/** Mapeo de permisos: qué módulos puede ver cada rol */
const MODULE_PERMISSIONS: Record<string, UserRole[]> = {
  dashboard:      ['admin', 'gerente', 'cajero', 'bodeguero'],
  vender:         ['admin', 'gerente', 'cajero'],
  ventas:         ['admin', 'gerente', 'cajero'],
  inventario:     ['admin', 'gerente', 'bodeguero'],
  fidelizacion:   ['admin', 'gerente'],
  compras:        ['admin', 'gerente'],
  contactos:      ['admin', 'gerente', 'cajero'],
  informes:       ['admin', 'gerente'],
  nomina:         ['admin'],
  tienda:         ['admin', 'gerente'],
  configuracion:  ['admin'],
}

/** Permisos granulares para submenús sensibles */
const SUBMENU_PERMISSIONS: Record<string, UserRole[]> = {
  'Auditoría Inventario': ['admin'],
  'Configuración Nómina': ['admin'],
  'Cierres de Caja':      ['admin', 'gerente'],
  'Créditos':             ['admin', 'gerente'],
  'Producción':           ['admin', 'gerente', 'bodeguero'],
  'Movimientos':          ['admin', 'gerente', 'bodeguero'],
}

/**
 * hasModuleAccess - Verifica si un rol tiene acceso a un módulo principal
 */
export function hasModuleAccess(moduleId: string, role: UserRole): boolean {
  const allowed = MODULE_PERMISSIONS[moduleId]
  if (!allowed) {
    console.warn(`RBAC: El módulo "${moduleId}" no tiene permisos definidos. Acceso concedido por defecto.`);
    return true 
  }
  return allowed.includes(role)
}

/**
 * hasSubmenuAccess - Verifica si un rol tiene acceso a un submenú específico
 */
export function hasSubmenuAccess(submenuLabel: string, role: UserRole): boolean {
  const restricted = SUBMENU_PERMISSIONS[submenuLabel]
  if (!restricted) return true // Submenús no listados son accesibles por defecto
  return restricted.includes(role)
}

/**
 * withRoleGuard - HOC (Higher-Order Component) que protege componentes
 * 
 * Si el usuario no tiene el rol necesario, NO se envía el código fuente
 * del componente protegido. Se renderiza un panel de acceso denegado.
 * 
 * Uso:
 * const PanelProtegido = withRoleGuard(MiComponente, ['admin', 'gerente'])
 */
export function withRoleGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: UserRole[]
) {
  return function GuardedComponent(props: P & { currentRole?: UserRole }) {
    const role = props.currentRole || 'cajero' 
    
    if (!allowedRoles.includes(role)) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white rounded-2xl border border-red-100 p-12">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-xl font-black text-gray-800 mb-2">Acceso Restringido</h3>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Tu perfil de <span className="font-bold text-red-500 uppercase">{role || 'INVITADO'}</span> no tiene 
            permisos para acceder a este módulo. Contacta al administrador del sistema.
          </p>
        </div>
      )
    }

    return <WrappedComponent {...props} />
  }
}

/**
 * RoleGate - Componente declarativo para protección inline
 * 
 * Uso:
 * <RoleGate allowed={['admin', 'gerente']} currentRole={user.role}>
 *   <BotonPeligroso />
 * </RoleGate>
 */
export function RoleGate({ 
  children, 
  allowed, 
  currentRole = 'cajero',
  fallback 
}: { 
  children: React.ReactNode
  allowed: UserRole[]
  currentRole?: UserRole
  fallback?: React.ReactNode 
}) {
  if (!allowed.includes(currentRole)) {
    return fallback ? <>{fallback}</> : null
  }
  return <>{children}</>
}
