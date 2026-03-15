'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'

/* =============================================================================
   TYPES
============================================================================= */

interface NavLink {
  href: string
  label: string
  isAnchor?: boolean
}

/* =============================================================================
   CONSTANTS
============================================================================= */

const NAV_LINKS: NavLink[] = [
  { href: '#inicio', label: 'Inicio', isAnchor: true },
  { href: '#sobre-mi', label: 'Sobre Mí', isAnchor: true },
  { href: '/blog', label: 'Blog' },
  { href: '#contacto', label: 'Contacto', isAnchor: true },
]

const SERVICE_LINKS: NavLink[] = [
  { href: '/propiedades', label: 'Propiedades' },
  { href: '/asesoramiento-legal', label: 'Asesoramiento Legal' },
  { href: '/remates-judiciales', label: 'Remates Judiciales' },
  { href: '/tasaciones', label: 'Tasaciones' },
]

const SCROLL_THRESHOLD = 50

/* =============================================================================
   COMPONENT
============================================================================= */

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Scroll handler with throttle for performance
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleAnchorClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)

    if (pathname === '/') {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push(`/${href}`)
    }
  }, [pathname, router])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Check if we're on a page that needs solid header
  const needsSolidHeader = pathname !== '/'

  // Dynamic classes based on scroll state
  const headerClasses = `
    fixed inset-x-0 top-0 z-[9999]
    transition-all duration-300 ease-out
    ${isScrolled || needsSolidHeader || isMobileMenuOpen
      ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
      : 'bg-transparent py-5'
    }
  `

  const linkClasses = `
    text-sm font-medium transition-colors duration-200
    ${isScrolled || needsSolidHeader || isMobileMenuOpen
      ? 'text-foreground hover:text-brand-secondary'
      : 'text-white hover:text-brand-secondary'
    }
  `

  return (
    <header className={headerClasses}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group relative z-10"
            aria-label="Julieta Arena - Inicio"
          >
            <span className={`
              block text-xl font-bold transition-colors duration-200
              ${isScrolled || needsSolidHeader || isMobileMenuOpen
                ? 'text-brand-primary group-hover:text-brand-secondary'
                : 'text-white group-hover:text-brand-secondary'
              }
            `}>
              Julieta Arena
            </span>
            <span className={`
              block text-xs transition-colors duration-200 -mt-0.5
              ${isScrolled || needsSolidHeader || isMobileMenuOpen ? 'text-muted' : 'text-white/70'}
            `}>
              Martillera Pública
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* First link */}
            <a
              href={NAV_LINKS[0].href}
              onClick={(e) => handleAnchorClick(e, NAV_LINKS[0].href)}
              className={`${linkClasses} px-4 py-2 rounded-lg hover:bg-black/5`}
            >
              {NAV_LINKS[0].label}
            </a>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                className={`${linkClasses} px-4 py-2 rounded-lg hover:bg-black/5 flex items-center gap-1`}
                aria-expanded={isServicesOpen}
                aria-haspopup="true"
              >
                Servicios
                <ChevronDown className={`
                  w-4 h-4 transition-transform duration-200
                  ${isServicesOpen ? 'rotate-180' : ''}
                `} />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`
                  absolute top-full left-0 mt-2 w-56
                  bg-white rounded-xl shadow-xl border border-border
                  transition-all duration-200 origin-top-left
                  ${isServicesOpen
                    ? 'opacity-100 scale-100 visible'
                    : 'opacity-0 scale-95 invisible'
                  }
                `}
                role="menu"
              >
                <div className="py-2">
                  {SERVICE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="
                        block px-4 py-2.5 text-sm text-foreground
                        hover:bg-surface hover:text-brand-primary
                        transition-colors duration-150
                      "
                      role="menuitem"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Remaining links */}
            {NAV_LINKS.slice(1).map((link) => (
              link.isAnchor ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className={`${linkClasses} px-4 py-2 rounded-lg hover:bg-black/5`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${linkClasses} px-4 py-2 rounded-lg hover:bg-black/5`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`
              md:hidden p-2 rounded-lg transition-colors duration-200
              ${isScrolled || needsSolidHeader || isMobileMenuOpen
                ? 'text-foreground hover:bg-surface'
                : 'text-white hover:bg-white/10'
              }
            `}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/40 md:hidden z-[10000]
          transition-opacity duration-300
          ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div
        className={`
          fixed inset-y-0 right-0 w-full max-w-sm
          bg-white shadow-2xl md:hidden z-[10001]
          transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Close button */}
        <button
          className="absolute top-5 right-4 p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
          onClick={closeMobileMenu}
          aria-label="Cerrar menú"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Mobile Navigation */}
        <nav className="pt-20 px-6">
          <ul className="space-y-1">
            <li>
              <a
                href="#inicio"
                onClick={(e) => handleAnchorClick(e, '#inicio')}
                className="block py-3 px-4 text-foreground font-medium rounded-lg hover:bg-surface transition-colors"
              >
                Inicio
              </a>
            </li>

            {/* Services Accordion */}
            <li>
              <button
                className="w-full flex items-center justify-between py-3 px-4 text-foreground font-medium rounded-lg hover:bg-surface transition-colors"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                aria-expanded={isServicesOpen}
              >
                Servicios
                <ChevronDown className={`
                  w-4 h-4 transition-transform duration-200
                  ${isServicesOpen ? 'rotate-180' : ''}
                `} />
              </button>

              <div className={`
                overflow-hidden transition-all duration-300
                ${isServicesOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}
              `}>
                <ul className="py-2 pl-4 space-y-1">
                  {SERVICE_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeMobileMenu}
                        className="block py-2 px-4 text-sm text-muted hover:text-brand-primary rounded-lg transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {NAV_LINKS.slice(1).map((link) => (
              <li key={link.href}>
                {link.isAnchor ? (
                  <a
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className="block py-3 px-4 text-foreground font-medium rounded-lg hover:bg-surface transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 text-foreground font-medium rounded-lg hover:bg-surface transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
