-- ============================================================
-- MILAN POS — SECCIÓN 5: RPC TRANSACCIONAL DE VENTA COMPLETA
-- Ejecutar SEXTO en SQL Editor de Supabase
-- ============================================================

-- Función principal: Procesa una venta completa de forma atómica
-- Recibe un JSON y ejecuta TODO dentro de una transacción.
-- Si algo falla → ROLLBACK total automático de PostgreSQL.
--
-- Ejemplo de llamada desde el frontend:
-- const { data, error } = await supabase.rpc('procesar_venta_final', {
--   p_venta: {
--     sede_id: '...',
--     sesion_id: '...',
--     vendedor_id: '...',
--     cliente_id: '...',        -- opcional
--     tipo: 'VENTA',
--     metodo_pago: 'EFECTIVO',
--     notas: '',
--     items: [
--       { variante_id: '...', cantidad: 2, precio_unitario: 45000 },
--       { variante_id: '...', cantidad: 1, precio_unitario: 85000 }
--     ]
--   }
-- })

CREATE OR REPLACE FUNCTION procesar_venta_final(p_venta JSONB)
RETURNS UUID AS $$
DECLARE
  v_venta_id UUID;
  v_item JSONB;
  v_stock_disp INT;
  v_variante_id UUID;
  v_cantidad INT;
  v_precio DECIMAL;
  v_costo DECIMAL;
  v_nombre TEXT;
  v_sede_id UUID;
  v_total DECIMAL := 0;
  v_subtotal_linea DECIMAL;
BEGIN
  v_sede_id := (p_venta->>'sede_id')::UUID;

  -- ══════════════════════════════════════════
  -- FASE 1: PRE-VALIDACIÓN DE STOCK COMPLETA
  -- ══════════════════════════════════════════
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_venta->'items')
  LOOP
    v_variante_id := (v_item->>'variante_id')::UUID;
    v_cantidad := (v_item->>'cantidad')::INT;

    SELECT cantidad INTO v_stock_disp
    FROM stock_fisico
    WHERE variante_id = v_variante_id AND sede_id = v_sede_id;

    IF NOT FOUND OR v_stock_disp < v_cantidad THEN
      RAISE EXCEPTION 'STOCK_INSUFICIENTE_PREVENTA: Variante=%, Disponible=%, Solicitado=%',
        v_variante_id, COALESCE(v_stock_disp, 0), v_cantidad;
    END IF;
  END LOOP;

  -- ══════════════════════════════════════════
  -- FASE 2: CREAR CABECERA DE FACTURA
  -- ══════════════════════════════════════════
  INSERT INTO ventas (
    sede_id, sesion_id, vendedor_id, cliente_id,
    tipo, metodo_pago, notas
  ) VALUES (
    v_sede_id,
    (p_venta->>'sesion_id')::UUID,
    (p_venta->>'vendedor_id')::UUID,
    (p_venta->>'cliente_id')::UUID,
    COALESCE(p_venta->>'tipo', 'VENTA'),
    COALESCE(p_venta->>'metodo_pago', 'EFECTIVO'),
    p_venta->>'notas'
  ) RETURNING id INTO v_venta_id;

  -- ══════════════════════════════════════════
  -- FASE 3: PROCESAR CADA LÍNEA DE PRODUCTO
  -- ══════════════════════════════════════════
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_venta->'items')
  LOOP
    v_variante_id := (v_item->>'variante_id')::UUID;
    v_cantidad := (v_item->>'cantidad')::INT;
    v_precio := (v_item->>'precio_unitario')::DECIMAL;

    -- Obtener costo actual y nombre para snapshot inmutable
    SELECT v.costo_promedio_ponderado, p.nombre || ' (' || v.talla || '/' || v.color || ')'
    INTO v_costo, v_nombre
    FROM variantes v
    JOIN productos p ON p.id = v.producto_id
    WHERE v.id = v_variante_id;

    v_subtotal_linea := v_cantidad * v_precio;
    v_total := v_total + v_subtotal_linea;

    -- 3a. Insertar línea de detalle
    INSERT INTO ventas_detalle (venta_id, variante_id, nombre_snapshot, cantidad, precio_unitario, costo_unitario, subtotal)
    VALUES (v_venta_id, v_variante_id, v_nombre, v_cantidad, v_precio, v_costo, v_subtotal_linea);

    -- 3b. Descontar del Kardex (el trigger valida stock y actualiza stock_fisico)
    INSERT INTO kardex (variante_id, sede_id, tipo_mov, cantidad_mov, costo_unitario, usuario_id, referencia_id, referencia_tipo)
    VALUES (v_variante_id, v_sede_id, 'VENTA', -v_cantidad, v_costo, (p_venta->>'vendedor_id')::UUID, v_venta_id, 'VENTA');
  END LOOP;

  -- ══════════════════════════════════════════
  -- FASE 4: ACTUALIZAR TOTALES DE LA FACTURA
  -- ══════════════════════════════════════════
  UPDATE ventas
  SET subtotal = v_total,
      impuesto = ROUND(v_total * 0.19, 2),
      total = v_total + ROUND(v_total * 0.19, 2),
      estado = CASE
        WHEN (p_venta->>'tipo') = 'COTIZACION' THEN 'PENDIENTE'
        ELSE 'PAGADA'
      END
  WHERE id = v_venta_id;

  -- ══════════════════════════════════════════
  -- FASE 5: RETORNAR ID DE LA FACTURA
  -- ══════════════════════════════════════════
  RETURN v_venta_id;
END;
$$ LANGUAGE plpgsql;

-- Función para ANULAR una venta (restaura stock vía Kardex)
CREATE OR REPLACE FUNCTION anular_venta(p_venta_id UUID, p_usuario_id UUID)
RETURNS VOID AS $$
DECLARE
  v_item RECORD;
  v_estado VARCHAR;
  v_sede_id UUID;
BEGIN
  SELECT estado, sede_id INTO v_estado, v_sede_id FROM ventas WHERE id = p_venta_id;

  IF v_estado = 'ANULADA' THEN
    RAISE EXCEPTION 'La venta ya se encuentra anulada.';
  END IF;

  -- Marcar como anulada
  UPDATE ventas SET estado = 'ANULADA' WHERE id = p_venta_id;

  -- Devolver stock para cada línea via Kardex
  FOR v_item IN SELECT variante_id, cantidad, costo_unitario FROM ventas_detalle WHERE venta_id = p_venta_id
  LOOP
    INSERT INTO kardex (variante_id, sede_id, tipo_mov, cantidad_mov, costo_unitario, usuario_id, referencia_id, referencia_tipo, metadata)
    VALUES (v_item.variante_id, v_sede_id, 'DEVOLUCION', v_item.cantidad, v_item.costo_unitario, p_usuario_id, p_venta_id, 'ANULACION',
      '{"motivo": "Anulación de venta"}'::JSONB);
  END LOOP;

  -- Log de auditoría
  INSERT INTO logs_actividad (usuario_id, accion, tabla_afectada, registro_id, detalle)
  VALUES (p_usuario_id, 'ANULAR_VENTA', 'ventas', p_venta_id, jsonb_build_object('venta_id', p_venta_id));
END;
$$ LANGUAGE plpgsql;
