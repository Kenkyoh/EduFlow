import { X, Bell, BookOpen, Clock, MessageSquare, AlertCircle, CheckCircle, Check } from 'lucide-react'
import { useNotificationsStore } from '../store/notifications'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import clsx from 'clsx'
import type { Notification } from '../types'

const typeIcons: Record<string, React.ReactNode> = {
  grade: <BookOpen size={16} className="text-[#1E3A8A]" />,
  deadline: <Clock size={16} className="text-[#D97706]" />,
  message: <MessageSquare size={16} className="text-[#7C3AED]" />,
  announcement: <Bell size={16} className="text-[#059669]" />,
  system: <AlertCircle size={16} className="text-[#64748B]" />,
}

const typeColors: Record<string, string> = {
  grade: 'bg-blue-50',
  deadline: 'bg-amber-50',
  message: 'bg-purple-50',
  announcement: 'bg-emerald-50',
  system: 'bg-slate-50',
}

const filters = ['Tudo', 'Notas', 'Prazos', 'Avisos', 'Mensagens'] as const
type Filter = typeof filters[number]

const filterMap: Record<Filter, string | null> = {
  Tudo: null,
  Notas: 'grade',
  Prazos: 'deadline',
  Avisos: 'announcement',
  Mensagens: 'message',
}

export function NotificationsPanel() {
  const { notifications, isOpen, closePanel, markAsRead, markAllAsRead } = useNotificationsStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('Tudo')

  if (!isOpen) return null

  const filtered = filterMap[filter]
    ? notifications.filter(n => n.type === filterMap[filter])
    : notifications

  const handleClick = (n: Notification) => {
    markAsRead(n.id)
    if (n.actionPath) {
      navigate(n.actionPath)
      closePanel()
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={closePanel}
      />
      <div className="fixed top-0 right-0 h-full w-80 bg-white border-l border-[#E2E8F0] z-50 flex flex-col shadow-modal animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[#0F172A]" />
            <h2 className="font-display font-semibold text-[#0F172A]">Notificações</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="text-xs text-[#1E3A8A] hover:underline flex items-center gap-1"
            >
              <Check size={12} /> Marcar todas
            </button>
            <button
              onClick={closePanel}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#64748B]"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1 p-2 border-b border-[#E2E8F0] overflow-x-auto scrollbar-hide">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                filter === f
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#94A3B8]">
              <Bell size={32} strokeWidth={1.5} />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {filtered.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={clsx(
                    'w-full text-left flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors',
                    !n.read && 'bg-blue-50/30'
                  )}
                >
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    typeColors[n.type]
                  )}>
                    {typeIcons[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={clsx(
                        'text-sm line-clamp-1',
                        n.read ? 'text-[#64748B]' : 'font-medium text-[#0F172A]'
                      )}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#1E3A8A] flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 line-clamp-2">{n.body}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] text-[#94A3B8]">{n.timestamp}</span>
                      {n.actionLabel && (
                        <span className="text-[11px] text-[#1E3A8A] font-medium">{n.actionLabel} →</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
