import { Bell, Search } from 'lucide-react'
import { useNotificationsStore } from '../store/notifications'
import { useAuthStore } from '../store/auth'
import { UserAvatar } from './UserAvatar'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  actions?: React.ReactNode
}

export function Header({ title, actions }: HeaderProps) {
  const user = useAuthStore(s => s.user)
  const unreadCount = useNotificationsStore(s => s.unreadCount)
  const openNotifications = useNotificationsStore(s => s.openPanel)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  return (
    <header className="fixed top-0 right-0 left-60 h-[60px] bg-white border-b border-[#E2E8F0] flex items-center px-6 gap-4 z-20">
      <h1 className="font-display font-semibold text-[#0F172A] text-lg flex-shrink-0">
        {title}
      </h1>

      {/* Search */}
      <div className="relative flex-1 max-w-xs ml-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input
          className="input pl-9 h-8 text-sm"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {actions}

        {/* Notification Bell */}
        <button
          type="button"
          onClick={openNotifications}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] transition-all"
          aria-label="Notificações"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[10px] flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Avatar — click goes to profile (non-admin) */}
        <button
          type="button"
          onClick={() => user?.role !== 'admin' && navigate('/profile')}
          className={user?.role !== 'admin' ? 'hover:opacity-80 transition-opacity' : 'cursor-default'}
          title={user?.role !== 'admin' ? 'Meu perfil' : user?.name}
        >
          <UserAvatar user={user} size={32} />
        </button>
      </div>
    </header>
  )
}
