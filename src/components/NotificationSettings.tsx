'use client'

import { CSSProperties } from 'react'
import { usePushNotifications, useInquiryNotifications } from '@/hooks/usePushNotifications'
import { useToast } from '@/components/ToastContainer'

const styles: Record<string, CSSProperties> = {
  container: {
    padding: '1.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    padding: '2rem',
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
  },
  cardWarning: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    padding: '2rem',
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'center',
    border: '1px solid #e8b86d',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1a4158',
  },
  description: {
    margin: '0 0 1.5rem 0',
    fontSize: '0.9375rem',
    color: '#636e72',
    lineHeight: 1.6,
  },
  instructions: {
    textAlign: 'left',
    margin: '0 0 1.5rem 0',
    paddingLeft: '1.5rem',
    fontSize: '0.875rem',
    color: '#636e72',
    lineHeight: 2,
  },
  statusActive: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: '24px',
    marginBottom: '1.5rem',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#4CAF50',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  statusText: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#4CAF50',
  },
  actions: {
    marginBottom: '1.5rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9375rem',
    border: 'none',
    transition: 'all 0.2s',
  },
  buttonPrimary: {
    backgroundColor: '#2c5f7d',
    color: '#ffffff',
  },
  buttonSecondary: {
    backgroundColor: '#f8f9fa',
    color: '#636e72',
    border: '1px solid #e5e7eb',
  },
  info: {
    textAlign: 'left',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },
  infoTitle: {
    margin: '0 0 0.75rem 0',
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: '#1a4158',
  },
  infoList: {
    margin: 0,
    paddingLeft: '1.25rem',
    fontSize: '0.8125rem',
    color: '#636e72',
    lineHeight: 2,
    listStyleType: 'none',
  },
  testSection: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: 'rgba(44, 95, 125, 0.05)',
    borderRadius: '12px',
    border: '1px dashed #2c5f7d',
  },
  testText: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#2c5f7d',
  },
}

export default function NotificationSettings() {
  const {
    isSupported,
    isEnabled,
    permission,
    requestPermission,
    disableNotifications,
  } = usePushNotifications()

  // Iniciar escucha de nuevas consultas
  useInquiryNotifications()

  const { success, error: showError } = useToast()

  const handleEnable = async () => {
    const result = await requestPermission()

    if (result.success) {
      success('Notificaciones activadas! Recibiras alertas de nuevas consultas.')
    } else {
      showError(result.error || 'No se pudieron activar las notificaciones')
    }
  }

  const handleDisable = () => {
    disableNotifications()
    success('Notificaciones desactivadas')
  }

  if (!isSupported) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.icon}>🔕</div>
          <h3 style={styles.title}>Notificaciones no disponibles</h3>
          <p style={styles.description}>
            Tu navegador no soporta notificaciones push.
            Prueba con Chrome, Firefox, Edge o Safari.
          </p>
        </div>
      </div>
    )
  }

  if (permission === 'denied') {
    return (
      <div style={styles.container}>
        <div style={styles.cardWarning}>
          <div style={styles.icon}>⚠️</div>
          <h3 style={styles.title}>Notificaciones bloqueadas</h3>
          <p style={styles.description}>
            Has bloqueado las notificaciones para este sitio.
            Para activarlas, ve a la configuracion de tu navegador:
          </p>
          <ol style={styles.instructions}>
            <li>Click en el icono de candado/informacion en la barra de direcciones</li>
            <li>Busca la seccion de &quot;Notificaciones&quot;</li>
            <li>Cambia el permiso a &quot;Permitir&quot;</li>
            <li>Recarga la pagina</li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>
          {isEnabled ? '🔔' : '🔕'}
        </div>

        <h3 style={styles.title}>Notificaciones en Tiempo Real</h3>

        <p style={styles.description}>
          {isEnabled
            ? 'Recibiras notificaciones instantaneas cuando lleguen nuevas consultas, incluso con la pestana minimizada.'
            : 'Activa las notificaciones para recibir alertas instantaneas de nuevas consultas.'}
        </p>

        {isEnabled && (
          <div style={styles.statusActive}>
            <span style={styles.statusDot}></span>
            <span style={styles.statusText}>Notificaciones activas</span>
          </div>
        )}

        <div style={styles.actions}>
          {!isEnabled ? (
            <button
              onClick={handleEnable}
              style={{ ...styles.button, ...styles.buttonPrimary }}
            >
              🔔 Activar Notificaciones
            </button>
          ) : (
            <button
              onClick={handleDisable}
              style={{ ...styles.button, ...styles.buttonSecondary }}
            >
              🔕 Desactivar
            </button>
          )}
        </div>

        <div style={styles.info}>
          <h4 style={styles.infoTitle}>Como funcionan?</h4>
          <ul style={styles.infoList}>
            <li>Recibiras una alerta cada vez que llegue una consulta nueva</li>
            <li>Funcionan incluso con la pestana minimizada</li>
            <li>Puedes hacer click en la notificacion para ir directo al panel</li>
            <li>Se auto-cierran despues de 10 segundos</li>
            <li>Solo funcionan cuando el navegador esta abierto</li>
          </ul>
        </div>

        {isEnabled && (
          <div style={styles.testSection}>
            <p style={styles.testText}>Para probar, envia una consulta de prueba desde el sitio web.</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
