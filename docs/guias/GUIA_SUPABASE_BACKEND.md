# Guía Completa: Migración a Supabase Backend

Esta guía te llevará paso a paso para migrar tu proyecto de localStorage a una base de datos real con Supabase.

## Tabla de Contenidos

1. [Configurar Base de Datos](#1-configurar-base-de-datos)
2. [Configurar Storage de Imágenes](#2-configurar-storage-de-imágenes)
3. [Verificar Configuración](#3-verificar-configuración)
4. [Migrar Datos de Ejemplo](#4-migrar-datos-de-ejemplo)
5. [Usar la Nueva API](#5-usar-la-nueva-api)

---

## 1. Configurar Base de Datos

### Paso 1.1: Acceder a Supabase Dashboard

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto (o crea uno nuevo)

### Paso 1.2: Ejecutar Script SQL

1. En el menú lateral, haz clic en **SQL Editor**
2. Haz clic en **New query**
3. Copia TODO el contenido del archivo `scripts/supabase-setup.sql`
4. Pégalo en el editor
5. Haz clic en **RUN** (botón verde en la esquina inferior derecha)

**¿Qué hace este script?**
- Crea la tabla `properties` con todos los campos necesarios
- Configura índices para búsquedas rápidas
- Habilita Row Level Security (RLS)
- Crea políticas de seguridad:
  - ✅ Cualquiera puede **leer** propiedades
  - ✅ Solo usuarios autenticados pueden **crear/editar/eliminar**
- Crea función de búsqueda avanzada
- Crea vista de estadísticas

### Paso 1.3: Verificar que se creó la tabla

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver la tabla **properties** en la lista
3. Haz clic en ella para ver su estructura

---

## 2. Configurar Storage de Imágenes

### Paso 2.1: Crear el Bucket

1. En el menú lateral, haz clic en **Storage**
2. Haz clic en **Create a new bucket**
3. Configura el bucket:
   - **Name**: `property-images`
   - **Public bucket**: ✅ **SÍ** (marca el checkbox)
   - **File size limit**: 5MB (o el que prefieras)
   - **Allowed MIME types**: `image/*` (opcional, permite solo imágenes)
4. Haz clic en **Create bucket**

### Paso 2.2: Configurar Políticas del Bucket

1. Ve a **SQL Editor** nuevamente
2. Crea una **New query**
3. Copia TODO el contenido del archivo `scripts/supabase-storage-setup.sql`
4. Pégalo y haz clic en **RUN**

**¿Qué hace este script?**
- Permite lectura pública de imágenes (para que se vean en el sitio)
- Permite que usuarios autenticados suban/editen/eliminen imágenes

### Paso 2.3: Verificar el Bucket

1. Ve a **Storage** en el menú lateral
2. Deberías ver el bucket **property-images**
3. Haz clic en él
4. Intenta subir una imagen de prueba (botón **Upload file**)
5. Si se sube correctamente, ¡todo está bien! 🎉

---

## 3. Verificar Configuración

### Paso 3.1: Comprobar que la tabla funciona

Ejecuta esta query SQL:

```sql
SELECT * FROM properties_stats;
```

Deberías ver estadísticas (todo en 0 por ahora, porque no hay datos).

### Paso 3.2: Probar la función de búsqueda

```sql
SELECT * FROM search_properties();
```

Debería devolver 0 resultados (la tabla está vacía).

### Paso 3.3: Verificar variables de entorno

Tu archivo `.env.local` debe tener:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hrpkcdzgbpzzatusmqyq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aquí
```

**¿Dónde encuentro estas variables?**

1. Ve a **Settings** (⚙️) en el menú lateral
2. Selecciona **API**
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 4. Migrar Datos de Ejemplo

Una vez configurado Supabase, hay dos formas de migrar los datos de ejemplo:

### Opción A: Desde el Panel Admin (Recomendado)

1. Inicia tu aplicación: `npm run dev`
2. Ve a [http://localhost:3000/login](http://localhost:3000/login)
3. Inicia sesión con:
   - Email: `admin@julietaarena.com`
   - Password: `admin123`
4. Ve a [http://localhost:3000/admin/propiedades/nueva](http://localhost:3000/admin/propiedades/nueva)
5. Crea las propiedades manualmente usando el formulario

### Opción B: Migración Automática (Rápido)

El hook `useProperties` detectará automáticamente si hay propiedades en `src/data/properties.ts` y las migrará a Supabase en el primer uso.

**Solo necesitas:**
1. Asegurarte de que las propiedades estén en `src/data/properties.ts`
2. Iniciar la app
3. Visitar cualquier página que cargue propiedades
4. Las 10 propiedades se migrarán automáticamente

---

## 5. Usar la Nueva API

### Obtener todas las propiedades

```typescript
import { supabase } from '@/lib/supabaseClient'

const { data, error } = await supabase
  .from('properties')
  .select('*')
  .order('created_at', { ascending: false })

if (error) {
  console.error('Error:', error)
} else {
  console.log('Propiedades:', data)
}
```

### Obtener propiedades destacadas

```typescript
const { data, error } = await supabase
  .from('properties')
  .select('*')
  .eq('featured', true)
  .eq('status', 'disponible')
```

### Buscar propiedades

```typescript
const { data, error } = await supabase
  .rpc('search_properties', {
    search_text: 'palermo',
    property_type: 'departamento',
    property_operation: 'alquiler',
    min_price: 0,
    max_price: 5000
  })
```

### Crear propiedad

```typescript
const { data, error } = await supabase
  .from('properties')
  .insert([{
    id: 'prop-' + Date.now(),
    title: 'Casa en Belgrano',
    description: 'Hermosa casa...',
    price: 350000,
    location: 'Belgrano, CABA',
    type: 'casa',
    area: 200,
    images: ['url1', 'url2'],
    features: ['Piscina', 'Jardín'],
    status: 'disponible',
    featured: false,
    operation: 'venta',
    // ... otros campos
  }])
  .select()
```

### Subir imagen

```typescript
import { supabase } from '@/lib/supabaseClient'

const file = event.target.files[0]
const fileName = `${propertyId}-${Date.now()}-${file.name}`

const { data, error } = await supabase.storage
  .from('property-images')
  .upload(fileName, file, {
    cacheControl: '3600',
    upsert: false
  })

if (!error) {
  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from('property-images')
    .getPublicUrl(fileName)

  const imageUrl = urlData.publicUrl
  console.log('URL de la imagen:', imageUrl)
}
```

---

## Ventajas de Usar Supabase

### ✅ Antes (localStorage)
- ❌ Límite de 5-10MB
- ❌ Datos solo en navegador local
- ❌ No hay sincronización entre dispositivos
- ❌ Sin validación del servidor
- ❌ Imágenes en base64 (pesado)

### ✅ Ahora (Supabase)
- ✅ Base de datos PostgreSQL real
- ✅ Sin límites de almacenamiento
- ✅ Datos accesibles desde cualquier dispositivo
- ✅ Validación y seguridad con RLS
- ✅ Imágenes optimizadas en CDN
- ✅ Búsqueda full-text en español
- ✅ Índices optimizados
- ✅ Backups automáticos
- ✅ API REST generada automáticamente

---

## Problemas Comunes

### Error: "No hay conexión a Supabase"

**Solución:**
1. Verifica que las variables de entorno estén bien configuradas
2. Reinicia el servidor de desarrollo (`npm run dev`)
3. Verifica que tu proyecto Supabase esté activo

### Error: "Permission denied for table properties"

**Solución:**
1. Verifica que Row Level Security esté habilitado
2. Verifica que las políticas estén creadas correctamente
3. Re-ejecuta el script `supabase-setup.sql`

### Las imágenes no se ven

**Solución:**
1. Verifica que el bucket sea **público**
2. Verifica que las políticas de storage estén configuradas
3. Verifica que la URL de la imagen sea correcta

### Error al subir imágenes

**Solución:**
1. Verifica que estés autenticado
2. Verifica el tamaño del archivo (límite configurado)
3. Verifica que el tipo de archivo sea permitido

---

## Próximos Pasos

Una vez que Supabase esté configurado:

1. ✅ El hook `useProperties` usará automáticamente Supabase
2. ✅ El panel admin guardará en Supabase
3. ✅ Las imágenes se subirán a Supabase Storage
4. ✅ Todo funcionará igual pero con base de datos real

**No necesitas cambiar nada en tu código!** El hook `useProperties` detectará automáticamente Supabase y lo usará.

---

## Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

---

¿Necesitas ayuda? Revisa los logs de la consola del navegador o contacta al equipo de desarrollo.
