"use client"

import { useEffect, useCallback } from 'react'
import { usePosStore } from '@/store/posStore'
import { ventas } from '@/lib/services'
import type { MetodoPago } from '@/lib/database.types'

/**
 * useNetworkMonitor — Tarea #17: Offline Sync Engine
 * 
 * Detecta cambios de conectividad y sincroniza la cola de ventas
 * offline con Supabase cuando la red se restaura.
 * 
 * Flujo:
 * 1. Venta se encola en offlineQueue (status='pending')
 * 2. Cuando vuelve la red → flushQueue()
 * 3. Cada venta se envía a ventas.procesarVenta() 
 * 4. Si falla → queda pending para siguiente ciclo
 * 5. Si OK → markSynced(saleId) + clearQueue()
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
        // Mapear la SaleRecord del store al input de ventas.procesarVenta()
        const metodoPagoMap: Record<string, MetodoPago> = {
          efectivo: 'EFECTIVO',
          tarjeta: 'TARJETA',
          tarjeta_credito: 'TARJETA',
          tarjeta_debito: 'TARJETA',
          transferencia: 'TRANSFERENCIA',
          mixto: 'MIXTO',
        }

        const metodo = sale.payments.length > 1 
          ? 'MIXTO' as MetodoPago
          : metodoPagoMap[sale.payments[0]?.method?.toLowerCase() ?? 'efectivo'] ?? 'EFECTIVO'

        await ventas.procesarVenta({
          sedeId: sale.sedeId,
          cajaId: sale.sedeId, // Fallback: usar sede como caja si no hay ID de caja
          usuarioId: sale.sedeId, // Fallback: se completa con auth real cuando haya sesión
          clienteNombre: sale.client.name,
          clienteId: sale.client.id?.toString(),
          items: sale.cart.map(item => ({
            varianteId: item.id.toString(),
            cantidad: item.qty,
            precioUnitario: item.price,
            descuento: item.discount ?? 0,
            impuesto: 0, // Se calcula en el service
          })),
          metodoPago: metodo,
        })

        markSynced(sale.id)
        console.log(`[Milan POS] ✅ Venta ${sale.id} sincronizada`)
      } catch (error) {
        console.error(`[Milan POS] ❌ Error sincronizando venta ${sale.id}:`, error)
        // No marcamos como synced → se reintentará en el próximo ciclo
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

    // Retry periódico: intenta flush cada 30s si hay pendientes
    const retryInterval = setInterval(() => {
      if (navigator.onLine && offlineQueue.some(s => s.status === 'pending')) {
        flushQueue()
      }
    }, 30_000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(retryInterval)
    }
  }, [setOnline, flushQueue, offlineQueue])

  return { flushQueue }
}
