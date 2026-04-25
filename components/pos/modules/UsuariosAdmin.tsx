"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePosStore } from '@/store/posStore'
import { hasModuleAccess } from '@/lib/rbac'
import { User, UserPlus, Trash2, Edit, ShieldCheck, Mail, Phone, Building2 } from 'lucide-react'
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

interface UsuariosAdminProps {
  subMenu: string
}

export default function UsuariosAdmin({ subMenu }: UsuariosAdminProps) {
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
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) {
      setProfiles(data)
    }
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
      .update({
        nombre_completo: form.nombre,
        rol: form.rol,
        sede_id: form.sede_id,
        telefono: form.telefono
      })
      .eq('id', editingId)
    if (!error) {
      fetchProfiles()
      setEditingId(null)
      setForm({ email: '', password: '', nombre: '', rol: 'cajero', sede_id: '', telefono: '' })
    }
  }

  if (loading) return (
    <div className="bg-slate-50 w-full h-[calc(100vh-120px)] rounded-tl-2xl flex items-center justify-center border-l border-slate-200 font-bold text-slate-400">
      Cargando usuarios del sistema...
    </div>
  )

  return (
    <div className="bg-slate-50 w-full h-[calc(100vh-120px)] overflow-y-auto p-2 sm:p-6 rounded-tl-2xl shadow-inner border-l border-slate-200">
       <div className="w-full h-full max-w-7xl mx-auto space-y-6">
          
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Administración de Usuarios</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Gestiona accesos, roles y permisos del personal en todas las sedes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sticky top-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <UserPlus className="w-5 h-5"/>
                  </div>
                  <h3 className="text-lg font-black text-slate-800">{editingId ? 'Editar Usuario' : 'Nuevo Colaborador'}</h3>
                </div>
                
                <form onSubmit={editingId ? updateProfile : createUser} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nombre Completo</label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => setForm({...form, nombre: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      placeholder="Ej. Juan Pérez"
                      required
                    />
                  </div>
                  {!editingId && (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Email Institucional</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        placeholder="juan@empresa.com"
                        required
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Rol / Permisos</label>
                      <select
                        value={form.rol}
                        onChange={(e) => setForm({...form, rol: e.target.value as any})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="cajero">Cajero</option>
                        <option value="gerente">Gerente</option>
                        <option value="bodeguero">Bodeguero</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Sede Asignada</label>
                      <input
                        type="text"
                        value={form.sede_id}
                        onChange={(e) => setForm({...form, sede_id: e.target.value})}
                        placeholder="ID Sede"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  {!editingId && (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Contraseña Inicial</label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({...form, password: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  )}
                  
                  <div className="pt-4 flex gap-2">
                    <button type="submit" className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-black text-sm hover:bg-black transition-all shadow-lg">
                      {editingId ? 'Actualizar' : 'Registrar'}
                    </button>
                    {editingId && (
                      <button type="button" onClick={() => { setEditingId(null); setForm({email:'', password:'', nombre:'', rol:'cajero', sede_id:'', telefono:''}) }} className="bg-slate-100 text-slate-500 px-4 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* List Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                      <th className="p-4">Colaborador</th>
                      <th className="p-4">Rol & Sede</th>
                      <th className="p-4 text-center">Estado</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {profiles.map((profile) => (
                      <tr key={profile.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 uppercase">
                              {profile.nombre_completo.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-800">{profile.nombre_completo}</p>
                              <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Mail className="w-2.5 h-2.5"/> {profile.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase inline-block mb-1 ${
                            profile.rol === 'admin' ? 'bg-purple-100 text-purple-700' :
                            profile.rol === 'gerente' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {profile.rol}
                          </span>
                          <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><Building2 className="w-2.5 h-2.5"/> {profile.sede_id || 'Global'}</p>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                            profile.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {profile.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1">
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
                              className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleActive(profile.id, !profile.activo)}
                              className={`p-2 rounded-lg transition-colors ${
                                profile.activo 
                                  ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' 
                                  : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'
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
       </div>
    </div>
  )
}


