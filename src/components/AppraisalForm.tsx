'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import styles from './AppraisalForm.module.css'

interface AppraisalFormState {
  ownerName: string
  email: string
  phone: string
  preferredContact: 'whatsapp' | 'llamada' | 'email'
  propertyType: 'casa' | 'departamento' | 'terreno' | 'local' | 'campo' | 'otro'
  address: string
  neighborhood: string
  surface: string
  coveredSurface: string
  antique: string
  occupancy: 'propietario' | 'inquilino' | 'desocupado'
  improvements: string
  legalStatus: string
  purpose: 'venta' | 'alquiler' | 'herencia' | 'banco' | 'judicial' | 'otro'
  notes: string
}

const initialState: AppraisalFormState = {
  ownerName: '',
  email: '',
  phone: '',
  preferredContact: 'whatsapp',
  propertyType: 'casa',
  address: '',
  neighborhood: '',
  surface: '',
  coveredSurface: '',
  antique: '',
  occupancy: 'propietario',
  improvements: '',
  legalStatus: '',
  purpose: 'venta',
  notes: '',
}

export default function AppraisalForm() {
  const [form, setForm] = useState<AppraisalFormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error } = useToast()

  const handleChange = (field: keyof AppraisalFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { error: insertError } = await supabase.from('contact_inquiries').insert([
        {
          customer_name: form.ownerName,
          customer_email: form.email,
          customer_phone: form.phone,
          service: 'tasacion',
          message: `Tipo: ${form.propertyType}. Direccion: ${form.address}. Barrio/localidad: ${form.neighborhood}. Sup. terreno: ${form.surface} m2. Sup. cubierta: ${form.coveredSurface} m2. Antiguedad: ${form.antique}. Ocupacion: ${form.occupancy}. Mejora/estado: ${form.improvements}. Situacion legal: ${form.legalStatus}. Finalidad: ${form.purpose}. Observaciones: ${form.notes}. Contacto preferido: ${form.preferredContact}.`,
          status: 'nueva',
          notes: 'Solicitud de tasación enviada desde la web',
        },
      ])

      if (insertError) {
        throw insertError
      }

      success('¡Gracias! Nos comunicaremos dentro de las próximas 24/48 h hábiles.')
      setForm(initialState)
    } catch (err) {
      console.error('Error enviando tasación', err)
      error('No pudimos enviar la solicitud. Por favor, intentá nuevamente o contactanos por WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid2}>
        <label className={styles.field}>
          <span>Nombre completo *</span>
          <input
            type="text"
            value={form.ownerName}
            onChange={(e) => handleChange('ownerName', e.target.value)}
            required
            placeholder="Nombre y apellido"
          />
        </label>
        <label className={styles.field}>
          <span>Email *</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            placeholder="tu@email.com"
          />
        </label>
      </div>

      <div className={styles.grid2}>
        <label className={styles.field}>
          <span>Teléfono / WhatsApp *</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
            placeholder="+54 9 ..."
          />
        </label>
        <label className={styles.field}>
          <span>Medio de contacto preferido</span>
          <select value={form.preferredContact} onChange={(e) => handleChange('preferredContact', e.target.value as AppraisalFormState['preferredContact'])}>
            <option value="whatsapp">WhatsApp</option>
            <option value="llamada">Llamada telefónica</option>
            <option value="email">Email</option>
          </select>
        </label>
      </div>

      <div className={styles.grid2}>
        <label className={styles.field}>
          <span>Tipo de propiedad *</span>
          <select value={form.propertyType} onChange={(e) => handleChange('propertyType', e.target.value as AppraisalFormState['propertyType'])}>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="terreno">Terreno</option>
            <option value="local">Local comercial</option>
            <option value="campo">Campo / Estancia</option>
            <option value="otro">Otro</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>Dirección / ubicación *</span>
          <input
            type="text"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            required
            placeholder="Calle y altura"
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>Barrio / Localidad *</span>
        <input
          type="text"
          value={form.neighborhood}
          onChange={(e) => handleChange('neighborhood', e.target.value)}
          required
          placeholder="Ej: Nueva Córdoba, Villa Allende"
        />
      </label>

      <div className={styles.grid3}>
        <label className={styles.field}>
          <span>Sup. terreno (m²)</span>
          <input type="number" min="0" value={form.surface} onChange={(e) => handleChange('surface', e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Sup. cubierta (m²)</span>
          <input type="number" min="0" value={form.coveredSurface} onChange={(e) => handleChange('coveredSurface', e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Antigüedad aproximada</span>
          <input type="text" value={form.antique} onChange={(e) => handleChange('antique', e.target.value)} placeholder="Ej: 12 años" />
        </label>
      </div>

      <div className={styles.grid3}>
        <label className={styles.field}>
          <span>Ocupación actual</span>
          <select value={form.occupancy} onChange={(e) => handleChange('occupancy', e.target.value as AppraisalFormState['occupancy'])}>
            <option value="propietario">Propietario</option>
            <option value="inquilino">Alquilada</option>
            <option value="desocupado">Desocupada</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>Finalidad de la tasación *</span>
          <select value={form.purpose} onChange={(e) => handleChange('purpose', e.target.value as AppraisalFormState['purpose'])}>
            <option value="venta">Venta / publicación</option>
            <option value="alquiler">Valor locativo</option>
            <option value="herencia">Partición / sucesión</option>
            <option value="banco">Requisito bancario</option>
            <option value="judicial">Proceso judicial</option>
            <option value="otro">Otro</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>Situación legal / registral</span>
          <input
            type="text"
            value={form.legalStatus}
            onChange={(e) => handleChange('legalStatus', e.target.value)}
            placeholder="Escritura, boleto, PH, sucesión en trámite, etc."
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>Mejoras / estado actual</span>
        <textarea value={form.improvements} onChange={(e) => handleChange('improvements', e.target.value)} rows={3} placeholder="Refacciones recientes, amenities, características destacadas..." />
      </label>

      <label className={styles.field}>
        <span>Observaciones adicionales</span>
        <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={4} placeholder="Disponibilidad horaria, urgencia, comentarios..." />
      </label>

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Enviando solicitud...' : 'Solicitar tasación profesional'}
      </button>
    </form>
  )
}
