"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type UserRole } from '@/lib/rbac'
import { usePosStore } from '@/store/posStore'

interface Profile {
  rol: UserRole
  nombre_completo: string
  sede_id: string
}

export function useAuth() {
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const setRole = usePosStore(s => s.setRole)
  const setUser = usePosStore(s => s.setUser)

  useEffect(() => {
    // Fetch session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user.email || 'User')
        // Fetch profile
        supabase
          .from('perfiles')
          .select('rol, nombre_completo, sede_id')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setRole(data.rol)
            }
          })
      }
      setLoading(false)
    })

    // Listen changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user.email || 'User')
        supabase.from('perfiles').select('rol').eq('id', session.user.id).single().then(({ data }) => {
          setRole((data as Profile)?.rol || 'cajero')
        })
      } else {
        setRole('cajero')
        setUser('')
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase, setRole, setUser])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, rol: UserRole, nombre: string, sede_id: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { rol, nombre, sede_id }
      }
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { loading, signIn, signUp, signOut }
}

