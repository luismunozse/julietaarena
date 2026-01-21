'use client'

import { useState } from 'react'
import { useFavorites } from '@/hooks/useFavorites'
import { useToast } from '@/components/ToastContainer'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  propertyId: string
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
}

export default function FavoriteButton({
  propertyId,
  size = 'medium',
  showText = false
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { success, info } = useToast()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const wasFavorite = isFavorite(propertyId)

    setIsAnimating(true)
    toggleFavorite(propertyId)

    if (wasFavorite) {
      info('Propiedad removida de favoritos', 3000)
    } else {
      success('¡Propiedad agregada a favoritos!', 3000)
    }

    setTimeout(() => setIsAnimating(false), 300)
  }

  const favorite = isFavorite(propertyId)

  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-9 w-9',
    large: 'h-10 w-10'
  }

  const iconSizes = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6'
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        "rounded-full bg-white/90 hover:bg-white shadow-sm transition-all",
        sizeClasses[size],
        isAnimating && "scale-110",
        favorite && "bg-primary hover:bg-primary/90"
      )}
      onClick={handleClick}
      aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-colors",
          favorite ? "fill-white text-white" : "text-gray-600"
        )}
      />
      {showText && (
        <span className="ml-2 text-sm hidden sm:inline">
          {favorite ? 'En Favoritos' : 'Favoritos'}
        </span>
      )}
    </Button>
  )
}
