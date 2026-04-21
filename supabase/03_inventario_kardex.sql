-- ============================================================
-- MILAN POS — SECCIÓN 3: STOCK FÍSICO Y KARDEX INMUTABLE
-- Ejecutar CUARTO en SQL Editor de Supabase
-- ============================================================

-- 3.1 Stock Físico por Sede
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

-- Índices de rendimiento para el Kardex
CREATE INDEX IF NOT EXISTS idx_kardex_variante ON kardex(variante_id);
CREATE INDEX IF NOT EXISTS idx_kardex_sede ON kardex(sede_id);
CREATE INDEX IF NOT EXISTS idx_kardex_fecha ON kardex(created_at DESC);

-- 3.3 TRIGGER MAESTRO: Procesa cada INSERT en el Kardex
CREATE OR REPLACE FUNCTION fn_procesar_kardex()
RETURNS TRIGGER AS $$
DECLARE
  v_stock_actual INT;
  v_costo_actual DECIMAL;
  v_nuevo_costo DECIMAL;
BEGIN
  -- PASO 1: Obtener stock actual con bloqueo anti-concurrencia
  SELECT cantidad INTO v_stock_actual
  FROM stock_fisico
  WHERE variante_id = NEW.variante_id AND sede_id = NEW.sede_id
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO stock_fisico (variante_id, sede_id, cantidad)
    VALUES (NEW.variante_id, NEW.sede_id, 0);
    v_stock_actual := 0;
  END IF;

  -- PASO 2: Validar que no quede negativo en VENTA y TRASLADO_OUT
  IF NEW.tipo_mov IN ('VENTA', 'TRASLADO_OUT') AND (v_stock_actual + NEW.cantidad_mov) < 0 THEN
    RAISE EXCEPTION 'STOCK_INSUFICIENTE: Variante=%, Sede=%, Disponible=%, Solicitado=%',
      NEW.variante_id, NEW.sede_id, v_stock_actual, ABS(NEW.cantidad_mov);
  END IF;

  -- PASO 3: Escribir valores inmutables de auditoría
  NEW.stock_anterior := v_stock_actual;
  NEW.stock_nuevo := v_stock_actual + NEW.cantidad_mov;

  -- PASO 4: Si es COMPRA, recalcular Costo Promedio Ponderado
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

  -- PASO 5: Actualizar stock físico definitivo
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

-- 3.4 Función RPC: Traslado Atómico entre Sedes
CREATE OR REPLACE FUNCTION trasladar_inventario(
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
