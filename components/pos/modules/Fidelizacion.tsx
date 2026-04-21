"use client"

import { useState } from "react"
import { Gift, Award, Megaphone, Plus, Search, Tag, Settings, CreditCard, ChevronRight, X, Copy, QrCode, ShieldBan, FileText, CheckCircle, RefreshCcw } from "lucide-react"

interface FidelizacionProps {
  subMenu: string
}

// ==========================================
// MÓDULO 1: GIFT CARDS AVANZADO (Enterprise)
// ==========================================
type TransaccionGC = { id: string, fecha: string, tipo: "EMISIÓN" | "RETIRO" | "RECARGA", monto: number, comprobante?: string }
type GiftCard = { id: string, code: string, amount: number, total: number, client: string, status: "Disponible" | "Parcial" | "Usada" | "Congelada", expiracion: string, historial: TransaccionGC[] }

const MOCK_GC: GiftCard[] = [
  { 
    id: "GC-1", code: "MILAN-EFGH-5678", amount: 0, total: 50000, client: "María López", status: "Usada", expiracion: "2026-12-31",
    historial: [
      { id: "TX-1", fecha: "2025-10-01", tipo: "EMISIÓN", monto: 50000 },
      { id: "TX-2", fecha: "2025-11-20", tipo: "RETIRO", monto: -50000, comprobante: "FAC-8902" }
    ]
  },
  { 
    id: "GC-2", code: "MILAN-IJKL-9012", amount: 200000, total: 200000, client: "Sin asignar", status: "Disponible", expiracion: "2027-01-15",
    historial: [
      { id: "TX-3", fecha: "2026-01-15", tipo: "EMISIÓN", monto: 200000 }
    ]
  },
  { 
    id: "GC-3", code: "MILAN-ABCD-1234", amount: 50000, total: 100000, client: "Carlos Perez", status: "Parcial", expiracion: "2027-04-10",
    historial: [
      { id: "TX-4", fecha: "2026-04-10", tipo: "EMISIÓN", monto: 100000 },
      { id: "TX-5", fecha: "2026-04-12", tipo: "RETIRO", monto: -50000, comprobante: "FAC-9011" }
    ]
  }
]

function GiftCardsManager() {
  const [cards, setCards] = useState<GiftCard[]>(MOCK_GC)
  const [search, setSearch] = useState("")

  // Estados UI Adicionales
  const [modalGenerar, setModalGenerar] = useState(false)
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<GiftCard | null>(null)
  const [notificacion, setNotificacion] = useState("")

  // Formulario Emisión Dinámica
  const [nuevoMonto, setNuevoMonto] = useState("")
  const [nuevoCliente, setNuevoCliente] = useState("")
  
  const handleShowToast = (msg: string) => {
    setNotificacion(msg)
    setTimeout(() => setNotificacion(""), 3000)
  }

  const generarCodigoRandom = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let cod = 'MILAN-'
    for(let i=0; i<4; i++) cod += chars.charAt(Math.floor(Math.random() * chars.length))
    cod += '-'
    for(let i=0; i<4; i++) cod += chars.charAt(Math.floor(Math.random() * chars.length))
    return cod
  }

  const handleEmitirTarjeta = () => {
    if(!nuevoMonto || Number(nuevoMonto) <= 0) return alert("Debe establecer un monto válido.")
    const nueva: GiftCard = {
      id: "GC-" + Date.now(),
      code: generarCodigoRandom(),
      amount: Number(nuevoMonto),
      total: Number(nuevoMonto),
      client: nuevoCliente || "Sin asignar",
      status: "Disponible",
      expiracion: "2027-12-31", // +1 Año por defecto
      historial: [{ id: "TX-" + Date.now(), fecha: new Date().toISOString().split('T')[0], tipo: "EMISIÓN", monto: Number(nuevoMonto) }]
    }
    setCards([nueva, ...cards])
    setModalGenerar(false)
    setNuevoMonto("")
    setNuevoCliente("")
    handleShowToast("¡Gift Card emitida exitosamente y firmada en el Blockchain local!")
  }

  const congelarTarjeta = () => {
    if(!tarjetaSeleccionada) return
    if(confirm("¿Seguro que deseas bloquear este fondo? No podrá ser usado en POS hasta desbloquearlo.")) {
      setCards(cards.map(c => c.id === tarjetaSeleccionada.id ? {...c, status: c.status === "Congelada" ? "Disponible" : "Congelada"} : c))
      setTarjetaSeleccionada({...tarjetaSeleccionada, status: tarjetaSeleccionada.status === "Congelada" ? "Disponible" : "Congelada"})
      handleShowToast("Estado de seguridad actualizado.")
    }
  }

  const filtered = cards.filter(c => c.code.toLowerCase().includes(search.toLowerCase()) || c.client.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="animate-in fade-in flex flex-col sm:flex-row gap-6 h-full font-sans relative pb-10">
       
       {/* PANEL PRINCIPAL (Grilla) */}
       <div className={`flex-1 transition-all duration-300 ${tarjetaSeleccionada ? 'sm:w-2/3 pr-4' : 'w-full'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
               <h2 className="text-2xl font-black text-slate-800">Bóveda de Gift Cards</h2>
               <p className="text-sm font-medium text-slate-500 mt-1">Saldos anticipados y devoluciones corporativas.</p>
            </div>
            <button onClick={() => setModalGenerar(true)} className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all">
              <Plus className="w-5 h-5"/> Emitir Tarjeta Segura
            </button>
          </div>

          <div className="relative mb-6 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Rastrear código o propietario..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
          </div>

          {/* GRID TARJETAS FÍSICAS REPLICADAS */}
          <div className={`grid grid-cols-1 gap-6 overflow-y-auto pb-8 ${tarjetaSeleccionada ? 'xl:grid-cols-2' : 'lg:grid-cols-2 xl:grid-cols-3'}`}>
             {filtered.map(c => (
               <div key={c.id} onClick={() => setTarjetaSeleccionada(c)} className={`cursor-pointer relative bg-gradient-to-br from-slate-900 to-black rounded-3xl p-6 shadow-xl border overflow-hidden group hover:-translate-y-1 transition-all ${tarjetaSeleccionada?.id === c.id ? 'border-emerald-500 ring-4 ring-emerald-500/20' : 'border-slate-800 hover:border-slate-600'}`}>
                  
                  {/* Pattern Fondo */}
                  <div className="absolute right-0 top-0 w-32 h-64 bg-emerald-500/10 rotate-45 transform origin-top-right blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                  
                  <div className="flex justify-between items-start relative z-10 mb-8">
                    <div className="text-white opacity-80 flex items-center gap-2">
                       <Megaphone className="w-4 h-4"/> <span className="font-bold tracking-widest text-xs uppercase">Milan Retail</span>
                    </div>
                    <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-black rounded border
                       ${c.status === 'Disponible' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                         c.status === 'Usada' ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' : 
                         c.status === 'Congelada' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}
                    `}>
                      {c.status}
                    </span>
                  </div>

                  <div className="relative z-10 text-white">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="text-3xl font-black">${c.amount.toLocaleString()}</h3>
                      <span className="text-xs font-bold text-slate-400 block">Restante</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-8">
                       <p className="text-xs font-mono text-emerald-400 tracking-[0.2em]">{c.code}</p>
                       <QrCode className="w-6 h-6 text-slate-400 opacity-50"/>
                    </div>
                  </div>
               </div>
             ))}
          </div>
       </div>

       {/* DRAWER LATERAL: Auditoría y CRM de la GiftCard */}
       {tarjetaSeleccionada && (
         <div className="w-full sm:w-1/3 bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col h-[calc(100vh-160px)] sticky top-0 animate-in fade-in slide-in-from-right-8">
            {/* Header Drawer */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
               <h3 className="font-black text-slate-800 flex items-center gap-2"><CreditCard className="w-5 h-5 text-indigo-600"/> Inspección G.C.</h3>
               <button onClick={() => setTarjetaSeleccionada(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
               
               {/* Quick Info Balance */}
               <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Saldo Protegido Actual</p>
                  <p className={`text-4xl font-black ${tarjetaSeleccionada.status === 'Congelada' ? 'text-red-500' : 'text-slate-800'}`}>${tarjetaSeleccionada.amount.toLocaleString()}</p>
                  
                  <div className="flex items-center justify-center gap-2 mt-4">
                     <button onClick={() => {navigator.clipboard.writeText(tarjetaSeleccionada.code); handleShowToast("Código Copiado");}} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-1.5 shadow-sm"><Copy className="w-3.5 h-3.5"/> Copiar Token</button>
                     <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center gap-1.5 shadow-sm"><RefreshCcw className="w-3.5 h-3.5"/> Recargar</button>
                  </div>
               </div>

               {/* CRM Meta */}
               <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                   <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Beneficiario</span>
                   <span className="text-sm font-black text-slate-700">{tarjetaSeleccionada.client}</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                   <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Award className="w-4 h-4"/> Estado Firmado</span>
                   <span className={`text-xs font-black px-2 py-1 rounded-md bg-slate-100 ${tarjetaSeleccionada.status === 'Congelada' ? 'text-red-600' : 'text-indigo-600'}`}>{tarjetaSeleccionada.status}</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                   <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Megaphone className="w-4 h-4"/> Fecha Caducidad</span>
                   <span className="text-xs font-mono font-bold text-slate-700">{tarjetaSeleccionada.expiracion}</span>
                 </div>
               </div>

               {/* KARDEX TRANSACCIONAL DE LA TARJETA */}
               <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3 border-b border-slate-100 pb-2">Auditoría de Fondos (Inmutable)</h4>
                  <div className="space-y-3">
                     {tarjetaSeleccionada.historial.map(tx => (
                        <div key={tx.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-white transition-colors">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.tipo === 'EMISIÓN' || tx.tipo === 'RECARGA' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                 {tx.tipo === 'RETIRO' ? <FileText className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-700">{tx.tipo} {tx.comprobante && <span className="text-[10px] text-blue-500 underline ml-1 cursor-pointer">{tx.comprobante}</span>}</p>
                                <p className="text-[10px] font-medium text-slate-400">{tx.fecha}</p>
                              </div>
                           </div>
                           <span className={`text-sm font-black ${tx.monto > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                              {tx.monto > 0 ? '+' : ''}{tx.monto.toLocaleString()}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>

            </div>

            {/* Acciones de Seguridad Peligrosas */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-3xl">
               <button onClick={congelarTarjeta} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${tarjetaSeleccionada.status === 'Congelada' ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}>
                 <ShieldBan className="w-4 h-4"/> {tarjetaSeleccionada.status === 'Congelada' ? 'Reactivar (Descongelar) Fondos' : 'Suspender Operaciones por Fraude / Robo'}
               </button>
            </div>
         </div>
       )}

       {/* MODAL GENERACIÓN */}
       {modalGenerar && (
         <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
               <div className="p-6 bg-emerald-500 text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8"/>
                  </div>
                  <h3 className="text-2xl font-black">Emisión de Gift Card</h3>
                  <p className="text-emerald-100 text-sm font-medium mt-1">Ingresa el respaldo fiduciario local.</p>
               </div>
               
               <div className="p-8 space-y-5">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Monto en Efectivo/Respaldo ($)</label>
                    <input type="number" autoFocus value={nuevoMonto} onChange={e => setNuevoMonto(e.target.value)} placeholder="Ej. 150000" className="w-full text-center px-4 py-4 text-3xl font-black bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 text-emerald-600 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Asignar Portador (Opcional)</label>
                    <input type="text" value={nuevoCliente} onChange={e => setNuevoCliente(e.target.value)} placeholder="CC del Cliente o Nombre..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700" />
                  </div>

                  <div className="flex gap-3 pt-4 mt-8 border-t border-slate-100">
                    <button onClick={() => setModalGenerar(false)} className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
                    <button onClick={handleEmitirTarjeta} className="flex-[2] py-3 font-black text-white bg-slate-900 hover:bg-black rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"><CheckCircle className="w-5 h-5"/> Autorizar y Emitir</button>
                  </div>
               </div>
            </div>
         </div>
       )}

       {/* SISTEMA TOAST GLOBAL MODULO */}
       {notificacion && (
         <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-in slide-in-from-bottom-8 z-[100]">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            {notificacion}
         </div>
       )}

    </div>
  )
}

function PuntosManager() {
  // ==========================================
  // DATOS MOCK DE CLIENTES CON PUNTOS
  // ==========================================
  const [clientes, setClientes] = useState([
    { id: 1, name: "Andrea Gómez", doc: "1010101010", phone: "320 111 2233", email: "andrea@mail.com", puntos: 14500, totalCompras: 2900000, visitas: 38, ultimaVisita: "2026-04-12", tier: "Platino" as const },
    { id: 2, name: "Carlos Bernal", doc: "2020202020", phone: "310 444 5566", email: "carlos@mail.com", puntos: 8200, totalCompras: 1640000, visitas: 22, ultimaVisita: "2026-04-10", tier: "Oro" as const },
    { id: 3, name: "María López", doc: "3030303030", phone: "315 777 8899", email: "maria@mail.com", puntos: 4100, totalCompras: 820000, visitas: 14, ultimaVisita: "2026-04-08", tier: "Plata" as const },
    { id: 4, name: "Juan Pérez", doc: "4040404040", phone: "300 222 3344", email: "", puntos: 900, totalCompras: 180000, visitas: 4, ultimaVisita: "2026-03-20", tier: "Bronce" as const },
    { id: 5, name: "Sofía Ramírez", doc: "5050505050", phone: "321 555 6677", email: "sofia@mail.com", puntos: 6300, totalCompras: 1260000, visitas: 19, ultimaVisita: "2026-04-14", tier: "Oro" as const },
  ])

  // HISTORIAL DE MOVIMIENTOS DE PUNTOS
  const [historial] = useState([
    { id: "MP-1", fecha: "2026-04-14", cliente: "Sofía Ramírez", tipo: "ACUMULACIÓN" as const, puntos: 350, ref: "FAC-3021", detalle: "Compra $350.000" },
    { id: "MP-2", fecha: "2026-04-12", cliente: "Andrea Gómez", tipo: "REDENCIÓN" as const, puntos: -500, ref: "FAC-3019", detalle: "Canje en POS: -$5.000 dcto" },
    { id: "MP-3", fecha: "2026-04-10", cliente: "Carlos Bernal", tipo: "ACUMULACIÓN" as const, puntos: 200, ref: "FAC-3015", detalle: "Compra $200.000" },
    { id: "MP-4", fecha: "2026-04-08", cliente: "María López", tipo: "BONIFICACIÓN" as const, puntos: 1000, ref: "BONO-CUMPLE", detalle: "Bono cumpleaños automático" },
    { id: "MP-5", fecha: "2026-04-05", cliente: "Andrea Gómez", tipo: "ACUMULACIÓN" as const, puntos: 450, ref: "FAC-3010", detalle: "Compra $450.000" },
  ])

  // CONFIGURACIÓN DE REGLAS
  const [config, setConfig] = useState({
    pesosXPunto: 1000,
    valorPunto: 10,
    puntosMinRedimir: 100,
    expiracionMeses: 12,
    bonoRegistro: 500,
    bonoCumple: 1000,
    multiplicadorVIP: 2,
  })

  // UI STATE
  const [busqueda, setBusqueda] = useState("")
  const [clienteSeleccionado, setClienteSeleccionado] = useState<typeof clientes[0] | null>(null)
  const [tabActiva, setTabActiva] = useState<"ranking" | "historial" | "config" | "redimir">("ranking")
  const [toast, setToast] = useState("")
  const [configGuardada, setConfigGuardada] = useState(false)

  // REDENCIÓN STATE
  const [redencionPuntos, setRedencionPuntos] = useState("")
  const [redencionCliente, setRedencionCliente] = useState("")

  const formatCOP = (v: number) => "$ " + Math.round(v).toLocaleString("es-CO")

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000) }

  const guardarConfig = () => {
    setConfigGuardada(true)
    showToast("Reglas financieras guardadas correctamente")
    setTimeout(() => setConfigGuardada(false), 2000)
  }

  // TIERS
  const TIERS = {
    Bronce:  { min: 0,     color: "bg-orange-100 text-orange-700 border-orange-200", icon: "🥉" },
    Plata:   { min: 2000,  color: "bg-slate-100 text-slate-600 border-slate-200", icon: "🥈" },
    Oro:     { min: 5000,  color: "bg-amber-100 text-amber-700 border-amber-200", icon: "🥇" },
    Platino: { min: 10000, color: "bg-violet-100 text-violet-700 border-violet-200", icon: "💎" },
  }

  // REDIMIR PUNTOS
  const handleRedimir = () => {
    const pts = Number(redencionPuntos)
    if (!redencionCliente) return alert("Selecciona un cliente")
    if (!pts || pts < config.puntosMinRedimir) return alert(`Mínimo ${config.puntosMinRedimir} puntos para redimir`)
    const cliente = clientes.find(c => c.name === redencionCliente)
    if (!cliente) return alert("Cliente no encontrado")
    if (pts > cliente.puntos) return alert(`${cliente.name} solo tiene ${cliente.puntos.toLocaleString()} puntos disponibles`)

    setClientes(clientes.map(c => c.id === cliente.id ? { ...c, puntos: c.puntos - pts } : c))
    setRedencionPuntos("")
    setRedencionCliente("")
    showToast(`¡${pts.toLocaleString()} puntos canjeados! Descuento de ${formatCOP(pts * config.valorPunto)} aplicado`)
  }

  // KPIs
  const totalPuntosCirculando = clientes.reduce((a, c) => a + c.puntos, 0)
  const valorTotalPuntos = totalPuntosCirculando * config.valorPunto
  const clientesFiltrados = clientes.filter(c => c.name.toLowerCase().includes(busqueda.toLowerCase()) || c.doc.includes(busqueda))

  const TABS = [
    { id: "ranking" as const, label: "Ranking VIP", icon: "🏆" },
    { id: "historial" as const, label: "Movimientos", icon: "📋" },
    { id: "redimir" as const, label: "Canjear Puntos", icon: "🎁" },
    { id: "config" as const, label: "Reglas", icon: "⚙️" },
  ]

  return (
    <div className="animate-in fade-in duration-500 flex flex-col lg:flex-row gap-6 h-full relative pb-6">

       {/* === PANEL IZQUIERDO (Principal) === */}
       <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${clienteSeleccionado ? 'lg:w-2/3' : 'w-full'}`}>

          {/* HEADER + KPIs */}
          <div className="mb-6">
             <h2 className="text-2xl font-black text-slate-800">Motor de Lealtad (Puntos)</h2>
             <p className="text-sm font-medium text-slate-500 mt-1">Sistema de recompensas por acumulación y canje automático.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Puntos en Circulación</p>
                <p className="text-2xl font-black text-indigo-600 mt-1">{totalPuntosCirculando.toLocaleString()}</p>
             </div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pasivo Monetario</p>
                <p className="text-2xl font-black text-red-500 mt-1">{formatCOP(valorTotalPuntos)}</p>
             </div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clientes Leales</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{clientes.length}</p>
             </div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasa Activa</p>
                <p className="text-2xl font-black text-slate-800 mt-1">${config.pesosXPunto.toLocaleString()} → 1pt</p>
             </div>
          </div>

          {/* TABS DE NAVEGACIÓN INTERNA */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6">
             {TABS.map(t => (
                <button key={t.id} onClick={() => setTabActiva(t.id)}
                   className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5
                      ${tabActiva === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                   <span>{t.icon}</span> {t.label}
                </button>
             ))}
          </div>

          {/* === TAB: RANKING VIP === */}
          {tabActiva === "ranking" && (
             <div className="flex-1 overflow-y-auto">
                <div className="relative mb-4 max-w-sm">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                   <input type="text" placeholder="Buscar cliente..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"/>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                         <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                            <th className="p-4">#</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4">Tier</th>
                            <th className="p-4 text-right">Puntos</th>
                            <th className="p-4 text-right">Total Compras</th>
                            <th className="p-4 text-center">Visitas</th>
                            <th className="p-4 text-right">Última Visita</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {clientesFiltrados.sort((a, b) => b.puntos - a.puntos).map((c, i) => (
                            <tr key={c.id} onClick={() => setClienteSeleccionado(c)} className={`text-sm font-medium cursor-pointer transition-colors ${clienteSeleccionado?.id === c.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                               <td className="p-4">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>{i + 1}</div>
                               </td>
                               <td className="p-4">
                                  <p className="font-bold text-slate-800">{c.name}</p>
                                  <p className="text-[11px] text-slate-400">{c.doc}</p>
                               </td>
                               <td className="p-4">
                                  <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-md border ${TIERS[c.tier].color}`}>{TIERS[c.tier].icon} {c.tier}</span>
                               </td>
                               <td className="p-4 text-right font-black text-indigo-600">{c.puntos.toLocaleString()}</td>
                               <td className="p-4 text-right text-slate-600">{formatCOP(c.totalCompras)}</td>
                               <td className="p-4 text-center text-slate-500">{c.visitas}</td>
                               <td className="p-4 text-right text-slate-400 font-mono text-xs">{c.ultimaVisita}</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {/* === TAB: HISTORIAL DE MOVIMIENTOS === */}
          {tabActiva === "historial" && (
             <div className="flex-1 overflow-y-auto">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                   <div className="p-4 border-b border-slate-100 bg-slate-50">
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Ledger de Puntos (Inmutable)</h3>
                   </div>
                   <div className="divide-y divide-slate-50">
                      {historial.map(h => (
                         <div key={h.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                               <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm
                                  ${h.tipo === 'ACUMULACIÓN' ? 'bg-emerald-100 text-emerald-600' : h.tipo === 'REDENCIÓN' ? 'bg-red-100 text-red-500' : 'bg-violet-100 text-violet-600'}`}>
                                  {h.tipo === 'ACUMULACIÓN' ? <Plus className="w-4 h-4"/> : h.tipo === 'REDENCIÓN' ? <Tag className="w-4 h-4"/> : <Gift className="w-4 h-4"/>}
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-slate-800">{h.cliente}</p>
                                  <p className="text-[11px] text-slate-400">{h.detalle} · <span className="text-blue-500 font-mono">{h.ref}</span></p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className={`font-black ${h.puntos > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{h.puntos > 0 ? '+' : ''}{h.puntos.toLocaleString()} pts</p>
                               <p className="text-[10px] text-slate-400 font-mono">{h.fecha}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {/* === TAB: CANJEAR PUNTOS === */}
          {tabActiva === "redimir" && (
             <div className="flex-1">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-lg">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center"><Award className="w-6 h-6"/></div>
                      <div>
                         <h3 className="font-black text-slate-800">Redención Manual en POS</h3>
                         <p className="text-xs text-slate-500">Aplica descuento desde puntos acumulados del cliente.</p>
                      </div>
                   </div>

                   <div className="space-y-5">
                      <div>
                         <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Cliente Beneficiario</label>
                         <select value={redencionCliente} onChange={e => setRedencionCliente(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">Seleccionar cliente...</option>
                            {clientes.filter(c => c.puntos >= config.puntosMinRedimir).map(c => (
                               <option key={c.id} value={c.name}>{c.name} — {c.puntos.toLocaleString()} pts disp.</option>
                            ))}
                         </select>
                      </div>
                      <div>
                         <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Puntos a Canjear (Mín. {config.puntosMinRedimir})</label>
                         <input type="number" value={redencionPuntos} onChange={e => setRedencionPuntos(e.target.value)} placeholder="Ej. 500" className="w-full px-4 py-4 text-2xl font-black bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 text-indigo-600 text-center transition-colors"/>
                      </div>
                      {redencionPuntos && Number(redencionPuntos) > 0 && (
                         <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Descuento Equivalente</p>
                            <p className="text-3xl font-black text-emerald-700">{formatCOP(Number(redencionPuntos) * config.valorPunto)}</p>
                         </div>
                      )}
                      <button onClick={handleRedimir} disabled={!redencionCliente || !redencionPuntos} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2">
                         <CheckCircle className="w-5 h-5"/> Confirmar Canje
                      </button>
                   </div>
                </div>
             </div>
          )}

          {/* === TAB: CONFIGURACIÓN === */}
          {tabActiva === "config" && (
             <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {/* Regla de Acumulación */}
                   <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
                      <h3 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-5 flex items-center gap-2 relative z-10"><Settings className="w-4 h-4"/> Tasa de Acumulación</h3>
                      <div className="space-y-4 relative z-10">
                         <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center gap-4">
                            <div className="flex-1">
                               <label className="text-[10px] font-bold text-indigo-400 uppercase">Por cada ($)</label>
                               <div className="flex items-center mt-1">
                                  <span className="text-lg font-bold text-indigo-300 mr-1">$</span>
                                  <input type="number" value={config.pesosXPunto} onChange={e => setConfig({...config, pesosXPunto: Number(e.target.value)})} className="w-full text-xl font-black bg-transparent outline-none text-indigo-900 border-b-2 border-indigo-200 focus:border-indigo-500"/>
                               </div>
                            </div>
                            <span className="text-indigo-300 text-xl">→</span>
                            <div className="text-center">
                               <p className="text-3xl font-black text-indigo-900">1</p>
                               <p className="text-[10px] font-bold text-indigo-500">Punto</p>
                            </div>
                         </div>
                         <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                            <label className="text-[10px] font-bold text-emerald-500 uppercase">Valor por Punto al Redimir</label>
                            <div className="flex items-center mt-1">
                               <span className="text-lg font-bold text-emerald-300 mr-1">$</span>
                               <input type="number" value={config.valorPunto} onChange={e => setConfig({...config, valorPunto: Number(e.target.value)})} className="w-32 text-xl font-black bg-transparent outline-none text-emerald-900 border-b-2 border-emerald-200 focus:border-emerald-500"/>
                               <span className="text-xs font-bold text-emerald-600 ml-2">de Dcto.</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Reglas Avanzadas */}
                   <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-5 flex items-center gap-2"><Award className="w-4 h-4 text-amber-500"/> Reglas de Negocio</h3>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <label className="text-xs font-bold text-slate-600">Mínimo para Canjear</label>
                            <div className="flex items-center gap-1">
                               <input type="number" value={config.puntosMinRedimir} onChange={e => setConfig({...config, puntosMinRedimir: Number(e.target.value)})} className="w-20 text-right text-sm font-black bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                               <span className="text-xs text-slate-400 font-bold">pts</span>
                            </div>
                         </div>
                         <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <label className="text-xs font-bold text-slate-600">Expiración de Puntos</label>
                            <div className="flex items-center gap-1">
                               <input type="number" value={config.expiracionMeses} onChange={e => setConfig({...config, expiracionMeses: Number(e.target.value)})} className="w-20 text-right text-sm font-black bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                               <span className="text-xs text-slate-400 font-bold">meses</span>
                            </div>
                         </div>
                         <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <label className="text-xs font-bold text-slate-600">Bono de Registro</label>
                            <div className="flex items-center gap-1">
                               <input type="number" value={config.bonoRegistro} onChange={e => setConfig({...config, bonoRegistro: Number(e.target.value)})} className="w-20 text-right text-sm font-black bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                               <span className="text-xs text-slate-400 font-bold">pts</span>
                            </div>
                         </div>
                         <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <label className="text-xs font-bold text-slate-600">Bono de Cumpleaños</label>
                            <div className="flex items-center gap-1">
                               <input type="number" value={config.bonoCumple} onChange={e => setConfig({...config, bonoCumple: Number(e.target.value)})} className="w-20 text-right text-sm font-black bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                               <span className="text-xs text-slate-400 font-bold">pts</span>
                            </div>
                         </div>
                         <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <label className="text-xs font-bold text-amber-700">Multiplicador VIP (Platino)</label>
                            <div className="flex items-center gap-1">
                               <input type="number" value={config.multiplicadorVIP} onChange={e => setConfig({...config, multiplicadorVIP: Number(e.target.value)})} className="w-20 text-right text-sm font-black bg-white border border-amber-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"/>
                               <span className="text-xs text-amber-500 font-bold">x</span>
                            </div>
                         </div>
                      </div>
                      <button onClick={guardarConfig} className={`w-full mt-5 py-3.5 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${configGuardada ? 'bg-emerald-500 text-white' : 'bg-slate-900 hover:bg-black text-white'}`}>
                         {configGuardada ? <><CheckCircle className="w-5 h-5"/> Guardado</> : 'Guardar Todas las Reglas'}
                      </button>
                   </div>
                </div>
             </div>
          )}
       </div>

       {/* === DRAWER DERECHO: Ficha del Cliente === */}
       {clienteSeleccionado && (
          <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col h-[calc(100vh-160px)] sticky top-0 animate-in fade-in slide-in-from-right-8">

             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
                <h3 className="font-black text-slate-800 text-sm">Ficha de Lealtad</h3>
                <button onClick={() => setClienteSeleccionado(null)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-200 rounded-full transition-colors"><X className="w-4 h-4"/></button>
             </div>

             <div className="p-5 flex-1 overflow-y-auto space-y-5">
                {/* Avatar + Nombre */}
                <div className="text-center">
                   <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-black">{clienteSeleccionado.name.charAt(0)}</div>
                   <h4 className="font-black text-slate-800 text-lg">{clienteSeleccionado.name}</h4>
                   <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase rounded-md border mt-2 ${TIERS[clienteSeleccionado.tier].color}`}>{TIERS[clienteSeleccionado.tier].icon} {clienteSeleccionado.tier}</span>
                </div>

                {/* Balance de Puntos */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white text-center">
                   <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Saldo Disponible</p>
                   <p className="text-4xl font-black mt-1">{clienteSeleccionado.puntos.toLocaleString()}</p>
                   <p className="text-xs opacity-60 mt-1">≈ {formatCOP(clienteSeleccionado.puntos * config.valorPunto)} en descuentos</p>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Invertido</p>
                      <p className="text-sm font-black text-slate-800">{formatCOP(clienteSeleccionado.totalCompras)}</p>
                   </div>
                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Visitas</p>
                      <p className="text-sm font-black text-slate-800">{clienteSeleccionado.visitas}</p>
                   </div>
                </div>

                {/* Datos de contacto */}
                <div className="space-y-2">
                   <div className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg">
                      <span className="text-[10px] font-bold text-slate-400">Doc.</span>
                      <span className="text-xs font-black text-slate-700">{clienteSeleccionado.doc}</span>
                   </div>
                   <div className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg">
                      <span className="text-[10px] font-bold text-slate-400">Tel.</span>
                      <span className="text-xs font-black text-slate-700">{clienteSeleccionado.phone}</span>
                   </div>
                   {clienteSeleccionado.email && (
                      <div className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg">
                         <span className="text-[10px] font-bold text-slate-400">Email</span>
                         <span className="text-xs font-bold text-blue-600">{clienteSeleccionado.email}</span>
                      </div>
                   )}
                   <div className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg">
                      <span className="text-[10px] font-bold text-slate-400">Última visita</span>
                      <span className="text-xs font-mono font-bold text-slate-700">{clienteSeleccionado.ultimaVisita}</span>
                   </div>
                </div>

                {/* Barra de Progreso al siguiente Tier */}
                {clienteSeleccionado.tier !== "Platino" && (() => {
                   const tiers = Object.entries(TIERS)
                   const currentIdx = tiers.findIndex(([k]) => k === clienteSeleccionado.tier)
                   const nextTier = tiers[currentIdx + 1]
                   if (!nextTier) return null
                   const progress = Math.min(100, (clienteSeleccionado.puntos / nextTier[1].min) * 100)
                   return (
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Progreso a {nextTier[0]}</span>
                            <span className="text-[10px] font-black text-indigo-600">{Math.round(progress)}%</span>
                         </div>
                         <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
                         </div>
                         <p className="text-[10px] text-slate-400 mt-2">Faltan <span className="font-black text-slate-600">{(nextTier[1].min - clienteSeleccionado.puntos).toLocaleString()}</span> pts</p>
                      </div>
                   )
                })()}
             </div>
          </div>
       )}

       {/* TOAST */}
       {toast && (
          <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-[100] animate-in slide-in-from-bottom-8">
             <CheckCircle className="w-6 h-6 text-emerald-400" />
             {toast}
          </div>
       )}
    </div>
  )
}

function PromocionesManager() {
  type PromoType = "descuento_porcentaje" | "descuento_fijo" | "bxgy" | "envio_gratis" | "puntos_extra"
  type PromoStatus = "Activa" | "Programada" | "Pausada" | "Expirada"
  
  interface Promocion {
    id: string
    title: string
    description: string
    type: PromoType
    value: number  // % o $ o multiplicador, según el type
    valueSecondary?: number // Para BxGy: "compra X"
    target: string
    targetType: "categoria" | "producto" | "sku" | "global"
    startDate: string
    endDate: string
    status: PromoStatus
    minCompra?: number
    maxUsos?: number
    usosActuales: number
    acumulable: boolean
    sedes: string[]
  }

  const PROMO_TYPES: Record<PromoType, { label: string, icon: string, color: string }> = {
    descuento_porcentaje: { label: "% Descuento", icon: "🏷️", color: "bg-blue-100 text-blue-700 border-blue-200" },
    descuento_fijo:       { label: "$ Descuento Fijo", icon: "💵", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    bxgy:                 { label: "Lleva X Paga Y", icon: "🎁", color: "bg-violet-100 text-violet-700 border-violet-200" },
    envio_gratis:         { label: "Envío Gratis", icon: "🚚", color: "bg-amber-100 text-amber-700 border-amber-200" },
    puntos_extra:         { label: "Puntos Extra", icon: "⭐", color: "bg-pink-100 text-pink-700 border-pink-200" },
  }

  const [promos, setPromos] = useState<Promocion[]>([
    { id: "P-1", title: "Black Friday 50% Off", description: "Descuento masivo en temporada de fin de año para toda la categoría de vestidos", type: "descuento_porcentaje", value: 50, target: "Vestidos", targetType: "categoria", startDate: "2026-11-20", endDate: "2026-11-28", status: "Programada", minCompra: 0, maxUsos: 500, usosActuales: 0, acumulable: false, sedes: ["Sede Principal", "Sucursal Norte"] },
    { id: "P-2", title: "2x1 Camisetas Básicas", description: "Compra 2 camisetas básicas y paga solo 1", type: "bxgy", value: 1, valueSecondary: 2, target: "CAM-BAS-001", targetType: "sku", startDate: "2026-04-01", endDate: "2026-05-01", status: "Activa", maxUsos: 200, usosActuales: 47, acumulable: false, sedes: ["Todas"] },
    { id: "P-3", title: "Envío Gratis +$100K", description: "Envío sin costo en compras superiores a $100.000 en tienda online", type: "envio_gratis", value: 0, target: "Global", targetType: "global", startDate: "2026-04-01", endDate: "2026-12-31", status: "Activa", minCompra: 100000, usosActuales: 312, acumulable: true, sedes: ["Tienda Online"] },
    { id: "P-4", title: "Puntos x3 Semana VIP", description: "Esta semana los clientes Platino acumulan el triple de puntos en cualquier compra", type: "puntos_extra", value: 3, target: "Global", targetType: "global", startDate: "2026-04-14", endDate: "2026-04-20", status: "Activa", usosActuales: 26, acumulable: true, sedes: ["Todas"] },
    { id: "P-5", title: "-$10.000 en Accesorios", description: "Descuento fijo de $10.000 en cualquier accesorio de la tienda", type: "descuento_fijo", value: 10000, target: "Accesorios", targetType: "categoria", startDate: "2026-03-01", endDate: "2026-03-31", status: "Expirada", usosActuales: 89, acumulable: false, sedes: ["Sede Principal"] },
  ])

  const [modalCrear, setModalCrear] = useState(false)
  const [promoSeleccionada, setPromoSeleccionada] = useState<Promocion | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<"todas" | PromoStatus>("todas")
  const [toast, setToast] = useState("")

  // Formulario nueva promo
  const [form, setForm] = useState({
    title: "", description: "", type: "descuento_porcentaje" as PromoType, value: "",
    valueSecondary: "", target: "", targetType: "categoria" as Promocion["targetType"],
    startDate: "", endDate: "", minCompra: "", maxUsos: "", acumulable: false
  })

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000) }
  const formatCOP = (v: number) => "$ " + Math.round(v).toLocaleString("es-CO")

  const STATUS_STYLES: Record<PromoStatus, string> = {
    Activa: "bg-emerald-100 text-emerald-700",
    Programada: "bg-blue-100 text-blue-700",
    Pausada: "bg-amber-100 text-amber-700",
    Expirada: "bg-slate-100 text-slate-500",
  }

  const handleCrearPromo = () => {
    if (!form.title || !form.value || !form.startDate || !form.endDate) return alert("Completa todos los campos obligatorios")
    const nueva: Promocion = {
      id: "P-" + Date.now(),
      title: form.title,
      description: form.description,
      type: form.type,
      value: Number(form.value),
      valueSecondary: form.valueSecondary ? Number(form.valueSecondary) : undefined,
      target: form.target || "Global",
      targetType: form.targetType,
      startDate: form.startDate,
      endDate: form.endDate,
      status: new Date(form.startDate) > new Date() ? "Programada" : "Activa",
      minCompra: form.minCompra ? Number(form.minCompra) : undefined,
      maxUsos: form.maxUsos ? Number(form.maxUsos) : undefined,
      usosActuales: 0,
      acumulable: form.acumulable,
      sedes: ["Todas"],
    }
    setPromos([nueva, ...promos])
    setModalCrear(false)
    setForm({ title: "", description: "", type: "descuento_porcentaje", value: "", valueSecondary: "", target: "", targetType: "categoria", startDate: "", endDate: "", minCompra: "", maxUsos: "", acumulable: false })
    showToast("Campaña creada exitosamente")
  }

  const toggleStatus = (id: string) => {
    setPromos(promos.map(p => {
      if (p.id !== id) return p
      const next: PromoStatus = p.status === "Activa" ? "Pausada" : p.status === "Pausada" ? "Activa" : p.status
      return { ...p, status: next }
    }))
    showToast("Estado de campaña actualizado")
  }

  const eliminarPromo = (id: string) => {
    if (!confirm("¿Eliminar esta campaña permanentemente?")) return
    setPromos(promos.filter(p => p.id !== id))
    if (promoSeleccionada?.id === id) setPromoSeleccionada(null)
    showToast("Campaña eliminada")
  }

  const filtradas = filtroStatus === "todas" ? promos : promos.filter(p => p.status === filtroStatus)

  // KPIs
  const activas = promos.filter(p => p.status === "Activa").length
  const totalUsos = promos.reduce((a, p) => a + p.usosActuales, 0)

  const getPromoValueLabel = (p: Promocion) => {
    switch (p.type) {
      case "descuento_porcentaje": return `-${p.value}%`
      case "descuento_fijo": return `-${formatCOP(p.value)}`
      case "bxgy": return `${p.valueSecondary || 2}x${p.value}`
      case "envio_gratis": return "Gratis"
      case "puntos_extra": return `x${p.value}`
    }
  }

  return (
    <div className="animate-in fade-in duration-500 flex flex-col lg:flex-row gap-6 h-full relative pb-6">

       {/* PANEL PRINCIPAL */}
       <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${promoSeleccionada ? 'lg:w-2/3' : 'w-full'}`}>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
             <div>
                <h2 className="text-2xl font-black text-slate-800">Motor de Promociones</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Reglas de descuento automáticas que se aplican en checkout.</p>
             </div>
             <button onClick={() => setModalCrear(true)} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all">
                <Megaphone className="w-5 h-5"/> Nueva Campaña
             </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campañas Totales</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{promos.length}</p>
             </div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activas Ahora</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{activas}</p>
             </div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Usos Totales</p>
                <p className="text-2xl font-black text-blue-600 mt-1">{totalUsos.toLocaleString()}</p>
             </div>
             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipos Motor</p>
                <p className="text-2xl font-black text-violet-600 mt-1">{Object.keys(PROMO_TYPES).length}</p>
             </div>
          </div>

          {/* Filtros por estado */}
          <div className="flex gap-1.5 mb-5 flex-wrap">
             {(["todas", "Activa", "Programada", "Pausada", "Expirada"] as const).map(s => (
                <button key={s} onClick={() => setFiltroStatus(s)}
                   className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
                      ${filtroStatus === s ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                >
                   {s === "todas" ? "Todas" : s} {s !== "todas" && <span className="ml-1 opacity-60">({promos.filter(p => p.status === s).length})</span>}
                </button>
             ))}
          </div>

          {/* Lista de Promos */}
          <div className="flex-1 overflow-y-auto space-y-3">
             {filtradas.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                   <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                   <p className="font-bold">No hay campañas con este filtro</p>
                </div>
             )}
             {filtradas.map(p => (
                <div key={p.id} onClick={() => setPromoSeleccionada(p)}
                   className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md
                      ${promoSeleccionada?.id === p.id ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-md' : 'border-slate-100 shadow-sm'}`}
                >
                   <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                         <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border ${PROMO_TYPES[p.type].color}`}>
                            {PROMO_TYPES[p.type].icon}
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                               <h3 className="font-black text-slate-800 truncate">{p.title}</h3>
                               <span className={`px-2 py-0.5 text-[9px] uppercase font-black rounded tracking-wider ${STATUS_STYLES[p.status]}`}>{p.status}</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-2 line-clamp-1">{p.description}</p>
                            <div className="flex items-center gap-3 flex-wrap">
                               <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">{PROMO_TYPES[p.type].label}</span>
                               <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">{p.targetType === 'global' ? '🌎 Global' : p.target}</span>
                               <span className="text-[10px] font-mono text-slate-400">{p.startDate} → {p.endDate}</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                         <p className="text-xl font-black text-blue-600">{getPromoValueLabel(p)}</p>
                         <p className="text-[10px] text-slate-400 font-bold mt-1">{p.usosActuales} usos</p>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* DRAWER LATERAL: Detalle de la Promo */}
       {promoSeleccionada && (
          <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col h-[calc(100vh-160px)] sticky top-0 animate-in fade-in slide-in-from-right-8">
             
             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
                <h3 className="font-black text-slate-800 text-sm">Detalle de Campaña</h3>
                <button onClick={() => setPromoSeleccionada(null)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-200 rounded-full transition-colors"><X className="w-4 h-4"/></button>
             </div>

             <div className="p-5 flex-1 overflow-y-auto space-y-5">
                {/* Cabecera visual */}
                <div className="text-center">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl border ${PROMO_TYPES[promoSeleccionada.type].color}`}>{PROMO_TYPES[promoSeleccionada.type].icon}</div>
                   <h4 className="font-black text-slate-800 text-lg leading-tight">{promoSeleccionada.title}</h4>
                   <span className={`inline-block mt-2 px-2.5 py-1 text-[10px] uppercase font-black rounded tracking-wider ${STATUS_STYLES[promoSeleccionada.status]}`}>{promoSeleccionada.status}</span>
                </div>

                {/* Valor de la promo */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white text-center">
                   <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Valor de la Regla</p>
                   <p className="text-4xl font-black mt-1">{getPromoValueLabel(promoSeleccionada)}</p>
                   <p className="text-xs opacity-60 mt-1">{PROMO_TYPES[promoSeleccionada.type].label}</p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">{promoSeleccionada.description}</p>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Usos</p>
                      <p className="text-sm font-black text-slate-800">{promoSeleccionada.usosActuales}{promoSeleccionada.maxUsos ? ` / ${promoSeleccionada.maxUsos}` : ''}</p>
                   </div>
                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Acumulable</p>
                      <p className="text-sm font-black text-slate-800">{promoSeleccionada.acumulable ? '✅ Sí' : '❌ No'}</p>
                   </div>
                </div>

                {/* Detalles */}
                <div className="space-y-2">
                   <div className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg">
                      <span className="text-[10px] font-bold text-slate-400">Objetivo</span>
                      <span className="text-xs font-black text-slate-700">{promoSeleccionada.targetType === 'global' ? '🌎 Global' : promoSeleccionada.target}</span>
                   </div>
                   <div className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg">
                      <span className="text-[10px] font-bold text-slate-400">Tipo objetivo</span>
                      <span className="text-xs font-black text-slate-700 capitalize">{promoSeleccionada.targetType}</span>
                   </div>
                   {promoSeleccionada.minCompra && promoSeleccionada.minCompra > 0 && (
                      <div className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg">
                         <span className="text-[10px] font-bold text-slate-400">Compra mínima</span>
                         <span className="text-xs font-black text-slate-700">{formatCOP(promoSeleccionada.minCompra)}</span>
                      </div>
                   )}
                   <div className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg">
                      <span className="text-[10px] font-bold text-slate-400">Vigencia</span>
                      <span className="text-[10px] font-mono font-bold text-slate-700">{promoSeleccionada.startDate} → {promoSeleccionada.endDate}</span>
                   </div>
                   <div className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg">
                      <span className="text-[10px] font-bold text-slate-400">Sedes</span>
                      <span className="text-xs font-bold text-blue-600">{promoSeleccionada.sedes.join(", ")}</span>
                   </div>
                </div>

                {/* Barra de progreso de usos */}
                {promoSeleccionada.maxUsos && (
                   <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-black text-slate-400 uppercase">Consumo de Cupo</span>
                         <span className="text-[10px] font-black text-blue-600">{Math.round((promoSeleccionada.usosActuales / promoSeleccionada.maxUsos) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                         <div className="bg-blue-500 h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (promoSeleccionada.usosActuales / promoSeleccionada.maxUsos) * 100)}%` }}></div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">Quedan <span className="font-black text-slate-600">{(promoSeleccionada.maxUsos - promoSeleccionada.usosActuales).toLocaleString()}</span> usos disponibles</p>
                   </div>
                )}
             </div>

             {/* Acciones rápidas */}
             <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl space-y-2">
                {(promoSeleccionada.status === "Activa" || promoSeleccionada.status === "Pausada") && (
                   <button onClick={() => { toggleStatus(promoSeleccionada.id); setPromoSeleccionada({...promoSeleccionada, status: promoSeleccionada.status === "Activa" ? "Pausada" : "Activa"}) }}
                      className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${promoSeleccionada.status === 'Activa' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                      {promoSeleccionada.status === "Activa" ? "⏸️ Pausar Campaña" : "▶️ Reactivar Campaña"}
                   </button>
                )}
                <button onClick={() => eliminarPromo(promoSeleccionada.id)} className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors">
                   🗑️ Eliminar Campaña
                </button>
             </div>
          </div>
       )}

       {/* MODAL CREACIÓN DE CAMPAÑA */}
       {modalCrear && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
                <div className="p-6 bg-blue-600 text-white text-center flex-shrink-0">
                   <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Megaphone className="w-7 h-7"/>
                   </div>
                   <h3 className="text-xl font-black">Nueva Campaña Comercial</h3>
                   <p className="text-blue-100 text-sm font-medium mt-1">Define las reglas automáticas del motor de precios.</p>
                </div>
                
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nombre de la Campaña *</label>
                      <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Ej. Summer Sale 2026" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Descripción</label>
                      <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"/>
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Motor Lógico *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                         {Object.entries(PROMO_TYPES).map(([key, val]) => (
                            <button key={key} onClick={() => setForm({...form, type: key as PromoType})}
                               className={`p-3 rounded-xl text-center text-xs font-bold border transition-all
                                  ${form.type === key ? `${val.color} ring-2 ring-offset-1 ring-blue-400` : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}>
                               <span className="text-lg block mb-1">{val.icon}</span>
                               {val.label}
                            </button>
                         ))}
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Valor *</label>
                         <input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} placeholder={form.type === 'descuento_porcentaje' ? '% Ej: 30' : '$ Ej: 15000'} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Aplica a</label>
                         <input type="text" value={form.target} onChange={e => setForm({...form, target: e.target.value})} placeholder="Categoría o SKU" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Fecha Inicio *</label>
                         <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Fecha Fin *</label>
                         <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Compra Mínima ($)</label>
                         <input type="number" value={form.minCompra} onChange={e => setForm({...form, minCompra: e.target.value})} placeholder="0 = sin mínimo" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Límite de Usos</label>
                         <input type="number" value={form.maxUsos} onChange={e => setForm({...form, maxUsos: e.target.value})} placeholder="∞ = ilimitado" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                      </div>
                   </div>
                   <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input type="checkbox" checked={form.acumulable} onChange={e => setForm({...form, acumulable: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"/>
                      <div>
                         <p className="text-xs font-bold text-slate-700">Acumulable con otras promos</p>
                         <p className="text-[10px] text-slate-400">Permite combinar con otras campañas activas</p>
                      </div>
                   </label>
                </div>

                <div className="p-5 border-t border-slate-100 flex gap-3 flex-shrink-0">
                   <button onClick={() => setModalCrear(false)} className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
                   <button onClick={handleCrearPromo} className="flex-[2] py-3 font-black text-white bg-slate-900 hover:bg-black rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"><CheckCircle className="w-5 h-5"/> Lanzar Campaña</button>
                </div>
             </div>
          </div>
       )}

       {/* TOAST */}
       {toast && (
          <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-[100] animate-in slide-in-from-bottom-8">
             <CheckCircle className="w-6 h-6 text-emerald-400" />
             {toast}
          </div>
       )}
    </div>
  )
}

export default function Fidelizacion({ subMenu }: FidelizacionProps) {
  const activeTab = subMenu || "Gift Cards"
  const renderModule = () => {
    switch (activeTab) {
      case "Gift Cards": return <GiftCardsManager />
      case "Puntos": return <PuntosManager />
      case "Promociones": return <PromocionesManager />
      default: return <GiftCardsManager />
    }
  }

  return (
    <div className="bg-slate-50 w-full h-[calc(100vh-120px)] overflow-hidden p-2 sm:p-6 rounded-tl-2xl shadow-inner border-l border-slate-200">
       <div className="w-full h-full max-w-7xl mx-auto">
          {renderModule()}
       </div>
    </div>
  )
}
