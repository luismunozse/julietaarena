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
  rooms?: number // Ambientes
  area: number
  coveredArea?: number
  images: string[]
  features: string[]
  status: 'disponible' | 'reservado' | 'vendido'
  featured: boolean
  yearBuilt?: number
  parking?: number
  floor?: number
  totalFloors?: number
  orientation?: string
  disposition?: string // frente, contrafrente, interno, lateral
  expenses?: number
  operation: 'venta' | 'alquiler' | 'alquiler_temporal'
  condition?: string // a_estrenar, muy_bueno, bueno, regular, a_reciclar
  aptCredit?: boolean
  internalCode?: string
  videoUrl?: string
  services?: string[] // agua, gas, cloacas, electricidad, internet, etc.
  documentation?: string[] // escritura, planos, final_de_obra, etc.
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

// Las propiedades se gestionan desde el panel de administración
// y se almacenan en Supabase. Este array vacío es el fallback inicial.
export const properties: Property[] = []
