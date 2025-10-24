# Configuración de Google Maps API

## 🗺️ Cómo configurar Google Maps API

### 1. Crear cuenta en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Crea un nuevo proyecto o selecciona uno existente

### 2. Habilitar Google Maps API

1. En el menú lateral, ve a **APIs y servicios** > **Biblioteca**
2. Busca "Maps JavaScript API"
3. Haz clic en **Habilitar**

### 3. Crear credenciales (API Key)

1. Ve a **APIs y servicios** > **Credenciales**
2. Haz clic en **+ CREAR CREDENCIALES** > **Clave de API**
3. Copia la clave generada

### 4. Configurar restricciones (Recomendado)

1. Haz clic en el ícono de editar de tu API Key
2. En **Restricciones de aplicación**:
   - Selecciona **Sitios web**
   - Agrega tu dominio: `localhost:3001`, `localhost:3000`, y tu dominio de producción
3. En **Restricciones de API**:
   - Selecciona **Restringir clave**
   - Selecciona **Maps JavaScript API**

### 5. Configurar en el proyecto

1. Crea un archivo `.env.local` en la raíz del proyecto (si no existe)
2. Agrega tu API Key:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### 6. Reemplazar el componente

Una vez configurada la API, reemplaza `MapPlaceholder` con `GoogleMaps` en:
- `src/components/PropertyMap.tsx` (línea 4 y 137)

```tsx
// Cambiar de:
import MapPlaceholder from './MapPlaceholder'

// A:
import GoogleMaps from './GoogleMaps'

// Y en el JSX:
<GoogleMaps
  properties={filteredMarkers.map(marker => marker.property)}
  selectedProperty={selectedProperty}
  onPropertySelect={setSelectedProperty}
  height="500px"
/>
```

## 🔧 Solución de problemas

### Error: "Cargando mapa..."
- Verifica que la API Key esté correctamente configurada en `.env.local`
- Asegúrate de que la API esté habilitada en Google Cloud Console
- Verifica que las restricciones de dominio incluyan `localhost:3001`

### Error: "This page can't load Google Maps correctly"
- Verifica que la API Key tenga permisos para Maps JavaScript API
- Revisa que no haya restricciones de IP que bloqueen tu conexión

### Error de facturación
- Google Maps requiere una cuenta de facturación habilitada
- Los primeros $200 USD de uso son gratuitos cada mes

## 💰 Costos

- **Gratis**: Hasta $200 USD por mes
- **Después**: $7 USD por cada 1,000 cargas de mapa
- **Consulta**: [Precios de Google Maps](https://cloud.google.com/maps-platform/pricing)

## 🚀 Alternativa temporal

Mientras configuras la API, el sitio usa `MapPlaceholder` que muestra:
- Ubicaciones aproximadas de las propiedades
- Información básica de cada propiedad
- Interfaz funcional sin necesidad de API

¡El sitio funciona perfectamente sin Google Maps API!
