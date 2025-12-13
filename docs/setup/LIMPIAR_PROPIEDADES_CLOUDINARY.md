# Limpiar Propiedades con Imágenes de Cloudinary

## 🎯 Problema

Las propiedades creadas antes de migrar a Supabase Storage tienen URLs de Cloudinary:
```
https://res.cloudinary.com/dhbw0kgkl/image/upload/...
```

Como Cloudinary ya no forma parte del proyecto, estas imágenes no se pueden mostrar y causan errores.

## ✅ Solución: Eliminar Propiedades Antiguas

Ve a **Supabase Dashboard → SQL Editor** y ejecuta este SQL:

### Opción 1: Ver cuántas propiedades tienen Cloudinary

Primero verifica cuántas propiedades serían afectadas:

```sql
-- Ver propiedades con imágenes de Cloudinary
SELECT
  id,
  title,
  images,
  created_at
FROM properties
WHERE images::text LIKE '%cloudinary%'
ORDER BY created_at DESC;
```

### Opción 2: Eliminar solo propiedades con Cloudinary

Si quieres eliminar SOLO las propiedades que usan Cloudinary:

```sql
-- Eliminar propiedades con imágenes de Cloudinary
DELETE FROM properties
WHERE images::text LIKE '%cloudinary%';

-- Verificar que se eliminaron
SELECT COUNT(*) as total_propiedades FROM properties;
```

### Opción 3: Eliminar TODAS las propiedades (empezar de cero)

Si prefieres limpiar toda la base de datos y empezar de cero:

```sql
-- Eliminar todas las propiedades
DELETE FROM properties;

-- Verificar que la tabla está vacía
SELECT COUNT(*) as total_propiedades FROM properties;
```

## 🔧 Después de Ejecutar el SQL

1. **Recarga la página** en http://localhost:3001/admin/propiedades
2. **Verifica** que no haya propiedades viejas con Cloudinary
3. **Crea nuevas propiedades** usando Supabase Storage

## 📊 Explicación

### ¿Por qué pasa esto?

Cuando creaste propiedades antes, las imágenes se subían a Cloudinary y se guardaban URLs como:
```
https://res.cloudinary.com/dhbw0kgkl/image/upload/v1762666693/evpojakq5cwkafns2iig.webp
```

Ahora que migraste a Supabase Storage, las nuevas imágenes tienen URLs como:
```
https://hrpkcdzgbpzzatusmqyq.supabase.co/storage/v1/object/public/property-images/general/...
```

Las propiedades viejas siguen teniendo las URLs de Cloudinary, y como Cloudinary no está configurado en `next.config.js`, Next.js no puede cargar esas imágenes.

### ¿Cuál opción elegir?

**Opción 1** (Ver): Solo para saber cuántas hay
**Opción 2** (Eliminar con Cloudinary): Si quieres conservar otras propiedades
**Opción 3** (Eliminar todas): Si estás en desarrollo y no tienes datos importantes

## ⚠️ IMPORTANTE

- Estas operaciones **NO se pueden deshacer**
- Asegúrate de no tener propiedades importantes antes de ejecutar DELETE
- Si tienes datos importantes, haz un backup primero

## 🚀 Alternativa: Migrar las Imágenes

Si tienes muchas propiedades y NO quieres perderlas, puedes:

1. Descargar las imágenes de Cloudinary manualmente
2. Subirlas a Supabase Storage
3. Actualizar las URLs en la base de datos

Pero si estás en desarrollo y no tienes datos críticos, es más fácil eliminar y crear nuevas propiedades.

## ✅ Verificación Final

Después de ejecutar el SQL, ve a:
- http://localhost:3001/admin/propiedades
- http://localhost:3001/propiedades/resultado?operation=venta

**NO debería haber errores** de Cloudinary en la consola.
