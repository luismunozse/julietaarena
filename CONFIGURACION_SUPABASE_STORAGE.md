# Configuración de Supabase Storage para Imágenes

## ✅ Configuración Completada

### 1. Next.js configurado
- ✅ Dominio de Supabase agregado a `next.config.js`
- ✅ Hostname: `hrpkcdzgbpzzatusmqyq.supabase.co`
- ✅ Path: `/storage/v1/object/public/**`

### 2. Código de Storage
- ✅ Bucket: `property-images`
- ✅ Funciones implementadas en `src/lib/storage.ts`

## 🔧 Pasos en Supabase Dashboard

### Paso 1: Verificar que el bucket sea público

1. **Ir a Storage** en Supabase Dashboard
2. **Seleccionar el bucket** `property-images`
3. **Hacer clic en Settings** (⚙️) del bucket
4. **Verificar que "Public bucket" esté activado**

Si no está marcado como público:
- Haz clic en el toggle para hacerlo público
- Confirma el cambio

### Paso 2: Configurar políticas de acceso (RLS)

Ir a **Storage → Policies** y ejecutar este SQL en el SQL Editor:

```sql
-- Política para permitir lectura pública de imágenes
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-images' );

-- Política para permitir subir imágenes a usuarios autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'property-images' );

-- Política para permitir actualizar imágenes a usuarios autenticados
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'property-images' );

-- Política para permitir eliminar imágenes a usuarios autenticados
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'property-images' );
```

### Paso 3: Verificar configuración

Ejecuta este query para ver las políticas existentes:

```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects';
```

Deberías ver 4 políticas para el bucket `property-images`.

## 🧪 Probar la Configuración

### 1. Subir una imagen de prueba
1. Ve a http://localhost:3000/admin/propiedades/nueva
2. Sube una imagen usando el componente de carga
3. Verifica que se vea la vista previa

### 2. Crear una propiedad completa
1. Llena todos los campos del formulario
2. Sube al menos una imagen
3. Guarda la propiedad
4. Verifica que se redireccione correctamente
5. Verifica que las imágenes se muestren en la lista

### 3. Verificar en Supabase
1. Ve a **Storage → property-images** en Supabase
2. Deberías ver las imágenes organizadas por carpetas
3. Haz clic en una imagen para ver la URL pública

## 🔍 URLs de las Imágenes

Las URLs públicas deberían verse así:

```
https://hrpkcdzgbpzzatusmqyq.supabase.co/storage/v1/object/public/property-images/[propertyId]/[timestamp]-[random].[ext]
```

Ejemplo real:
```
https://hrpkcdzgbpzzatusmqyq.supabase.co/storage/v1/object/public/property-images/general/1762666693-abc123.webp
```

## ⚠️ Solución de Problemas

### Error: "new row violates row-level security policy"
**Causa**: El bucket no tiene políticas configuradas para autenticados
**Solución**: Ejecuta el SQL del Paso 2

### Error: "Invalid src prop... hostname is not configured"
**Causa**: Next.js no reconoce el dominio
**Solución**:
1. Verifica que `next.config.js` tenga el hostname correcto
2. Reinicia el servidor de desarrollo (ya lo hicimos)

### Las imágenes no se ven
**Causa**: El bucket no es público
**Solución**: Marca el bucket como público en Settings

### Error al subir imágenes
**Causa**: Usuario no autenticado o falta política INSERT
**Solución**:
1. Asegúrate de estar logueado
2. Verifica las políticas con el SQL del Paso 3

## 📊 Estructura de Carpetas

Las imágenes se organizan así en Supabase Storage:

```
property-images/
├── general/              # Imágenes sin propertyId asignado
│   ├── 1762666693-abc123.webp
│   └── 1762667234-def456.jpg
├── [propertyId-1]/       # Imágenes de una propiedad específica
│   ├── 1762668000-ghi789.jpg
│   └── 1762668500-jkl012.png
└── [propertyId-2]/
    └── 1762669000-mno345.webp
```

## 🚀 Ventajas de Supabase Storage

1. ✅ **Integrado con tu backend**: Todo en un solo lugar
2. ✅ **Sin costos externos**: No necesitas Cloudinary
3. ✅ **RLS**: Control granular de acceso
4. ✅ **CDN incluido**: Las imágenes se sirven rápido
5. ✅ **Optimización automática**: Supabase optimiza las imágenes
6. ✅ **Sin límite de tráfico** (en plan Free: 1GB storage, 2GB bandwidth)

## 📝 Checklist Final

- [ ] Bucket `property-images` creado
- [ ] Bucket marcado como público
- [ ] Políticas RLS configuradas (4 políticas)
- [ ] `next.config.js` actualizado con hostname de Supabase
- [ ] Servidor de desarrollo reiniciado
- [ ] Imagen de prueba subida exitosamente
- [ ] Imágenes visibles en la lista de propiedades

Una vez completados todos los pasos, las imágenes deberían funcionar perfectamente! 🎉
