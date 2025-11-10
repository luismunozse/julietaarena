# Debugging: Error al crear propiedades

## Resumen del problema

- **Síntoma**: La página se refresca cuando se intenta crear una propiedad
- **Comportamiento observado**: Las imágenes se suben a Cloudinary exitosamente, pero luego la página se refresca
- **Logs faltantes**: Los logs de debug (🚀, 📋, ✅) no aparecen en la consola

## Cambios implementados para debugging

He agregado logging extensivo en todos los puntos clave del proceso de creación de propiedades:

### 1. ImageUpload.tsx - Subida de imágenes

**Logs que verás**:
- `📁 Iniciando procesamiento de X archivos` - Cuando seleccionas imágenes
- `📤 Iniciando subida de imagen: nombre (XMB)` - Para cada imagen
- `✅ Imagen subida exitosamente: storage url...` - Cuando una imagen se sube
- `✅ Procesamiento de archivos completado` - Cuando todas las imágenes terminan
- `❌ Error al subir imagen: ...` - Si hay algún error

### 2. PropertyForm.tsx - Validación del formulario

**Logs que verás**:
- `🔄 PropertyForm handleSubmit llamado` - Cuando haces click en "Guardar Propiedad"
- `✅ preventDefault() ejecutado` - Confirmación de que se previno el comportamiento por defecto
- `⚠️ Errores de validación encontrados: {...}` - Si hay campos inválidos
- `✅ Validación exitosa, llamando a onSubmit con: {...}` - Si todo está bien

### 3. nueva/page.tsx - Creación en Supabase

**Logs que verás**:
- `🚀 Iniciando creación de propiedad...` - Al comenzar
- `📋 Datos del formulario: {...}` - Los datos que se van a guardar
- `✅ Resultado de createProperty: true/false` - Resultado de la operación
- `❌ Error capturado en handleSubmit: ...` - Si hay algún error

### 4. useProperties.ts - Inserción en base de datos

**Logs que verás**:
- `Datos a enviar a Supabase: {...}` - Datos preparados para Supabase
- `Propiedad creada exitosamente: [...]` - Si la inserción fue exitosa
- Detalles completos del error si falla

## Pasos para diagnosticar el problema

### Paso 1: Ejecutar el script SQL (CRÍTICO)

**IMPORTANTE**: El error podría estar relacionado con los campos `created_by` y `updated_by` que no se establecen automáticamente.

1. Abre Supabase Dashboard → SQL Editor
2. Ejecuta el archivo `scripts/fix-user-tracking.sql`
3. Verifica que el script se ejecutó sin errores

### Paso 2: Reiniciar el servidor de desarrollo

```bash
# Detén el servidor (Ctrl+C)
npm run dev
```

### Paso 3: Limpiar caché del navegador

1. Abre DevTools (F12)
2. Click derecho en el botón de recargar
3. Selecciona "Vaciar caché y recargar de forma forzada"

### Paso 4: Intentar crear una propiedad con la consola abierta

1. Abre DevTools (F12) → Pestaña Console
2. Ve a `/admin/propiedades/nueva`
3. Rellena el formulario completamente:
   - **Título**: Cochera en Nueva Córdoba
   - **Descripción**: Cochera cubierta con portón automático, amplia y segura
   - **Tipo**: Cochera
   - **Precio**: 30000 USD
   - **Ubicación**: Nueva Córdoba, Córdoba
   - **Área**: 15 m²
   - **Imágenes**: Al menos 1 imagen

4. **OBSERVA LA CONSOLA** mientras seleccionas imágenes y mientras haces click en "Guardar"

## Interpretación de los logs

### Escenario 1: Las imágenes se suben pero no hay logs de formulario

**Logs esperados**:
```
📁 Iniciando procesamiento de 1 archivos
✅ Archivos válidos: 1
📤 Iniciando subida de imagen: image.jpg (1.2MB)
✅ Imagen subida exitosamente: cloudinary https://...
✅ Procesamiento de archivos completado
```

**Luego al hacer click en "Guardar Propiedad"**:
- Si NO ves `🔄 PropertyForm handleSubmit llamado` → El click no está llegando al form
- Si NO ves `✅ preventDefault() ejecutado` → La página se podría estar refrescando

### Escenario 2: Hay errores de validación

**Logs esperados**:
```
🔄 PropertyForm handleSubmit llamado
✅ preventDefault() ejecutado
⚠️ Errores de validación encontrados: { images: 'Debes agregar al menos una imagen' }
```

**Acción**: Completa todos los campos requeridos

### Escenario 3: El formulario se envía pero falla en Supabase

**Logs esperados**:
```
🔄 PropertyForm handleSubmit llamado
✅ preventDefault() ejecutado
✅ Validación exitosa, llamando a onSubmit con: {...}
🚀 Iniciando creación de propiedad...
📋 Datos del formulario: {...}
Datos a enviar a Supabase: {...}
Error creating property in Supabase: {...}
Error details: { message: '...', code: '...' }
```

**Acción**: Revisar el mensaje de error de Supabase. Si menciona `created_by` o `updated_by`, ejecuta el script SQL del Paso 1.

### Escenario 4: Todo funciona correctamente

**Logs esperados**:
```
🔄 PropertyForm handleSubmit llamado
✅ preventDefault() ejecutado
✅ Validación exitosa, llamando a onSubmit con: {...}
🚀 Iniciando creación de propiedad...
📋 Datos del formulario: {...}
Datos a enviar a Supabase: {...}
Propiedad creada exitosamente: [...]
✅ Resultado de createProperty: true
```

**Resultado**: Alert "Propiedad creada exitosamente" y redirección a `/admin/propiedades`

## Problemas comunes y soluciones

### 1. "La página se refresca inmediatamente"

**Causa posible**:
- Código antiguo en caché del navegador
- Form submit sin preventDefault()

**Solución**:
1. Limpiar caché (Paso 3)
2. Verificar que ves el log `✅ preventDefault() ejecutado`

### 2. "No veo ningún log en la consola"

**Causa posible**:
- El servidor no se ha reiniciado
- El navegador tiene caché de la versión antigua

**Solución**:
1. Reiniciar servidor (Paso 2)
2. Limpiar caché y recargar (Paso 3)
3. Verificar que estás en la pestaña Console de DevTools

### 3. "Las imágenes se suben pero el formulario no se envía"

**Causa posible**:
- Error en la validación del formulario
- Campo requerido faltante

**Solución**:
1. Revisar logs de validación
2. Asegurarse de que todos los campos requeridos están completos

### 4. "Error en Supabase: Row Level Security"

**Causa posible**:
- Los campos `created_by` y `updated_by` no se establecen automáticamente
- No ejecutaste el script SQL

**Solución**:
1. Ejecutar `scripts/fix-user-tracking.sql` en Supabase (Paso 1)
2. Reintentar la creación

## Información adicional para debugging

Si después de seguir todos estos pasos el problema persiste, copia **TODOS** los logs de la consola desde que:
1. Abres la página `/admin/propiedades/nueva`
2. Seleccionas las imágenes
3. Llenas el formulario
4. Haces click en "Guardar Propiedad"

Los logs deberían verse así:

```
// Al cargar la página
[Logs de Google Maps - esperados]

// Al seleccionar imágenes
📁 Iniciando procesamiento de 1 archivos
✅ Archivos válidos: 1
📤 Iniciando subida de imagen: cochera.jpg (0.85MB)
Imagen subida a Cloudinary
✅ Imagen subida exitosamente: cloudinary https://res.cloudinary.com/...
✅ Imágenes procesadas exitosamente: 1
✅ Procesamiento de archivos completado

// Al hacer click en "Guardar Propiedad"
🔄 PropertyForm handleSubmit llamado
✅ preventDefault() ejecutado
✅ Validación exitosa, llamando a onSubmit con: { title: 'Cochera en Nueva Córdoba', ... }
🚀 Iniciando creación de propiedad...
📋 Datos del formulario: { ... }
Datos a enviar a Supabase: { ... }
Propiedad creada exitosamente: [{ id: '...', ... }]
✅ Resultado de createProperty: true
```

## Checklist antes de reportar el problema

- [ ] Ejecuté el script SQL `scripts/fix-user-tracking.sql` en Supabase
- [ ] Reinicié el servidor de desarrollo (`npm run dev`)
- [ ] Limpié caché del navegador y recargué la página
- [ ] Tengo la consola de DevTools abierta (F12 → Console)
- [ ] Copié TODOS los logs desde que cargo la página hasta que hago click en "Guardar"
- [ ] Verifico que no hay errores en rojo en la consola aparte de los warnings de Google Maps
