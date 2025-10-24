'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <nav className={`${styles.nav} container`}>
        <Link href="/" className={styles.navLogo}>
          <h2>Julieta Arena</h2>
          <p className={styles.navSubtitle}>Martillera Pública</p>
        </Link>

        <div className={`${styles.navMenu} ${isMobileMenuOpen ? styles.active : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="#inicio" className={styles.navLink} onClick={(e) => handleNavClick(e, '#inicio')}>
                Inicio
              </a>
            </li>
            <li className={`${styles.navItem} ${styles.dropdownItem}`}>
              <a href="#servicios" className={styles.navLink} onClick={(e) => handleNavClick(e, '#servicios')}>
                Servicios
              </a>
              <div className={styles.dropdown}>
                <a href="/propiedades" className={styles.dropdownLink}>
                  Propiedades
                </a>
                <a href="/asesoramiento-legal" className={styles.dropdownLink}>
                  Asesoramiento Legal
                </a>
                <a href="/remates-judiciales" className={styles.dropdownLink}>
                  Remates Judiciales
                </a>
              </div>
            </li>
            <li className={styles.navItem}>
              <a href="#sobre-mi" className={styles.navLink} onClick={(e) => handleNavClick(e, '#sobre-mi')}>
                Sobre Mí
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="/blog" className={styles.navLink}>
                Blog
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#contacto" className={styles.navLink} onClick={(e) => handleNavClick(e, '#contacto')}>
                Contacto
              </a>
            </li>
          </ul>
        </div>

        <div 
          className={`${styles.navToggle} ${isMobileMenuOpen ? styles.active : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </header>
  )
}

