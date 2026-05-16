import { useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Calendar, FileText, MessageSquare,
  Bell, Settings, LogOut, ChevronLeft, ChevronRight, GraduationCap,
  Users, BarChart3, ClipboardList, Building2, UserCircle, X,
} from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { useNotificationsStore } from '../store/notifications'
import { useSidebarStore } from '../store/sidebar'
import { UserAvatar } from './UserAvatar'
import { useTranslation } from '../i18n'
import clsx from 'clsx'

export function Sidebar() {
  const user              = useAuthStore(s => s.user)
  const logout            = useAuthStore(s => s.logout)
  const unreadCount       = useNotificationsStore(s => s.unreadCount)
  const openNotifications = useNotificationsStore(s => s.openPanel)
  const { collapsed, mobileOpen, toggleCollapsed, closeMobile } = useSidebarStore()
  const navigate  = useNavigate()
  const location  = useLocation()
  const t = useTranslation()

  useEffect(() => { closeMobile() }, [location.pathname, closeMobile])

  const studentLinks = [
    { to: '/student',              icon: LayoutDashboard, label: t('nav.dashboard')    },
    { to: '/student/classes',      icon: BookOpen,        label: t('nav.myClasses')    },
    { to: '/student/activities',   icon: ClipboardList,   label: t('nav.activities')   },
    { to: '/student/report-card',  icon: FileText,        label: t('nav.reportCard')   },
    { to: '/calendar',             icon: Calendar,        label: t('nav.calendar')     },
    { to: '/messages',             icon: MessageSquare,   label: t('nav.messages')     },
    { to: '/profile',              icon: UserCircle,      label: t('nav.profile')      },
  ]

  const teacherLinks = [
    { to: '/teacher',              icon: LayoutDashboard, label: t('nav.dashboard')  },
    { to: '/teacher/classes',      icon: BookOpen,        label: t('nav.classes')    },
    { to: '/teacher/grades',       icon: ClipboardList,   label: t('nav.grades')     },
    { to: '/calendar',             icon: Calendar,        label: t('nav.calendar')   },
    { to: '/messages',             icon: MessageSquare,   label: t('nav.messages')   },
    { to: '/profile',              icon: UserCircle,      label: t('nav.profile')    },
  ]

  const coordinatorLinks = [
    { to: '/coordinator',           icon: LayoutDashboard, label: t('nav.dashboard')   },
    { to: '/coordinator/classes',   icon: Users,           label: t('nav.classes')     },
    { to: '/coordinator/analytics', icon: BarChart3,       label: t('nav.analytics')   },
    { to: '/calendar',              icon: Calendar,        label: t('nav.calendar')    },
    { to: '/messages',              icon: MessageSquare,   label: t('nav.messages')    },
    { to: '/profile',               icon: UserCircle,      label: t('nav.profile')     },
    { to: '/settings',              icon: Settings,        label: t('nav.settings')    },
  ]

  const adminLinks = [
    { to: '/admin',                icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/admin/schools',        icon: Building2,       label: t('nav.schools')   },
    { to: '/admin/settings',       icon: Settings,        label: t('nav.settings')  },
  ]

  const guardianLinks = [
    { to: '/guardian',             icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/messages',             icon: MessageSquare,   label: t('nav.messages')  },
    { to: '/profile',              icon: UserCircle,      label: t('nav.profile')   },
  ]

  const links =
    user?.role === 'student'    ? studentLinks
    : user?.role === 'teacher'  ? teacherLinks
    : user?.role === 'admin'    ? adminLinks
    : user?.role === 'guardian' ? guardianLinks
    : coordinatorLinks

  const endPaths = new Set(['/student', '/teacher', '/coordinator', '/admin', '/guardian'])

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={clsx(
          'fixed left-0 top-0 h-full bg-white border-r border-[#E2E8F0] flex flex-col z-30 transition-all duration-300',
          collapsed ? 'md:w-16' : 'md:w-60',
          'w-72',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-[60px] flex items-center px-4 border-b border-[#E2E8F0] flex-shrink-0">
          <div className={clsx('flex items-center gap-2', collapsed && 'md:justify-center')}>
            <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className={clsx('font-display font-600 text-[#0F172A] text-lg tracking-tight', collapsed && 'md:hidden')}>
              Vekta
            </span>
          </div>

          {/* Close button — mobile only */}
          <button
            type="button"
            onClick={closeMobile}
            className="ml-auto text-[#94A3B8] hover:text-[#0F172A] md:hidden"
            aria-label={t('nav.closeMenu')}
          >
            <X size={20} />
          </button>
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
              <Icon className="flex-shrink-0" size={18} />
              <span className={clsx(collapsed && 'md:hidden')}>{label}</span>
            </NavLink>
          ))}

          {/* Notifications */}
          <button
            type="button"
            onClick={openNotifications}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] transition-all relative"
            title={collapsed ? t('nav.notifications') : undefined}
          >
            <Bell size={18} className="flex-shrink-0" />
            <span className={clsx(collapsed && 'md:hidden')}>{t('nav.notifications')}</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 left-7 min-w-[18px] h-[18px] rounded-full bg-[#DC2626] text-white text-[10px] flex items-center justify-center font-bold px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </nav>

        {/* User section */}
        <div className="border-t border-[#E2E8F0] p-3 space-y-1">
          {/* Collapse toggle — desktop only */}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden md:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:bg-slate-100 hover:text-[#64748B] transition-all"
          >
            {collapsed ? <ChevronRight size={14} /> : (
              <>
                <ChevronLeft size={14} />
                <span>{t('nav.collapseMenu')}</span>
              </>
            )}
          </button>

          {/* Collapsed desktop: avatar only */}
          {collapsed ? (
            user?.role !== 'admin' && (
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="hidden md:flex w-full justify-center py-1 hover:opacity-80 transition-opacity"
                title={user?.name}
              >
                <UserAvatar user={user} size={28} />
              </button>
            )
          ) : null}

          {/* Expanded: full user row */}
          <div className={clsx(
            'flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors',
            collapsed && 'md:hidden'
          )}>
            {user?.role !== 'admin' ? (
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="hover:opacity-80 transition-opacity flex-shrink-0"
                title={t('nav.profile')}
              >
                <UserAvatar user={user} size={28} />
              </button>
            ) : (
              <UserAvatar user={user} size={28} />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#0F172A] truncate">{user?.name}</p>
              <p className="text-[11px] text-[#94A3B8]">
                {user?.role ? t(`roles.${user.role}`) : ''}
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
        </div>
      </aside>
    </>
  )
}
