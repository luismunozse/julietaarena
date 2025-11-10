-- =====================================================
-- FIX PARA created_by y updated_by
-- =====================================================
-- Ejecutar este script en Supabase Dashboard > SQL Editor
-- Este script agrega triggers para manejar automáticamente
-- los campos created_by y updated_by
-- =====================================================

-- 1. CREAR FUNCIÓN PARA ESTABLECER created_by Y updated_by AUTOMÁTICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION set_user_tracking()
RETURNS TRIGGER AS $$
BEGIN
  -- En INSERT, establecer created_by y updated_by
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = auth.uid();
    NEW.updated_by = auth.uid();
  END IF;

  -- En UPDATE, solo actualizar updated_by
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_by = auth.uid();
    NEW.created_by = OLD.created_by; -- Preservar el creador original
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. CREAR TRIGGER PARA created_by Y updated_by
-- =====================================================

DROP TRIGGER IF EXISTS set_properties_user_tracking ON properties;
CREATE TRIGGER set_properties_user_tracking
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION set_user_tracking();

-- =====================================================
-- FIX COMPLETADO
-- =====================================================
