import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Guía Completa para Comprar tu Primera Casa - Julieta Arena',
  description: 'Descubre todo lo que necesitas saber para comprar tu primera casa: financiamiento, documentación, proceso legal y consejos profesionales.',
  keywords: 'comprar casa, primera vivienda, financiamiento hipotecario, proceso legal, Julieta Arena',
  openGraph: {
    title: 'Guía Completa para Comprar tu Primera Casa',
    description: 'Descubre todo lo que necesitas saber para comprar tu primera casa: financiamiento, documentación, proceso legal y consejos profesionales.',
    type: 'article',
  },
}

export default function GuiaCompraCasaPage() {
  return (
    <main className={styles.pageContainer}>
      <div className="container">
        <div className={styles.articleHeader}>
          <div className={styles.breadcrumb}>
            <Link href="/blog">Blog</Link> / <span>Guía para Comprar tu Primera Casa</span>
          </div>
          
          <div className={styles.articleMeta}>
            <span className={styles.category}>Consejos Legales</span>
            <span className={styles.readTime}>8 min lectura</span>
            <span className={styles.date}>15 de Diciembre, 2024</span>
          </div>
          
          <h1 className={styles.articleTitle}>
            Guía Completa para Comprar tu Primera Casa
          </h1>
          
          <p className={styles.articleExcerpt}>
            Comprar tu primera casa es uno de los pasos más importantes en la vida. 
            Te guiamos paso a paso para que tomes la mejor decisión.
          </p>
          
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}>
              <Image
                src="/images/perfil.jpeg"
                alt="Julieta Arena"
                width={50}
                height={50}
                className={styles.avatar}
              />
            </div>
            <div className={styles.authorDetails}>
              <h4>Julieta Arena</h4>
              <p>Martillera Pública</p>
            </div>
          </div>
        </div>

        <div className={styles.articleImage}>
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop"
            alt="Casa familiar moderna"
            width={800}
            height={400}
            className={styles.image}
          />
        </div>

        <article className={styles.articleContent}>
          <h2>1. Evaluación de tu Situación Financiera</h2>
          <p>
            Antes de comenzar a buscar una casa, es fundamental que evalúes tu situación financiera actual. 
            Esto incluye analizar tus ingresos, gastos, ahorros y deudas existentes.
          </p>
          
          <h3>Puntos clave a considerar:</h3>
          <ul>
            <li><strong>Ingresos estables:</strong> Asegúrate de tener una fuente de ingresos confiable</li>
            <li><strong>Capacidad de ahorro:</strong> Debes poder ahorrar al menos el 20% del valor de la propiedad</li>
            <li><strong>Historial crediticio:</strong> Un buen historial te ayudará a obtener mejores tasas de interés</li>
            <li><strong>Gastos mensuales:</strong> No destines más del 30% de tus ingresos al pago de la hipoteca</li>
          </ul>

          <h2>2. Búsqueda y Selección de la Propiedad</h2>
          <p>
            Una vez que tengas clara tu situación financiera, es momento de comenzar la búsqueda. 
            Define tus prioridades: ubicación, tamaño, características específicas y presupuesto máximo.
          </p>

          <div className={styles.tipBox}>
            <h4>💡 Consejo Profesional</h4>
            <p>
              Siempre visita la propiedad en diferentes horarios y días de la semana para evaluar 
              el ruido, tráfico y ambiente del vecindario.
            </p>
          </div>

          <h2>3. Proceso Legal y Documentación</h2>
          <p>
            El proceso legal es crucial para proteger tu inversión. Como martillera pública, 
            te recomiendo seguir estos pasos:
          </p>

          <ol>
            <li><strong>Verificación de títulos:</strong> Asegúrate de que el vendedor tenga la propiedad libre de gravámenes</li>
            <li><strong>Inspección técnica:</strong> Contrata un profesional para evaluar el estado de la construcción</li>
            <li><strong>Escrituración:</strong> El proceso de transferencia debe realizarse ante escribano público</li>
            <li><strong>Registro de la propiedad:</strong> Actualización en el registro inmobiliario</li>
          </ol>

          <h2>4. Financiamiento y Hipoteca</h2>
          <p>
            Existen varias opciones de financiamiento disponibles. Es importante comparar 
            diferentes entidades financieras y sus condiciones.
          </p>

          <h3>Tipos de financiamiento:</h3>
          <ul>
            <li><strong>Hipoteca tradicional:</strong> Préstamo a largo plazo con garantía hipotecaria</li>
            <li><strong>Procrear:</strong> Programa del gobierno para vivienda familiar</li>
            <li><strong>Fideicomiso:</strong> Alternativa para aquellos que no califican para hipoteca tradicional</li>
          </ul>

          <h2>5. Costos Adicionales a Considerar</h2>
          <p>
            Además del precio de la propiedad, debes considerar varios costos adicionales:
          </p>

          <div className={styles.costsTable}>
            <div className={styles.costItem}>
              <span>Escrituración</span>
              <span>2-3% del valor</span>
            </div>
            <div className={styles.costItem}>
              <span>Impuestos de sellos</span>
              <span>1-2% del valor</span>
            </div>
            <div className={styles.costItem}>
              <span>Registro de la propiedad</span>
              <span>$50.000 - $100.000</span>
            </div>
            <div className={styles.costItem}>
              <span>Seguro de título</span>
              <span>$30.000 - $60.000</span>
            </div>
            <div className={styles.costItem}>
              <span>Inspección técnica</span>
              <span>$80.000 - $150.000</span>
            </div>
          </div>

          <h2>Conclusión</h2>
          <p>
            Comprar tu primera casa es un proceso que requiere paciencia, investigación y asesoramiento profesional. 
            No dudes en consultar con profesionales del sector para tomar la mejor decisión.
          </p>

          <div className={styles.ctaBox}>
            <h3>¿Necesitas asesoramiento profesional?</h3>
            <p>Como martillera pública, puedo ayudarte en todo el proceso de compra de tu vivienda.</p>
            <Link href="/#contacto" className="btn btn-primary">
              Consultar Ahora
            </Link>
          </div>
        </article>

        <div className={styles.articleFooter}>
          <div className={styles.tags}>
            <span className={styles.tagLabel}>Etiquetas:</span>
            <span className={styles.tag}>#primera-casa</span>
            <span className={styles.tag}>#financiamiento</span>
            <span className={styles.tag}>#consejos-legales</span>
            <span className={styles.tag}>#proceso-legal</span>
          </div>
          
          <div className={styles.shareButtons}>
            <span>Compartir:</span>
            <button className={styles.shareBtn}>Facebook</button>
            <button className={styles.shareBtn}>Twitter</button>
            <button className={styles.shareBtn}>LinkedIn</button>
            <button className={styles.shareBtn}>WhatsApp</button>
          </div>
        </div>

        <div className={styles.relatedPosts}>
          <h3>Artículos Relacionados</h3>
          <div className={styles.relatedGrid}>
            <div className={styles.relatedPost}>
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop"
                alt="Financiamiento hipotecario"
                width={300}
                height={200}
                className={styles.relatedImage}
              />
              <h4>Guía de Financiamiento Hipotecario</h4>
              <p>Todo lo que necesitas saber sobre préstamos hipotecarios</p>
            </div>
            <div className={styles.relatedPost}>
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop"
                alt="Documentación necesaria"
                width={300}
                height={200}
                className={styles.relatedImage}
              />
              <h4>Documentación Necesaria para Comprar</h4>
              <p>Lista completa de documentos requeridos</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
