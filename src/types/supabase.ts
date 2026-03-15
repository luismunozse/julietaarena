/**
 * Tipos específicos para respuestas de Supabase
 * Estos tipos representan la estructura exacta de los datos que vienen de Supabase
 */

export interface SupabaseProperty {
  id: string
  title: string
  description: string
  price: number
  currency: 'ARS' | 'USD'
  location: string
  type: 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'cochera'
  bedrooms: number | null
  bathrooms: number | null
  rooms: number | null
  area: number
  covered_area: number | null
  images: string[] | null
  features: string[] | null
  status: 'disponible' | 'reservado' | 'vendido'
  featured: boolean
  year_built: number | null
  parking: number | null
  floor: number | null
  total_floors: number | null
  orientation: string | null
  disposition: string | null
  expenses: number | null
  operation: 'venta' | 'alquiler' | 'alquiler_temporal'
  condition: string | null
  apt_credit: boolean | null
  internal_code: string | null
  video_url: string | null
  services: string[] | null
  documentation: string[] | null
  broker_name: string | null
  broker_phone: string | null
  broker_email: string | null
  broker_avatar: string | null
  latitude: number | null
  longitude: number | null
  created_at: string | null
  updated_at: string | null
  created_by: string | null
  updated_by: string | null
}

export interface SupabaseResponse<T> {
  data: T | null
  error: {
    message: string
    details?: string
    hint?: string
    code?: string
  } | null
}



