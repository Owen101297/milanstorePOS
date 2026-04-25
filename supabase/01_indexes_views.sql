-- ============================================================
-- Milan POS — Índices de Rendimiento + Vistas para Reportes
-- Tareas #20 y #21 — Fase 3
-- ============================================================

-- #20: ÍNDICES DE RENDIMIENTO
-- ============================================================

-- Ventas: filtro más frecuente = sede + estado + fecha
CREATE INDEX IF NOT EXISTS idx_ventas_sede_estado_fecha
  ON ventas (sede_id, estado, created_at DESC);

-- Ventas: filtro por método de pago para reportes
CREATE INDEX IF NOT EXISTS idx_ventas_sede_metodo
  ON ventas (sede_id, metodo_pago) WHERE estado = 'COMPLETADA';

-- Stock: consulta por sede + variante (JOIN más frecuente)
CREATE INDEX IF NOT EXISTS idx_stock_sede_variante
  ON stock_fisico (sede_id, variante_id);

-- Stock bajo mínimo (alerta de reposición)
CREATE INDEX IF NOT EXISTS idx_stock_bajo_minimo
  ON stock_fisico (sede_id) WHERE cantidad <= stock_minimo;

-- Kardex: historial por variante + tipo
CREATE INDEX IF NOT EXISTS idx_kardex_variante_tipo
  ON kardex (variante_id, tipo_mov, created_at DESC);

-- Kardex: historial por sede + fecha
CREATE INDEX IF NOT EXISTS idx_kardex_sede_fecha
  ON kardex (sede_id, created_at DESC);

-- Variantes: búsqueda por código de barras (POS scan)
CREATE UNIQUE INDEX IF NOT EXISTS idx_variantes_barcode
  ON variantes (codigo_barras) WHERE codigo_barras IS NOT NULL;

-- Variantes: búsqueda por SKU (POS search)
CREATE UNIQUE INDEX IF NOT EXISTS idx_variantes_sku
  ON variantes (sku);

-- Productos: búsqueda por nombre (full-text sería ideal, pero esto cubre ilike)
CREATE INDEX IF NOT EXISTS idx_productos_nombre_trgm
  ON productos USING gin (nombre gin_trgm_ops);

-- Sesiones de caja: buscar caja abierta del usuario
CREATE INDEX IF NOT EXISTS idx_sesiones_caja_abiertas
  ON sesiones_caja (sede_id, usuario_id) WHERE estado = 'ABIERTA';

-- Ventas detalle: agregación por variante (top productos)
CREATE INDEX IF NOT EXISTS idx_detalle_variante_venta
  ON ventas_detalle (variante_id, venta_id);

-- Perfiles: buscar por sede
CREATE INDEX IF NOT EXISTS idx_perfiles_sede
  ON perfiles (sede_id) WHERE activo = true;

-- #21: VISTAS MATERIALIZADAS PARA REPORTES
-- ============================================================

-- Vista: Resumen diario por sede (se refresca cada hora en prod)
CREATE OR REPLACE VIEW v_resumen_ventas_diario AS
SELECT 
  v.sede_id,
  DATE(v.created_at) AS fecha,
  COUNT(*) AS total_facturas,
  SUM(v.total) AS total_ventas,
  SUM(v.descuento) AS total_descuentos,
  SUM(v.impuesto) AS total_impuestos,
  AVG(v.total) AS ticket_promedio,
  SUM(CASE WHEN v.metodo_pago = 'EFECTIVO' THEN v.total ELSE 0 END) AS ventas_efectivo,
  SUM(CASE WHEN v.metodo_pago = 'TARJETA' THEN v.total ELSE 0 END) AS ventas_tarjeta,
  SUM(CASE WHEN v.metodo_pago = 'TRANSFERENCIA' THEN v.total ELSE 0 END) AS ventas_transferencia,
  SUM(CASE WHEN v.metodo_pago = 'MIXTO' THEN v.total ELSE 0 END) AS ventas_mixto
FROM ventas v
WHERE v.estado = 'COMPLETADA'
GROUP BY v.sede_id, DATE(v.created_at);

-- Vista: Top productos vendidos (general, sin límite de fecha)
CREATE OR REPLACE VIEW v_top_productos AS
SELECT 
  p.id AS producto_id,
  p.nombre AS producto_nombre,
  var.sku,
  var.talla,
  var.color,
  SUM(vd.cantidad) AS unidades_vendidas,
  SUM(vd.total) AS total_vendido,
  COUNT(DISTINCT vd.venta_id) AS apariciones_en_ventas
FROM ventas_detalle vd
JOIN variantes var ON var.id = vd.variante_id
JOIN productos p ON p.id = var.producto_id
JOIN ventas v ON v.id = vd.venta_id
WHERE v.estado = 'COMPLETADA'
GROUP BY p.id, p.nombre, var.sku, var.talla, var.color
ORDER BY total_vendido DESC;

-- Vista: Stock consolidado con datos de producto
CREATE OR REPLACE VIEW v_stock_consolidado AS
SELECT 
  sf.sede_id,
  s.nombre AS sede_nombre,
  p.id AS producto_id,
  p.nombre AS producto_nombre,
  var.sku,
  var.talla,
  var.color,
  sf.cantidad,
  sf.stock_minimo,
  var.precio_venta,
  var.costo_promedio_ponderado,
  (sf.cantidad * var.precio_venta) AS valor_inventario_venta,
  (sf.cantidad * var.costo_promedio_ponderado) AS valor_inventario_costo,
  CASE WHEN sf.cantidad <= sf.stock_minimo THEN true ELSE false END AS bajo_minimo
FROM stock_fisico sf
JOIN variantes var ON var.id = sf.variante_id
JOIN productos p ON p.id = var.producto_id
JOIN sedes s ON s.id = sf.sede_id
WHERE p.archived = false AND var.activo = true;

-- Vista: Movimientos de Kardex con contexto
CREATE OR REPLACE VIEW v_kardex_detallado AS
SELECT 
  k.id,
  k.sede_id,
  s.nombre AS sede_nombre,
  p.nombre AS producto_nombre,
  var.sku,
  var.talla,
  var.color,
  k.tipo_mov,
  k.cantidad_mov,
  k.stock_anterior,
  k.stock_nuevo,
  k.costo_unitario,
  k.referencia_tipo,
  k.created_at,
  per.nombre_completo AS usuario_nombre
FROM kardex k
JOIN variantes var ON var.id = k.variante_id
JOIN productos p ON p.id = var.producto_id
JOIN sedes s ON s.id = k.sede_id
LEFT JOIN perfiles per ON per.id = k.usuario_id
ORDER BY k.created_at DESC;

-- Vista: Cierres de caja con diferencias
CREATE OR REPLACE VIEW v_cierres_caja AS
SELECT 
  sc.id,
  sc.sede_id,
  s.nombre AS sede_nombre,
  per.nombre_completo AS cajero,
  sc.fecha_apertura,
  sc.fecha_cierre,
  sc.saldo_inicial,
  sc.saldo_final,
  sc.observaciones,
  sc.estado,
  COALESCE(sc.saldo_final, 0) - sc.saldo_inicial AS diferencia,
  (SELECT COUNT(*) FROM ventas v WHERE v.caja_id = sc.id AND v.estado = 'COMPLETADA') AS num_ventas,
  (SELECT COALESCE(SUM(v.total), 0) FROM ventas v WHERE v.caja_id = sc.id AND v.estado = 'COMPLETADA') AS total_vendido
FROM sesiones_caja sc
JOIN sedes s ON s.id = sc.sede_id
LEFT JOIN perfiles per ON per.id = sc.usuario_id
ORDER BY sc.fecha_apertura DESC;
