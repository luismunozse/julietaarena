'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import type { Property } from '@/data/properties'
import ImageUpload from './ImageUpload'
import LocationInput from './LocationInput'
import Modal from './Modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Plus, X, AlertCircle, FileWarning, Star, Check, Save, Loader2 } from 'lucide-react'

interface PropertyFormProps {
  onSubmit: (data: Partial<Property>) => void
  isSubmitting: boolean
  initialData?: Partial<Property>
}

const DRAFT_STORAGE_KEY = 'property-form-draft'

/* =============================================================================
   SUGGESTED FEATURES BY PROPERTY TYPE
============================================================================= */

const COMMON_FEATURES: Record<string, string[]> = {
  casa: [
    'Pileta', 'Parrilla', 'Jardín', 'Cochera cubierta', 'Quincho',
    'Aire acondicionado', 'Calefacción central', 'Gas natural',
    'Seguridad 24hs', 'Barrio cerrado', 'Agua corriente', 'Cloacas',
    'Alarma', 'Lavadero', 'Vestidor', 'Escritorio', 'Playroom',
  ],
  departamento: [
    'Balcón', 'Terraza', 'Aire acondicionado', 'Calefacción central',
    'Ascensor', 'Seguridad 24hs', 'Pileta común', 'SUM', 'Gimnasio',
    'Laundry', 'Baulera', 'Gas natural', 'Portería', 'Parrilla común',
  ],
  terreno: [
    'Agua corriente', 'Gas natural', 'Cloacas', 'Luz eléctrica',
    'Calle asfaltada', 'Escritura inmediata', 'Apto crédito',
    'Barrio cerrado', 'Esquina', 'Medianeras',
  ],
  local: [
    'Vidriera', 'Depósito', 'Baño privado', 'Aire acondicionado',
    'Habilitación comercial', 'Sobre avenida', 'Estacionamiento',
    'Alarma', 'Entrepiso',
  ],
  oficina: [
    'Aire acondicionado', 'Calefacción', 'Ascensor', 'Seguridad 24hs',
    'Sala de reuniones', 'Recepción', 'Baño privado', 'Cochera',
    'Internet fibra óptica', 'Open space',
  ],
  cochera: [
    'Cubierta', 'Fija', 'Móvil', 'Subterránea', 'Con portón automático',
    'Seguridad 24hs', 'Acceso con control remoto',
  ],
}

/* =============================================================================
   PROGRESS SECTIONS
============================================================================= */

const SECTIONS = [
  { id: 'basica', label: 'Básica', fields: ['title', 'description', 'type', 'operation', 'status', 'location', 'price'] },
  { id: 'caracteristicas', label: 'Detalles', fields: ['area'] },
  { id: 'imagenes', label: 'Imágenes', fields: ['images'] },
  { id: 'adicionales', label: 'Extras', fields: ['features'] },
  { id: 'servicios', label: 'Servicios', fields: ['services'] },
  { id: 'opciones', label: 'Opciones', fields: ['featured'] },
] as const

/* =============================================================================
   VALIDATION HELPERS
============================================================================= */

function validateField(field: string, value: unknown): string | null {
  switch (field) {
    case 'title':
      if (!value || (value as string).trim().length < 5)
        return 'El título debe tener al menos 5 caracteres'
      return null
    case 'description':
      if (!value || (value as string).trim().length < 20)
        return 'La descripción debe tener al menos 20 caracteres'
      return null
    case 'price':
      if (!value || (value as number) <= 0)
        return 'El precio debe ser mayor a 0'
      return null
    case 'location':
      if (!value || (value as string).trim().length < 3)
        return 'La ubicación es requerida'
      return null
    case 'area':
      if (!value || (value as number) <= 0)
        return 'El área debe ser mayor a 0'
      return null
    case 'images':
      if (!value || (value as string[]).length === 0)
        return 'Debes agregar al menos una imagen'
      return null
    default:
      return null
  }
}

const REQUIRED_FIELDS = ['title', 'description', 'price', 'location', 'area', 'images']

/* =============================================================================
   FORMAT PRICE DISPLAY
============================================================================= */

function formatPriceDisplay(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (!num || isNaN(num)) return ''
  return num.toLocaleString('es-AR')
}

/* =============================================================================
   COMPONENT
============================================================================= */

export default function PropertyForm({
  onSubmit,
  isSubmitting,
  initialData,
}: PropertyFormProps) {
  const [formData, setFormData] = useState<Partial<Property>>(
    initialData || {
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
      rooms: undefined,
      parking: undefined,
      yearBuilt: undefined,
      coveredArea: undefined,
      floor: undefined,
      totalFloors: undefined,
      orientation: '',
      disposition: '',
      expenses: undefined,
      condition: '',
      aptCredit: false,
      internalCode: '',
      videoUrl: '',
      services: [],
      documentation: [],
    }
  )

  const [newFeature, setNewFeature] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [hasDraft, setHasDraft] = useState(false)
  const [priceDisplay, setPriceDisplay] = useState('')
  const [clearDraftModal, setClearDraftModal] = useState(false)
  const submitBarRef = useRef<HTMLDivElement>(null)

  // Init price display
  useEffect(() => {
    if (formData.price && formData.price > 0) {
      setPriceDisplay(formatPriceDisplay(formData.price))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
          if (draft.price && draft.price > 0) {
            setPriceDisplay(formatPriceDisplay(draft.price))
          }
        }
      } catch {
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo al montar

  // Sincronizar con initialData cuando cambia (modo edicion)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData)
      if (initialData.price && initialData.price > 0) {
        setPriceDisplay(formatPriceDisplay(initialData.price))
      }
    }
  }, [initialData])

  // Funcion para guardar el borrador
  const saveDraft = useCallback(() => {
    if (formData.id || isSubmitting) return

    const isFormEmpty =
      !formData.title &&
      !formData.description &&
      !formData.price &&
      !formData.location
    if (isFormEmpty) return

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData))
  }, [formData, isSubmitting])

  // Guardar automaticamente en localStorage con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => { saveDraft() }, 300)
    return () => clearTimeout(timeoutId)
  }, [saveDraft])

  // Guardar cuando el usuario cambia de pestana o cierra la ventana
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) saveDraft()
    }
    const handleBeforeUnload = () => { saveDraft() }

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
      ;(window as any).__clearPropertyDraft = clearDraft
    }
  }, [clearDraft])

  /* ---------------------------------------------------------------------------
     PROGRESS CALCULATION
  --------------------------------------------------------------------------- */

  const progress = useMemo(() => {
    let filled = 0
    let total = 0

    for (const section of SECTIONS) {
      for (const field of section.fields) {
        total++
        const val = formData[field as keyof Property]
        if (field === 'images') {
          if (Array.isArray(val) && val.length > 0) filled++
        } else if (field === 'features') {
          if (Array.isArray(val) && val.length > 0) filled++
        } else if (field === 'featured') {
          filled++ // always counts as filled (has default)
        } else if (field === 'type' || field === 'operation' || field === 'status') {
          filled++ // selects always have a value
        } else if (typeof val === 'number') {
          if (val > 0) filled++
        } else if (typeof val === 'string') {
          if (val.trim().length > 0) filled++
        }
      }
    }

    return Math.round((filled / total) * 100)
  }, [formData])

  /* ---------------------------------------------------------------------------
     HANDLERS
  --------------------------------------------------------------------------- */

  const handleChange = (field: keyof Property, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      if (field === 'type') {
        const isCochera = value === 'cochera'
        const isTerreno = value === 'terreno'
        const isLocal = value === 'local'
        const isOficina = value === 'oficina'

        if (isCochera) {
          updated.bedrooms = undefined
          updated.bathrooms = undefined
          updated.parking = undefined
          updated.totalFloors = undefined
          updated.orientation = ''
        } else if (isTerreno) {
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
          updated.bedrooms = undefined
          updated.bathrooms = undefined
          updated.orientation = ''
        }
      }

      return updated
    })

    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))

    if (REQUIRED_FIELDS.includes(field)) {
      const error = validateField(field, formData[field as keyof Property])
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }))
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }
  }

  const handleImagesChange = (images: string[]) => {
    handleChange('images', images)
    // Clear images error when images are added
    if (images.length > 0 && errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.images
        return newErrors
      })
    }
  }

  const isFieldRelevant = (fieldName: string): boolean => {
    const isCochera = formData.type === 'cochera'
    const isTerreno = formData.type === 'terreno'
    const isLocal = formData.type === 'local'
    const isOficina = formData.type === 'oficina'

    const alwaysRelevant = ['title', 'description', 'price', 'location', 'type', 'operation', 'status', 'images', 'features', 'condition', 'aptCredit', 'internalCode', 'videoUrl', 'services', 'documentation']
    if (alwaysRelevant.includes(fieldName)) return true

    if (isCochera) return ['area', 'coveredArea', 'yearBuilt', 'expenses', 'floor'].includes(fieldName)
    if (isTerreno) return ['area'].includes(fieldName)
    if (isLocal || isOficina) return ['area', 'coveredArea', 'yearBuilt', 'expenses', 'floor', 'totalFloors', 'parking', 'rooms'].includes(fieldName)

    // casa, departamento: todos los campos
    return true
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      handleChange('features', [...(formData.features || []), newFeature.trim()])
      setNewFeature('')
    }
  }

  const handleToggleSuggestedFeature = (feature: string) => {
    const current = formData.features || []
    if (current.includes(feature)) {
      handleChange('features', current.filter((f) => f !== feature))
    } else {
      handleChange('features', [...current, feature])
    }
  }

  const handleRemoveFeature = (index: number) => {
    const updated = formData.features?.filter((_, i) => i !== index) || []
    handleChange('features', updated)
  }

  const handlePriceChange = (displayValue: string) => {
    // Remove everything except digits and decimal
    const cleaned = displayValue.replace(/[^\d]/g, '')
    const numericValue = parseInt(cleaned) || 0
    setPriceDisplay(cleaned ? formatPriceDisplay(numericValue) : '')
    handleChange('price', numericValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    for (const field of REQUIRED_FIELDS) {
      const error = validateField(field, formData[field as keyof Property])
      if (error) newErrors[field] = error
    }

    setErrors(newErrors)
    // Mark all required fields as touched
    setTouched(REQUIRED_FIELDS.reduce((acc, f) => ({ ...acc, [f]: true }), {}))

    if (Object.keys(newErrors).length > 0) {
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

  const suggestedFeatures = COMMON_FEATURES[formData.type || 'casa'] || COMMON_FEATURES.casa
  const currentFeatures = formData.features || []

  const errorCount = Object.keys(errors).length

  /* ---------------------------------------------------------------------------
     RENDER
  --------------------------------------------------------------------------- */

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-24">
      {/* ================================================================
          PROGRESS BAR
      ================================================================ */}
      <div className="sticky top-0 z-10 -mx-1 px-1 pt-1 pb-3 bg-gradient-to-b from-slate-50 via-slate-50 to-transparent">
        <div className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-600">Progreso del formulario</span>
              <span className="text-xs font-semibold text-slate-700">{progress}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500 ease-out",
                  progress < 50 ? "bg-amber-400" : progress < 100 ? "bg-blue-500" : "bg-emerald-500"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {progress === 100 && (
            <Check className="h-5 w-5 text-emerald-500 shrink-0" />
          )}
        </div>
      </div>

      {/* ================================================================
          SECCION 1: INFORMACION BASICA
      ================================================================ */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="border-b-2 border-amber-400 pb-3 text-lg text-slate-900">
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2" data-field="title">
            <Label htmlFor="title">Título <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              placeholder={
                formData.type === 'cochera'
                  ? 'Ej: Cochera en Nueva Cordoba'
                  : formData.type === 'terreno'
                    ? 'Ej: Terreno en Villa Allende'
                    : 'Ej: Casa en Villa Allende'
              }
              className={cn(touched.title && errors.title && 'border-destructive')}
            />
            {touched.title && errors.title && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2" data-field="description">
            <Label htmlFor="description">Descripción <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              rows={5}
              placeholder={
                formData.type === 'cochera'
                  ? 'Describe la cochera: ubicacion, accesos, medidas, caracteristicas especiales...'
                  : formData.type === 'terreno'
                    ? 'Describe el terreno: ubicacion, medidas, servicios disponibles, caracteristicas...'
                    : 'Describe la propiedad en detalle...'
              }
              className={cn(touched.description && errors.description && 'border-destructive')}
            />
            <p className={cn(
              "text-xs",
              (formData.description?.length || 0) >= 20 ? "text-emerald-600" : "text-muted-foreground"
            )}>
              {formData.description?.length || 0} caracteres (mínimo 20)
            </p>
            {touched.description && errors.description && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo <span className="text-destructive">*</span></Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="departamento">Departamento</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="oficina">Oficina</SelectItem>
                  <SelectItem value="cochera">Cochera</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operation">Operación <span className="text-destructive">*</span></Label>
              <Select
                value={formData.operation}
                onValueChange={(value) => handleChange('operation', value)}
              >
                <SelectTrigger id="operation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                  <SelectItem value="alquiler_temporal">Alquiler Temporal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado <span className="text-destructive">*</span></Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2" data-field="location">
            <Label>
              Ubicación <span className="text-destructive">*</span>{' '}
              <span className="font-normal text-muted-foreground">
                (con autocompletado de Google Maps)
              </span>
            </Label>
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
              error={touched.location ? errors.location : undefined}
            />
          </div>

          <div className="space-y-2" data-field="price">
            <Label>Precio <span className="text-destructive">*</span></Label>
            <div className="flex gap-3">
              <div className="w-36">
                <Select
                  value={formData.currency || 'USD'}
                  onValueChange={(value) =>
                    handleChange('currency', value as 'ARS' | 'USD')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD (Dólares)</SelectItem>
                    <SelectItem value="ARS">ARS (Pesos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {formData.currency === 'USD' ? 'US$' : '$'}
                </span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={priceDisplay}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  onBlur={() => handleBlur('price')}
                  placeholder={formData.currency === 'USD' ? '450.000' : '85.000.000'}
                  className={cn('pl-11', touched.price && errors.price && 'border-destructive')}
                />
              </div>
            </div>
            {(formData.price ?? 0) > 0 && (
              <p className="text-xs font-medium text-emerald-700">
                {new Intl.NumberFormat('es-AR', {
                  style: 'currency',
                  currency: formData.currency || 'USD',
                  minimumFractionDigits: 0,
                }).format(formData.price ?? 0)}
              </p>
            )}
            {touched.price && errors.price && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.price}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="internalCode">
                Código Interno <span className="text-xs text-muted-foreground font-normal">opcional</span>
              </Label>
              <Input
                id="internalCode"
                type="text"
                value={formData.internalCode || ''}
                onChange={(e) => handleChange('internalCode', e.target.value)}
                placeholder="Ej: JA-0042"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">
                Video / Tour Virtual <span className="text-xs text-muted-foreground font-normal">opcional</span>
              </Label>
              <Input
                id="videoUrl"
                type="url"
                value={formData.videoUrl || ''}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                placeholder="https://youtube.com/watch?v=... o Matterport"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================================================================
          SECCION 2: CARACTERISTICAS
      ================================================================ */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="border-b-2 border-amber-400 pb-3 text-lg text-slate-900">
            Características
            {formData.type === 'cochera' ? ' de la Cochera' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Condición y Disposición */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="condition">
                Condición <span className="text-xs text-muted-foreground font-normal">opcional</span>
              </Label>
              <Select
                value={formData.condition || ''}
                onValueChange={(value) => handleChange('condition', value)}
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a_estrenar">A estrenar</SelectItem>
                  <SelectItem value="muy_bueno">Muy bueno</SelectItem>
                  <SelectItem value="bueno">Bueno</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="a_reciclar">A reciclar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isFieldRelevant('disposition') && !['terreno', 'cochera'].includes(formData.type || '') && (
              <div className="space-y-2">
                <Label htmlFor="disposition">
                  Disposición <span className="text-xs text-muted-foreground font-normal">opcional</span>
                </Label>
                <Select
                  value={formData.disposition || ''}
                  onValueChange={(value) => handleChange('disposition', value)}
                >
                  <SelectTrigger id="disposition">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frente">Frente</SelectItem>
                    <SelectItem value="contrafrente">Contrafrente</SelectItem>
                    <SelectItem value="interno">Interno</SelectItem>
                    <SelectItem value="lateral">Lateral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {isFieldRelevant('rooms') && !['terreno', 'cochera', 'local'].includes(formData.type || '') && (
              <div className="space-y-2">
                <Label htmlFor="rooms">
                  Ambientes <span className="text-xs text-muted-foreground font-normal">opcional</span>
                </Label>
                <Input
                  id="rooms"
                  type="number"
                  value={formData.rooms || ''}
                  onChange={(e) => handleChange('rooms', parseInt(e.target.value) || undefined)}
                  min="1"
                  placeholder="Ej: 3"
                />
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2" data-field="area">
              <Label htmlFor="area">Área Total (m²) <span className="text-destructive">*</span></Label>
              <Input
                id="area"
                type="number"
                value={formData.area || ''}
                onChange={(e) =>
                  handleChange('area', parseFloat(e.target.value) || 0)
                }
                onBlur={() => handleBlur('area')}
                min="0"
                step="0.01"
                className={cn(touched.area && errors.area && 'border-destructive')}
              />
              {touched.area && errors.area && (
                <p className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {errors.area}
                </p>
              )}
            </div>

            {isFieldRelevant('coveredArea') && (
              <div className="space-y-2">
                <Label htmlFor="coveredArea">
                  Área Cubierta (m²) <span className="text-xs text-muted-foreground font-normal">opcional</span>
                </Label>
                <Input
                  id="coveredArea"
                  type="number"
                  value={formData.coveredArea || ''}
                  onChange={(e) =>
                    handleChange('coveredArea', parseFloat(e.target.value) || undefined)
                  }
                  min="0"
                  step="0.01"
                />
              </div>
            )}
          </div>

          {(isFieldRelevant('bedrooms') ||
            isFieldRelevant('bathrooms') ||
            isFieldRelevant('parking')) && (
            <div className="grid gap-4 sm:grid-cols-3">
              {isFieldRelevant('bedrooms') && (
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">
                    Dormitorios <span className="text-xs text-muted-foreground font-normal">opcional</span>
                  </Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms || ''}
                    onChange={(e) =>
                      handleChange('bedrooms', parseInt(e.target.value) || undefined)
                    }
                    min="0"
                  />
                </div>
              )}

              {isFieldRelevant('bathrooms') && (
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">
                    Baños <span className="text-xs text-muted-foreground font-normal">opcional</span>
                  </Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms || ''}
                    onChange={(e) =>
                      handleChange('bathrooms', parseInt(e.target.value) || undefined)
                    }
                    min="0"
                  />
                </div>
              )}

              {isFieldRelevant('parking') && (
                <div className="space-y-2">
                  <Label htmlFor="parking">
                    {formData.type === 'cochera' ? 'Cantidad de Cocheras' : 'Cocheras'}{' '}
                    <span className="text-xs text-muted-foreground font-normal">opcional</span>
                  </Label>
                  <Input
                    id="parking"
                    type="number"
                    value={formData.parking || ''}
                    onChange={(e) =>
                      handleChange('parking', parseInt(e.target.value) || undefined)
                    }
                    min="0"
                  />
                </div>
              )}
            </div>
          )}

          {(isFieldRelevant('yearBuilt') ||
            isFieldRelevant('floor') ||
            isFieldRelevant('totalFloors')) && (
            <div className="grid gap-4 sm:grid-cols-3">
              {isFieldRelevant('yearBuilt') && (
                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">
                    Año de Construcción <span className="text-xs text-muted-foreground font-normal">opcional</span>
                  </Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    value={formData.yearBuilt || ''}
                    onChange={(e) =>
                      handleChange('yearBuilt', parseInt(e.target.value) || undefined)
                    }
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              )}

              {isFieldRelevant('floor') && (
                <div className="space-y-2">
                  <Label htmlFor="floor">
                    {formData.type === 'cochera' ? 'Nivel' : 'Piso'}{' '}
                    <span className="text-xs text-muted-foreground font-normal">opcional</span>
                  </Label>
                  <Input
                    id="floor"
                    type="number"
                    value={formData.floor !== undefined ? formData.floor : ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? undefined : parseInt(e.target.value)
                      handleChange('floor', value)
                    }}
                    min={formData.type === 'cochera' ? '-1' : '0'}
                    max="200"
                    placeholder={
                      formData.type === 'cochera'
                        ? 'Ej: Subterranea = -1, Planta baja = 0'
                        : 'Ej: 5'
                    }
                  />
                  {formData.type === 'cochera' && (
                    <p className="text-xs text-muted-foreground">
                      -1 = Subterránea, 0 = Planta baja, 1+ = Pisos superiores
                    </p>
                  )}
                </div>
              )}

              {isFieldRelevant('totalFloors') && (
                <div className="space-y-2">
                  <Label htmlFor="totalFloors">
                    Total Pisos <span className="text-xs text-muted-foreground font-normal">opcional</span>
                  </Label>
                  <Input
                    id="totalFloors"
                    type="number"
                    value={formData.totalFloors || ''}
                    onChange={(e) =>
                      handleChange('totalFloors', parseInt(e.target.value) || undefined)
                    }
                    min="0"
                  />
                </div>
              )}
            </div>
          )}

          {(isFieldRelevant('orientation') ||
            isFieldRelevant('expenses')) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {isFieldRelevant('orientation') && (
                <div className="space-y-2">
                  <Label htmlFor="orientation">
                    Orientación <span className="text-xs text-muted-foreground font-normal">opcional</span>
                  </Label>
                  <Select
                    value={formData.orientation || ''}
                    onValueChange={(value) => handleChange('orientation', value)}
                  >
                    <SelectTrigger id="orientation">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Norte">Norte</SelectItem>
                      <SelectItem value="Sur">Sur</SelectItem>
                      <SelectItem value="Este">Este</SelectItem>
                      <SelectItem value="Oeste">Oeste</SelectItem>
                      <SelectItem value="Noreste">Noreste</SelectItem>
                      <SelectItem value="Noroeste">Noroeste</SelectItem>
                      <SelectItem value="Sureste">Sureste</SelectItem>
                      <SelectItem value="Suroeste">Suroeste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {isFieldRelevant('expenses') && (
                <div className="space-y-2">
                  <Label htmlFor="expenses">
                    Expensas ($) <span className="text-xs text-muted-foreground font-normal">opcional</span>
                  </Label>
                  <Input
                    id="expenses"
                    type="number"
                    value={formData.expenses || ''}
                    onChange={(e) =>
                      handleChange('expenses', parseFloat(e.target.value) || undefined)
                    }
                    min="0"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================================================================
          SECCION 3: IMAGENES
      ================================================================ */}
      <Card className="bg-white" data-field="images">
        <CardHeader className="pb-4">
          <CardTitle className="border-b-2 border-amber-400 pb-3 text-lg text-slate-900">
            Imágenes <span className="text-destructive">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Agrega imágenes de la propiedad. La primera imagen será la portada en redes sociales y listados.
          </p>

          <ImageUpload
            images={formData.images || []}
            onImagesChange={handleImagesChange}
            propertyId={formData.id}
            maxImages={20}
            maxSizeMB={5}
          />

          {errors.images && (
            <p className="flex items-center gap-1 text-sm text-destructive">
              <FileWarning className="h-4 w-4" />
              {errors.images}
            </p>
          )}
        </CardContent>
      </Card>

      {/* ================================================================
          SECCION 4: CARACTERISTICAS ADICIONALES
      ================================================================ */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="border-b-2 border-amber-400 pb-3 text-lg text-slate-900">
            Características Adicionales
            <span className="text-xs text-muted-foreground font-normal ml-2">opcional</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Suggested features chips */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Selecciona o escribe las características</Label>
            <div className="flex flex-wrap gap-2">
              {suggestedFeatures.map((feature) => {
                const isSelected = currentFeatures.includes(feature)
                return (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => handleToggleSuggestedFeature(feature)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all duration-200",
                      isSelected
                        ? "bg-[#2c5f7d] text-white border-[#2c5f7d] shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                    )}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                    {feature}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom feature input */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Agregar otra característica</Label>
            <div className="flex gap-3">
              <Input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Ej: Vista panorámica, Doble altura..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddFeature()
                  }
                }}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddFeature} disabled={!newFeature.trim()}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </div>
          </div>

          {/* Custom features (not in suggestions) */}
          {currentFeatures.filter((f) => !suggestedFeatures.includes(f)).length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Personalizadas</Label>
              <div className="flex flex-wrap gap-2">
                {currentFeatures
                  .filter((f) => !suggestedFeatures.includes(f))
                  .map((feature) => {
                    const originalIndex = currentFeatures.indexOf(feature)
                    return (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="gap-1.5 px-3 py-1.5 text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(originalIndex)}
                          className="ml-1 rounded-full p-0.5 hover:bg-slate-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================================================================
          SECCION: SERVICIOS E INFRAESTRUCTURA
      ================================================================ */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="border-b-2 border-amber-400 pb-3 text-lg text-slate-900">
            Servicios e Infraestructura
            <span className="text-xs text-muted-foreground font-normal ml-2">opcional</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label className="text-xs text-muted-foreground">Selecciona los servicios disponibles</Label>
          <div className="flex flex-wrap gap-2">
            {[
              'Agua corriente', 'Gas natural', 'Cloacas', 'Electricidad',
              'Internet fibra óptica', 'Cable', 'Teléfono fijo',
              'Calle asfaltada', 'Alumbrado público', 'Transporte público',
              'Recolección de residuos',
            ].map((service) => {
              const isSelected = (formData.services || []).includes(service)
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => {
                    const current = formData.services || []
                    if (isSelected) {
                      handleChange('services', current.filter((s) => s !== service))
                    } else {
                      handleChange('services', [...current, service])
                    }
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all duration-200",
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  {service}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* ================================================================
          SECCION: DOCUMENTACION
      ================================================================ */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="border-b-2 border-amber-400 pb-3 text-lg text-slate-900">
            Documentación
            <span className="text-xs text-muted-foreground font-normal ml-2">opcional</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label className="text-xs text-muted-foreground">Documentación disponible de la propiedad</Label>
          <div className="flex flex-wrap gap-2">
            {[
              'Escritura', 'Boleto de compraventa', 'Planos aprobados',
              'Final de obra', 'Apto crédito bancario', 'Libre de gravámenes',
              'Informe de dominio', 'Certificado catastral', 'Reglamento de copropiedad',
            ].map((doc) => {
              const isSelected = (formData.documentation || []).includes(doc)
              return (
                <button
                  key={doc}
                  type="button"
                  onClick={() => {
                    const current = formData.documentation || []
                    if (isSelected) {
                      handleChange('documentation', current.filter((d) => d !== doc))
                    } else {
                      handleChange('documentation', [...current, doc])
                    }
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all duration-200",
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  {doc}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* ================================================================
          SECCION: OPCIONES
      ================================================================ */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="border-b-2 border-amber-400 pb-3 text-lg text-slate-900">
            Opciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              id="featured"
              checked={formData.featured || false}
              onCheckedChange={(checked) =>
                handleChange('featured', checked === true)
              }
            />
            <Label
              htmlFor="featured"
              className="flex cursor-pointer items-center gap-2"
            >
              <Star className="h-4 w-4 text-amber-500" />
              Propiedad destacada (aparecerá en la portada)
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="aptCredit"
              checked={formData.aptCredit || false}
              onCheckedChange={(checked) =>
                handleChange('aptCredit', checked === true)
              }
            />
            <Label
              htmlFor="aptCredit"
              className="flex cursor-pointer items-center gap-2 text-emerald-700"
            >
              Apto crédito hipotecario
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* ================================================================
          INDICADOR DE BORRADOR
      ================================================================ */}
      {hasDraft && (
        <Card className="border-amber-400 bg-amber-50">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <span className="text-sm text-amber-800">
              Borrador guardado automáticamente
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setClearDraftModal(true)}
              className="border-amber-400 text-amber-800 hover:bg-amber-100"
            >
              Limpiar borrador
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ================================================================
          STICKY SUBMIT BAR
      ================================================================ */}
      <div
        ref={submitBarRef}
        className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-4 py-3"
      >
        <div className="mx-auto max-w-4xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    progress < 50 ? "bg-amber-400" : progress < 100 ? "bg-blue-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs">{progress}%</span>
            </div>
            {errorCount > 0 && (
              <span className="text-destructive text-xs font-medium">
                {errorCount} {errorCount === 1 ? 'error' : 'errores'}
              </span>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="min-w-40 bg-gradient-to-r from-[#2c5f7d] to-[#1a4158] font-semibold hover:from-[#1a4158] hover:to-[#0f2a38]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar Propiedad
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ================================================================
          MODAL: LIMPIAR BORRADOR
      ================================================================ */}
      <Modal
        isOpen={clearDraftModal}
        onClose={() => setClearDraftModal(false)}
        title="Limpiar borrador"
        message="¿Deseas limpiar el borrador guardado y empezar de cero? Esta acción no se puede deshacer."
        type="alert"
        onConfirm={() => {
          clearDraft()
          setClearDraftModal(false)
          window.location.reload()
        }}
      />
    </form>
  )
}
