-- ============================================================
-- MILAN POS — SECCIÓN 1: AUTENTICACIÓN, PERFILES Y RBAC
-- Ejecutar SEGUNDO en SQL Editor de Supabase
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

-- 1.3 Trigger: Auto-crear perfil al registrar usuario en auth.users
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

-- 1.4 Helper: Obtener rol del usuario actual
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS rol_sistema AS $$
  SELECT rol FROM perfiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 1.5 Helper: Obtener sede_id del usuario actual
CREATE OR REPLACE FUNCTION get_my_sede()
RETURNS UUID AS $$
  SELECT sede_id FROM perfiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;
