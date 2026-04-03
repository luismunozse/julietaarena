'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useSwipe } from '@/hooks/useSwipe'
import { ChevronLeft, ChevronRight, X, Maximize2, ImageOff, Grid2x2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyImageGalleryProps {
  images: string[]
  title: string
}

export default function PropertyImageGallery({ images, title }: PropertyImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showAllGrid, setShowAllGrid] = useState(false)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const fullscreenThumbsRef = useRef<HTMLDivElement>(null)

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

  // Auto-scroll fullscreen thumbnails
  useEffect(() => {
    if (!isFullscreen || !fullscreenThumbsRef.current) return
    const container = fullscreenThumbsRef.current
    const activeThumb = container.children[currentIndex] as HTMLElement
    if (!activeThumb) return
    activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [currentIndex, isFullscreen])

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
      if (e.key === 'Escape') {
        if (showAllGrid) { setShowAllGrid(false); return }
        if (isFullscreen) { setIsFullscreen(false); return }
        return
      }
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'ArrowLeft') goToPrevious()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, showAllGrid, goToNext, goToPrevious])

  // Lock body scroll when modals open
  useEffect(() => {
    if (isFullscreen || showAllGrid) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isFullscreen, showAllGrid])

  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    minSwipeDistance: 50,
  })

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] sm:h-[450px] bg-surface">
        <ImageOff className="h-12 w-12 text-muted/40 mb-3" />
        <p className="text-sm text-muted">Sin imagenes disponibles</p>
      </div>
    )
  }

  const sideImages = images.slice(1, 5)
  const hasMultiple = totalImages > 1

  return (
    <>
      {/* ── GRID PREVIEW (desktop: main + side thumbnails) ── */}
      <div className="w-full">
        {/* Desktop grid layout */}
        <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-1 h-[500px] lg:h-[550px]">
          {/* Main image — spans 2 cols + 2 rows */}
          <div
            className="relative col-span-2 row-span-2 overflow-hidden cursor-pointer group/main"
            onClick={() => setIsFullscreen(true)}
          >
            <Image
              src={currentImage}
              alt={`${title} - Imagen ${currentIndex + 1}`}
              fill
              sizes="(max-width: 1200px) 50vw, 600px"
              className="object-cover transition-transform duration-500 group-hover/main:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/10 transition-colors" />
            <button
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 opacity-0 group-hover/main:opacity-100"
              onClick={(e) => { e.stopPropagation(); setIsFullscreen(true) }}
              aria-label="Ver en pantalla completa"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          {/* Side thumbnails — 2x2 grid */}
          {sideImages.map((image, i) => (
            <div
              key={i}
              className="relative overflow-hidden cursor-pointer group/thumb"
              onClick={() => { setCurrentIndex(i + 1); setIsFullscreen(true) }}
            >
              <Image
                src={image}
                alt={`${title} - Imagen ${i + 2}`}
                fill
                sizes="300px"
                className="object-cover transition-transform duration-500 group-hover/thumb:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/10 transition-colors" />

              {/* "Ver todas" button on last visible thumbnail */}
              {i === sideImages.length - 1 && totalImages > 5 && (
                <button
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors"
                  onClick={(e) => { e.stopPropagation(); setShowAllGrid(true) }}
                >
                  <span className="flex items-center gap-2 text-white font-semibold text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Grid2x2 className="w-4 h-4" />
                    Ver las {totalImages} fotos
                  </span>
                </button>
              )}
            </div>
          ))}

          {/* Fill empty slots if < 5 images */}
          {sideImages.length < 4 && Array.from({ length: 4 - sideImages.length }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-surface" />
          ))}
        </div>

        {/* Mobile: single image with swipe */}
        <div className="md:hidden relative w-full h-[350px] sm:h-[420px] bg-surface overflow-hidden" {...swipeHandlers}>
          <Image
            src={currentImage}
            alt={`${title} - Imagen ${currentIndex + 1}`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />

          {hasMultiple && (
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
              {currentIndex + 1} / {totalImages}
            </div>
          )}

          {hasMultiple && (
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

          {/* "Ver todas" mobile */}
          {totalImages > 3 && (
            <button
              className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-2 rounded-lg shadow-lg hover:bg-white transition-colors"
              onClick={() => setShowAllGrid(true)}
            >
              <Grid2x2 className="w-3.5 h-3.5" />
              {totalImages} fotos
            </button>
          )}
        </div>

        {/* Thumbnail strip (below main, both mobile & desktop) */}
        {hasMultiple && (
          <div className="relative bg-surface border-t border-border">
            {/* Fade gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
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

      {/* ── FULLSCREEN MODAL ── */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
              onClick={() => setIsFullscreen(false)}
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main image */}
          <div className="relative flex-1 w-full max-w-[90vw] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Image
              src={currentImage}
              alt={`${title} - Imagen ${currentIndex + 1}`}
              width={1600}
              height={900}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
              sizes="100vw"
            />

            {hasMultiple && (
              <>
                <button
                  className="absolute left-2 sm:-left-16 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                  onClick={goToPrevious}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-2 sm:-right-16 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                  onClick={goToNext}
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              {currentIndex + 1} / {totalImages}
            </div>
          </div>

          {/* Fullscreen thumbnail strip */}
          {hasMultiple && (
            <div className="w-full max-w-3xl px-4 py-3" onClick={(e) => e.stopPropagation()}>
              <div
                ref={fullscreenThumbsRef}
                className="flex gap-2 overflow-x-auto justify-center scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={cn(
                      "relative w-[60px] h-[44px] shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200",
                      index === currentIndex
                        ? "border-white opacity-100 scale-110"
                        : "border-transparent opacity-40 hover:opacity-70"
                    )}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`Miniatura ${index + 1}`}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ALL PHOTOS GRID MODAL ── */}
      {showAllGrid && (
        <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {totalImages} fotos - {title}
            </h3>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface transition-colors"
              onClick={() => setShowAllGrid(false)}
              aria-label="Cerrar galeria"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Grid */}
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {images.map((image, index) => (
                <button
                  key={index}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg group/gridimg"
                  onClick={() => { setCurrentIndex(index); setShowAllGrid(false); setIsFullscreen(true) }}
                >
                  <Image
                    src={image}
                    alt={`${title} - Foto ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover/gridimg:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/gridimg:bg-black/10 transition-colors" />
                  <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm opacity-0 group-hover/gridimg:opacity-100 transition-opacity">
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
