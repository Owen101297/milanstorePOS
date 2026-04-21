-- ============================================================
-- MILAN POS — SECCIÓN 4: VENTAS, CAJA Y FACTURACIÓN
-- Ejecutar QUINTO en SQL Editor de Supabase
-- ============================================================

-- 4.1 Sesiones de Caja
CREATE TABLE IF NOT EXISTS caja_sesiones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cajero_id UUID REFERENCES auth.users(id),
  sede_id UUID NOT NULL REFERENCES sedes(id),
  base_inicial DECIMAL(12,2) DEFAULT 0,
  efectivo_declarado DECIMAL(12,2),
  diferencia DECIMAL(12,2),
  estado VARCHAR(20) DEFAULT 'ABIERTA' CHECK (estado IN ('ABIERTA', 'CERRADA')),
  fecha_apertura TIMESTAMPTZ DEFAULT NOW(),
  fecha_cierre TIMESTAMPTZ
);

-- 4.2 Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  documento TEXT UNIQUE,
  email TEXT,
  telefono TEXT,
  direccion TEXT,
  ciudad TEXT,
  puntos_lealtad INT DEFAULT 0,
  tier VARCHAR(10) DEFAULT 'BRONCE' CHECK (tier IN ('BRONCE', 'PLATA', 'ORO', 'PLATINO')),
  notas TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.3 Ventas (Factura cabecera)
CREATE TABLE IF NOT EXISTS ventas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sede_id UUID NOT NULL REFERENCES sedes(id),
  sesion_id UUID REFERENCES caja_sesiones(id),
  vendedor_id UUID REFERENCES auth.users(id),
  cliente_id UUID REFERENCES clientes(id),
  tipo VARCHAR(20) DEFAULT 'VENTA'
    CHECK (tipo IN ('VENTA', 'REMISION', 'PLAN_SEPARE', 'VENTA_ONLINE', 'COTIZACION')),
  metodo_pago VARCHAR(30) DEFAULT 'EFECTIVO',
  subtotal DECIMAL(14,2) DEFAULT 0,
  impuesto DECIMAL(14,2) DEFAULT 0,
  descuento DECIMAL(14,2) DEFAULT 0,
  total DECIMAL(14,2) DEFAULT 0,
  estado VARCHAR(20) DEFAULT 'PAGADA'
    CHECK (estado IN ('PAGADA', 'PENDIENTE', 'ANULADA', 'PENDIENTE_DESPACHO')),
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.4 Detalle de Ventas (Líneas de factura)
CREATE TABLE IF NOT EXISTS ventas_detalle (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venta_id UUID NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  variante_id UUID NOT NULL REFERENCES variantes(id),
  nombre_snapshot TEXT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(14,2) NOT NULL,
  costo_unitario DECIMAL(14,2),
  descuento_linea DECIMAL(14,2) DEFAULT 0,
  subtotal DECIMAL(14,2) NOT NULL
);

-- Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_ventas_sede ON ventas(sede_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON ventas(estado);
