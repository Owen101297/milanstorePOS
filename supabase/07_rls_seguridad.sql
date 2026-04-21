-- ============================================================
-- MILAN POS — SECCIÓN 7: ROW LEVEL SECURITY (RLS) BLINDADA
-- Ejecutar ÚLTIMO en SQL Editor de Supabase
-- ============================================================

-- Habilitar RLS en todas las tablas críticas
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE variantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_fisico ENABLE ROW LEVEL SECURITY;
ALTER TABLE kardex ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas_detalle ENABLE ROW LEVEL SECURITY;
ALTER TABLE caja_sesiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_actividad ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────
-- 7.1 PERFILES
-- ─────────────────────────────────────────
CREATE POLICY "perfil_select_propio" ON perfiles
  FOR SELECT USING (id = auth.uid() OR get_my_role() = 'admin');

CREATE POLICY "perfil_update_propio" ON perfiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "perfil_admin_full" ON perfiles
  FOR ALL USING (get_my_role() = 'admin');

-- ─────────────────────────────────────────
-- 7.2 PRODUCTOS / VARIANTES
-- ─────────────────────────────────────────
CREATE POLICY "productos_lectura_todos" ON productos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "productos_admin_crud" ON productos
  FOR ALL USING (get_my_role() = 'admin');

CREATE POLICY "variantes_lectura_todos" ON variantes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "variantes_admin_crud" ON variantes
  FOR ALL USING (get_my_role() = 'admin');

-- ─────────────────────────────────────────
-- 7.3 STOCK: Cajeros solo ven su sede
-- ─────────────────────────────────────────
CREATE POLICY "stock_por_sede" ON stock_fisico
  FOR SELECT USING (
    sede_id = get_my_sede() OR get_my_role() IN ('admin', 'supervisor')
  );

CREATE POLICY "stock_admin_write" ON stock_fisico
  FOR ALL USING (get_my_role() IN ('admin', 'supervisor'));

-- ─────────────────────────────────────────
-- 7.4 KARDEX: Inmutable — solo INSERT y SELECT
-- ─────────────────────────────────────────
CREATE POLICY "kardex_lectura_sede" ON kardex
  FOR SELECT USING (
    sede_id = get_my_sede() OR get_my_role() IN ('admin', 'supervisor')
  );

CREATE POLICY "kardex_insert_auth" ON kardex
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- 7.5 VENTAS
-- ─────────────────────────────────────────
CREATE POLICY "ventas_por_sede" ON ventas
  FOR SELECT USING (
    sede_id = get_my_sede() OR get_my_role() IN ('admin', 'supervisor')
  );

CREATE POLICY "ventas_crear_auth" ON ventas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "ventas_anular_admin" ON ventas
  FOR UPDATE USING (get_my_role() = 'admin');

CREATE POLICY "ventas_detalle_lectura" ON ventas_detalle
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ventas v WHERE v.id = venta_id
      AND (v.sede_id = get_my_sede() OR get_my_role() IN ('admin', 'supervisor'))
    )
  );

CREATE POLICY "ventas_detalle_insert" ON ventas_detalle
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- 7.6 CAJA
-- ─────────────────────────────────────────
CREATE POLICY "caja_sesion_propia" ON caja_sesiones
  FOR SELECT USING (
    cajero_id = auth.uid() OR get_my_role() IN ('admin', 'supervisor')
  );

CREATE POLICY "caja_crear" ON caja_sesiones
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "caja_cerrar" ON caja_sesiones
  FOR UPDATE USING (cajero_id = auth.uid() OR get_my_role() = 'admin');

-- ─────────────────────────────────────────
-- 7.7 CLIENTES
-- ─────────────────────────────────────────
CREATE POLICY "clientes_lectura" ON clientes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "clientes_crear" ON clientes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "clientes_admin_crud" ON clientes
  FOR ALL USING (get_my_role() IN ('admin', 'supervisor'));

-- ─────────────────────────────────────────
-- 7.8 LOGS: Solo admin lee. Nadie edita ni borra.
-- ─────────────────────────────────────────
CREATE POLICY "logs_solo_admin" ON logs_actividad
  FOR SELECT USING (get_my_role() = 'admin');

CREATE POLICY "logs_insert_sistema" ON logs_actividad
  FOR INSERT WITH CHECK (true);
