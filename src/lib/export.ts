import type { Property } from '@/data/properties'
import Papa from 'papaparse'

export function exportToCSV(properties: Property[], filename = 'propiedades') {
  const data = properties.map(prop => ({
    ID: prop.id,
    Título: prop.title,
    Descripción: prop.description.substring(0, 100) + '...',
    Precio: prop.price,
    Moneda: prop.currency,
    Ubicación: prop.location,
    Tipo: prop.type,
    Operación: prop.operation,
    Estado: prop.status,
    Destacada: prop.featured ? 'Sí' : 'No',
    Dormitorios: prop.bedrooms || '',
    Baños: prop.bathrooms || '',
    Área: prop.area,
    Área_Cubierta: prop.coveredArea || '',
    Estacionamiento: prop.parking || '',
    Año_Construcción: prop.yearBuilt || '',
    Piso: prop.floor || '',
    Total_Pisos: prop.totalFloors || '',
    Orientación: prop.orientation || '',
    Expensas: prop.expenses || '',
    Imágenes: prop.images.join('; '),
    Características: prop.features.join(', '),
    Latitud: prop.coordinates?.lat || '',
    Longitud: prop.coordinates?.lng || '',
    Fecha_Creación: prop.createdAt || '',
    Fecha_Actualización: prop.updatedAt || '',
  }))

  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJSON(properties: Property[], filename = 'propiedades') {
  const data = JSON.stringify(properties, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

