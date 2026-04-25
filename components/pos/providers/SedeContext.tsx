"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface SedeContextType {
  sedeId: string;
  setSedeId: (id: string) => void;
  isSyncing: boolean;
  setIsSyncing: (syncing: boolean) => void;
}

const SedeContext = createContext<SedeContextType>({
  sedeId: '00000000-0000-0000-0000-000000000000',
  setSedeId: () => {},
  isSyncing: false,
  setIsSyncing: () => {}
})

// Provider that should wrap the application
export const SedeProvider = ({ children }: { children: React.ReactNode }) => {
  const [sedeId, setSedeState] = useState('00000000-0000-0000-0000-000000000000');
  const [isSyncing, setIsSyncing] = useState(true);

  // Carga inicial y simulación de sincronización backend (hydration-safe)
  useEffect(() => {
    const saved = localStorage.getItem('milan_context_sede');
    if (saved) {
       setSedeState(saved);
    }
    // Simulate initial Supabase fetch time
    setTimeout(() => setIsSyncing(false), 800);
  }, []);

  const setSedeId = (id: string) => {
    setIsSyncing(true);
    setSedeState(id);
    localStorage.setItem('milan_context_sede', id);
    
    // Simula re-fetch global de base de datos para la nueva zona geográfica
    setTimeout(() => {
       setIsSyncing(false);
    }, 1200);
  };

  return (
    <SedeContext.Provider value={{ sedeId, setSedeId, isSyncing, setIsSyncing }}>
      {children}
    </SedeContext.Provider>
  )
}

export const useSede = () => useContext(SedeContext);
