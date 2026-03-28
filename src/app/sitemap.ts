import { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blogPosts'
import { getPropertiesServer } from '@/lib/supabaseQueries'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://julietaarena.com.ar'
  const currentDate = new Date()

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

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const properties = await getPropertiesServer()
  const propertyPages: MetadataRoute.Sitemap = properties.map((prop) => ({
    url: `${baseUrl}/propiedades/${prop.id}`,
    lastModified: prop.updated_at ? new Date(prop.updated_at) : currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...mainPages, ...propertyPages, ...blogPages]
}
