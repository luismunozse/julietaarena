'use client'

import { useState } from 'react'
import ImageUpload from './ImageUpload'
import styles from './PropertyManager.module.css'
import { Property } from '@/data/properties'

interface PropertyManagerProps {
  property?: Property
  onSave: (property: Omit<Property, 'id'>) => void
  onCancel: () => void
}

export default function PropertyManager({ property, onSave, onCancel }: PropertyManagerProps) {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price || 0,
    location: property?.location || '',
    type: property?.type || 'casa',
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    area: property?.area || 0,
    features: property?.features.join(', ') || '',
    status: property?.status || 'disponible',
    featured: property?.featured || false,
    yearBuilt: property?.yearBuilt || 0,
    parking: property?.parking || 0,
    floor: property?.floor || 0,
    totalFloors: property?.totalFloors || 0,
    orientation: property?.orientation || '',
    expenses: property?.expenses || 0,
    operation: property?.operation || 'venta'
  })

  const [images, setImages] = useState<string[]>(property?.images || [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              value
    }))
  }

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      features: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const propertyData: Omit<Property, 'id'> = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f.length > 0),
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&crop=center']
    }
    
    onSave(propertyData)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className={styles.propertyManager}>
      <div className={styles.managerHeader}>
        <h2>{property ? 'Editar Propiedad' : 'Nueva Propiedad'}</h2>
        <button className={styles.closeButton} onClick={onCancel}>
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.propertyForm}>
        <div className={styles.formSection}>
          <h3>Información Básica</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Título de la Propiedad</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="type">Tipo de Propiedad</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="terreno">Terreno</option>
                <option value="local">Local Comercial</option>
                <option value="oficina">Oficina</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="operation">Operación</label>
              <select
                id="operation"
                name="operation"
                value={formData.operation}
                onChange={handleInputChange}
                required
              >
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="status">Estado</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Ubicación y Precio</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="location">Ubicación</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ej: Nueva Córdoba, Córdoba Capital"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price">Precio</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                required
              />
              <span className={styles.currencyHelper}>
                {formatCurrency(formData.price)}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Características</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="area">Área (m²)</label>
              <input
                type="number"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="bedrooms">Dormitorios</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="bathrooms">Baños</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="parking">Cocheras</label>
              <input
                type="number"
                id="parking"
                name="parking"
                value={formData.parking}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="yearBuilt">Año de Construcción</label>
              <input
                type="number"
                id="yearBuilt"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleInputChange}
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="floor">Piso</label>
              <input
                type="number"
                id="floor"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="totalFloors">Total de Pisos</label>
              <input
                type="number"
                id="totalFloors"
                name="totalFloors"
                value={formData.totalFloors}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="expenses">Expensas</label>
              <input
                type="number"
                id="expenses"
                name="expenses"
                value={formData.expenses}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="features">Características (separadas por comas)</label>
            <textarea
              id="features"
              name="features"
              value={formData.features}
              onChange={handleFeaturesChange}
              rows={3}
              placeholder="Ej: Jardín amplio, Garaje cubierto, Parrilla, Closets empotrados"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Imágenes de la Propiedad</h3>
          <ImageUpload
            onImagesChange={setImages}
            initialImages={images}
            maxImages={10}
          />
        </div>

        <div className={styles.formSection}>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              <span className={styles.checkboxText}>Propiedad destacada</span>
            </label>
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {property ? 'Actualizar Propiedad' : 'Crear Propiedad'}
          </button>
        </div>
      </form>
    </div>
  )
}
