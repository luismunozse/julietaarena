'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import MobileStickyBar from './MobileStickyBar'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isAdminOrAuthRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/login')

  if (isAdminOrAuthRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <MobileStickyBar />
    </>
  )
}
