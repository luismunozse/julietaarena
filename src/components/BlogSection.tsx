'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedPosts, getRecentPosts, BlogPost } from '@/data/blogPosts'
import { ArrowRight, Clock } from 'lucide-react'

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
    <article className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col group">
      {/* Image */}
      <div className={`relative ${isLarge ? 'h-48 sm:h-56 md:h-64' : 'h-40 sm:h-48'}`}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-1 bg-brand-primary text-white rounded-full text-[10px] sm:text-xs font-medium">
          {post.category}
        </span>
        <span className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 py-1 bg-black/60 text-white rounded-full text-[10px] sm:text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {post.readTime} min
        </span>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="text-xs sm:text-sm text-muted mb-2">
          <span>{formatDate(post.date)}</span>
          <span className="mx-2">•</span>
          <span>Por {post.author}</span>
        </div>

        <h3 className={`${isLarge ? 'text-base sm:text-lg md:text-xl' : 'text-sm sm:text-base md:text-lg'} font-semibold text-brand-accent mb-2 sm:mb-3 leading-tight line-clamp-2`}>
          <Link href={`/blog/${post.slug}`} className="no-underline text-inherit hover:text-brand-primary transition-colors">
            {post.title}
          </Link>
        </h3>

        <p className="text-xs sm:text-sm text-muted leading-relaxed mb-3 sm:mb-4 flex-1 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-surface text-muted rounded-md text-[10px] sm:text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors no-underline"
        >
          Leer más
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  )

  return (
    <section id="blog" className="py-10 sm:py-16 lg:py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {showHeader && (
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block px-4 py-1.5 bg-brand-secondary/10 text-brand-primary rounded-full text-sm font-medium mb-3 sm:mb-4">
              Blog
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-accent mb-2 sm:mb-4">
              Blog y Noticias
            </h2>
            <p className="text-sm sm:text-base text-muted max-w-xl mx-auto px-2">
              Mantente informado sobre el mercado inmobiliario y consejos profesionales
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8 sm:mb-10">
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${
              activeTab === 'featured'
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-white text-muted hover:bg-brand-primary/10'
            }`}
          >
            <span className="hidden sm:inline">Artículos Destacados</span>
            <span className="sm:hidden">Destacados</span>
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${
              activeTab === 'recent'
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-white text-muted hover:bg-brand-primary/10'
            }`}
          >
            <span className="hidden sm:inline">Más Recientes</span>
            <span className="sm:hidden">Recientes</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'featured' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredPosts.map((post, index) => (
              <div key={post.id}>
                {renderPostCard(post, index === 0)}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recentPosts.map((post) => (
              <div key={post.id}>
                {renderPostCard(post)}
              </div>
            ))}
          </div>
        )}

        {showFooter && (
          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 no-underline"
            >
              Ver Todos los Artículos
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
