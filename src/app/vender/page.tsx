import VenderForm from '@/components/VenderForm'
import PageBreadcrumb from '@/components/PageBreadcrumb'

export const metadata = {
  title: 'Vendé tu Propiedad | Julieta Arena - Martillera Pública',
  description: 'Completá el formulario y nos pondremos en contacto con vos para continuar con el proceso de venta.',
  keywords: 'vender propiedad Córdoba, tasar propiedad, martillera pública',
}

export default function VenderPage() {
  return (
    <main className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <PageBreadcrumb items={[{ label: 'Vender mi propiedad' }]} />
      </div>
      <VenderForm />
    </main>
  )
}
