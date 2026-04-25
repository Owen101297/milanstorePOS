"use client"

/**
 * useStoreHydration — Fix Next.js SSR hydration mismatch with Zustand persist.
 * 
 * Problem: Zustand persist rehydrates from localStorage AFTER initial render,
 * causing a mismatch between server HTML (empty store) and client HTML (stored state).
 * 
 * Solution: Block rendering until Zustand has finished rehydrating.
 */

import { useEffect, useState } from "react"

export function useStoreHydration(): boolean {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Zustand persist finishes sync rehydration before useEffect runs,
    // so by the time this effect fires, the store is already populated.
    setHydrated(true)
  }, [])

  return hydrated
}
