'use client'

import { usePushNotifications, useInquiryNotifications } from '@/hooks/usePushNotifications'
import { useToast } from '@/components/ToastContainer'
import styles from './NotificationSettings.module.css'

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
      success('¡Notificaciones activadas! Recibirás alertas de nuevas consultas.')
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
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.icon}>🔕</div>
          <h3 className={styles.title}>Notificaciones no disponibles</h3>
          <p className={styles.description}>
            Tu navegador no soporta notificaciones push.
            Prueba con Chrome, Firefox, Edge o Safari.
          </p>
        </div>
      </div>
    )
  }

  if (permission === 'denied') {
    return (
      <div className={styles.container}>
        <div className={`${styles.card} ${styles.warning}`}>
          <div className={styles.icon}>⚠️</div>
          <h3 className={styles.title}>Notificaciones bloqueadas</h3>
          <p className={styles.description}>
            Has bloqueado las notificaciones para este sitio.
            Para activarlas, ve a la configuración de tu navegador:
          </p>
          <ol className={styles.instructions}>
            <li>Click en el ícono de candado/información en la barra de direcciones</li>
            <li>Busca la sección de &quot;Notificaciones&quot;</li>
            <li>Cambia el permiso a &quot;Permitir&quot;</li>
            <li>Recarga la página</li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          {isEnabled ? '🔔' : '🔕'}
        </div>

        <h3 className={styles.title}>Notificaciones en Tiempo Real</h3>

        <p className={styles.description}>
          {isEnabled
            ? 'Recibirás notificaciones instantáneas cuando lleguen nuevas consultas, incluso con la pestaña minimizada.'
            : 'Activa las notificaciones para recibir alertas instantáneas de nuevas consultas.'}
        </p>

        {isEnabled && (
          <div className={styles.statusActive}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>Notificaciones activas</span>
          </div>
        )}

        <div className={styles.actions}>
          {!isEnabled ? (
            <button
              onClick={handleEnable}
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              🔔 Activar Notificaciones
            </button>
          ) : (
            <button
              onClick={handleDisable}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              🔕 Desactivar
            </button>
          )}
        </div>

        <div className={styles.info}>
          <h4 className={styles.infoTitle}>¿Cómo funcionan?</h4>
          <ul className={styles.infoList}>
            <li>✅ Recibirás una alerta cada vez que llegue una consulta nueva</li>
            <li>✅ Funcionan incluso con la pestaña minimizada</li>
            <li>✅ Puedes hacer click en la notificación para ir directo al panel</li>
            <li>✅ Se auto-cierran después de 10 segundos</li>
            <li>⚠️ Solo funcionan cuando el navegador está abierto</li>
          </ul>
        </div>

        {isEnabled && (
          <div className={styles.testSection}>
            <p className={styles.testText}>Para probar, envía una consulta de prueba desde el sitio web.</p>
          </div>
        )}
      </div>
    </div>
  )
}
