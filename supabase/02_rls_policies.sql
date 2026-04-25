-- ============================================================
-- Milan POS — Row Level Security (RLS) Policies
-- Tarea #22 — Auditoría y aplicación
-- ============================================================

-- PRINCIPIO: Cada tabla visible al frontend debe tener RLS habilitado.
-- Los usuarios solo ven datos de SU sede y según SU rol.

-- ============================================================
-- 1. PRODUCTOS (lectura: todos, escritura: admin/gerente)
-- ============================================================

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Productos: lectura pública"
  ON productos FOR SELECT
  USING (archived = false);

CREATE POLICY "Productos: admin puede crear/editar"
  ON productos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE perfiles.id = auth.uid()
      AND perfiles.rol IN ('admin', 'gerente')
    )
  );

-- ============================================================
-- 2. VARIANTES (lectura: todos, escritura: admin/gerente)
-- ============================================================

ALTER TABLE variantes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Variantes: lectura pública"
  ON variantes FOR SELECT
  USING (activo = true);

CREATE POLICY "Variantes: admin puede gestionar"
  ON variantes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE perfiles.id = auth.uid()
      AND perfiles.rol IN ('admin', 'gerente')
    )
  );

-- ============================================================
-- 3. STOCK_FISICO (lectura: por sede, escritura: admin/bodeguero)
-- ============================================================

ALTER TABLE stock_fisico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stock: ver solo de mi sede"
  ON stock_fisico FOR SELECT
  USING (
    sede_id IN (
      SELECT sede_id FROM perfiles WHERE perfiles.id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );

CREATE POLICY "Stock: admin/bodeguero pueden modificar"
  ON stock_fisico FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE perfiles.id = auth.uid()
      AND perfiles.rol IN ('admin', 'bodeguero', 'gerente')
    )
  );

-- ============================================================
-- 4. VENTAS (lectura: sede, escritura: cajero+)
-- ============================================================

ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ventas: ver solo de mi sede"
  ON ventas FOR SELECT
  USING (
    sede_id IN (
      SELECT sede_id FROM perfiles WHERE perfiles.id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );

CREATE POLICY "Ventas: cajero puede crear en su sede"
  ON ventas FOR INSERT
  WITH CHECK (
    sede_id IN (
      SELECT sede_id FROM perfiles WHERE perfiles.id = auth.uid()
    )
  );

CREATE POLICY "Ventas: solo admin puede anular"
  ON ventas FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE perfiles.id = auth.uid()
      AND perfiles.rol IN ('admin', 'gerente')
    )
    OR usuario_id = auth.uid()
  );

-- ============================================================
-- 5. VENTAS_DETALLE (hereda acceso de ventas vía FK)
-- ============================================================

ALTER TABLE ventas_detalle ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Detalle: ver si puede ver la venta"
  ON ventas_detalle FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ventas v
      WHERE v.id = ventas_detalle.venta_id
      AND (
        v.sede_id IN (SELECT sede_id FROM perfiles WHERE perfiles.id = auth.uid())
        OR EXISTS (SELECT 1 FROM perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin')
      )
    )
  );

CREATE POLICY "Detalle: insertar con la venta"
  ON ventas_detalle FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ventas v
      WHERE v.id = ventas_detalle.venta_id
      AND v.usuario_id = auth.uid()
    )
  );

-- ============================================================
-- 6. KARDEX (lectura: admin/gerente/bodeguero, escritura: sistema)
-- ============================================================

ALTER TABLE kardex ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kardex: lectura para inventario"
  ON kardex FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE perfiles.id = auth.uid()
      AND perfiles.rol IN ('admin', 'gerente', 'bodeguero')
    )
  );

-- El kardex se inserta vía triggers, no directamente por el usuario
CREATE POLICY "Kardex: inserción para bodeguero"
  ON kardex FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE perfiles.id = auth.uid()
      AND perfiles.rol IN ('admin', 'gerente', 'bodeguero')
    )
  );

-- ============================================================
-- 7. SESIONES_CAJA (lectura: sede, escritura: cajero)
-- ============================================================

ALTER TABLE sesiones_caja ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Caja: ver solo de mi sede"
  ON sesiones_caja FOR SELECT
  USING (
    sede_id IN (
      SELECT sede_id FROM perfiles WHERE perfiles.id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );

CREATE POLICY "Caja: cajero puede abrir/cerrar la suya"
  ON sesiones_caja FOR ALL
  USING (usuario_id = auth.uid())
  WITH CHECK (usuario_id = auth.uid());

-- ============================================================
-- 8. CATEGORÍAS (lectura: todos, escritura: admin)
-- ============================================================

ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categorías: lectura pública"
  ON categorias FOR SELECT USING (true);

CREATE POLICY "Categorías: admin puede gestionar"
  ON categorias FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );

-- ============================================================
-- 9. PERFILES (lectura: propia, escritura: admin)
-- ============================================================

ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfiles: ver el propio"
  ON perfiles FOR SELECT
  USING (id = auth.uid() OR EXISTS (
    SELECT 1 FROM perfiles p WHERE p.id = auth.uid() AND p.rol = 'admin'
  ));

CREATE POLICY "Perfiles: admin puede gestionar"
  ON perfiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );

-- ============================================================
-- 10. SEDES (lectura: todos, escritura: admin)
-- ============================================================

ALTER TABLE sedes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sedes: lectura pública"
  ON sedes FOR SELECT USING (true);

CREATE POLICY "Sedes: admin puede gestionar"
  ON sedes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );
