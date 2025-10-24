'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './BlogSection.module.css'
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
    <article className={`${styles.postCard} ${isLarge ? styles.postCardLarge : ''}`}>
      <div className={styles.postImage}>
        <Image
          src={post.image}
          alt={post.title}
          width={isLarge ? 400 : 300}
          height={isLarge ? 250 : 200}
          className={styles.image}
        />
        <div className={styles.postCategory}>
          {post.category}
        </div>
        <div className={styles.readTime}>
          {post.readTime} min lectura
        </div>
      </div>
      
      <div className={styles.postContent}>
        <div className={styles.postMeta}>
          <span className={styles.postDate}>{formatDate(post.date)}</span>
          <span className={styles.postAuthor}>Por {post.author}</span>
        </div>
        
        <h3 className={styles.postTitle}>
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        
        <p className={styles.postExcerpt}>{post.excerpt}</p>
        
        <div className={styles.postTags}>
          {post.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
        
        <Link href={`/blog/${post.slug}`} className={styles.readMore}>
          Leer más →
        </Link>
      </div>
    </article>
  )

  return (
    <section className={`section ${styles.blogSection}`} id="blog">
      <div className="container">
        {showHeader && (
          <div className="section-header">
            <h2 className="section-title">Blog y Noticias</h2>
            <p className="section-subtitle">
              Mantente informado sobre el mercado inmobiliario y consejos profesionales
            </p>
          </div>
        )}

        <div className={styles.blogTabs}>
          <button
            className={`${styles.tabButton} ${activeTab === 'featured' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('featured')}
          >
            Artículos Destacados
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'recent' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('recent')}
          >
            Más Recientes
          </button>
        </div>

        <div className={styles.blogContent}>
          {activeTab === 'featured' ? (
            <div className={styles.featuredPosts}>
              {featuredPosts.length > 0 && (
                <div className={styles.heroPost}>
                  {renderPostCard(featuredPosts[0], true)}
                </div>
              )}
              
              <div className={styles.featuredGrid}>
                {featuredPosts.slice(1).map((post) => (
                  <div key={post.id} className={styles.featuredItem}>
                    {renderPostCard(post)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.recentPosts}>
              <div className={styles.recentGrid}>
                {recentPosts.map((post) => (
                  <div key={post.id} className={styles.recentItem}>
                    {renderPostCard(post)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showFooter && (
          <div className={styles.blogFooter}>
            <Link href="/blog" className="btn btn-primary">
              Ver Todos los Artículos
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
