export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  tags: string[]
  image: string
  slug: string
  featured: boolean
  readTime: number
}

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-001',
    title: 'Guía Completa para Comprar tu Primera Casa',
    excerpt: 'Todo lo que necesitas saber sobre el proceso de compra de una propiedad, desde la búsqueda hasta la escrituración.',
    content: 'Contenido completo del artículo...',
    author: 'Julieta Arena',
    date: '2024-12-15',
    category: 'Consejos Legales',
    tags: ['primera-casa', 'financiamiento', 'consejos-legales', 'proceso-legal'],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop&crop=center',
    slug: 'guia-compra-casa',
    featured: true,
    readTime: 8
  },
  {
    id: 'blog-002',
    title: 'Remates Judiciales: Oportunidades y Riesgos',
    excerpt: 'Conoce las ventajas y desventajas de participar en remates judiciales, y cómo prepararte para una subasta exitosa.',
    content: 'Contenido completo del artículo...',
    author: 'Julieta Arena',
    date: '2024-01-15',
    category: 'Remates',
    tags: ['remates', 'judiciales', 'subastas', 'oportunidades'],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop&crop=center',
    slug: 'remates-judiciales-oportunidades-riesgos',
    featured: true,
    readTime: 6
  },
  {
    id: 'blog-003',
    title: 'Tendencias del Mercado Inmobiliario en Córdoba 2024',
    excerpt: 'Análisis del mercado inmobiliario cordobés: precios, zonas en crecimiento y proyecciones para este año.',
    content: 'Contenido completo del artículo...',
    author: 'Julieta Arena',
    date: '2024-01-10',
    category: 'Mercado',
    tags: ['mercado', 'tendencias', '2024', 'cordoba', 'precios'],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop&crop=center',
    slug: 'tendencias-mercado-inmobiliario-cordoba-2024',
    featured: true,
    readTime: 7
  },
  {
    id: 'blog-004',
    title: 'Documentación Necesaria para Alquilar una Propiedad',
    excerpt: 'Lista completa de documentos que necesitas para alquilar una propiedad y evitar problemas legales.',
    content: 'Contenido completo del artículo...',
    author: 'Julieta Arena',
    date: '2024-01-05',
    category: 'Alquileres',
    tags: ['alquiler', 'documentacion', 'requisitos', 'legal'],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=400&fit=crop&crop=center',
    slug: 'documentacion-necesaria-alquilar-propiedad',
    featured: false,
    readTime: 5
  },
  {
    id: 'blog-005',
    title: 'Cómo Calcular el Valor Real de tu Propiedad',
    excerpt: 'Aprende los factores que influyen en la tasación de una propiedad y cómo obtener una valoración precisa.',
    content: 'Contenido completo del artículo...',
    author: 'Julieta Arena',
    date: '2023-12-28',
    category: 'Tasaciones',
    tags: ['tasacion', 'valor', 'propiedad', 'calculo'],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop&crop=center',
    slug: 'calcular-valor-real-propiedad',
    featured: false,
    readTime: 6
  },
  {
    id: 'blog-006',
    title: 'Sucesiones: Guía Legal para Herederos',
    excerpt: 'Todo sobre el proceso de sucesión, declaratoria de herederos y trámites necesarios para heredar una propiedad.',
    content: 'Contenido completo del artículo...',
    author: 'Julieta Arena',
    date: '2023-12-20',
    category: 'Legal',
    tags: ['sucesiones', 'herencia', 'legal', 'tramites'],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop&crop=center',
    slug: 'sucesiones-guia-legal-herederos',
    featured: false,
    readTime: 9
  }
]

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured).slice(0, 3)
}

export const getPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === category)
}

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug)
}

export const getRecentPosts = (limit: number = 6): BlogPost[] => {
  return blogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}
