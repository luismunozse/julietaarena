'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import Modal from '@/components/Modal'
import styles from './page.module.css'

interface ContactInquiry {
  id: string
  created_at: string
  customer_name: string
  customer_email: string
  customer_phone: string
  service: string
  message: string
  status: 'nueva' | 'leida' | 'contactada' | 'cerrada'
  notes: string | null
}

export default function ContactosPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [filteredInquiries, setFilteredInquiries] = useState<ContactInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('todas')
  const [filterService, setFilterService] = useState<string>('todos')
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [notes, setNotes] = useState('')
  const { success, error: showError } = useToast()

  const loadInquiries = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error al cargar contactos:', error)
        showError('Error al cargar los contactos')
        return
      }

      setInquiries(data || [])
    } catch (err) {
      console.error('Error:', err)
      showError('Error al cargar los contactos')
    } finally {
      setIsLoading(false)
    }
  }, [showError])

  const filterInquiries = useCallback(() => {
    let filtered = inquiries

    if (filterStatus !== 'todas') {
      filtered = filtered.filter(inq => inq.status === filterStatus)
    }

    if (filterService !== 'todos') {
      filtered = filtered.filter(inq => inq.service === filterService)
    }

    setFilteredInquiries(filtered)
  }, [filterService, filterStatus, inquiries])

  useEffect(() => {
    void loadInquiries()
  }, [loadInquiries])

  useEffect(() => {
    filterInquiries()
  }, [filterInquiries])

  const updateStatus = async (id: string, newStatus: ContactInquiry['status']) => {
    try {
      const { error } = await supabase
        .from('contact_inquiries')
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
        .from('contact_inquiries')
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
    if (!confirm('¿Estás seguro de que deseas eliminar este contacto?')) return

    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error al eliminar contacto:', error)
        showError('Error al eliminar el contacto')
        return
      }

      success('Contacto eliminado correctamente')
      loadInquiries()
    } catch (err) {
      console.error('Error:', err)
      showError('Error al eliminar el contacto')
    }
  }

  const openDetailModal = (inquiry: ContactInquiry) => {
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

  const getServiceLabel = (service: string) => {
    const labels: { [key: string]: string } = {
      'venta': 'Venta de Propiedades',
      'alquiler': 'Alquileres',
      'remate': 'Remates Judiciales',
      'jubilacion': 'Jubilaciones',
      'tasacion': 'Tasaciones',
      'asesoria': 'Asesoramiento Legal',
      'otro': 'Otro'
    }
    return labels[service] || service
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
          <p>Cargando contactos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Contactos Generales</h1>
          <p className={styles.subtitle}>Gestiona las consultas generales recibidas del formulario de contacto</p>
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
      <div className={styles.filtersContainer}>
        <div className={styles.filters}>
          <p className={styles.filterLabel}>Estado:</p>
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

        <div className={styles.filters}>
          <p className={styles.filterLabel}>Servicio:</p>
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="todos">Todos los servicios</option>
            <option value="venta">Venta de Propiedades</option>
            <option value="alquiler">Alquileres</option>
            <option value="remate">Remates Judiciales</option>
            <option value="jubilacion">Jubilaciones</option>
            <option value="tasacion">Tasaciones</option>
            <option value="asesoria">Asesoramiento Legal</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>

      {/* Lista de contactos */}
      {filteredInquiries.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>📭</p>
          <p className={styles.emptyText}>No hay contactos con los filtros seleccionados</p>
        </div>
      ) : (
        <div className={styles.inquiriesList}>
          {filteredInquiries.map((inquiry) => (
            <div key={inquiry.id} className={`${styles.inquiryCard} ${inquiry.status === 'nueva' ? styles.unread : ''}`}>
              <div className={styles.inquiryHeader}>
                <div className={styles.inquiryInfo}>
                  <h3 className={styles.inquiryTitle}>{inquiry.customer_name}</h3>
                  <p className={styles.inquiryService}>
                    📋 {getServiceLabel(inquiry.service)}
                  </p>
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

              <div className={styles.inquiryMessage}>
                <p className={styles.messageLabel}>Mensaje:</p>
                <p className={styles.messageText}>{inquiry.message}</p>
              </div>

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
                    onChange={(e) => updateStatus(inquiry.id, e.target.value as ContactInquiry['status'])}
                    className={styles.statusSelect}
                  >
                    <option value="nueva">Nueva</option>
                    <option value="leida">Leída</option>
                    <option value="contactada">Contactada</option>
                    <option value="cerrada">Cerrada</option>
                  </select>

                  <a
                    href={`https://wa.me/${inquiry.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${inquiry.customer_name}, te contacto sobre tu consulta de ${getServiceLabel(inquiry.service)}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                    title="Contactar por WhatsApp"
                  >
                    💬
                  </a>

                  <a
                    href={`mailto:${inquiry.customer_email}?subject=${encodeURIComponent(`Consulta sobre ${getServiceLabel(inquiry.service)}`)}`}
                    className={styles.emailBtn}
                    title="Enviar email"
                  >
                    ✉️
                  </a>

                  <button
                    onClick={() => deleteInquiry(inquiry.id)}
                    className={styles.deleteBtn}
                    title="Eliminar contacto"
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
          title={`Contacto de ${selectedInquiry.customer_name}`}
          type="alert"
          message=""
        >
          <div className={styles.modalContent}>
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Información del Servicio</h3>
              <p><strong>Servicio:</strong> {getServiceLabel(selectedInquiry.service)}</p>
              <p><strong>Fecha:</strong> {formatDate(selectedInquiry.created_at)}</p>
            </div>

            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Información del Cliente</h3>
              <p><strong>Nombre:</strong> {selectedInquiry.customer_name}</p>
              <p><strong>Email:</strong> {selectedInquiry.customer_email}</p>
              <p><strong>Teléfono:</strong> {selectedInquiry.customer_phone}</p>
            </div>

            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Mensaje</h3>
              <p className={styles.messageBox}>{selectedInquiry.message}</p>
            </div>

            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Notas Internas</h3>
              <textarea
                className={styles.notesTextarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agrega notas internas sobre este contacto..."
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
