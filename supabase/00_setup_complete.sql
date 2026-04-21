-- ============================================================
-- MILAN POS — SETUP COMPLETO (Todo en uno)
-- Ejecutar TODO de una vez en SQL Editor de Supabase
-- ============================================================

-- ============================================================
-- SECCIÓN 0: EXTENSIONES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Roles: admin (dueño/gerente general), gerente (gerente sede), cajero (caja), bodeguero (bodega)
DO $$ BEGIN
  CREATE TYPE rol_sistema AS ENUM ('admin', 'gerente', 'cajero', 'bodeguero');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- SECCIÓN 1: AUTH, PERFILES Y SEDES
-- ============================================================

-- 1.1 Tabla de Sedes
CREATE TABLE IF NOT EXISTS sedes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  direccion TEXT,
  ciudad TEXT,
  tipo VARCHAR(20) DEFAULT 'TIENDA' CHECK (tipo IN ('TIENDA', 'BODEGA_ONLINE', 'BODEGA_CENTRAL')),
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Tabla de Perfiles (Vinculada 1:1 con auth.users)
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT,
  avatar_url TEXT,
  rol rol_sistema NOT NULL DEFAULT 'cajero',
  sede_id UUID REFERENCES sedes(id) ON DELETE SET NULL,
  telefono TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 Trigger: Auto-crear perfil al registrar usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre_completo, rol, sede_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'rol')::rol_sistema, 'cajero'),
    (NEW.raw_user_meta_data->>'sede_id')::UUID
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 1.4 Helpers
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS rol_sistema AS $$
  SELECT rol FROM perfiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_my_sede()
RETURNS UUID AS $$
  SELECT sede_id FROM perfiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- SECCIÓN 2: CATÁLOGO, PRODUCTOS Y VARIANTES
-- ============================================================

-- 2.1 Categorías
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  parent_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  impuesto_porcentaje DECIMAL(5,2) DEFAULT 0.00,
  color_hex VARCHAR(7) DEFAULT '#6366F1',
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- 2.2 Productos
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

-- 2.3 Variantes
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

-- 2.4 Libro de Precios
CREATE TABLE IF NOT EXISTS libro_precios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variante_id UUID REFERENCES variantes(id) ON DELETE CASCADE,
  sede_id UUID REFERENCES sedes(id) ON DELETE CASCADE,
  precio_venta DECIMAL(14,2) NOT NULL,
  precio_volumen DECIMAL(14,2),
  cantidad_volumen INT,
  UNIQUE(variante_id, sede_id)
);

-- ============================================================
-- SECCIÓN 3: STOCK Y KARDEX
-- ============================================================

-- 3.1 Stock Físico
CREATE TABLE IF NOT EXISTS stock_fisico (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variante_id UUID REFERENCES variantes(id) ON DELETE CASCADE,
  sede_id UUID REFERENCES sedes(id) ON DELETE CASCADE,
  cantidad INT DEFAULT 0,
  stock_minimo INT DEFAULT 5,
  ubicacion_pasillo TEXT,
  UNIQUE(variante_id, sede_id)
);

-- 3.2 Kardex Inmutable
CREATE TABLE IF NOT EXISTS kardex (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variante_id UUID NOT NULL REFERENCES variantes(id),
  sede_id UUID NOT NULL REFERENCES sedes(id),
  tipo_mov VARCHAR(20) NOT NULL
    CHECK (tipo_mov IN ('COMPRA', 'VENTA', 'AJUSTE', 'TRASLADO_IN', 'TRASLADO_OUT', 'PRODUCCION', 'DEVOLUCION')),
  cantidad_mov INT NOT NULL,
  stock_anterior INT NOT NULL DEFAULT 0,
  stock_nuevo INT NOT NULL DEFAULT 0,
  costo_unitario DECIMAL(14,2),
  referencia_id UUID,
  referencia_tipo VARCHAR(30),
  metadata JSONB DEFAULT '{}',
  usuario_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kardex_variante ON kardex(variante_id);
CREATE INDEX IF NOT EXISTS idx_kardex_sede ON kardex(sede_id);
CREATE INDEX IF NOT EXISTS idx_kardex_fecha ON kardex(created_at DESC);

-- 3.3 Trigger Maestro de Kardex
CREATE OR REPLACE FUNCTION fn_procesar_kardex()
RETURNS TRIGGER AS $$
DECLARE
  v_stock_actual INT;
  v_costo_actual DECIMAL;
  v_nuevo_costo DECIMAL;
BEGIN
  SELECT cantidad INTO v_stock_actual
  FROM stock_fisico
  WHERE variante_id = NEW.variante_id AND sede_id = NEW.sede_id
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO stock_fisico (variante_id, sede_id, cantidad)
    VALUES (NEW.variante_id, NEW.sede_id, 0);
    v_stock_actual := 0;
  END IF;

  IF NEW.tipo_mov IN ('VENTA', 'TRASLADO_OUT') AND (v_stock_actual + NEW.cantidad_mov) < 0 THEN
    RAISE EXCEPTION 'STOCK_INSUFICIENTE: Variante=%, Sede=%, Disponible=%, Solicitado=%',
      NEW.variante_id, NEW.sede_id, v_stock_actual, ABS(NEW.cantidad_mov);
  END IF;

  NEW.stock_anterior := v_stock_actual;
  NEW.stock_nuevo := v_stock_actual + NEW.cantidad_mov;

  IF NEW.tipo_mov = 'COMPRA' AND NEW.cantidad_mov > 0 AND NEW.costo_unitario IS NOT NULL THEN
    SELECT costo_promedio_ponderado INTO v_costo_actual
    FROM variantes WHERE id = NEW.variante_id;

    IF (v_stock_actual + NEW.cantidad_mov) > 0 THEN
      v_nuevo_costo := (
        (v_stock_actual * COALESCE(v_costo_actual, 0)) +
        (NEW.cantidad_mov * NEW.costo_unitario)
      ) / (v_stock_actual + NEW.cantidad_mov);

      UPDATE variantes
      SET costo_promedio_ponderado = ROUND(v_nuevo_costo, 2)
      WHERE id = NEW.variante_id;
    END IF;
  END IF;

  UPDATE stock_fisico
  SET cantidad = NEW.stock_nuevo
  WHERE variante_id = NEW.variante_id AND sede_id = NEW.sede_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_kardex_maestro ON kardex;
CREATE TRIGGER trg_kardex_maestro
  BEFORE INSERT ON kardex
  FOR EACH ROW EXECUTE FUNCTION fn_procesar_kardex();

-- 3.4 Función RPC: Traslado
CREATE OR REPLACE FUNCTION traslada_inventario(
  p_variante_id UUID,
  p_sede_origen UUID,
  p_sede_destino UUID,
  p_cantidad INT,
  p_usuario_id UUID
) RETURNS VOID AS $$
BEGIN
  IF p_cantidad <= 0 THEN
    RAISE EXCEPTION 'La cantidad debe ser mayor a 0.';
  END IF;

  INSERT INTO kardex (variante_id, sede_id, tipo_mov, cantidad_mov, costo_unitario, usuario_id, referencia_tipo, metadata)
  VALUES (p_variante_id, p_sede_origen, 'TRASLADO_OUT', -p_cantidad, NULL, p_usuario_id, 'TRASLADO',
    jsonb_build_object('destino_sede_id', p_sede_destino));

  INSERT INTO kardex (variante_id, sede_id, tipo_mov, cantidad_mov, costo_unitario, usuario_id, referencia_tipo, metadata)
  VALUES (p_variante_id, p_sede_destino, 'TRASLADO_IN', p_cantidad, NULL, p_usuario_id, 'TRASLADO',
    jsonb_build_object('origen_sede_id', p_sede_origen));
END;
$$ LANGUAGE plpgsql;

-- 3.5 Auto-inicializar stock al crear nueva sede
CREATE OR REPLACE FUNCTION fn_init_stock_nueva_sede()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO stock_fisico (variante_id, sede_id, cantidad)
  SELECT id, NEW.id, 0 FROM variantes WHERE activo = true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_init_sede ON sedes;
CREATE TRIGGER trg_init_sede
  AFTER INSERT ON sedes
  FOR EACH ROW EXECUTE FUNCTION fn_init_stock_nueva_sede();

-- Auto-inicializar stock al crear nueva variante
CREATE OR REPLACE FUNCTION fn_init_stock_nueva_variante()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO stock_fisico (variante_id, sede_id, cantidad)
  SELECT NEW.id, id, 0 FROM sedes WHERE activa = true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_init_variante ON variantes;
CREATE TRIGGER trg_init_variante
  AFTER INSERT ON variantes
  FOR EACH ROW EXECUTE FUNCTION fn_init_stock_nueva_variante();

-- ============================================================
-- SECCIÓN 4: VENTAS Y CAJA
-- ============================================================

CREATE TABLE IF NOT EXISTS sesiones_caja (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sede_id UUID REFERENCES sedes(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES auth.users(id),
  fecha_apertura TIMESTAMPTZ DEFAULT NOW(),
  fecha_cierre TIMESTAMPTZ,
  saldo_inicial DECIMAL(14,2) DEFAULT 0,
  saldo_final DECIMAL(14,2),
  observaciones TEXT,
  estado VARCHAR(20) DEFAULT 'ABIERTA' CHECK (estado IN ('ABIERTA', 'CERRADA'))
);

CREATE TABLE IF NOT EXISTS ventas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sede_id UUID REFERENCES sedes(id) ON DELETE CASCADE,
  caja_id UUID REFERENCES sesiones_caja(id),
  usuario_id UUID REFERENCES auth.users(id),
  cliente_id UUID,
  cliente_nombre TEXT,
  subtotal DECIMAL(14,2) DEFAULT 0,
  descuento DECIMAL(14,2) DEFAULT 0,
  impuesto DECIMAL(14,2) DEFAULT 0,
  TOTAL DECIMAL(14,2) DEFAULT 0,
  metodo_pago VARCHAR(20) DEFAULT 'EFECTIVO' CHECK (metodo_pago IN ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'MIXTO')),
  referencia_pago TEXT,
  estado VARCHAR(20) DEFAULT 'COMPLETADA' CHECK (estado IN ('PENDIENTE', 'COMPLETADA', 'ANULADA', 'DEVUELTA')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ventas_detalle (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venta_id UUID REFERENCES ventas(id) ON DELETE CASCADE,
  variante_id UUID REFERENCES variantes(id),
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(14,2) NOT NULL,
  descuento DECIMAL(14,2) DEFAULT 0,
  impuesto DECIMAL(14,2) DEFAULT 0,
  TOTAL DECIMAL(14,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SECCIÓN 5: RPC VENTAS
-- ============================================================

CREATE OR REPLACE FUNCTION fn_procesar_venta()
RETURNS TRIGGER AS $$
DECLARE
  v_sede_id UUID;
  v_usuario_id UUID;
  v_stock_para_dedir INT;
BEGIN
  IF NEW.estado = 'COMPLETADA' AND old.estado IS DISTINCT FROM 'COMPLETADA' THEN
    v_sede_id := NEW.sede_id;
    v_usuario_id := NEW.usuario_id;

    FOR v_stock_para_dedir IN
      SELECT vd.variante_id, vd.cantidad
      FROM ventas_detalle vd WHERE vd.venta_id = NEW.id
    LOOP
      INSERT INTO kardex (variante_id, sede_id, tipo_mov, cantidad_mov, referencia_id, referencia_tipo, usuario_id)
      VALUES (v_stock_para_dedir.variante_id, v_sede_id, 'VENTA', -v_stock_para_dedir.cantidad, NEW.id, 'VENTA', v_usuario_id);
    END LOOP;
  END IF;

  IF NEW.estado = 'ANULADA' AND old.estado = 'COMPLETADA' THEN
    FOR v_stock_para_dedir IN
      SELECT vd.variante_id, vd.cantidad
      FROM ventas_detalle vd WHERE vd.venta_id = NEW.id
    LOOP
      INSERT INTO kardex (variante_id, sede_id, tipo_mov, cantidad_mov, referencia_id, referencia_tipo, usuario_id)
      VALUES (v_stock_para_dedir.variante_id, NEW.sede_id, 'DEVOLUCION', v_stock_para_dedir.cantidad, NEW.id, 'VENTA', NEW.usuario_id);
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_procesar_venta ON ventas;
CREATE TRIGGER trg_procesar_venta
  AFTER UPDATE ON ventas
  FOR EACH ROW EXECUTE FUNCTION fn_procesar_venta();

-- ============================================================
-- SECCIÓN 6: AUDITORÍA
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tabla TEXT NOT NULL,
  accion TEXT NOT NULL,
  registro_id UUID,
  datos_anteriores JSONB,
  datos_nuevos JSONB,
  usuario_id UUID REFERENCES auth.users(id),
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION fn_audit_trigger()
RETURNS TRIGGER AS $$
DECLARE
  tabla_name TEXT;
BEGIN
  tabla_name := TG_TABLE_NAME;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (tabla, accion, datos_nuevos, usuario_id)
    VALUES (tabla_name, 'INSERT', to_jsonb(NEW), auth.uid());
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (tabla, accion, datos_anteriores, datos_nuevos, usuario_id)
    VALUES (tabla_name, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (tabla, accion, datos_anteriores, usuario_id)
    VALUES (tabla_name, 'DELETE', to_jsonb(OLD), auth.uid());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SECCIÓN 7: SEGURIDAD RLS
-- ============================================================

ALTER TABLE sedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE variantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE libro_precios ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_fisico ENABLE ROW LEVEL SECURITY;
ALTER TABLE kardex ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones_caja ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas_detalle ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios autenticados
CREATE POLICY "Usuarios ven su perfil" ON perfiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Usuarios ven su sede" ON sedes
  FOR SELECT USING (true);

CREATE POLICY "Admins ven todos los perfiles" ON perfiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
  );

-- ============================================================
-- DATOS INICIALES DE EJEMPLO
-- ============================================================

-- Insertar sede ejemplo (si no existe)
INSERT INTO sedes (id, nombre, direccion, ciudad, tipo)
VALUES ('00000000-0000-0000-0000-000000000001', 'Tienda Principal', 'Calle 123', 'Ciudad', 'TIENDA')
ON CONFLICT (id) DO NOTHING;

-- Insertar usuario admin ejemplo (si no existe)
INSERT INTO auth.users (id, email, encrypted_password, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@milan.pos',
  'placeholder',
  '{"nombre": "Administrador", "rol": "admin", "sede_id": "00000000-0000-0000-0000-000000000001"}'
)
ON CONFLICT (id) DO NOTHING;

-- Insertar perfil admin
INSERT INTO perfiles (id, nombre_completo, rol, sede_id)
VALUES ('00000000-0000-0000-0000-000000000001', 'Administrador', 'admin', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Seleccionar para verificar
SELECT 'Setup completo ejecutado' AS resultado;