-- =====================================================
-- JULIETA ARENA - CONFIGURACIÓN DE SUPABASE
-- =====================================================
-- Este script crea toda la estructura de base de datos necesaria
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. CREAR TABLA DE PROPIEDADES
-- =====================================================

CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('ARS', 'USD')),
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('casa', 'departamento', 'terreno', 'local', 'oficina', 'cochera')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area NUMERIC NOT NULL,
  covered_area NUMERIC,
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'reservado', 'vendido')),
  featured BOOLEAN DEFAULT FALSE,
  year_built INTEGER,
  parking INTEGER,
  floor INTEGER,
  total_floors INTEGER,
  orientation TEXT,
  expenses NUMERIC,
  operation TEXT NOT NULL CHECK (operation IN ('venta', 'alquiler')),
  broker_name TEXT,
  broker_phone TEXT,
  broker_email TEXT,
  broker_avatar TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- 2. CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

-- Índice para búsquedas por tipo
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);

-- Índice para búsquedas por operación
CREATE INDEX IF NOT EXISTS idx_properties_operation ON properties(operation);

-- Índice para búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- Índice para propiedades destacadas
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured) WHERE featured = TRUE;

-- Índice para búsquedas por ubicación
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties USING gin(to_tsvector('spanish', location));

-- Índice para búsquedas por rango de precio
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);

-- Índice compuesto para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_properties_type_operation_status
  ON properties(type, operation, status);

-- Índice para ordenar por fecha de creación
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 4. CREAR POLÍTICAS DE SEGURIDAD
-- =====================================================

-- Política: Todos pueden LEER propiedades disponibles
DROP POLICY IF EXISTS "Cualquiera puede ver propiedades" ON properties;
CREATE POLICY "Cualquiera puede ver propiedades"
  ON properties
  FOR SELECT
  TO public
  USING (true);

-- Política: Solo usuarios autenticados pueden CREAR propiedades
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear propiedades" ON properties;
CREATE POLICY "Usuarios autenticados pueden crear propiedades"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Política: Solo el creador puede ACTUALIZAR sus propiedades
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propiedades" ON properties;
CREATE POLICY "Usuarios pueden actualizar sus propiedades"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by OR auth.uid() = updated_by)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Política: Solo el creador puede ELIMINAR sus propiedades
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propiedades" ON properties;
CREATE POLICY "Usuarios pueden eliminar sus propiedades"
  ON properties
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- 5. CREAR FUNCIÓN PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. CREAR TRIGGER PARA updated_at
-- =====================================================

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6.1. CREAR FUNCIÓN PARA ESTABLECER created_by Y updated_by AUTOMÁTICAMENTE
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

-- 6.2. CREAR TRIGGER PARA created_by Y updated_by
-- =====================================================

DROP TRIGGER IF EXISTS set_properties_user_tracking ON properties;
CREATE TRIGGER set_properties_user_tracking
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION set_user_tracking();

-- 7. CREAR FUNCIÓN DE BÚSQUEDA AVANZADA
-- =====================================================

CREATE OR REPLACE FUNCTION search_properties(
  search_text TEXT DEFAULT NULL,
  property_type TEXT DEFAULT NULL,
  property_operation TEXT DEFAULT NULL,
  min_price NUMERIC DEFAULT NULL,
  max_price NUMERIC DEFAULT NULL,
  min_area NUMERIC DEFAULT NULL,
  max_area NUMERIC DEFAULT NULL,
  min_bedrooms INTEGER DEFAULT NULL,
  min_bathrooms INTEGER DEFAULT NULL,
  property_status TEXT DEFAULT 'disponible'
)
RETURNS SETOF properties AS $$
BEGIN
  RETURN QUERY
  SELECT p.*
  FROM properties p
  WHERE
    (property_status IS NULL OR p.status = property_status)
    AND (property_type IS NULL OR p.type = property_type)
    AND (property_operation IS NULL OR p.operation = property_operation)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
    AND (min_area IS NULL OR p.area >= min_area)
    AND (max_area IS NULL OR p.area <= max_area)
    AND (min_bedrooms IS NULL OR p.bedrooms >= min_bedrooms)
    AND (min_bathrooms IS NULL OR p.bathrooms >= min_bathrooms)
    AND (
      search_text IS NULL OR
      to_tsvector('spanish', p.title || ' ' || p.description || ' ' || p.location)
      @@ plainto_tsquery('spanish', search_text)
    )
  ORDER BY p.featured DESC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 8. CREAR VISTA PARA ESTADÍSTICAS
-- =====================================================

CREATE OR REPLACE VIEW properties_stats AS
WITH type_counts AS (
  SELECT
    type,
    COUNT(*) as count
  FROM properties
  WHERE status = 'disponible'
  GROUP BY type
)
SELECT
  (SELECT COUNT(*) FROM properties) AS total_properties,
  (SELECT COUNT(*) FROM properties WHERE status = 'disponible') AS available_properties,
  (SELECT COUNT(*) FROM properties WHERE status = 'reservado') AS reserved_properties,
  (SELECT COUNT(*) FROM properties WHERE status = 'vendido') AS sold_properties,
  (SELECT COUNT(*) FROM properties WHERE operation = 'venta') AS for_sale,
  (SELECT COUNT(*) FROM properties WHERE operation = 'alquiler') AS for_rent,
  (SELECT COUNT(*) FROM properties WHERE featured = TRUE) AS featured_properties,
  (SELECT AVG(price) FROM properties WHERE operation = 'venta') AS avg_sale_price,
  (SELECT AVG(price) FROM properties WHERE operation = 'alquiler') AS avg_rent_price,
  (SELECT MIN(price) FROM properties) AS min_price,
  (SELECT MAX(price) FROM properties) AS max_price,
  (SELECT json_object_agg(type, count) FROM type_counts) AS properties_by_type;

-- 9. CONCEDER PERMISOS A LA VISTA
-- =====================================================

GRANT SELECT ON properties_stats TO authenticated, anon;

-- =====================================================
-- CONFIGURACIÓN COMPLETADA
-- =====================================================

-- Para verificar que todo funcionó correctamente:
-- SELECT * FROM properties_stats;

-- Para probar la función de búsqueda:
-- SELECT * FROM search_properties('palermo', 'departamento', 'alquiler');
