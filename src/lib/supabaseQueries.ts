import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Creates a read-only Supabase client for Server Components.
 * Uses cookies for auth context but does not set any.
 */
async function createServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) return null

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll() {
        // Read-only: server components cannot set cookies
      },
    },
  })
}

/**
 * Fetch all available properties (server-side, for ISR pages).
 */
export async function getPropertiesServer() {
  const supabase = await createServerSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'disponible')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

/**
 * Fetch featured properties (server-side).
 */
export async function getFeaturedPropertiesServer() {
  const supabase = await createServerSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'disponible')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) return []
  return data ?? []
}

/**
 * Fetch a single property by ID (server-side).
 */
export async function getPropertyServer(id: string) {
  const supabase = await createServerSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

/**
 * Fetch all property IDs for static generation (generateStaticParams).
 * Uses a direct client without cookies since this runs at build time.
 */
export async function getAllPropertyIds(): Promise<string[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) return []

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase
      .from('properties')
      .select('id')
      .eq('status', 'disponible')

    if (error) return []
    return (data ?? []).map(p => p.id)
  } catch {
    return []
  }
}
