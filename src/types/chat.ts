export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: string
  type: 'text' | 'image' | 'file' | 'property' | 'appointment'
  metadata?: {
    fileName?: string
    fileSize?: number
    fileType?: string
    propertyId?: string
    appointmentId?: string
  }
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  isActive: boolean
  createdAt: string
  lastActivity: string
  agentName?: string
  agentAvatar?: string
}

export interface QuickReply {
  id: string
  text: string
  action: 'text' | 'property' | 'appointment' | 'contact'
  data?: any
}
