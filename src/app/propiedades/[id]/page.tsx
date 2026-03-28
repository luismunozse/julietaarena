import type { Metadata } from 'next'
import { getPropertyServer, getAllPropertyIds } from '@/lib/supabaseQueries'
import PropertyDetailClient from './PropertyDetailClient'
import PropertyStructuredData from '@/components/PropertyStructuredData'

// ISR: revalidate every 120 seconds
export const revalidate = 120

const BUCKET = 'property-images'

function getImageUrl(urlOrPath: string): string {
  if (urlOrPath.startsWith('http')) return urlOrPath
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return urlOrPath
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${urlOrPath}`
}

function formatPrice(price: number, currency: string): string {
  const formatted = Number(price).toLocaleString('es-AR')
  return currency === 'USD' ? `USD ${formatted}` : `$ ${formatted}`
}

const typeLabels: Record<string, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  terreno: 'Terreno',
  local: 'Local',
  oficina: 'Oficina',
  cochera: 'Cochera',
}

const operationLabels: Record<string, string> = {
  venta: 'en Venta',
  alquiler: 'en Alquiler',
}

export async function generateStaticParams() {
  const ids = await getAllPropertyIds()
  return ids.map(id => ({ id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const property = await getPropertyServer(id)

  if (!property) {
    return {
      title: 'Propiedad no encontrada | Julieta Arena',
    }
  }

  const price = formatPrice(property.price, property.currency)
  const typeName = typeLabels[property.type] || property.type
  const opName = operationLabels[property.operation] || property.operation
  const title = `${property.title} - ${price} | Julieta Arena`
  const description = `${typeName} ${opName} en ${property.location}. ${price}. ${property.area ? `${property.area} m²` : ''}${property.bedrooms ? ` · ${property.bedrooms} dormitorios` : ''}${property.bathrooms ? ` · ${property.bathrooms} baños` : ''}. ${property.description?.slice(0, 120) || ''}`

  const images: string[] = Array.isArray(property.images) && property.images.length > 0
    ? property.images.filter(Boolean).slice(0, 4).map((img: string) => getImageUrl(img.trim()))
    : ['/og-image.jpg']

  const url = `https://julietaarena.com.ar/propiedades/${property.id}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Julieta Arena Servicios Inmobiliarios',
      locale: 'es_AR',
      type: 'article',
      images: images.map((img) => ({
        url: img,
        width: 1200,
        height: 630,
        alt: property.title,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  }
}

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params
  const property = await getPropertyServer(id)

  return (
    <>
      {property && <PropertyStructuredData property={property} />}
      <PropertyDetailClient id={id} />
    </>
  )
}
