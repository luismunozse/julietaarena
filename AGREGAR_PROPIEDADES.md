# 🏠 Guía para Agregar Propiedades Reales

Esta guía te ayudará a agregar tus propiedades reales al sitio web de manera fácil y profesional.

## 📋 Índice

1. [Estructura de una propiedad](#estructura-de-una-propiedad)
2. [Cómo agregar propiedades](#cómo-agregar-propiedades)
3. [Obtener imágenes](#obtener-imágenes)
4. [Ejemplos completos](#ejemplos-completos)
5. [Tips y mejores prácticas](#tips-y-mejores-prácticas)

---

## Estructura de una Propiedad

Cada propiedad tiene los siguientes campos:

```typescript
{
  id: string,              // ID único (ej: 'prop-001')
  title: string,           // Título descriptivo
  description: string,     // Descripción detallada
  price: number,           // Precio en pesos argentinos (sin puntos ni comas)
  location: string,        // Ubicación (ej: 'Villa Allende, Córdoba')
  type: string,           // 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina'
  bedrooms: number,       // Cantidad de dormitorios (opcional)
  bathrooms: number,      // Cantidad de baños (opcional)
  area: number,           // Metros cuadrados
  images: string[],       // Array de URLs de imágenes
  features: string[],     // Array de características
  status: string,         // 'disponible' | 'reservado' | 'vendido'
  featured: boolean,      // true si es destacada
  yearBuilt: number,      // Año de construcción (opcional)
  parking: number,        // Espacios de estacionamiento (opcional)
  floor: number,          // Piso (solo para deptos/oficinas)
  totalFloors: number,    // Total de pisos del edificio
  orientation: string,    // Orientación (opcional)
  expenses: number,       // Expensas mensuales (opcional)
  operation: string       // 'venta' | 'alquiler'
}
```

---

## Cómo Agregar Propiedades

### Opción 1: Editar el archivo directamente

1. Abre el archivo: `src/data/properties.ts`

2. Encuentra esta línea:
```typescript
export const properties: Property[] = [
```

3. Agrega tus propiedades dentro del array:

```typescript
export const properties: Property[] = [
  {
    id: 'prop-001',
    title: 'Casa en Villa Allende',
    description: 'Hermosa casa de 3 dormitorios...',
    price: 85000000,
    // ... resto de campos
  },
  {
    id: 'prop-002',
    // ... siguiente propiedad
  }
]
```

### Opción 2: Usar el template

Copia este template y completa con tus datos:

```typescript
{
  id: 'prop-XXX',  // Cambiar XXX por número correlativo
  title: '',       // Título descriptivo
  description: '', // Descripción completa
  price: 0,        // Precio (sin puntos)
  location: '',    // Ciudad, Barrio
  type: 'casa',    // Cambiar según corresponda
  bedrooms: 0,     // Opcional: eliminar si no aplica
  bathrooms: 0,    // Opcional: eliminar si no aplica
  area: 0,         // Metros cuadrados
  images: [
    'URL_IMAGEN_1',
    'URL_IMAGEN_2',
    'URL_IMAGEN_3'
  ],
  features: [
    'Característica 1',
    'Característica 2',
    'Característica 3'
  ],
  status: 'disponible',
  featured: false,  // true si quieres destacarla
  yearBuilt: 2020,  // Opcional
  parking: 0,       // Opcional
  operation: 'venta' // o 'alquiler'
},
```

---

## Obtener Imágenes

### Opción 1: Imágenes Propias (Recomendado)

1. **Toma fotos profesionales:**
   - Usa buena iluminación (natural preferiblemente)
   - Toma desde varios ángulos
   - Muestra espacios amplios
   - Limpia y ordena antes de fotografiar

2. **Sube a un servicio:**
   - **Imgur:** https://imgur.com/ (gratis, fácil)
   - **Cloudinary:** https://cloudinary.com/ (profesional)
   - **Google Drive:** Comparte públicamente y usa el link

3. **Obtén las URLs:**
   - Haz clic derecho → "Copiar dirección de imagen"
   - Usa esas URLs en el array `images`

### Opción 2: Imágenes Temporales

Mientras consigues las fotos reales, usa estas de Unsplash:

**Casas:**
```javascript
'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
```

**Departamentos:**
```javascript
'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop'
'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop'
```

**Oficinas:**
```javascript
'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop'
```

**Locales:**
```javascript
'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'
```

**Terrenos:**
```javascript
'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&h=600&fit=crop'
```

---

## Ejemplos Completos

### Ejemplo 1: Casa en Venta

```typescript
{
  id: 'prop-001',
  title: 'Casa 3 Dormitorios - Villa Allende',
  description: 'Hermosa casa familiar de 3 dormitorios en zona residencial de Villa Allende. Cuenta con amplio jardín, parrilla y cochera techada. A minutos del centro y con fácil acceso a rutas principales. Ideal para familias que buscan tranquilidad y espacios verdes.',
  price: 95000000,
  location: 'Villa Allende, Córdoba',
  type: 'casa',
  bedrooms: 3,
  bathrooms: 2,
  area: 130,
  images: [
    'URL_FOTO_FRENTE',
    'URL_FOTO_LIVING',
    'URL_FOTO_COCINA',
    'URL_FOTO_JARDIN'
  ],
  features: [
    'Jardín de 200m²',
    'Parrilla con quincho',
    'Cochera techada para 2 autos',
    'Closets empotrados en dormitorios',
    'Cocina integrada con muebles',
    'Pisos de cerámica',
    'Calefacción a gas',
    'Ventanas de aluminio con DVH'
  ],
  status: 'disponible',
  featured: true,
  yearBuilt: 2018,
  parking: 2,
  operation: 'venta'
},
```

### Ejemplo 2: Departamento en Alquiler

```typescript
{
  id: 'prop-002',
  title: 'Depto 2 Dormitorios - Nueva Córdoba',
  description: 'Moderno departamento de 2 dormitorios en el corazón de Nueva Córdoba. Edificio con amenities, seguridad 24hs y excelente ubicación cerca de universidades, supermercados y transporte público. Semi-amoblado, listo para habitar.',
  price: 250000,
  location: 'Nueva Córdoba, Córdoba Capital',
  type: 'departamento',
  bedrooms: 2,
  bathrooms: 1,
  area: 65,
  images: [
    'URL_FOTO_LIVING',
    'URL_FOTO_DORMITORIO',
    'URL_FOTO_COCINA',
    'URL_FOTO_BALCON'
  ],
  features: [
    'Balcón con parrilla',
    'Aire acondicionado frío/calor',
    'Semi-amoblado',
    'Lavarropas incluido',
    'Seguridad 24hs',
    'Ascensor',
    'SUM con parrilla',
    'Gimnasio en edificio'
  ],
  status: 'disponible',
  featured: true,
  yearBuilt: 2020,
  floor: 8,
  totalFloors: 15,
  parking: 1,
  expenses: 35000,
  operation: 'alquiler'
},
```

### Ejemplo 3: Local Comercial

```typescript
{
  id: 'prop-003',
  title: 'Local Comercial - Centro',
  description: 'Excelente local comercial en pleno centro de Córdoba Capital. Sobre calle peatonal de alta circulación. Ideal para indumentaria, accesorios, gastronomía o cualquier comercio que necesite gran exposición. Baño y depósito.',
  price: 180000,
  location: 'Centro, Córdoba Capital',
  type: 'local',
  area: 50,
  images: [
    'URL_FOTO_FRENTE',
    'URL_FOTO_INTERIOR',
    'URL_FOTO_VIDRIERA'
  ],
  features: [
    'Vidriera amplia sobre peatonal',
    'Baño completo',
    'Depósito',
    'Aire acondicionado',
    'Cortina metálica',
    'Instalación eléctrica trifásica',
    'Piso de porcelanato',
    'Iluminación LED'
  ],
  status: 'disponible',
  featured: false,
  yearBuilt: 2015,
  parking: 0,
  expenses: 25000,
  operation: 'alquiler'
},
```

### Ejemplo 4: Terreno

```typescript
{
  id: 'prop-004',
  title: 'Terreno 600m² - Carlos Paz',
  description: 'Lote en barrio privado de Villa Carlos Paz. Servicios completos, seguridad 24hs y amenities. Vista panorámica a las sierras. Ideal para construcción de casa de fin de semana o inversión. Escritura al día.',
  price: 32000000,
  location: 'Villa Carlos Paz, Córdoba',
  type: 'terreno',
  area: 600,
  images: [
    'URL_FOTO_TERRENO',
    'URL_FOTO_VISTA',
    'URL_FOTO_ACCESO'
  ],
  features: [
    'Servicios completos (agua, luz, gas, cloacas)',
    'Acceso pavimentado',
    'Seguridad 24hs',
    'Vista panorámica',
    'Amenities del barrio: pileta, quincho, canchas',
    'Escritura al día',
    'Apto construcción inmediata',
    'Cerca del centro de Carlos Paz'
  ],
  status: 'disponible',
  featured: true,
  parking: 0,
  operation: 'venta'
},
```

---

## Tips y Mejores Prácticas

### ✅ DOs (Hacer)

- **Títulos descriptivos:** "Casa 3 Dorm - Villa Allende" mejor que solo "Casa"
- **Descripciones completas:** 2-3 párrafos con detalles importantes
- **Precio real:** Sin puntos ni comas (85000000 no $85.000.000)
- **Múltiples imágenes:** Mínimo 3, ideal 5-8 fotos
- **Features específicas:** "Cocina con muebles de algarrobo" mejor que "Cocina"
- **Ubicación precisa:** Incluir barrio y ciudad
- **Actualizar estado:** Cambiar a 'reservado' o 'vendido' cuando corresponda

### ❌ DON'Ts (No hacer)

- No usar descripciones genéricas
- No poner precios con formato (quitar $ . ,)
- No usar una sola imagen
- No olvidar actualizar propiedades vendidas/alquiladas
- No mezclar datos ficticios con reales
- No usar imágenes de baja calidad

### 📝 Checklist antes de agregar

- [ ] Tengo todas las fotos en buena calidad
- [ ] Tengo las fotos subidas y las URLs
- [ ] Tengo todos los datos de la propiedad
- [ ] El precio es correcto y está sin formato
- [ ] La descripción es clara y atractiva
- [ ] Las características son específicas y reales
- [ ] El ID es único (no se repite)
- [ ] El estado es 'disponible'
- [ ] La operación es correcta (venta/alquiler)

---

## Workflow Recomendado

1. **Recolectar información:**
   - Fotos de la propiedad
   - Datos técnicos (m², habitaciones, etc.)
   - Características especiales
   - Precio y condiciones

2. **Preparar imágenes:**
   - Subir a Imgur/Cloudinary
   - Copiar URLs
   - Verificar que se vean bien

3. **Copiar template:**
   - Usar el template de arriba
   - Completar todos los campos
   - Revisar que no falte nada

4. **Agregar al archivo:**
   - Abrir `src/data/properties.ts`
   - Pegar dentro del array
   - Guardar archivo

5. **Verificar:**
   ```bash
   npm run dev
   ```
   - Abrir http://localhost:3000/propiedades
   - Verificar que la propiedad se vea bien
   - Probar los filtros

---

## Código Completo para Copiar

Aquí está el código completo listo para copiar y pegar en `src/data/properties.ts`:

```typescript
export const properties: Property[] = [
  // ===== PROPIEDADES EN VENTA =====
  
  {
    id: 'prop-001',
    title: 'Casa 3 Dormitorios - Villa Allende',
    description: 'Hermosa casa familiar de 3 dormitorios en zona residencial de Villa Allende. Cuenta con amplio jardín, parrilla y cochera techada.',
    price: 95000000,
    location: 'Villa Allende, Córdoba',
    type: 'casa',
    bedrooms: 3,
    bathrooms: 2,
    area: 130,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop'
    ],
    features: [
      'Jardín de 200m²',
      'Parrilla con quincho',
      'Cochera techada para 2 autos',
      'Closets empotrados',
      'Cocina integrada',
      'Pisos de cerámica'
    ],
    status: 'disponible',
    featured: true,
    yearBuilt: 2018,
    parking: 2,
    operation: 'venta'
  },
  
  // ===== PROPIEDADES EN ALQUILER =====
  
  {
    id: 'prop-101',
    title: 'Depto 2 Dormitorios - Nueva Córdoba',
    description: 'Moderno departamento de 2 dormitorios en el corazón de Nueva Córdoba. Edificio con amenities y seguridad 24hs.',
    price: 250000,
    location: 'Nueva Córdoba, Córdoba Capital',
    type: 'departamento',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop'
    ],
    features: [
      'Balcón con parrilla',
      'Aire acondicionado',
      'Semi-amoblado',
      'Seguridad 24hs',
      'Ascensor',
      'Gimnasio'
    ],
    status: 'disponible',
    featured: true,
    yearBuilt: 2020,
    floor: 8,
    totalFloors: 15,
    parking: 1,
    expenses: 35000,
    operation: 'alquiler'
  },
  
  // Agregar más propiedades aquí...
  
]
```

---

## 🚀 Próximos Pasos

Una vez que agregues tus propiedades:

1. **Verificar en el sitio:**
   ```bash
   npm run dev
   ```
   Visita http://localhost:3000/propiedades

2. **Probar búsquedas:**
   - Busca por ubicación
   - Filtra por tipo
   - Prueba venta vs alquiler

3. **Compartir:**
   - Haz un build: `npm run build`
   - Despliega a producción
   - ¡Comparte tus propiedades!

---

**¿Necesitas ayuda?**

Si tienes dudas sobre cómo agregar propiedades, contáctame y te ayudo personalmente.

---

**Fecha de creación:** Octubre 2025  
**Última actualización:** Octubre 2025  
**Versión:** 1.0.0

