'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import styles from './ImageUpload.module.css'

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void
  initialImages?: string[]
  maxImages?: number
  className?: string
}

export default function ImageUpload({ 
  onImagesChange, 
  initialImages = [], 
  maxImages = 10,
  className = '' 
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newImages: string[] = []
    const remainingSlots = maxImages - images.length

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          newImages.push(result)
          
          if (newImages.length === Math.min(files.length, remainingSlots)) {
            const updatedImages = [...images, ...newImages]
            setImages(updatedImages)
            onImagesChange(updatedImages)
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`${styles.imageUpload} ${className}`}>
      <div className={styles.uploadArea}>
        {images.length === 0 ? (
          <div
            className={`${styles.dropZone} ${isDragging ? styles.dragOver : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div className={styles.dropZoneContent}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
              <h4>Subir Imágenes de la Propiedad</h4>
              <p>Arrastra y suelta imágenes aquí o haz clic para seleccionar</p>
              <button type="button" className="btn btn-primary">
                Seleccionar Imágenes
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.imageGrid}>
            {images.map((image, index) => (
              <div key={index} className={styles.imageItem}>
                <div className={styles.imageContainer}>
                  <Image
                    src={image}
                    alt={`Propiedad ${index + 1}`}
                    width={200}
                    height={150}
                    className={styles.image}
                  />
                  <button
                    className={styles.removeButton}
                    onClick={() => removeImage(index)}
                    aria-label="Eliminar imagen"
                  >
                    ✕
                  </button>
                </div>
                <div className={styles.imageInfo}>
                  <span>Imagen {index + 1}</span>
                </div>
              </div>
            ))}
            
            {images.length < maxImages && (
              <div
                className={`${styles.addMore} ${isDragging ? styles.dragOver : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openFileDialog}
              >
                <div className={styles.addMoreContent}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  <span>Agregar más</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className={styles.hiddenInput}
      />

      <div className={styles.uploadInfo}>
        <p>
          <strong>Formatos aceptados:</strong> JPG, PNG, WebP
        </p>
        <p>
          <strong>Tamaño máximo:</strong> 10MB por imagen
        </p>
        <p>
          <strong>Máximo de imágenes:</strong> {maxImages}
        </p>
      </div>
    </div>
  )
}
