'use client'

import { useState, useEffect, useCallback, CSSProperties } from 'react'
import type { Property } from '@/data/properties'
import ImageUpload from './ImageUpload'
import LocationInput from './LocationInput'

interface PropertyFormProps {
  onSubmit: (data: Partial<Property>) => void
  isSubmitting: boolean
  initialData?: Partial<Property>
}

const DRAFT_STORAGE_KEY = 'property-form-draft'

// Inline styles
const formStyles: Record<string, CSSProperties> = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  section: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1a4158',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e8b86d',
  },
  sectionDescription: {
    fontSize: '14px',
    color: '#636e72',
    marginBottom: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#1a4158',
  },
  labelHint: {
    fontSize: '12px',
    fontWeight: 400,
    color: '#636e72',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  inputError: {
    padding: '12px 16px',
    border: '2px solid #e74c3c',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical' as const,
    minHeight: '100px',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  select: {
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    background: '#ffffff',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  priceRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'stretch',
  },
  currencySelect: {
    flex: '0 0 auto',
    minWidth: '140px',
  },
  priceInput: {
    flex: 1,
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  currencyBadge: {
    position: 'absolute' as const,
    left: '12px',
    color: '#636e72',
    fontWeight: 500,
    fontSize: '14px',
  },
  priceInputField: {
    paddingLeft: '45px',
  },
  priceFormatted: {
    fontSize: '12px',
    color: '#2c5f7d',
    marginTop: '4px',
  },
  charCount: {
    fontSize: '12px',
    color: '#636e72',
    marginTop: '4px',
  },
  fieldHint: {
    fontSize: '12px',
    color: '#636e72',
    marginTop: '4px',
  },
  errorMessage: {
    fontSize: '12px',
    color: '#e74c3c',
    marginTop: '4px',
  },
  addInput: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  addButton: {
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #2c5f7d 0%, #1a4158 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
  },
  featuresList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '12px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#f8f9fa',
    borderRadius: '20px',
    fontSize: '14px',
    color: '#1a4158',
    border: '1px solid #e5e7eb',
  },
  removeButton: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0',
    lineHeight: 1,
  },
  checkboxField: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#1a4158',
    cursor: 'pointer',
  },
  draftNotice: {
    background: '#fff8e1',
    border: '1px solid #e8b86d',
    borderRadius: '8px',
    padding: '16px',
  },
  draftInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '12px',
  },
  clearDraftButton: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid #e8b86d',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#1a4158',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    paddingTop: '16px',
  },
  submitButton: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #2c5f7d 0%, #1a4158 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
}

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

        // Solo cargar si no hay initialData (modo creacion, no edicion)
        if (!initialData || Object.keys(initialData).length === 0) {
          setFormData(draft)
          setHasDraft(true)
        }
      } catch (error) {
        console.error('Error cargando borrador:', error)
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo al montar

  // Sincronizar con initialData cuando cambia (modo edicion)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData)
    }
  }, [initialData])

  // Funcion para guardar el borrador
  const saveDraft = useCallback(() => {
    // No guardar si es modo edicion (tiene ID) o si esta enviando
    if (formData.id || isSubmitting) {
      return
    }

    // No guardar si el formulario esta vacio
    const isFormEmpty = !formData.title && !formData.description && !formData.price && !formData.location
    if (isFormEmpty) {
      return
    }

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData))
  }, [formData, isSubmitting])

  // Guardar automaticamente en localStorage con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveDraft()
    }, 300) // Guardar 300ms despues del ultimo cambio (mas rapido)

    return () => clearTimeout(timeoutId)
  }, [saveDraft])

  // Guardar cuando el usuario cambia de pestana o cierra la ventana
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Usuario cambio de pestana, guardar inmediatamente
        saveDraft()
      }
    }

    const handleBeforeUnload = () => {
      // Usuario esta cerrando o refrescando la pagina, guardar inmediatamente
      saveDraft()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [saveDraft])

  // Funcion para limpiar el borrador
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
    setHasDraft(false)
  }, [])

  // Exportar clearDraft para que la pagina padre pueda llamarlo despues de envio exitoso
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

  // Determinar si un campo es relevante segun el tipo de propiedad
  const isFieldRelevant = (fieldName: string): boolean => {
    const isCochera = formData.type === 'cochera'
    const isTerreno = formData.type === 'terreno'
    const isLocal = formData.type === 'local'
    const isOficina = formData.type === 'oficina'

    // Campos siempre relevantes
    const alwaysRelevant = ['title', 'description', 'price', 'location', 'type', 'operation', 'status', 'images', 'features']
    if (alwaysRelevant.includes(fieldName)) return true

    // Campos especificos por tipo
    if (isCochera) {
      // Para cocheras: area, ano, expensas, piso (nivel de cochera)
      // NO incluir: bedrooms, bathrooms, parking (una cochera no tiene cocheras), totalFloors, orientation
      const cocheraRelevant = ['area', 'coveredArea', 'yearBuilt', 'expenses', 'floor']
      return cocheraRelevant.includes(fieldName)
    }

    if (isTerreno) {
      // Para terrenos: solo area
      const terrenoRelevant = ['area']
      return terrenoRelevant.includes(fieldName)
    }

    if (isLocal || isOficina) {
      // Para locales comerciales y oficinas: area, ano, expensas, piso, cocheras
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
      newErrors.title = 'El titulo debe tener al menos 5 caracteres'
    }
    if (!formData.description || formData.description.trim().length < 20) {
      newErrors.description = 'La descripcion debe tener al menos 20 caracteres'
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0'
    }
    if (!formData.location || formData.location.trim().length < 3) {
      newErrors.location = 'La ubicacion es requerida'
    }
    if (!formData.area || formData.area <= 0) {
      newErrors.area = 'El area debe ser mayor a 0'
    }
    if (!formData.images || formData.images.length === 0) {
      newErrors.images = 'Debes agregar al menos una imagen'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      console.warn('Errores de validacion encontrados:', newErrors)
      // Scroll al primer error despues de un pequeno delay para que se rendericen los errores
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
    <form onSubmit={handleSubmit} style={formStyles.form}>
      {/* Informacion basica */}
      <div style={formStyles.section}>
        <h2 style={formStyles.sectionTitle}>Informacion Basica</h2>

        <div style={formStyles.field} data-field="title">
          <label style={formStyles.label}>Titulo *</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            placeholder={
              formData.type === 'cochera'
                ? 'Ej: Cochera en Nueva Cordoba'
                : formData.type === 'terreno'
                ? 'Ej: Terreno en Villa Allende'
                : 'Ej: Casa en Villa Allende'
            }
            style={errors.title ? formStyles.inputError : formStyles.input}
          />
          {errors.title && <span style={formStyles.errorMessage}>{errors.title}</span>}
        </div>

        <div style={formStyles.field} data-field="description">
          <label style={formStyles.label}>Descripcion *</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            required
            rows={5}
            placeholder={
              formData.type === 'cochera'
                ? 'Describe la cochera: ubicacion, accesos, medidas, caracteristicas especiales...'
                : formData.type === 'terreno'
                ? 'Describe el terreno: ubicacion, medidas, servicios disponibles, caracteristicas...'
                : 'Describe la propiedad en detalle...'
            }
            style={{
              ...formStyles.textarea,
              ...(errors.description ? { border: '2px solid #e74c3c' } : {}),
            }}
          />
          <small style={formStyles.charCount}>
            {formData.description?.length || 0} caracteres (minimo 20)
          </small>
          {errors.description && <span style={formStyles.errorMessage}>{errors.description}</span>}
        </div>

        <div style={formStyles.row}>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Tipo *</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              required
              style={formStyles.select}
            >
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
              <option value="local">Local</option>
              <option value="oficina">Oficina</option>
              <option value="cochera">Cochera</option>
            </select>
          </div>

          <div style={formStyles.field}>
            <label style={formStyles.label}>Operacion *</label>
            <select
              value={formData.operation}
              onChange={(e) => handleChange('operation', e.target.value)}
              required
              style={formStyles.select}
            >
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>

          <div style={formStyles.field}>
            <label style={formStyles.label}>Estado *</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              required
              style={formStyles.select}
            >
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>
        </div>

        <div style={formStyles.field} data-field="location">
          <label style={formStyles.label}>Ubicacion * <span style={formStyles.labelHint}>(con autocompletado de Google Maps)</span></label>
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
                ? 'Ej: Nueva Cordoba, Cordoba Capital'
                : 'Ej: Villa Allende, Cordoba'
            }
            error={errors.location}
          />
        </div>

        <div style={formStyles.field} data-field="price">
          <label style={formStyles.label}>Precio *</label>
          <div style={formStyles.priceRow}>
            <div style={formStyles.currencySelect}>
              <select
                value={formData.currency || 'USD'}
                onChange={(e) => handleChange('currency', e.target.value as 'ARS' | 'USD')}
                style={formStyles.select}
              >
                <option value="USD">USD (Dolares)</option>
                <option value="ARS">ARS (Pesos)</option>
              </select>
            </div>
            <div style={formStyles.priceInput}>
              <span style={formStyles.currencyBadge}>{formData.currency === 'USD' ? 'US$' : '$'}</span>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                required
                min="0"
                placeholder={formData.currency === 'USD' ? '450000' : '85000000'}
                style={{
                  ...(errors.price ? formStyles.inputError : formStyles.input),
                  paddingLeft: '45px',
                  flex: 1,
                }}
              />
            </div>
          </div>
          {(formData.price ?? 0) > 0 && (
            <small style={formStyles.priceFormatted}>
              {new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: formData.currency || 'USD',
                minimumFractionDigits: 0
              }).format(formData.price ?? 0)}
            </small>
          )}
          {errors.price && <span style={formStyles.errorMessage}>{errors.price}</span>}
        </div>
      </div>

      {/* Caracteristicas */}
      <div style={formStyles.section}>
        <h2 style={formStyles.sectionTitle}>Caracteristicas{formData.type === 'cochera' ? ' de la Cochera' : ''}</h2>

        <div style={formStyles.row}>
          <div style={formStyles.field} data-field="area">
            <label style={formStyles.label}>Area Total (m2) *</label>
            <input
              type="number"
              value={formData.area || ''}
              onChange={(e) => handleChange('area', parseFloat(e.target.value) || 0)}
              required
              min="0"
              step="0.01"
              style={errors.area ? formStyles.inputError : formStyles.input}
            />
            {errors.area && <span style={formStyles.errorMessage}>{errors.area}</span>}
          </div>

          {isFieldRelevant('coveredArea') && (
            <div style={formStyles.field}>
              <label style={formStyles.label}>Area Cubierta (m2)</label>
              <input
                type="number"
                value={formData.coveredArea || ''}
                onChange={(e) => handleChange('coveredArea', parseFloat(e.target.value) || undefined)}
                min="0"
                step="0.01"
                style={formStyles.input}
              />
            </div>
          )}
        </div>

        {isFieldRelevant('bedrooms') || isFieldRelevant('bathrooms') || isFieldRelevant('parking') ? (
          <div style={formStyles.row}>
            {isFieldRelevant('bedrooms') && (
              <div style={formStyles.field}>
                <label style={formStyles.label}>Dormitorios</label>
                <input
                  type="number"
                  value={formData.bedrooms || ''}
                  onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || undefined)}
                  min="0"
                  style={formStyles.input}
                />
              </div>
            )}

            {isFieldRelevant('bathrooms') && (
              <div style={formStyles.field}>
                <label style={formStyles.label}>Banos</label>
                <input
                  type="number"
                  value={formData.bathrooms || ''}
                  onChange={(e) => handleChange('bathrooms', parseInt(e.target.value) || undefined)}
                  min="0"
                  style={formStyles.input}
                />
              </div>
            )}

            {isFieldRelevant('parking') && (
              <div style={formStyles.field}>
                <label style={formStyles.label}>{formData.type === 'cochera' ? 'Cantidad de Cocheras' : 'Cocheras'}</label>
                <input
                  type="number"
                  value={formData.parking || ''}
                  onChange={(e) => handleChange('parking', parseInt(e.target.value) || undefined)}
                  min="0"
                  style={formStyles.input}
                />
              </div>
            )}
          </div>
        ) : null}

        {(isFieldRelevant('yearBuilt') || isFieldRelevant('floor') || isFieldRelevant('totalFloors')) && (
          <div style={formStyles.row}>
            {isFieldRelevant('yearBuilt') && (
              <div style={formStyles.field}>
                <label style={formStyles.label}>Ano de Construccion</label>
                <input
                  type="number"
                  value={formData.yearBuilt || ''}
                  onChange={(e) => handleChange('yearBuilt', parseInt(e.target.value) || undefined)}
                  min="1900"
                  max={new Date().getFullYear()}
                  style={formStyles.input}
                />
              </div>
            )}

            {isFieldRelevant('floor') && (
              <div style={formStyles.field}>
                <label style={formStyles.label}>{formData.type === 'cochera' ? 'Nivel' : 'Piso'}</label>
                <input
                  type="number"
                  value={formData.floor !== undefined ? formData.floor : ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : parseInt(e.target.value)
                    handleChange('floor', value)
                  }}
                  min={formData.type === 'cochera' ? '-1' : '0'}
                  max="200"
                  placeholder={formData.type === 'cochera' ? 'Ej: Subterranea = -1, Planta baja = 0' : 'Ej: 5'}
                  style={formStyles.input}
                />
                {formData.type === 'cochera' && (
                  <small style={formStyles.fieldHint}>
                    -1 = Subterranea, 0 = Planta baja, 1+ = Pisos superiores
                  </small>
                )}
              </div>
            )}

            {isFieldRelevant('totalFloors') && (
              <div style={formStyles.field}>
                <label style={formStyles.label}>Total Pisos</label>
                <input
                  type="number"
                  value={formData.totalFloors || ''}
                  onChange={(e) => handleChange('totalFloors', parseInt(e.target.value) || undefined)}
                  min="0"
                  style={formStyles.input}
                />
              </div>
            )}
          </div>
        )}

        {(isFieldRelevant('orientation') || isFieldRelevant('expenses')) && (
          <div style={formStyles.row}>
            {isFieldRelevant('orientation') && (
              <div style={formStyles.field}>
                <label style={formStyles.label}>Orientacion</label>
                <select
                  value={formData.orientation || ''}
                  onChange={(e) => handleChange('orientation', e.target.value)}
                  style={formStyles.select}
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
              <div style={formStyles.field}>
                <label style={formStyles.label}>Expensas ($)</label>
                <input
                  type="number"
                  value={formData.expenses || ''}
                  onChange={(e) => handleChange('expenses', parseFloat(e.target.value) || undefined)}
                  min="0"
                  style={formStyles.input}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Imagenes */}
      <div style={formStyles.section} data-field="images">
        <h2 style={formStyles.sectionTitle}>Imagenes *</h2>
        <p style={formStyles.sectionDescription}>
          Agrega imagenes de la propiedad. Puedes arrastrar y soltar o hacer clic para seleccionar.
        </p>

        <ImageUpload
          images={formData.images || []}
          onImagesChange={handleImagesChange}
          propertyId={formData.id}
          maxImages={20}
          maxSizeMB={5}
        />

        {errors.images && (
          <span style={formStyles.errorMessage}>{errors.images}</span>
        )}
      </div>

      {/* Caracteristicas adicionales */}
      <div style={formStyles.section}>
        <h2 style={formStyles.sectionTitle}>Caracteristicas Adicionales</h2>

        <div style={formStyles.field}>
          <label style={formStyles.label}>Agregar caracteristica</label>
          <div style={formStyles.addInput}>
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Ej: Jardin amplio, Parrilla, etc."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddFeature()
                }
              }}
              style={{ ...formStyles.input, flex: 1 }}
            />
            <button type="button" onClick={handleAddFeature} style={formStyles.addButton}>
              + Agregar
            </button>
          </div>
        </div>

        {formData.features && formData.features.length > 0 && (
          <div style={formStyles.featuresList}>
            {formData.features.map((feature, index) => (
              <div key={index} style={formStyles.featureItem}>
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  style={formStyles.removeButton}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Opciones */}
      <div style={formStyles.section}>
        <h2 style={formStyles.sectionTitle}>Opciones</h2>

        <div style={formStyles.checkboxField}>
          <label style={formStyles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.featured || false}
              onChange={(e) => handleChange('featured', e.target.checked)}
            />
            Propiedad destacada (aparecera en la portada)
          </label>
        </div>
      </div>

      {/* Indicador de borrador */}
      {hasDraft && (
        <div style={formStyles.draftNotice}>
          <div style={formStyles.draftInfo}>
            <span>Borrador guardado automaticamente</span>
            <button
              type="button"
              onClick={() => {
                if (confirm('Deseas limpiar el borrador guardado y empezar de cero?')) {
                  clearDraft()
                  window.location.reload()
                }
              }}
              style={formStyles.clearDraftButton}
            >
              Limpiar borrador
            </button>
          </div>
        </div>
      )}

      {/* Botones */}
      <div style={formStyles.actions}>
        <button
          type="submit"
          style={{
            ...formStyles.submitButton,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Propiedad'}
        </button>
      </div>
    </form>
  )
}
