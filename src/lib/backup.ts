/**
 * Utilidades para backup y restore de datos
 */

import { supabase } from './supabaseClient'

export interface BackupData {
  properties: unknown[]
  property_inquiries: unknown[]
  contact_inquiries: unknown[]
  property_templates: unknown[]
  metadata: {
    created_at: string
    version: string
    total_records: number
  }
}

/**
 * Crea un backup completo de todos los datos
 */
export async function createBackup(): Promise<BackupData> {
  try {
    // Obtener todas las propiedades
    const { data: properties } = await supabase
      .from('properties')
      .select('*')

    // Obtener todas las consultas de propiedades
    const { data: propertyInquiries } = await supabase
      .from('property_inquiries')
      .select('*')

    // Obtener todos los contactos
    const { data: contactInquiries } = await supabase
      .from('contact_inquiries')
      .select('*')

    // Obtener todas las plantillas
    const { data: templates } = await supabase
      .from('property_templates')
      .select('*')

    const backup: BackupData = {
      properties: properties || [],
      property_inquiries: propertyInquiries || [],
      contact_inquiries: contactInquiries || [],
      property_templates: templates || [],
      metadata: {
        created_at: new Date().toISOString(),
        version: '1.0.0',
        total_records:
          (properties?.length || 0) +
          (propertyInquiries?.length || 0) +
          (contactInquiries?.length || 0) +
          (templates?.length || 0)
      }
    }

    return backup
  } catch (error) {
    throw error
  }
}

/**
 * Descarga el backup como archivo JSON
 */
export function downloadBackup(backup: BackupData, filename?: string): void {
  const json = JSON.stringify(backup, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Restaura datos desde un backup
 */
export async function restoreBackup(backup: BackupData): Promise<void> {
  try {
    // Restaurar propiedades
    if (backup.properties.length > 0) {
      const { error: propertiesError } = await supabase
        .from('properties')
        .upsert(backup.properties, { onConflict: 'id' })

      if (propertiesError) {
        throw new Error(`Error al restaurar propiedades: ${propertiesError.message}`)
      }
    }

    // Restaurar consultas de propiedades
    if (backup.property_inquiries.length > 0) {
      const { error: inquiriesError } = await supabase
        .from('property_inquiries')
        .upsert(backup.property_inquiries, { onConflict: 'id' })

      if (inquiriesError) {
        throw new Error(`Error al restaurar consultas: ${inquiriesError.message}`)
      }
    }

    // Restaurar contactos
    if (backup.contact_inquiries.length > 0) {
      const { error: contactsError } = await supabase
        .from('contact_inquiries')
        .upsert(backup.contact_inquiries, { onConflict: 'id' })

      if (contactsError) {
        throw new Error(`Error al restaurar contactos: ${contactsError.message}`)
      }
    }

    // Restaurar plantillas
    if (backup.property_templates.length > 0) {
      const { error: templatesError } = await supabase
        .from('property_templates')
        .upsert(backup.property_templates, { onConflict: 'id' })

      if (templatesError) {
        throw new Error(`Error al restaurar plantillas: ${templatesError.message}`)
      }
    }
  } catch (error) {
    throw error
  }
}

/**
 * Carga un archivo de backup
 */
export function loadBackupFile(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const backup = JSON.parse(content) as BackupData
        resolve(backup)
      } catch (error) {
        reject(new Error('Error al parsear el archivo de backup'))
      }
    }
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }
    reader.readAsText(file)
  })
}

