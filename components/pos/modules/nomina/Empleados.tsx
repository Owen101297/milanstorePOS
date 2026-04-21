"use client"

import { useState, useEffect } from "react"
import { Plus, Download, FileText, Search, X, Loader2 } from "lucide-react"

const formatCOP = (v: number) => "$ " + v.toLocaleString("es-CO")

const mockEmpleados = [
  { id: 1, nombre: "Camilo Rodríguez", cargo: "Cajero", salario: 1300000, contrato: "Término Fijo", estado: "Activo" },
  { id: 2, nombre: "Daniela Mora", cargo: "Vendedora", salario: 1300000, contrato: "Término Indefinido", estado: "Activo" },
  { id: 3, nombre: "Esteban Villa", cargo: "Supervisor", salario: 2100000, contrato: "Término Indefinido", estado: "Activo" },
  { id: 4, nombre: "Laura Quintero", cargo: "Cajera", salario: 1300000, contrato: "Término Fijo", estado: "Inactivo" },
]

export default function ModuloEmpleados() {
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [empleados, setEmpleados] = useState<{id: number, nombre: string, cargo: string, salario: number, contrato: string, estado: string}[]>([])
  const [nuevo, setNuevo] = useState({ nombre: "", cargo: "", salario: "", contrato: "Término Fijo", estado: "Activo" })
  const [search, setSearch] = useState("")

  // Simulación de conexión real a Supabase
  useEffect(() => {
    const fetchData = async () => {
      // const { data, error } = await supabase.from('employees').select('*')
      setTimeout(() => {
        setEmpleados(mockEmpleados)
        setIsLoading(false)
      }, 800)
    }
    fetchData()
  }, [])

  const exportToCSV = () => {
    const headers = ["Nombre,Cargo,Salario Base,Tipo Contrato,Estado"]
    const rows = empleados.map(e => `${e.nombre},${e.cargo},${e.salario},${e.contrato},${e.estado}`)
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.concat(rows).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "nomina_empleados.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filtered = empleados.filter(e => e.nombre.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
         <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar empleado..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50] w-64"
            />
         </div>
         <div className="flex items-center gap-2">
          <button onClick={exportToCSV} className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:bg-[#45a049] transition-colors" style={{ backgroundColor: "#4CAF50" }}>
            <Plus className="w-4 h-4" /> Nuevo Empleado
          </button>
         </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-gray-400 gap-3">
             <Loader2 className="w-8 h-8 animate-spin text-[#4CAF50]"/>
             <p className="text-sm font-medium">Sincronizando empleados con Supabase...</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Nombre", "Cargo", "Salario Base", "Contrato / Archivos", "Estado"].map(h =>
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600">{h}</th>
              )}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{e.nombre}</td>
                  <td className="px-4 py-3 text-gray-600 font-medium">{e.cargo}</td>
                  <td className="px-4 py-3 font-bold text-green-600">{formatCOP(e.salario)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="font-medium text-gray-800">{e.contrato}</div>
                    <div className="text-[10px] text-blue-500 flex items-center gap-1 mt-0.5 cursor-pointer hover:underline" title={`Archivo: ${e.id}_${e.nombre.replace(' ','_')}_${new Date().getFullYear()}.pdf`}><FileText className="w-3 h-3" /> Ver Contrato PDF</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                      ${e.estado === "Activo" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {e.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600 font-medium transition-colors">Historial Salarial</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">Registrar Empleado</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nombre Completo</label>
                <input value={nuevo.nombre} onChange={e => setNuevo({...nuevo, nombre: e.target.value})} type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500" placeholder="Ej: Maria Lopez" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Cargo</label>
                  <select value={nuevo.cargo} onChange={e => setNuevo({...nuevo, cargo: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-white">
                    <option value="">Seleccionar...</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Cajero">Cajero</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Salario Base COP</label>
                  <input value={nuevo.salario} onChange={e => setNuevo({...nuevo, salario: e.target.value})} type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Copia del Contrato (Subida Normalizada a Supabase)</label>
                <input type="file" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 border border-dashed border-gray-300 rounded-lg p-1"/>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50/50">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
              <button 
                onClick={() => {
                  if(!nuevo.nombre || !nuevo.cargo || !nuevo.salario) return alert("Completa todos los campos")
                  setEmpleados([...empleados, { id: empleados.length + 1, nombre: nuevo.nombre, cargo: nuevo.cargo, salario: Number(nuevo.salario), contrato: "Término Fijo", estado: "Activo" }])
                  setShowModal(false)
                }} 
                className="flex-1 py-2 text-sm font-bold text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity" style={{ backgroundColor: "#4CAF50" }}
              >
                Guardar Empleado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
