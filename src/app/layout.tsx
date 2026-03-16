import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import '../styles/accessibility.css'
import '../styles/microinteractions.css'
import StructuredData from '@/components/StructuredData'
import { AuthProvider } from '@/components/AuthProvider'
import { ToastProvider } from '@/components/ToastContainer'
import ConditionalLayout from '@/components/ConditionalLayout'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import FacebookPixel from '@/components/FacebookPixel'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import ErrorBoundary from '@/components/ErrorBoundary'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Julieta Arena - Martillera Pública y Perito Tasador | Servicios Inmobiliarios Córdoba',
  description: 'Martillera Pública y Perito Tasador (MP: 06-1216) en Córdoba, Argentina. Servicios profesionales de venta, alquiler de propiedades, tasaciones, remates judiciales y administración de propiedades.',
  keywords: ['martillera pública', 'perito tasador', 'inmobiliaria Córdoba', 'venta propiedades', 'alquiler', 'remates judiciales', 'tasaciones', 'Julieta Arena', 'CPCPI Córdoba'],
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
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" data-theme="light" style={{ colorScheme: 'light' }}>
      <head>
        <StructuredData />
      </head>
      <body
        className={poppins.className}
        style={{ backgroundColor: '#ffffff', color: '#2d3436' }}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Desregistrar service workers problemáticos
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    if (registration.active && registration.active.scriptURL.includes('notifications-sw')) {
                      registration.unregister().then(function(success) {
                        if (success) window.location.reload();
                      });
                    }
                  }
                });
              }
            `,
          }}
        />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <FacebookPixel pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID} />
        )}
        <ErrorBoundary>
          <ToastProvider>
            <AnalyticsProvider>
              <AuthProvider>
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
              </AuthProvider>
            </AnalyticsProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
