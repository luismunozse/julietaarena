# Configuración de Google Maps API

Guía paso a paso para configurar Google Places Autocomplete en el sitio.

## 📋 Pasos

### 1. Crear Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Haz clic en el selector de proyectos (arriba a la izquierda)
3. Clic en "NUEVO PROYECTO"
4. Ingresa un nombre (ej: "Julieta Arena Inmobiliaria")
5. Clic en "CREAR"

### 2. Habilitar APIs Necesarias

1. En el menú lateral, ve a "APIs y servicios" > "Biblioteca"
2. Busca y habilita:
   - **Places API**
   - **Maps JavaScript API**

Para cada una:
- Clic en el nombre de la API
- Clic en "HABILITAR"

### 3. Crear Credenciales (API Key)

1. Ve a "APIs y servicios" > "Credenciales"
2. Clic en "+ CREAR CREDENCIALES"
3. Selecciona "Clave de API"
4. Se generará tu API Key
5. **¡IMPORTANTE!** Clic en "RESTRINGIR CLAVE" inmediatamente

### 4. Restringir API Key (Seguridad)

#### Restricciones de Aplicación

1. Selecciona "Sitios web"
2. Agrega tus dominios:
   ```
   localhost:3000/*
   localhost:3001/*
   tudominio.com/*
   www.tudominio.com/*
   ```

#### Restricciones de API

1. Selecciona "Restringir clave"
2. Marca solo:
   - ✅ Places API
   - ✅ Maps JavaScript API
3. Clic en "GUARDAR"

### 5. Configurar Cuotas (Opcional pero Recomendado)

1. Ve a "APIs y servicios" > "Cuotas"
2. Busca "Places API"
3. Establece límites diarios:
   - **Desarrollo:** 100-500 requests/día
   - **Producción:** 1000-5000 requests/día

Esto previene gastos inesperados.

### 6. Configurar en tu Proyecto

1. Copia tu API Key
2. Abre el archivo `.env.local` en la raíz del proyecto
3. Agrega o actualiza:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   ```
4. Guarda el archivo
5. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 💰 Costos y Límites

### Crédito Gratuito

Google Cloud ofrece **$200 USD de crédito mensual gratuito**.

### Precio de Places API

- **Autocomplete (per session):** $2.83 USD por 1000 requests
- **Con crédito gratuito:** ~70,000 búsquedas mensuales gratis

### Optimización de Costos

El componente ya está optimizado con:
- ✅ Carga diferida del script
- ✅ Restricción a Argentina (`componentRestrictions: { country: 'ar' }`)
- ✅ Solo campos necesarios (`fields`)
- ✅ Solo ciudades y localidades (`types: ['(cities)']`)
- ✅ Sin búsquedas automáticas innecesarias

## 🔒 Seguridad

### ¿Por qué restringir la API Key?

Sin restricciones, cualquiera puede:
- Copiar tu key del código fuente
- Usarla en sus proyectos
- Generar cargos en tu cuenta

### Restricciones Recomendadas

1. **Dominios:**
   - Agrega SOLO tus dominios
   - Usa patrones específicos
   
2. **APIs:**
   - Habilita SOLO las APIs que uses
   
3. **Cuotas:**
   - Establece límites diarios
   - Configura alertas de facturación

## 🚨 Troubleshooting

### "API key not configured"

- Verifica que existe el archivo `.env.local`
- Verifica que la variable se llama `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Reinicia el servidor de desarrollo

### "This API project is not authorized to use this API"

- Verifica que habilitaste Places API y Maps JavaScript API
- Espera 1-2 minutos después de habilitar las APIs

### "RefererNotAllowedMapError"

- Agrega tu dominio en las restricciones de la API Key
- Verifica que el formato sea correcto: `dominio.com/*`

### El autocompletado no aparece

1. Abre la consola del navegador (F12)
2. Busca errores relacionados con Google Maps
3. Verifica que la API Key sea correcta
4. Verifica que las APIs estén habilitadas

## 📊 Monitoreo

### Ver Uso de la API

1. Ve a "APIs y servicios" > "Panel"
2. Selecciona el proyecto
3. Verás gráficos de uso por API
4. Revisa métricas y errores

### Configurar Alertas

1. Ve a "Facturación" > "Presupuestos y alertas"
2. Clic en "CREAR PRESUPUESTO"
3. Establece límites (ej: $10 USD/mes)
4. Configura notificaciones por email

## 🔗 Enlaces Útiles

- [Google Cloud Console](https://console.cloud.google.com/)
- [Documentación Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Calculadora de Precios](https://cloud.google.com/maps-platform/pricing)
- [Guía de Seguridad](https://developers.google.com/maps/api-security-best-practices)

## ✅ Checklist Final

Antes de pasar a producción:

- [ ] API Key creada y copiada
- [ ] Places API habilitada
- [ ] Maps JavaScript API habilitada
- [ ] Restricción por dominio configurada
- [ ] Restricción por API configurada
- [ ] Cuota diaria establecida
- [ ] Alertas de facturación configuradas
- [ ] Variable de entorno configurada
- [ ] Autocompletado probado en desarrollo
- [ ] Autocompletado probado en producción

## 🎯 Resultado Esperado

Una vez configurado correctamente, deberías ver:

1. Campo de búsqueda con placeholder "¿Dónde querés mudarte?"
2. Al escribir, aparecen sugerencias de ciudades argentinas
3. Al seleccionar, se completa el campo con la ubicación
4. La búsqueda funciona correctamente

¡Listo! Tu integración con Google Places está completa y segura.
