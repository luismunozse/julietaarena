'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ToastContainer'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Phone, Globe, Settings, Search, Link2, Save } from 'lucide-react'

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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Configuración del Sitio"
        subtitle="Gestiona la configuración general del sitio web"
        action={
          <Button onClick={saveSettings} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información de Contacto */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-slate-600" />
              <CardTitle className="text-lg">Información de Contacto</CardTitle>
            </div>
            <CardDescription>Datos de contacto mostrados en el sitio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="text"
                value={settings.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+54 9 11 1234-5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="contacto@julietaarena.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                value={settings.contactAddress}
                onChange={(e) => handleChange('contactAddress', e.target.value)}
                placeholder="Calle, Número, Ciudad, Provincia"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociales */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-slate-600" />
              <CardTitle className="text-lg">Redes Sociales</CardTitle>
            </div>
            <CardDescription>URLs de las redes sociales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                type="url"
                value={settings.linkedinUrl}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                type="url"
                value={settings.twitterUrl}
                onChange={(e) => handleChange('twitterUrl', e.target.value)}
                placeholder="https://twitter.com/..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración General */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-600" />
              <CardTitle className="text-lg">Configuración General</CardTitle>
            </div>
            <CardDescription>Ajustes generales del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Moneda por Defecto</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={(value) => handleChange('defaultCurrency', value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARS">ARS (Pesos Argentinos)</SelectItem>
                  <SelectItem value="USD">USD (Dólares)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-slate-600" />
              <CardTitle className="text-lg">SEO</CardTitle>
            </div>
            <CardDescription>Optimización para motores de búsqueda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Título del Sitio</Label>
              <Input
                id="siteTitle"
                type="text"
                value={settings.siteTitle}
                onChange={(e) => handleChange('siteTitle', e.target.value)}
                placeholder="Julieta Arena - Martillera Pública"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Descripción</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                placeholder="Descripción del sitio para SEO"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteKeywords">Palabras Clave</Label>
              <Input
                id="siteKeywords"
                type="text"
                value={settings.siteKeywords}
                onChange={(e) => handleChange('siteKeywords', e.target.value)}
                placeholder="inmobiliaria, propiedades, venta, alquiler"
              />
            </div>
          </CardContent>
        </Card>

        {/* Integraciones */}
        <Card className="bg-white md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-slate-600" />
              <CardTitle className="text-lg">Integraciones</CardTitle>
            </div>
            <CardDescription>APIs y servicios externos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-w-md">
              <Label htmlFor="googleMaps">Google Maps API Key</Label>
              <Input
                id="googleMaps"
                type="text"
                value={settings.googleMapsApiKey}
                onChange={(e) => handleChange('googleMapsApiKey', e.target.value)}
                placeholder="AIza..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
