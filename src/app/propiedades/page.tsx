import Properties from '@/components/Properties'
import PropertyMap from '@/components/PropertyMap'
import Recommendations from '@/components/Recommendations'
import { properties } from '@/data/properties'
import styles from './page.module.css'

export const metadata = {
  title: 'Propiedades en Venta y Alquiler | Julieta Arena - Martillera Pública',
  description: 'Explora nuestras propiedades disponibles en venta y alquiler en Córdoba. Casas, departamentos, terrenos, locales y oficinas con las mejores ubicaciones.',
  keywords: 'propiedades venta alquiler Córdoba, casas departamentos, inmobiliaria, martillera pública',
}

export default function PropiedadesPage() {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Propiedades en Venta y Alquiler</h1>
            <p className={styles.heroSubtitle}>
              Encuentra tu hogar ideal en las mejores ubicaciones de Córdoba
            </p>
          </div>
        </div>
      </div>

      <div className={styles.searchSection}>
        <Properties />
      </div>

      <PropertyMap />
      
      <Recommendations 
        properties={properties}
        title="Propiedades que podrían interesarte"
        showReasons={true}
        maxItems={6}
      />
    </main>
  )
}
