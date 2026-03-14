'use client'

import { useState, useRef, useCallback, type DragEvent } from 'react'
import Image from 'next/image'
import { uploadPropertyImage, deletePropertyImage, getPublicImageUrl } from '@/lib/storage'
import { Upload, X, ArrowUp, ArrowDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
      console.error('Error inesperado al subir imagen:', err)
      setError('Error al procesar la imagen')
      return null
    }
  }, [propertyId])

  const validateFile = useCallback((file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Solo se permiten archivos de imagen'
    }

    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSizeMB) {
      return `El archivo es demasiado grande. Maximo ${maxSizeMB}MB`
    }

    return null
  }, [maxSizeMB])

  const processFiles = useCallback(async (files: FileList) => {
    setError(null)
    setUploading(true)

    try {
      const validFiles: File[] = []
      const errors: string[] = []

      if (images.length + files.length > maxImages) {
        setError(`Maximo ${maxImages} imagenes permitidas`)
        setUploading(false)
        return
      }

      Array.from(files).forEach(file => {
        const validationError = validateFile(file)
        if (validationError) {
          errors.push(`${file.name}: ${validationError}`)
        } else {
          validFiles.push(file)
        }
      })

      if (errors.length > 0) {
        setError(errors.join(', '))
      }

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
            console.error('Error procesando imagen:', err)
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
      console.error('Error procesando imagenes:', err)
      setError('Error al procesar las imagenes')
    } finally {
      setUploading(false)
    }
  }, [images, maxImages, onImagesChange, uploadImageFile, validateFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [processFiles])

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
    <div className="space-y-4">
      {/* Zona de subida */}
      <div
        ref={dropZoneRef}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
          isDragging
            ? 'border-slate-500 bg-slate-50'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50',
          uploading && 'pointer-events-none opacity-70'
        )}
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
          className="sr-only"
          disabled={uploading || images.length >= maxImages}
        />

        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 text-slate-400 animate-spin" />
              <p className="text-slate-600 font-medium">Subiendo imagenes...</p>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Upload className="h-6 w-6 text-slate-500" />
              </div>
              <div>
                <p className="text-slate-700 font-medium">
                  Haz clic o arrastra imagenes aqui
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Maximo {maxImages} imagenes - {maxSizeMB}MB por imagen
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Formatos: JPG, PNG, WebP
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Opcion alternativa: URL */}
      <details className="text-sm">
        <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
          O agregar desde URL
        </summary>
        <div className="mt-3 flex gap-2">
          <input
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const input = e.currentTarget as HTMLInputElement
                const url = input.value.trim()
                if (url && !images.includes(url)) {
                  if (images.length >= maxImages) {
                    setError(`Maximo ${maxImages} imagenes permitidas`)
                  } else {
                    onImagesChange([...images, url])
                    input.value = ''
                    setError(null)
                  }
                }
              }
            }}
          />
          <span className="text-xs text-slate-400 self-center">Presiona Enter</span>
        </div>
      </details>

      {/* Mensaje de error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Vista previa de imagenes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                'relative aspect-square rounded-lg overflow-hidden border-2 cursor-grab group',
                draggingIndex === index
                  ? 'opacity-50 border-slate-400'
                  : dragOverIndex === index && draggingIndex !== index
                  ? 'border-slate-500 ring-2 ring-slate-300'
                  : 'border-slate-200 hover:border-slate-300'
              )}
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
                className="object-cover"
                unoptimized
                onError={() => setBrokenPreviews((prev) => ({ ...prev, [image]: true }))}
              />

              {/* Overlay con controles */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                {/* Numero de imagen */}
                <span className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-medium text-white">
                  {index + 1}
                </span>

                {/* Botones de accion */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMoveImage(index, index - 1)
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded bg-white/90 hover:bg-white text-slate-700 transition-colors"
                      title="Mover hacia arriba"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMoveImage(index, index + 1)
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded bg-white/90 hover:bg-white text-slate-700 transition-colors"
                      title="Mover hacia abajo"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage(index)
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded bg-red-500/90 hover:bg-red-500 text-white transition-colors"
                    title="Eliminar"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Badge de portada */}
              {index === 0 && (
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded">
                  Portada
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Informacion */}
      {images.length > 0 && (
        <div className="text-sm text-slate-500 space-y-1">
          <p>
            {images.length} {images.length === 1 ? 'imagen agregada' : 'imagenes agregadas'}
          </p>
          {images.length > 1 && (
            <p className="text-xs">
              Arrastra las miniaturas para reordenar. La primera imagen se usa como portada.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
