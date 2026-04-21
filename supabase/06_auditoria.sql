-- ============================================================
-- MILAN POS — SECCIÓN 6: AUDITORÍA Y LOGS DE ACTIVIDAD
-- Ejecutar SÉPTIMO en SQL Editor de Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS logs_actividad (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES auth.users(id),
  accion VARCHAR(50) NOT NULL,
  tabla_afectada VARCHAR(50) NOT NULL,
  registro_id UUID,
  detalle JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_actividad(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_accion ON logs_actividad(accion);
CREATE INDEX IF NOT EXISTS idx_logs_fecha ON logs_actividad(created_at DESC);

-- 6.1 Trigger: Auditar cambios de precio en variantes
CREATE OR REPLACE FUNCTION fn_audit_precio_variante()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.precio_venta IS DISTINCT FROM NEW.precio_venta THEN
    INSERT INTO logs_actividad (usuario_id, accion, tabla_afectada, registro_id, detalle)
    VALUES (
      auth.uid(),
      'CAMBIAR_PRECIO',
      'variantes',
      NEW.id,
      jsonb_build_object(
        'campo', 'precio_venta',
        'antes', OLD.precio_venta,
        'despues', NEW.precio_venta,
        'sku', NEW.sku
      )
    );
  END IF;

  IF OLD.precio_oferta IS DISTINCT FROM NEW.precio_oferta THEN
    INSERT INTO logs_actividad (usuario_id, accion, tabla_afectada, registro_id, detalle)
    VALUES (
      auth.uid(),
      'CAMBIAR_PRECIO_OFERTA',
      'variantes',
      NEW.id,
      jsonb_build_object(
        'campo', 'precio_oferta',
        'antes', OLD.precio_oferta,
        'despues', NEW.precio_oferta,
        'sku', NEW.sku
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_audit_precio ON variantes;
CREATE TRIGGER trg_audit_precio
  AFTER UPDATE ON variantes
  FOR EACH ROW EXECUTE FUNCTION fn_audit_precio_variante();

-- 6.2 Trigger: Auditar ajustes manuales de inventario
CREATE OR REPLACE FUNCTION fn_audit_ajuste_kardex()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tipo_mov = 'AJUSTE' THEN
    INSERT INTO logs_actividad (usuario_id, accion, tabla_afectada, registro_id, detalle)
    VALUES (
      NEW.usuario_id,
      'AJUSTE_INVENTARIO',
      'kardex',
      NEW.id,
      jsonb_build_object(
        'variante_id', NEW.variante_id,
        'sede_id', NEW.sede_id,
        'cantidad', NEW.cantidad_mov,
        'stock_anterior', NEW.stock_anterior,
        'stock_nuevo', NEW.stock_nuevo,
        'metadata', NEW.metadata
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_audit_ajuste ON kardex;
CREATE TRIGGER trg_audit_ajuste
  AFTER INSERT ON kardex
  FOR EACH ROW EXECUTE FUNCTION fn_audit_ajuste_kardex();
