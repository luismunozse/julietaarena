'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // No mostrar Header/Footer en rutas de admin o login
  const isAdminOrAuthRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/login')

  if (isAdminOrAuthRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
