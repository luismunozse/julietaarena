# Fix Supabase - Agregar Columna Currency

## Problema
No se pueden crear propiedades porque falta la columna `currency` en la tabla `properties` de Supabase.

**Error**:
```
Could not find the 'currency' column of 'properties' in the schema cache
```

## Solución

Ve al panel de Supabase y ejecuta este SQL en el SQL Editor:

```sql
-- 1. Agregar columna currency a la tabla properties
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'USD'
CHECK (currency IN ('ARS', 'USD'));

-- 2. Actualizar propiedades existentes si las hay
UPDATE properties
SET currency = 'USD'
WHERE currency IS NULL;

-- 3. Verificar que la columna se agregó correctamente
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'properties'
AND column_name = 'currency';

-- 4. Ver todas las columnas de la tabla para confirmar
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'properties'
ORDER BY ordinal_position;
```

## Pasos

1. **Abre Supabase Dashboard**: https://supabase.com/dashboard
2. **Selecciona tu proyecto**
3. **Ve a SQL Editor** (icono de base de datos en el menú lateral)
4. **Copia y pega el SQL de arriba**
5. **Haz clic en "Run"**
6. **Verifica que la columna `currency` aparezca en la lista**

## Verificación

Después de ejecutar el SQL:

1. En el SQL Editor, deberías ver que `currency` tiene:
   - **Tipo**: text
   - **Default**: 'USD'
   - **Constraint**: CHECK (currency IN ('ARS', 'USD'))

2. Vuelve a tu aplicación en http://localhost:3001/admin/propiedades/nueva
3. Intenta crear una nueva propiedad
4. Debería funcionar correctamente ahora

## Columnas que debe tener la tabla `properties`

Después de ejecutar el script, tu tabla debe tener todas estas columnas:

- id (text, primary key)
- title (text)
- description (text)
- price (numeric)
- **currency (text)** ← Nueva columna agregada
- location (text)
- type (text)
- bedrooms (integer)
- bathrooms (integer)
- area (numeric)
- covered_area (numeric)
- images (text[])
- features (text[])
- status (text)
- featured (boolean)
- year_built (integer)
- parking (integer)
- floor (integer)
- total_floors (integer)
- orientation (text)
- expenses (numeric)
- operation (text)
- broker_name (text)
- broker_phone (text)
- broker_email (text)
- broker_avatar (text)
- latitude (numeric)
- longitude (numeric)
- created_at (timestamp)
- updated_at (timestamp)

## Si sigue sin funcionar

Comparte el resultado del último query (paso 4) que muestra todas las columnas de la tabla.
