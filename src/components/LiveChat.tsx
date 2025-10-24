'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './LiveChat.module.css'

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
  isTyping?: boolean
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: '¡Hola! Soy Julieta Arena, martillera pública. ¿En qué puedo ayudarte hoy?',
    sender: 'agent',
    timestamp: new Date()
  }
]

const quickReplies = [
  'Ver propiedades en venta',
  'Consultar sobre alquileres',
  'Información sobre remates',
  'Tasación de propiedad',
  'Asesoramiento legal',
  'Horarios de atención'
]

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('propiedad') || message.includes('casa') || message.includes('departamento')) {
      return 'Tenemos excelentes propiedades disponibles. Te recomiendo visitar nuestra sección de propiedades o puedo ayudarte a encontrar algo específico. ¿Qué tipo de propiedad buscas?'
    }
    
    if (message.includes('alquiler') || message.includes('renta')) {
      return 'Para alquileres, tenemos opciones residenciales y comerciales. ¿Buscas algo en particular? ¿Casa, departamento o local comercial?'
    }
    
    if (message.includes('remate') || message.includes('subasta')) {
      return 'Los remates judiciales son una gran oportunidad. Te puedo asesorar sobre el proceso y las propiedades disponibles. ¿Te interesa participar en alguno?'
    }
    
    if (message.includes('tasación') || message.includes('valor')) {
      return 'Ofrezco servicios de tasación profesional para compra-venta, sucesiones y fines judiciales. ¿Necesitas tasar alguna propiedad específica?'
    }
    
    if (message.includes('legal') || message.includes('asesoramiento')) {
      return 'Brindo asesoramiento legal especializado en derecho argentino: sucesiones, declaratoria de herederos, contratos y más. ¿En qué puedo ayudarte?'
    }
    
    if (message.includes('horario') || message.includes('atención')) {
      return 'Atiendo de lunes a viernes de 9:00 a 18:00. También puedes contactarme por WhatsApp al +54 351 307-8376 o por email a inmobiliaria72juliarena@gmail.com'
    }
    
    if (message.includes('precio') || message.includes('costo')) {
      return 'Los precios varían según el tipo de servicio. Para una consulta personalizada, te recomiendo que me contactes directamente. ¿Te interesa algún servicio en particular?'
    }
    
    return 'Gracias por tu consulta. Para brindarte la mejor atención personalizada, te recomiendo contactarme directamente por WhatsApp al +54 351 307-8376 o por email a inmobiliaria72juliarena@gmail.com. ¿Hay algo más en lo que pueda ayudarte?'
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simular tiempo de respuesta
    setTimeout(() => {
      const response = generateResponse(text)
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'agent',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, agentMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputText)
  }

  const handleQuickReply = (reply: string) => {
    sendMessage(reply)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        className={`${styles.chatToggle} ${isOpen ? styles.chatToggleOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
        {!isOpen && <span className={styles.notificationDot}></span>}
      </button>

      {/* Ventana de chat */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.agentInfo}>
              <div className={styles.agentAvatar}>
                <img src="/images/perfil.jpeg" alt="Julieta Arena" />
              </div>
              <div className={styles.agentDetails}>
                <h4>Julieta Arena</h4>
                <span className={styles.status}>En línea</span>
              </div>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className={styles.chatMessages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${styles[message.sender]}`}
              >
                <div className={styles.messageContent}>
                  <p>{message.text}</p>
                  <span className={styles.messageTime}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className={`${styles.message} ${styles.agent}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.quickReplies}>
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                className={styles.quickReplyButton}
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </button>
            ))}
          </div>

          <form className={styles.chatInput} onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className={styles.messageInput}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!inputText.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
