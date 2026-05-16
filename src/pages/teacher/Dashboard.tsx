import { useNavigate } from 'react-router-dom'
import {
  Clock, Users, CheckSquare, MessageSquare, ArrowRight,
  AlertCircle, TrendingUp, FileText, Plus
} from 'lucide-react'
import { Header } from '../../components/Header'
import { ActivityDrawer } from '../../components/ActivityDrawer'
import { mockActivities, mockClasses, mockSubmissions, getActivityTypeLabel } from '../../data/mock'
import { useState } from 'react'
import { toast } from '../../components/Toast'
import clsx from 'clsx'

export function TeacherDashboard() {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const corrections = mockSubmissions.filter(s => s.status === 'submitted')
  const activeClasses = mockClasses

  const pendingActivities = mockActivities.filter(a => a.submissionsCount !== undefined && a.totalStudents !== undefined)
    .map(a => ({
      ...a,
      deliveryPct: a.submissionsCount && a.totalStudents
        ? Math.round((a.submissionsCount / a.totalStudents) * 100)
        : 0,
    }))

  const messages = [
    { id: 1, student: 'Lucas Mendes', preview: 'Professora, quando sai o resultado da P1?', time: '10:42', unread: true },
    { id: 2, student: 'Maria Silva', preview: 'Minha entrega chegou? Tive problemas com o arquivo', time: 'Ontem', unread: true },
    { id: 3, student: 'Pedro Oliveira', preview: 'Obrigado pelo feedback! Posso reenviar?', time: '2 dias', unread: false },
  ]

  return (
    <>
      <Header
        title="Dashboard do Professor"
        actions={
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="btn-primary text-sm"
          >
            <Plus size={16} />
            Nova atividade
          </button>
        }
      />

      <div className="space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Correções pendentes',
              value: corrections.length,
              sub: 'com prazo mais urgente: hoje',
              icon: CheckSquare,
              color: 'text-amber-500',
              bg: 'bg-amber-50',
            },
            {
              label: 'Turmas ativas',
              value: activeClasses.length,
              sub: `${activeClasses.reduce((a, c) => a + c.studentsCount, 0)} alunos no total`,
              icon: Users,
              color: 'text-[#1E3A8A]',
              bg: 'bg-blue-50',
            },
            {
              label: 'Taxa de entrega',
              value: '78%',
              sub: '-2% em relação ao bimestre anterior',
              icon: TrendingUp,
              color: 'text-emerald-500',
              bg: 'bg-emerald-50',
            },
            {
              label: 'Mensagens',
              value: messages.filter(m => m.unread).length,
              sub: 'não respondidas',
              icon: MessageSquare,
              color: 'text-purple-500',
              bg: 'bg-purple-50',
            },
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#64748B]">{kpi.label}</span>
                <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', kpi.bg)}>
                  <kpi.icon size={16} className={kpi.color} />
                </div>
              </div>
              <div className="text-2xl font-bold font-display text-[#0F172A]">{kpi.value}</div>
              <p className="text-[11px] text-[#94A3B8]">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Correction queue */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-[#0F172A]">Fila de Correções</h3>
              <span className="badge-warning">{corrections.length} pendentes</span>
            </div>

            {corrections.length === 0 ? (
              <div className="card p-8 flex flex-col items-center gap-3 text-[#94A3B8]">
                <CheckSquare size={36} strokeWidth={1.5} />
                <p className="font-medium">Todas as entregas foram corrigidas</p>
              </div>
            ) : (
              <div className="space-y-2">
                {corrections.map(sub => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => navigate(`/teacher/correct/${sub.id}`)}
                    className="card w-full text-left p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] text-sm font-semibold">
                          {sub.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">{sub.studentName}</p>
                          <p className="text-xs text-[#64748B] line-clamp-1">{sub.activityTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-[11px] text-[#94A3B8]">
                            {new Date(sub.submittedAt).toLocaleDateString('pt-BR')}
                          </p>
                          <span className="badge-warning text-[10px]">Aguardando</span>
                        </div>
                        <ArrowRight size={16} className="text-[#94A3B8]" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Active classes with delivery rate */}
            <div className="flex items-center justify-between mt-4">
              <h3 className="font-display font-semibold text-[#0F172A]">Turmas Ativas</h3>
              <button
                type="button"
                onClick={() => navigate('/teacher/classes')}
                className="text-sm text-[#1E3A8A] hover:underline flex items-center gap-1"
              >
                Gerenciar <ArrowRight size={14} />
              </button>
            </div>

            <div className="space-y-2">
              {activeClasses.map(cls => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => navigate(`/teacher/class/${cls.id}`)}
                  className="card w-full text-left p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: cls.color }}
                      >
                        {cls.name.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">{cls.name}</p>
                        <p className="text-xs text-[#64748B]">{cls.subjectName} · {cls.studentsCount} alunos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs font-medium text-[#0F172A]">{cls.deliveryRate}%</p>
                        <p className="text-[11px] text-[#94A3B8]">entrega</p>
                      </div>
                      <div className="w-16">
                        <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${cls.deliveryRate}%`,
                              backgroundColor: (cls.deliveryRate ?? 0) >= 80 ? '#059669' : (cls.deliveryRate ?? 0) >= 60 ? '#D97706' : '#DC2626',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Messages */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#1E3A8A]" />
                  <h3 className="font-display font-semibold text-[#0F172A] text-sm">Mensagens</h3>
                </div>
                <span className="badge-danger text-[10px]">{messages.filter(m => m.unread).length} novas</span>
              </div>
              <div className="space-y-2">
                {messages.map(msg => (
                  <button
                    key={msg.id}
                    type="button"
                    onClick={() => navigate('/messages')}
                    className="w-full flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-[#64748B] flex-shrink-0">
                      {msg.student.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={clsx('text-xs', msg.unread ? 'font-semibold text-[#0F172A]' : 'font-medium text-[#64748B]')}>
                          {msg.student}
                        </span>
                        <span className="text-[11px] text-[#94A3B8]">{msg.time}</span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">{msg.preview}</p>
                    </div>
                    {msg.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] mt-1.5 flex-shrink-0" />}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('/messages')}
                className="mt-2 w-full btn-ghost text-xs"
              >
                Ver todas as mensagens
              </button>
            </div>

            {/* Upcoming publications */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-[#7C3AED]" />
                <h3 className="font-display font-semibold text-[#0F172A] text-sm">Próximas Publicações</h3>
              </div>
              <div className="space-y-2">
                {mockActivities.slice(0, 3).map(act => (
                  <div key={act.id} className="flex items-center gap-2.5 py-1.5">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: act.subjectColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#0F172A] truncate">{act.title}</p>
                      <p className="text-[11px] text-[#94A3B8]">
                        {new Date(act.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="mt-2 w-full btn-secondary text-xs"
              >
                <Plus size={12} /> Nova atividade
              </button>
            </div>
          </div>
        </div>
      </div>

      <ActivityDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  )
}
