'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useSwipe } from '@/hooks/useSwipe'
import { ChevronLeft, ChevronRight, X, Maximize2, ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyImageGalleryProps {
  images: string[]
  title: string
}

export default function PropertyImageGallery({ images, title }: PropertyImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!thumbnailsRef.current) return
    const container = thumbnailsRef.current
    const activeThumb = container.children[currentIndex] as HTMLElement
    if (!activeThumb) return

    const containerRect = container.getBoundingClientRect()
    const thumbRect = activeThumb.getBoundingClientRect()

    if (thumbRect.left < containerRect.left || thumbRect.right > containerRect.right) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [currentIndex])

  const totalImages = images.length
  const currentImage = images[currentIndex] || images[0]

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalImages)
  }, [totalImages])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages)
  }, [totalImages])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
        return
      }
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'ArrowLeft') goToPrevious()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, goToNext, goToPrevious])

  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    minSwipeDistance: 50,
  })

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] sm:h-[450px] bg-surface">
        <ImageOff className="h-12 w-12 text-muted/40 mb-3" />
        <p className="text-sm text-muted">Sin imágenes disponibles</p>
      </div>
    )
  }

  return (
    <>
      <div className="w-full">
        {/* Main image */}
        <div className="relative w-full h-[350px] sm:h-[450px] bg-surface overflow-hidden" {...swipeHandlers}>
          <Image
            src={currentImage}
            alt={`${title} - Imagen ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />

          {totalImages > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
              {currentIndex + 1} / {totalImages}
            </div>
          )}

          {totalImages > 1 && (
            <>
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-105"
                onClick={goToPrevious}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-105"
                onClick={goToNext}
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <button
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
            onClick={() => setIsFullscreen(true)}
            aria-label="Ver en pantalla completa"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Thumbnails */}
        {totalImages > 1 && (
          <div className="relative bg-surface border-t border-border">
            <div
              ref={thumbnailsRef}
              className="flex gap-1.5 px-3 py-2.5 overflow-x-auto scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    "relative w-[64px] h-[48px] sm:w-[80px] sm:h-[56px] shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200",
                    index === currentIndex
                      ? "border-brand-primary ring-1 ring-brand-primary/20 opacity-100 scale-105"
                      : "border-transparent opacity-60 hover:opacity-90"
                  )}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${title} - Miniatura ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
              onClick={() => setIsFullscreen(false)}
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            <Image
              src={currentImage}
              alt={`${title} - Imagen ${currentIndex + 1}`}
              width={1600}
              height={900}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              sizes="100vw"
            />

            {totalImages > 1 && (
              <>
                <button
                  className="absolute left-0 sm:-left-16 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                  onClick={goToPrevious}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-0 sm:-right-16 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                  onClick={goToNext}
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white text-sm font-medium">
                  {currentIndex + 1} / {totalImages}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
