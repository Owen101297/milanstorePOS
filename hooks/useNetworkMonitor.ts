"use client"

import { useEffect, useCallback } from 'react'
import { usePosStore } from '@/store/posStore'

/**
 * useNetworkMonitor - Detecta cambios de conectividad en tiempo real
 * 
 * Cuando la red se restaura, dispara automáticamente el flush de la cola
 * offline (todas las ventas pendientes se envían a Supabase en ráfaga).
 */
export function useNetworkMonitor() {
  const setOnline = usePosStore(s => s.setOnline)
  const offlineQueue = usePosStore(s => s.offlineQueue)
  const markSynced = usePosStore(s => s.markSynced)
  const clearQueue = usePosStore(s => s.clearQueue)

  const flushQueue = useCallback(async () => {
    const pending = offlineQueue.filter(s => s.status === 'pending')
    if (pending.length === 0) return

    console.log(`[Milan POS] 📡 Sincronizando ${pending.length} ventas offline...`)

    for (const sale of pending) {
      try {
        // ===================================================
        // AQUÍ SE CONECTARÁ SUPABASE EN PRODUCCIÓN
        // Ejemplo:
        // await supabase.from('ventas').insert(sale)
        // ===================================================
        
        // Simulamos un delay de red por cada venta
        await new Promise(resolve => setTimeout(resolve, 200))
        
        markSynced(sale.id)
        console.log(`[Milan POS] ✅ Venta ${sale.id} sincronizada`)
      } catch (error) {
        console.error(`[Milan POS] ❌ Error sincronizando venta ${sale.id}:`, error)
        // No marcamos como synced, se reintentará en el próximo ciclo
      }
    }

    // Limpiar las ya sincronizadas
    clearQueue()
    console.log('[Milan POS] 🎉 Cola offline procesada completamente')
  }, [offlineQueue, markSynced, clearQueue])

  useEffect(() => {
    // Estado inicial
    setOnline(navigator.onLine)

    const handleOnline = () => {
      console.log('[Milan POS] 📶 Conexión restaurada')
      setOnline(true)
      // Flush automático cuando vuelve la red
      flushQueue()
    }

    const handleOffline = () => {
      console.log('[Milan POS] 📵 Sin conexión - Modo Offline activado')
      setOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnline, flushQueue])

  return { flushQueue }
}
