'use client'

import { useState, useEffect } from 'react'
import { Appointment, AppointmentFormData } from '@/types/appointment'

const APPOINTMENTS_KEY = 'julieta-arena-appointments'

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    // Cargar citas del localStorage
    const stored = localStorage.getItem(APPOINTMENTS_KEY)
    if (stored) {
      try {
        setAppointments(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading appointments:', error)
      }
    }
  }, [])

  const saveAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments)
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(newAppointments))
  }

  const createAppointment = (formData: AppointmentFormData): Appointment => {
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      propertyId: formData.propertyId,
      propertyTitle: '', // Se llenará desde la propiedad
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      date: formData.date,
      time: formData.time,
      duration: 60, // 1 hora por defecto
      status: 'pending',
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedAppointments = [...appointments, newAppointment]
    saveAppointments(updatedAppointments)
    return newAppointment
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === id 
        ? { ...apt, ...updates, updatedAt: new Date().toISOString() }
        : apt
    )
    saveAppointments(updatedAppointments)
  }

  const cancelAppointment = (id: string) => {
    updateAppointment(id, { status: 'cancelled' })
  }

  const confirmAppointment = (id: string) => {
    updateAppointment(id, { status: 'confirmed' })
  }

  const completeAppointment = (id: string) => {
    updateAppointment(id, { status: 'completed' })
  }

  const deleteAppointment = (id: string) => {
    const updatedAppointments = appointments.filter(apt => apt.id !== id)
    saveAppointments(updatedAppointments)
  }

  const getAppointmentsByProperty = (propertyId: string) => {
    return appointments.filter(apt => apt.propertyId === propertyId)
  }

  const getAppointmentsByDate = (date: string) => {
    return appointments.filter(apt => apt.date === date)
  }

  const getUpcomingAppointments = () => {
    const now = new Date()
    return appointments
      .filter(apt => new Date(apt.date) >= now && apt.status !== 'cancelled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const isTimeSlotAvailable = (date: string, time: string): boolean => {
    const conflictingAppointment = appointments.find(apt => 
      apt.date === date && 
      apt.time === time && 
      apt.status !== 'cancelled'
    )
    return !conflictingAppointment
  }

  return {
    appointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    confirmAppointment,
    completeAppointment,
    deleteAppointment,
    getAppointmentsByProperty,
    getAppointmentsByDate,
    getUpcomingAppointments,
    isTimeSlotAvailable
  }
}
