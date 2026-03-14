'use client'

import { useState, useEffect } from 'react'
import { getFeaturedTestimonials, Testimonial } from '@/data/testimonials'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

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
        className={`text-lg sm:text-xl ${index < rating ? 'text-brand-secondary' : 'text-gray-300'}`}
      >
        ★
      </span>
    ))
  }

  if (testimonials.length === 0) return null

  return (
    <section
      id="testimonios"
      className="py-10 sm:py-16 lg:py-20 bg-gradient-to-b from-surface to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block px-4 py-1.5 bg-brand-secondary/10 text-brand-primary rounded-full text-sm font-medium mb-3 sm:mb-4">
            Testimonios
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-accent mb-2 sm:mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto">
            Testimonios reales de clientes satisfechos
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-border text-center relative">
            {/* Quote Icon */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-8 text-brand-secondary opacity-30">
              <Quote className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>

            {/* Quote */}
            <blockquote className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed italic mb-4 sm:mb-6 relative z-10 pt-4 sm:pt-0">
              &ldquo;{testimonials[currentIndex]?.comment}&rdquo;
            </blockquote>

            {/* Rating */}
            <div className="mb-4 sm:mb-5 flex justify-center gap-0.5">
              {renderStars(testimonials[currentIndex]?.rating || 0)}
            </div>

            {/* Author */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-brand-accent mb-1">
                {testimonials[currentIndex]?.name}
              </h4>
              <p className="text-sm text-muted mb-1">
                {testimonials[currentIndex]?.location}
              </p>
              <p className="text-xs sm:text-sm text-brand-primary mb-2">
                {testimonials[currentIndex]?.service}
              </p>
              {testimonials[currentIndex]?.verified && (
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  ✓ Verificado
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={prevTestimonial}
              aria-label="Testimonio anterior"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-border bg-white flex items-center justify-center hover:bg-surface hover:border-brand-primary transition-all duration-200 touch-target"
            >
              <ChevronLeft className="w-5 h-5 text-muted" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ir al testimonio ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'w-6 bg-brand-primary'
                      : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              aria-label="Siguiente testimonio"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-border bg-white flex items-center justify-center hover:bg-surface hover:border-brand-primary transition-all duration-200 touch-target"
            >
              <ChevronRight className="w-5 h-5 text-muted" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
