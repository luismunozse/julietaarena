'use client'

import { memo, useMemo } from 'react'
import { Property } from '@/data/properties'
import PropertyCard from './PropertyCard'
import { cn } from '@/lib/utils'

// Importación condicional de react-window
let List: any = null
try {
  // Intentar importar react-window, si falla usar renderizado normal
  const reactWindow = require('react-window')
  List = reactWindow.FixedSizeList
} catch {
  // react-window no disponible o hay error, usar renderizado normal
  List = null
}

interface VirtualizedPropertyListProps {
  properties: Property[]
  height?: number
  itemHeight?: number
  className?: string
}

interface ListItemProps {
  index: number
  style: React.CSSProperties
  data: Property[]
}

// Componente para cada item de la lista virtualizada
const ListItem = memo(({ index, style, data }: ListItemProps) => {
  const property = data[index]

  if (!property) return null

  return (
    <div
      style={style}
      className={cn(
        'p-4 box-border',
        'md:p-4',
        'max-md:p-2'
      )}
    >
      <PropertyCard property={property} />
    </div>
  )
})

ListItem.displayName = 'ListItem'

/**
 * Componente que renderiza una lista virtualizada de propiedades
 * Solo se activa cuando hay más de 50 propiedades para optimizar performance
 */
function VirtualizedPropertyList({
  properties,
  height = 800,
  itemHeight = 400,
  className
}: VirtualizedPropertyListProps) {
  // Memoizar propiedades para evitar re-renders
  const memoizedProperties = useMemo(() => properties, [properties])

  // Solo usar virtualización si hay muchas propiedades Y react-window está disponible
  const shouldVirtualize = properties.length > 50 && List !== null

  if (!shouldVirtualize) {
    // Renderizar normalmente si hay pocas propiedades o react-window no está disponible
    return (
      <div
        className={cn(
          'grid grid-cols-1 gap-6 py-4',
          'md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:gap-8',
          className
        )}
      >
        {memoizedProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    )
  }

  // Usar virtualización para listas largas
  return (
    <div className={cn('w-full h-full', className)}>
      <List
        height={height}
        itemCount={memoizedProperties.length}
        itemSize={itemHeight}
        itemData={memoizedProperties}
        width="100%"
        overscanCount={5} // Renderizar 5 items extra fuera de la vista para scroll suave
      >
        {ListItem}
      </List>
    </div>
  )
}

export default memo(VirtualizedPropertyList)



