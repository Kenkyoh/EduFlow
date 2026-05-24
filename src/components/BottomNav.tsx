import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, ClipboardList, Calendar,
  MessageSquare, Users, BarChart3, Building2, UserCircle,
} from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { useTranslation } from '../i18n'
import clsx from 'clsx'

const endPaths = new Set(['/student', '/teacher', '/coordinator', '/admin', '/guardian'])

export function BottomNav() {
  const user = useAuthStore(s => s.user)
  const t = useTranslation()

  const links = (() => {
    switch (user?.role) {
      case 'student':
        return [
          { to: '/student',            icon: LayoutDashboard, label: t('nav.dashboard')  },
          { to: '/student/classes',    icon: BookOpen,        label: t('nav.myClasses')  },
          { to: '/student/activities', icon: ClipboardList,   label: t('nav.activities') },
          { to: '/calendar',           icon: Calendar,        label: t('nav.calendar')   },
          { to: '/messages',           icon: MessageSquare,   label: t('nav.messages')   },
        ]
      case 'teacher':
        return [
          { to: '/teacher',         icon: LayoutDashboard, label: t('nav.dashboard') },
          { to: '/teacher/classes', icon: BookOpen,        label: t('nav.classes')   },
          { to: '/teacher/grades',  icon: ClipboardList,   label: t('nav.grades')    },
          { to: '/calendar',        icon: Calendar,        label: t('nav.calendar')  },
          { to: '/messages',        icon: MessageSquare,   label: t('nav.messages')  },
        ]
      case 'coordinator':
        return [
          { to: '/coordinator',           icon: LayoutDashboard, label: t('nav.dashboard') },
          { to: '/coordinator/classes',   icon: Users,           label: t('nav.classes')   },
          { to: '/coordinator/analytics', icon: BarChart3,       label: t('nav.analytics') },
          { to: '/calendar',              icon: Calendar,        label: t('nav.calendar')  },
          { to: '/messages',              icon: MessageSquare,   label: t('nav.messages')  },
        ]
      case 'admin':
        return [
          { to: '/admin',         icon: LayoutDashboard, label: t('nav.dashboard') },
          { to: '/admin/schools', icon: Building2,       label: t('nav.schools')   },
        ]
      case 'guardian':
        return [
          { to: '/guardian',  icon: LayoutDashboard, label: t('nav.dashboard') },
          { to: '/messages',  icon: MessageSquare,   label: t('nav.messages')  },
          { to: '/profile',   icon: UserCircle,      label: t('nav.profile')   },
        ]
      default:
        return []
    }
  })()

  if (!user || links.length === 0) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-[#E2E8F0] dark:border-slate-700 flex md:hidden z-30 safe-area-bottom">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={endPaths.has(to)}
          className={({ isActive }) =>
            clsx(
              'flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors',
              isActive
                ? 'text-[#1E3A8A] dark:text-blue-400'
                : 'text-[#94A3B8] dark:text-slate-500'
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className={clsx(
                'w-8 h-8 flex items-center justify-center rounded-xl transition-all',
                isActive ? 'bg-blue-50 dark:bg-blue-900/30' : ''
              )}>
                <Icon size={18} />
              </div>
              <span className="truncate max-w-[56px]">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
