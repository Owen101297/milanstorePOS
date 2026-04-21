"use client"

import { useState, useEffect } from 'react'

/**
 * useHydration - Hook para prevenir el Hydration Mismatch de Next.js con Zustand
 * 
 * Problema: Next.js renderiza HTML en el servidor con estado "vacío" (cart=[]),
 * pero Zustand inyecta datos desde localStorage en el cliente (cart=[3 items]).
 * Esta discrepancia genera un React Hydration Error visible en consola.
 * 
 * Solución: Este hook retorna `false` durante el primer render (SSR) y `true`
 * después de la hidratación del cliente. Los componentes que dependen de Zustand
 * deben mostrar un skeleton/placeholder hasta que isHydrated sea true.
 */
export function useHydration(): boolean {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // useEffect solo se ejecuta en el cliente, nunca en el servidor
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * HydrationBoundary - Componente wrapper que protege contra hydration mismatch
 * 
 * Uso:
 * <HydrationBoundary fallback={<Skeleton />}>
 *   <ComponenteQueUsaZustand />
 * </HydrationBoundary>
 */
export function HydrationBoundary({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  const isHydrated = useHydration()

  if (!isHydrated) {
    return fallback ? <>{fallback}</> : (
      <div className="flex items-center justify-center h-screen w-full bg-[#f0f2f5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#4CAF50] rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500 animate-pulse">Sincronizando Milan POS...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
