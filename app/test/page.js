'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function TestSupabase() {
  const [status, setStatus] = useState('🔄 Conectando...')

  useEffect(() => {
    supabase
      .from('juguetes')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          setStatus(`❌ Error: ${error.message}`)
        } else {
          setStatus(`✅ ¡CONECTADO! ${data?.length || 0} registros`)
        }
      })
  }, [])

  return (
    <div style={{ padding: '50px', fontFamily: 'monospace', fontSize: '18px' }}>
      <h1>🧪 Test Supabase → VPS</h1>
      <h2 style={{ color: status.includes('✅') ? 'green' : 'red' }}>
        {status}
      </h2>
    </div>
  )
}
