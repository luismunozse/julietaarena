'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ToastContainer'
import type { BlogPost } from '@/data/blogPosts'
import { blogPosts as fallbackPosts } from '@/data/blogPosts'

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
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

const supabaseToBlogPost = (row: SupabaseBlogPost): BlogPost => ({
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

const blogPostToSupabase = (post: Partial<BlogPost>) => ({
  ...(post.id !== undefined && { id: post.id }),
  ...(post.title !== undefined && { title: post.title }),
  ...(post.excerpt !== undefined && { excerpt: post.excerpt }),
  ...(post.content !== undefined && { content: post.content }),
  ...(post.author !== undefined && { author: post.author }),
  ...(post.date !== undefined && { date: post.date }),
  ...(post.category !== undefined && { category: post.category }),
  ...(post.tags !== undefined && { tags: post.tags }),
  ...(post.image !== undefined && { image: post.image }),
  ...(post.slug !== undefined && { slug: post.slug }),
  ...(post.featured !== undefined && { featured: post.featured }),
  ...(post.readTime !== undefined && { read_time: post.readTime }),
  ...(post.status !== undefined && { status: post.status }),
})

export function useBlogPosts() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useSupabase, setUseSupabase] = useState(true)
  const { user } = useAuth()
  const { success, error: showError } = useToast()

  const loadBlogPosts = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false })

      if (fetchError) throw fetchError

      if (data && data.length > 0) {
        setBlogPosts(data.map((row: SupabaseBlogPost) => supabaseToBlogPost(row)))
        setUseSupabase(true)
      } else {
        // Use fallback if table is empty
        setBlogPosts(fallbackPosts)
        setUseSupabase(false)
      }
    } catch (err) {
      console.warn('Blog: Supabase not available, using fallback data', err)
      setBlogPosts(fallbackPosts)
      setUseSupabase(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBlogPosts()
  }, [loadBlogPosts])

  const createBlogPost = useCallback(async (data: Partial<BlogPost>): Promise<boolean> => {
    try {
      const id = `blog-${Date.now()}`
      const supabaseData = {
        ...blogPostToSupabase(data),
        id,
        created_by: user?.id || null,
        updated_by: user?.id || null,
      }

      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert([supabaseData])

      if (insertError) throw insertError

      success('Articulo creado exitosamente')
      await loadBlogPosts()
      return true
    } catch (err) {
      console.error('Error creating blog post:', err)
      showError('Error al crear el articulo')
      return false
    }
  }, [user, loadBlogPosts, success, showError])

  const updateBlogPost = useCallback(async (id: string, updates: Partial<BlogPost>): Promise<boolean> => {
    try {
      const supabaseData = {
        ...blogPostToSupabase(updates),
        updated_by: user?.id || null,
      }

      const { error: updateError } = await supabase
        .from('blog_posts')
        .update(supabaseData)
        .eq('id', id)

      if (updateError) throw updateError

      success('Articulo actualizado exitosamente')
      await loadBlogPosts()
      return true
    } catch (err) {
      console.error('Error updating blog post:', err)
      showError('Error al actualizar el articulo')
      return false
    }
  }, [user, loadBlogPosts, success, showError])

  const deleteBlogPost = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      success('Articulo eliminado exitosamente')
      await loadBlogPosts()
      return true
    } catch (err) {
      console.error('Error deleting blog post:', err)
      showError('Error al eliminar el articulo')
      return false
    }
  }, [loadBlogPosts, success, showError])

  const getBlogPostById = useCallback((id: string): BlogPost | undefined => {
    return blogPosts.find(p => p.id === id)
  }, [blogPosts])

  return {
    blogPosts,
    isLoading,
    error,
    useSupabase,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getBlogPostById,
    refreshBlogPosts: loadBlogPosts,
  }
}
