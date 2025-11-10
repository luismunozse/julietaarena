# Guía de Configuración: Google Analytics y Facebook Pixel

Esta guía te ayudará a configurar el tracking de visitantes y eventos en tu sitio web.

## Google Analytics 4 (GA4)

### Paso 1: Crear cuenta de Google Analytics

1. Ve a [https://analytics.google.com/](https://analytics.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Comenzar a medir"**
4. Completa el formulario:
   - **Nombre de la cuenta**: "Julieta Arena"
   - Acepta los términos de servicio

### Paso 2: Crear propiedad

1. **Nombre de la propiedad**: "Sitio Web Julieta Arena"
2. **Zona horaria**: Argentina (GMT-3)
3. **Moneda**: Peso argentino (ARS)
4. Haz clic en **Siguiente**

### Paso 3: Configurar detalles del negocio

1. **Categoría del sector**: Inmobiliaria
2. **Tamaño de la empresa**: Pequeña empresa
3. **Cómo planeas usar Google Analytics**: Selecciona todas las que apliquen
   - Examinar el comportamiento de los clientes
   - Medir la efectividad del marketing
   - Mejorar la experiencia del usuario

### Paso 4: Obtener el ID de medición

1. Selecciona **"Web"** como plataforma
2. Configura el flujo de datos web:
   - **URL del sitio web**: `https://julietaarena.com` (o tu dominio)
   - **Nombre del flujo**: "Sitio Web Principal"
3. Haz clic en **Crear flujo**
4. **Copia el ID de medición** (formato: `G-XXXXXXXXXX`)

### Paso 5: Agregar a tu proyecto

1. Abre el archivo `.env.local` en tu proyecto
2. Agrega o actualiza esta línea:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   (Reemplaza `G-XXXXXXXXXX` con tu ID real)

3. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Paso 6: Verificar instalación

1. Abre tu sitio web en el navegador
2. Abre las herramientas de desarrollo (F12)
3. Ve a la pestaña **Network**
4. Filtra por `google-analytics` o `gtag`
5. Deberías ver requests a Google Analytics
6. Alternativamente, instala la extensión [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)

### Eventos que se trackean automáticamente:

- Visitas de página (page views)
- Tiempo en el sitio
- Páginas visitadas
- Dispositivo y navegador
- Ubicación geográfica
- Flujo de usuarios

### Eventos personalizados disponibles:

Puedes agregar eventos personalizados usando:

```typescript
window.gtag('event', 'nombre_evento', {
  categoria: 'categoria',
  etiqueta: 'etiqueta',
  valor: 123
})
```

**Ejemplos de eventos útiles:**

```typescript
// Click en propiedad
window.gtag('event', 'property_click', {
  property_id: 'prop-123',
  property_type: 'casa',
  price: 350000
})

// Formulario de contacto
window.gtag('event', 'contact_form_submit', {
  property_id: 'prop-123'
})

// WhatsApp click
window.gtag('event', 'whatsapp_click', {
  source: 'floating_button'
})

// Búsqueda
window.gtag('event', 'search', {
  search_term: 'departamento palermo'
})
```

---

## Facebook Pixel

### Paso 1: Crear Pixel de Facebook

1. Ve a [Facebook Business Manager](https://business.facebook.com/)
2. Crea una cuenta de negocio si no tienes una
3. Ve a **Configuración de negocio** > **Orígenes de datos** > **Píxeles**
4. Haz clic en **Agregar** y selecciona **Crear un píxel**
5. Dale un nombre: "Julieta Arena Website"
6. Acepta los términos

### Paso 2: Obtener el ID del Pixel

1. Una vez creado, verás tu **Pixel ID** (formato numérico, ej: `1234567890`)
2. **Cópialo**

### Paso 3: Agregar a tu proyecto

1. Abre el archivo `.env.local` en tu proyecto
2. Agrega o actualiza esta línea:
   ```env
   NEXT_PUBLIC_FB_PIXEL_ID=1234567890
   ```
   (Reemplaza `1234567890` con tu ID real)

3. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Paso 4: Verificar instalación

1. Instala la extensión [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Abre tu sitio web en Chrome
3. Haz clic en el icono de Pixel Helper
4. Deberías ver tu Pixel ID con un check verde
5. Verifica que se esté disparando el evento "PageView"

### Eventos estándar de Facebook disponibles:

```typescript
// Vista de contenido
window.fbq('track', 'ViewContent', {
  content_name: 'Casa en Nordelta',
  content_category: 'Propiedades',
  content_ids: ['prop-123'],
  content_type: 'product',
  value: 350000,
  currency: 'USD'
})

// Lead (formulario de contacto)
window.fbq('track', 'Lead', {
  content_name: 'Formulario de Contacto',
  content_category: 'Consultas'
})

// Búsqueda
window.fbq('track', 'Search', {
  search_string: 'departamento palermo',
  content_category: 'Propiedades'
})

// Agregar a favoritos
window.fbq('track', 'AddToWishlist', {
  content_name: 'Casa en Belgrano',
  content_ids: ['prop-456'],
  value: 280000,
  currency: 'USD'
})

// Completar registro
window.fbq('track', 'CompleteRegistration', {
  content_name: 'Registro de Usuario'
})
```

### Eventos personalizados de Facebook:

```typescript
// Evento personalizado
window.fbq('trackCustom', 'PropertyInquiry', {
  property_id: 'prop-123',
  inquiry_type: 'whatsapp',
  property_type: 'casa'
})
```

---

## Verificación Completa

### Checklist de instalación:

- [ ] Google Analytics configurado en `.env.local`
- [ ] Facebook Pixel configurado en `.env.local`
- [ ] Servidor reiniciado después de cambios
- [ ] Google Analytics Helper instalado (opcional)
- [ ] Facebook Pixel Helper instalado (opcional)
- [ ] Ambos trackers funcionando correctamente

### Herramientas de debugging:

**Consola del navegador (F12):**
```javascript
// Verificar Google Analytics
console.log(window.gtag)
console.log(window.dataLayer)

// Verificar Facebook Pixel
console.log(window.fbq)
console.log(window._fbq)
```

### Dashboards:

**Google Analytics:**
- URL: [https://analytics.google.com/](https://analytics.google.com/)
- Ir a **Informes** > **Tiempo real** para ver visitantes en vivo

**Facebook Events Manager:**
- URL: [https://business.facebook.com/events_manager](https://business.facebook.com/events_manager)
- Ver eventos en tiempo real en la pestaña **Test Events**

---

## Integración con el proyecto

Ambos componentes **ya están integrados** en el proyecto:

- `src/components/GoogleAnalytics.tsx` - Componente de Google Analytics
- `src/components/FacebookPixel.tsx` - Componente de Facebook Pixel
- `src/app/layout.tsx` - Ambos componentes están incluidos

**No necesitas tocar código**, solo configurar las variables de entorno!

---

## Privacidad y GDPR

**IMPORTANTE:** Si tu sitio tiene visitantes de la Unión Europea, debes:

1. Mostrar un banner de cookies
2. Pedir consentimiento antes de trackear
3. Permitir que los usuarios rechacen cookies

Para implementar GDPR compliance, considera agregar una librería como:
- [react-cookie-consent](https://www.npmjs.com/package/react-cookie-consent)
- [cookie-consent-banner](https://www.npmjs.com/package/cookie-consent-banner)

---

## Métricas recomendadas a trackear

### Para inmobiliarias:

1. **Conversiones principales:**
   - Formularios de contacto enviados
   - Clicks en WhatsApp
   - Llamadas telefónicas
   - Emails enviados
   - Citas agendadas

2. **Micro-conversiones:**
   - Propiedades vistas
   - Favoritos agregados
   - Búsquedas realizadas
   - Tiempo en página de propiedad
   - Imágenes vistas en galería

3. **Engagement:**
   - Páginas por sesión
   - Tiempo promedio en sitio
   - Tasa de rebote
   - Usuarios recurrentes

---

## Problemas comunes

### Google Analytics no muestra datos

1. Verifica que el ID sea correcto (formato `G-XXXXXXXXXX`)
2. Asegúrate de haber reiniciado el servidor
3. Verifica que no haya ad blockers activos
4. Espera 24-48 horas para que aparezcan datos en reportes (Tiempo Real funciona inmediatamente)

### Facebook Pixel no detecta eventos

1. Verifica que el Pixel ID sea correcto (solo números)
2. Asegúrate de haber reiniciado el servidor
3. Usa Facebook Pixel Helper para debugging
4. Verifica que no haya ad blockers

---

¿Necesitas ayuda? Consulta la documentación oficial:
- [Google Analytics 4](https://support.google.com/analytics/answer/9304153)
- [Facebook Pixel](https://www.facebook.com/business/help/952192354843755)
