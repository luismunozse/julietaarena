# Fix: Error al crear propiedades

## Problema identificado

Al intentar agregar una cochera (o cualquier propiedad) se produce un error. El problema tiene dos causas:

### 1. Campos `created_by` y `updated_by` no se establecen automáticamente

**Causa**: La tabla `properties` en Supabase tiene campos `created_by` y `updated_by` que hacen referencia al usuario autenticado, pero no había triggers para establecerlos automáticamente.

**Impacto**:
- Las políticas RLS requieren estos campos para UPDATE y DELETE
- Sin estos campos, las operaciones fallan silenciosamente

### 2. Campo `currency` faltante en initialData

**Causa**: El campo `currency` es requerido en la base de datos (agregado recientemente), pero no estaba en el initialData de la página de nueva propiedad.

## Soluciones implementadas

### ✅ 1. Script SQL para agregar triggers automáticos

Se creó el archivo `scripts/fix-user-tracking.sql` que debes ejecutar en Supabase:

```sql
-- Este script crea un trigger que establece automáticamente
-- created_by y updated_by cuando se crea o actualiza una propiedad

CREATE OR REPLACE FUNCTION set_user_tracking()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = auth.uid();
    NEW.updated_by = auth.uid();
  END IF;

  IF TG_OP = 'UPDATE' THEN
    NEW.updated_by = auth.uid();
    NEW.created_by = OLD.created_by;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_properties_user_tracking ON properties;
CREATE TRIGGER set_properties_user_tracking
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION set_user_tracking();
```

**Cómo ejecutarlo:**
1. Ve a Supabase Dashboard
2. Abre SQL Editor
3. Copia y pega el contenido de `scripts/fix-user-tracking.sql`
4. Ejecuta el script

### ✅ 2. Agregado campo currency a initialData

Actualizado `src/app/admin/propiedades/nueva/page.tsx` para incluir `currency: 'USD'` en el initialData.

### ✅ 3. Mejorado manejo de errores

Actualizado `src/hooks/useProperties.ts` para mostrar detalles completos del error en consola:
- Mensaje del error
- Detalles técnicos
- Código de error
- Sugerencias (hints)

## Pasos para resolver el error

1. **Ejecuta el script SQL en Supabase:**
   ```bash
   # El script está en:
   scripts/fix-user-tracking.sql
   ```

2. **Reinicia el servidor de desarrollo:**
   ```bash
   # Detén npm run dev (Ctrl+C)
   npm run dev
   ```

3. **Verifica en la consola del navegador:**
   - Abre las DevTools (F12)
   - Ve a la pestaña Console
   - Intenta crear una propiedad
   - Si hay algún error, ahora verás los detalles completos

## Verificación

Después de ejecutar el script SQL, intenta:

1. Crear una nueva cochera con estos datos mínimos:
   - **Título**: Cochera en Nueva Córdoba
   - **Descripción**: Cochera cubierta con portón automático
   - **Precio**: 30000 (USD)
   - **Ubicación**: Nueva Córdoba, Córdoba
   - **Área**: 15 m²
   - **Al menos 1 imagen**

2. Si funciona correctamente verás:
   - "Propiedad creada exitosamente"
   - Redirección a /admin/propiedades
   - La cochera aparece en la lista

3. En la consola del navegador verás:
   - "Datos a enviar a Supabase: {..."
   - "Propiedad creada exitosamente: [...]"

## Cambios realizados en archivos

### Scripts SQL
- ✅ `scripts/supabase-setup.sql` - Agregados triggers para user tracking
- ✅ `scripts/fix-user-tracking.sql` - Script de fix independiente

### Frontend
- ✅ `src/app/admin/propiedades/nueva/page.tsx` - Agregado currency a initialData
- ✅ `src/hooks/useProperties.ts` - Mejorado logging de errores

## Notas adicionales

- El script SQL también actualiza `scripts/supabase-setup.sql` completo
- Si tu base de datos ya existe, solo ejecuta `fix-user-tracking.sql`
- Los triggers se aplicarán automáticamente a todas las propiedades futuras
- Las propiedades existentes no se verán afectadas
