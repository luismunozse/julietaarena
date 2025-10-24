'use client'

import { useState, useEffect, useRef } from 'react'
import { ChatMessage, ChatSession, QuickReply } from '@/types/chat'

const CHAT_SESSION_KEY = 'julieta-arena-chat-session'

const quickReplies: QuickReply[] = [
  { id: '1', text: 'Ver propiedades en venta', action: 'property', data: { operation: 'venta' } },
  { id: '2', text: 'Ver propiedades en alquiler', action: 'property', data: { operation: 'alquiler' } },
  { id: '3', text: 'Agendar una visita', action: 'appointment' },
  { id: '4', text: 'Consultar sobre financiación', action: 'text', data: { text: 'Me interesa conocer las opciones de financiación disponibles.' } },
  { id: '5', text: 'Hablar con un agente', action: 'contact' },
  { id: '6', text: 'Ver propiedades destacadas', action: 'property', data: { featured: true } }
]

const automatedResponses = {
  'hola': '¡Hola! 👋 Soy el asistente virtual de Julieta Arena. ¿En qué puedo ayudarte hoy?',
  'propiedades': 'Tenemos una gran variedad de propiedades disponibles. ¿Te interesa comprar o alquilar?',
  'precio': 'Los precios varían según la ubicación y características. ¿Hay alguna zona específica que te interese?',
  'visita': '¡Perfecto! Puedo ayudarte a agendar una visita. ¿Hay alguna propiedad en particular que te gustaría ver?',
  'financiacion': 'Ofrecemos varias opciones de financiación. Te puedo conectar con nuestro equipo financiero para más detalles.',
  'gracias': '¡De nada! 😊 ¿Hay algo más en lo que pueda ayudarte?',
  'default': 'Entiendo tu consulta. Te voy a conectar con uno de nuestros agentes especializados que podrá ayudarte mejor.'
}

export function useChat() {
  const [session, setSession] = useState<ChatSession | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Cargar sesión existente
    const stored = localStorage.getItem(CHAT_SESSION_KEY)
    if (stored) {
      try {
        setSession(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading chat session:', error)
      }
    } else {
      // Crear nueva sesión
      const newSession: ChatSession = {
        id: `chat-${Date.now()}`,
        messages: [
          {
            id: 'welcome',
            text: '¡Hola! 👋 Soy el asistente virtual de Julieta Arena. ¿En qué puedo ayudarte hoy?',
            sender: 'agent',
            timestamp: new Date().toISOString(),
            type: 'text'
          }
        ],
        isActive: true,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        agentName: 'Asistente Virtual',
        agentAvatar: '🤖'
      }
      setSession(newSession)
      saveSession(newSession)
    }
  }, [])

  const saveSession = (sessionData: ChatSession) => {
    setSession(sessionData)
    localStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(sessionData))
  }

  const addMessage = (text: string, sender: 'user' | 'agent' = 'user', type: 'text' | 'image' | 'file' | 'property' | 'appointment' = 'text', metadata?: any) => {
    if (!session) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      sender,
      timestamp: new Date().toISOString(),
      type,
      metadata
    }

    const updatedSession = {
      ...session,
      messages: [...session.messages, newMessage],
      lastActivity: new Date().toISOString()
    }

    saveSession(updatedSession)
    scrollToBottom()
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || !session) return

    // Agregar mensaje del usuario
    addMessage(text, 'user')

    // Simular escritura
    setIsTyping(true)

    // Simular delay de respuesta
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    setIsTyping(false)

    // Generar respuesta automática
    const response = generateResponse(text)
    addMessage(response.text, 'agent', response.type, response.metadata)
  }

  const generateResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase()

    // Buscar palabras clave
    for (const [keyword, response] of Object.entries(automatedResponses)) {
      if (message.includes(keyword)) {
        return { text: response, type: 'text' as const }
      }
    }

    // Respuesta por defecto
    return { 
      text: automatedResponses.default, 
      type: 'text' as const 
    }
  }

  const handleQuickReply = (reply: QuickReply) => {
    if (!session) return

    switch (reply.action) {
      case 'text':
        if (reply.data?.text) {
          sendMessage(reply.data.text)
        }
        break
      case 'property':
        addMessage(`Te muestro las propiedades que coinciden con tu búsqueda.`, 'agent', 'property', reply.data)
        break
      case 'appointment':
        addMessage(`Te ayudo a agendar una visita. ¿Hay alguna propiedad específica que te interese?`, 'agent', 'appointment')
        break
      case 'contact':
        addMessage(`Te voy a conectar con uno de nuestros agentes especializados.`, 'agent', 'text')
        break
    }
  }

  const uploadFile = (file: File) => {
    if (!session) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const metadata = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      }

      if (file.type.startsWith('image/')) {
        addMessage(`He recibido tu imagen: ${file.name}`, 'agent', 'image', metadata)
      } else {
        addMessage(`He recibido tu archivo: ${file.name}`, 'agent', 'file', metadata)
      }
    }
    reader.readAsDataURL(file)
  }

  const clearChat = () => {
    if (!session) return

    const clearedSession: ChatSession = {
      ...session,
      messages: [
        {
          id: 'welcome',
          text: '¡Hola! 👋 Soy el asistente virtual de Julieta Arena. ¿En qué puedo ayudarte hoy?',
          sender: 'agent',
          timestamp: new Date().toISOString(),
          type: 'text'
        }
      ],
      lastActivity: new Date().toISOString()
    }

    saveSession(clearedSession)
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return {
    session,
    isTyping,
    isOnline,
    quickReplies,
    sendMessage,
    handleQuickReply,
    uploadFile,
    clearChat,
    messagesEndRef
  }
}
