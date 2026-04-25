/**
 * Tipos TypeScript generados manualmente desde el schema SQL de Supabase.
 * Tarea #19 — Fase 1: Estabilización
 * 
 * Estos tipos reflejan las tablas definidas en supabase/00_setup_complete.sql
 * En producción, reemplazar con `supabase gen types typescript --project-id <id>`
 */

// ============================================================
// ENUMS
// ============================================================

export type RolSistema = 'admin' | 'gerente' | 'cajero' | 'bodeguero'

export type TipoSede = 'TIENDA' | 'BODEGA_ONLINE' | 'BODEGA_CENTRAL'

export type TipoProducto = 'TERMINADO' | 'INSUMO' | 'SERVICIO'

export type TipoMovKardex = 
  | 'COMPRA' 
  | 'VENTA' 
  | 'AJUSTE' 
  | 'TRASLADO_IN' 
  | 'TRASLADO_OUT' 
  | 'PRODUCCION' 
  | 'DEVOLUCION'

export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'MIXTO'

export type EstadoVenta = 'PENDIENTE' | 'COMPLETADA' | 'ANULADA' | 'DEVUELTA'

export type EstadoCaja = 'ABIERTA' | 'CERRADA'

// ============================================================
// TABLAS
// ============================================================

export interface Sede {
  id: string
  nombre: string
  direccion: string | null
  ciudad: string | null
  tipo: TipoSede
  activa: boolean
  created_at: string
}

export interface Perfil {
  id: string
  nombre_completo: string | null
  avatar_url: string | null
  rol: RolSistema
  sede_id: string | null
  telefono: string | null
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Categoria {
  id: string
  nombre: string
  parent_id: string | null
  impuesto_porcentaje: number
  color_hex: string
  activa: boolean
  created_at: string
}

export interface Producto {
  id: string
  nombre: string
  sku_base: string
  categoria_id: string | null
  marca: string | null
  imagen_url: string | null
  descripcion: string | null
  tipo_producto: TipoProducto
  archived: boolean
  created_at: string
}

export interface Variante {
  id: string
  producto_id: string
  talla: string
  color: string
  sku: string
  codigo_barras: string | null
  costo_promedio_ponderado: number
  precio_venta: number
  precio_oferta: number | null
  activo: boolean
  created_at: string
}

export interface LibroPrecio {
  id: string
  variante_id: string
  sede_id: string
  precio_venta: number
  precio_volumen: number | null
  cantidad_volumen: number | null
}

export interface StockFisico {
  id: string
  variante_id: string
  sede_id: string
  cantidad: number
  stock_minimo: number
  ubicacion_pasillo: string | null
}

export interface Kardex {
  id: string
  variante_id: string
  sede_id: string
  tipo_mov: TipoMovKardex
  cantidad_mov: number
  stock_anterior: number
  stock_nuevo: number
  costo_unitario: number | null
  referencia_id: string | null
  referencia_tipo: string | null
  metadata: Record<string, unknown>
  usuario_id: string | null
  created_at: string
}

export interface SesionCaja {
  id: string
  sede_id: string
  usuario_id: string | null
  fecha_apertura: string
  fecha_cierre: string | null
  saldo_inicial: number
  saldo_final: number | null
  observaciones: string | null
  estado: EstadoCaja
}

export interface Venta {
  id: string
  sede_id: string
  caja_id: string | null
  usuario_id: string | null
  cliente_id: string | null
  cliente_nombre: string | null
  subtotal: number
  descuento: number
  impuesto: number
  total: number
  metodo_pago: MetodoPago
  referencia_pago: string | null
  estado: EstadoVenta
  created_at: string
}

export interface VentaDetalle {
  id: string
  venta_id: string
  variante_id: string | null
  cantidad: number
  precio_unitario: number
  descuento: number
  impuesto: number
  total: number
  created_at: string
}

export interface AuditLog {
  id: string
  tabla: string
  accion: string
  registro_id: string | null
  datos_anteriores: Record<string, unknown> | null
  datos_nuevos: Record<string, unknown> | null
  usuario_id: string | null
  ip_address: string | null
  created_at: string
}

// ============================================================
// TIPOS COMPUESTOS (para queries con joins)
// ============================================================

/** Producto con sus variantes y stock */
export interface ProductoConVariantes extends Producto {
  categoria?: Categoria
  variantes: (Variante & {
    stock?: StockFisico[]
    libro_precios?: LibroPrecio[]
  })[]
}

/** Venta con detalle expandido */
export interface VentaConDetalle extends Venta {
  detalles: (VentaDetalle & {
    variante?: Variante & {
      producto?: Producto
    }
  })[]
}

/** Perfil del usuario autenticado */
export interface PerfilAutenticado extends Perfil {
  email: string
  sede?: Sede
}

// ============================================================
// TIPOS INSERT/UPDATE (sin campos auto-generados)
// ============================================================

export type InsertProducto = Omit<Producto, 'id' | 'created_at'>
export type UpdateProducto = Partial<InsertProducto>

export type InsertVariante = Omit<Variante, 'id' | 'created_at'>
export type UpdateVariante = Partial<InsertVariante>

export type InsertVenta = Omit<Venta, 'id' | 'created_at'>
export type InsertVentaDetalle = Omit<VentaDetalle, 'id' | 'created_at'>

export type InsertKardex = Omit<Kardex, 'id' | 'created_at' | 'stock_anterior' | 'stock_nuevo'>
