'use client'

import { useState, useCallback } from 'react'
import { Property } from '@/data/properties'
import { ReviewFormData } from '@/types/review'
import { useReviews } from '@/hooks/useReviews'
import { X, Star, Loader2, Send, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

/* =============================================================================
   TYPES
============================================================================= */

interface ReviewFormProps {
  property: Property
  onClose: () => void
  onSuccess?: () => void
}

interface FormErrors {
  rating?: string
  title?: string
  comment?: string
}

/* =============================================================================
   VALIDATION FUNCTIONS
============================================================================= */

const validateRating = (rating: number): string | undefined => {
  if (rating === 0) return 'Por favor selecciona una calificación'
  if (rating < 1 || rating > 5) return 'La calificación debe ser entre 1 y 5'
  return undefined
}

const validateTitle = (title: string): string | undefined => {
  if (!title.trim()) return 'El título es requerido'
  if (title.trim().length < 5) return 'El título debe tener al menos 5 caracteres'
  if (title.trim().length > 100) return 'El título no puede exceder 100 caracteres'
  return undefined
}

const validateComment = (comment: string): string | undefined => {
  if (!comment.trim()) return 'El comentario es requerido'
  if (comment.trim().length < 20) return 'El comentario debe tener al menos 20 caracteres'
  if (comment.trim().length > 1000) return 'El comentario no puede exceder 1000 caracteres'
  return undefined
}

/* =============================================================================
   CONSTANTS
============================================================================= */

const RATING_LABELS = [
  'Terrible',
  'Malo',
  'Regular',
  'Bueno',
  'Excelente'
]

/* =============================================================================
   MAIN COMPONENT
============================================================================= */

export default function ReviewForm({ property, onClose, onSuccess }: ReviewFormProps) {
  const { createReview } = useReviews()
  const [formData, setFormData] = useState<ReviewFormData>({
    propertyId: property.id,
    rating: 0,
    title: '',
    comment: '',
    pros: [],
    cons: []
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [prosInput, setProsInput] = useState('')
  const [consInput, setConsInput] = useState('')

  const validateField = useCallback((name: string, value: string | number): string | undefined => {
    switch (name) {
      case 'rating': return validateRating(value as number)
      case 'title': return validateTitle(value as string)
      case 'comment': return validateComment(value as string)
      default: return undefined
    }
  }, [])

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {
      rating: validateRating(formData.rating),
      title: validateTitle(formData.title),
      comment: validateComment(formData.comment),
    }

    const filteredErrors = Object.entries(newErrors).reduce((acc, [key, value]) => {
      if (value) acc[key as keyof FormErrors] = value
      return acc
    }, {} as FormErrors)

    setErrors(filteredErrors)
    return Object.keys(filteredErrors).length === 0
  }, [formData])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [touched, validateField])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [validateField])

  const handleRatingChange = useCallback((rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
    setTouched(prev => ({ ...prev, rating: true }))
    const error = validateField('rating', rating)
    setErrors(prev => ({ ...prev, rating: error }))
  }, [validateField])

  const handleAddPros = useCallback(() => {
    if (!prosInput.trim()) return
    setFormData(prev => ({
      ...prev,
      pros: [...prev.pros, prosInput.trim()]
    }))
    setProsInput('')
  }, [prosInput])

  const handleAddCons = useCallback(() => {
    if (!consInput.trim()) return
    setFormData(prev => ({
      ...prev,
      cons: [...prev.cons, consInput.trim()]
    }))
    setConsInput('')
  }, [consInput])

  const removeProsCons = useCallback((type: 'pros' | 'cons', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Mark all required fields as touched
    setTouched({
      rating: true,
      title: true,
      comment: true,
    })

    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    try {
      await createReview(formData)
      onSuccess?.()
      onClose()
    } catch {
      setErrors(prev => ({ ...prev, comment: 'Error al crear la reseña. Intenta nuevamente.' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBaseClasses = "w-full px-4 py-3 text-sm bg-white border rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-primary/20"
  const inputNormalClasses = `${inputBaseClasses} border-slate-200 focus:border-brand-primary`
  const inputErrorClasses = `${inputBaseClasses} border-red-500 border-2 bg-red-50 focus:border-red-500 focus:ring-red-500/20`
  const labelClasses = "block text-sm font-medium text-brand-accent mb-2"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-brand-accent">Escribir Reseña</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Property Info */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-semibold text-brand-accent">{property.title}</h3>
          <p className="text-sm text-slate-500">{property.location}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
          {/* Rating */}
          <div>
            <label className={labelClasses}>
              Calificación <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className={cn(
                    "p-1 transition-all duration-200 hover:scale-110",
                    formData.rating >= rating
                      ? "text-amber-400"
                      : "text-slate-300 hover:text-amber-300"
                  )}
                >
                  <Star
                    className={cn(
                      "w-8 h-8",
                      formData.rating >= rating && "fill-current"
                    )}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <span className="ml-2 text-sm font-medium text-amber-600">
                  {RATING_LABELS[formData.rating - 1]}
                </span>
              )}
            </div>
            {errors.rating && touched.rating && (
              <p className="text-xs text-red-500 mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClasses}>
              Título de la reseña <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Resume tu experiencia en pocas palabras"
              className={cn(errors.title && touched.title ? inputErrorClasses : inputNormalClasses)}
            />
            {errors.title && touched.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className={labelClasses}>
              Comentario <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              onBlur={handleBlur}
              rows={4}
              placeholder="Cuéntanos tu experiencia con esta propiedad..."
              className={cn(
                errors.comment && touched.comment ? inputErrorClasses : inputNormalClasses,
                "resize-y min-h-[100px]"
              )}
            />
            {errors.comment && touched.comment && (
              <p className="text-xs text-red-500 mt-1">{errors.comment}</p>
            )}
            <p className="text-xs text-slate-400 mt-1">
              {formData.comment.length}/1000 caracteres
            </p>
          </div>

          {/* Pros */}
          <div>
            <label className={labelClasses}>Puntos positivos (opcional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prosInput}
                onChange={(e) => setProsInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddPros()
                  }
                }}
                placeholder="Ej: Excelente ubicación"
                className={inputNormalClasses}
              />
              <button
                type="button"
                onClick={handleAddPros}
                className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {formData.pros.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.pros.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm rounded-full border border-emerald-200"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeProsCons('pros', index)}
                      className="text-emerald-500 hover:text-emerald-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cons */}
          <div>
            <label className={labelClasses}>Puntos negativos (opcional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={consInput}
                onChange={(e) => setConsInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCons()
                  }
                }}
                placeholder="Ej: Ruido en la calle"
                className={inputNormalClasses}
              />
              <button
                type="button"
                onClick={handleAddCons}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {formData.cons.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.cons.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-full border border-red-200"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeProsCons('cons', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 px-6 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg font-medium shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Publicar Reseña
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
