'use client'

import { useState } from 'react'
import { useToast } from '@/components/ToastContainer'
import { createBackup, downloadBackup, restoreBackup, loadBackupFile, type BackupData } from '@/lib/backup'
import Modal from '@/components/Modal'


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
      // Recargar la página para ver los cambios
      window.location.reload()
    } catch (err) {
      console.error('Error al restaurar backup:', err)
      showError('Error al restaurar el backup. Verifica que el archivo sea válido.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="title">Backup y Restore</h1>
          <p className="subtitle">Crea copias de seguridad y restaura datos del sistema</p>
        </div>
      </div>

      <div className="actionsGrid">
        <div className="actionCard">
          <div className="actionIcon">💾</div>
          <h3 className="actionTitle">Crear Backup</h3>
          <p className="actionDescription">
            Descarga una copia completa de todas las propiedades, consultas, contactos y plantillas
          </p>
          <button
            onClick={handleCreateBackup}
            className="actionButton"
            disabled={isLoading}
          >
            {isLoading ? 'Creando...' : 'Crear Backup'}
          </button>
        </div>

        <div className="actionCard">
          <div className="actionIcon">📥</div>
          <h3 className="actionTitle">Restaurar Backup</h3>
          <p className="actionDescription">
            Restaura datos desde un archivo de backup anterior. Esto sobrescribirá los datos actuales.
          </p>
          <button
            onClick={() => setShowRestoreModal(true)}
            className="actionButton"
            disabled={isLoading}
          >
            Restaurar Backup
          </button>
        </div>
      </div>

      <div className="infoSection">
        <h3 className="infoTitle">Información Importante</h3>
        <ul className="infoList">
          <li>Los backups incluyen todas las propiedades, consultas, contactos y plantillas</li>
          <li>Los backups se guardan en formato JSON</li>
          <li>Restaurar un backup sobrescribirá los datos actuales</li>
          <li>Se recomienda crear un backup antes de restaurar</li>
          <li>Los backups no incluyen imágenes almacenadas en Cloudinary</li>
        </ul>
      </div>

      {/* Modal restaurar */}
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
          <div className="modalContent">
            <p className="modalWarning">
              ⚠️ Restaurar un backup sobrescribirá todos los datos actuales. Asegúrate de tener un backup reciente.
            </p>
            <div className="fileInput">
              <label htmlFor="backup-file">Seleccionar archivo de backup:</label>
              <input
                id="backup-file"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="input"
              />
              {backupFile && (
                <p className="fileName">Archivo seleccionado: {backupFile.name}</p>
              )}
            </div>
            <div className="modalActions">
              <button
                onClick={handleRestore}
                className="restoreButton"
                disabled={isLoading || !backupFile}
              >
                {isLoading ? 'Restaurando...' : 'Restaurar'}
              </button>
              <button
                onClick={() => {
                  setShowRestoreModal(false)
                  setBackupFile(null)
                }}
                className="cancelButton"
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

