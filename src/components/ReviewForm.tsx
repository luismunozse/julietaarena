'use client'

import { useState } from 'react'
import { Property } from '@/data/properties'
import { ReviewFormData } from '@/types/review'
import { useReviews } from '@/hooks/useReviews'
import styles from './ReviewForm.module.css'

interface ReviewFormProps {
  property: Property
  onClose: () => void
  onSuccess?: () => void
}

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      if (formData.rating === 0) {
        setError('Por favor selecciona una calificación')
        return
      }

      if (!formData.title.trim()) {
        setError('Por favor escribe un título para tu reseña')
        return
      }

      if (!formData.comment.trim()) {
        setError('Por favor escribe un comentario')
        return
      }

      await createReview(formData)
      onSuccess?.()
      onClose()
    } catch (error) {
      setError('Error al crear la reseña')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const handleProsConsChange = (type: 'pros' | 'cons', value: string) => {
    if (!value.trim()) return

    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()]
    }))
  }

  const removeProsCons = (type: 'pros' | 'cons', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const ratingLabels = [
    'Terrible',
    'Malo',
    'Regular',
    'Bueno',
    'Excelente'
  ]

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Escribir Reseña</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        <div className={styles.propertyInfo}>
          <h3>{property.title}</h3>
          <p>📍 {property.location}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Calificación *</label>
            <div className={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className={`${styles.star} ${formData.rating >= rating ? styles.filled : ''}`}
                  onClick={() => handleRatingChange(rating)}
                >
                  ⭐
                </button>
              ))}
              {formData.rating > 0 && (
                <span className={styles.ratingLabel}>
                  {ratingLabels[formData.rating - 1]}
                </span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title">Título de la reseña *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Resume tu experiencia en pocas palabras"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="comment">Comentario *</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              placeholder="Cuéntanos tu experiencia con esta propiedad..."
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Puntos positivos (opcional)</label>
            <div className={styles.prosConsContainer}>
              <input
                type="text"
                placeholder="Ej: Excelente ubicación"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleProsConsChange('pros', e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <div className={styles.prosConsList}>
                {formData.pros.map((item, index) => (
                  <span key={index} className={styles.prosConsItem}>
                    {item}
                    <button
                      type="button"
                      onClick={() => removeProsCons('pros', index)}
                      className={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Puntos negativos (opcional)</label>
            <div className={styles.prosConsContainer}>
              <input
                type="text"
                placeholder="Ej: Ruido en la calle"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleProsConsChange('cons', e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <div className={styles.prosConsList}>
                {formData.cons.map((item, index) => (
                  <span key={index} className={styles.prosConsItem}>
                    {item}
                    <button
                      type="button"
                      onClick={() => removeProsCons('cons', index)}
                      className={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Publicar Reseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
