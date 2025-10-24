'use client'

import { useState, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import styles from './EnhancedLiveChat.module.css'

export default function EnhancedLiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const {
    session,
    isTyping,
    isOnline,
    quickReplies,
    sendMessage,
    handleQuickReply,
    uploadFile,
    clearChat,
    messagesEndRef
  } = useChat()

  const handleSendMessage = async () => {
    if (!inputText.trim()) return
    await sendMessage(inputText)
    setInputText('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!session) return null

  return (
    <>
      {!isOpen && (
        <button 
          className={styles.chatToggle}
          onClick={() => setIsOpen(true)}
          aria-label="Abrir chat"
        >
          💬
          {session.messages.length > 1 && (
            <span className={styles.notificationBadge}>
              {session.messages.filter(m => m.sender === 'user').length}
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <div className={styles.agentInfo}>
              <div className={styles.agentAvatar}>
                {session.agentAvatar || '🤖'}
              </div>
              <div>
                <h4>{session.agentName || 'Asistente Virtual'}</h4>
                <span className={`${styles.status} ${isOnline ? styles.online : styles.offline}`}>
                  {isOnline ? 'En línea' : 'Desconectado'}
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button 
                className={styles.clearBtn}
                onClick={clearChat}
                title="Limpiar chat"
              >
                🗑️
              </button>
              <button 
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className={styles.chatMessages}>
            {session.messages.map((message) => (
              <div 
                key={message.id} 
                className={`${styles.message} ${styles[message.sender]}`}
              >
                <div className={styles.messageContent}>
                  {message.type === 'image' && message.metadata?.fileName && (
                    <div className={styles.fileMessage}>
                      <img 
                        src={message.text} 
                        alt={message.metadata.fileName}
                        className={styles.messageImage}
                      />
                      <p className={styles.fileName}>{message.metadata.fileName}</p>
                    </div>
                  )}
                  
                  {message.type === 'file' && message.metadata?.fileName && (
                    <div className={styles.fileMessage}>
                      <div className={styles.fileIcon}>📎</div>
                      <div className={styles.fileInfo}>
                        <p className={styles.fileName}>{message.metadata.fileName}</p>
                        <p className={styles.fileSize}>
                          {formatFileSize(message.metadata.fileSize || 0)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {message.type === 'text' && (
                    <p>{message.text}</p>
                  )}
                  
                  <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
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
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                className={styles.quickReply}
                onClick={() => handleQuickReply(reply)}
              >
                {reply.text}
              </button>
            ))}
          </div>

          <div className={styles.chatInput}>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
              style={{ display: 'none' }}
            />
            
            <button 
              className={styles.attachBtn}
              onClick={() => fileInputRef.current?.click()}
              title="Adjuntar archivo"
            >
              📎
            </button>
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className={styles.input}
            />
            
            <button 
              onClick={handleSendMessage}
              className={styles.sendBtn}
              disabled={!inputText.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}
