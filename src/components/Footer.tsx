import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>Julieta Arena</h3>
            <p>Martillera Pública Matriculada</p>
            <p className={styles.footerLocation}>Córdoba, Argentina</p>
          </div>

          <div className={styles.footerSection}>
            <h4>Servicios</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#servicios">Venta de Propiedades</a></li>
              <li><a href="#servicios">Alquileres</a></li>
              <li><a href="#servicios">Remates Judiciales</a></li>
              <li><a href="#servicios">Jubilaciones</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Contacto</h4>
            <ul className={styles.footerLinks}>
              <li>+54 (351) 307-8376</li>
              <li>inmobiliaria72juliarena@gmail.com</li>
              <li>Lun - Vie: 9:00 - 18:00</li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Sígueme</h4>
            <div className={styles.socialLinks}>
              <a href="https://www.facebook.com/share/1FXrZSHSot/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/ajulietamarisel" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2025 Julieta Arena - Servicios Inmobiliarios. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

