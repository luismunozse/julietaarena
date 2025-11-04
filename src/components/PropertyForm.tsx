'use client'

import { useState } from 'react'
import type { Property } from '@/data/properties'
import styles from './PropertyForm.module.css'

interface PropertyFormProps {
  onSubmit: (data: Partial<Property>) => void
  isSubmitting: boolean
  initialData?: Partial<Property>
}

export default function PropertyForm({ onSubmit, isSubmitting, initialData }: PropertyFormProps) {
  const [formData, setFormData] = useState<Partial<Property>>(initialData || {
    title: '',
    description: '',
    price: 0,
    location: '',
    type: 'casa',
    operation: 'venta',
    status: 'disponible',
    featured: false,
    images: [],
    features: [],
    area: 0,
    bedrooms: undefined,
    bathrooms: undefined,
    parking: undefined,
    yearBuilt: undefined,
    coveredArea: undefined,
    floor: undefined,
    totalFloors: undefined,
    orientation: '',
    expenses: undefined
  })

  const [newImage, setNewImage] = useState('')
  const [newFeature, setNewFeature] = useState('')

  const handleChange = (field: keyof Property, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddImage = () => {
    if (newImage.trim()) {
      handleChange('images', [...(formData.images || []), newImage.trim()])
      setNewImage('')
    }
  }

  const handleRemoveImage = (index: number) => {
    const updated = formData.images?.filter((_, i) => i !== index) || []
    handleChange('images', updated)
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      handleChange('features', [...(formData.features || []), newFeature.trim()])
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    const updated = formData.features?.filter((_, i) => i !== index) || []
    handleChange('features', updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Información básica */}
      <div className={styles.section}>
        <h2>Información Básica</h2>
        
        <div className={styles.field}>
          <label>Título *</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            placeholder="Ej: Casa en Villa Allende"
          />
        </div>

        <div className={styles.field}>
          <label>Descripción *</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            required
            rows={5}
            placeholder="Describe la propiedad en detalle..."
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Tipo *</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              required
            >
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
              <option value="local">Local</option>
              <option value="oficina">Oficina</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Operación *</label>
            <select
              value={formData.operation}
              onChange={(e) => handleChange('operation', e.target.value)}
              required
            >
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Estado *</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              required
            >
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label>Ubicación *</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            required
            placeholder="Ej: Villa Allende, Córdoba"
          />
        </div>

        <div className={styles.field}>
          <label>Precio *</label>
          <input
            type="number"
            value={formData.price || ''}
            onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
            required
            min="0"
            placeholder="85000000"
          />
        </div>
      </div>

      {/* Características */}
      <div className={styles.section}>
        <h2>Características</h2>
        
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Área Total (m²) *</label>
            <input
              type="number"
              value={formData.area || ''}
              onChange={(e) => handleChange('area', parseFloat(e.target.value) || 0)}
              required
              min="0"
            />
          </div>

          <div className={styles.field}>
            <label>Área Cubierta (m²)</label>
            <input
              type="number"
              value={formData.coveredArea || ''}
              onChange={(e) => handleChange('coveredArea', parseFloat(e.target.value) || undefined)}
              min="0"
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Dormitorios</label>
            <input
              type="number"
              value={formData.bedrooms || ''}
              onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || undefined)}
              min="0"
            />
          </div>

          <div className={styles.field}>
            <label>Baños</label>
            <input
              type="number"
              value={formData.bathrooms || ''}
              onChange={(e) => handleChange('bathrooms', parseInt(e.target.value) || undefined)}
              min="0"
            />
          </div>

          <div className={styles.field}>
            <label>Cocheras</label>
            <input
              type="number"
              value={formData.parking || ''}
              onChange={(e) => handleChange('parking', parseInt(e.target.value) || undefined)}
              min="0"
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Año de Construcción</label>
            <input
              type="number"
              value={formData.yearBuilt || ''}
              onChange={(e) => handleChange('yearBuilt', parseInt(e.target.value) || undefined)}
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          <div className={styles.field}>
            <label>Piso</label>
            <input
              type="number"
              value={formData.floor || ''}
              onChange={(e) => handleChange('floor', parseInt(e.target.value) || undefined)}
              min="0"
            />
          </div>

          <div className={styles.field}>
            <label>Total Pisos</label>
            <input
              type="number"
              value={formData.totalFloors || ''}
              onChange={(e) => handleChange('totalFloors', parseInt(e.target.value) || undefined)}
              min="0"
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Orientación</label>
            <select
              value={formData.orientation || ''}
              onChange={(e) => handleChange('orientation', e.target.value)}
            >
              <option value="">Seleccionar...</option>
              <option value="Norte">Norte</option>
              <option value="Sur">Sur</option>
              <option value="Este">Este</option>
              <option value="Oeste">Oeste</option>
              <option value="Noreste">Noreste</option>
              <option value="Noroeste">Noroeste</option>
              <option value="Sureste">Sureste</option>
              <option value="Suroeste">Suroeste</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Expensas ($)</label>
            <input
              type="number"
              value={formData.expenses || ''}
              onChange={(e) => handleChange('expenses', parseFloat(e.target.value) || undefined)}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Imágenes */}
      <div className={styles.section}>
        <h2>Imágenes</h2>
        
        <div className={styles.field}>
          <label>Agregar URL de imagen</label>
          <div className={styles.addInput}>
            <input
              type="url"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddImage()
                }
              }}
            />
            <button type="button" onClick={handleAddImage} className={styles.addButton}>
              ➕ Agregar
            </button>
          </div>
        </div>

        {formData.images && formData.images.length > 0 && (
          <div className={styles.imagesGrid}>
            {formData.images.map((image, index) => (
              <div key={index} className={styles.imagePreview}>
                <img src={image} alt={`Imagen ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className={styles.removeButton}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Características adicionales */}
      <div className={styles.section}>
        <h2>Características Adicionales</h2>
        
        <div className={styles.field}>
          <label>Agregar característica</label>
          <div className={styles.addInput}>
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Ej: Jardín amplio, Parrilla, etc."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddFeature()
                }
              }}
            />
            <button type="button" onClick={handleAddFeature} className={styles.addButton}>
              ➕ Agregar
            </button>
          </div>
        </div>

        {formData.features && formData.features.length > 0 && (
          <div className={styles.featuresList}>
            {formData.features.map((feature, index) => (
              <div key={index} className={styles.featureItem}>
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className={styles.removeButton}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Opciones */}
      <div className={styles.section}>
        <h2>Opciones</h2>
        
        <div className={styles.checkboxField}>
          <label>
            <input
              type="checkbox"
              checked={formData.featured || false}
              onChange={(e) => handleChange('featured', e.target.checked)}
            />
            Propiedad destacada (aparecerá en la portada)
          </label>
        </div>
      </div>

      {/* Botones */}
      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? '⏳ Guardando...' : '💾 Guardar Propiedad'}
        </button>
      </div>
    </form>
  )
}

