'use client'

import AnimatedElement from './AnimatedElement'
import { useFadeInUp, useFadeInLeft, useFadeInRight } from '@/hooks/useAnimation'
import styles from './Hero.module.css'

export default function Hero() {
  const titleRef = useFadeInUp({ trigger: 'onMount', delay: '0.2s' })
  const subtitleRef = useFadeInUp({ trigger: 'onMount', delay: '0.4s' })
  const descriptionRef = useFadeInUp({ trigger: 'onMount', delay: '0.6s' })
  const buttonsRef = useFadeInUp({ trigger: 'onMount', delay: '0.8s' })

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
        <AnimatedElement
          ref={titleRef.elementRef}
          as="h1"
          className={styles.heroTitle}
          trigger="onMount"
          animation="fadeInUp"
          delay="0.2s"
        >
          Julieta Arena
        </AnimatedElement>
        
        <AnimatedElement
          ref={subtitleRef.elementRef}
          as="p"
          className={styles.heroSubtitle}
          trigger="onMount"
          animation="fadeInUp"
          delay="0.4s"
        >
          Martillera Pública Matriculada
        </AnimatedElement>
        
        <AnimatedElement
          ref={descriptionRef.elementRef}
          as="p"
          className={styles.heroDescription}
          trigger="onMount"
          animation="fadeInUp"
          delay="0.6s"
        >
          Servicios profesionales de bienes raíces en Córdoba, Argentina.<br />
          Comprometida con la excelencia y la transparencia en cada transacción.
        </AnimatedElement>
        
        <AnimatedElement
          ref={buttonsRef.elementRef}
          className={styles.heroButtons}
          trigger="onMount"
          animation="fadeInUp"
          delay="0.8s"
        >
          <a href="#servicios" className="btn btn-primary" onClick={(e) => handleScroll(e, '#servicios')}>
            Ver Servicios
          </a>
          <a href="#contacto" className="btn btn-secondary" onClick={(e) => handleScroll(e, '#contacto')}>
            Contactar
          </a>
        </AnimatedElement>
      </div>
      <div className={styles.heroScroll}>
        <a href="#servicios" onClick={(e) => handleScroll(e, '#servicios')}>
          <span>Scroll</span>
        </a>
      </div>
    </section>
  )
}

