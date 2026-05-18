import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, Clock, AlertTriangle, ChevronRight,
  BookOpen, Calendar, Bell,
} from 'lucide-react'
import { useAuthStore } from '../../store/auth'
import { mockGuardianStudents } from '../../data/mock'
import { Header } from '../../components/Header'
import { EmptyState } from '../../components/EmptyState'
import { useTranslation } from '../../i18n'
import { SkGuardianDashboard } from '../../components/Skeleton'
import clsx from 'clsx'

const EVENT_ICONS = {
  grade:      { icon: TrendingUp,    color: 'text-[#1E3A8A]', bg: 'bg-blue-50'    },
  activity:   { icon: Clock,         color: 'text-amber-600', bg: 'bg-amber-50'   },
  attendance: { icon: AlertTriangle, color: 'text-red-500',   bg: 'bg-red-50'     },
  message:    { icon: Bell,          color: 'text-violet-600', bg: 'bg-violet-50' },
}

export function GuardianDashboard() {
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()
  const t = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { setIsLoading(false) }, [])

  const STATUS_CONFIG = {
    approved: { label: t('common.approved'),  className: 'bg-emerald-50 text-emerald-700' },
    recovery: { label: t('common.recovery'),  className: 'bg-amber-50 text-amber-700'     },
    failed:   { label: t('common.failed'),    className: 'bg-red-50 text-red-700'         },
    pending:  { label: t('common.waiting'),   className: 'bg-slate-100 text-slate-600'    },
  }

  const students = (user?.studentIds ?? [])
    .map(id => mockGuardianStudents[id])
    .filter(Boolean)

  if (isLoading) {
    return (
      <>
        <Header title={t('guardian.dashboard.title')} />
        <SkGuardianDashboard />
      </>
    )
  }

  return (
    <>
      <Header title={t('guardian.dashboard.title')} />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">
            {t('guardian.dashboard.welcome', { name: user?.name.split(' ')[0] ?? '' })}
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            {t('guardian.dashboard.subtitle')}
          </p>
        </div>

        {students.length === 0 ? (
          <EmptyState
            variant="students"
            title={t('guardian.dashboard.noStudents')}
            description={t('guardian.dashboard.noStudentsDesc')}
            action={{ label: t('guardian.dashboard.contactSchool'), onClick: () => navigate('/messages') }}
          />
        ) : (
          students.map(student => (
            <div key={student.id} className="space-y-4">
              {/* Student header card */}
              <div
                className="card p-5 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/guardian/student/${student.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1E3A8A] flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-[#0F172A] text-lg">{student.name}</h2>
                      <p className="text-sm text-[#64748B]">{student.class} · {student.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#1E3A8A] text-sm font-medium">
                    {t('guardian.dashboard.viewDetails')}
                    <ChevronRight size={16} />
                  </div>
                </div>

                {/* KPI strip */}
                <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-[#F1F5F9]">
                  {[
                    {
                      label: t('guardian.dashboard.generalAverage'),
                      value: student.overallAverage.toFixed(1),
                      icon: TrendingUp,
                      color: '#1E3A8A',
                      bg: '#EFF6FF',
                      alert: student.overallAverage < 6,
                    },
                    {
                      label: t('guardian.dashboard.attendance'),
                      value: `${student.attendance}%`,
                      icon: Calendar,
                      color: student.attendance < 75 ? '#DC2626' : '#059669',
                      bg:    student.attendance < 75 ? '#FEF2F2' : '#ECFDF5',
                      alert: student.attendance < 75,
                    },
                    {
                      label: t('guardian.dashboard.pending'),
                      value: student.pendingActivities,
                      icon: Clock,
                      color: '#D97706',
                      bg: '#FFFBEB',
                      alert: false,
                    },
                    {
                      label: t('guardian.dashboard.late'),
                      value: student.lateActivities,
                      icon: AlertTriangle,
                      color: student.lateActivities > 0 ? '#DC2626' : '#059669',
                      bg:    student.lateActivities > 0 ? '#FEF2F2' : '#ECFDF5',
                      alert: student.lateActivities > 0,
                    },
                  ].map(({ label, value, icon: Icon, color, bg, alert }) => (
                    <div key={label} className={clsx('rounded-xl p-3', alert ? 'ring-1 ring-red-200' : '')}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: bg }}>
                        <Icon size={15} style={{ color }} />
                      </div>
                      <p className="text-xl font-display font-bold text-[#0F172A]">{value}</p>
                      <p className="text-[11px] text-[#94A3B8]">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Subjects */}
                <div className="card">
                  <div className="flex items-center gap-2 px-5 pt-5 pb-4 border-b border-[#F1F5F9]">
                    <BookOpen size={15} className="text-[#94A3B8]" />
                    <h3 className="font-semibold text-sm text-[#0F172A]">{t('guardian.dashboard.subjectPerformance')}</h3>
                  </div>
                  <div className="divide-y divide-[#F8FAFC]">
                    {student.subjects.map(sub => (
                      <div key={sub.id} className="flex items-center gap-3 px-5 py-3">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: sub.color }}
                        />
                        <span className="text-sm text-[#0F172A] flex-1">{sub.name}</span>
                        <span className="text-sm font-bold text-[#0F172A] w-10 text-right">
                          {sub.average.toFixed(1)}
                        </span>
                        <span className={clsx(
                          'text-[10px] font-semibold px-2 py-0.5 rounded-full w-28 text-center',
                          STATUS_CONFIG[sub.status].className
                        )}>
                          {STATUS_CONFIG[sub.status].label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent events */}
                <div className="card">
                  <div className="flex items-center gap-2 px-5 pt-5 pb-4 border-b border-[#F1F5F9]">
                    <Bell size={15} className="text-[#94A3B8]" />
                    <h3 className="font-semibold text-sm text-[#0F172A]">{t('guardian.dashboard.recentEvents')}</h3>
                  </div>
                  <div className="divide-y divide-[#F8FAFC]">
                    {student.recentEvents.map(ev => {
                      const { icon: Icon, color, bg } = EVENT_ICONS[ev.type]
                      return (
                        <div key={ev.id} className="flex items-start gap-3 px-5 py-3">
                          <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', bg)}>
                            <Icon size={14} className={color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#0F172A] truncate">{ev.title}</p>
                            <p className="text-xs text-[#94A3B8]">{ev.detail}</p>
                          </div>
                          <p className="text-[10px] text-[#CBD5E1] whitespace-nowrap">{ev.date}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
