# Guía para Reemplazar Imágenes de Propiedades

## 📸 Imágenes Actuales

He agregado imágenes de muestra de alta calidad de Unsplash para todas las propiedades. Estas son temporales y puedes reemplazarlas fácilmente.

## 🔄 Cómo Reemplazar las Imágenes

### 1. **Ubicación del Archivo**
Las imágenes están definidas en: `src/data/properties.ts`

### 2. **Estructura Actual**
Cada propiedad tiene un array `images` con URLs de Unsplash:

```typescript
images: [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop&crop=center'
],
```

### 3. **Tipos de Imágenes por Propiedad**

#### **🏠 Casas (Venta y Alquiler)**
- **Imagen 1**: Fachada principal
- **Imagen 2**: Living/Sala de estar
- **Imagen 3**: Cocina
- **Imagen 4**: Dormitorio (si aplica)

#### **🏢 Departamentos**
- **Imagen 1**: Fachada del edificio
- **Imagen 2**: Interior del departamento
- **Imagen 3**: Vista desde balcón (si aplica)

#### **🏪 Locales Comerciales**
- **Imagen 1**: Fachada del local
- **Imagen 2**: Interior del local

#### **🏢 Oficinas**
- **Imagen 1**: Torre/edificio
- **Imagen 2**: Interior de la oficina

#### **🌳 Terrenos**
- **Imagen 1**: Vista del terreno
- **Imagen 2**: Entorno/ubicación

### 4. **Opciones para Reemplazar**

#### **Opción A: Imágenes Locales**
```typescript
images: [
  '/images/propiedades/casa-villa-allende-1.jpg',
  '/images/propiedades/casa-villa-allende-2.jpg',
  '/images/propiedades/casa-villa-allende-3.jpg'
],
```

#### **Opción B: URLs Externas**
```typescript
images: [
  'https://tudominio.com/images/casa1.jpg',
  'https://tudominio.com/images/casa2.jpg',
  'https://tudominio.com/images/casa3.jpg'
],
```

### 5. **Recomendaciones Técnicas**

#### **Tamaño de Imágenes**
- **Ancho**: 600px mínimo
- **Alto**: 400px mínimo
- **Formato**: JPG o WebP (mejor compresión)
- **Calidad**: 80-85% para web

#### **Optimización**
- Comprime las imágenes antes de subirlas
- Usa herramientas como TinyPNG o ImageOptim
- Considera usar WebP para mejor rendimiento

### 6. **Propiedades Actuales**

| ID | Propiedad | Tipo | Imágenes Actuales |
|----|-----------|------|-------------------|
| prop-001 | Casa Villa Allende | Casa | 3 imágenes de casa moderna |
| prop-002 | Depto Nueva Córdoba | Departamento | 3 imágenes de departamento |
| prop-003 | Terreno Carlos Paz | Terreno | 2 imágenes de terreno |
| prop-004 | Local Centro | Local | 3 imágenes de local comercial |
| prop-005 | Casa Barrio Norte | Casa | 4 imágenes de casa lujosa |
| prop-006 | Oficina Torre | Oficina | 2 imágenes de oficina |
| prop-007 | Depto Alquiler Centro | Departamento | 2 imágenes de departamento |
| prop-008 | Casa Alquiler Jardín | Casa | 3 imágenes de casa familiar |
| prop-009 | Local Alquiler Güemes | Local | 2 imágenes de local comercial |
| prop-010 | Oficina Alquiler Torre | Oficina | 2 imágenes de oficina |

### 7. **Pasos para Reemplazar**

1. **Prepara tus imágenes** con los tamaños recomendados
2. **Sube las imágenes** a tu servidor o carpeta `public/images/`
3. **Abre** `src/data/properties.ts`
4. **Busca** la propiedad que quieres modificar
5. **Reemplaza** las URLs en el array `images`
6. **Guarda** el archivo
7. **Recarga** la página para ver los cambios

### 8. **Ejemplo de Reemplazo**

**Antes:**
```typescript
images: [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop&crop=center'
],
```

**Después:**
```typescript
images: [
  '/images/propiedades/mi-casa-fachada.jpg',
  '/images/propiedades/mi-casa-living.jpg',
  '/images/propiedades/mi-casa-cocina.jpg'
],
```

## 🎯 **Resultado**

Una vez reemplazadas las imágenes, verás:
- **Galería real** de cada propiedad
- **Navegación entre imágenes** funcionando
- **Mejor presentación** para los clientes
- **Sitio más profesional** y confiable

¡Las imágenes de muestra están listas para ser reemplazadas por las reales de tus propiedades!
