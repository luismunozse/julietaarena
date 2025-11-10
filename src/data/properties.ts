export interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: 'ARS' | 'USD'
  location: string
  type: 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'cochera'
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
  createdBy?: string
  updatedBy?: string
  createdAt?: string
  updatedAt?: string
}

// Array de propiedades - Las propiedades se gestionan desde el panel de administración
// y se almacenan en localStorage o Supabase. Inicia vacío sin datos de ejemplo.
export const properties: Property[] = []

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
