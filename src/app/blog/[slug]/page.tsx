import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPublishedPostBySlug, getAllPublishedPosts } from '@/lib/blogQueries'
import { Clock, ArrowLeft, Tag } from 'lucide-react'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPublishedPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) {
    return { title: 'Post no encontrado - Julieta Arena' }
  }

  return {
    title: `${post.title} - Julieta Arena`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.image, width: 800, height: 400, alt: post.title }],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-dark via-brand-accent to-brand-primary pt-20 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white truncate">{post.title}</span>
          </nav>

          <span className="inline-block px-3 py-1 bg-brand-secondary/20 text-brand-secondary rounded-full text-sm font-medium mb-4">
            {post.category}
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
            <span>Por {post.author}</span>
            <span>{formatDate(post.date)}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} min de lectura
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Featured Image */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Body */}
        <article className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm border border-border">
          <p className="text-lg text-muted leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="prose prose-lg max-w-none text-foreground leading-relaxed">
            <p>{post.content}</p>
          </div>
        </article>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          <Tag className="w-4 h-4 text-muted" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white text-muted rounded-full text-sm border border-border"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Back to blog */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-accent font-medium transition-colors no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Blog
          </Link>
        </div>
      </div>
    </main>
  )
}
