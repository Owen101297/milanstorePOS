"use client"

import React, { useState } from "react"
import { X } from "lucide-react"

interface FacturacionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FacturacionModal({ isOpen, onClose }: FacturacionModalProps) {
  const [formData, setFormData] = useState({
    tipo_identificacion: "",
    numero_identificacion: "",
    nombre_empresa: "",
    direccion_factura: "",
    correo_factura: "",
    contacto_factura: "",
    telefono_factura: "",
    pais_factura: "1", // Default Colombia
    ciudad_factura: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg("")

    // Basic validation
    if (!formData.tipo_identificacion || !formData.numero_identificacion || !formData.nombre_empresa || !formData.direccion_factura || !formData.correo_factura || !formData.pais_factura) {
      setErrorMsg("Por favor complete todos los campos obligatorios (*).")
      setIsSubmitting(false)
      return
    }

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Configuración de facturación guardada correctamente.")
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col font-['Montserrat']">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div>
            <h5 className="text-lg font-bold text-gray-800">Información de Facturación</h5>
            <span className="text-sm text-gray-500">La información corresponde a tu identificación tributaria en tu país</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">
              {errorMsg}
            </div>
          )}

          <form id="formu_factura" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <label className="text-sm font-medium text-gray-700 md:text-right">Tipo Identificación: <span className="text-red-500">*</span></label>
              <div className="md:col-span-2">
                <select name="tipo_identificacion" value={formData.tipo_identificacion} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#62cb31]" required>
                  <option value="">Seleccione</option>
                  <option value="CC">CC</option>
                  <option value="NIT">NIT</option>
                  <option value="RUT">RUT</option>
                  <option value="CE">CE</option>
                  <option value="PP">PP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <label className="text-sm font-medium text-gray-700 md:text-right">Número de Identificación: <span className="text-red-500">*</span></label>
              <div className="md:col-span-2">
                <input type="text" name="numero_identificacion" value={formData.numero_identificacion} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#62cb31]" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <label className="text-sm font-medium text-gray-700 md:text-right">Nombre/Razón Social: <span className="text-red-500">*</span></label>
              <div className="md:col-span-2">
                <input type="text" name="nombre_empresa" value={formData.nombre_empresa} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#62cb31]" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <label className="text-sm font-medium text-gray-700 md:text-right">Dirección: <span className="text-red-500">*</span></label>
              <div className="md:col-span-2">
                <input type="text" name="direccion_factura" value={formData.direccion_factura} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#62cb31]" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <label className="text-sm font-medium text-gray-700 md:text-right">Email: <span className="text-red-500">*</span></label>
              <div className="md:col-span-2">
                <input type="email" name="correo_factura" value={formData.correo_factura} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#62cb31]" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <label className="text-sm font-medium text-gray-700 md:text-right">Nombre Contacto:</label>
              <div className="md:col-span-2">
                <input type="text" name="contacto_factura" value={formData.contacto_factura} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#62cb31]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <label className="text-sm font-medium text-gray-700 md:text-right">Teléfono:</label>
              <div className="md:col-span-2">
                <input type="text" name="telefono_factura" value={formData.telefono_factura} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#62cb31]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <label className="text-sm font-medium text-gray-700 md:text-right">País: <span className="text-red-500">*</span></label>
              <div className="md:col-span-2">
                <select name="pais_factura" value={formData.pais_factura} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#62cb31]" required>
                  <option value="1">Colombia</option>
                  <option value="103">Mexico</option>
                  <option value="82">Peru</option>
                  <option value="90">Chile</option>
                  <option value="120">United States</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <label className="text-sm font-medium text-gray-700 md:text-right">Cuidad/Provincia: <span className="text-red-500">*</span></label>
              <div className="md:col-span-2">
                <input type="text" name="ciudad_factura" value={formData.ciudad_factura} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#62cb31]" required placeholder="Ej: Bogotá" />
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm font-medium">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#62cb31] text-white rounded hover:bg-[#52ad27] transition text-sm font-medium disabled:opacity-50">
                {isSubmitting ? "Guardando..." : "Guardar y Comprar"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
