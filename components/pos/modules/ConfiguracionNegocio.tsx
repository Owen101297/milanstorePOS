"use client"

import React, { useState, useEffect } from "react"
import { Settings, Store, MapPin, Save, Building2, Globe, Phone, Mail, FileText } from "lucide-react"
import { useSede } from "@/components/pos/providers/SedeContext"
import { createClient } from "@/lib/supabase/client"

interface ModuleProps { subMenu: string }

interface SedeConfig {
  id: string; nombre: string; direccion: string; telefono: string; email: string;
  nit: string; ciudad: string; departamento: string; pais: string;
  moneda: string; impuesto_default: number; pie_factura: string;
}

export default function ConfiguracionNegocio({ subMenu }: ModuleProps) {
  const { sedeId } = useSede()
  const [config, setConfig] = useState<SedeConfig>({
    id: sedeId, nombre: "Milan Store", direccion: "", telefono: "", email: "",
    nit: "", ciudad: "Bogotá", departamento: "Cundinamarca", pais: "Colombia",
    moneda: "COP", impuesto_default: 19, pie_factura: "Gracias por su compra - Milan Store",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState(subMenu === "almacenes" ? "sedes" : "general")

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data } = await supabase.from("sedes").select("*").eq("id", sedeId).single()
        if (data) {
          setConfig(prev => ({ ...prev, ...data }))
        }
      } catch { /* Use defaults */ }
      finally { setLoading(false) }
    }
    load()
  }, [sedeId])

  const handleSave = async () => {
    setSaving(true); setSaved(false)
    try {
      const supabase = createClient()
      await supabase.from("sedes").upsert({
        id: sedeId, nombre: config.nombre, direccion: config.direccion,
        telefono: config.telefono, email: config.email,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert("Error al guardar: " + (err instanceof Error ? err.message : ""))
    } finally { setSaving(false) }
  }

  const update = (key: keyof SedeConfig, val: string | number) => setConfig(prev => ({ ...prev, [key]: val }))

  const sections = [
    { id: "general", label: "Datos del Negocio", icon: Store },
    { id: "fiscal", label: "Datos Fiscales", icon: FileText },
    { id: "sedes", label: "Sedes / Almacenes", icon: Building2 },
  ]

  if (loading) return <div className="flex items-center justify-center h-[calc(100vh-130px)]"><div className="w-10 h-10 border-4 border-[#62cb31] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="h-[calc(100vh-130px)] flex bg-[#f8fafc] rounded-tl-3xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-1">
        <div className="flex items-center gap-2 text-lg font-black text-gray-800 mb-6 px-2">
          <Settings className="w-5 h-5 text-[#62cb31]" />Configuración
        </div>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === s.id ? "bg-[#62cb31] text-white shadow-lg shadow-[#62cb31]/20" : "text-gray-600 hover:bg-gray-50"}`}>
            <s.icon className="w-4 h-4" />{s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeSection === "general" && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-black text-gray-800 mb-6">Datos del Negocio</h2>
            <div className="space-y-4">
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Nombre del Negocio</label>
                <input value={config.nombre} onChange={e => update("nombre", e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#62cb31]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Teléfono</label>
                  <input value={config.telefono} onChange={e => update("telefono", e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#62cb31]" /></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Email</label>
                  <input value={config.email} onChange={e => update("email", e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#62cb31]" /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Dirección</label>
                <input value={config.direccion} onChange={e => update("direccion", e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#62cb31]" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Ciudad</label>
                  <input value={config.ciudad} onChange={e => update("ciudad", e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#62cb31]" /></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Departamento</label>
                  <input value={config.departamento} onChange={e => update("departamento", e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#62cb31]" /></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">País</label>
                  <input value={config.pais} onChange={e => update("pais", e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#62cb31]" /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Pie de Factura</label>
                <textarea value={config.pie_factura} onChange={e => update("pie_factura", e.target.value)} rows={3} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#62cb31]" /></div>
            </div>
            <div className="flex items-center gap-3 mt-8">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-[#62cb31] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#62cb31]/20 disabled:opacity-50">
                <Save className="w-4 h-4" />{saving ? "Guardando..." : "Guardar Cambios"}
              </button>
              {saved && <span className="text-sm text-emerald-600 font-bold">✓ Guardado exitosamente</span>}
            </div>
          </div>
        )}

        {activeSection === "fiscal" && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-black text-gray-800 mb-6">Datos Fiscales</h2>
            <div className="space-y-4">
              <div><label className="text-xs font-bold text-gray-500 block mb-1">NIT / RUT</label>
                <input value={config.nit} onChange={e => update("nit", e.target.value)} placeholder="900.123.456-7" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#62cb31]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Moneda</label>
                  <select value={config.moneda} onChange={e => update("moneda", e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm">
                    <option value="COP">COP — Peso Colombiano</option><option value="USD">USD — Dólar</option>
                  </select></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">IVA por defecto (%)</label>
                  <input type="number" value={config.impuesto_default} onChange={e => update("impuesto_default", Number(e.target.value))} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#62cb31]" /></div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                <strong>Facturación Electrónica DIAN:</strong> La integración con Siigo/DIAN para facturación electrónica será habilitada en una próxima actualización.
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-[#62cb31] text-white rounded-xl font-bold text-sm mt-8 shadow-lg shadow-[#62cb31]/20 disabled:opacity-50">
              <Save className="w-4 h-4" />{saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        )}

        {activeSection === "sedes" && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-black text-gray-800 mb-6">Sedes / Almacenes</h2>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#62cb31]/10 rounded-xl flex items-center justify-center"><Building2 className="w-5 h-5 text-[#62cb31]" /></div>
                <div><h3 className="font-bold text-gray-800">{config.nombre}</h3><p className="text-xs text-gray-400">{config.direccion || "Sin dirección"} — {config.ciudad}</p></div>
                <div className="ml-auto px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Activa</div>
              </div>
              <div className="text-xs text-gray-500">ID: <span className="font-mono">{sedeId}</span></div>
            </div>
            <p className="text-xs text-gray-400 mt-4">Para agregar más sedes, contacta al administrador del sistema.</p>
          </div>
        )}
      </div>
    </div>
  )
}
