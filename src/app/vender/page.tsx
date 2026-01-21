import VenderForm from '@/components/VenderForm'

export const metadata = {
  title: 'Vendé tu Propiedad | Julieta Arena - Martillera Pública',
  description: 'Completá el formulario y nos pondremos en contacto con vos para continuar con el proceso de venta.',
  keywords: 'vender propiedad Córdoba, tasar propiedad, martillera pública',
}

export default function VenderPage() {
  return (
    <main className="pt-16">
      <VenderForm />
    </main>
  )
}
