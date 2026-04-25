/**
 * Vender Module — Types & Constants
 * Extracted from the 1434-line monolith for maintainability.
 */

// ==================== DATOS DE REFERENCIA ====================

export const mockProducts = [
  { id_producto: 1, nombre: "Camiseta Básica Algodón", precio_venta: 35000, impuesto: 19, codigo_producto: "CAM-BAS-001", categoria: "Camisetas", imagen: "", stock: 100, tipo_producto: 0 },
  { id_producto: 2, nombre: "Jean Clásico Slim", precio_venta: 95000, impuesto: 19, codigo_producto: "JEA-SLI-001", categoria: "Pantalones", imagen: "", stock: 50 },
  { id_producto: 3, nombre: "Chaqueta Cuero Sintético", precio_venta: 150000, impuesto: 19, codigo_producto: "CHA-CUE-001", categoria: "Chaquetas", imagen: "", stock: 25 },
  { id_producto: 4, nombre: "Vestido Casual Verano", precio_venta: 75000, impuesto: 19, codigo_producto: "VES-VER-001", categoria: "Vestidos", imagen: "", stock: 30 },
  { id_producto: 5, nombre: "Blusa Elegante Seda", precio_venta: 65000, impuesto: 19, codigo_producto: "BLU-ELE-001", categoria: "Blusas", imagen: "", stock: 40 },
  { id_producto: 6, nombre: "Short Deportivo Malla", precio_venta: 40000, impuesto: 19, codigo_producto: "SHO-DEP-001", categoria: "Pantalones", imagen: "", stock: 60 },
  { id_producto: 7, nombre: "Buzo Oversize", precio_venta: 85000, impuesto: 19, codigo_producto: "BUZ-OVE-001", categoria: "Hoodies", imagen: "", stock: 35 },
  { id_producto: 8, nombre: "Falda Plisada", precio_venta: 55000, impuesto: 19, codigo_producto: "FAL-PLI-001", categoria: "Faldas", imagen: "", stock: 28 },
  { id_producto: 9, nombre: "Gorra Urbana", precio_venta: 25000, impuesto: 19, codigo_producto: "ACC-GOR-001", categoria: "Accesorios", imagen: "", stock: 80 },
  { id_producto: 10, nombre: "Cinturón Cuero", precio_venta: 35000, impuesto: 19, codigo_producto: "ACC-CIN-001", categoria: "Accesorios", imagen: "", stock: 45 },
  { id_producto: 11, nombre: "Top Deportivo", precio_venta: 30000, impuesto: 19, codigo_producto: "TOP-DEP-001", categoria: "Blusas", imagen: "", stock: 55 },
  { id_producto: 12, nombre: "Jogger Algodón", precio_venta: 65000, impuesto: 19, codigo_producto: "JOG-ALG-001", categoria: "Pantalones", imagen: "", stock: 38 },
  { id_producto: 13, nombre: "Conjunto Deportivo", precio_venta: 89000, impuesto: 19, codigo_producto: "CON-DEP-001", categoria: "Conjuntos", imagen: "", stock: 42 },
  { id_producto: 14, nombre: "Gift Card $50.000", precio_venta: 50000, impuesto: 0, codigo_producto: "GC-50000", categoria: "GiftCard", imagen: "", stock: 999, tipo_producto: 2 },
  { id_producto: 15, nombre: "Gift Card $100.000", precio_venta: 100000, impuesto: 0, codigo_producto: "GC-100000", categoria: "GiftCard", imagen: "", stock: 999, tipo_producto: 2 },
  { id_producto: 16, nombre: "Camiseta Manga Larga", precio_venta: 42000, impuesto: 19, codigo_producto: "CAM-ML-001", categoria: "Camisetas", imagen: "", stock: 65 },
  { id_producto: 17, nombre: "Polo Basic", precio_venta: 38000, impuesto: 19, codigo_producto: "POL-BAS-001", categoria: "Polo", imagen: "", stock: 70 },
  { id_producto: 18, nombre: "Camisa Manga Corta", precio_venta: 55000, impuesto: 19, codigo_producto: "CAM-MC-001", categoria: "Camisas", imagen: "", stock: 45 },
  { id_producto: 19, nombre: "Buzo Capa", precio_venta: 78000, impuesto: 19, codigo_producto: "BUZ-CAP-001", categoria: "Hoodies", imagen: "", stock: 32 },
  { id_producto: 20, nombre: "Pantalón dress", precio_venta: 98000, impuesto: 19, codigo_producto: "PAN-DRE-001", categoria: "Pantalones", imagen: "", stock: 28 },
  { id_producto: 21, nombre: "Bermuda Jean", precio_venta: 48000, impuesto: 19, codigo_producto: "BER-JEA-001", categoria: "Pantalones", imagen: "", stock: 52 },
  { id_producto: 22, nombre: "Sudadera Capucha", precio_venta: 72000, impuesto: 19, codigo_producto: "SUD-CAP-001", categoria: "Hoodies", imagen: "", stock: 40 },
  { id_producto: 23, nombre: "Chaleco Injecn", precio_venta: 55000, impuesto: 19, codigo_producto: "CHA-INJ-001", categoria: "Chaquetas", imagen: "", stock: 22 },
  { id_producto: 24, nombre: "Canguro", precio_venta: 48000, impuesto: 19, codigo_producto: "CAN-JEA-001", categoria: "Hoodies", imagen: "", stock: 38 },
  { id_producto: 25, nombre: "Medias Pack x3", precio_venta: 15000, impuesto: 19, codigo_producto: "MED-PK3-001", categoria: "Accesorios", imagen: "", stock: 150 },
  { id_producto: 26, nombre: "Boxer Pack x3", precio_venta: 25000, impuesto: 19, codigo_producto: "BOX-PK3-001", categoria: "Accesorios", imagen: "", stock: 80 },
]

export const mockCategories = [
  { id_categoria: 0, nombre: "Todos", imagen: "" },
  { id_categoria: 2, nombre: "General", imagen: "" },
  { id_categoria: 3, nombre: "Camisetas", imagen: "" },
  { id_categoria: 4, nombre: "Polo", imagen: "" },
  { id_categoria: 5, nombre: "Camisas", imagen: "" },
  { id_categoria: 6, nombre: "Camisa MC", imagen: "" },
  { id_categoria: 7, nombre: "Buzo", imagen: "" },
  { id_categoria: 8, nombre: "Pantalón", imagen: "" },
  { id_categoria: 9, nombre: "Bermuda", imagen: "" },
  { id_categoria: 10, nombre: "Chanclas", imagen: "" },
  { id_categoria: 11, nombre: "Gorra", imagen: "" },
  { id_categoria: 12, nombre: "Pantaloneta", imagen: "" },
  { id_categoria: 13, nombre: "Medias", imagen: "" },
  { id_categoria: 14, nombre: "Boxer", imagen: "" },
  { id_categoria: 15, nombre: "Conjunto Deportivo", imagen: "" },
  { id_categoria: 16, nombre: "GiftCard", imagen: "" },
  { id_categoria: 17, nombre: "Crop Top", imagen: "" },
  { id_categoria: 18, nombre: "Chaqueta", imagen: "" },
  { id_categoria: 19, nombre: "Bolso", imagen: "" },
  { id_categoria: 20, nombre: "Conjunto Algodón", imagen: "" },
  { id_categoria: 21, nombre: "Camiseta Dama", imagen: "" },
  { id_categoria: 22, nombre: "Vestido", imagen: "" },
  { id_categoria: 23, nombre: "Falda", imagen: "" },
  { id_categoria: 24, nombre: "Blusa", imagen: "" },
  { id_categoria: 25, nombre: "Hoodies", imagen: "" },
  { id_categoria: 26, nombre: "Chaleco", imagen: "" },
  { id_categoria: 27, nombre: "Canguro", imagen: "" },
  { id_categoria: 28, nombre: "Accesorios", imagen: "" },
  { id_categoria: 29, nombre: "Conjuntos", imagen: "" },
]

export const mockClients = [
  { id_cliente: 1, nif_cif: "22222222", nombre_comercial: "Consumidor Final", email: "", poblacion: "Bogotá", provincia: "Cundinamarca", pais: "Colombia", grupo_clientes_id: 1 },
  { id_cliente: 2, nif_cif: "10101010", nombre_comercial: "María López", email: "maria@email.com", poblacion: "Bogotá", provincia: "Cundinamarca", pais: "Colombia", grupo_clientes_id: 1 },
  { id_cliente: 3, nif_cif: "20202020", nombre_comercial: "Juan Pérez", email: "juan@email.com", poblacion: "Medellín", provincia: "Antioquia", pais: "Colombia", grupo_clientes_id: 1 },
  { id_cliente: 4, nif_cif: "30303030", nombre_comercial: "Andrea Gómez", email: "andrea@email.com", poblacion: "Cali", provincia: "Valle del Cauca", pais: "Colombia", grupo_clientes_id: 1 },
  { id_cliente: 5, nif_cif: "40777222", nombre_comercial: "Pedro Paramo", email: "pedro@email.com", poblacion: "Bogotá", provincia: "Cundinamarca", pais: "Colombia", grupo_clientes_id: 1 },
  { id_cliente: 6, nif_cif: "11223344", nombre_comercial: "Laura Vargas", email: "laura@email.com", poblacion: "Bogotá", provincia: "Cundinamarca", pais: "Colombia", grupo_clientes_id: 1 },
]

export const mockSellers = [
  { id_vendedor: 1, nombre: "Sin Asesor (Venta Directa)" },
  { id_vendedor: 2, nombre: "Sara Navarro" },
  { id_vendedor: 3, nombre: "Carlos Bernal" },
  { id_vendedor: 4, nombre: "Andrea Rivas" },
]

export const paymentMethods = [
  { value: "efectivo", label: "Efectivo" },
  { value: "Credito", label: "Credito" },
  { value: "Gift_Card", label: "GiftCard" },
  { value: "nota_credito", label: "Nota Credito" },
  { value: "Puntos", label: "Puntos" },
  { value: "tarjeta_credito", label: "Tarjeta de credito" },
  { value: "tarjeta_debito", label: "Tarjeta debito" },
  { value: "Transferencia", label: "Transferencia" },
  { value: "Bono", label: "Bono" },
  { value: "Bold_(Datafono)", label: "Bold (Datafono)" },
]

// ==================== TIPOS ====================

export type ProductMock = typeof mockProducts[0]
export type ClientMock = typeof mockClients[0]
export type SellerMock = typeof mockSellers[0]
export type CategoryMock = typeof mockCategories[0]

export interface CartItem {
  cartItemId: string
  id_producto: number
  nombre_producto: string
  precio_venta: number
  precio_original: number
  precio_descuento: number
  unidades: number
  impuesto: number
  codigo_producto: string
  notes?: string
  imei?: string[]
  descuento_porcentaje?: number
  rowId: string
}

export interface HoldSale {
  id: string
  createdAt: string
  cart: CartItem[]
  client: ClientMock
  seller: SellerMock
  total: number
  note?: string
  sobrecostos?: number
}

export interface PlanSepare {
  id: string
  cart: CartItem[]
  client: ClientMock
  seller: SellerMock
  total: number
  abonado: number
  saldo: number
  fecha: string
  estado: "VIGENTE" | "ENTREGADO" | "CANCELADO"
  nota?: string
}

export interface PaymentForm {
  forma_pago: string
  valor_entregado: number
  gift_card?: string
  nota_credito?: string
  transaccion?: string
}

// ==================== UTILIDADES ====================

export const formatCOP = (v: number) => "$ " + Math.round(v).toLocaleString("es-CO")
export const parseNumber = (v: string) => Number(v.replace(/\D/g, "")) || 0
export const limpiarCampo = (v: string) => v.replace(/[<>]/g, "")
export const getItemPrice = (item: CartItem) => item.precio_descuento || item.precio_venta
