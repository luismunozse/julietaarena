# 🎨 Guía Visual del Sitio

## Paleta de Colores

```
┌─────────────────────────────────────────────────────────────┐
│                    COLORES PRINCIPALES                       │
└─────────────────────────────────────────────────────────────┘

🔵 AZUL PRINCIPAL (#2c5f7d)
   Uso: Títulos, navegación, elementos principales
   
🌊 AZUL OSCURO (#1a4158)
   Uso: Gradientes, acentos, footer
   
✨ DORADO (#e8b86d)
   Uso: Detalles, hover effects, subtítulos especiales

📝 TEXTO OSCURO (#2d3436)
   Uso: Contenido principal, párrafos

💬 TEXTO CLARO (#636e72)
   Uso: Descripciones secundarias, subtítulos

🎯 FONDO CLARO (#f8f9fa)
   Uso: Secciones alternadas, cards

```

## Estructura de Secciones

```
┌────────────────────────────────────────────────────┐
│  HEADER (Fijo)                                      │
│  • Navegación transparente → Blanca al scroll       │
└────────────────────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────┐
│  HERO (Pantalla Completa)                           │
│  • Gradiente azul con animación                     │
│  • Título principal                                 │
│  • 2 botones de acción                              │
│  • Indicador de scroll                              │
└────────────────────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────┐
│  SERVICIOS                                          │
│  • Fondo blanco                                     │
│  • Grid de 6 cards                                  │
│  • Hover con elevación                              │
└────────────────────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────┐
│  SOBRE MÍ                                           │
│  • Fondo gris claro                                 │
│  • Imagen + Texto (2 columnas)                      │
│  • 3 features con íconos                            │
└────────────────────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────┐
│  CONTACTO                                           │
│  • Fondo blanco                                     │
│  • Info contacto + Formulario (2 columnas)          │
│  • Formulario interactivo                           │
└────────────────────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────┐
│  FOOTER                                             │
│  • Gradiente azul                                   │
│  • 4 columnas de información                        │
│  • Redes sociales                                   │
└────────────────────────────────────────────────────┘
```

## Tipografía

**Fuente Principal:** Poppins (Google Fonts)

```
┌──────────────────────────────────────┐
│  Título Hero:     4rem / 700         │
│  Títulos H2:      2.5rem / 700       │
│  Títulos H3:      1.75rem / 600      │
│  Títulos Cards:   1.4rem / 600       │
│  Texto Normal:    1rem / 400         │
│  Texto Pequeño:   0.95rem / 400      │
└──────────────────────────────────────┘
```

## Responsive Breakpoints

```
📱 MÓVIL
   < 480px
   • Stack vertical
   • Hamburger menu
   • Botones full-width

📱 TABLET
   480px - 768px
   • Grid 1-2 columnas
   • Menu responsive
   • Padding reducido

💻 DESKTOP PEQUEÑO
   768px - 992px
   • Grid 2-3 columnas
   • Layout híbrido

🖥️ DESKTOP
   > 992px
   • Grid completo
   • Max-width 1200px
   • Espaciado completo
```

## Animaciones

```css
/* Transición estándar */
transition: all 0.3s ease;

/* Animaciones incluidas: */
✓ fadeInUp    - Entrada de secciones
✓ fadeIn      - Aparición gradual
✓ scrollDown  - Indicador de scroll
✓ float       - Elementos flotantes
✓ rotate      - Elementos giratorios
```

## Efectos Hover

```
CARDS DE SERVICIOS
├─ Elevación (translateY: -8px)
├─ Sombra aumentada
└─ Cambio de color de borde

BOTONES
├─ Elevación (translateY: -2px)
├─ Sombra aumentada
└─ Escala del ícono interno

LINKS
├─ Cambio de color
├─ Underline animado
└─ Desplazamiento horizontal
```

## Sombras

```css
/* Definidas en globals.css */
--shadow-sm:  0 2px 8px rgba(0, 0, 0, 0.08)
--shadow-md:  0 4px 16px rgba(0, 0, 0, 0.1)
--shadow-lg:  0 8px 32px rgba(0, 0, 0, 0.12)
```

## Iconos

**Fuente:** SVG inline (optimizado)

Todos los íconos son SVG con:
- stroke-width: 2
- Color heredado del contenedor
- Tamaño: 24px o 48px según contexto

## Espaciado

```
┌────────────────────────────────────┐
│  SISTEMA DE ESPACIADO              │
├────────────────────────────────────┤
│  Section Padding:    80px (vertical)│
│  Container Max:      1200px        │
│  Container Padding:  20px          │
│  Grid Gap:           30px          │
│  Card Padding:       40px 30px     │
│  Button Padding:     14px 32px     │
└────────────────────────────────────┘
```

## Accesibilidad

✓ Semántica HTML correcta (header, nav, main, section, footer)
✓ Labels en todos los inputs
✓ aria-label en íconos de redes sociales
✓ Contraste de colores WCAG AA
✓ Smooth scroll para navegación
✓ Indicadores de focus
✓ Alt text en imágenes

## Performance

✓ Fuentes optimizadas con display: swap
✓ CSS Modules (estilos encapsulados)
✓ Componentes separados
✓ Imágenes lazy load (Next.js automático)
✓ Compresión habilitada
✓ Sin jQuery ni librerías pesadas

## Componentes Reutilizables

```
src/components/
├─ Header.tsx         → Navegación fija
├─ Hero.tsx           → Sección principal
├─ Services.tsx       → Grid de servicios
├─ About.tsx          → Perfil profesional
├─ Contact.tsx        → Formulario + info
├─ Footer.tsx         → Información final
└─ StructuredData.tsx → SEO schema
```

## Personalización Rápida

### Cambiar Color Principal

```css
/* En src/app/globals.css línea 9 */
--primary-color: #TU_COLOR_AQUI;
```

### Cambiar Fuente

```typescript
// En src/app/layout.tsx línea 4
import { TU_FUENTE } from 'next/font/google'
```

### Agregar Nueva Sección

1. Crear componente en `src/components/TuSeccion.tsx`
2. Importar en `src/app/page.tsx`
3. Agregar entre `<main>` tags
4. Crear estilos en `TuSeccion.module.css`

---

**Esta guía te ayudará a entender y personalizar el diseño visual del sitio.**

