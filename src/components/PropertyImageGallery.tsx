'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSwipe } from '@/hooks/useSwipe'
import styles from './PropertyImageGallery.module.css'

interface PropertyImageGalleryProps {
  images: string[]
  title: string
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
      <div className={styles.gallery}>
        <div className={styles.mainImageContainer}>
          <div className={styles.placeholderImage}>
            <span className={styles.placeholderIcon}>🏠</span>
            <p className={styles.placeholderText}>Sin imágenes disponibles</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={styles.gallery}>
        {/* Imagen principal */}
        <div 
          className={styles.mainImageContainer} 
          {...swipeHandlers}
        >
          <Image 
            src={currentImage} 
            alt={`${title} - Imagen ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className={styles.mainImage}
            priority
          />
          
          {/* Indicador de imagen */}
          {totalImages > 1 && (
            <div className={styles.imageCounter}>
              {currentIndex + 1} / {totalImages}
            </div>
          )}

          {/* Botones de navegación */}
          {totalImages > 1 && (
            <>
              <button
                className={`${styles.navButton} ${styles.navButtonLeft}`}
                onClick={goToPrevious}
                aria-label="Imagen anterior"
              >
                ←
              </button>
              <button
                className={`${styles.navButton} ${styles.navButtonRight}`}
                onClick={goToNext}
                aria-label="Imagen siguiente"
              >
                →
              </button>
            </>
          )}

          {/* Botón de fullscreen */}
          <button
            className={styles.fullscreenButton}
            onClick={toggleFullscreen}
            aria-label="Ver en pantalla completa"
          >
            🔍
          </button>
        </div>

        {/* Thumbnails */}
        {totalImages > 1 && (
          <div className={styles.thumbnails}>
            {images.map((image, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
                onClick={() => goToImage(index)}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${title} - Miniatura ${index + 1}`}
                  width={100}
                  height={80}
                  className={styles.thumbnailImage}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className={styles.fullscreenModal} onClick={toggleFullscreen}>
          <div className={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
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
              className={styles.fullscreenImage}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
            />
            {totalImages > 1 && (
              <>
                <button
                  className={`${styles.fullscreenNav} ${styles.fullscreenNavLeft}`}
                  onClick={goToPrevious}
                  aria-label="Imagen anterior"
                >
                  ←
                </button>
                <button
                  className={`${styles.fullscreenNav} ${styles.fullscreenNavRight}`}
                  onClick={goToNext}
                  aria-label="Imagen siguiente"
                >
                  →
                </button>
                <div className={styles.fullscreenCounter}>
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




