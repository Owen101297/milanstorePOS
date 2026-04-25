"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type UserRole } from '@/lib/rbac'
import { usePosStore } from '@/store/posStore'
import type { UserInfo } from '@/store/posStore'

export function useAuth() {
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const setUser = usePosStore(s => s.setUser)
  const storeLogout = usePosStore(s => s.logout)

  useEffect(() => {
    // Fetch session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Fetch profile for role and name
        supabase
          .from('perfiles')
          .select('rol, nombre_completo, sede_id')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            const userInfo: UserInfo = {
              nombre: data?.nombre_completo || session.user.email || 'User',
              email: session.user.email || '',
              rol: (data?.rol as UserRole) || 'cajero',
              sedeId: data?.sede_id || undefined,
            }
            setUser(userInfo)
          })
      }
      setLoading(false)
    })

    // Listen changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        supabase
          .from('perfiles')
          .select('rol, nombre_completo, sede_id')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            const userInfo: UserInfo = {
              nombre: data?.nombre_completo || session.user.email || 'User',
              email: session.user.email || '',
              rol: (data?.rol as UserRole) || 'cajero',
              sedeId: data?.sede_id || undefined,
            }
            setUser(userInfo)
          })
      } else {
        // Solo hacer logout si NO es un usuario demo
        const currentUser = usePosStore.getState().currentUser;
        if (!currentUser?.email?.startsWith('demo.')) {
          storeLogout()
        }
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    storeLogout()
  }

  return { loading, signIn, signUp, signOut }
}
