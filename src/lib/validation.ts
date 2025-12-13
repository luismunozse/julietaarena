/**
 * Schemas de validación usando Zod
 * Valida datos en runtime antes de procesarlos
 */

import { z } from 'zod'
import type { Property } from '@/data/properties'
import type { SupabaseProperty } from '@/types/supabase'

// Schema para validar propiedades desde Supabase
export const supabasePropertySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  currency: z.enum(['ARS', 'USD']),
  location: z.string().min(1),
  type: z.enum(['casa', 'departamento', 'terreno', 'local', 'oficina', 'cochera']),
  bedrooms: z.number().int().positive().nullable(),
  bathrooms: z.number().int().positive().nullable(),
  area: z.number().positive(),
  covered_area: z.number().positive().nullable(),
  images: z.array(z.string()).nullable(), // Puede ser URL o path de Supabase Storage
  features: z.array(z.string()).nullable(),
  status: z.enum(['disponible', 'reservado', 'vendido']),
  featured: z.boolean(),
  year_built: z.number().int().positive().nullable(),
  parking: z.number().int().nonnegative().nullable(),
  floor: z.number().int().nullable(),
  total_floors: z.number().int().positive().nullable(),
  orientation: z.string().nullable(),
  expenses: z.number().nonnegative().nullable(),
  operation: z.enum(['venta', 'alquiler']),
  broker_name: z.string().nullable(),
  broker_phone: z.string().nullable(),
  broker_email: z.string().email().nullable(),
  broker_avatar: z.string().url().nullable(),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  created_at: z.string().datetime({ offset: true }).nullable(),
  updated_at: z.string().datetime({ offset: true }).nullable(),
  created_by: z.string().uuid().nullable(),
  updated_by: z.string().uuid().nullable(),
})

// Schema para validar Property local
export const propertySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  currency: z.enum(['ARS', 'USD']),
  location: z.string().min(1),
  type: z.enum(['casa', 'departamento', 'terreno', 'local', 'oficina', 'cochera']),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  area: z.number().positive(),
  coveredArea: z.number().positive().optional(),
  images: z.array(z.string()),
  features: z.array(z.string()),
  status: z.enum(['disponible', 'reservado', 'vendido']),
  featured: z.boolean(),
  yearBuilt: z.number().int().positive().optional(),
  parking: z.number().int().nonnegative().optional(),
  floor: z.number().int().optional(),
  totalFloors: z.number().int().positive().optional(),
  orientation: z.string().optional(),
  expenses: z.number().nonnegative().optional(),
  operation: z.enum(['venta', 'alquiler']),
  broker: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
    avatar: z.string().url().optional(),
  }).optional(),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
  createdAt: z.string().datetime({ offset: true }).optional(),
  updatedAt: z.string().datetime({ offset: true }).optional(),
}) satisfies z.ZodType<Property>

// Schema para validar datos de login
export const loginCredentialsSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

// Schema para validar datos de registro
export const registerDataSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  phone: z.string().optional(),
})

// Schema para validar formulario de contacto
export const contactFormSchema = z.object({
  from_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  from_email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

// Type guards
export function isValidSupabaseProperty(data: unknown): data is SupabaseProperty {
  return supabasePropertySchema.safeParse(data).success
}

export function isValidProperty(data: unknown): data is Property {
  return propertySchema.safeParse(data).success
}

// Función helper para validar y parsear datos
export function validateAndParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage = 'Datos inválidos'
): { success: true; data: T } | { success: false; error: string; details?: z.ZodError } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  return {
    success: false,
    error: errorMessage,
    details: result.error,
  }
}

