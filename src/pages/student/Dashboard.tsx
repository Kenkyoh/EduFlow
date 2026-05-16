import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock, CheckCircle, AlertTriangle, ArrowRight, BookOpen,
  TrendingUp, Bell, Star, Zap
} from 'lucide-react'
import { Header } from '../../components/Header'
import { mockActivities, mockAnnouncements, mockSubjects, formatDueDate, getDaysUntil, getActivityTypeLabel } from '../../data/mock'
import clsx from 'clsx'

function CountdownBadge({ dueDate }: { dueDate: string }) {
  const days = getDaysUntil(dueDate)
  if (days < 0) return <span className="badge-danger">Atrasado</span>
  if (days === 0) return <span className="badge-danger">Hoje</span>
  if (days === 1) return <span className="badge-warning">Amanhã</span>
  if (days <= 3) return <span className="badge-warning">{days} dias</span>
  return <span className="badge-neutral">{days} dias</span>
}

const progressBySubject = [
  { subjectId: 'mat', name: 'Matemática', color: '#1E3A8A', progress: 72, grade: 8.1 },
  { subjectId: 'port', name: 'Português', color: '#7C3AED', progress: 68, grade: 7.6 },
  { subjectId: 'hist', name: 'História', color: '#DC2626', progress: 55, grade: 6.0 },
  { subjectId: 'bio', name: 'Biologia', color: '#059669', progress: 85, grade: 9.2 },
  { subjectId: 'fis', name: 'Física', color: '#D97706', progress: 48, grade: 4.9 },
]

export function StudentDashboard() {
  const navigate = useNavigate()
  const pending = mockActivities.filter(a => a.status === 'pending' || a.status === 'upcoming' || a.status === 'late')
  const sorted = [...pending].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const recentGrades = [
    { subject: 'Matemática', color: '#1E3A8A', assessment: 'Prova 1', grade: 8.0, date: 'hoje' },
    { subject: 'Biologia', color: '#059669', assessment: 'Participação', grade: 9.5, date: 'ontem' },
    { subject: 'Português', color: '#7C3AED', assessment: 'Trabalho', grade: 8.5, date: '3 dias' },
  ]

  return (
    <>
      <Header
        title="Dashboard"
        actions={
          <span className="text-xs text-[#94A3B8] hidden md:block">
            3º Ano A · 2º Bimestre
          </span>
        }
      />

      <div className="space-y-6">
        {/* Welcome bar */}
        <div className="card p-4 bg-gradient-to-r from-[#1E3A8A] to-[#1e40af] text-white flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-lg">Bom dia, Lucas! 👋</h2>
            <p className="text-blue-200 text-sm mt-0.5">
              Você tem <span className="font-semibold text-white">{sorted.filter(a => getDaysUntil(a.dueDate) <= 3).length} atividades</span> nos próximos 3 dias
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-blue-200">Média geral</p>
              <p className="text-2xl font-bold">7,2</p>
            </div>
            <TrendingUp size={32} className="text-blue-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activities column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-[#0F172A]">Próximas Atividades</h3>
              <button
                type="button"
                onClick={() => navigate('/student/activities')}
                className="text-sm text-[#1E3A8A] hover:underline flex items-center gap-1"
              >
                Ver todas <ArrowRight size={14} />
              </button>
            </div>

            {sorted.length === 0 ? (
              <div className="card p-8 flex flex-col items-center justify-center gap-3 text-[#94A3B8]">
                <CheckCircle size={36} strokeWidth={1.5} />
                <p className="font-medium">Nenhuma atividade pendente</p>
                <p className="text-sm">Você está em dia com todas as entregas!</p>
              </div>
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
                            <span className="text-xs text-[#94A3B8]">{getActivityTypeLabel(act.type)}</span>
                          </div>
                          <h4 className="text-sm font-medium text-[#0F172A] line-clamp-1">{act.title}</h4>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-[#64748B]">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(act.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                              {' '}às{' '}
                              {new Date(act.dueDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span>Peso: {act.weight}%</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <CountdownBadge dueDate={act.dueDate} />
                          {act.status === 'late' && (
                            <span className="flex items-center gap-1 text-[11px] text-red-500">
                              <AlertTriangle size={11} /> Atrasado
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
              <h3 className="font-display font-semibold text-[#0F172A]">Mural de Avisos</h3>
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
                      <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wide">Urgente</span>
                    </div>
                  )}
                  <h4 className="text-sm font-medium text-[#0F172A]">{ann.title}</h4>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{ann.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-[#94A3B8]">{ann.author} · {ann.timestamp}</span>
                    {ann.type === 'enquete' && ann.pollOptions && (
                      <span className="text-[11px] text-[#1E3A8A]">{ann.pollOptions.reduce((a, b) => a + b.votes, 0)} votos</span>
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
                <h3 className="font-display font-semibold text-[#0F172A] text-sm">Notas Recentes</h3>
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
                Ver boletim completo
              </button>
            </div>

            {/* Progress by subject */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-[#1E3A8A]" />
                <h3 className="font-display font-semibold text-[#0F172A] text-sm">Progresso por Disciplina</h3>
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
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{s.progress}% concluído</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="card p-4">
              <h3 className="font-display font-semibold text-[#0F172A] text-sm mb-3">Acesso Rápido</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Calendário', icon: '📅', path: '/calendar' },
                  { label: 'Boletim', icon: '📊', path: '/student/report-card' },
                  { label: 'Mensagens', icon: '💬', path: '/messages' },
                  { label: 'Turmas', icon: '📚', path: '/student/classes' },
                ].map(item => (
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
