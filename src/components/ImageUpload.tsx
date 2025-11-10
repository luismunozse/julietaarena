'use client'

import { useState, useRef, useCallback, type DragEvent } from 'react'
import Image from 'next/image'
import { uploadPropertyImage, deletePropertyImage, getPublicImageUrl } from '@/lib/storage'
import styles from './ImageUpload.module.css'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  propertyId?: string
  maxImages?: number
  maxSizeMB?: number
}

export default function ImageUpload({
  images,
  onImagesChange,
  propertyId,
  maxImages = 20,
  maxSizeMB = 5
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [brokenPreviews, setBrokenPreviews] = useState<Record<string, boolean>>({})
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const placeholderImage =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen no disponible%3C/text%3E%3C/svg%3E'

  const uploadImageFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      const { publicUrl, path } = await uploadPropertyImage(file, { propertyId })
      return publicUrl || path
    } catch (err) {
      console.error('❌ Error inesperado al subir imagen:', err)
      setError('Error al procesar la imagen')
      return null
    }
  }, [propertyId])

  // Validar archivo
  const validateFile = useCallback((file: File): string | null => {
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      return 'Solo se permiten archivos de imagen'
    }

    // Validar tamaño
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSizeMB) {
      return `El archivo es demasiado grande. Máximo ${maxSizeMB}MB`
    }

    return null
  }, [maxSizeMB])

  // Procesar archivos
  const processFiles = useCallback(async (files: FileList) => {
    setError(null)
    setUploading(true)

    try {
      const validFiles: File[] = []
      const errors: string[] = []

      // Validar cantidad
      if (images.length + files.length > maxImages) {
        console.warn('⚠️ Máximo de imágenes excedido:', images.length + files.length, '>', maxImages)
        setError(`Máximo ${maxImages} imágenes permitidas`)
        setUploading(false)
        return
      }

      // Validar cada archivo
      Array.from(files).forEach(file => {
        const validationError = validateFile(file)
        if (validationError) {
          errors.push(`${file.name}: ${validationError}`)
        } else {
          validFiles.push(file)
        }
      })

      if (errors.length > 0) {
        console.warn('⚠️ Errores de validación:', errors)
        setError(errors.join(', '))
      }

      // Procesar archivos válidos
      if (validFiles.length > 0) {
        const newImages: string[] = []

        for (const file of validFiles) {
          try {
            const uploadedUrl = await uploadImageFile(file)
            if (uploadedUrl) {
              newImages.push(uploadedUrl)
            } else {
              errors.push(`Error al procesar ${file.name}`)
            }
          } catch (err) {
            console.error('❌ Error procesando imagen:', err)
            errors.push(`Error al procesar ${file.name}`)
          }
        }

        if (newImages.length > 0) {
          onImagesChange([...images, ...newImages])
        }
      }

      if (errors.length > 0 && validFiles.length === 0) {
        setError(errors[0])
      }

    } catch (err) {
      console.error('❌ Error procesando imágenes:', err)
      setError('Error al procesar las imágenes')
    } finally {
      setUploading(false)
    }
  }, [images, maxImages, onImagesChange, uploadImageFile, validateFile])

  // Manejar selección de archivos
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Reset input para permitir seleccionar el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [processFiles])

  // Manejar drag & drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFiles(files)
    }
  }, [processFiles])

  // Eliminar imagen
  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index]
    const updated = images.filter((_, i) => i !== index)
    onImagesChange(updated)
    try {
      await deletePropertyImage(imageUrl)
    } catch (err) {
      console.error('Error eliminando imagen:', err)
    }
  }

  // Reordenar imágenes (arrastrar para cambiar orden)
  const handleMoveImage = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    const updated = [...images]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    onImagesChange(updated)
  }, [images, onImagesChange])

  const resetDragState = useCallback(() => {
    setDraggingIndex(null)
    setDragOverIndex(null)
  }, [])

  const handleDragStart = useCallback((event: DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', index.toString())
    setDraggingIndex(index)
    setDragOverIndex(index)
  }, [])

  const handleDragEnterPreview = useCallback((index: number) => {
    if (draggingIndex === null || draggingIndex === index) return
    setDragOverIndex(index)
  }, [draggingIndex])

  const handleDragOverPreview = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDropPreview = useCallback((event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault()
    if (draggingIndex === null) {
      resetDragState()
      return
    }
    handleMoveImage(draggingIndex, index)
    resetDragState()
  }, [draggingIndex, handleMoveImage, resetDragState])

  const handleDragEnd = useCallback(() => {
    resetDragState()
  }, [resetDragState])

  return (
    <div className={styles.container}>
      {/* Zona de subida */}
      <div
        ref={dropZoneRef}
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${uploading ? styles.uploading : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className={styles.hiddenInput}
          disabled={uploading || images.length >= maxImages}
        />

        <div className={styles.dropZoneContent}>
          {uploading ? (
            <>
              <div className={styles.spinner}></div>
              <p>Subiendo imágenes...</p>
            </>
          ) : (
            <>
              <div className={styles.uploadIcon}>📸</div>
              <p className={styles.uploadText}>
                <strong>Haz clic o arrastra imágenes aquí</strong>
              </p>
              <p className={styles.uploadHint}>
                Máximo {maxImages} imágenes • {maxSizeMB}MB por imagen
              </p>
              <p className={styles.uploadHint}>
                Formatos: JPG, PNG, WebP
              </p>
            </>
          )}
        </div>
      </div>

      {/* Opción alternativa: URL */}
      <div className={styles.urlOption}>
        <details>
          <summary>O agregar desde URL</summary>
          <div className={styles.urlInput}>
            <input
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const input = e.currentTarget as HTMLInputElement
                  const url = input.value.trim()
                  if (url && !images.includes(url)) {
                    if (images.length >= maxImages) {
                      setError(`Máximo ${maxImages} imágenes permitidas`)
                    } else {
                      onImagesChange([...images, url])
                      input.value = ''
                      setError(null)
                    }
                  }
                }
              }}
            />
            <small>Presiona Enter para agregar</small>
          </div>
        </details>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {/* Vista previa de imágenes */}
      {images.length > 0 && (
        <div className={styles.imagesGrid}>
          {images.map((image, index) => {
            const previewClasses = [styles.imagePreview]
            if (draggingIndex === index) previewClasses.push(styles.imagePreviewDragging)
            if (dragOverIndex === index && draggingIndex !== index) previewClasses.push(styles.imagePreviewDropTarget)

            return (
              <div
                key={index}
                className={previewClasses.join(' ')}
                draggable
                onDragStart={(event) => handleDragStart(event, index)}
                onDragEnter={() => handleDragEnterPreview(index)}
                onDragOver={handleDragOverPreview}
                onDrop={(event) => handleDropPreview(event, index)}
                onDragEnd={handleDragEnd}
              >
                <Image
                  src={brokenPreviews[image] ? placeholderImage : getPublicImageUrl(image)}
                  alt={`Imagen ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 45vw, 150px"
                  className={styles.previewImage}
                  unoptimized
                  onError={() => setBrokenPreviews((prev) => ({ ...prev, [image]: true }))}
                />
                <div className={styles.imageOverlay}>
                  <span className={styles.imageNumber}>{index + 1}</span>
                  <div className={styles.imageActions}>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMoveImage(index, index - 1)
                        }}
                        className={styles.moveButton}
                        title="Mover hacia arriba"
                      >
                        ↑
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMoveImage(index, index + 1)
                        }}
                        className={styles.moveButton}
                        title="Mover hacia abajo"
                      >
                        ↓
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveImage(index)
                      }}
                      className={styles.removeButton}
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Información */}
      {images.length > 0 && (
        <div className={styles.info}>
          <p>
            {images.length} {images.length === 1 ? 'imagen' : 'imágenes'} agregada{images.length === 1 ? '' : 's'}
            {images.length > 0 && images[0]?.startsWith('data:') && (
              <span className={styles.warning}>
                {' • '}Las imágenes se guardan temporalmente. Para producción, configura Cloudinary o un servicio de almacenamiento.
              </span>
            )}
          </p>
          {images.length > 1 && (
            <p className={styles.reorderHint}>
              Arrastra las miniaturas para reordenar. La primera imagen se usa como portada.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
