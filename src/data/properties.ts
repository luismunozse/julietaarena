export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  type: 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina'
  bedrooms?: number
  bathrooms?: number
  area: number
  coveredArea?: number // Área cubierta
  images: string[]
  features: string[]
  status: 'disponible' | 'reservado' | 'vendido'
  featured: boolean
  yearBuilt?: number
  parking?: number
  floor?: number
  totalFloors?: number
  orientation?: string
  expenses?: number
  operation: 'venta' | 'alquiler'
  broker?: {
    name: string
    phone: string
    email: string
    avatar?: string
  }
  coordinates?: {
    lat: number
    lng: number
  }
}

// Array temporal con propiedades de ejemplo - REEMPLAZAR CON DATOS REALES
// Ver: AGREGAR_PROPIEDADES.md para instrucciones detalladas
export const properties: Property[] = [
  {
    id: 'prop-001',
    title: 'Casa en Villa Allende',
    description: 'Hermosa casa de 3 dormitorios en zona residencial de Villa Allende. Ideal para familias, con amplio jardín y garaje.',
    price: 85000000,
    location: 'Villa Allende, Córdoba',
    type: 'casa',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop&crop=center'
    ],
    features: [
      'Jardín amplio',
      'Garaje cubierto',
      'Parrilla',
      'Closets empotrados',
      'Pisos de cerámica',
      'Cocina integrada'
    ],
    status: 'disponible',
    featured: true,
    yearBuilt: 2018,
    parking: 1,
    operation: 'venta'
  },
  {
    id: 'prop-002',
    title: 'Departamento en Nueva Córdoba',
    description: 'Moderno departamento de 2 dormitorios en el corazón de Nueva Córdoba. Excelente ubicación cerca de universidades y centros comerciales.',
    price: 65000000,
    location: 'Nueva Córdoba, Córdoba Capital',
    type: 'departamento',
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop&crop=center'
    ],
    features: [
      'Balcón con vista',
      'Aire acondicionado',
      'Amoblado',
      'Seguridad 24hs',
      'Ascensor',
      'Lavadero'
    ],
    status: 'disponible',
    featured: true,
    yearBuilt: 2020,
    floor: 8,
    totalFloors: 12,
    parking: 1,
    expenses: 15000,
    operation: 'venta'
  },
  {
    id: 'prop-003',
    title: 'Terreno en Carlos Paz',
    description: 'Loteo en Villa Carlos Paz, ideal para construcción de casa de fin de semana o inversión. Servicios completos.',
    price: 25000000,
    location: 'Villa Carlos Paz, Córdoba',
    type: 'terreno',
    area: 800,
    images: [
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop&crop=center'
    ],
    features: [
      'Servicios completos',
      'Acceso pavimentado',
      'Luz y gas',
      'Agua potable',
      'Desagües pluviales',
      'Escrituración inmediata'
    ],
    status: 'disponible',
    featured: false,
    parking: 0,
    operation: 'venta'
  },
  {
    id: 'prop-004',
    title: 'Local Comercial en Centro',
    description: 'Local comercial en pleno centro de Córdoba, ideal para comercio o oficinas. Excelente exposición y tránsito peatonal.',
    price: 45000000,
    location: 'Centro, Córdoba Capital',
    type: 'local',
    area: 60,
    images: [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&crop=center'
    ],
    features: [
      'Vidriera amplia',
      'Baño',
      'Aire acondicionado',
      'Piso de gres',
      'Iluminación LED',
      'Seguridad'
    ],
    status: 'disponible',
    featured: false,
    yearBuilt: 2015,
    parking: 0,
    expenses: 25000,
    operation: 'venta'
  },
  {
    id: 'prop-005',
    title: 'Casa en Barrio Norte',
    description: 'Casa de 4 dormitorios en Barrio Norte, zona muy cotizada. Gran terreno con pileta y quincho.',
    price: 120000000,
    location: 'Barrio Norte, Córdoba Capital',
    type: 'casa',
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop&crop=center'
    ],
    features: [
      'Pileta',
      'Quincho con parrilla',
      'Jardín amplio',
      'Cochera para 2 autos',
      'Dependencia de servicio',
      'Pisos de madera',
      'Calefacción central'
    ],
    status: 'disponible',
    featured: true,
    yearBuilt: 2010,
    parking: 2,
    operation: 'venta'
  },
  {
    id: 'prop-006',
    title: 'Oficina en Torre Empresarial',
    description: 'Oficina moderna en torre empresarial de Córdoba. Ideal para profesionales o pequeñas empresas.',
    price: 35000000,
    location: 'Torre Empresarial, Córdoba Capital',
    type: 'oficina',
    area: 45,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center'
    ],
    features: [
      'Vista panorámica',
      'Aire acondicionado',
      'Internet fibra óptica',
      'Recepción compartida',
      'Estacionamiento',
      'Seguridad 24hs'
    ],
    status: 'disponible',
    featured: false,
    yearBuilt: 2019,
    floor: 15,
    totalFloors: 20,
    parking: 1,
    expenses: 18000,
    operation: 'venta'
  },
  {
    id: 'prop-007',
    title: 'Departamento en Alquiler - Centro',
    description: 'Hermoso departamento de 1 dormitorio en alquiler en el centro de Córdoba. Ideal para estudiantes o profesionales.',
    price: 180000,
    location: 'Centro, Córdoba Capital',
    type: 'departamento',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=400&fit=crop&crop=center'
    ],
    features: [
      'Amoblado',
      'Aire acondicionado',
      'Internet incluido',
      'Seguridad 24hs',
      'Ascensor',
      'Lavadero'
    ],
    status: 'disponible',
    featured: true,
    yearBuilt: 2018,
    floor: 5,
    totalFloors: 8,
    parking: 0,
    expenses: 25000,
    operation: 'alquiler'
  },
  {
    id: 'prop-008',
    title: 'Casa en Alquiler - Barrio Jardín',
    description: 'Casa de 3 dormitorios en alquiler en Barrio Jardín. Perfecta para familias con jardín y parrilla.',
    price: 280000,
    location: 'Barrio Jardín, Córdoba Capital',
    type: 'casa',
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop&crop=center'
    ],
    features: [
      'Jardín amplio',
      'Parrilla',
      'Garaje cubierto',
      'Closets empotrados',
      'Pisos de cerámica',
      'Cocina completa'
    ],
    status: 'disponible',
    featured: true,
    yearBuilt: 2015,
    parking: 1,
    operation: 'alquiler'
  },
  {
    id: 'prop-009',
    title: 'Local Comercial en Alquiler',
    description: 'Local comercial en alquiler en zona comercial de alta circulación. Ideal para comercios.',
    price: 120000,
    location: 'Barrio Güemes, Córdoba Capital',
    type: 'local',
    area: 40,
    images: [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&crop=center'
    ],
    features: [
      'Vidriera amplia',
      'Baño',
      'Aire acondicionado',
      'Iluminación LED',
      'Piso de gres',
      'Acceso fácil'
    ],
    status: 'disponible',
    featured: false,
    yearBuilt: 2017,
    parking: 0,
    expenses: 15000,
    operation: 'alquiler'
  },
  {
    id: 'prop-010',
    title: 'Oficina en Alquiler - Torre Empresarial',
    description: 'Oficina moderna en alquiler en torre empresarial. Ideal para profesionales independientes.',
    price: 95000,
    location: 'Torre Empresarial, Córdoba Capital',
    type: 'oficina',
    area: 35,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center'
    ],
    features: [
      'Vista panorámica',
      'Aire acondicionado',
      'Internet fibra óptica',
      'Recepción compartida',
      'Estacionamiento',
      'Seguridad 24hs'
    ],
    status: 'disponible',
    featured: false,
    yearBuilt: 2020,
    floor: 12,
    totalFloors: 20,
    parking: 1,
    expenses: 12000,
    operation: 'alquiler'
  }
]

export const getFeaturedProperties = (): Property[] => {
  return properties.filter(prop => prop.featured && prop.status === 'disponible')
}

export const getPropertiesByType = (type: string): Property[] => {
  return properties.filter(prop => prop.type === type && prop.status === 'disponible')
}

export const getPropertyById = (id: string): Property | undefined => {
  return properties.find(prop => prop.id === id)
}

export const getPropertiesByOperation = (operation: 'venta' | 'alquiler'): Property[] => {
  return properties.filter(prop => prop.operation === operation && prop.status === 'disponible')
}

export const getPropertiesForSale = (): Property[] => {
  return getPropertiesByOperation('venta')
}

export const getPropertiesForRent = (): Property[] => {
  return getPropertiesByOperation('alquiler')
}
