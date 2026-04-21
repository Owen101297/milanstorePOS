"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Plus, Minus, Trash2, ShoppingCart, User, Tag, Percent, ChevronDown, Receipt, UserPlus, UserCheck, PauseCircle, Clock, Lock, Calculator, CheckCircle, AlertTriangle, Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import { TicketImpreso } from "../TicketImpreso"

const sampleProducts = [
  { id: 1, name: "Camiseta Básica Algodón", price: 35000, category: "Camisetas", sku: "CAM-BAS-001", sizes: ["S", "M", "L", "XL"], colors: ["Blanco", "Negro", "Gris"] },
  { id: 2, name: "Jean Clásico Slim", price: 95000, category: "Pantalones", sku: "JEA-SLI-001", sizes: ["28", "30", "32", "34", "36"], colors: ["Azul Oscuro", "Azul Claro", "Negro"] },
  { id: 3, name: "Chaqueta Cuero Sintético", price: 150000, category: "Chaquetas", sku: "CHA-CUE-001", sizes: ["M", "L", "XL"], colors: ["Negro", "Café"] },
  { id: 4, name: "Vestido Casual Verano", price: 75000, category: "Vestidos", sku: "VES-VER-001", sizes: ["S", "M", "L"], colors: ["Rojo", "Mostaza Floral"] },
  { id: 5, name: "Blusa Elegante Seda", price: 65000, category: "Blusas", sku: "BLU-ELE-001", sizes: ["S", "M", "L"], colors: ["Blanco", "Beige"] },
  { id: 6, name: "Short Deportivo Malla", price: 40000, category: "Pantalones", sku: "SHO-DEP-001", sizes: ["S", "M", "L"], colors: ["Negro", "Azul Marino"] },
  { id: 7, name: "Buzo Oversize", price: 85000, category: "Hoodies", sku: "BUZ-OVE-001", sizes: ["M", "L", "XL"], colors: ["Gris", "Verde Oscuro"] },
  { id: 8, name: "Falda Plisada", price: 55000, category: "Faldas", sku: "FAL-PLI-001", sizes: ["S", "M"], colors: ["Negro", "Rosado"] },
  { id: 9, name: "Gorra Urbana", price: 25000, category: "Accesorios", sku: "ACC-GOR-001", sizes: ["Única"], colors: ["Negro", "Blanco"] },
  { id: 10, name: "Cinturón Cuero", price: 35000, category: "Accesorios", sku: "ACC-CIN-001", sizes: ["S/M", "L/XL"], colors: ["Café", "Negro"] },
  { id: 11, name: "Top Deportivo", price: 30000, category: "Blusas", sku: "TOP-DEP-001", sizes: ["S", "M", "L"], colors: ["Negro", "Lila"] },
  { id: 12, name: "Jogger Algodón", price: 65000, category: "Pantalones", sku: "JOG-ALG-001", sizes: ["S", "M", "L"], colors: ["Negro", "Gris Jaspe"] },
]

const categories = ["Todos", "Camisetas", "Pantalones", "Chaquetas", "Vestidos", "Blusas", "Faldas", "Hoodies", "Accesorios"]

const mockClients = [
  { id: 1, doc: "22222222", name: "Consumidor Final" },
  { id: 2, doc: "10101010", name: "María López" },
  { id: 3, doc: "20202020", name: "Juan Pérez" },
  { id: 4, doc: "30303030", name: "Andrea Gómez" },
]

const mockSellers = [
  { id: 1, name: "Sin Asesor (Venta Directa)" },
  { id: 2, name: "Sara Navarro" },
  { id: 3, name: "Carlos Bernal" },
  { id: 4, name: "Andrea Rivas" },
]

interface CartItem {
  cartItemId: string
  id: number
  name: string
  price: number
  qty: number
  discount: number
  size?: string
  color?: string
}

const formatCOP = (v: number) => "$ " + Math.round(v).toLocaleString("es-CO")

export default function Vender() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [cart, setCart] = useState<CartItem[]>([])
  const [clients, setClients] = useState(mockClients)
  const [clientSearch, setClientSearch] = useState(mockClients[0].name)
  const [selectedClient, setSelectedClient] = useState(mockClients[0])
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [newClient, setNewClient] = useState({ doc: "", name: "", email: "", phone: "" })

  const [selectedSeller, setSelectedSeller] = useState(mockSellers[0])

  const [showPayment, setShowPayment] = useState(false)
  const [splitPayments, setSplitPayments] = useState<{method: string, amount: number}[]>([])
  const [currentPayMethod, setCurrentPayMethod] = useState("Efectivo")
  const [currentPayAmount, setCurrentPayAmount] = useState("")

  // Estado para la Apertura/Cierre de Caja
  const [isCajaAbierta, setIsCajaAbierta] = useState(false)
  const [valorApertura, setValorApertura] = useState("")

  // Estado Modal Arqueo Ciego
  const [showCloseSessionModal, setShowCloseSessionModal] = useState(false)
  const [closeSessionStep, setCloseSessionStep] = useState<1|2>(1)
  const [declaredCash, setDeclaredCash] = useState("")
  const [auditDiff, setAuditDiff] = useState(0)

  interface HoldCart {
    id: string;
    createdAt: string;
    cart: CartItem[];
    client: typeof mockClients[0];
    seller: typeof mockSellers[0];
  }
  const [holdCarts, setHoldCarts] = useState<HoldCart[]>([])
  const [showHoldCartsModal, setShowHoldCartsModal] = useState(false)

  // Estado para el Modal de Variantes
  const [selectedProduct, setSelectedProduct] = useState<typeof sampleProducts[0] | null>(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  // PERSISTENCIA LOCAL (Recarga de página a prueba de fallos)
  useEffect(() => {
    const savedCart = localStorage.getItem("milan_cart")
    const savedHold = localStorage.getItem("milan_holdCarts")
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedHold) setHoldCarts(JSON.parse(savedHold))
  }, [])

  useEffect(() => {
    localStorage.setItem("milan_cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem("milan_holdCarts", JSON.stringify(holdCarts))
  }, [holdCarts])

  const filtered = sampleProducts.filter(p => {
    const matchCat = selectedCategory === "Todos" || p.category === selectedCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleProductClick = (product: typeof sampleProducts[0]) => {
    if (product.sizes || product.colors) {
      setSelectedProduct(product)
      setSelectedSize(product.sizes?.[0] || "")
      setSelectedColor(product.colors?.[0] || "")
    } else {
      addToCart(product)
    }
  }

  const addToCart = (product: typeof sampleProducts[0], size?: string, color?: string) => {
    const cartItemId = `${product.id}-${size || 'nosize'}-${color || 'nocolor'}`
    setCart(prev => {
      const existing = prev.find(i => i.cartItemId === cartItemId)
      if (existing) {
        return prev.map(i => i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, cartItemId, qty: 1, discount: 0, size, color }]
    })
    setSelectedProduct(null)
  }

  const updateQty = (cartItemId: string, delta: number) => {
    setCart(prev => {
      const updated = prev.map(i => i.cartItemId === cartItemId ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
      return updated.filter(i => i.qty > 0)
    })
  }

  const removeItem = (cartItemId: string) => setCart(prev => prev.filter(i => i.cartItemId !== cartItemId))

  const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty * (1 - i.discount / 100), 0)
  const tax = subtotal * 0.19
  const total = subtotal + tax

  const handlePayment = () => {
    setSplitPayments([])
    setCurrentPayMethod("Efectivo")
    setCurrentPayAmount(total.toString())
    setShowPayment(true)
  }

  // INITIALIZE TICKET PRINTING REFs
  const printRef = useRef<HTMLDivElement>(null)
  
  const handlePrintReceipt = useReactToPrint({
    content: () => printRef.current,
    pageStyle: "@page { size: auto; margin: 0mm; }",
    onAfterPrint: () => resetAfterSale()
  })

  // Safe fallback if print is cancelled or done
  const resetAfterSale = () => {
    alert("¡Venta registrada y comprobante emitido!\nTotal: " + formatCOP(total))
    setCart([])
    setShowPayment(false)
    setSplitPayments([])
  }

  const completePayment = () => {
    // Cuando el usuario confirma el cobro global, no limpiamos inmediatamente UI.
    // Disparamos mandato de impresión térmica física. El callback de impresion limpiará la caja.
    handlePrintReceipt()
  }

  const addSplitPayment = () => {
    const amt = Number(currentPayAmount)
    if (amt > 0) {
      setSplitPayments(prev => [...prev, { method: currentPayMethod, amount: amt }])
      const activeTotal = splitPayments.reduce((acc, p) => acc + p.amount, 0) + amt
      const newRemaining = total - activeTotal
      setCurrentPayAmount(newRemaining > 0 ? newRemaining.toString() : "")
    }
  }

  const removePayment = (index: number) => {
    const newSplits = [...splitPayments]
    newSplits.splice(index, 1)
    setSplitPayments(newSplits)
    const activeTotal = newSplits.reduce((acc, p) => acc + p.amount, 0)
    const newRemaining = total - activeTotal
    setCurrentPayAmount(newRemaining > 0 ? newRemaining.toString() : "")
  }

  const totalPaid = splitPayments.reduce((acc, p) => acc + p.amount, 0)
  const remaining = Math.max(0, total - totalPaid)
  const change = Math.max(0, totalPaid - total)

  const holdCurrentCart = () => {
    if (cart.length === 0) return
    const newHold: HoldCart = {
      id: Date.now().toString(),
      createdAt: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      cart: [...cart],
      client: selectedClient,
      seller: selectedSeller
    }
    setHoldCarts(prev => [...prev, newHold])
    setCart([])
    setSelectedClient(clients[0] || mockClients[0])
    setSelectedSeller(mockSellers[0])
    setClientSearch(clients[0]?.name || mockClients[0].name)
  }

  const resumeCart = (holdId: string) => {
    const found = holdCarts.find(h => h.id === holdId)
    if (!found) return
    if (cart.length > 0 && !window.confirm("Se reemplazará el carrito actual y se perderá su avance si no lo pausas. ¿Proceder?")) return
    
    setCart(found.cart)
    setSelectedClient(found.client)
    setSelectedSeller(found.seller)
    setClientSearch(found.client.name)
    setHoldCarts(prev => prev.filter(h => h.id !== holdId))
    setShowHoldCartsModal(false)
  }

  const handleAbrirCaja = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCajaAbierta(true)
  }

  if (!isCajaAbierta) {
    return (
      <div className="bg-[#f8f9fa] rounded-sm shadow-sm border border-gray-200 w-full min-h-[calc(100vh-100px)] p-6">
        <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-200">
          <div className="p-1.5 border border-gray-300 rounded-full bg-white">
            <Receipt className="w-6 h-6 text-gray-500" />
          </div>
          <h2 className="text-2xl font-light text-gray-700 tracking-wide">Apertura de Caja</h2>
        </div>
        
        <form onSubmit={handleAbrirCaja} className="max-w-2xl">
           <div className="space-y-6">
             <div className="flex items-center">
               <label className="w-48 text-sm text-gray-500 font-medium">Fecha:</label>
               <input 
                 type="text" 
                 readOnly 
                 value={new Date().toISOString().split('T')[0]} 
                 className="flex-1 max-w-sm bg-gray-100 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-600 focus:outline-none" 
               />
             </div>
             
             <div className="flex items-center">
               <label className="w-48 text-sm text-gray-500 font-medium">Almacén (Sede):</label>
               <select className="flex-1 max-w-sm border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] focus:outline-none bg-white transition-colors">
                  <option value="">Seleccione una sede...</option>
                  <option value="1">Sede Principal - Centro</option>
                  <option value="2">Sucursal Norte (Boutique)</option>
                  <option value="3">Bodega Outlet</option>
               </select>
             </div>

             <div className="flex items-center">
               <label className="w-48 text-sm text-gray-500 font-medium">Valor apertura:</label>
               <input 
                 type="number" 
                 required 
                 value={valorApertura} 
                 onChange={e => setValorApertura(e.target.value)} 
                 className="flex-1 max-w-sm border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] focus:outline-none bg-white transition-colors" 
               />
             </div>

             <div className="flex items-center">
               <label className="w-48 text-sm text-gray-500 font-medium">Total:</label>
               <input 
                 type="number" 
                 readOnly 
                 value={valorApertura || 0} 
                 className="flex-1 max-w-sm bg-gray-100 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-600 focus:outline-none" 
               />
             </div>
           </div>

           <div className="mt-8 ml-48">
             <button 
               type="submit" 
               className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 py-2 rounded text-sm transition-colors font-medium border border-[#3d8b40]"
             >
               Guardar
             </button>
           </div>
        </form>
      </div>
    )
  }

  return (
    <>
    <div style={{ display: 'none' }}>
       {/* INYECTOR THERMAL ESC/POS INVISIBLE */}
       <TicketImpreso 
          ref={printRef}
          cart={cart}
          total={total}
          clientName={selectedClient.name}
          sellerName={selectedSeller.name}
          paymentInfo={splitPayments.length > 0 ? splitPayments : [{ method: currentPayMethod, amount: total }]}
          vueltos={change}
       />
    </div>

    <div className="flex h-[calc(100vh-57px)] gap-4 overflow-hidden">
      {/* Products panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Search & filter & Close Box btn */}
        <div className="flex items-center gap-3 mb-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto por nombre o SKU..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4CAF50]"
            />
          </div>
          
          <div className="hidden md:flex items-center mr-2 gap-4 px-3 border-l border-gray-300">
             <div className="flex flex-col">
               <span className="text-[10px] uppercase text-gray-500 font-bold">Base Inicial Cajón</span>
               <span className="text-sm font-black text-gray-800">{formatCOP(Number(valorApertura || 0))}</span>
             </div>
             <div className="flex flex-col border-l border-gray-300 pl-4">
               <span className="text-[10px] uppercase text-gray-500 font-bold">Estado Sesión</span>
               <span className="text-xs font-bold text-green-600">• Abierta</span>
             </div>
          </div>

          <button 
             onClick={() => {
                setCloseSessionStep(1)
                setDeclaredCash("")
                setShowCloseSessionModal(true)
             }} 
             className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-black transition-colors text-sm font-bold shadow-sm"
          >
             <Lock className="w-4 h-4"/> Cerrar Turno
          </button>
        </div>
        
          <div className="flex gap-1.5 flex-wrap mb-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${selectedCategory === cat ? "bg-green-500 text-white" : "bg-white text-gray-600 border border-gray-300 hover:border-green-400"}`}
              >
                {cat}
              </button>
            ))}
          </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(product => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-white rounded-lg p-3 text-left shadow-sm border border-gray-100 hover:border-green-400 hover:shadow-md transition-all group"
              >
                <div className="w-full h-16 bg-gray-50 rounded-md mb-2 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                  <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-green-400 transition-colors" />
                </div>
                <p className="text-xs font-semibold text-gray-800 leading-tight mb-1 line-clamp-2">{product.name}</p>
                <p className="text-[10px] text-gray-400 mb-1">{product.sku}</p>
                <p className="text-sm font-bold text-green-600">{formatCOP(product.price)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart panel */}
      <div className="w-80 flex-shrink-0 flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Actions header (Hold / Resume) */}
        <div className="p-2 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Venta Actual</span>
          <div className="flex items-center gap-1">
            <button 
              onClick={holdCurrentCart} 
              disabled={cart.length === 0}
              className="px-2 py-1 bg-white border border-gray-200 text-[11px] font-medium text-gray-600 rounded hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors disabled:opacity-50"
              title="Pausar venta actual"
            >
              <PauseCircle className="w-3.5 h-3.5 inline mr-1" strokeWidth={2}/> Pausar
            </button>
            <button 
              onClick={() => setShowHoldCartsModal(true)} 
              className={`px-2 py-1 bg-white border border-gray-200 text-[11px] font-medium text-gray-600 rounded transition-colors ${holdCarts.length > 0 ? 'hover:bg-blue-50 hover:text-blue-600 border-blue-300 text-blue-600 bg-blue-50/50' : 'hover:bg-gray-100'}`}
            >
              <Clock className="w-3.5 h-3.5 inline mr-1" strokeWidth={2}/> En Espera {holdCarts.length > 0 ? `(${holdCarts.length})` : ''}
            </button>
          </div>
        </div>

        {/* Client & Seller */}
        <div className="p-3 border-b border-gray-100 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-[#4CAF50] focus-within:ring-1 focus-within:ring-[#4CAF50] transition-all">
              <User className="w-4 h-4 text-gray-500" />
              <input
                value={clientSearch}
                onChange={e => {
                  setClientSearch(e.target.value)
                  const term = e.target.value.toLowerCase()
                  const found = clients.find(c => c.doc.includes(term) || c.name.toLowerCase().includes(term))
                  if (found) setSelectedClient(found)
                }}
                className="flex-1 text-sm bg-transparent focus:outline-none text-gray-800"
                placeholder="Buscar DNI o Nombre..."
              />
            </div>
            <button 
              onClick={() => {
                setNewClient({ 
                  doc: /^[0-9]+$/.test(clientSearch) ? clientSearch : "", 
                  name: !/^[0-9]+$/.test(clientSearch) ? clientSearch : "",
                  email: "", phone: ""
                })
                setIsClientModalOpen(true)
              }}
              className="w-[38px] h-[38px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-600 transition-colors flex-shrink-0" 
              title="Nuevo Cliente"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-[#4CAF50] focus-within:ring-1 focus-within:ring-[#4CAF50] transition-all">
            <UserCheck className="w-4 h-4 text-gray-500" />
            <select
              value={selectedSeller.id}
              onChange={e => setSelectedSeller(mockSellers.find(s => s.id === Number(e.target.value)) || mockSellers[0])}
              className="flex-1 text-sm bg-transparent focus:outline-none text-gray-800 appearance-none cursor-pointer"
            >
              {mockSellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2">
              <ShoppingCart className="w-10 h-10" />
              <span className="text-sm">Carrito vacío</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartItemId} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <p className="text-xs font-semibold text-gray-800 leading-tight flex-1 mr-2">{item.name}</p>
                    {(item.size || item.color) && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {item.size ? `Talla: ${item.size}` : ''} {item.size && item.color ? '| ' : ''}{item.color ? `Color: ${item.color}` : ''}
                      </p>
                    )}
                  </div>
                  <button onClick={() => removeItem(item.cartItemId)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.cartItemId, -1)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.cartItemId, 1)}
                      className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {formatCOP(item.price * item.qty)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & payment */}
        <div className="p-3 border-t border-gray-100 space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Subtotal</span>
            <span>{formatCOP(subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>IVA (19%)</span>
            <span>{formatCOP(tax)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-800 border-t pt-2">
            <span>Total</span>
            <span className="text-green-600">{formatCOP(total)}</span>
          </div>

          <div className="relative">
            <button
              onClick={showPayment ? completePayment : handlePayment}
              disabled={cart.length === 0}
              className="w-full py-3 rounded-lg text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: cart.length > 0 ? "#4CAF50" : undefined, background: cart.length === 0 ? "#9ca3af" : "#4CAF50" }}
            >
              Cobrar {formatCOP(total)}
            </button>
          </div>
        </div>
      </div>

      {/* Payment overlay */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowPayment(false)}>
          <div className="bg-white rounded-xl p-6 w-[450px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pagos (Split Payment)</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-5 border border-gray-200">
              <div className="flex justify-between items-center mb-1"><span className="text-gray-500 text-sm">Cliente:</span><span className="font-semibold text-gray-800">{selectedClient.name}</span></div>
              <div className="flex justify-between items-center mb-1"><span className="text-gray-500 text-sm">Vendedor/Asesor:</span><span className="font-semibold text-gray-800">{selectedSeller.name}</span></div>
              <div className="w-full h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between items-center mb-0.5"><span className="text-gray-500 text-xs">Subtotal:</span><span className="text-gray-700 text-xs font-medium">{formatCOP(total / 1.19)}</span></div>
              <div className="flex justify-between items-center mb-2"><span className="text-gray-500 text-xs">IVA (19%):</span><span className="text-gray-700 text-xs font-medium">{formatCOP(total - (total / 1.19))}</span></div>
              <div className="flex justify-between items-center mb-1"><span className="text-gray-500 font-bold">Total a cobrar:</span><span className="text-xl font-black text-gray-900">{formatCOP(total)}</span></div>
              <div className="flex justify-between items-center mb-1"><span className="text-gray-500 text-sm">Abonado hasta ahora:</span><span className="font-semibold text-[#4CAF50]">{formatCOP(totalPaid)}</span></div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                <span className="text-gray-700 font-bold">Por Pagar:</span>
                <span className={`text-xl font-bold ${remaining > 0 ? 'text-red-500' : 'text-gray-400'}`}>{formatCOP(remaining)}</span>
              </div>
            </div>

            {/* Added Payments List */}
            {splitPayments.length > 0 && (
              <div className="mb-5 space-y-2 max-h-32 overflow-y-auto pr-1">
                {splitPayments.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-semibold">{p.method}</span>
                      <span className="font-bold text-gray-800">{formatCOP(p.amount)}</span>
                    </div>
                    <button onClick={() => removePayment(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Payment Input */}
            {remaining > 0 && (
              <div className="flex items-end gap-2 mb-6">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Método de Pago</label>
                  <select
                    value={currentPayMethod}
                    onChange={e => setCurrentPayMethod(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4CAF50]"
                  >
                    <option>Efectivo</option>
                    <option>Tarjeta C/D</option>
                    <option>Transferencia</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Monto a Abonar</label>
                  <input 
                    type="number" 
                    value={currentPayAmount}
                    onChange={e => setCurrentPayAmount(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addSplitPayment() }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4CAF50]" 
                  />
                </div>
                <button 
                  onClick={addSplitPayment}
                  disabled={!currentPayAmount || Number(currentPayAmount) <= 0}
                  className="h-[38px] px-4 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-semibold transition-colors disabled:bg-gray-300"
                >
                  Boton +
                </button>
              </div>
            )}

            {change > 0 && (
              <div className="mb-5 bg-green-50 p-3 rounded-lg border border-green-200 flex justify-between items-center text-green-800">
                <span className="font-medium text-sm">Cambio / Vueltos a entregar:</span>
                <span className="font-bold">{formatCOP(change)}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setShowPayment(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50">
                Atrás
              </button>
              <button 
                onClick={completePayment} 
                disabled={remaining > 0}
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-bold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                style={{ backgroundColor: remaining > 0 ? "#9ca3af" : "#4CAF50" }}
              >
                <Printer className="w-4 h-4"/> Confirmar e Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variant Selection Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-2">{selectedProduct.name}</h2>
            <p className="text-sm text-gray-500 mb-5 border-b pb-3">{formatCOP(selectedProduct.price)}</p>

            <div className="space-y-4 mb-6">
              {selectedProduct.sizes && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Talla</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSize === size ? 'bg-[#4CAF50] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedProduct.colors && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedColor === color ? 'bg-gray-800 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelectedProduct(null)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50">
                Cancelar
              </button>
              <button 
                onClick={() => addToCart(selectedProduct, selectedSize, selectedColor)} 
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-bold shadow-sm" 
                style={{ backgroundColor: "#4CAF50" }}
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Client Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center" onClick={() => setIsClientModalOpen(false)}>
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#4CAF50]" />
                Registrar Cliente
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Documento / NIT *</label>
                <input 
                  type="text" 
                  value={newClient.doc} 
                  onChange={e => setNewClient(p => ({ ...p, doc: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#4CAF50] focus:outline-none" 
                  placeholder="Ej. 10203040"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre Completo *</label>
                <input 
                  type="text" 
                  value={newClient.name} 
                  onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#4CAF50] focus:outline-none" 
                  placeholder="Ej. Consumidor Final"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Teléfono</label>
                  <input 
                    type="text" 
                    value={newClient.phone} 
                    onChange={e => setNewClient(p => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#4CAF50] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                  <input 
                    type="email" 
                    value={newClient.email} 
                    onChange={e => setNewClient(p => ({ ...p, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#4CAF50] focus:outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsClientModalOpen(false)} 
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if(!newClient.name || !newClient.doc) return alert("Nombre y Documento son obligatorios");
                  const clientToSave = { id: Date.now(), doc: newClient.doc, name: newClient.name };
                  setClients(prev => [...prev, clientToSave]);
                  setSelectedClient(clientToSave);
                  setClientSearch(clientToSave.name);
                  setIsClientModalOpen(false);
                }} 
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-bold shadow-sm hover:bg-[#45a049] transition-colors" 
                style={{ backgroundColor: "#4CAF50" }}
              >
                Guardar Cliente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hold Carts Modal (Ventas en Espera) */}
      {showHoldCartsModal && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center p-4" onClick={() => setShowHoldCartsModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
             <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
               <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                 <Clock className="w-5 h-5 text-blue-500" />
                 Ventas en Espera
               </h2>
               <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{holdCarts.length} guardadas</span>
             </div>
             
             <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
               {holdCarts.length === 0 ? (
                 <div className="text-center text-gray-400 py-10">No hay ventas pausadas actualmente.</div>
               ) : (
                 holdCarts.map(hc => (
                   <div key={hc.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors bg-white shadow-sm flex items-center justify-between">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-800">{hc.client.name}</span>
                          <span className="text-xs text-gray-500">• {hc.createdAt}</span>
                       </div>
                       <p className="text-xs text-gray-500">
                         {hc.cart.reduce((a,b)=>a+b.qty, 0)} prendas • Asesor: {hc.seller.name}
                       </p>
                       <p className="text-xs font-bold text-green-600 mt-1">
                         {formatCOP(hc.cart.reduce((acc, i) => acc + i.price * i.qty * (1 - i.discount/100), 0) * 1.19)}
                       </p>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => setHoldCarts(prev => prev.filter(i => i.id !== hc.id))} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Descartar">
                         <Trash2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => resumeCart(hc.id)} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
                         Reanudar
                       </button>
                     </div>
                   </div>
                 ))
               )}
             </div>
             
             <div className="p-4 border-t border-gray-200">
               <button onClick={() => setShowHoldCartsModal(false)} className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors">
                 Cerrar
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Close Caja Modal (Arqueo Ciego) */}
      {showCloseSessionModal && (
        <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
               <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                 <Lock className="w-5 h-5 text-gray-600" />
                 Arqueo Ciego de Caja
               </h2>
               {closeSessionStep === 1 && (
                 <button onClick={() => setShowCloseSessionModal(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-5 h-5"/></button>
               )}
            </div>

            {closeSessionStep === 1 && (
               <div className="p-8 text-center bg-white">
                  <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Declaración Física de Efectivo</h3>
                  <p className="text-sm text-gray-500 mb-6">Cuenta minuciosamente los billetes y monedas de tu gaveta física y digita el total exacto. No salgas de esta pantalla.</p>

                  <div className="relative max-w-xs mx-auto mb-6">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                    <input 
                      type="text" 
                      value={declaredCash}
                      onChange={(e) => {
                         const num = e.target.value.replace(/\D/g, '')
                         setDeclaredCash(num ? Number(num).toLocaleString('es-CO') : "")
                      }}
                      className="w-full text-center text-3xl font-black text-gray-800 border-2 border-gray-300 rounded-xl py-3 focus:outline-none focus:border-[#4CAF50]"
                      placeholder="0"
                    />
                  </div>
                  <button 
                     onClick={() => {
                        const amt = Number(declaredCash.replace(/\D/g, ''))
                        if(amt <= 0) return alert("Por favor ingresa un monto válido mayor a cero.")
                        // Mock Audit Backend Calculate (Base + Cash ventas)
                        const expected = 1200000; // Mock de sistema
                        setAuditDiff(amt - expected)
                        setCloseSessionStep(2)
                     }}
                     className="px-8 py-3 bg-[#4CAF50] hover:opacity-90 text-white font-bold rounded-lg transition-colors w-full max-w-xs"
                  >
                     Auditar e Imprimir (Reporte Z)
                  </button>
               </div>
            )}

            {closeSessionStep === 2 && (
               <div className="bg-white rounded-b-xl overflow-hidden">
                  {auditDiff === 0 ? (
                    <div className="bg-green-50 p-6 flex flex-col items-center border-b border-green-100">
                        <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                        <h3 className="text-lg font-black text-green-800">¡Cuadre Perfecto!</h3>
                        <p className="text-sm text-green-700">El efectivo físico es idéntico al sistema.</p>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-6 flex flex-col items-center border-b border-red-100">
                        <AlertTriangle className="w-12 h-12 text-red-500 mb-2" />
                        <h3 className="text-lg font-black text-red-800">Descuadre Detectado</h3>
                        <p className="text-sm text-red-700 font-bold mt-1">Diferencia: {formatCOP(auditDiff)}</p>
                        <p className="text-xs text-red-600 mt-2 text-center font-medium">Se ha restringido la gaveta y notificado al supervisor (Z-Report enviado a Supabase Storage).</p>
                    </div>
                  )}

                  <div className="p-6 pb-8">
                     <button onClick={() => {
                        setShowCloseSessionModal(false);
                        setIsCajaAbierta(false);
                     }} className="w-full py-3 bg-gray-800 hover:bg-black text-white font-bold text-sm rounded-lg shadow transition-colors flex items-center justify-center gap-2">
                        <Printer className="w-4 h-4"/> Confirmar y Bloquear Caja Fuerte
                     </button>
                  </div>
               </div>
            )}
          </div>
        </div>
      )}

    </div>
    </>
  )
}
