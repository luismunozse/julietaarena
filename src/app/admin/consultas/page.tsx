'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import Modal from '@/components/Modal'
import styles from './page.module.css'

interface PropertyInquiry {
  id: string
  created_at: string
  property_id: string
  property_title: string
  property_price: string
  property_location: string
  customer_name: string
  customer_email: string
  customer_phone: string
  message: string
  status: 'nueva' | 'leida' | 'contactada' | 'cerrada'
  notes: string | null
}

export default function ConsultasPage() {
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([])
  const [filteredInquiries, setFilteredInquiries] = useState<PropertyInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('todas')
  const [selectedInquiry, setSelectedInquiry] = useState<PropertyInquiry | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [notes, setNotes] = useState('')
  const { success, error: showError } = useToast()

  const loadInquiries = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('property_inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error al cargar consultas:', error)
        showError('Error al cargar las consultas')
        return
      }

      setInquiries(data || [])
    } catch (err) {
      console.error('Error:', err)
      showError('Error al cargar las consultas')
    } finally {
      setIsLoading(false)
    }
  }, [showError])

  const filterInquiries = useCallback(() => {
    if (filterStatus === 'todas') {
      setFilteredInquiries(inquiries)
    } else {
      setFilteredInquiries(inquiries.filter(inq => inq.status === filterStatus))
    }
  }, [filterStatus, inquiries])

  useEffect(() => {
    void loadInquiries()
  }, [loadInquiries])

  useEffect(() => {
    filterInquiries()
  }, [filterInquiries])

  const updateStatus = async (id: string, newStatus: PropertyInquiry['status']) => {
    try {
      const { error } = await supabase
        .from('property_inquiries')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        console.error('Error al actualizar estado:', error)
        showError('Error al actualizar el estado')
        return
      }

      success('Estado actualizado correctamente')
      loadInquiries()
    } catch (err) {
      console.error('Error:', err)
      showError('Error al actualizar el estado')
    }
  }

  const saveNotes = async () => {
    if (!selectedInquiry) return

    try {
      const { error } = await supabase
        .from('property_inquiries')
        .update({ notes })
        .eq('id', selectedInquiry.id)

      if (error) {
        console.error('Error al guardar notas:', error)
        showError('Error al guardar las notas')
        return
      }

      success('Notas guardadas correctamente')
      loadInquiries()
      setShowDetailModal(false)
    } catch (err) {
      console.error('Error:', err)
      showError('Error al guardar las notas')
    }
  }

  const deleteInquiry = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta consulta?')) return

    try {
      const { error } = await supabase
        .from('property_inquiries')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error al eliminar consulta:', error)
        showError('Error al eliminar la consulta')
        return
      }

      success('Consulta eliminada correctamente')
      loadInquiries()
    } catch (err) {
      console.error('Error:', err)
      showError('Error al eliminar la consulta')
    }
  }

  const openDetailModal = (inquiry: PropertyInquiry) => {
    setSelectedInquiry(inquiry)
    setNotes(inquiry.notes || '')
    setShowDetailModal(true)

    // Marcar como leída si es nueva
    if (inquiry.status === 'nueva') {
      updateStatus(inquiry.id, 'leida')
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'nueva': return styles.statusNueva
      case 'leida': return styles.statusLeida
      case 'contactada': return styles.statusContactada
      case 'cerrada': return styles.statusCerrada
      default: return ''
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'nueva': return 'Nueva'
      case 'leida': return 'Leída'
      case 'contactada': return 'Contactada'
      case 'cerrada': return 'Cerrada'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = {
    total: inquiries.length,
    nuevas: inquiries.filter(i => i.status === 'nueva').length,
    leidas: inquiries.filter(i => i.status === 'leida').length,
    contactadas: inquiries.filter(i => i.status === 'contactada').length,
    cerradas: inquiries.filter(i => i.status === 'cerrada').length,
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando consultas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Consultas de Propiedades</h1>
          <p className={styles.subtitle}>Gestiona las consultas recibidas de clientes interesados</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total</p>
            <p className={styles.statValue}>{stats.total}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔔</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Nuevas</p>
            <p className={styles.statValue}>{stats.nuevas}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👁️</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Leídas</p>
            <p className={styles.statValue}>{stats.leidas}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📞</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Contactadas</p>
            <p className={styles.statValue}>{stats.contactadas}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Cerradas</p>
            <p className={styles.statValue}>{stats.cerradas}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filterStatus === 'todas' ? styles.active : ''}`}
          onClick={() => setFilterStatus('todas')}
        >
          Todas ({stats.total})
        </button>
        <button
          className={`${styles.filterBtn} ${filterStatus === 'nueva' ? styles.active : ''}`}
          onClick={() => setFilterStatus('nueva')}
        >
          Nuevas ({stats.nuevas})
        </button>
        <button
          className={`${styles.filterBtn} ${filterStatus === 'leida' ? styles.active : ''}`}
          onClick={() => setFilterStatus('leida')}
        >
          Leídas ({stats.leidas})
        </button>
        <button
          className={`${styles.filterBtn} ${filterStatus === 'contactada' ? styles.active : ''}`}
          onClick={() => setFilterStatus('contactada')}
        >
          Contactadas ({stats.contactadas})
        </button>
        <button
          className={`${styles.filterBtn} ${filterStatus === 'cerrada' ? styles.active : ''}`}
          onClick={() => setFilterStatus('cerrada')}
        >
          Cerradas ({stats.cerradas})
        </button>
      </div>

      {/* Lista de consultas */}
      {filteredInquiries.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>📭</p>
          <p className={styles.emptyText}>No hay consultas {filterStatus !== 'todas' ? `con estado "${getStatusLabel(filterStatus)}"` : ''}</p>
        </div>
      ) : (
        <div className={styles.inquiriesList}>
          {filteredInquiries.map((inquiry) => (
            <div key={inquiry.id} className={`${styles.inquiryCard} ${inquiry.status === 'nueva' ? styles.unread : ''}`}>
              <div className={styles.inquiryHeader}>
                <div className={styles.inquiryInfo}>
                  <h3 className={styles.inquiryTitle}>{inquiry.customer_name}</h3>
                  <p className={styles.inquiryProperty}>
                    🏠 {inquiry.property_title} - {inquiry.property_location}
                  </p>
                  <p className={styles.inquiryPrice}>💰 {inquiry.property_price}</p>
                  <p className={styles.inquiryDate}>📅 {formatDate(inquiry.created_at)}</p>
                </div>
                <div className={styles.inquiryActions}>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(inquiry.status)}`}>
                    {getStatusLabel(inquiry.status)}
                  </span>
                </div>
              </div>

              <div className={styles.inquiryContact}>
                <p className={styles.contactItem}>📧 {inquiry.customer_email}</p>
                <p className={styles.contactItem}>📱 {inquiry.customer_phone}</p>
              </div>

              {inquiry.message && (
                <div className={styles.inquiryMessage}>
                  <p className={styles.messageLabel}>Mensaje:</p>
                  <p className={styles.messageText}>{inquiry.message}</p>
                </div>
              )}

              <div className={styles.inquiryFooter}>
                <button
                  className={styles.viewBtn}
                  onClick={() => openDetailModal(inquiry)}
                >
                  Ver detalles
                </button>

                <div className={styles.quickActions}>
                  <select
                    value={inquiry.status}
                    onChange={(e) => updateStatus(inquiry.id, e.target.value as PropertyInquiry['status'])}
                    className={styles.statusSelect}
                  >
                    <option value="nueva">Nueva</option>
                    <option value="leida">Leída</option>
                    <option value="contactada">Contactada</option>
                    <option value="cerrada">Cerrada</option>
                  </select>

                  <a
                    href={`https://wa.me/${inquiry.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${inquiry.customer_name}, te contacto sobre ${inquiry.property_title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                    title="Contactar por WhatsApp"
                  >
                    💬
                  </a>

                  <a
                    href={`mailto:${inquiry.customer_email}?subject=${encodeURIComponent(`Consulta sobre ${inquiry.property_title}`)}`}
                    className={styles.emailBtn}
                    title="Enviar email"
                  >
                    ✉️
                  </a>

                  <button
                    onClick={() => deleteInquiry(inquiry.id)}
                    className={styles.deleteBtn}
                    title="Eliminar consulta"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {showDetailModal && selectedInquiry && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Consulta de ${selectedInquiry.customer_name}`}
          type="alert"
          message=""
        >
          <div className={styles.modalContent}>
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Información de la Propiedad</h3>
              <p><strong>Propiedad:</strong> {selectedInquiry.property_title}</p>
              <p><strong>Ubicación:</strong> {selectedInquiry.property_location}</p>
              <p><strong>Precio:</strong> {selectedInquiry.property_price}</p>
            </div>

            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Información del Cliente</h3>
              <p><strong>Nombre:</strong> {selectedInquiry.customer_name}</p>
              <p><strong>Email:</strong> {selectedInquiry.customer_email}</p>
              <p><strong>Teléfono:</strong> {selectedInquiry.customer_phone}</p>
              <p><strong>Fecha:</strong> {formatDate(selectedInquiry.created_at)}</p>
            </div>

            {selectedInquiry.message && (
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Mensaje</h3>
                <p className={styles.messageBox}>{selectedInquiry.message}</p>
              </div>
            )}

            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Notas Internas</h3>
              <textarea
                className={styles.notesTextarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agrega notas internas sobre esta consulta..."
                rows={4}
              />
              <button onClick={saveNotes} className={styles.saveNotesBtn}>
                Guardar Notas
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
