'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSwipe } from '@/hooks/useSwipe'

interface PropertyImageGalleryProps {
  images: string[]
  title: string
}

const inlineStyles = {
  gallery: {
    width: '100%',
  } as React.CSSProperties,
  mainImageContainer: {
    position: 'relative' as const,
    width: '100%',
    height: '450px',
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  } as React.CSSProperties,
  mainImage: {
    objectFit: 'cover' as const,
  } as React.CSSProperties,
  placeholderImage: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
  } as React.CSSProperties,
  placeholderIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  } as React.CSSProperties,
  placeholderText: {
    color: '#636e72',
    fontSize: '1rem',
  } as React.CSSProperties,
  imageCounter: {
    position: 'absolute' as const,
    bottom: '1rem',
    left: '1rem',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 500,
  } as React.CSSProperties,
  navButton: {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.9)',
    color: '#1a4158',
    fontSize: '1.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  navButtonLeft: {
    left: '1rem',
  } as React.CSSProperties,
  navButtonRight: {
    right: '1rem',
  } as React.CSSProperties,
  fullscreenButton: {
    position: 'absolute' as const,
    top: '1rem',
    right: '1rem',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  thumbnails: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    overflowX: 'auto' as const,
    backgroundColor: '#f8f9fa',
  } as React.CSSProperties,
  thumbnail: {
    position: 'relative' as const,
    width: '100px',
    height: '80px',
    flexShrink: 0,
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '2px solid transparent',
    padding: 0,
    background: 'none',
    transition: 'border-color 0.2s ease',
  } as React.CSSProperties,
  thumbnailActive: {
    position: 'relative' as const,
    width: '100px',
    height: '80px',
    flexShrink: 0,
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '2px solid #2c5f7d',
    padding: 0,
    background: 'none',
    transition: 'border-color 0.2s ease',
  } as React.CSSProperties,
  thumbnailImage: {
    objectFit: 'cover' as const,
    width: '100%',
    height: '100%',
  } as React.CSSProperties,
  fullscreenModal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.95)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  fullscreenContent: {
    position: 'relative' as const,
    maxWidth: '90vw',
    maxHeight: '90vh',
  } as React.CSSProperties,
  closeButton: {
    position: 'absolute' as const,
    top: '-40px',
    right: '0',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: '1.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
  } as React.CSSProperties,
  fullscreenImage: {
    maxWidth: '100%',
    maxHeight: '85vh',
    objectFit: 'contain' as const,
    borderRadius: '8px',
  } as React.CSSProperties,
  fullscreenNav: {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
  } as React.CSSProperties,
  fullscreenNavLeft: {
    left: '-70px',
  } as React.CSSProperties,
  fullscreenNavRight: {
    right: '-70px',
  } as React.CSSProperties,
  fullscreenCounter: {
    position: 'absolute' as const,
    bottom: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 500,
  } as React.CSSProperties,
}

export default function PropertyImageGallery({ images, title }: PropertyImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const totalImages = images.length
  const currentImage = images[currentIndex] || images[0]

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  // Swipe gestures
  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    minSwipeDistance: 50,
  })

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!images || images.length === 0) {
    return (
      <div style={inlineStyles.gallery}>
        <div style={inlineStyles.mainImageContainer}>
          <div style={inlineStyles.placeholderImage}>
            <span style={inlineStyles.placeholderIcon}>🏠</span>
            <p style={inlineStyles.placeholderText}>Sin imagenes disponibles</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={inlineStyles.gallery}>
        {/* Imagen principal */}
        <div
          style={inlineStyles.mainImageContainer}
          {...swipeHandlers}
        >
          <Image
            src={currentImage}
            alt={`${title} - Imagen ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            style={inlineStyles.mainImage}
            priority
          />

          {/* Indicador de imagen */}
          {totalImages > 1 && (
            <div style={inlineStyles.imageCounter}>
              {currentIndex + 1} / {totalImages}
            </div>
          )}

          {/* Botones de navegacion */}
          {totalImages > 1 && (
            <>
              <button
                style={{...inlineStyles.navButton, ...inlineStyles.navButtonLeft}}
                onClick={goToPrevious}
                aria-label="Imagen anterior"
              >
                ←
              </button>
              <button
                style={{...inlineStyles.navButton, ...inlineStyles.navButtonRight}}
                onClick={goToNext}
                aria-label="Imagen siguiente"
              >
                →
              </button>
            </>
          )}

          {/* Boton de fullscreen */}
          <button
            style={inlineStyles.fullscreenButton}
            onClick={toggleFullscreen}
            aria-label="Ver en pantalla completa"
          >
            🔍
          </button>
        </div>

        {/* Thumbnails */}
        {totalImages > 1 && (
          <div style={inlineStyles.thumbnails}>
            {images.map((image, index) => (
              <button
                key={index}
                style={index === currentIndex ? inlineStyles.thumbnailActive : inlineStyles.thumbnail}
                onClick={() => goToImage(index)}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${title} - Miniatura ${index + 1}`}
                  width={100}
                  height={80}
                  style={inlineStyles.thumbnailImage}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div style={inlineStyles.fullscreenModal} onClick={toggleFullscreen}>
          <div style={inlineStyles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
            <button
              style={inlineStyles.closeButton}
              onClick={toggleFullscreen}
              aria-label="Cerrar pantalla completa"
            >
              ✕
            </button>
            <Image
              src={currentImage}
              alt={`${title} - Imagen ${currentIndex + 1}`}
              width={1600}
              height={900}
              style={{ width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }}
              sizes="100vw"
            />
            {totalImages > 1 && (
              <>
                <button
                  style={{...inlineStyles.fullscreenNav, ...inlineStyles.fullscreenNavLeft}}
                  onClick={goToPrevious}
                  aria-label="Imagen anterior"
                >
                  ←
                </button>
                <button
                  style={{...inlineStyles.fullscreenNav, ...inlineStyles.fullscreenNavRight}}
                  onClick={goToNext}
                  aria-label="Imagen siguiente"
                >
                  →
                </button>
                <div style={inlineStyles.fullscreenCounter}>
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
