import { supabase } from '@/lib/supabaseClient'

const BUCKET = 'property-images'

interface UploadOptions {
  propertyId?: string
}

export const uploadPropertyImage = async (file: File, options: UploadOptions = {}) => {
  const { propertyId } = options
  const timestamp = Date.now()
  const fileExt = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const keyParts = [propertyId ?? 'general', `${timestamp}-${Math.random().toString(36).slice(2)}.${fileExt}`]
  const path = keyParts.join('/')

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { path, publicUrl: data.publicUrl }
}

export const deletePropertyImage = async (urlOrPath: string) => {
  const path = extractPath(urlOrPath)
  if (!path) return false
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
  return true
}

export const getPublicImageUrl = (urlOrPath: string) => {
  if (urlOrPath.startsWith('http')) return urlOrPath
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(urlOrPath)
  return data.publicUrl
}

const extractPath = (value: string) => {
  if (!value) return null
  if (!value.startsWith('http')) return value
  const marker = `${BUCKET}/`
  const index = value.indexOf(marker)
  if (index === -1) return null
  return value.substring(index + marker.length)
}
