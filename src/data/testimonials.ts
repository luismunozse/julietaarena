export interface Testimonial {
  id: string
  name: string
  location: string
  service: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

export const testimonials: Testimonial[] = [
  {
    id: 'test-001',
    name: 'María González',
    location: 'Villa Allende, Córdoba',
    service: 'Venta de Casa',
    rating: 5,
    comment: 'Excelente profesional. Julieta nos ayudó a vender nuestra casa en tiempo récord y con un precio justo. Su asesoramiento fue fundamental durante todo el proceso.',
    date: '2024-01-15',
    verified: true
  },
  {
    id: 'test-002',
    name: 'Carlos Rodríguez',
    location: 'Nueva Córdoba, Córdoba',
    service: 'Alquiler de Departamento',
    rating: 5,
    comment: 'Muy satisfecho con el servicio. Encontré el departamento perfecto gracias a su conocimiento del mercado. Recomiendo totalmente sus servicios.',
    date: '2024-01-08',
    verified: true
  },
  {
    id: 'test-003',
    name: 'Ana Martínez',
    location: 'Barrio Norte, Córdoba',
    service: 'Tasación de Propiedad',
    rating: 5,
    comment: 'Profesional, puntual y muy clara en sus explicaciones. La tasación fue precisa y me ayudó mucho en la sucesión familiar. Gracias Julieta!',
    date: '2023-12-20',
    verified: true
  },
  {
    id: 'test-004',
    name: 'Roberto Silva',
    location: 'Centro, Córdoba',
    service: 'Remate Judicial',
    rating: 5,
    comment: 'Participé en varios remates con Julieta y siempre fue transparente y profesional. Su experiencia en el tema es notable.',
    date: '2023-12-10',
    verified: true
  },
  {
    id: 'test-005',
    name: 'Laura Fernández',
    location: 'Carlos Paz, Córdoba',
    service: 'Asesoramiento Legal',
    rating: 5,
    comment: 'El asesoramiento legal fue excelente. Me ayudó con la documentación de mi propiedad y todo salió perfecto. Muy recomendable.',
    date: '2023-11-28',
    verified: true
  },
  {
    id: 'test-006',
    name: 'Miguel Torres',
    location: 'Barrio Jardín, Córdoba',
    service: 'Compra de Casa',
    rating: 5,
    comment: 'Como comprador, Julieta me guió en todo el proceso. Su conocimiento del mercado y honestidad me dieron mucha confianza.',
    date: '2023-11-15',
    verified: true
  }
]

export const getFeaturedTestimonials = (): Testimonial[] => {
  return testimonials.filter(testimonial => testimonial.verified).slice(0, 6)
}

export const getTestimonialsByService = (service: string): Testimonial[] => {
  return testimonials.filter(testimonial => 
    testimonial.service.toLowerCase().includes(service.toLowerCase()) && 
    testimonial.verified
  )
}
