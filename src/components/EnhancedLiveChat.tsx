'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'
import { MessageSquare, Trash2, X, Paperclip, Send } from 'lucide-react'

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
    messagesEndRef,
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
      minute: '2-digit',
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
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          className="fixed bottom-8 right-8 z-[1000] flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#2c5f7d] text-white shadow-lg transition-all hover:scale-105 hover:bg-[#1a4158]"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir chat"
        >
          <MessageSquare className="h-6 w-6" />
          {session.messages.length > 1 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-xs font-semibold text-[#1a4158]">
              {session.messages.filter((m) => m.sender === 'user').length}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 z-[1000] flex h-[500px] max-h-[calc(100vh-4rem)] w-full sm:w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#2c5f7d] p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl">
                {session.agentAvatar || '🤖'}
              </div>
              <div>
                <h4 className="m-0 text-base font-semibold">
                  {session.agentName || 'Asistente Virtual'}
                </h4>
                <span
                  className={cn(
                    'text-xs',
                    isOnline ? 'text-green-400' : 'text-amber-400'
                  )}
                >
                  {isOnline ? 'En línea' : 'Desconectado'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
                onClick={clearChat}
                title="Limpiar chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-3 overflow-auto bg-slate-50 p-4">
            {session.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  message.sender === 'user'
                    ? 'self-end rounded-br-sm bg-[#2c5f7d] text-white'
                    : 'self-start rounded-bl-sm bg-white text-[#1a4158] shadow-sm'
                )}
              >
                <div className="flex flex-col gap-1">
                  {message.type === 'image' && message.metadata?.fileName && (
                    <div className="flex flex-col gap-2">
                      <Image
                        src={message.text}
                        alt={message.metadata.fileName}
                        width={320}
                        height={200}
                        className="w-full rounded-lg"
                        unoptimized
                      />
                      <p className="m-0 text-[13px] font-medium">
                        {message.metadata.fileName}
                      </p>
                    </div>
                  )}

                  {message.type === 'file' && message.metadata?.fileName && (
                    <div className="flex flex-row items-center gap-3">
                      <Paperclip className="h-8 w-8 shrink-0" />
                      <div className="flex flex-col gap-0.5">
                        <p className="m-0 text-[13px] font-medium">
                          {message.metadata.fileName}
                        </p>
                        <p className="m-0 text-xs opacity-70">
                          {formatFileSize(message.metadata.fileSize || 0)}
                        </p>
                      </div>
                    </div>
                  )}

                  {message.type === 'text' && (
                    <p className="m-0">{message.text}</p>
                  )}

                  <span className="self-end text-[11px] opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm shadow-sm">
                <div className="flex gap-1 py-2">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.2s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-white px-4 py-3">
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[13px] text-[#1a4158] transition-all hover:border-[#2c5f7d] hover:bg-[#2c5f7d]/5"
                onClick={() => handleQuickReply(reply)}
              >
                {reply.text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-4 py-3">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
            />

            <button
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
              onClick={() => fileInputRef.current?.click()}
              title="Adjuntar archivo"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#2c5f7d]"
            />

            <button
              onClick={handleSendMessage}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                inputText.trim()
                  ? 'bg-[#2c5f7d] text-white hover:bg-[#1a4158]'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
              )}
              disabled={!inputText.trim()}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
