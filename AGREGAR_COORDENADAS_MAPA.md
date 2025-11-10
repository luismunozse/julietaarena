# Agregar Columnas de Coordenadas para el Mapa

## 🎯 Problema

Las propiedades necesitan mostrar un mapa con su ubicación en la página de detalles (ej: `/propiedades/prop-1762690415957`), pero la tabla de Supabase no tiene las columnas `latitude` y `longitude`.

## ✅ Solución

### Paso 1: Agregar Columnas a Supabase

Ve a **Supabase Dashboard → SQL Editor** y ejecuta este SQL:

```sql
-- Agregar columnas de coordenadas a la tabla properties
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Crear índice para búsquedas geográficas (opcional, pero recomendado)
CREATE INDEX IF NOT EXISTS idx_properties_coordinates
ON properties(latitude, longitude);

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'properties'
AND column_name IN ('latitude', 'longitude');
```

### Paso 2: Verificar la Implementación

El código ya está **100% implementado**:

#### ✅ LocationInput captura coordenadas
```typescript
// src/components/LocationInput.tsx líneas 81-86
const coordinates = {
  lat: place.geometry.location.lat(),
  lng: place.geometry.location.lng()
}
onChange(location, coordinates)
```

#### ✅ PropertyForm guarda coordenadas
```typescript
// src/components/PropertyForm.tsx líneas 409-414
onChange={(location, coordinates) => {
  handleChange('location', location)
  if (coordinates) {
    handleChange('coordinates', coordinates)
  }
}}
```

#### ✅ useProperties guarda/lee de Supabase
```typescript
// src/hooks/useProperties.ts
latitude: property.coordinates?.lat,
longitude: property.coordinates?.lng,

coordinates: data.latitude && data.longitude ? {
  lat: data.latitude,
  lng: data.longitude,
} : undefined,
```

#### ✅ PropertyDetail muestra el mapa
```typescript
// src/components/PropertyDetail.tsx líneas 122-142
{property.coordinates && (
  <button className={styles.viewTab} onClick={() => setActiveView('mapa')}>
    🗺️ Ubicación
  </button>
)}

{activeView === 'mapa' && property.coordinates && (
  <PropertyLocationMap
    latitude={property.coordinates.lat}
    longitude={property.coordinates.lng}
    propertyTitle={property.title}
  />
)}
```

### Paso 3: Probar con una Nueva Propiedad

1. **Ve a** http://localhost:3001/admin/propiedades/nueva
2. **Completa el formulario**:
   - Título: "Casa de prueba con mapa"
   - Tipo: Casa
   - Precio: 100000
   - **Ubicación**: Empieza a escribir "Nueva Córdoba, Córdoba" y selecciona de las opciones de autocompletado
3. **IMPORTANTE**: Debes **seleccionar una opción del autocompletado** de Google Maps, no solo escribir
4. **Guarda la propiedad**
5. **Ve a la página de detalles** de esa propiedad
6. **Verás dos pestañas**: "📸 Fotos" y "🗺️ Ubicación"
7. **Haz clic en "🗺️ Ubicación"** y deberías ver el mapa con la ubicación

### Paso 4: Actualizar Propiedades Existentes (Opcional)

Si tienes propiedades creadas antes de agregar las columnas, tienen dos opciones:

#### Opción A: Editarlas manualmente
1. Ve a http://localhost:3001/admin/propiedades
2. Edita cada propiedad
3. En el campo "Ubicación", selecciona la dirección del autocompletado (aunque ya esté escrita)
4. Guarda

#### Opción B: Actualizar vía SQL (más rápido)
Si conoces las coordenadas aproximadas, puedes actualizarlas directamente:

```sql
-- Ejemplo: Actualizar una propiedad con ID específico
UPDATE properties
SET latitude = -31.4201, longitude = -64.1888
WHERE id = 'prop-1762690415957';

-- Para Nueva Córdoba en general
UPDATE properties
SET latitude = -31.4200, longitude = -64.1900
WHERE location LIKE '%Nueva Córdoba%' AND latitude IS NULL;

-- Para Villa Allende
UPDATE properties
SET latitude = -31.3000, longitude = -64.3000
WHERE location LIKE '%Villa Allende%' AND latitude IS NULL;
```

## 📍 Coordenadas de Referencia (Córdoba, Argentina)

Puedes usar estas coordenadas para actualizar propiedades manualmente:

| Zona | Latitud | Longitud |
|------|---------|----------|
| Centro (Córdoba) | -31.4201 | -64.1888 |
| Nueva Córdoba | -31.4200 | -64.1900 |
| Villa Allende | -31.3000 | -64.3000 |
| Villa Carlos Paz | -31.4240 | -64.4978 |
| Barrio Norte | -31.4000 | -64.1800 |
| Barrio Jardín | -31.4100 | -64.2000 |
| Barrio Güemes | -31.4300 | -64.2000 |

## 🔍 Verificar que Funciona

### Consola del Navegador

Al crear/editar una propiedad y seleccionar ubicación, deberías ver en la consola:

```javascript
// En PropertyForm al seleccionar ubicación
{
  ...,
  location: "Nueva Córdoba, Córdoba, Argentina",
  coordinates: { lat: -31.4200, lng: -64.1900 }
}
```

### Verificar en Supabase

Ve a **Table Editor → properties** y verifica que las columnas `latitude` y `longitude` tengan valores para las propiedades.

### Verificar en la Página de Detalles

1. Abre una propiedad que tenga coordenadas
2. Deberías ver **dos pestañas**: "📸 Fotos" y "🗺️ Ubicación"
3. Si solo ves "📸 Fotos", la propiedad NO tiene coordenadas guardadas

## ⚠️ Importante

1. **Debes seleccionar del autocompletado**: Solo escribir la dirección NO guardará las coordenadas
2. **Google Maps API debe estar configurada**: Verifica que `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` esté en `.env.local`
3. **Las coordenadas son opcionales**: Si una propiedad no tiene coordenadas, simplemente no mostrará la pestaña de mapa

## ✅ Checklist

- [ ] Ejecutar SQL para agregar columnas `latitude` y `longitude`
- [ ] Verificar que las columnas existen en Supabase
- [ ] Crear una propiedad de prueba seleccionando ubicación del autocompletado
- [ ] Verificar que la propiedad tiene valores en `latitude` y `longitude` en Supabase
- [ ] Abrir la página de detalles de la propiedad
- [ ] Ver que aparece la pestaña "🗺️ Ubicación"
- [ ] Hacer clic en la pestaña y ver el mapa
- [ ] (Opcional) Actualizar propiedades existentes con coordenadas

Una vez completados estos pasos, todas las propiedades nuevas tendrán mapa automáticamente! 🗺️✨
