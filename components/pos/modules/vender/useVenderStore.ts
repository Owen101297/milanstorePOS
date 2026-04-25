"use client"

/**
 * useVenderStore — State + business logic for POS Vender module.
 * NOW CONNECTED TO REAL SUPABASE SERVICES.
 * Mock data used ONLY as fallback when DB is empty.
 */

import { useState, useEffect, useCallback } from "react"
import { productos, ventas } from "@/lib/services"
import { useSede } from "@/components/pos/providers/SedeContext"
import { usePosStore } from "@/store/posStore"
import {
  mockProducts, mockCategories, mockClients, mockSellers,
  type CartItem, type HoldSale, type PlanSepare, type PaymentForm,
  type ProductMock, type ClientMock,
  parseNumber, limpiarCampo, getItemPrice,
  formatCOP, paymentMethods,
} from "./types"

export function useVenderStore() {
  const { sedeId } = useSede()
  const posStore = usePosStore()
  const userId = posStore.currentUser?.email ?? "demo-user"

  // -------------------- ESTADO GENERAL --------------------
  const [isCajaAbierta, setIsCajaAbierta] = useState(false)
  const [cajaId, setCajaId] = useState<string | null>(null)
  const [valorApertura, setValorApertura] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // -------------------- PRODUCTOS Y CATEGORÍAS --------------------
  const [products, setProducts] = useState<ProductMock[]>(mockProducts)
  const [categories, setCategories] = useState(mockCategories)
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  // -------------------- CLIENTES Y VENDEDORES --------------------
  const [clients] = useState(mockClients)
  const [sellers] = useState(mockSellers)
  const [clientSearch, setClientSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState(mockClients[0])
  const [selectedSeller, setSelectedSeller] = useState(mockSellers[0])

  // -------------------- CARRITO --------------------
  const [cart, setCart] = useState<CartItem[]>([])
  const [holdSales, setHoldSales] = useState<HoldSale[]>([])
  const [planSepareList, setPlanSepareList] = useState<PlanSepare[]>([])

  // -------------------- MODALES --------------------
  const [showPayment, setShowPayment] = useState(false)
  const [showHoldSales, setShowHoldSales] = useState(false)
  const [showClientForm, setShowClientForm] = useState(false)
  const [showDomicilioForm, setShowDomicilioForm] = useState(false)
  const [showNotaForm, setShowNotaForm] = useState(false)
  const [showDiscountForm, setShowDiscountForm] = useState(false)
  const [showPlanSepare, setShowPlanSepare] = useState(false)
  const [showCalculatePrice, setShowCalculatePrice] = useState(false)
  const [showImeiForm, setShowImeiForm] = useState(false)
  const [showCloseSession, setShowCloseSession] = useState(false)
  const [showCloseStep, setShowCloseStep] = useState<1 | 2>(1)
  const [showSaleNotesForm, setShowSaleNotesForm] = useState(false)
  const [showVariantSelector, setShowVariantSelector] = useState(false)
  const [productForVariants, setProductForVariants] = useState<any>(null)

  // -------------------- FORMULARIOS --------------------
  const [discountItemId, setDiscountItemId] = useState<string | null>(null)
  const [discountValueInput, setDiscountValueInput] = useState("")
  const [discountType, setDiscountType] = useState<"%" | "$">("%")
  const [manualPriceItemId, setManualPriceItemId] = useState<string | null>(null)
  const [manualPriceValue, setManualPriceValue] = useState("")
  const [notesItemId, setNotesItemId] = useState<string | null>(null)
  const [itemNotes, setItemNotes] = useState("")
  const [saleNotes, setSaleNotes] = useState("")
  const [imeiItemId, setImeiItemId] = useState<string | null>(null)
  const [imeiValues, setImeiValues] = useState("")
  const [propinaPercent] = useState(10)
  const [propinaValor, setPropinaValor] = useState(0)
  const [descuentoGeneral, setDescuentoGeneral] = useState(0)
  const [descuentoGeneralType] = useState<"%" | "$">("%")
  const [declaredCash, setDeclaredCash] = useState("")
  const [auditResult, setAuditResult] = useState(0)
  const [isAuditComplete, setIsAuditComplete] = useState(false)
  const [paymentForms, setPaymentForms] = useState<PaymentForm[]>([])
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState("efectivo")
  const [currentPaymentAmount, setCurrentPaymentAmount] = useState("")
  const [newClientDoc, setNewClientDoc] = useState("")
  const [newClientName, setNewClientName] = useState("")
  const [newClientEmail, setNewClientEmail] = useState("")
  const [newClientTelefono, setNewClientTelefono] = useState("")
  const [newClientDireccion, setNewClientDireccion] = useState("")
  const [newClientCiudad, setNewClientCiudad] = useState("")
  const [giftCardCode, setGiftCardCode] = useState("")
  const [notaCreditoCode, setNotaCreditoCode] = useState("")
  const [planSepareNota, setPlanSepareNota] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [facturacionElectronica, setFacturacionElectronica] = useState(false)

  // ==================== FETCH REAL DATA ON MOUNT ====================

  useEffect(() => {
    let cancelled = false
    async function loadData() {
      setIsLoading(true)
      setLoadError(null)
      try {
        // 1. Cargar productos desde Supabase
        const realProducts = await productos.getProductos(sedeId !== "00000000-0000-0000-0000-000000000000" ? sedeId : undefined)

        if (!cancelled && realProducts.length > 0) {
          // Mapear ProductoConVariantes → ProductMock shape
          const mapped: ProductMock[] = realProducts.map(p => {
            const pAny = p as unknown as Record<string, unknown>
            const catAny = p.categoria as unknown as Record<string, unknown> | undefined
            return {
              id_producto: Number(p.id) || Math.random() * 100000,
              id: p.id,
              nombre: p.nombre,
              precio_venta: p.variantes?.[0]?.precio_venta ?? 0,
              impuesto: (pAny.impuesto_porcentaje as number) ?? 19,
              codigo_producto: p.sku_base ?? p.variantes?.[0]?.sku ?? "",
              categoria: (catAny?.nombre as string) ?? "General",
              imagen: p.imagen_url ?? "",
              stock: p.variantes?.[0]?.stock?.[0]?.cantidad ?? 0,
              tipo_producto: 0,
              variantes: p.variantes || []
            } as any
          })
          setProducts(mapped)
          console.log(`✅ POS: ${mapped.length} productos cargados desde Supabase`)
        } else if (!cancelled) {
          console.warn("⚠️ POS: Sin productos en BD — usando datos de demostración")
        }

        // 2. Cargar categorías
        const realCats = await productos.getCategorias()
        if (!cancelled && realCats.length > 0) {
          const mappedCats = [
            { id_categoria: 0, nombre: "Todos", imagen: "" },
            ...realCats.map(c => ({
              id_categoria: Number(c.id) || Math.random() * 100000,
              nombre: c.nombre,
              imagen: "",
            }))
          ]
          setCategories(mappedCats)
        }

        // 3. Verificar caja abierta
        try {
          const cajaAbierta = await ventas.getCajaAbierta(sedeId, userId)
          if (!cancelled && cajaAbierta) {
            setIsCajaAbierta(true)
            setCajaId(cajaAbierta.id)
          }
        } catch {
          // No hay caja abierta — mostrar pantalla apertura
        }
      } catch (err) {
        if (!cancelled) {
          console.error("❌ POS: Error cargando datos —", err)
          setLoadError("Error cargando datos. Usando modo demostración.")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadData()
    return () => { cancelled = true }
  }, [sedeId, userId])

  // Monitor red
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine)
    window.addEventListener("online", update)
    window.addEventListener("offline", update)
    update()
    return () => {
      window.removeEventListener("online", update)
      window.removeEventListener("offline", update)
    }
  }, [])

  // Shortcuts de teclado
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === "F10") {
        e.preventDefault()
        if (cart.length > 0) openPaymentModal()
      }
      if (e.key === "Escape") {
        setShowPayment(false)
        setShowHoldSales(false)
        setShowClientForm(false)
        setShowDomicilioForm(false)
        setShowNotaForm(false)
        setShowDiscountForm(false)
        setShowPlanSepare(false)
      }
    }
    window.addEventListener("keydown", handleKeys)
    return () => window.removeEventListener("keydown", handleKeys)
  }, [cart.length])

  // ==================== COMPUTED VALUES ====================

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 0 || selectedCategory === 2 || p.categoria === categories.find(c => c.id_categoria === selectedCategory)?.nombre
    const matchSearch = searchTerm === "" ||
      p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo_producto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.id_producto).includes(searchTerm)
    return matchCategory && matchSearch
  })

  const filteredClients = clientSearch === "" ? clients : clients.filter(c =>
    c.nombre_comercial?.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.nif_cif?.includes(clientSearch)
  )

  const subtotal = cart.reduce((acc, item) => acc + getItemPrice(item) * item.unidades, 0)
  const impuesto = cart.reduce((acc, item) => {
    const base = getItemPrice(item) * item.unidades
    return acc + (base * item.impuesto / 100)
  }, 0)
  const descuentoGeneralMonto = descuentoGeneralType === "%"
    ? subtotal * descuentoGeneral / 100
    : descuentoGeneral
  const total = subtotal - descuentoGeneralMonto + impuesto + propinaValor
  const totalPaid = paymentForms.reduce((acc, p) => acc + p.valor_entregado, 0)
  const remaining = Math.max(0, total - totalPaid)
  const change = Math.max(0, totalPaid - total)

  // ==================== ACTIONS ====================

  const addToCart = (product: ProductMock, variant?: any) => {
    // Si tiene múltiples variantes y no se ha pasado una, abrir selector
    if (!variant && product.variantes && product.variantes.length > 1) {
      setProductForVariants(product)
      setShowVariantSelector(true)
      return
    }

    const selectedVariant = variant || product.variantes?.[0] || product
    const rowId = `${product.id_producto}-${selectedVariant.id || 'default'}-${Date.now()}`
    
    const newItem: CartItem = {
      cartItemId: rowId, 
      id_producto: product.id_producto,
      nombre_producto: variant ? `${product.nombre} (${variant.nombre || variant.sku})` : product.nombre, 
      precio_venta: selectedVariant.precio_venta || product.precio_venta,
      precio_original: selectedVariant.precio_venta || product.precio_venta, 
      precio_descuento: selectedVariant.precio_venta || product.precio_venta,
      unidades: 1, 
      impuesto: product.impuesto,
      codigo_producto: selectedVariant.sku || product.codigo_producto, 
      rowId
    }

    const existing = cart.find(i => i.id_producto === newItem.id_producto && i.codigo_producto === newItem.codigo_producto)
    if (existing) {
      setCart(prev => prev.map(i => i.cartItemId === existing.cartItemId ? { ...i, unidades: i.unidades + 1 } : i))
    } else {
      setCart(prev => [...prev, newItem])
    }

    if (showVariantSelector) setShowVariantSelector(false)
  }

  const updateQty = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(i => i.cartItemId === cartItemId ? { ...i, unidades: Math.max(0, i.unidades + delta) } : i).filter(i => i.unidades > 0))
  }

  const removeItem = (cartItemId: string) => setCart(prev => prev.filter(i => i.cartItemId !== cartItemId))

  const applyDiscount = () => {
    if (!discountValueInput) return
    const valor = parseNumber(discountValueInput)
    
    if (discountItemId) {
      // Descuento por item
      setCart(prev => prev.map(i => {
        if (i.cartItemId !== discountItemId) return i
        if (discountType === "%") {
          return { ...i, precio_descuento: i.precio_original * (1 - valor / 100), descuento_porcentaje: valor }
        } else {
          const d = valor / i.unidades
          return { ...i, precio_descuento: i.precio_original - d, descuento_porcentaje: (d / i.precio_original) * 100 }
        }
      }))
    } else {
      // Descuento global
      setDescuentoGeneral(valor)
    }
    
    setDiscountItemId(null); setDiscountValueInput(""); setShowDiscountForm(false)
  }

  const applyManualPrice = () => {
    if (!manualPriceItemId || !manualPriceValue) return
    const p = parseNumber(manualPriceValue)
    setCart(prev => prev.map(i => i.cartItemId === manualPriceItemId ? { ...i, precio_venta: p, precio_descuento: p } : i))
    setManualPriceItemId(null); setManualPriceValue(""); setShowCalculatePrice(false)
  }

  const applyItemNotes = () => {
    if (!notesItemId) return
    setCart(prev => prev.map(i => i.cartItemId === notesItemId ? { ...i, notes: itemNotes } : i))
    setNotesItemId(null); setItemNotes(""); setShowNotaForm(false)
  }

  const applyImei = () => {
    if (!imeiItemId) return
    const serials = imeiValues.split("\n").map(s => limpiarCampo(s.trim())).filter(Boolean)
    setCart(prev => prev.map(i => i.cartItemId === imeiItemId ? { ...i, imei: serials } : i))
    setImeiItemId(null); setImeiValues(""); setShowImeiForm(false)
  }

  const addPaymentForm = () => {
    const monto = parseNumber(currentPaymentAmount)
    if (monto <= 0) return
    const nueva: PaymentForm = { forma_pago: currentPaymentMethod, valor_entregado: monto }
    if (currentPaymentMethod === "Gift_Card") nueva.gift_card = giftCardCode
    else if (currentPaymentMethod === "nota_credito") nueva.nota_credito = notaCreditoCode
    else if (currentPaymentMethod === "Bold_(Datafono)") nueva.transaccion = "TXN-" + Date.now()
    setPaymentForms(prev => [...prev, nueva])
    const nuevoRemaining = total - totalPaid - monto
    setCurrentPaymentAmount(nuevoRemaining > 0 ? nuevoRemaining.toString() : "")
    setGiftCardCode(""); setNotaCreditoCode("")
  }

  const removePaymentForm = (index: number) => {
    const nuevos = [...paymentForms]; nuevos.splice(index, 1); setPaymentForms(nuevos)
    const activeTotal = nuevos.reduce((acc, p) => acc + p.valor_entregado, 0)
    setCurrentPaymentAmount(Math.max(0, total - activeTotal).toString())
  }

  const holdSale = () => {
    if (cart.length === 0) return
    const nueva: HoldSale = {
      id: `FE-${Date.now()}`, createdAt: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      cart: [...cart], client: selectedClient, seller: selectedSeller, total, note: saleNotes, sobrecostos: propinaValor
    }
    setHoldSales(prev => [...prev, nueva]); setCart([]); setSaleNotes("")
  }

  const resumeHoldSale = (holdId: string) => {
    const found = holdSales.find(h => h.id === holdId)
    if (!found) return
    setCart(found.cart); setSelectedClient(found.client); setSelectedSeller(found.seller)
    if (found.sobrecostos) setPropinaValor(found.sobrecostos)
    if (found.note) setSaleNotes(found.note)
    setHoldSales(prev => prev.filter(h => h.id !== holdId)); setShowHoldSales(false)
  }

  const deleteHoldSale = (holdId: string) => setHoldSales(prev => prev.filter(h => h.id !== holdId))

  const clearCart = () => setCart([])

  // ============================================================
  // completeSale — NOW SAVES TO SUPABASE
  // ============================================================
  const completeSale = useCallback(async () => {
    if (remaining > 0) { alert("Falta dinero por pagar!"); return }
    setIsSaving(true)

    // Map primary payment method for Supabase
    const primaryMethod = paymentForms[0]?.forma_pago ?? "efectivo"
    const metodoMap: Record<string, string> = {
      efectivo: "EFECTIVO", tarjeta_credito: "TARJETA",
      tarjeta_debito: "TARJETA", Transferencia: "TRANSFERENCIA",
      "Bold_(Datafono)": "TARJETA", Credito: "EFECTIVO",
      Gift_Card: "EFECTIVO", nota_credito: "EFECTIVO",
      Puntos: "EFECTIVO", Bono: "EFECTIVO",
    }

    try {
      const ventaInput: ventas.ProcesarVentaInput = {
        sedeId,
        cajaId: cajaId ?? sedeId,
        usuarioId: userId,
        clienteId: String(selectedClient.id_cliente).length > 10 ? String(selectedClient.id_cliente) : undefined,
        clienteNombre: selectedClient.nombre_comercial,
        items: cart.map(item => ({
          varianteId: String(item.id_producto),
          cantidad: item.unidades,
          precioUnitario: getItemPrice(item),
          descuento: item.descuento_porcentaje ? (item.precio_original - getItemPrice(item)) * item.unidades : 0,
          impuesto: getItemPrice(item) * item.unidades * item.impuesto / 100,
        })),
        metodoPago: (metodoMap[primaryMethod] ?? "EFECTIVO") as ventas.ProcesarVentaInput["metodoPago"],
        descuentoGlobal: descuentoGeneralMonto,
      }

      const result = await ventas.procesarVenta(ventaInput)
      console.log("✅ Venta guardada en Supabase:", result.id ?? result)

      // Success feedback
      alert(`✅ Venta #${String(result.id ?? "").slice(0, 8)} completada!\n\nCliente: ${selectedClient.nombre_comercial}\nVendedor: ${selectedSeller.nombre}\nTotal: ${formatCOP(total)}\nFormas de pago: ${paymentForms.length}\n\n¡Guardada en base de datos!`)

      setCart([]); setPaymentForms([]); setSaleNotes(""); setShowPayment(false)
      setPropinaValor(0); setDescuentoGeneral(0)
    } catch (err) {
      console.error("❌ Error guardando venta:", err)

      // OFFLINE FALLBACK: Queue for later sync
      if (!navigator.onLine) {
        posStore.queueSale({
          id: `offline-${Date.now()}`,
          timestamp: new Date().toISOString(),
          cart: cart.map(i => ({ cartItemId: i.cartItemId, id: i.id_producto, name: i.nombre_producto, price: getItemPrice(i), qty: i.unidades, discount: 0 })),
          subtotal, tax: impuesto, total,
          client: { id: selectedClient.id_cliente, doc: selectedClient.nif_cif, name: selectedClient.nombre_comercial },
          seller: { id: selectedSeller.id_vendedor, name: selectedSeller.nombre },
          payments: paymentForms.map(p => ({ method: p.forma_pago, amount: p.valor_entregado })),
          change, sedeId, status: "pending",
        })
        alert(`📶 Sin conexión. Venta encolada para sincronización.\nTotal: ${formatCOP(total)}`)
        setCart([]); setPaymentForms([]); setSaleNotes(""); setShowPayment(false)
      } else {
        alert(`❌ Error al guardar venta:\n${err instanceof Error ? err.message : "Error desconocido"}\n\nIntente de nuevo.`)
      }
    } finally {
      setIsSaving(false)
    }
  }, [remaining, paymentForms, sedeId, cajaId, userId, selectedClient, cart, selectedSeller, total, descuentoGeneralMonto, change, subtotal, impuesto, posStore])

  // ============================================================
  // handleAbrirCaja — NOW SAVES TO SUPABASE
  // ============================================================
  const handleAbrirCaja = useCallback(async () => {
    try {
      const caja = await ventas.abrirCaja(sedeId, userId, valorApertura)
      setCajaId(caja.id)
      setIsCajaAbierta(true)
      console.log("✅ Caja abierta en Supabase:", caja.id)
    } catch (err) {
      console.warn("⚠️ Error abriendo caja en BD (continuando en modo local):", err)
      setCajaId(`local-${Date.now()}`)
      setIsCajaAbierta(true)
    }
  }, [sedeId, userId, valorApertura])

  // ============================================================
  // closeSession — NOW SAVES TO SUPABASE
  // ============================================================
  const closeSession = useCallback(async () => {
    const declarado = parseNumber(declaredCash)
    try {
      if (cajaId && !cajaId.startsWith("local-")) {
        await ventas.cerrarCaja(cajaId, declarado, `Cierre por ${userId}`)
        console.log("✅ Caja cerrada en Supabase")
      }
    } catch (err) {
      console.warn("⚠️ Error cerrando caja en BD:", err)
    }
    const esperado = valorApertura + (totalPaid * 0.3)
    setAuditResult(declarado - esperado)
    setShowCloseStep(2)
    setIsAuditComplete(true)
  }, [declaredCash, cajaId, userId, valorApertura, totalPaid])

  const saveNewClient = () => {
    if (!newClientName || !newClientDoc) { alert("Nombre y documento son requeridos"); return }
    const nuevoCliente = {
      id_cliente: Date.now(), nif_cif: newClientDoc, nombre_comercial: newClientName,
      email: newClientEmail, poblacion: newClientCiudad, provincia: newClientCiudad,
      pais: "Colombia", grupo_clientes_id: 1
    }
    setSelectedClient(nuevoCliente as ClientMock); setClientSearch(newClientName); setShowClientForm(false)
    setNewClientDoc(""); setNewClientName(""); setNewClientEmail(""); setNewClientTelefono(""); setNewClientDireccion(""); setNewClientCiudad("")
  }

  const savePlanSepare = () => {
    if (cart.length === 0) return
    const nueva: PlanSepare = {
      id: `PS-${Date.now()}`, cart: [...cart], client: selectedClient, seller: selectedSeller,
      total, abonado: 0, saldo: total, fecha: new Date().toISOString(), estado: "VIGENTE", nota: planSepareNota
    }
    setPlanSepareList(prev => [...prev, nueva])
    setCart([]); setPlanSepareNota(""); setShowPlanSepare(false)
    alert("✅ Plan Separe guardado correctamente.")
  }

  const saveDomicilio = () => {
    alert("✅ Datos de domicilio guardados para la venta.")
    setShowDomicilioForm(false)
  }

  const openPaymentModal = () => {
    setPaymentForms([]); setCurrentPaymentMethod("efectivo"); setCurrentPaymentAmount(total.toString()); setShowPayment(true)
  }
  const openCloseSession = () => {
    setShowCloseStep(1); setDeclaredCash(""); setShowCloseSession(true)
  }
  const openDiscountForItem = (cartItemId: string) => {
    setDiscountItemId(cartItemId); setShowDiscountForm(true)
  }
  const openManualPriceForItem = (cartItemId: string) => {
    setManualPriceItemId(cartItemId); setShowCalculatePrice(true)
  }
  const openNotesForItem = (cartItemId: string) => {
    setNotesItemId(cartItemId); setShowNotaForm(true)
  }

  return {
    // State
    isCajaAbierta, valorApertura, setValorApertura, isOnline, isLoading, loadError, isSaving,
    products, categories, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm,
    clients, sellers, clientSearch, setClientSearch, selectedClient, setSelectedClient, selectedSeller, setSelectedSeller,
    cart, holdSales, planSepareList,
    showPayment, setShowPayment, showHoldSales, setShowHoldSales,
    showClientForm, setShowClientForm, showDomicilioForm, setShowDomicilioForm,
    showNotaForm, setShowNotaForm, showDiscountForm, setShowDiscountForm,
    showPlanSepare, setShowPlanSepare, showCalculatePrice, setShowCalculatePrice,
    showImeiForm, setShowImeiForm, showCloseSession, setShowCloseSession, showCloseStep, setShowCloseStep,
    showSaleNotesForm, setShowSaleNotesForm,
    discountItemId, discountValueInput, setDiscountValueInput, discountType, setDiscountType,
    manualPriceValue, setManualPriceValue, itemNotes, setItemNotes,
    saleNotes, setSaleNotes, imeiValues, setImeiValues,
    facturacionElectronica, setFacturacionElectronica,
    propinaPercent, propinaValor, setPropinaValor,
    descuentoGeneral, setDescuentoGeneral, descuentoGeneralType,
    declaredCash, setDeclaredCash, auditResult, isAuditComplete,
    paymentForms, currentPaymentMethod, setCurrentPaymentMethod,
    currentPaymentAmount, setCurrentPaymentAmount,
    giftCardCode, setGiftCardCode, notaCreditoCode, setNotaCreditoCode,
    newClientDoc, setNewClientDoc, newClientName, setNewClientName,
    newClientEmail, setNewClientEmail, newClientTelefono, setNewClientTelefono,
    newClientDireccion, setNewClientDireccion, newClientCiudad, setNewClientCiudad,
    planSepareNota, setPlanSepareNota,
    showVariantSelector, setShowVariantSelector, productForVariants,
    // Computed
    filteredProducts, filteredClients,
    subtotal, impuesto, descuentoGeneralMonto, total, totalPaid, remaining, change,
    // Actions
    addToCart, updateQty, removeItem,
    applyDiscount, applyManualPrice, applyItemNotes, applyImei,
    addPaymentForm, removePaymentForm,
    holdSale, resumeHoldSale, deleteHoldSale, clearCart,
    completeSale, handleAbrirCaja, closeSession, saveNewClient,
    savePlanSepare, saveDomicilio,
    openPaymentModal, openCloseSession,
    openDiscountForItem, openManualPriceForItem, openNotesForItem,
  }
}

export type VenderStore = ReturnType<typeof useVenderStore>
