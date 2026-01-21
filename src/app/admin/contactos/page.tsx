'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import Modal from '@/components/Modal'
import InquirySearch from '@/components/admin/InquirySearch'
import Pagination from '@/components/admin/Pagination'
import TagsManager from '@/components/admin/TagsManager'
import AssigneeSelector from '@/components/admin/AssigneeSelector'
import ChangeHistory from '@/components/admin/ChangeHistory'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStatCard from '@/components/admin/AdminStatCard'
import { logStatusChange } from '@/lib/audit'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye, Trash2, Mail, MessageCircle, History } from 'lucide-react'

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
  tags?: string[]
  assigned_to?: string | null
}

const statusVariants: Record<string, string> = {
  nueva: 'bg-amber-100 text-amber-800',
  leida: 'bg-blue-100 text-blue-800',
  contactada: 'bg-green-100 text-green-800',
  cerrada: 'bg-gray-100 text-gray-700',
}

const statusLabels: Record<string, string> = {
  nueva: 'Nueva',
  leida: 'Leída',
  contactada: 'Contactada',
  cerrada: 'Cerrada',
}

const serviceLabels: Record<string, string> = {
  venta: 'Venta de Propiedades',
  alquiler: 'Alquileres',
  remate: 'Remates Judiciales',
  jubilacion: 'Jubilaciones',
  tasacion: 'Tasaciones',
  asesoria: 'Asesoramiento Legal',
  otro: 'Otro',
}

export default function ContactosPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('todas')
  const [filterService, setFilterService] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [notes, setNotes] = useState('')
  const { success, error: showError } = useToast()
  const { user } = useAuth()

  const loadInquiries = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        showError('Error al cargar los contactos')
        return
      }

      setInquiries(data || [])
    } catch {
      showError('Error al cargar los contactos')
    } finally {
      setIsLoading(false)
    }
  }, [showError])

  const filteredInquiries = useMemo(() => {
    let filtered = [...inquiries]

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(inq =>
        inq.customer_name.toLowerCase().includes(searchLower) ||
        inq.customer_email.toLowerCase().includes(searchLower) ||
        inq.customer_phone.toLowerCase().includes(searchLower) ||
        inq.message.toLowerCase().includes(searchLower) ||
        inq.service.toLowerCase().includes(searchLower)
      )
    }

    if (filterStatus !== 'todas') {
      filtered = filtered.filter(inq => inq.status === filterStatus)
    }

    if (filterService !== 'todos') {
      filtered = filtered.filter(inq => inq.service === filterService)
    }

    return filtered
  }, [inquiries, searchTerm, filterStatus, filterService])

  useEffect(() => {
    void loadInquiries()
  }, [loadInquiries])

  const hasActiveFilters = useMemo(() => {
    return searchTerm.trim() !== '' || filterStatus !== 'todas' || filterService !== 'todos'
  }, [searchTerm, filterStatus, filterService])

  const clearFilters = () => {
    setSearchTerm('')
    setFilterStatus('todas')
    setFilterService('todos')
  }

  const updateStatus = async (id: string, newStatus: ContactInquiry['status']) => {
    const inquiry = inquiries.find(i => i.id === id)
    const oldStatus = inquiry?.status || 'nueva'

    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        showError('Error al actualizar el estado')
        return
      }

      await logStatusChange('contact_inquiry', id, oldStatus, newStatus, user || undefined)
      success('Estado actualizado correctamente')
      loadInquiries()
    } catch {
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
        showError('Error al guardar las notas')
        return
      }

      success('Notas guardadas correctamente')
      loadInquiries()
      setShowDetailModal(false)
    } catch {
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
        showError('Error al eliminar el contacto')
        return
      }

      success('Contacto eliminado correctamente')
      loadInquiries()
    } catch {
      showError('Error al eliminar el contacto')
    }
  }

  const openDetailModal = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry)
    setNotes(inquiry.notes || '')
    setShowDetailModal(true)

    if (inquiry.status === 'nueva') {
      updateStatus(inquiry.id, 'leida')
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

  const stats = useMemo(() => ({
    total: inquiries.length,
    nuevas: inquiries.filter(i => i.status === 'nueva').length,
    leidas: inquiries.filter(i => i.status === 'leida').length,
    contactadas: inquiries.filter(i => i.status === 'contactada').length,
    cerradas: inquiries.filter(i => i.status === 'cerrada').length,
  }), [inquiries])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c5f7d] mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando contactos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6 md:p-8">
      <AdminPageHeader
        title="Contactos Generales"
        subtitle="Gestiona las consultas generales recibidas del formulario de contacto"
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <AdminStatCard icon={<span className="text-2xl">📊</span>} iconBgColor="bg-blue-50" title="Total" value={stats.total} />
        <AdminStatCard icon={<span className="text-2xl">🔔</span>} iconBgColor="bg-amber-50" title="Nuevas" value={stats.nuevas} />
        <AdminStatCard icon={<span className="text-2xl">👁️</span>} iconBgColor="bg-sky-50" title="Leídas" value={stats.leidas} />
        <AdminStatCard icon={<span className="text-2xl">📞</span>} iconBgColor="bg-green-50" title="Contactadas" value={stats.contactadas} />
        <AdminStatCard icon={<span className="text-2xl">✅</span>} iconBgColor="bg-gray-100" title="Cerradas" value={stats.cerradas} />
      </div>

      {/* Búsqueda */}
      <InquirySearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterService={filterService}
        onServiceChange={setFilterService}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        type="contactos"
      />

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['todas', 'nueva', 'leida', 'contactada', 'cerrada'].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(status)}
            className={cn(filterStatus === status && 'bg-[#2c5f7d] hover:bg-[#1a4158]')}
          >
            {status === 'todas' ? 'Todas' : statusLabels[status]} (
            {status === 'todas' ? stats.total : stats[status === 'leida' ? 'leidas' : status === 'nueva' ? 'nuevas' : status === 'contactada' ? 'contactadas' : 'cerradas']}
            )
          </Button>
        ))}
      </div>

      {/* Lista de contactos */}
      <Pagination
        items={filteredInquiries}
        itemsPerPage={20}
        render={(paginatedItems) => (
          <>
            {paginatedItems.length === 0 ? (
              <Card className="text-center p-12">
                <p className="text-4xl mb-4">📭</p>
                <p className="text-muted-foreground">No hay contactos con los filtros seleccionados</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {paginatedItems.map((inquiry) => (
                  <Card key={inquiry.id} className={cn('overflow-hidden transition-all hover:shadow-md', inquiry.status === 'nueva' && 'border-l-4 border-l-amber-500')}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-[#1a4158]">{inquiry.customer_name}</h3>
                            <Badge className={cn('font-medium', statusVariants[inquiry.status])}>{statusLabels[inquiry.status]}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">📋 {serviceLabels[inquiry.service] || inquiry.service}</p>
                          <p className="text-xs text-muted-foreground">📅 {formatDate(inquiry.created_at)}</p>
                        </div>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                          <span>📧 {inquiry.customer_email}</span>
                          <span>📱 {inquiry.customer_phone}</span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Mensaje:</p>
                        <p className="text-sm">{inquiry.message}</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t">
                        <Button variant="outline" size="sm" onClick={() => openDetailModal(inquiry)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </Button>

                        <div className="flex items-center gap-2">
                          <Select value={inquiry.status} onValueChange={(value) => updateStatus(inquiry.id, value as ContactInquiry['status'])}>
                            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nueva">Nueva</SelectItem>
                              <SelectItem value="leida">Leída</SelectItem>
                              <SelectItem value="contactada">Contactada</SelectItem>
                              <SelectItem value="cerrada">Cerrada</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button variant="outline" size="icon" asChild className="text-green-600 border-green-200 hover:bg-green-50">
                            <a href={`https://wa.me/${inquiry.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${inquiry.customer_name}, te contacto sobre tu consulta de ${serviceLabels[inquiry.service] || inquiry.service}`)}`} target="_blank" rel="noopener noreferrer" title="Contactar por WhatsApp">
                              <MessageCircle className="h-4 w-4" />
                            </a>
                          </Button>

                          <Button variant="outline" size="icon" asChild className="text-blue-600 border-blue-200 hover:bg-blue-50">
                            <a href={`mailto:${inquiry.customer_email}?subject=${encodeURIComponent(`Consulta sobre ${serviceLabels[inquiry.service] || inquiry.service}`)}`} title="Enviar email">
                              <Mail className="h-4 w-4" />
                            </a>
                          </Button>

                          <Button variant="outline" size="icon" onClick={() => deleteInquiry(inquiry.id)} className="text-red-600 border-red-200 hover:bg-red-50" title="Eliminar contacto">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      />

      {/* Modal de detalles */}
      {showDetailModal && selectedInquiry && (
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Contacto de ${selectedInquiry.customer_name}`} type="alert" message="">
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-[#1a4158] mb-3">Información del Servicio</h3>
              <p className="text-sm"><strong>Servicio:</strong> {serviceLabels[selectedInquiry.service] || selectedInquiry.service}</p>
              <p className="text-sm"><strong>Fecha:</strong> {formatDate(selectedInquiry.created_at)}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-[#1a4158] mb-3">Información del Cliente</h3>
              <p className="text-sm"><strong>Nombre:</strong> {selectedInquiry.customer_name}</p>
              <p className="text-sm"><strong>Email:</strong> {selectedInquiry.customer_email}</p>
              <p className="text-sm"><strong>Teléfono:</strong> {selectedInquiry.customer_phone}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-[#1a4158] mb-3">Mensaje</h3>
              <p className="text-sm">{selectedInquiry.message}</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a4158] mb-3">Notas Internas</h3>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Agrega notas internas sobre este contacto..." rows={4} className="mb-3" />
              <Button onClick={saveNotes} size="sm">Guardar Notas</Button>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a4158] mb-3">Etiquetas</h3>
              <TagsManager entityType="contact_inquiry" entityId={selectedInquiry.id} currentTags={selectedInquiry.tags || []} onTagsChange={(tags) => { setSelectedInquiry({ ...selectedInquiry, tags }); loadInquiries() }} />
            </div>

            <AssigneeSelector entityType="contact_inquiry" entityId={selectedInquiry.id} currentAssigneeId={selectedInquiry.assigned_to || null} onAssigneeChange={(assigneeId) => { setSelectedInquiry({ ...selectedInquiry, assigned_to: assigneeId }); loadInquiries() }} />

            <Button variant="outline" onClick={() => setShowHistoryModal(true)} className="w-full">
              <History className="h-4 w-4 mr-2" />
              Ver Historial de Cambios
            </Button>
          </div>
        </Modal>
      )}

      {/* Modal de historial */}
      {showHistoryModal && selectedInquiry && (
        <Modal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} title="Historial de Cambios" type="alert" message="">
          <ChangeHistory entityType="contact_inquiry" entityId={selectedInquiry.id} />
        </Modal>
      )}
    </div>
  )
}
