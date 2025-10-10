'use client'

import styles from './Hero.module.css'

export default function Hero() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.heroOverlay}></div>
      <div className={`${styles.heroContent} container`}>
        <h1 className={styles.heroTitle}>Julieta Arena</h1>
        <p className={styles.heroSubtitle}>Martillera Pública Matriculada</p>
        <p className={styles.heroDescription}>
          Servicios profesionales de bienes raíces en Córdoba, Argentina.<br />
          Comprometida con la excelencia y la transparencia en cada transacción.
        </p>
        <div className={styles.heroButtons}>
          <a href="#servicios" className="btn btn-primary" onClick={(e) => handleScroll(e, '#servicios')}>
            Ver Servicios
          </a>
          <a href="#contacto" className="btn btn-secondary" onClick={(e) => handleScroll(e, '#contacto')}>
            Contactar
          </a>
        </div>
      </div>
      <div className={styles.heroScroll}>
        <a href="#servicios" onClick={(e) => handleScroll(e, '#servicios')}>
          <span>Scroll</span>
        </a>
      </div>
    </section>
  )
}

