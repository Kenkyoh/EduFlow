import { useState } from 'react'
import { Send, Paperclip, Search, CheckCheck, ArrowLeft } from 'lucide-react'
import { Header } from '../components/Header'
import { mockConversations } from '../data/mock'
import type { Conversation, Message } from '../types'
import { useAuthStore } from '../store/auth'
import clsx from 'clsx'

export function Messages() {
  const user = useAuthStore(s => s.user)
  const [conversations, setConversations] = useState(mockConversations)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [search, setSearch] = useState('')

  const selected = conversations.find(c => c.id === selectedId)

  const handleSelect = (conv: Conversation) => {
    setSelectedId(conv.id)
    setConversations(prev => prev.map(c =>
      c.id === conv.id ? { ...c, unreadCount: 0 } : c
    ))
  }

  const handleSend = () => {
    if (!newMessage.trim() || !selected) return
    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id ?? 'me',
      senderName: user?.name ?? 'Eu',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    }
    setConversations(prev => prev.map(c =>
      c.id === selectedId
        ? { ...c, messages: [...c.messages, msg], lastMessage: newMessage, lastMessageTime: 'agora' }
        : c
    ))
    setNewMessage('')
  }

  const filtered = conversations.filter(c =>
    c.participantName.toLowerCase().includes(search.toLowerCase())
  )

  const ConversationList = (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-[#E2E8F0] flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
          <input
            className="input pl-8 h-8 text-sm"
            placeholder="Buscar conversa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-[#94A3B8] text-sm">Nenhuma conversa</div>
        ) : (
          filtered.map(conv => (
            <button
              key={conv.id}
              type="button"
              onClick={() => handleSelect(conv)}
              className={clsx(
                'w-full flex items-start gap-3 p-3.5 border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors text-left',
                selectedId === conv.id && 'bg-blue-50 border-l-2 border-l-[#1E3A8A]'
              )}
            >
              <div className="w-9 h-9 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] font-semibold text-sm flex-shrink-0">
                {conv.participantName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={clsx(
                    'text-sm',
                    conv.unreadCount > 0 ? 'font-semibold text-[#0F172A]' : 'font-medium text-[#0F172A]'
                  )}>
                    {conv.participantName}
                  </span>
                  <span className="text-[11px] text-[#94A3B8] flex-shrink-0">{conv.lastMessageTime}</span>
                </div>
                <p className="text-xs text-[#64748B] truncate mt-0.5">{conv.lastMessage}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-[#94A3B8] capitalize">
                    {conv.participantRole === 'teacher' ? 'Professor' : 'Coordenador'}
                  </span>
                  {conv.unreadCount > 0 && (
                    <span className="rounded-full bg-[#1E3A8A] text-white text-[10px] flex items-center justify-center font-bold px-1.5 py-0.5">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )

  const ThreadPanel = selected ? (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E2E8F0] bg-white flex-shrink-0">
        {/* Back button — mobile only */}
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className="md:hidden text-[#64748B] hover:text-[#0F172A] mr-1"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] font-semibold text-sm flex-shrink-0">
          {selected.participantName.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-[#0F172A] text-sm">{selected.participantName}</p>
          <p className="text-xs text-[#94A3B8]">
            {selected.participantRole === 'teacher' ? 'Professor' : 'Coordenador'} · responde em 1–2 horas
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selected.messages.map(msg => {
          const isMe = msg.senderId === user?.id || msg.senderId === 'student-1'
          return (
            <div key={msg.id} className={clsx('flex', isMe ? 'justify-end' : 'justify-start')}>
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] text-xs font-semibold mr-2 flex-shrink-0 mt-1">
                  {msg.senderName.charAt(0)}
                </div>
              )}
              <div className={clsx(
                'max-w-[75%] rounded-2xl px-4 py-2.5',
                isMe ? 'bg-[#1E3A8A] text-white rounded-br-sm' : 'bg-[#F1F5F9] text-[#0F172A] rounded-bl-sm'
              )}>
                <p className="text-sm">{msg.content}</p>
                {msg.attachment && (
                  <div className={clsx(
                    'flex items-center gap-1.5 mt-2 p-2 rounded-lg text-xs',
                    isMe ? 'bg-white/10' : 'bg-white'
                  )}>
                    <Paperclip size={12} />
                    {msg.attachment.name}
                  </div>
                )}
                <div className={clsx('flex items-center gap-1 mt-1', isMe ? 'justify-end' : 'justify-start')}>
                  <span className={clsx('text-[10px]', isMe ? 'text-blue-200' : 'text-[#94A3B8]')}>
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && <CheckCheck size={12} className={msg.read ? 'text-blue-300' : 'text-blue-200/50'} />}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[#E2E8F0] bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <button type="button" title="Anexar arquivo" className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:text-[#64748B] transition-colors">
            <Paperclip size={18} />
          </button>
          <input
            className="input flex-1 h-9"
            placeholder="Escreva uma mensagem..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          />
          <button
            type="button"
            title="Enviar mensagem"
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="w-9 h-9 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white hover:bg-[#1e40af] transition-colors disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex-1 flex items-center justify-center text-[#94A3B8]">
      <div className="text-center">
        <div className="text-5xl mb-3">💬</div>
        <p className="font-medium">Selecione uma conversa</p>
      </div>
    </div>
  )

  return (
    <>
      <Header title="Mensagens" />

      <div className="card overflow-hidden flex h-[calc(100vh-140px)]">
        {/* Conversation list — full width on mobile when no thread selected, sidebar on desktop */}
        <div className={clsx(
          'border-r border-[#E2E8F0] flex-shrink-0 md:w-72',
          selectedId ? 'hidden md:flex md:flex-col' : 'flex flex-col w-full'
        )}>
          {ConversationList}
        </div>

        {/* Thread — full width on mobile when selected, flex-1 on desktop */}
        <div className={clsx(
          'flex-1 flex flex-col',
          selectedId ? 'flex' : 'hidden md:flex'
        )}>
          {ThreadPanel}
        </div>
      </div>
    </>
  )
}
