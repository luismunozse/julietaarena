export interface Appointment {
  id: string
  propertyId: string
  propertyTitle: string
  clientName: string
  clientEmail: string
  clientPhone: string
  date: string
  time: string
  duration: number // en minutos
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface TimeSlot {
  time: string
  available: boolean
  reason?: string
}

export interface AppointmentFormData {
  propertyId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  date: string
  time: string
  notes?: string
}
