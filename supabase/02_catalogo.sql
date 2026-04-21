-- ============================================================
-- MILAN POS — SECCIÓN 2: CATÁLOGO, PRODUCTOS Y VARIANTES
-- Ejecutar TERCERO en SQL Editor de Supabase
-- ============================================================

-- 2.1 Categorías con herencia jerárquica de impuesto
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  parent_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  impuesto_porcentaje DECIMAL(5,2) DEFAULT 0.00,
  color_hex VARCHAR(7) DEFAULT '#6366F1',
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Función recursiva: hereda impuesto del padre si el hijo tiene 0
CREATE OR REPLACE FUNCTION get_impuesto_efectivo(cat_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_impuesto DECIMAL;
  v_parent_id UUID;
BEGIN
  SELECT impuesto_porcentaje, parent_id INTO v_impuesto, v_parent_id
  FROM categorias WHERE id = cat_id;
  IF v_impuesto > 0 THEN RETURN v_impuesto; END IF;
  IF v_parent_id IS NOT NULL THEN RETURN get_impuesto_efectivo(v_parent_id); END IF;
  RETURN 0;
END;
$$ LANGUAGE plpgsql STABLE;

-- 2.2 Productos (Modelo Base)
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  sku_base TEXT UNIQUE NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  marca TEXT,
  imagen_url TEXT,
  descripcion TEXT,
  tipo_producto VARCHAR(20) DEFAULT 'TERMINADO'
    CHECK (tipo_producto IN ('TERMINADO', 'INSUMO', 'SERVICIO')),
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Variantes (SKU inventariable real)
CREATE TABLE IF NOT EXISTS variantes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  talla VARCHAR(15) DEFAULT 'UNICA',
  color VARCHAR(30) DEFAULT 'N/A',
  sku TEXT UNIQUE NOT NULL,
  codigo_barras TEXT UNIQUE,
  costo_promedio_ponderado DECIMAL(14,2) DEFAULT 0,
  precio_venta DECIMAL(14,2) NOT NULL DEFAULT 0,
  precio_oferta DECIMAL(14,2),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 Libro de Precios Omnicanal (Precio por sede)
CREATE TABLE IF NOT EXISTS libro_precios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variante_id UUID REFERENCES variantes(id) ON DELETE CASCADE,
  sede_id UUID REFERENCES sedes(id) ON DELETE CASCADE,
  precio_venta DECIMAL(14,2) NOT NULL,
  precio_volumen DECIMAL(14,2),
  cantidad_volumen INT,
  UNIQUE(variante_id, sede_id)
);
