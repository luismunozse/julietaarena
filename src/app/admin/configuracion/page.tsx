'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import styles from './page.module.css'

interface SiteSettings {
  contactPhone: string
  contactEmail: string
  contactAddress: string
  facebookUrl: string
  instagramUrl: string
  linkedinUrl: string
  twitterUrl: string
  defaultCurrency: 'ARS' | 'USD'
  googleMapsApiKey: string
  emailjsServiceId: string
  emailjsTemplateId: string
  emailjsPublicKey: string
  siteTitle: string
  siteDescription: string
  siteKeywords: string
}

export default function ConfiguracionPage() {
  const { success, error: showError } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>({
    contactPhone: '',
    contactEmail: '',
    contactAddress: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    defaultCurrency: 'ARS',
    googleMapsApiKey: '',
    emailjsServiceId: '',
    emailjsTemplateId: '',
    emailjsPublicKey: '',
    siteTitle: '',
    siteDescription: '',
    siteKeywords: '',
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      // Cargar desde localStorage o Supabase
      const stored = localStorage.getItem('site-settings')
      if (stored) {
        setSettings(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Error cargando configuración:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setIsSaving(true)
      localStorage.setItem('site-settings', JSON.stringify(settings))
      success('Configuración guardada correctamente')
    } catch (err) {
      console.error('Error guardando configuración:', err)
      showError('Error al guardar la configuración')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando configuración...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Configuración del Sitio</h1>
        <p>Gestiona la configuración general del sitio web</p>
      </div>

      <div className={styles.settingsGrid}>
        {/* Información de Contacto */}
        <div className={styles.settingsSection}>
          <h2>📞 Información de Contacto</h2>
          <div className={styles.formGroup}>
            <label>Teléfono</label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              placeholder="+54 9 11 1234-5678"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              placeholder="contacto@julietaarena.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Dirección</label>
            <textarea
              value={settings.contactAddress}
              onChange={(e) => handleChange('contactAddress', e.target.value)}
              placeholder="Calle, Número, Ciudad, Provincia"
              rows={3}
            />
          </div>
        </div>

        {/* Redes Sociales */}
        <div className={styles.settingsSection}>
          <h2>🌐 Redes Sociales</h2>
          <div className={styles.formGroup}>
            <label>Facebook</label>
            <input
              type="url"
              value={settings.facebookUrl}
              onChange={(e) => handleChange('facebookUrl', e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div className={styles.formGroup}>
            <label>Instagram</label>
            <input
              type="url"
              value={settings.instagramUrl}
              onChange={(e) => handleChange('instagramUrl', e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div className={styles.formGroup}>
            <label>LinkedIn</label>
            <input
              type="url"
              value={settings.linkedinUrl}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/..."
            />
          </div>
          <div className={styles.formGroup}>
            <label>Twitter</label>
            <input
              type="url"
              value={settings.twitterUrl}
              onChange={(e) => handleChange('twitterUrl', e.target.value)}
              placeholder="https://twitter.com/..."
            />
          </div>
        </div>

        {/* Configuración General */}
        <div className={styles.settingsSection}>
          <h2>⚙️ Configuración General</h2>
          <div className={styles.formGroup}>
            <label>Moneda por Defecto</label>
            <select
              value={settings.defaultCurrency}
              onChange={(e) => handleChange('defaultCurrency', e.target.value)}
            >
              <option value="ARS">ARS (Pesos Argentinos)</option>
              <option value="USD">USD (Dólares)</option>
            </select>
          </div>
        </div>

        {/* SEO */}
        <div className={styles.settingsSection}>
          <h2>🔍 SEO</h2>
          <div className={styles.formGroup}>
            <label>Título del Sitio</label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => handleChange('siteTitle', e.target.value)}
              placeholder="Julieta Arena - Martillera Pública"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Descripción</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              placeholder="Descripción del sitio para SEO"
              rows={3}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Palabras Clave</label>
            <input
              type="text"
              value={settings.siteKeywords}
              onChange={(e) => handleChange('siteKeywords', e.target.value)}
              placeholder="inmobiliaria, propiedades, venta, alquiler"
            />
          </div>
        </div>

        {/* Integraciones */}
        <div className={styles.settingsSection}>
          <h2>🔗 Integraciones</h2>
          <div className={styles.formGroup}>
            <label>Google Maps API Key</label>
            <input
              type="text"
              value={settings.googleMapsApiKey}
              onChange={(e) => handleChange('googleMapsApiKey', e.target.value)}
              placeholder="AIza..."
            />
          </div>
          <div className={styles.formGroup}>
            <label>EmailJS Service ID</label>
            <input
              type="text"
              value={settings.emailjsServiceId}
              onChange={(e) => handleChange('emailjsServiceId', e.target.value)}
              placeholder="service_xxxxx"
            />
          </div>
          <div className={styles.formGroup}>
            <label>EmailJS Template ID</label>
            <input
              type="text"
              value={settings.emailjsTemplateId}
              onChange={(e) => handleChange('emailjsTemplateId', e.target.value)}
              placeholder="template_xxxxx"
            />
          </div>
          <div className={styles.formGroup}>
            <label>EmailJS Public Key</label>
            <input
              type="text"
              value={settings.emailjsPublicKey}
              onChange={(e) => handleChange('emailjsPublicKey', e.target.value)}
              placeholder="xxxxx"
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className={styles.saveButton}
        >
          {isSaving ? 'Guardando...' : '💾 Guardar Configuración'}
        </button>
      </div>
    </div>
  )
}
