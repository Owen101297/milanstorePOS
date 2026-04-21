"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePosStore } from '@/store/posStore'
import { hasModuleAccess } from '@/lib/rbac'
import { User, UserPlus, Trash2, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  nombre_completo: string
  email: string
  rol: string
  sede_id: string
  telefono?: string
  activo: boolean
}

export default function UsuariosAdmin() {
  const supabase = createClient()
  const router = useRouter()
  const role = usePosStore(s => s.currentRole)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    email: '',
    password: '',
    nombre: '',
    rol: 'cajero' as const,
    sede_id: '',
    telefono: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (!hasModuleAccess('usuarios', role as any)) {
      router.push('/')
      return
    }
    fetchProfiles()
  }, [role, router])

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('perfiles')
      .select('*, auth.users!inner(email)')
      .order('created_at', { ascending: false })
    setProfiles(data || [])
    setLoading(false)
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Create auth user
      const { error } = await supabase.auth.admin.createUser({
        email: form.email,
        password: form.password,
        email_confirm: true
      })
      if (error) throw error

      // Profile auto-created by trigger
      await fetchProfiles()
      setForm({ email: '', password: '', nombre: '', rol: 'cajero', sede_id: '', telefono: '' })
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    const { error } = await supabase
      .from('perfiles')
      .update({ activo: active })
      .eq('id', id)
    if (!error) fetchProfiles()
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    const { error } = await supabase
      .from('perfiles')
      .update(form)
      .eq('id', editingId)
    if (!error) {
      fetchProfiles()
      setEditingId(null)
      setForm({ email: '', password: '', nombre: '', rol: 'cajero', sede_id: '', telefono: '' })
    }
  }

  if (loading) return <div className="p-8 text-center">Cargando usuarios...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="w-7 h-7 text-emerald-500" />
        <h1 className="text-2xl font-black text-gray-800">Gestión de Usuarios</h1>
      </div>

      {/* Create/Edit Form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-6">{editingId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
        <form onSubmit={editingId ? updateProfile : createUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 block">Nombre Completo</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({...form, nombre: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 block">Rol</label>
            <select
              value={form.rol}
              onChange={(e) => setForm({...form, rol: e.target.value as any})}
              className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="cajero">Cajero</option>
              <option value="gerente">Gerente</option>
              <option value="bodeguero">Bodeguero</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 block">Sede ID</label>
            <input
              type="text"
              value={form.sede_id}
              onChange={(e) => setForm({...form, sede_id: e.target.value})}
              placeholder="UUID sede"
              className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          {editingId ? (
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-black hover:bg-emerald-600">
                <Edit className="w-4 h-4 inline mr-2" />
                Actualizar
              </button>
              <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300">
                Cancelar
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 block">Contraseña</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <button type="submit" className="md:col-span-2 bg-emerald-500 text-white py-3 rounded-xl font-black hover:bg-emerald-600">
                <UserPlus className="w-4 h-4 inline mr-2" />
                Crear Usuario
              </button>
            </>
          )}
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5" />
            Usuarios Registrados ({profiles.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-4 font-bold text-sm text-slate-600">Nombre</th>
                <th className="text-left p-4 font-bold text-sm text-slate-600">Email</th>
                <th className="text-left p-4 font-bold text-sm text-slate-600">Rol</th>
                <th className="text-left p-4 font-bold text-sm text-slate-600">Sede</th>
                <th className="text-left p-4 font-bold text-sm text-slate-600">Estado</th>
                <th className="text-right p-4 font-bold text-sm text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-800">{profile.nombre_completo}</td>
                  <td className="p-4 text-sm text-slate-600">{profile.email}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      profile.rol === 'admin' ? 'bg-purple-100 text-purple-800' :
                      profile.rol === 'gerente' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {profile.rol}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{profile.sede_id || 'Sin sede'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      profile.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {profile.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(profile.id)
                          setForm({
                            email: profile.email || '',
                            password: '',
                            nombre: profile.nombre_completo || '',
                            rol: profile.rol as any,
                            sede_id: profile.sede_id || '',
                            telefono: profile.telefono || ''
                          })
                        }}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleActive(profile.id, !profile.activo)}
                        className={`p-2 rounded-lg transition-colors ${
                          profile.activo 
                            ? 'text-red-500 hover:bg-red-50' 
                            : 'text-green-500 hover:bg-green-50'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

