-- ============================================================
-- MILAN POS — SECCIÓN 0: EXTENSIONES Y SETUP
-- Ejecutar PRIMERO en SQL Editor de Supabase
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tipo ENUM reutilizable para roles del sistema
DO $$ BEGIN
  CREATE TYPE rol_sistema AS ENUM ('admin', 'supervisor', 'cajero');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
