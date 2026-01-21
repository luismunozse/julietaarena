'use client'

import { useState, useRef, CSSProperties } from 'react'
import Image from 'next/image'
import { useChat } from '@/hooks/useChat'

const styles: Record<string, CSSProperties> = {
  chatToggle: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    width: '60px',
    height: '60px',
    backgroundColor: '#2c5f7d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'all 0.3s',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '20px',
    height: '20px',
    backgroundColor: '#e8b86d',
    color: '#1a4158',
    borderRadius: '50%',
    fontSize: '0.75rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    width: '380px',
    maxWidth: 'calc(100vw - 2rem)',
    height: '500px',
    maxHeight: 'calc(100vh - 4rem)',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#2c5f7d',
    color: '#ffffff',
  },
  agentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  agentAvatar: {
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
  },
  agentName: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
  },
  status: {
    fontSize: '0.75rem',
    opacity: 0.9,
  },
  statusOnline: {
    color: '#4CAF50',
  },
  statusOffline: {
    color: '#FF9800',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  headerBtn: {
    width: '32px',
    height: '32px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    color: '#ffffff',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  chatMessages: {
    flex: 1,
    overflow: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    backgroundColor: '#f8f9fa',
  },
  message: {
    maxWidth: '80%',
    padding: '0.75rem 1rem',
    borderRadius: '16px',
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  messageUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#2c5f7d',
    color: '#ffffff',
    borderBottomRightRadius: '4px',
  },
  messageAgent: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    color: '#1a4158',
    borderBottomLeftRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  fileMessage: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  messageImage: {
    borderRadius: '8px',
    maxWidth: '100%',
  },
  fileIcon: {
    fontSize: '2rem',
  },
  fileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
  },
  fileName: {
    margin: 0,
    fontSize: '0.8125rem',
    fontWeight: 500,
  },
  fileSize: {
    margin: 0,
    fontSize: '0.75rem',
    opacity: 0.7,
  },
  timestamp: {
    fontSize: '0.6875rem',
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '0.5rem 0',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#636e72',
    borderRadius: '50%',
    animation: 'typing 1.4s infinite ease-in-out',
  },
  quickReplies: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
  },
  quickReply: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.8125rem',
    color: '#1a4158',
    transition: 'all 0.2s',
  },
  chatInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
  },
  attachBtn: {
    width: '36px',
    height: '36px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.125rem',
    color: '#636e72',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  input: {
    flex: 1,
    padding: '0.625rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  sendBtn: {
    width: '36px',
    height: '36px',
    backgroundColor: '#2c5f7d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  sendBtnDisabled: {
    backgroundColor: '#e5e7eb',
    cursor: 'not-allowed',
  },
}

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
          style={styles.chatToggle}
          onClick={() => setIsOpen(true)}
          aria-label="Abrir chat"
        >
          💬
          {session.messages.length > 1 && (
            <span style={styles.notificationBadge}>
              {session.messages.filter(m => m.sender === 'user').length}
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div style={styles.chatContainer}>
          <div style={styles.chatHeader}>
            <div style={styles.agentInfo}>
              <div style={styles.agentAvatar}>
                {session.agentAvatar || '🤖'}
              </div>
              <div>
                <h4 style={styles.agentName}>{session.agentName || 'Asistente Virtual'}</h4>
                <span style={{
                  ...styles.status,
                  ...(isOnline ? styles.statusOnline : styles.statusOffline)
                }}>
                  {isOnline ? 'En linea' : 'Desconectado'}
                </span>
              </div>
            </div>
            <div style={styles.headerActions}>
              <button
                style={styles.headerBtn}
                onClick={clearChat}
                title="Limpiar chat"
              >
                🗑️
              </button>
              <button
                style={styles.headerBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar chat"
              >
                X
              </button>
            </div>
          </div>

          <div style={styles.chatMessages}>
            {session.messages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...styles.message,
                  ...(message.sender === 'user' ? styles.messageUser : styles.messageAgent)
                }}
              >
                <div style={styles.messageContent}>
                  {message.type === 'image' && message.metadata?.fileName && (
                    <div style={styles.fileMessage}>
                      <Image
                        src={message.text}
                        alt={message.metadata.fileName}
                        width={320}
                        height={200}
                        style={{ ...styles.messageImage, width: '100%', height: 'auto' }}
                        unoptimized
                      />
                      <p style={styles.fileName}>{message.metadata.fileName}</p>
                    </div>
                  )}

                  {message.type === 'file' && message.metadata?.fileName && (
                    <div style={{ ...styles.fileMessage, flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={styles.fileIcon}>📎</div>
                      <div style={styles.fileInfo}>
                        <p style={styles.fileName}>{message.metadata.fileName}</p>
                        <p style={styles.fileSize}>
                          {formatFileSize(message.metadata.fileSize || 0)}
                        </p>
                      </div>
                    </div>
                  )}

                  {message.type === 'text' && (
                    <p style={{ margin: 0 }}>{message.text}</p>
                  )}

                  <span style={styles.timestamp}>{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ ...styles.message, ...styles.messageAgent }}>
                <div style={styles.messageContent}>
                  <div style={styles.typingIndicator}>
                    <span style={{ ...styles.typingDot, animationDelay: '0s' }}></span>
                    <span style={{ ...styles.typingDot, animationDelay: '0.2s' }}></span>
                    <span style={{ ...styles.typingDot, animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div style={styles.quickReplies}>
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                style={styles.quickReply}
                onClick={() => handleQuickReply(reply)}
              >
                {reply.text}
              </button>
            ))}
          </div>

          <div style={styles.chatInput}>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
              style={{ display: 'none' }}
            />

            <button
              style={styles.attachBtn}
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
              style={styles.input}
            />

            <button
              onClick={handleSendMessage}
              style={{
                ...styles.sendBtn,
                ...(!inputText.trim() ? styles.sendBtnDisabled : {})
              }}
              disabled={!inputText.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  )
}
