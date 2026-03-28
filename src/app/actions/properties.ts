'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { propertySchema } from '@/lib/validation'
import type { Property } from '@/data/properties'

async function getAuthenticatedSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return { supabase: null, user: null, error: 'Supabase no configurado' }
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll() {},
    },
  })

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase: null, user: null, error: 'No autenticado' }
  }

  return { supabase, user, error: null }
}

type ActionResult = { success: true } | { success: false; error: string }

export async function createPropertyAction(
  propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>
): Promise<ActionResult> {
  const { supabase, user, error } = await getAuthenticatedSupabase()
  if (!supabase || !user) return { success: false, error: error ?? 'No autenticado' }

  // Validate on server
  const id = `prop-${Date.now()}`
  const timestamp = new Date().toISOString()
  const fullProperty = {
    ...propertyData,
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: user.id,
    updatedBy: user.id,
  }

  const validation = propertySchema.safeParse(fullProperty)
  if (!validation.success) {
    const firstIssue = validation.error.issues[0]
    return { success: false, error: firstIssue?.message ?? 'Datos de propiedad inválidos' }
  }

  const { error: insertError } = await supabase
    .from('properties')
    .insert([{
      id,
      title: propertyData.title,
      description: propertyData.description,
      price: propertyData.price,
      currency: propertyData.currency ?? 'USD',
      location: propertyData.location,
      type: propertyData.type,
      bedrooms: propertyData.bedrooms ?? null,
      bathrooms: propertyData.bathrooms ?? null,
      rooms: propertyData.rooms ?? null,
      area: propertyData.area,
      covered_area: propertyData.coveredArea ?? null,
      images: propertyData.images ?? [],
      features: propertyData.features ?? [],
      status: propertyData.status,
      featured: propertyData.featured,
      year_built: propertyData.yearBuilt ?? null,
      parking: propertyData.parking ?? null,
      floor: propertyData.floor ?? null,
      total_floors: propertyData.totalFloors ?? null,
      orientation: propertyData.orientation ?? null,
      disposition: propertyData.disposition ?? null,
      expenses: propertyData.expenses ?? null,
      operation: propertyData.operation,
      condition: propertyData.condition ?? null,
      apt_credit: propertyData.aptCredit ?? null,
      internal_code: propertyData.internalCode ?? null,
      video_url: propertyData.videoUrl ?? null,
      services: propertyData.services ?? null,
      documentation: propertyData.documentation ?? null,
      broker_name: propertyData.broker?.name ?? null,
      broker_phone: propertyData.broker?.phone ?? null,
      broker_email: propertyData.broker?.email ?? null,
      broker_avatar: propertyData.broker?.avatar ?? null,
      latitude: propertyData.coordinates?.lat ?? null,
      longitude: propertyData.coordinates?.lng ?? null,
      created_by: user.id,
      updated_by: user.id,
    }])

  if (insertError) {
    return { success: false, error: insertError.message }
  }

  revalidatePath('/propiedades')
  revalidatePath('/admin/propiedades')
  return { success: true }
}

export async function updatePropertyAction(
  id: string,
  updates: Partial<Property>
): Promise<ActionResult> {
  const { supabase, user, error } = await getAuthenticatedSupabase()
  if (!supabase || !user) return { success: false, error: error ?? 'No autenticado' }

  const supabaseUpdates: Record<string, unknown> = { updated_by: user.id }

  if (updates.title !== undefined) supabaseUpdates.title = updates.title
  if (updates.description !== undefined) supabaseUpdates.description = updates.description
  if (updates.price !== undefined) supabaseUpdates.price = updates.price
  if (updates.currency !== undefined) supabaseUpdates.currency = updates.currency
  if (updates.location !== undefined) supabaseUpdates.location = updates.location
  if (updates.type !== undefined) supabaseUpdates.type = updates.type
  if (updates.bedrooms !== undefined) supabaseUpdates.bedrooms = updates.bedrooms ?? null
  if (updates.bathrooms !== undefined) supabaseUpdates.bathrooms = updates.bathrooms ?? null
  if (updates.rooms !== undefined) supabaseUpdates.rooms = updates.rooms ?? null
  if (updates.area !== undefined) supabaseUpdates.area = updates.area
  if (updates.coveredArea !== undefined) supabaseUpdates.covered_area = updates.coveredArea ?? null
  if (updates.images !== undefined) supabaseUpdates.images = updates.images
  if (updates.features !== undefined) supabaseUpdates.features = updates.features
  if (updates.status !== undefined) supabaseUpdates.status = updates.status
  if (updates.featured !== undefined) supabaseUpdates.featured = updates.featured
  if (updates.yearBuilt !== undefined) supabaseUpdates.year_built = updates.yearBuilt ?? null
  if (updates.parking !== undefined) supabaseUpdates.parking = updates.parking ?? null
  if (updates.floor !== undefined) supabaseUpdates.floor = updates.floor ?? null
  if (updates.totalFloors !== undefined) supabaseUpdates.total_floors = updates.totalFloors ?? null
  if (updates.orientation !== undefined) supabaseUpdates.orientation = updates.orientation ?? null
  if (updates.disposition !== undefined) supabaseUpdates.disposition = updates.disposition ?? null
  if (updates.expenses !== undefined) supabaseUpdates.expenses = updates.expenses ?? null
  if (updates.operation !== undefined) supabaseUpdates.operation = updates.operation
  if (updates.condition !== undefined) supabaseUpdates.condition = updates.condition ?? null
  if (updates.aptCredit !== undefined) supabaseUpdates.apt_credit = updates.aptCredit ?? null
  if (updates.internalCode !== undefined) supabaseUpdates.internal_code = updates.internalCode ?? null
  if (updates.videoUrl !== undefined) supabaseUpdates.video_url = updates.videoUrl ?? null
  if (updates.services !== undefined) supabaseUpdates.services = updates.services ?? null
  if (updates.documentation !== undefined) supabaseUpdates.documentation = updates.documentation ?? null
  if (updates.broker !== undefined) {
    supabaseUpdates.broker_name = updates.broker?.name ?? null
    supabaseUpdates.broker_phone = updates.broker?.phone ?? null
    supabaseUpdates.broker_email = updates.broker?.email ?? null
    supabaseUpdates.broker_avatar = updates.broker?.avatar ?? null
  }
  if (updates.coordinates !== undefined) {
    supabaseUpdates.latitude = updates.coordinates?.lat ?? null
    supabaseUpdates.longitude = updates.coordinates?.lng ?? null
  }

  const { error: updateError } = await supabase
    .from('properties')
    .update(supabaseUpdates)
    .eq('id', id)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  revalidatePath('/propiedades')
  revalidatePath(`/propiedades/${id}`)
  revalidatePath('/admin/propiedades')
  return { success: true }
}

export async function deletePropertyAction(id: string): Promise<ActionResult> {
  const { supabase, user, error } = await getAuthenticatedSupabase()
  if (!supabase || !user) return { success: false, error: error ?? 'No autenticado' }

  const { error: deleteError } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return { success: false, error: deleteError.message }
  }

  revalidatePath('/propiedades')
  revalidatePath('/admin/propiedades')
  return { success: true }
}
