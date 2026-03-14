'use client'

import { useState } from 'react'
import { useToast } from '@/components/ToastContainer'
import { createBackup, downloadBackup, restoreBackup, loadBackupFile } from '@/lib/backup'
import Modal from '@/components/Modal'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Upload, AlertTriangle, Info } from 'lucide-react'

export default function BackupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [backupFile, setBackupFile] = useState<File | null>(null)
  const { success, error: showError } = useToast()

  const handleCreateBackup = async () => {
    setIsLoading(true)
    try {
      const backup = await createBackup()
      downloadBackup(backup)
      success('Backup creado y descargado correctamente')
    } catch (err) {
      console.error('Error al crear backup:', err)
      showError('Error al crear el backup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBackupFile(file)
    }
  }

  const handleRestore = async () => {
    if (!backupFile) {
      showError('Por favor selecciona un archivo de backup')
      return
    }

    if (!confirm('¿Estás seguro de que deseas restaurar este backup? Esto sobrescribirá los datos actuales.')) {
      return
    }

    setIsLoading(true)
    try {
      const backup = await loadBackupFile(backupFile)
      await restoreBackup(backup)
      success('Backup restaurado correctamente')
      setShowRestoreModal(false)
      setBackupFile(null)
      window.location.reload()
    } catch (err) {
      console.error('Error al restaurar backup:', err)
      showError('Error al restaurar el backup. Verifica que el archivo sea válido.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Backup y Restore"
        subtitle="Crea copias de seguridad y restaura datos del sistema"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Crear Backup</CardTitle>
                <CardDescription>
                  Descarga una copia completa de todos los datos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Incluye propiedades, consultas, contactos y plantillas en formato JSON.
            </p>
            <Button onClick={handleCreateBackup} disabled={isLoading} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isLoading ? 'Creando...' : 'Crear Backup'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Upload className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Restaurar Backup</CardTitle>
                <CardDescription>
                  Restaura datos desde un archivo anterior
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Esto sobrescribirá los datos actuales. Crea un backup primero.
            </p>
            <Button
              variant="outline"
              onClick={() => setShowRestoreModal(true)}
              disabled={isLoading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Restaurar Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base text-blue-800">Información Importante</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              Los backups incluyen todas las propiedades, consultas, contactos y plantillas
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              Los backups se guardan en formato JSON
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              Restaurar un backup sobrescribirá los datos actuales
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              Se recomienda crear un backup antes de restaurar
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              Los backups no incluyen imágenes almacenadas en Cloudinary
            </li>
          </ul>
        </CardContent>
      </Card>

      {showRestoreModal && (
        <Modal
          isOpen={showRestoreModal}
          onClose={() => {
            setShowRestoreModal(false)
            setBackupFile(null)
          }}
          title="Restaurar Backup"
          type="alert"
          message=""
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Restaurar un backup sobrescribirá todos los datos actuales. Asegúrate de tener un backup reciente.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backup-file">Seleccionar archivo de backup:</Label>
              <Input
                id="backup-file"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
              />
              {backupFile && (
                <p className="text-sm text-slate-600">
                  Archivo seleccionado: <span className="font-medium">{backupFile.name}</span>
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleRestore}
                disabled={isLoading || !backupFile}
                className="flex-1"
              >
                {isLoading ? 'Restaurando...' : 'Restaurar'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRestoreModal(false)
                  setBackupFile(null)
                }}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
