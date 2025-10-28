import VenderForm from '../../components/VenderForm'
import styles from './page.module.css'

export const metadata = {
  title: 'Vendé tu Propiedad | Julieta Arena - Martillera Pública',
  description: 'Completá el formulario y nos pondremos en contacto con vos para continuar con el proceso de venta.',
  keywords: 'vender propiedad Córdoba, tasar propiedad, martillera pública',
}

export default function VenderPage() {
  return (
    <main className={styles.venderPage}>
      <VenderForm />
    </main>
  )
}

