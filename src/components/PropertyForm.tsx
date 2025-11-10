'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Property } from '@/data/properties'
import ImageUpload from './ImageUpload'
import LocationInput from './LocationInput'
import styles from './PropertyForm.module.css'

interface PropertyFormProps {
  onSubmit: (data: Partial<Property>) => void
  isSubmitting: boolean
  initialData?: Partial<Property>
}

const DRAFT_STORAGE_KEY = 'property-form-draft'

export default function PropertyForm({ onSubmit, isSubmitting, initialData }: PropertyFormProps) {
  const [formData, setFormData] = useState<Partial<Property>>(initialData || {
    title: '',
    description: '',
    price: 0,
    currency: 'USD',
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

  const [newFeature, setNewFeature] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasDraft, setHasDraft] = useState(false)

  // Cargar draft desde localStorage al montar el componente
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY)

    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)

        // Solo cargar si no hay initialData (modo creación, no edición)
        if (!initialData || Object.keys(initialData).length === 0) {
          setFormData(draft)
          setHasDraft(true)
        }
      } catch (error) {
        console.error('❌ Error cargando borrador:', error)
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo al montar

  // Sincronizar con initialData cuando cambia (modo edición)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData)
    }
  }, [initialData])

  // Función para guardar el borrador
  const saveDraft = useCallback(() => {
    // No guardar si es modo edición (tiene ID) o si está enviando
    if (formData.id || isSubmitting) {
      return
    }

    // No guardar si el formulario está vacío
    const isFormEmpty = !formData.title && !formData.description && !formData.price && !formData.location
    if (isFormEmpty) {
      return
    }

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData))
  }, [formData, isSubmitting])

  // Guardar automáticamente en localStorage con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveDraft()
    }, 300) // Guardar 300ms después del último cambio (más rápido)

    return () => clearTimeout(timeoutId)
  }, [saveDraft])

  // Guardar cuando el usuario cambia de pestaña o cierra la ventana
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Usuario cambió de pestaña, guardar inmediatamente
        saveDraft()
      }
    }

    const handleBeforeUnload = () => {
      // Usuario está cerrando o refrescando la página, guardar inmediatamente
      saveDraft()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [saveDraft])

  // Función para limpiar el borrador
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
    setHasDraft(false)
  }, [])

  // Exportar clearDraft para que la página padre pueda llamarlo después de envío exitoso
  useEffect(() => {
    if ((window as any).__clearPropertyDraft !== clearDraft) {
      (window as any).__clearPropertyDraft = clearDraft
    }
  }, [clearDraft])

  const handleChange = (field: keyof Property, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Si se cambia el tipo de propiedad, limpiar campos no relevantes
      if (field === 'type') {
        const isCochera = value === 'cochera'
        const isTerreno = value === 'terreno'
        const isLocal = value === 'local'
        const isOficina = value === 'oficina'

        if (isCochera) {
          // Limpiar campos no relevantes para cocheras
          updated.bedrooms = undefined
          updated.bathrooms = undefined
          updated.parking = undefined // Una cochera no tiene "cocheras"
          updated.totalFloors = undefined
          updated.orientation = ''
        } else if (isTerreno) {
          // Limpiar campos no relevantes para terrenos
          updated.bedrooms = undefined
          updated.bathrooms = undefined
          updated.parking = undefined
          updated.yearBuilt = undefined
          updated.floor = undefined
          updated.totalFloors = undefined
          updated.orientation = ''
          updated.expenses = undefined
          updated.coveredArea = undefined
        } else if (isLocal || isOficina) {
          // Limpiar campos no relevantes para locales comerciales y oficinas
          updated.bedrooms = undefined
          updated.bathrooms = undefined
          updated.orientation = ''
        }
      }
      
      return updated
    })
    
    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleImagesChange = (images: string[]) => {
    handleChange('images', images)
  }

  // Determinar si un campo es relevante según el tipo de propiedad
  const isFieldRelevant = (fieldName: string): boolean => {
    const isCochera = formData.type === 'cochera'
    const isTerreno = formData.type === 'terreno'
    const isLocal = formData.type === 'local'
    const isOficina = formData.type === 'oficina'

    // Campos siempre relevantes
    const alwaysRelevant = ['title', 'description', 'price', 'location', 'type', 'operation', 'status', 'images', 'features']
    if (alwaysRelevant.includes(fieldName)) return true

    // Campos específicos por tipo
    if (isCochera) {
      // Para cocheras: área, año, expensas, piso (nivel de cochera)
      // NO incluir: bedrooms, bathrooms, parking (una cochera no tiene cocheras), totalFloors, orientation
      const cocheraRelevant = ['area', 'coveredArea', 'yearBuilt', 'expenses', 'floor']
      return cocheraRelevant.includes(fieldName)
    }

    if (isTerreno) {
      // Para terrenos: solo área
      const terrenoRelevant = ['area']
      return terrenoRelevant.includes(fieldName)
    }

    if (isLocal || isOficina) {
      // Para locales comerciales y oficinas: área, año, expensas, piso, cocheras
      // NO incluir: bedrooms, bathrooms, orientation
      const comercialRelevant = ['area', 'coveredArea', 'yearBuilt', 'expenses', 'floor', 'totalFloors', 'parking']
      return comercialRelevant.includes(fieldName)
    }

    // Para otros tipos (casa, departamento): todos los campos
    return true
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

    const newErrors: Record<string, string> = {}

    // Validar
    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = 'El título debe tener al menos 5 caracteres'
    }
    if (!formData.description || formData.description.trim().length < 20) {
      newErrors.description = 'La descripción debe tener al menos 20 caracteres'
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0'
    }
    if (!formData.location || formData.location.trim().length < 3) {
      newErrors.location = 'La ubicación es requerida'
    }
    if (!formData.area || formData.area <= 0) {
      newErrors.area = 'El área debe ser mayor a 0'
    }
    if (!formData.images || formData.images.length === 0) {
      newErrors.images = 'Debes agregar al menos una imagen'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      console.warn('⚠️ Errores de validación encontrados:', newErrors)
      // Scroll al primer error después de un pequeño delay para que se rendericen los errores
      setTimeout(() => {
        const firstErrorField = Object.keys(newErrors)[0]
        if (firstErrorField) {
          const element = document.querySelector(`[data-field="${firstErrorField}"]`)
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Información básica */}
      <div className={styles.section}>
        <h2>Información Básica</h2>
        
        <div className={styles.field} data-field="title">
          <label>Título *</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            placeholder={
              formData.type === 'cochera' 
                ? 'Ej: Cochera en Nueva Córdoba' 
                : formData.type === 'terreno'
                ? 'Ej: Terreno en Villa Allende'
                : 'Ej: Casa en Villa Allende'
            }
            className={errors.title ? styles.errorInput : ''}
          />
          {errors.title && <span className={styles.errorMessage}>{errors.title}</span>}
        </div>

        <div className={styles.field} data-field="description">
          <label>Descripción *</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            required
            rows={5}
            placeholder={
              formData.type === 'cochera'
                ? 'Describe la cochera: ubicación, accesos, medidas, características especiales...'
                : formData.type === 'terreno'
                ? 'Describe el terreno: ubicación, medidas, servicios disponibles, características...'
                : 'Describe la propiedad en detalle...'
            }
            className={errors.description ? styles.errorInput : ''}
          />
          <small className={styles.charCount}>
            {formData.description?.length || 0} caracteres (mínimo 20)
          </small>
          {errors.description && <span className={styles.errorMessage}>{errors.description}</span>}
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
              <option value="cochera">Cochera</option>
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

        <div className={styles.field} data-field="location">
          <label>Ubicación * <span className={styles.labelHint}>(con autocompletado de Google Maps)</span></label>
          <LocationInput
            value={formData.location || ''}
            onChange={(location, coordinates) => {
              handleChange('location', location)
              if (coordinates) {
                handleChange('coordinates', coordinates)
              }
            }}
            placeholder={
              formData.type === 'cochera'
                ? 'Ej: Nueva Córdoba, Córdoba Capital'
                : 'Ej: Villa Allende, Córdoba'
            }
            error={errors.location}
          />
        </div>

        <div className={styles.field} data-field="price">
          <label>Precio *</label>
          <div className={styles.priceRow}>
            <div className={styles.currencySelect}>
              <select
                value={formData.currency || 'USD'}
                onChange={(e) => handleChange('currency', e.target.value as 'ARS' | 'USD')}
              >
                <option value="USD">USD (Dólares)</option>
                <option value="ARS">ARS (Pesos)</option>
              </select>
            </div>
            <div className={styles.priceInput}>
              <span className={styles.currencyBadge}>{formData.currency === 'USD' ? 'US$' : '$'}</span>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                required
                min="0"
                placeholder={formData.currency === 'USD' ? '450000' : '85000000'}
                className={errors.price ? styles.errorInput : ''}
              />
            </div>
          </div>
          {(formData.price ?? 0) > 0 && (
            <small className={styles.priceFormatted}>
              {new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: formData.currency || 'USD',
                minimumFractionDigits: 0
              }).format(formData.price ?? 0)}
            </small>
          )}
          {errors.price && <span className={styles.errorMessage}>{errors.price}</span>}
        </div>
      </div>

      {/* Características */}
      <div className={styles.section}>
        <h2>Características{formData.type === 'cochera' ? ' de la Cochera' : ''}</h2>
        
        <div className={styles.row}>
          <div className={styles.field} data-field="area">
            <label>Área Total (m²) *</label>
            <input
              type="number"
              value={formData.area || ''}
              onChange={(e) => handleChange('area', parseFloat(e.target.value) || 0)}
              required
              min="0"
              step="0.01"
              className={errors.area ? styles.errorInput : ''}
            />
            {errors.area && <span className={styles.errorMessage}>{errors.area}</span>}
          </div>

          {isFieldRelevant('coveredArea') && (
            <div className={styles.field}>
              <label>Área Cubierta (m²)</label>
              <input
                type="number"
                value={formData.coveredArea || ''}
                onChange={(e) => handleChange('coveredArea', parseFloat(e.target.value) || undefined)}
                min="0"
                step="0.01"
              />
            </div>
          )}
        </div>

        {isFieldRelevant('bedrooms') || isFieldRelevant('bathrooms') || isFieldRelevant('parking') ? (
          <div className={styles.row}>
            {isFieldRelevant('bedrooms') && (
              <div className={styles.field}>
                <label>Dormitorios</label>
                <input
                  type="number"
                  value={formData.bedrooms || ''}
                  onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || undefined)}
                  min="0"
                />
              </div>
            )}

            {isFieldRelevant('bathrooms') && (
              <div className={styles.field}>
                <label>Baños</label>
                <input
                  type="number"
                  value={formData.bathrooms || ''}
                  onChange={(e) => handleChange('bathrooms', parseInt(e.target.value) || undefined)}
                  min="0"
                />
              </div>
            )}

            {isFieldRelevant('parking') && (
              <div className={styles.field}>
                <label>{formData.type === 'cochera' ? 'Cantidad de Cocheras' : 'Cocheras'}</label>
                <input
                  type="number"
                  value={formData.parking || ''}
                  onChange={(e) => handleChange('parking', parseInt(e.target.value) || undefined)}
                  min="0"
                />
              </div>
            )}
          </div>
        ) : null}

        {(isFieldRelevant('yearBuilt') || isFieldRelevant('floor') || isFieldRelevant('totalFloors')) && (
          <div className={styles.row}>
            {isFieldRelevant('yearBuilt') && (
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
            )}

            {isFieldRelevant('floor') && (
              <div className={styles.field}>
                <label>{formData.type === 'cochera' ? 'Nivel' : 'Piso'}</label>
                <input
                  type="number"
                  value={formData.floor !== undefined ? formData.floor : ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : parseInt(e.target.value)
                    handleChange('floor', value)
                  }}
                  min={formData.type === 'cochera' ? '-1' : '0'}
                  max="200"
                  placeholder={formData.type === 'cochera' ? 'Ej: Subterránea = -1, Planta baja = 0' : 'Ej: 5'}
                />
                {formData.type === 'cochera' && (
                  <small className={styles.fieldHint}>
                    -1 = Subterránea, 0 = Planta baja, 1+ = Pisos superiores
                  </small>
                )}
              </div>
            )}

            {isFieldRelevant('totalFloors') && (
              <div className={styles.field}>
                <label>Total Pisos</label>
                <input
                  type="number"
                  value={formData.totalFloors || ''}
                  onChange={(e) => handleChange('totalFloors', parseInt(e.target.value) || undefined)}
                  min="0"
                />
              </div>
            )}
          </div>
        )}

        {(isFieldRelevant('orientation') || isFieldRelevant('expenses')) && (
          <div className={styles.row}>
            {isFieldRelevant('orientation') && (
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
            )}

            {isFieldRelevant('expenses') && (
              <div className={styles.field}>
                <label>Expensas ($)</label>
                <input
                  type="number"
                  value={formData.expenses || ''}
                  onChange={(e) => handleChange('expenses', parseFloat(e.target.value) || undefined)}
                  min="0"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Imágenes */}
      <div className={styles.section} data-field="images">
        <h2>Imágenes *</h2>
        <p className={styles.sectionDescription}>
          Agrega imágenes de la propiedad. Puedes arrastrar y soltar o hacer clic para seleccionar.
        </p>
        
        <ImageUpload
          images={formData.images || []}
          onImagesChange={handleImagesChange}
          propertyId={formData.id}
          maxImages={20}
          maxSizeMB={5}
        />
        
        {errors.images && (
          <span className={styles.errorMessage}>{errors.images}</span>
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

      {/* Indicador de borrador */}
      {hasDraft && (
        <div className={styles.draftNotice}>
          <div className={styles.draftInfo}>
            <span>📝 Borrador guardado automáticamente</span>
            <button
              type="button"
              onClick={() => {
                if (confirm('¿Deseas limpiar el borrador guardado y empezar de cero?')) {
                  clearDraft()
                  window.location.reload()
                }
              }}
              className={styles.clearDraftButton}
            >
              🗑️ Limpiar borrador
            </button>
          </div>
        </div>
      )}

      {/* Botones */}
      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? '⏳ Guardando...' : '💾 Guardar Propiedad'}
        </button>
      </div>
    </form>
  )
}
