import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Upload, Filter, CheckCircle, AlertTriangle } from 'lucide-react'
import { Header } from '../../components/Header'
import { mockActivities, getActivityTypeLabel, getDaysUntil, mockSubjects } from '../../data/mock'
import { useSearchStore } from '../../store/search'
import { useTranslation } from '../../i18n'
import clsx from 'clsx'

export function StudentActivities() {
  const navigate = useNavigate()
  const t = useTranslation()
  const query = useSearchStore(s => s.query)
  const [filter, setFilter] = useState<'all' | 'pending' | 'late' | 'submitted'>('all')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')

  const filtered = mockActivities.filter(a => {
    if (filter === 'pending') return a.status === 'pending' || a.status === 'upcoming'
    if (filter === 'late') return a.status === 'late' || getDaysUntil(a.dueDate) < 0
    if (filter === 'submitted') return a.status === 'submitted' || a.status === 'graded'
    return true
  }).filter(a => subjectFilter === 'all' || a.subjectId === subjectFilter)
    .filter(a =>
      !query ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subjectName.toLowerCase().includes(query.toLowerCase())
    )

  const sorted = [...filtered].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  return (
    <>
      <Header title={t('student.activities.title')} />

      <div className="space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex rounded-lg border border-[#E2E8F0] overflow-hidden">
            {[
              { id: 'all', label: t('student.activities.all') },
              { id: 'pending', label: t('student.activities.pending') },
              { id: 'late', label: t('student.activities.late') },
              { id: 'submitted', label: t('student.activities.submitted') },
            ].map(f => (
              <button
                type="button"
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  filter === f.id ? 'bg-[#1E3A8A] text-white' : 'bg-white text-[#64748B] hover:bg-slate-50'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <select
            className="input h-9 text-sm w-40"
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
          >
            <option value="all">{t('student.activities.allSubjects')}</option>
            {mockSubjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: t('student.activities.stats.pending'), value: mockActivities.filter(a => a.status === 'pending' || a.status === 'upcoming').length, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: t('student.activities.stats.late'), value: mockActivities.filter(a => a.status === 'late').length, color: 'text-red-600', bg: 'bg-red-50' },
            { label: t('student.activities.stats.submitted'), value: mockActivities.filter(a => a.status === 'submitted' || a.status === 'graded').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map(stat => (
            <div key={stat.label} className={clsx('card p-4 flex items-center gap-3', stat.bg)}>
              <p className={clsx('text-2xl font-bold font-display', stat.color)}>{stat.value}</p>
              <p className="text-sm text-[#64748B]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Activities list */}
        {sorted.length === 0 ? (
          <div className="card p-12 flex flex-col items-center gap-3 text-[#94A3B8]">
            <CheckCircle size={40} strokeWidth={1.5} />
            <p className="font-medium">{t('student.activities.noActivitiesFound')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map(act => {
              const days = getDaysUntil(act.dueDate)
              const isLate = days < 0
              return (
                <div key={act.id} className="activity-card" style={{ borderLeftColor: act.subjectColor }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="subject-pill text-xs"
                          style={{ backgroundColor: act.subjectColor + '15', color: act.subjectColor }}
                        >
                          {act.subjectName}
                        </span>
                        <span className="text-xs text-[#94A3B8]">{t('activityTypes.' + act.type)}</span>
                        <span className="text-xs text-[#94A3B8]">· {act.weight}%</span>
                      </div>
                      <h4 className="text-sm font-medium text-[#0F172A]">{act.title}</h4>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-[#64748B]">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(act.dueDate).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(act.dueDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {act.classNames.map(n => (
                          <span key={n} className="bg-slate-100 px-1.5 py-0.5 rounded">{n}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className={clsx(
                        'flex items-center gap-1 text-xs font-medium',
                        isLate ? 'text-red-500' : days <= 1 ? 'text-amber-600' : 'text-[#64748B]'
                      )}>
                        {isLate ? <AlertTriangle size={12} /> : <Clock size={12} />}
                        {isLate
                          ? t('student.activities.late2')
                          : days === 0
                          ? t('student.activities.today')
                          : days === 1
                          ? t('student.activities.tomorrow')
                          : t('student.activities.days', { n: days })}
                      </div>
                      {act.status === 'submitted' || act.status === 'graded' ? (
                        <span className="badge-success">{t('student.activities.submitted')}</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate(`/student/submit/${act.id}`)}
                          className={clsx(
                            'text-xs h-7 px-3 inline-flex items-center gap-1 rounded-lg font-medium transition-colors',
                            isLate
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-[#1E3A8A] text-white hover:bg-[#1e40af]'
                          )}
                        >
                          <Upload size={12} />
                          {isLate ? t('student.activities.deliverLate') : t('student.activities.deliver')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
