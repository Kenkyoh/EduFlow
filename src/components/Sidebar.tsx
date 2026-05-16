import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Calendar, FileText, MessageSquare,
  Bell, Settings, LogOut, ChevronLeft, ChevronRight, GraduationCap,
  Users, BarChart3, ClipboardList, Building2, UserCircle,
} from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { useNotificationsStore } from '../store/notifications'
import { UserAvatar } from './UserAvatar'
import { useState } from 'react'
import clsx from 'clsx'
import { ROLE_LABELS } from '../utils/roleLabels'

export function Sidebar() {
  const user              = useAuthStore(s => s.user)
  const logout            = useAuthStore(s => s.logout)
  const unreadCount       = useNotificationsStore(s => s.unreadCount)
  const openNotifications = useNotificationsStore(s => s.openPanel)
  const navigate          = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const studentLinks = [
    { to: '/student',              icon: LayoutDashboard, label: 'Dashboard'     },
    { to: '/student/classes',      icon: BookOpen,        label: 'Minhas Turmas' },
    { to: '/student/activities',   icon: ClipboardList,   label: 'Atividades'    },
    { to: '/student/report-card',  icon: FileText,        label: 'Boletim'       },
    { to: '/calendar',             icon: Calendar,        label: 'Calendário'    },
    { to: '/messages',             icon: MessageSquare,   label: 'Mensagens'     },
    { to: '/profile',              icon: UserCircle,      label: 'Meu Perfil'    },
  ]

  const teacherLinks = [
    { to: '/teacher',              icon: LayoutDashboard, label: 'Dashboard'  },
    { to: '/teacher/classes',      icon: BookOpen,        label: 'Turmas'     },
    { to: '/teacher/grades',       icon: ClipboardList,   label: 'Notas'      },
    { to: '/calendar',             icon: Calendar,        label: 'Calendário' },
    { to: '/messages',             icon: MessageSquare,   label: 'Mensagens'  },
    { to: '/profile',              icon: UserCircle,      label: 'Meu Perfil' },
  ]

  const coordinatorLinks = [
    { to: '/coordinator',          icon: LayoutDashboard, label: 'Dashboard'      },
    { to: '/coordinator/classes',  icon: Users,           label: 'Turmas'         },
    { to: '/coordinator/analytics',icon: BarChart3,       label: 'Analytics'      },
    { to: '/calendar',             icon: Calendar,        label: 'Calendário'     },
    { to: '/messages',             icon: MessageSquare,   label: 'Mensagens'      },
    { to: '/profile',              icon: UserCircle,      label: 'Meu Perfil'     },
    { to: '/settings',             icon: Settings,        label: 'Configurações'  },
  ]

  const adminLinks = [
    { to: '/admin',                icon: LayoutDashboard, label: 'Dashboard'      },
    { to: '/admin/schools',        icon: Building2,       label: 'Escolas'        },
    { to: '/admin/settings',       icon: Settings,        label: 'Configurações'  },
  ]

  const guardianLinks = [
    { to: '/guardian',             icon: LayoutDashboard, label: 'Dashboard'      },
    { to: '/messages',             icon: MessageSquare,   label: 'Mensagens'      },
    { to: '/profile',              icon: UserCircle,      label: 'Meu Perfil'     },
  ]

  const links =
    user?.role === 'student'     ? studentLinks
    : user?.role === 'teacher'   ? teacherLinks
    : user?.role === 'admin'     ? adminLinks
    : user?.role === 'guardian'  ? guardianLinks
    : coordinatorLinks

  const endPaths = new Set(['/student', '/teacher', '/coordinator', '/admin', '/guardian'])

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-full bg-white border-r border-[#E2E8F0] flex flex-col z-30 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="h-[60px] flex items-center px-4 border-b border-[#E2E8F0] flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-600 text-[#0F172A] text-lg tracking-tight">EduFlow</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center mx-auto">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={endPaths.has(to)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-blue-50 text-[#1E3A8A]'
                  : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]'
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {/* Notifications */}
        <button
          type="button"
          onClick={openNotifications}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] transition-all relative"
          title={collapsed ? 'Notificações' : undefined}
        >
          <Bell size={18} className="flex-shrink-0" />
          {!collapsed && <span>Notificações</span>}
          {unreadCount > 0 && (
            <span className="absolute top-1.5 left-7 w-4.5 h-4.5 rounded-full bg-[#DC2626] text-white text-[10px] flex items-center justify-center font-bold min-w-[18px] h-[18px] px-1">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </nav>

      {/* User section */}
      <div className="border-t border-[#E2E8F0] p-3 space-y-1">
        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:bg-slate-100 hover:text-[#64748B] transition-all"
        >
          {collapsed ? <ChevronRight size={14} /> : (
            <>
              <ChevronLeft size={14} />
              <span>Recolher menu</span>
            </>
          )}
        </button>

        {collapsed ? (
          /* Collapsed: avatar only, click → profile */
          user?.role !== 'admin' && (
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full flex justify-center py-1 hover:opacity-80 transition-opacity"
              title={user?.name}
            >
              <UserAvatar user={user} size={28} />
            </button>
          )
        ) : (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors">
            {/* Avatar — click goes to profile (non-admin) */}
            {user?.role !== 'admin' ? (
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="hover:opacity-80 transition-opacity flex-shrink-0"
                title="Ver perfil"
              >
                <UserAvatar user={user} size={28} />
              </button>
            ) : (
              <UserAvatar user={user} size={28} />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#0F172A] truncate">{user?.name}</p>
              <p className="text-[11px] text-[#94A3B8]">
                {ROLE_LABELS[user?.role ?? ''] ?? user?.role}
              </p>
            </div>

            <button
              type="button"
              onClick={() => { logout(); navigate('/login') }}
              className="text-[#94A3B8] hover:text-[#DC2626] transition-colors flex-shrink-0"
              title="Sair"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
