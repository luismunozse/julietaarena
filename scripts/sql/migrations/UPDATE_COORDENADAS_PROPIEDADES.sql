-- Actualizar coordenadas de las propiedades existentes

-- 1. Primero agregar las columnas (si aún no existen)
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- 2. Actualizar la cochera en Alberdi (Jose Miguel Urrutia 164)
-- Barrio Alberdi, Córdoba
UPDATE properties
SET latitude = -31.4000, longitude = -64.2000
WHERE id = 'prop-1762696415957';

-- 3. Actualizar el local en Centro (Belgrano 157)
-- Calle Belgrano en el Centro de Córdoba
UPDATE properties
SET latitude = -31.4200, longitude = -64.1888
WHERE id = 'prop-1762692615498';

-- 4. Verificar que se actualizaron correctamente
SELECT id, title, location, latitude, longitude
FROM properties
ORDER BY title;
