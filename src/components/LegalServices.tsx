'use client'

import { useState } from 'react'
import { legalServices, LegalService } from '@/data/legalServices'
import styles from './LegalServices.module.css'

export default function LegalServices() {
  const [selectedService, setSelectedService] = useState<LegalService | null>(null)

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Servicios Legales Especializados</h2>
          <p className="section-subtitle">
            Asesoramiento jurídico profesional en derecho argentino para resolver sus necesidades legales
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {legalServices.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.serviceHeader}>
                <div className={styles.serviceIcon}>
                  <span>{service.icon}</span>
                </div>
                <div className={styles.serviceInfo}>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDescription}>{service.description}</p>
                </div>
              </div>

              <div className={styles.serviceDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>⏱️ Duración:</span>
                  <span className={styles.detailValue}>{service.duration}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>💰 Costo:</span>
                  <span className={styles.detailValue}>{service.cost}</span>
                </div>
              </div>

              <div className={styles.serviceFeatures}>
                <h4>Características principales:</h4>
                <ul>
                  {service.features.slice(0, 3).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                  {service.features.length > 3 && (
                    <li className={styles.moreFeatures}>
                      +{service.features.length - 3} características más
                    </li>
                  )}
                </ul>
              </div>

              <div className={styles.serviceActions}>
                <button 
                  className={styles.infoBtn}
                  onClick={() => setSelectedService(service)}
                >
                  📋 Ver Detalles
                </button>
                <button className={styles.contactBtn}>
                  📞 Consultar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de detalles del servicio */}
        {selectedService && (
          <div className={styles.modalOverlay} onClick={() => setSelectedService(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalIcon}>
                  <span>{selectedService.icon}</span>
                </div>
                <div className={styles.modalTitle}>
                  <h2>{selectedService.title}</h2>
                  <p>{selectedService.description}</p>
                </div>
                <button 
                  className={styles.closeBtn}
                  onClick={() => setSelectedService(null)}
                >
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.modalSection}>
                  <h3>🔧 Características del Servicio</h3>
                  <ul className={styles.featureList}>
                    {selectedService.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.modalSection}>
                  <h3>📋 Requisitos Necesarios</h3>
                  <ul className={styles.requirementList}>
                    {selectedService.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.modalSection}>
                  <h3>📝 Proceso de Trabajo</h3>
                  <ol className={styles.processList}>
                    {selectedService.process.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className={styles.modalSection}>
                  <h3>📄 Documentación Requerida</h3>
                  <ul className={styles.documentList}>
                    {selectedService.documents.map((document, index) => (
                      <li key={index}>{document}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.modalSection}>
                  <h3>⚖️ Marco Legal</h3>
                  <ul className={styles.legalList}>
                    {selectedService.legalBasis.map((basis, index) => (
                      <li key={index}>{basis}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.modalSummary}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>⏱️ Duración estimada:</span>
                    <span className={styles.summaryValue}>{selectedService.duration}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>💰 Inversión:</span>
                    <span className={styles.summaryValue}>{selectedService.cost}</span>
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button className={styles.whatsappBtn}>
                  💬 Consultar por WhatsApp
                </button>
                <button className={styles.contactBtn}>
                  📞 Llamar Ahora
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
