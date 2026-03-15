'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Property } from '@/data/properties'
import ImageUpload from './ImageUpload'
import LocationInput from './LocationInput'
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
import { Plus, X, AlertCircle, FileWarning, Star } from 'lucide-react'

interface PropertyFormProps {
  onSubmit: (data: Partial<Property>) => void
  isSubmitting: boolean
  initialData?: Partial<Property>
}

const DRAFT_STORAGE_KEY = 'property-form-draft'

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
      parking: undefined,
      yearBuilt: undefined,
      coveredArea: undefined,
      floor: undefined,
      totalFloors: undefined,
      orientation: '',
      expenses: undefined,
    }
  )

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
    const isFormEmpty =
      !formData.title &&
      !formData.description &&
      !formData.price &&
      !formData.location
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
      ;(window as any).__clearPropertyDraft = clearDraft
    }
  }, [clearDraft])

  const handleChange = (field: keyof Property, value: any) => {
    setFormData((prev) => {
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
      setErrors((prev) => {
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
    const alwaysRelevant = [
      'title',
      'description',
      'price',
      'location',
      'type',
      'operation',
      'status',
      'images',
      'features',
    ]
    if (alwaysRelevant.includes(fieldName)) return true

    // Campos especificos por tipo
    if (isCochera) {
      // Para cocheras: area, ano, expensas, piso (nivel de cochera)
      // NO incluir: bedrooms, bathrooms, parking (una cochera no tiene cocheras), totalFloors, orientation
      const cocheraRelevant = [
        'area',
        'coveredArea',
        'yearBuilt',
        'expenses',
        'floor',
      ]
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
      const comercialRelevant = [
        'area',
        'coveredArea',
        'yearBuilt',
        'expenses',
        'floor',
        'totalFloors',
        'parking',
      ]
      return comercialRelevant.includes(fieldName)
    }

    // Para otros tipos (casa, departamento): todos los campos
    return true
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      handleChange('features', [
        ...(formData.features || []),
        newFeature.trim(),
      ])
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
          const element = document.querySelector(
            `[data-field="${firstErrorField}"]`
          )
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Informacion basica */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="border-b-2 border-amber-400 pb-3 text-lg text-slate-900">
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2" data-field="title">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
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
              className={cn(errors.title && 'border-destructive')}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2" data-field="description">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
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
              className={cn(errors.description && 'border-destructive')}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description?.length || 0} caracteres (mínimo 20)
            </p>
            {errors.description && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
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
              <Label htmlFor="operation">Operación *</Label>
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
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
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
              Ubicación *{' '}
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
              error={errors.location}
            />
          </div>

          <div className="space-y-2" data-field="price">
            <Label>Precio *</Label>
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
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) =>
                    handleChange('price', parseFloat(e.target.value) || 0)
                  }
                  required
                  min="0"
                  placeholder={formData.currency === 'USD' ? '450000' : '85000000'}
                  className={cn('pl-11', errors.price && 'border-destructive')}
                />
              </div>
            </div>
            {(formData.price ?? 0) > 0 && (
              <p className="text-xs text-slate-700">
                {new Intl.NumberFormat('es-AR', {
                  style: 'currency',
                  currency: formData.currency || 'USD',
                  minimumFractionDigits: 0,
                }).format(formData.price ?? 0)}
              </p>
            )}
            {errors.price && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.price}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Caracteristicas */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="border-b-2 border-amber-400 pb-3 text-lg text-slate-900">
            Características
            {formData.type === 'cochera' ? ' de la Cochera' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2" data-field="area">
              <Label htmlFor="area">Área Total (m²) *</Label>
              <Input
                id="area"
                type="number"
                value={formData.area || ''}
                onChange={(e) =>
                  handleChange('area', parseFloat(e.target.value) || 0)
                }
                required
                min="0"
                step="0.01"
                className={cn(errors.area && 'border-destructive')}
              />
              {errors.area && (
                <p className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {errors.area}
                </p>
              )}
            </div>

            {isFieldRelevant('coveredArea') && (
              <div className="space-y-2">
                <Label htmlFor="coveredArea">Área Cubierta (m²)</Label>
                <Input
                  id="coveredArea"
                  type="number"
                  value={formData.coveredArea || ''}
                  onChange={(e) =>
                    handleChange(
                      'coveredArea',
                      parseFloat(e.target.value) || undefined
                    )
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
                  <Label htmlFor="bedrooms">Dormitorios</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms || ''}
                    onChange={(e) =>
                      handleChange(
                        'bedrooms',
                        parseInt(e.target.value) || undefined
                      )
                    }
                    min="0"
                  />
                </div>
              )}

              {isFieldRelevant('bathrooms') && (
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Baños</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms || ''}
                    onChange={(e) =>
                      handleChange(
                        'bathrooms',
                        parseInt(e.target.value) || undefined
                      )
                    }
                    min="0"
                  />
                </div>
              )}

              {isFieldRelevant('parking') && (
                <div className="space-y-2">
                  <Label htmlFor="parking">
                    {formData.type === 'cochera'
                      ? 'Cantidad de Cocheras'
                      : 'Cocheras'}
                  </Label>
                  <Input
                    id="parking"
                    type="number"
                    value={formData.parking || ''}
                    onChange={(e) =>
                      handleChange(
                        'parking',
                        parseInt(e.target.value) || undefined
                      )
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
                  <Label htmlFor="yearBuilt">Año de Construcción</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    value={formData.yearBuilt || ''}
                    onChange={(e) =>
                      handleChange(
                        'yearBuilt',
                        parseInt(e.target.value) || undefined
                      )
                    }
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              )}

              {isFieldRelevant('floor') && (
                <div className="space-y-2">
                  <Label htmlFor="floor">
                    {formData.type === 'cochera' ? 'Nivel' : 'Piso'}
                  </Label>
                  <Input
                    id="floor"
                    type="number"
                    value={formData.floor !== undefined ? formData.floor : ''}
                    onChange={(e) => {
                      const value =
                        e.target.value === ''
                          ? undefined
                          : parseInt(e.target.value)
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
                  <Label htmlFor="totalFloors">Total Pisos</Label>
                  <Input
                    id="totalFloors"
                    type="number"
                    value={formData.totalFloors || ''}
                    onChange={(e) =>
                      handleChange(
                        'totalFloors',
                        parseInt(e.target.value) || undefined
                      )
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
                  <Label htmlFor="orientation">Orientación</Label>
                  <Select
                    value={formData.orientation || ''}
                    onValueChange={(value) =>
                      handleChange('orientation', value)
                    }
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
                  <Label htmlFor="expenses">Expensas ($)</Label>
                  <Input
                    id="expenses"
                    type="number"
                    value={formData.expenses || ''}
                    onChange={(e) =>
                      handleChange(
                        'expenses',
                        parseFloat(e.target.value) || undefined
                      )
                    }
                    min="0"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Imagenes */}
      <Card className="bg-white" data-field="images">
        <CardHeader className="pb-4">
          <CardTitle className="border-b-2 border-amber-400 pb-3 text-lg text-slate-900">
            Imágenes *
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Agrega imágenes de la propiedad. Puedes arrastrar y soltar o hacer
            clic para seleccionar.
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

      {/* Caracteristicas adicionales */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="border-b-2 border-amber-400 pb-3 text-lg text-slate-900">
            Características Adicionales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Agregar característica</Label>
            <div className="flex gap-3">
              <Input
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
                className="flex-1"
              />
              <Button type="button" onClick={handleAddFeature}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </div>
          </div>

          {formData.features && formData.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1.5 px-3 py-1.5 text-sm"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="ml-1 rounded-full p-0.5 hover:bg-slate-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Opciones */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="border-b-2 border-amber-400 pb-3 text-lg text-slate-900">
            Opciones
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Indicador de borrador */}
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
              onClick={() => {
                if (
                  confirm(
                    '¿Deseas limpiar el borrador guardado y empezar de cero?'
                  )
                ) {
                  clearDraft()
                  window.location.reload()
                }
              }}
              className="border-amber-400 text-amber-800 hover:bg-amber-100"
            >
              Limpiar borrador
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Botones */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="min-w-40 bg-gradient-to-r from-[#2c5f7d] to-[#1a4158] font-semibold hover:from-[#1a4158] hover:to-[#0f2a38]"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Propiedad'}
        </Button>
      </div>
    </form>
  )
}
