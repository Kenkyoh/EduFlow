import { useState, useEffect, useRef } from 'react'
import { Send, Paperclip, Search, CheckCheck, ArrowLeft } from 'lucide-react'
import { Header } from '../components/Header'
import { supabase } from '../lib/supabase'
import type { Conversation, Message } from '../types'
import { useAuthStore } from '../store/auth'
import { useTranslation } from '../i18n'
import clsx from 'clsx'

// --------------- helpers ---------------

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

// --------------- data fetching ---------------

interface ConvRow {
  id: string
  participant_a: string
  participant_b: string
  updated_at: string
}

interface MsgRow {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
}

interface ProfileRow {
  id: string
  name: string
  role: string
}

async function fetchConversations(userId: string): Promise<Conversation[]> {
  const { data: convRows } = await supabase
    .from('conversations')
    .select('id, participant_a, participant_b, updated_at')
    .or(`participant_a.eq.${userId},participant_b.eq.${userId}`)
    .order('updated_at', { ascending: false })

  if (!convRows || convRows.length === 0) return []

  const participantIds = [
    ...new Set(
      (convRows as ConvRow[]).flatMap(c => [c.participant_a, c.participant_b]).filter(id => id !== userId)
    ),
  ]

  const [{ data: participants }, { data: allMsgs }] = await Promise.all([
    supabase.from('profiles').select('id, name, role').in('id', participantIds),
    supabase
      .from('messages')
      .select('id, conversation_id, sender_id, content, read, created_at')
      .in('conversation_id', (convRows as ConvRow[]).map(c => c.id))
      .order('created_at', { ascending: true }),
  ])

  const profileMap = Object.fromEntries((participants as ProfileRow[] ?? []).map(p => [p.id, p]))
  const msgsByConv = ((allMsgs as MsgRow[]) ?? []).reduce((acc, m) => {
    if (!acc[m.conversation_id]) acc[m.conversation_id] = []
    acc[m.conversation_id].push(m)
    return acc
  }, {} as Record<string, MsgRow[]>)

  return (convRows as ConvRow[]).map(conv => {
    const otherId = conv.participant_a === userId ? conv.participant_b : conv.participant_a
    const other = profileMap[otherId]
    const msgs = msgsByConv[conv.id] ?? []
    const lastMsg = msgs[msgs.length - 1]
    const unread = msgs.filter(m => m.sender_id !== userId && !m.read).length

    const messages: Message[] = msgs.map(m => ({
      id: m.id,
      senderId: m.sender_id,
      senderName: m.sender_id === userId ? '' : other?.name ?? '',
      content: m.content,
      timestamp: m.created_at,
      read: m.read,
    }))

    return {
      id: conv.id,
      participantId: otherId,
      participantName: other?.name ?? 'Usuário',
      participantRole: (other?.role ?? 'teacher') as Conversation['participantRole'],
      lastMessage: lastMsg?.content ?? '',
      lastMessageTime: relativeTime(conv.updated_at),
      unreadCount: unread,
      messages,
    }
  })
}

// --------------- component ---------------

export function Messages() {
  const user = useAuthStore(s => s.user)
  const t = useTranslation()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    fetchConversations(user.id).then(data => {
      if (!cancelled) { setConversations(data); setLoading(false) }
    })
    return () => { cancelled = true }
  }, [user])

  // scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedId, conversations])

  const selected = conversations.find(c => c.id === selectedId)

  const handleSelect = (conv: Conversation) => {
    setSelectedId(conv.id)
    setConversations(prev => prev.map(c =>
      c.id === conv.id ? { ...c, unreadCount: 0 } : c
    ))
    // mark messages as read in db (fire-and-forget)
    supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conv.id)
      .neq('sender_id', user?.id ?? '')
      .then(() => {})
  }

  const handleSend = async () => {
    if (!newMessage.trim() || !selected || !user) return
    setSending(true)

    const content = newMessage.trim()
    setNewMessage('')

    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    }
    setConversations(prev => prev.map(c =>
      c.id === selectedId
        ? { ...c, messages: [...c.messages, optimistic], lastMessage: content, lastMessageTime: 'agora' }
        : c
    ))

    const { data: inserted } = await supabase
      .from('messages')
      .insert({ conversation_id: selected.id, sender_id: user.id, content })
      .select('id')
      .single()

    // replace optimistic with real id
    if (inserted) {
      setConversations(prev => prev.map(c =>
        c.id === selectedId
          ? { ...c, messages: c.messages.map(m => m.id === optimistic.id ? { ...m, id: inserted.id } : m) }
          : c
      ))
    }

    // update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', selected.id)

    setSending(false)
  }

  const filtered = conversations.filter(c =>
    c.participantName.toLowerCase().includes(search.toLowerCase())
  )

  const ConversationList = (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[#E2E8F0] flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
          <input
            aria-label={t('messages.searchConversation')}
            className="input pl-8 h-8 text-sm"
            placeholder={t('messages.searchConversation')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-slate-100 rounded w-24" />
                  <div className="h-3 bg-slate-100 rounded w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-[#94A3B8] text-sm">{t('messages.noConversation')}</div>
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
                    {conv.participantRole === 'teacher' ? t('messages.teacher') : t('messages.coordinator')}
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
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E2E8F0] bg-white flex-shrink-0">
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
            {selected.participantRole === 'teacher' ? t('messages.teacher') : t('messages.coordinator')} · {t('messages.respondsIn')}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selected.messages.map(msg => {
          const isMe = msg.senderId === user?.id
          return (
            <div key={msg.id} className={clsx('flex', isMe ? 'justify-end' : 'justify-start')}>
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] text-xs font-semibold mr-2 flex-shrink-0 mt-1">
                  {selected.participantName.charAt(0)}
                </div>
              )}
              <div className={clsx(
                'max-w-[75%] rounded-2xl px-4 py-2.5',
                isMe ? 'bg-[#1E3A8A] text-white rounded-br-sm' : 'bg-[#F1F5F9] text-[#0F172A] rounded-bl-sm'
              )}>
                <p className="text-sm">{msg.content}</p>
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
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-[#E2E8F0] bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <button type="button" title={t('messages.attach')} className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:text-[#64748B] transition-colors">
            <Paperclip size={18} />
          </button>
          <input
            aria-label={t('messages.typeMessage')}
            className="input flex-1 h-9"
            placeholder={t('messages.typeMessage')}
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          />
          <button
            type="button"
            title={t('messages.send')}
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
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
        <p className="font-medium">{t('messages.selectConversation')}</p>
      </div>
    </div>
  )

  return (
    <>
      <Header title={t('messages.title')} />

      <div className="card overflow-hidden flex h-[calc(100vh-140px)]">
        <div className={clsx(
          'border-r border-[#E2E8F0] flex-shrink-0 md:w-72',
          selectedId ? 'hidden md:flex md:flex-col' : 'flex flex-col w-full'
        )}>
          {ConversationList}
        </div>

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
