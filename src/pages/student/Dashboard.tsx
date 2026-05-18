import { useNavigate } from 'react-router-dom'
import {
  Clock, AlertTriangle, ArrowRight, BookOpen,
  TrendingUp, Star, Zap
} from 'lucide-react'
import { Header } from '../../components/Header'
import { EmptyState } from '../../components/EmptyState'
import { mockAnnouncements, getDaysUntil } from '../../data/mock'
import { useClasses } from '../../hooks/useClasses'
import { useActivities } from '../../hooks/useActivities'
import { useAuthStore } from '../../store/auth'
import { useTranslation } from '../../i18n'
import { SkStudentDashboard } from '../../components/Skeleton'
import clsx from 'clsx'

export function StudentDashboard() {
  const navigate = useNavigate()
  const t = useTranslation()
  const user = useAuthStore(s => s.user)
  const { data: classes = [], isLoading: loadingClasses } = useClasses()
  const { data: activities = [], isLoading: loadingActivities } = useActivities()
  const isLoading = loadingClasses || loadingActivities

  const progressBySubject = classes.map(c => ({
    subjectId: c.subjectId,
    name: c.subjectName,
    color: c.color,
    progress: c.deliveryRate,
    grade: c.average ?? 0,
  }))

  const generalAverage = progressBySubject.filter(s => s.grade > 0).length
    ? progressBySubject.filter(s => s.grade > 0).reduce((a, s) => a + s.grade, 0) /
      progressBySubject.filter(s => s.grade > 0).length
    : 0
  const pending = activities.filter(a => a.status === 'pending' || a.status === 'upcoming' || a.status === 'late')
  const sorted = [...pending].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const recentGrades = [
    { subject: 'Matemática', color: '#1E3A8A', assessment: 'Prova 1', grade: 8.0, date: 'hoje' },
    { subject: 'Biologia', color: '#059669', assessment: 'Participação', grade: 9.5, date: 'ontem' },
    { subject: 'Português', color: '#7C3AED', assessment: 'Trabalho', grade: 8.5, date: '3 dias' },
  ]

  function CountdownBadge({ dueDate }: { dueDate: string }) {
    const days = getDaysUntil(dueDate)
    if (days < 0) return <span className="badge-danger">{t('student.activities.late2')}</span>
    if (days === 0) return <span className="badge-danger">{t('common.today')}</span>
    if (days === 1) return <span className="badge-warning">{t('common.tomorrow')}</span>
    if (days <= 3) return <span className="badge-warning">{t('common.days', { n: days })}</span>
    return <span className="badge-neutral">{t('common.days', { n: days })}</span>
  }

  const quickAccess = [
    { label: t('student.dashboard.calendar'), icon: '📅', path: '/calendar' },
    { label: t('student.dashboard.reportCard'), icon: '📊', path: '/student/report-card' },
    { label: t('student.dashboard.messages'), icon: '💬', path: '/messages' },
    { label: t('student.dashboard.classes'), icon: '📚', path: '/student/classes' },
  ]

  if (isLoading) {
    return (
      <>
        <Header title={t('student.dashboard.title')} />
        <SkStudentDashboard />
      </>
    )
  }

  return (
    <>
      <Header
        title={t('student.dashboard.title')}
        actions={
          <span className="text-xs text-[#94A3B8] hidden md:block">
            3º Ano A · 2º Bimestre
          </span>
        }
      />

      <div className="space-y-6">
        {/* Welcome bar */}
        <div className="card p-4 bg-gradient-to-r from-[#1E3A8A] to-[#1e40af] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-semibold text-lg">{t('student.dashboard.goodMorning', { name: user?.name.split(' ')[0] ?? '' })}</h2>
            <p className="text-blue-200 text-sm mt-0.5">
              {t('student.dashboard.youHave')} <span className="font-semibold text-white">{sorted.filter(a => getDaysUntil(a.dueDate) <= 3).length} atividades</span> {t('student.dashboard.activitiesIn3Days')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-blue-200">{t('student.dashboard.generalAverage')}</p>
              <p className="text-2xl font-bold">{generalAverage > 0 ? generalAverage.toFixed(1).replace('.', ',') : '—'}</p>
            </div>
            <TrendingUp size={32} className="text-blue-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activities column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-[#0F172A]">{t('student.dashboard.upcomingActivities')}</h3>
              <button
                type="button"
                onClick={() => navigate('/student/activities')}
                className="text-sm text-[#1E3A8A] hover:underline flex items-center gap-1"
              >
                {t('student.dashboard.viewAll')} <ArrowRight size={14} />
              </button>
            </div>

            {sorted.length === 0 ? (
              <EmptyState
                variant="done"
                title={t('student.dashboard.noActivitiesPending')}
                description={t('student.dashboard.upToDate')}
                action={{ label: t('student.dashboard.viewAll'), onClick: () => navigate('/student/activities') }}
              />
            ) : (
              <div className="space-y-3">
                {sorted.map(act => {
                  const days = getDaysUntil(act.dueDate)
                  return (
                    <button
                      type="button"
                      key={act.id}
                      onClick={() => navigate(`/student/submit/${act.id}`)}
                      className="activity-card w-full text-left"
                      style={{ borderLeftColor: act.subjectColor }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="subject-pill text-xs"
                              style={{ backgroundColor: act.subjectColor + '15', color: act.subjectColor }}
                            >
                              {act.subjectName}
                            </span>
                            <span className="text-xs text-[#94A3B8]">{t('activityTypes.' + act.type)}</span>
                          </div>
                          <h4 className="text-sm font-medium text-[#0F172A] line-clamp-1">{act.title}</h4>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-[#64748B]">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(act.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                              {' '}às{' '}
                              {new Date(act.dueDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span>{t('student.dashboard.weight', { w: act.weight })}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <CountdownBadge dueDate={act.dueDate} />
                          {act.status === 'late' && (
                            <span className="flex items-center gap-1 text-[11px] text-red-500">
                              <AlertTriangle size={11} /> {t('student.activities.late2')}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Announcements */}
            <div className="flex items-center justify-between mt-2">
              <h3 className="font-display font-semibold text-[#0F172A]">{t('student.dashboard.bulletinBoard')}</h3>
            </div>
            <div className="space-y-3">
              {mockAnnouncements.slice(0, 3).map(ann => (
                <div
                  key={ann.id}
                  className={clsx(
                    'card p-4',
                    ann.urgent && 'border-red-300 border-2'
                  )}
                >
                  {ann.urgent && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Zap size={12} className="text-[#DC2626]" />
                      <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wide">{t('student.dashboard.urgent')}</span>
                    </div>
                  )}
                  <h4 className="text-sm font-medium text-[#0F172A]">{ann.title}</h4>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{ann.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-[#94A3B8]">{ann.author} · {ann.timestamp}</span>
                    {ann.type === 'enquete' && ann.pollOptions && (
                      <span className="text-[11px] text-[#1E3A8A]">{ann.pollOptions.reduce((a, b) => a + b.votes, 0)} {t('student.dashboard.votes')}</span>
                    )}
                  </div>
                  {ann.type === 'enquete' && ann.pollOptions && (
                    <div className="mt-3 space-y-1.5">
                      {ann.pollOptions.map(opt => {
                        const total = ann.pollOptions!.reduce((a, b) => a + b.votes, 0)
                        const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0
                        return (
                          <div key={opt.text} className="space-y-0.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-[#64748B]">{opt.text}</span>
                              <span className="font-medium text-[#0F172A]">{pct}%</span>
                            </div>
                            <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#1E3A8A] rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Recent grades */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star size={16} className="text-[#D97706]" />
                <h3 className="font-display font-semibold text-[#0F172A] text-sm">{t('student.dashboard.recentGrades')}</h3>
              </div>
              <div className="space-y-2.5">
                {recentGrades.map((g, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: g.color }}
                      />
                      <div>
                        <p className="text-xs font-medium text-[#0F172A]">{g.subject}</p>
                        <p className="text-[11px] text-[#94A3B8]">{g.assessment} · {g.date}</p>
                      </div>
                    </div>
                    <span className={clsx(
                      'text-sm font-bold',
                      g.grade >= 7 ? 'text-emerald-600' : g.grade >= 5 ? 'text-amber-600' : 'text-red-600'
                    )}>
                      {g.grade.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('/student/report-card')}
                className="mt-3 w-full btn-ghost text-xs"
              >
                {t('student.dashboard.viewFullReportCard')}
              </button>
            </div>

            {/* Progress by subject */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-[#1E3A8A]" />
                <h3 className="font-display font-semibold text-[#0F172A] text-sm">{t('student.dashboard.subjectProgress')}</h3>
              </div>
              <div className="space-y-3">
                {progressBySubject.map(s => (
                  <div key={s.subjectId}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[#0F172A]">{s.name}</span>
                      <span className={clsx(
                        'text-xs font-bold',
                        s.grade >= 7 ? 'text-emerald-600' : s.grade >= 5 ? 'text-amber-600' : 'text-red-600'
                      )}>
                        {s.grade.toFixed(1)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${s.progress}%`, backgroundColor: s.color }}
                      />
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{t('student.dashboard.completed', { pct: s.progress })}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="card p-4">
              <h3 className="font-display font-semibold text-[#0F172A] text-sm mb-3">{t('student.dashboard.quickAccess')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickAccess.map(item => (
                  <button
                    type="button"
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg bg-[#F8FAFC] hover:bg-blue-50 border border-[#E2E8F0] hover:border-[#1E3A8A]/20 transition-all text-xs font-medium text-[#64748B] hover:text-[#1E3A8A]"
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
