"use client"

import { useEffect, useRef, useCallback } from 'react'

/**
 * useBarcodeScanner - Hook global para lectores de código de barras USB/Bluetooth
 * 
 * Los lectores de código de barras se comportan como un teclado ultrarrápido:
 * emiten caracteres a velocidades inhumanas (<50ms entre teclas) y terminan con Enter.
 * 
 * Este hook detecta ese patrón en CUALQUIER parte de la app (no necesita focus en input)
 * y dispara un callback con el código escaneado limpio.
 * 
 * @param onScan - Callback que recibe el código de barras escaneado
 * @param options - Configuración del detector
 */
interface ScannerOptions {
  /** Tiempo máximo entre teclas para considerar que es un scanner (ms). Default: 50 */
  maxTimeBetweenKeys?: number
  /** Longitud mínima del código para ser válido. Default: 4 */
  minLength?: number
  /** Si true, previene que el código se escriba en inputs focuseados. Default: true */
  preventDefault?: boolean
}

export function useBarcodeScanner(
  onScan: (code: string) => void,
  options: ScannerOptions = {}
) {
  const {
    maxTimeBetweenKeys = 50,
    minLength = 4,
    preventDefault = true
  } = options

  // Buffer temporal de caracteres recibidos
  const bufferRef = useRef<string>('')
  // Timestamp de la última tecla recibida  
  const lastKeyTimeRef = useRef<number>(0)
  // Timer para limpiar el buffer si no se completa el escaneo
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const now = Date.now()
    const timeDiff = now - lastKeyTimeRef.current

    // Si pasó mucho tiempo entre teclas, es un humano escribiendo. Reset buffer.
    if (timeDiff > maxTimeBetweenKeys && bufferRef.current.length > 0) {
      bufferRef.current = ''
    }

    lastKeyTimeRef.current = now

    // Enter = fin de escaneo
    if (e.key === 'Enter') {
      if (bufferRef.current.length >= minLength) {
        // ¡Código válido detectado!
        const scannedCode = bufferRef.current.trim()
        
        if (preventDefault) {
          e.preventDefault()
          e.stopPropagation()
        }

        onScan(scannedCode)
      }
      bufferRef.current = ''
      return
    }

    // Solo agregar caracteres imprimibles (ignorar Shift, Ctrl, etc.)
    if (e.key.length === 1) {
      bufferRef.current += e.key

      // Limpiar buffer después de un timeout de seguridad (humano dejó de escribir)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        bufferRef.current = ''
      }, 300)
    }
  }, [onScan, maxTimeBetweenKeys, minLength, preventDefault])

  useEffect(() => {
    // Se registra a nivel de WINDOW para capturar sin importar dónde esté el focus
    window.addEventListener('keydown', handleKeyDown, true)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [handleKeyDown])
}
