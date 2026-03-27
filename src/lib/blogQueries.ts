import { createClient } from '@supabase/supabase-js'
import { blogPosts as fallbackPosts } from '@/data/blogPosts'
import type { BlogPost } from '@/data/blogPosts'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface SupabaseBlogPost {
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
  read_time: number
  status: 'draft' | 'published'
}

const toBlogPost = (row: SupabaseBlogPost): BlogPost => ({
  id: row.id,
  title: row.title,
  excerpt: row.excerpt,
  content: row.content,
  author: row.author,
  date: row.date,
  category: row.category,
  tags: row.tags || [],
  image: row.image,
  slug: row.slug,
  featured: row.featured,
  readTime: row.read_time,
  status: row.status,
})

export async function getAllPublishedPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('date', { ascending: false })

    if (error || !data || data.length === 0) {
      return fallbackPosts.filter(p => p.status === 'published')
    }

    return data.map(toBlogPost)
  } catch {
    return fallbackPosts.filter(p => p.status === 'published')
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data) {
      return fallbackPosts.find(p => p.slug === slug) || null
    }

    return toBlogPost(data)
  } catch {
    return fallbackPosts.find(p => p.slug === slug) || null
  }
}

export async function getFeaturedPublishedPosts(limit = 3): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('date', { ascending: false })
      .limit(limit)

    if (error || !data || data.length === 0) {
      return fallbackPosts.filter(p => p.featured && p.status === 'published').slice(0, limit)
    }

    return data.map(toBlogPost)
  } catch {
    return fallbackPosts.filter(p => p.featured && p.status === 'published').slice(0, limit)
  }
}
