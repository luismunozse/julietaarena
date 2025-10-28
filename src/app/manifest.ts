import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Julieta Arena - Servicios Inmobiliarios',
    short_name: 'Julieta Arena',
    description: 'Martillera Pública en Córdoba, Argentina. Servicios de venta, alquiler, remates judiciales y más.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2c5f7d',
    // Temporal: usando data URL. Para PWA completo, crear iconos reales y colocarlos en /public/
    icons: [
      {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

