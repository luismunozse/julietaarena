// Structured Data for SEO
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Julieta Arena - Martillera Pública",
  "alternateName": "Julieta Arena",
  "description": "Martillera Pública especializada en remates judiciales, asesoramiento legal inmobiliario y gestión de propiedades en Córdoba, Argentina.",
  "url": "https://julietaarena.com",
  "logo": "https://julietaarena.com/logo.png",
  "image": "https://julietaarena.com/og-image.jpg",
  "telephone": "+54-351-123-4567",
  "email": "contacto@julietaarena.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Hipólito Yrigoyen 1234",
    "addressLocality": "Córdoba",
    "addressRegion": "Córdoba",
    "postalCode": "5000",
    "addressCountry": "AR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-31.4201",
    "longitude": "-64.1888"
  },
  "areaServed": {
    "@type": "City",
    "name": "Córdoba",
    "containedInPlace": {
      "@type": "State",
      "name": "Córdoba"
    }
  },
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "-31.4201",
      "longitude": "-64.1888"
    },
    "geoRadius": "50000"
  },
  "foundingDate": "2014",
  "founder": {
    "@type": "Person",
    "name": "Julieta Arena"
  },
  "sameAs": [
    "https://www.facebook.com/julietaarena",
    "https://www.instagram.com/julietaarena",
    "https://www.linkedin.com/in/julietaarena"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servicios Inmobiliarios",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Remates Judiciales",
          "description": "Asesoramiento profesional para participar en remates judiciales"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Asesoramiento Legal Inmobiliario",
          "description": "Consultoría legal especializada en temas inmobiliarios"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Gestión de Propiedades",
          "description": "Administración y gestión integral de propiedades"
        }
      }
    ]
  }
})

export const getPersonSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Julieta Arena",
  "jobTitle": "Martillera Pública",
  "description": "Martillera Pública con más de 10 años de experiencia en remates judiciales y asesoramiento legal inmobiliario en Córdoba, Argentina.",
  "url": "https://julietaarena.com",
  "image": "https://julietaarena.com/images/perfil.jpeg",
  "telephone": "+54-351-123-4567",
  "email": "contacto@julietaarena.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Hipólito Yrigoyen 1234",
    "addressLocality": "Córdoba",
    "addressRegion": "Córdoba",
    "postalCode": "5000",
    "addressCountry": "AR"
  },
  "worksFor": {
    "@type": "Organization",
    "name": "Julieta Arena - Martillera Pública"
  },
  "knowsAbout": [
    "Remates Judiciales",
    "Derecho Inmobiliario",
    "Asesoramiento Legal",
    "Gestión de Propiedades",
    "Martillero Público"
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Martillero Público",
      "credentialCategory": "professional",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Colegio de Martilleros de Córdoba"
      }
    }
  ],
  "sameAs": [
    "https://www.facebook.com/julietaarena",
    "https://www.instagram.com/julietaarena",
    "https://www.linkedin.com/in/julietaarena"
  ]
})

export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://julietaarena.com/#business",
  "name": "Julieta Arena - Martillera Pública",
  "description": "Servicios profesionales de martillero público, remates judiciales y asesoramiento legal inmobiliario en Córdoba.",
  "url": "https://julietaarena.com",
  "telephone": "+54-351-123-4567",
  "email": "contacto@julietaarena.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Hipólito Yrigoyen 1234",
    "addressLocality": "Córdoba",
    "addressRegion": "Córdoba",
    "postalCode": "5000",
    "addressCountry": "AR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-31.4201",
    "longitude": "-64.1888"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "13:00"
    }
  ],
  "priceRange": "$$",
  "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
  "currenciesAccepted": "ARS",
  "areaServed": {
    "@type": "City",
    "name": "Córdoba"
  },
  "hasMap": "https://maps.google.com/?q=-31.4201,-64.1888",
  "image": "https://julietaarena.com/og-image.jpg",
  "logo": "https://julietaarena.com/logo.png"
})

export const getServiceSchema = (serviceName: string, description: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": serviceName,
  "description": description,
  "provider": {
    "@type": "Organization",
    "name": "Julieta Arena - Martillera Pública",
    "url": "https://julietaarena.com"
  },
  "areaServed": {
    "@type": "City",
    "name": "Córdoba"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://julietaarena.com",
    "servicePhone": "+54-351-123-4567"
  }
})

export const getArticleSchema = (article: {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  image?: string
  url: string
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image || "https://julietaarena.com/og-image.jpg",
  "author": {
    "@type": "Person",
    "name": article.author,
    "url": "https://julietaarena.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Julieta Arena - Martillera Pública",
    "logo": {
      "@type": "ImageObject",
      "url": "https://julietaarena.com/logo.png"
    }
  },
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  },
  "url": article.url
})

export const getBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
})

export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
})

export const getPropertySchema = (property: {
  name: string
  description: string
  address: string
  price: number
  currency: string
  image: string
  url: string
}) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Julieta Arena - Martillera Pública",
  "url": "https://julietaarena.com",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Propiedades en Venta",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "RealEstateListing",
          "name": property.name,
          "description": property.description,
          "image": property.image,
          "url": property.url,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": property.address,
            "addressLocality": "Córdoba",
            "addressRegion": "Córdoba",
            "addressCountry": "AR"
          },
          "offers": {
            "@type": "Offer",
            "price": property.price,
            "priceCurrency": property.currency,
            "availability": "https://schema.org/InStock"
          }
        }
      }
    ]
  }
})
