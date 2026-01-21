'use client'

import { useState, useEffect } from 'react'
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
        style={{
          color: index < rating ? '#e8b86d' : '#d1d5db',
          fontSize: '1.25rem'
        }}
      >
        ★
      </span>
    ))
  }

  if (testimonials.length === 0) return null

  return (
    <section
      id="testimonios"
      style={{
        padding: '80px 0',
        background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: '700',
              color: '#1a4158',
              marginBottom: '16px'
            }}
          >
            Lo que dicen nuestros clientes
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#636e72' }}>
            Testimonios reales de clientes satisfechos
          </p>
        </div>

        {/* Testimonial Card */}
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '48px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* Quote Icon */}
            <div
              style={{
                position: 'absolute',
                top: '24px',
                left: '32px',
                color: '#e8b86d',
                opacity: 0.3
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 8.971 3 10 7 10z"></path>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 8.971 3 10 7 10z"></path>
              </svg>
            </div>

            {/* Quote */}
            <blockquote
              style={{
                fontSize: '1.25rem',
                color: '#374151',
                lineHeight: '1.8',
                fontStyle: 'italic',
                marginBottom: '24px',
                position: 'relative',
                zIndex: 1
              }}
            >
              &ldquo;{testimonials[currentIndex]?.comment}&rdquo;
            </blockquote>

            {/* Rating */}
            <div style={{ marginBottom: '20px' }}>
              {renderStars(testimonials[currentIndex]?.rating || 0)}
            </div>

            {/* Author */}
            <div>
              <h4
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#1a4158',
                  marginBottom: '4px'
                }}
              >
                {testimonials[currentIndex]?.name}
              </h4>
              <p style={{ color: '#636e72', fontSize: '0.9rem', marginBottom: '4px' }}>
                {testimonials[currentIndex]?.location}
              </p>
              <p style={{ color: '#2c5f7d', fontSize: '0.85rem', marginBottom: '8px' }}>
                {testimonials[currentIndex]?.service}
              </p>
              {testimonials[currentIndex]?.verified && (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: '#d1fae5',
                    color: '#059669',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}
                >
                  ✓ Verificado
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              marginTop: '32px'
            }}
          >
            <button
              onClick={prevTestimonial}
              aria-label="Testimonio anterior"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid #e5e7eb',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#636e72" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ir al testimonio ${index + 1}`}
                  style={{
                    width: index === currentIndex ? '24px' : '10px',
                    height: '10px',
                    borderRadius: '5px',
                    border: 'none',
                    background: index === currentIndex ? '#2c5f7d' : '#d1d5db',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              aria-label="Siguiente testimonio"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid #e5e7eb',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#636e72" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
