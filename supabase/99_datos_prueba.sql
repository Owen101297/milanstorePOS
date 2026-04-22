-- ============================================================
-- MILAN POS — DATOS DE PRUEBA
-- Ejecutar DESPUÉS de setup completo para poblar datos demo
-- ============================================================

-- 1. Crear categorías de prueba
INSERT INTO categorias (id, nombre, color_hex, activa)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Camisetas', '#6366F1', true),
  ('22222222-2222-2222-2222-222222222222', 'Pantalones', '#10B981', true),
  ('33333333-3333-3333-3333-333333333333', 'Chaquetas', '#F59E0B', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Crear productos de prueba
INSERT INTO productos (id, nombre, sku_base, categoria_id, marca, tipo_producto)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Camiseta Básica Algodón', 'CAM-BAS', '11111111-1111-1111-1111-111111111111', 'Milan', 'TERMINADO'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Jean Clásico Slim', 'JEA-SLI', '22222222-2222-2222-2222-222222222222', 'Milan', 'TERMINADO'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Chaqueta Cuero Sintético', 'CHA-CUE', '33333333-3333-3333-3333-333333333333', 'Milan', 'TERMINADO')
ON CONFLICT (id) DO NOTHING;

-- 3. Crear variantes de prueba
INSERT INTO variantes (id, producto_id, talla, color, sku, codigo_barras, costo_promedio_ponderado, precio_venta, activo)
VALUES 
  -- Camisetas
  ('var111-111-111-111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'S', 'Blanco', 'CAM-BAS-BCO-S', '7701234567890', 15000, 35000, true),
  ('var111-111-111-111-111111111112', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'M', 'Blanco', 'CAM-BAS-BCO-M', '7701234567891', 15000, 35000, true),
  ('var111-111-111-111-111111111113', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'L', 'Negro', 'CAM-BAS-NEG-L', '7701234567892', 15000, 35000, true),
  -- Jeans
  ('var222-222-222-222-222222222221', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '30', 'Azul Oscuro', 'JEA-SLI-AZUL-30', '7701234567893', 45000, 95000, true),
  ('var222-222-222-222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '32', 'Azul Oscuro', 'JEA-SLI-AZUL-32', '7701234567894', 45000, 95000, true),
  ('var222-222-222-222-222222222223', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '34', 'Negro', 'JEA-SLI-NEG-34', '7701234567895', 48000, 98000, true),
  -- Chaquetas
  ('var333-333-333-333-333333333331', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'M', 'Negro', 'CHA-CUE-NEG-M', '7701234567896', 80000, 150000, true),
  ('var333-333-333-333-333333333332', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'L', 'Café', 'CHA-CUE-CAF-L', '7701234567897', 82000, 155000, true)
ON CONFLICT (id) DO NOTHING;

-- 4. Crear stock físico para las sedes
INSERT INTO stock_fisico (variante_id, sede_id, cantidad, stock_minimo)
VALUES 
  ('var111-111-111-111-111111111111', '00000000-0000-0000-0000-000000000001', 50, 10),
  ('var111-111-111-111-111111111112', '00000000-0000-0000-0000-000000000001', 35, 10),
  ('var111-111-111-111-111111111113', '00000000-0000-0000-0000-000000000001', 20, 10),
  ('var222-222-222-222-222222222221', '00000000-0000-0000-0000-000000000001', 15, 5),
  ('var222-222-222-222-222222222222', '00000000-0000-0000-0000-000000000001', 12, 5),
  ('var222-222-222-222-222222222223', '00000000-0000-0000-0000-000000000001', 8, 5),
  ('var333-333-333-333-333333333331', '00000000-0000-0000-0000-000000000001', 6, 3),
  ('var333-333-333-333-333333333332', '00000000-0000-0000-0000-000000000001', 4, 3)
ON CONFLICT DO NOTHING;

-- 5. Poblar el KARDEX con movimientos de prueba
-- Nota: El trigger actualizará automáticamente el stock_fisico
INSERT INTO kardex (variante_id, sede_id, tipo_mov, cantidad_mov, stock_anterior, stock_nuevo, costo_unitario, referencia_tipo, usuario_id)
VALUES 
  -- Compras (aumentan stock)
  ('var111-111-111-111-111111111111', '00000000-0000-0000-0000-000000000001', 'COMPRA', 30, 0, 30, 15000, 'COMPRA', '00000000-0000-0000-0000-000000000001'),
  ('var111-111-111-111-111111111111', '00000000-0000-0000-0000-000000000001', 'COMPRA', 20, 30, 50, 15000, 'COMPRA', '00000000-0000-0000-0000-000000000001'),
  ('var222-222-222-222-222222222221', '00000000-0000-0000-0000-000000000001', 'COMPRA', 15, 0, 15, 45000, 'COMPRA', '00000000-0000-0000-0000-000000000001'),
  ('var333-333-333-333-333333333331', '00000000-0000-0000-0000-000000000001', 'COMPRA', 6, 0, 6, 80000, 'COMPRA', '00000000-0000-0000-0000-000000000001'),
  -- Ventas (disminuyen stock)
  ('var111-111-111-111-111111111111', '00000000-0000-0000-0000-000000000001', 'VENTA', -5, 50, 45, 15000, 'VENTA', '00000000-0000-0000-0000-000000000001'),
  ('var111-111-111-111-111111111112', '00000000-0000-0000-0000-000000000001', 'VENTA', -3, 35, 32, 15000, 'VENTA', '00000000-0000-0000-0000-000000000001'),
  ('var222-222-222-222-222222222221', '00000000-0000-0000-0000-000000000001', 'VENTA', -2, 15, 13, 45000, 'VENTA', '00000000-0000-0000-0000-000000000001'),
  -- Ajustes (pueden ser positivos o negativos)
  ('var111-111-111-111-111111111113', '00000000-0000-0000-0000-000000000001', 'AJUSTE', -2, 22, 20, 15000, 'AJUSTE', '00000000-0000-0000-0000-000000000001'),
  ('var222-222-222-222-222222222223', '00000000-0000-0000-0000-000000000001', 'AJUSTE', 3, 5, 8, 48000, 'AJUSTE', '00000000-0000-0000-0000-000000000001'),
  -- Devoluciones (aumentan stock)
  ('var111-111-111-111-111111111111', '00000000-0000-0000-0000-000000000001', 'DEVOLUCION', 2, 45, 47, 15000, 'VENTA', '00000000-0000-0000-0000-000000000001');

-- 6. Verificar datos
SELECT 
  'Categorías' as tabla, count(*) as registros FROM categorias
UNION ALL
SELECT 'Productos', count(*) FROM productos
UNION ALL
SELECT 'Variantes', count(*) FROM variantes
UNION ALL
SELECT 'Stock Físico', count(*) FROM stock_fisico
UNION ALL
SELECT 'Kardex', count(*) FROM kardex;

-- 7. Mostrar resumen del Kardex
SELECT 
  k.tipo_mov,
  count(*) as movimientos,
  sum(k.cantidad_mov) as unidades_net,
  sum(k.cantidad_mov * coalesce(k.costo_unitario, 0)) as valor_total
FROM kardex k
GROUP BY k.tipo_mov
ORDER BY k.tipo_mov;

SELECT 'Datos de prueba insertados correctamente!' as resultado;
