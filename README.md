# Julieta Arena - Servicios Inmobiliarios

Sitio web profesional para Julieta Arena, Martillera Pública en Córdoba, Argentina.

## 🚀 Características

- ✅ **Next.js 14** con App Router
- ✅ **TypeScript** para tipado seguro
- ✅ **Google Places Autocomplete** - búsqueda inteligente de ubicaciones en Argentina
- ✅ **SEO Optimizado** con metadata dinámica
- ✅ **Responsive Design** - funciona en todos los dispositivos
- ✅ **Performance Optimizada** - Core Web Vitals optimizados
- ✅ **CSS Modules** para estilos encapsulados
- ✅ **Componentes React** reutilizables
- ✅ **Formulario de Contacto** interactivo
- ✅ **Sitemap y Robots.txt** automáticos
- ✅ **Open Graph y Twitter Cards** para redes sociales

## 📋 Requisitos Previos

- Node.js 18.0 o superior
- npm, yarn, pnpm o bun

## 🔧 Instalación

1. **Instalar dependencias:**

```bash
npm install
# o
yarn install
# o
pnpm install
```

2. **Configurar variables de entorno:**

Crea un archivo `.env.local` en la raíz del proyecto (puedes basarte en `.env.example`):

```bash
# Google Maps API Key (requerido para búsqueda de ubicaciones)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

**Para obtener tu API Key de Google Maps:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita "Places API" y "Maps JavaScript API"
4. Ve a "Credenciales" y crea una API key
5. Restringe la key por dominio para producción
6. Copia el valor en tu archivo `.env.local`

3. **Ejecutar en modo desarrollo:**

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

4. **Abrir en el navegador:**

Visita [http://localhost:3000](http://localhost:3000)

## 🏗️ Build para Producción

```bash
# Crear build optimizado
npm run build

# Iniciar servidor de producción
npm start
```

## 📁 Estructura del Proyecto

```
julietaarena/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Layout principal + SEO metadata
│   │   ├── page.tsx           # Página principal
│   │   ├── globals.css        # Estilos globales
│   │   ├── manifest.ts        # PWA manifest
│   │   ├── robots.ts          # Robots.txt
│   │   └── sitemap.ts         # Sitemap XML
│   └── components/
│       ├── Header.tsx         # Navegación
│       ├── Hero.tsx           # Sección hero
│       ├── Services.tsx       # Servicios
│       ├── About.tsx          # Sobre mí
│       ├── Contact.tsx        # Formulario contacto
│       ├── Footer.tsx         # Footer
│       └── *.module.css       # Estilos de componentes
├── public/                    # Archivos estáticos
├── next.config.js            # Configuración Next.js
├── tsconfig.json             # Configuración TypeScript
└── package.json              # Dependencias
```

## 🎨 Personalización

### Colores

Los colores principales se definen en `src/app/globals.css`:

```css
:root {
  --primary-color: #2c5f7d;      /* Azul principal */
  --secondary-color: #e8b86d;     /* Dorado/Amarillo */
  --accent-color: #1a4158;        /* Azul oscuro */
  --text-dark: #2d3436;           /* Texto oscuro */
  --text-light: #636e72;          /* Texto claro */
}
```

### Contenido

- **Servicios:** Editar en `src/components/Services.tsx`
- **Sobre Mí:** Editar en `src/components/About.tsx`
- **Información de Contacto:** Editar en `src/components/Contact.tsx` y `src/components/Footer.tsx`
- **SEO Metadata:** Editar en `src/app/layout.tsx`

### Imágenes

Colocar imágenes en la carpeta `public/`:
- `og-image.jpg` - Imagen para redes sociales (1200x630px)
- `icon-192x192.png` - Icono PWA pequeño
- `icon-512x512.png` - Icono PWA grande
- Foto profesional para sección "Sobre Mí"

## 🔍 SEO y Optimizaciones

### Implementado

- ✅ Meta tags optimizados
- ✅ Open Graph para Facebook
- ✅ Twitter Cards
- ✅ Sitemap XML dinámico
- ✅ Robots.txt
- ✅ Manifest para PWA
- ✅ Fuentes optimizadas (Google Fonts)
- ✅ Imágenes responsive
- ✅ Schema.org markup (recomendado agregar)

### Para Mejorar SEO Aún Más

1. **Google Search Console:**
   - Registrar el sitio
   - Enviar sitemap
   - Monitorear rendimiento

2. **Schema.org:**
   Agregar structured data para:
   - LocalBusiness
   - Person
   - Service
   - ContactPoint

3. **Google Analytics:**
   Agregar tracking code en `layout.tsx`

4. **Performance:**
   - Usar Next.js Image component para imágenes
   - Implementar lazy loading
   - Optimizar fuentes

## 📱 Formulario de Contacto

El formulario actualmente está configurado con una simulación. Para hacerlo funcional:

### Opción 1: Email Service (Recomendado)

Usar servicios como:
- **EmailJS** - Gratuito hasta 200 emails/mes
- **SendGrid** - API de emails
- **Resend** - Moderno y fácil de usar

### Opción 2: API Route de Next.js

Crear `src/app/api/contact/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  
  // Enviar email usando nodemailer, SendGrid, etc.
  
  return NextResponse.json({ success: true })
}
```

### Opción 3: Servicio de Formularios

- **Formspree** - Simple y rápido
- **Netlify Forms** - Si se despliega en Netlify
- **Vercel Contact Form** - Si se despliega en Vercel

## 🚀 Deploy

### Vercel (Recomendado)

1. Subir código a GitHub
2. Conectar repositorio en [vercel.com](https://vercel.com)
3. Deploy automático

### Netlify

```bash
npm run build
# Subir carpeta .next a Netlify
```

### Otros Servicios

- **Railway**
- **Render**
- **DigitalOcean App Platform**

## 📞 Información de Contacto

Para personalizar la información de contacto, buscar y reemplazar:
- `+54 (351) 123-4567` - Número de teléfono
- `contacto@julietaarena.com.ar` - Email
- `Córdoba, Argentina` - Ubicación
- Enlaces de redes sociales en Footer

## 📍 Google Places Autocomplete

El sitio incluye un buscador inteligente de ubicaciones que utiliza Google Places API para autocompletar ciudades y localidades de Argentina.

### Características

- ✅ Autocompletado en tiempo real
- ✅ Restricción a ubicaciones de Argentina
- ✅ Solo ciudades y localidades (no direcciones específicas)
- ✅ Captura de coordenadas geográficas
- ✅ Estados de carga y manejo de errores
- ✅ Placeholder dinámico según estado
- ✅ Integración responsive

### Configuración

1. **Obtener API Key** (ver sección de Instalación arriba)
2. **Configurar restricciones** en Google Cloud Console:
   - Restringir por dominio web
   - Habilitar solo Places API y Maps JavaScript API
   - Establecer cuota diaria (recomendado: 1000-5000 requests/día)

### Costos

Con el crédito mensual gratuito de Google Cloud ($200 USD):
- Autocomplete: ~$2.83 USD por 1000 requests
- **~70,000 búsquedas mensuales gratis**
- Para sitios inmobiliarios pequeños/medianos es más que suficiente

### Personalización

El componente `SearchHero` puede personalizarse en:
- `src/components/SearchHero.tsx` - Lógica
- `src/components/SearchHero.module.css` - Estilos

Configuración del autocomplete:
```typescript
const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
  componentRestrictions: { country: 'ar' }, // Solo Argentina
  fields: ['address_components', 'geometry', 'name', 'formatted_address'],
  types: ['(cities)'] // Solo ciudades y localidades
})
```

## 🛠️ Tecnologías Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Google Places API** - Autocompletado de ubicaciones
- **CSS Modules** - Estilos encapsulados
- **Google Fonts** - Tipografía Poppins
- **React Hooks** - Estado y efectos
- **Responsive Design** - Mobile-first

## 📝 Licencia

Este proyecto es propiedad de Julieta Arena Servicios Inmobiliarios.

## 🤝 Soporte

Para consultas o soporte técnico, contactar al desarrollador.

---

**Desarrollado con ❤️ para Julieta Arena**

