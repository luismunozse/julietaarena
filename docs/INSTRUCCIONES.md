# 🚀 Instrucciones Rápidas de Inicio

## Paso 1: Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias (React, Next.js, TypeScript, etc.)

## Paso 2: Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

El sitio estará disponible en: **http://localhost:3000**

## Paso 3: Personalizar Contenido

### 📞 Información de Contacto

Busca y reemplaza en todos los archivos:

- **Teléfono:** `+54 (351) 123-4567` → Tu número real
- **Email:** `contacto@julietaarena.com.ar` → Tu email real
- **Ubicación:** `Córdoba, Argentina` → Si es más específico

**Archivos a editar:**
- `src/components/Contact.tsx`
- `src/components/Footer.tsx`
- `src/components/StructuredData.tsx`

### 🎨 Colores del Sitio

Edita `src/app/globals.css` líneas 9-14:

```css
--primary-color: #2c5f7d;      /* Azul principal */
--secondary-color: #e8b86d;     /* Dorado */
```

### 📝 Servicios

Edita el array `services` en `src/components/Services.tsx` (líneas 3-73)

### 👤 Sobre Mí

Edita el texto en `src/components/About.tsx` (líneas 15-26)

### 📧 Formulario de Contacto

Actualmente simula el envío. Para hacerlo funcional, tienes 3 opciones:

#### Opción 1: EmailJS (Más Fácil - Recomendado)

1. Crear cuenta gratuita en [emailjs.com](https://www.emailjs.com/)
2. Instalar: `npm install @emailjs/browser`
3. Editar `src/components/Contact.tsx` línea 19:

```typescript
import emailjs from '@emailjs/browser'

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  
  try {
    await emailjs.sendForm(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      e.currentTarget,
      'YOUR_PUBLIC_KEY'
    )
    
    setFormStatus({
      type: 'success',
      message: '¡Mensaje enviado con éxito!',
    })
  } catch (error) {
    setFormStatus({
      type: 'error',
      message: 'Error al enviar. Intenta de nuevo.',
    })
  }
}
```

#### Opción 2: Formspree

1. Crear cuenta en [formspree.io](https://formspree.io/)
2. Cambiar la etiqueta `<form>` en `Contact.tsx`:

```tsx
<form 
  action="https://formspree.io/f/YOUR_FORM_ID" 
  method="POST"
  className={styles.contactForm}
>
```

#### Opción 3: API Route de Next.js

Crear `src/app/api/contact/route.ts` - Ver detalles en README.md

## Paso 4: Agregar Imágenes

Coloca estos archivos en la carpeta `public/`:

1. **og-image.jpg** - Para redes sociales (1200x630 píxeles)
2. **icon-192x192.png** - Icono pequeño (192x192 px)
3. **icon-512x512.png** - Icono grande (512x512 px)
4. **foto-perfil.jpg** - Tu foto profesional

Luego edita `src/components/About.tsx` para usar tu foto:

```tsx
// Reemplazar el div aboutImagePlaceholder con:
<img 
  src="/foto-perfil.jpg" 
  alt="Julieta Arena" 
  className={styles.aboutImg}
/>
```

## Paso 5: SEO Final

### Actualizar Metadata

Edita `src/app/layout.tsx` líneas 11-60:

1. Cambiar el dominio en `metadataBase` (línea 24)
2. Actualizar `verification.google` cuando tengas el código de Google Search Console

### Actualizar URLs en Sitemap

Edita `src/app/sitemap.ts` - Reemplazar `julietaarena.com.ar` con tu dominio real

### Schema.org

Edita `src/components/StructuredData.tsx`:
- Actualizar coordenadas geográficas (líneas 16-19)
- Verificar horarios de atención (líneas 21-28)

## Paso 6: Build y Deploy

### Opción A: Vercel (Recomendado)

1. Crear cuenta en [vercel.com](https://vercel.com)
2. Conectar tu repositorio de GitHub
3. ¡Deploy automático!

### Opción B: Netlify

```bash
npm run build
# Hacer deploy de la carpeta del proyecto
```

## 📱 Redes Sociales

Actualiza los enlaces en `src/components/Footer.tsx` líneas 40-65

Reemplaza los `href="#"` con tus enlaces reales:
- Facebook
- Instagram  
- LinkedIn

## ✅ Checklist Final

Antes de publicar, verifica:

- [ ] Información de contacto actualizada
- [ ] Colores personalizados (opcional)
- [ ] Servicios y descripciones correctas
- [ ] Sección "Sobre Mí" con tu información
- [ ] Imágenes agregadas (og-image, iconos, foto)
- [ ] Formulario de contacto funcional
- [ ] Enlaces de redes sociales actualizados
- [ ] Dominio actualizado en metadata y sitemap
- [ ] Google Analytics agregado (opcional)
- [ ] Probado en móvil y desktop

## 🆘 Problemas Comunes

### Error: Module not found

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Puerto 3000 ocupado

```bash
# Usar otro puerto
npm run dev -- -p 3001
```

### Errores de TypeScript

```bash
# Verificar errores
npm run lint
```

## 📞 ¿Necesitas Ayuda?

- Consulta el README.md completo
- Documentación de Next.js: [nextjs.org/docs](https://nextjs.org/docs)
- Foro de Next.js: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)

---

**¡Éxito con tu nuevo sitio web! 🎉**

