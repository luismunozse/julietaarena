import { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blogPosts'
import { createClient } from '@supabase/supabase-js'

async function getPropertyIds(): Promise<{ id: string; updated_at: string }[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) return []

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data } = await supabase
      .from('properties')
      .select('id, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })

    return data || []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://julietaarena.com.ar'
  const currentDate = new Date()

  // Páginas principales
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/asesoramiento-legal`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/remates-judiciales`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vender`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Blog posts dinámicos
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Propiedades dinámicas desde Supabase
  const properties = await getPropertyIds()
  const propertyPages: MetadataRoute.Sitemap = properties.map((prop) => ({
    url: `${baseUrl}/propiedades/${prop.id}`,
    lastModified: new Date(prop.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...mainPages, ...propertyPages, ...blogPages]
}
