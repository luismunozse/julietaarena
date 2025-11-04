'use client'

import { useEffect, useRef } from 'react'
import styles from './PropertyLocationMap.module.css'

interface PropertyLocationMapProps {
  latitude: number
  longitude: number
  propertyTitle: string
}

export default function PropertyLocationMap({ latitude, longitude, propertyTitle }: PropertyLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current || !window.google) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom: 15,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    })

    new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      title: propertyTitle,
    })
  }, [latitude, longitude, propertyTitle])

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} className={styles.map} />
    </div>
  )
}



