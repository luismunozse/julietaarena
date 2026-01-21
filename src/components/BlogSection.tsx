'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedPosts, getRecentPosts, BlogPost } from '@/data/blogPosts'

interface BlogSectionProps {
  showHeader?: boolean
  showFooter?: boolean
}

export default function BlogSection({ showHeader = true, showFooter = true }: BlogSectionProps) {
  const [activeTab, setActiveTab] = useState<'featured' | 'recent'>('featured')
  const featuredPosts = getFeaturedPosts()
  const recentPosts = getRecentPosts()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderPostCard = (post: BlogPost, isLarge: boolean = false) => (
    <article
      style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      className="blog-card"
    >
      {/* Image */}
      <div style={{ position: 'relative', height: isLarge ? '250px' : '200px' }}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          style={{ objectFit: 'cover' }}
        />
        <span
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            padding: '4px 12px',
            background: '#2c5f7d',
            color: 'white',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {post.category}
        </span>
        <span
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '4px 10px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            borderRadius: '20px',
            fontSize: '11px'
          }}
        >
          {post.readTime} min lectura
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '13px', color: '#636e72', marginBottom: '8px' }}>
          <span>{formatDate(post.date)}</span>
          <span style={{ margin: '0 8px' }}>•</span>
          <span>Por {post.author}</span>
        </div>

        <h3 style={{ fontSize: isLarge ? '1.25rem' : '1.1rem', fontWeight: '600', color: '#1a4158', marginBottom: '12px', lineHeight: '1.4' }}>
          <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {post.title}
          </Link>
        </h3>

        <p style={{ color: '#636e72', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '16px', flex: 1 }}>
          {post.excerpt}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              style={{
                padding: '4px 10px',
                background: '#f3f4f6',
                color: '#636e72',
                borderRadius: '12px',
                fontSize: '12px'
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <Link
          href={`/blog/${post.slug}`}
          style={{
            color: '#2c5f7d',
            fontWeight: '500',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          Leer más →
        </Link>
      </div>
    </article>
  )

  return (
    <>
      <section id="blog" style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {showHeader && (
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '700', color: '#1a4158', marginBottom: '16px' }}>
                Blog y Noticias
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#636e72', maxWidth: '600px', margin: '0 auto' }}>
                Mantente informado sobre el mercado inmobiliario y consejos profesionales
              </p>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
            <button
              onClick={() => setActiveTab('featured')}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeTab === 'featured' ? '#2c5f7d' : 'white',
                color: activeTab === 'featured' ? 'white' : '#636e72'
              }}
            >
              Artículos Destacados
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeTab === 'recent' ? '#2c5f7d' : 'white',
                color: activeTab === 'recent' ? 'white' : '#636e72'
              }}
            >
              Más Recientes
            </button>
          </div>

          {/* Content */}
          {activeTab === 'featured' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {featuredPosts.map((post) => (
                <div key={post.id}>
                  {renderPostCard(post, featuredPosts.indexOf(post) === 0)}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {recentPosts.map((post) => (
                <div key={post.id}>
                  {renderPostCard(post)}
                </div>
              ))}
            </div>
          )}

          {showFooter && (
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link
                href="/blog"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #2c5f7d 0%, #1a4158 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  transition: 'transform 0.2s ease'
                }}
              >
                Ver Todos los Artículos
              </Link>
            </div>
          )}
        </div>
      </section>
      <style jsx>{`
        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }
      `}</style>
    </>
  )
}
