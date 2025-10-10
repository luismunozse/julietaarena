import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import StructuredData from '@/components/StructuredData'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Julieta Arena - Martillera Pública | Servicios Inmobiliarios Córdoba',
  description: 'Martillera Pública en Córdoba, Argentina. Servicios profesionales de venta, alquiler de propiedades, remates judiciales, jubilaciones y tasaciones. Experiencia y transparencia garantizada.',
  keywords: ['martillera pública', 'inmobiliaria Córdoba', 'venta propiedades', 'alquiler', 'remates judiciales', 'tasaciones', 'jubilaciones', 'Julieta Arena'],
  authors: [{ name: 'Julieta Arena' }],
  creator: 'Julieta Arena',
  publisher: 'Julieta Arena Servicios Inmobiliarios',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://julietaarena.com.ar'),
  openGraph: {
    title: 'Julieta Arena - Martillera Pública | Servicios Inmobiliarios',
    description: 'Servicios profesionales de venta, alquiler, remates judiciales y tasaciones en Córdoba, Argentina.',
    url: 'https://julietaarena.com.ar',
    siteName: 'Julieta Arena Servicios Inmobiliarios',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Julieta Arena - Martillera Pública',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Julieta Arena - Martillera Pública',
    description: 'Servicios inmobiliarios profesionales en Córdoba, Argentina',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <StructuredData />
      </head>
      <body className={poppins.className}>{children}</body>
    </html>
  )
}

