'use client'

import { useState, useEffect } from 'react'
import styles from './Testimonials.module.css'
import { getFeaturedTestimonials, Testimonial } from '@/data/testimonials'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setTestimonials(getFeaturedTestimonials())
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`${styles.star} ${index < rating ? styles.starFilled : styles.starEmpty}`}
      >
        ★
      </span>
    ))
  }

  if (testimonials.length === 0) return null

  return (
    <section className={`section ${styles.testimonials}`} id="testimonios">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Lo que dicen nuestros clientes</h2>
          <p className="section-subtitle">Testimonios reales de clientes satisfechos</p>
        </div>

        <div className={styles.testimonialsContainer}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <div className={styles.quoteIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 8.971 3 10 7 10z"></path>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 8.971 3 10 7 10z"></path>
                </svg>
              </div>
              
                <blockquote className={styles.testimonialText}>
                  &ldquo;{testimonials[currentIndex]?.comment}&rdquo;
                </blockquote>
              
              <div className={styles.testimonialRating}>
                {renderStars(testimonials[currentIndex]?.rating || 0)}
              </div>
              
              <div className={styles.testimonialAuthor}>
                <h4 className={styles.authorName}>{testimonials[currentIndex]?.name}</h4>
                <p className={styles.authorLocation}>{testimonials[currentIndex]?.location}</p>
                <p className={styles.authorService}>{testimonials[currentIndex]?.service}</p>
                {testimonials[currentIndex]?.verified && (
                  <span className={styles.verifiedBadge}>✓ Verificado</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.testimonialControls}>
            <button 
              className={styles.controlButton} 
              onClick={prevTestimonial}
              aria-label="Testimonio anterior"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <div className={styles.testimonialDots}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ir al testimonio ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              className={styles.controlButton} 
              onClick={nextTestimonial}
              aria-label="Siguiente testimonio"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
