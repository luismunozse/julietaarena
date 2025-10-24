import Head from 'next/head'

interface AdvancedSEOProps {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  articleAuthor?: string
  articlePublishedTime?: string
  articleModifiedTime?: string
  articleSection?: string
  articleTags?: string[]
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterSite?: string
  twitterCreator?: string
  structuredData?: any
  noindex?: boolean
  nofollow?: boolean
  alternateHreflang?: Array<{ hreflang: string; href: string }>
  robots?: string
  viewport?: string
  themeColor?: string
  manifest?: string
  appleTouchIcon?: string
  favicon?: string
}

export default function AdvancedSEO({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  ogType = 'website',
  articleAuthor,
  articlePublishedTime,
  articleModifiedTime,
  articleSection,
  articleTags = [],
  twitterCard = 'summary_large_image',
  twitterSite,
  twitterCreator,
  structuredData,
  noindex = false,
  nofollow = false,
  alternateHreflang = [],
  robots,
  viewport = 'width=device-width, initial-scale=1',
  themeColor = '#2563eb',
  manifest,
  appleTouchIcon,
  favicon = '/favicon.ico'
}: AdvancedSEOProps) {
  const fullTitle = title.includes('Julieta Arena') ? title : `${title} | Julieta Arena - Martillera Pública`
  const fullDescription = description || 'Julieta Arena - Martillera Pública especializada en remates judiciales, asesoramiento legal inmobiliario y gestión de propiedades en Córdoba, Argentina.'
  const fullOgImage = ogImage || '/og-image.jpg'
  const fullCanonicalUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '')

  const robotsContent = robots || [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-snippet:-1',
    'max-image-preview:large',
    'max-video-preview:-1'
  ].join(', ')

  const structuredDataScript = structuredData ? JSON.stringify(structuredData) : null

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={robotsContent} />
      <meta name="viewport" content={viewport} />
      <meta name="theme-color" content={themeColor} />
      <meta name="author" content="Julieta Arena" />
      <meta name="generator" content="Next.js" />
      <meta name="language" content="es-AR" />
      <meta name="geo.region" content="AR-C" />
      <meta name="geo.placename" content="Córdoba" />
      <meta name="geo.position" content="-31.4201;-64.1888" />
      <meta name="ICBM" content="-31.4201, -64.1888" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Favicon and Icons */}
      <link rel="icon" href={favicon} />
      <link rel="apple-touch-icon" href={appleTouchIcon || '/apple-touch-icon.png'} />
      <link rel="manifest" href={manifest || '/manifest.json'} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="Julieta Arena - Martillera Pública" />
      <meta property="og:locale" content="es_AR" />

      {/* Article specific Open Graph tags */}
      {ogType === 'article' && (
        <>
          {articleAuthor && <meta property="article:author" content={articleAuthor} />}
          {articlePublishedTime && <meta property="article:published_time" content={articlePublishedTime} />}
          {articleModifiedTime && <meta property="article:modified_time" content={articleModifiedTime} />}
          {articleSection && <meta property="article:section" content={articleSection} />}
          {articleTags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullOgImage} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}

      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Julieta Arena" />

      {/* Alternate Language Versions */}
      {alternateHreflang.map((alt, index) => (
        <link key={index} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}

      {/* Structured Data */}
      {structuredDataScript && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredDataScript }}
        />
      )}

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//wa.me" />
    </Head>
  )
}
