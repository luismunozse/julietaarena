# Fix Supabase Permissions - Permitir Eliminar Propiedades

## Problema
Las propiedades no se pueden eliminar desde el panel de administración porque faltan permisos RLS (Row Level Security) en Supabase.

## Solución

Ve al panel de Supabase y ejecuta este SQL en el SQL Editor:

```sql
-- 1. Verificar políticas actuales
SELECT * FROM pg_policies WHERE tablename = 'properties';

-- 2. Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON properties;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON properties;

-- 3. Crear política para permitir DELETE a usuarios autenticados
CREATE POLICY "Allow authenticated users to delete properties"
ON properties
FOR DELETE
TO authenticated
USING (true);

-- 4. Verificar que se creó correctamente
SELECT * FROM pg_policies WHERE tablename = 'properties';
```

## Pasos

1. **Abre Supabase Dashboard**: https://supabase.com/dashboard
2. **Selecciona tu proyecto**
3. **Ve a SQL Editor** (icono de base de datos en el menú lateral)
4. **Copia y pega el SQL de arriba**
5. **Haz clic en "Run"**
6. **Verifica que las 4 políticas básicas existen**:
   - SELECT para usuarios autenticados ✓
   - INSERT para usuarios autenticados ✓
   - UPDATE para usuarios autenticados ✓
   - DELETE para usuarios autenticados ✓

## Verificación

Después de ejecutar el SQL:

1. Vuelve al dashboard en http://localhost:3001/admin/propiedades
2. Abre la consola del navegador (F12 → Console)
3. Intenta eliminar una propiedad
4. Verás logs detallados que indican si funcionó o qué error ocurrió

## Si aún no funciona

Verifica en los logs de la consola:
- ¿El ID de la propiedad es correcto?
- ¿Hay algún error de permisos?
- ¿El usuario está autenticado correctamente?

Comparte los logs de la consola para más ayuda.
