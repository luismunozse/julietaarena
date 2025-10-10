export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Julieta Arena Servicios Inmobiliarios',
    description: 'Martillera Pública en Córdoba, Argentina. Servicios profesionales de venta, alquiler de propiedades, remates judiciales, jubilaciones y tasaciones.',
    url: 'https://julietaarena.com.ar',
    telephone: '+54-351-307-8376',
    email: 'inmobiliaria72juliarena@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Córdoba',
      addressCountry: 'AR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -31.4201,
      longitude: -64.1888,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: 'Córdoba',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios Inmobiliarios',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Venta de Propiedades',
            description: 'Asesoramiento integral en la compra y venta de inmuebles',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Alquileres',
            description: 'Administración de alquileres residenciales y comerciales',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Remates Judiciales',
            description: 'Especialización en remates judiciales y subastas públicas',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Jubilaciones',
            description: 'Asesoramiento en trámites de jubilaciones y gestiones previsionales',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Tasaciones',
            description: 'Tasaciones profesionales de inmuebles',
          },
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

