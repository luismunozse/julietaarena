interface PropertyStructuredDataProps {
  property: {
    id: string
    title: string
    description?: string
    price: number
    currency: string
    location: string
    type: string
    operation: string
    images?: string[]
    area?: number
    bedrooms?: number
    bathrooms?: number
  }
}

const BUCKET = 'property-images'

function getImageUrl(urlOrPath: string): string {
  if (urlOrPath.startsWith('http')) return urlOrPath
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return urlOrPath
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${urlOrPath}`
}

export default function PropertyStructuredData({ property }: PropertyStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://julietaarena.com.ar'

  const images = Array.isArray(property.images)
    ? property.images.filter(Boolean).map((img: string) => getImageUrl(img.trim()))
    : []

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description || '',
    url: `${baseUrl}/propiedades/${property.id}`,
    ...(images.length > 0 && { image: images }),
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency === 'USD' ? 'USD' : 'ARS',
      availability: 'https://schema.org/InStock',
      businessFunction: property.operation === 'alquiler'
        ? 'https://schema.org/LeaseOut'
        : 'https://schema.org/Sell',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location,
      addressRegion: 'Córdoba',
      addressCountry: 'AR',
    },
    ...(property.area && {
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.area,
        unitCode: 'MTK',
      },
    }),
    ...(property.bedrooms && { numberOfBedrooms: property.bedrooms }),
    ...(property.bathrooms && { numberOfBathroomsTotal: property.bathrooms }),
    broker: {
      '@type': 'RealEstateAgent',
      name: 'Julieta Arena',
      url: baseUrl,
      telephone: '+54-351-307-8376',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
