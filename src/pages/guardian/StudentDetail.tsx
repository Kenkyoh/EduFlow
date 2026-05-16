import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, GraduationCap, TrendingUp, Calendar, Clock, AlertTriangle,
  BookOpen, BarChart3, User,
} from 'lucide-react'
import { mockGuardianStudents, mockReportCardData } from '../../data/mock'
import { Header } from '../../components/Header'
import clsx from 'clsx'

type Tab = 'desempenho' | 'atividades' | 'frequencia'

const STATUS_CONFIG = {
  approved: { label: 'Aprovado',    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  recovery: { label: 'Recuperação', className: 'bg-amber-50 text-amber-700 border border-amber-200'      },
  failed:   { label: 'Reprovado',   className: 'bg-red-50 text-red-700 border border-red-200'            },
  pending:  { label: 'Aguardando',  className: 'bg-slate-100 text-slate-600 border border-slate-200'     },
}

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'desempenho', label: 'Desempenho', icon: BarChart3 },
  { id: 'atividades', label: 'Atividades', icon: BookOpen  },
  { id: 'frequencia', label: 'Frequência', icon: Calendar  },
]

const MOCK_ACTIVITIES = [
  { id: 'a1', title: 'Trabalho — Análise Literária',      subject: 'Português',  subjectColor: '#7C3AED', status: 'pending', due: 'Amanhã, 23h59'    },
  { id: 'a2', title: 'Prova Bimestral — Funções',         subject: 'Matemática', subjectColor: '#1E3A8A', status: 'upcoming', due: 'Em 3 dias'         },
  { id: 'a3', title: 'Relatório de Experimento — Mitose', subject: 'Biologia',   subjectColor: '#059669', status: 'upcoming', due: 'Em 7 dias'         },
  { id: 'a4', title: 'Lista de Exercícios — Termodin.',   subject: 'Física',     subjectColor: '#D97706', status: 'late',    due: 'Atrasado 1 dia'    },
  { id: 'a5', title: 'Apresentação — Rev. Industrial',    subject: 'História',   subjectColor: '#DC2626', status: 'upcoming', due: 'Em 14 dias'        },
]

const ACTIVITY_STATUS = {
  pending:  { label: 'Pendente',  className: 'bg-amber-50 text-amber-700 border border-amber-200'   },
  upcoming: { label: 'Próxima',   className: 'bg-blue-50 text-blue-700 border border-blue-200'      },
  late:     { label: 'Atrasada',  className: 'bg-red-50 text-red-700 border border-red-200'         },
  graded:   { label: 'Corrigida', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
}

export function GuardianStudentDetail() {
  const { studentId } = useParams<{ studentId: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('desempenho')

  const student = studentId ? mockGuardianStudents[studentId] : undefined

  if (!student) {
    return (
      <>
        <Header title="Detalhes do aluno" />
        <div className="text-center py-20">
          <GraduationCap size={40} className="mx-auto text-[#CBD5E1] mb-4" />
          <p className="text-[#64748B]">Aluno não encontrado.</p>
          <button type="button" onClick={() => navigate('/guardian')} className="btn-secondary mt-4">Voltar</button>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title={student.name} />

      <div className="space-y-6">
        {/* Back + Student header */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/guardian')}
            className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] mb-4 transition-colors"
          >
            <ChevronLeft size={16} />
            Painel do responsável
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1E3A8A] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-[#0F172A]">{student.name}</h1>
              <p className="text-sm text-[#64748B]">{student.class} · Ano letivo {student.year}</p>
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Média geral',   value: student.overallAverage.toFixed(1), icon: TrendingUp,    color: '#1E3A8A', bg: '#EFF6FF' },
            { label: 'Frequência',    value: `${student.attendance}%`,           icon: User,          color: student.attendance < 75 ? '#DC2626' : '#059669', bg: student.attendance < 75 ? '#FEF2F2' : '#ECFDF5' },
            { label: 'Pendentes',     value: student.pendingActivities,           icon: Clock,         color: '#D97706', bg: '#FFFBEB' },
            { label: 'Atrasadas',     value: student.lateActivities,              icon: AlertTriangle, color: student.lateActivities > 0 ? '#DC2626' : '#059669', bg: student.lateActivities > 0 ? '#FEF2F2' : '#ECFDF5' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <p className="text-2xl font-display font-bold text-[#0F172A]">{value}</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#E2E8F0]">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                tab === id
                  ? 'border-[#1E3A8A] text-[#1E3A8A]'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              )}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab: Desempenho */}
        {tab === 'desempenho' && (
          <div className="space-y-4">
            <div className="card divide-y divide-[#F1F5F9]">
              {mockReportCardData.map(sub => (
                <div key={sub.subjectId} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sub.color }} />
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{sub.subjectName}</p>
                        <p className="text-xs text-[#94A3B8]">{sub.teacher}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-display font-bold text-[#0F172A]">
                        {sub.average.toFixed(1)}
                      </span>
                      <span className={clsx(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                        STATUS_CONFIG[sub.status].className
                      )}>
                        {STATUS_CONFIG[sub.status].label}
                      </span>
                    </div>
                  </div>

                  {/* Assessment breakdown */}
                  {'assessments' in sub && (
                    <div className="flex gap-2 flex-wrap">
                      {sub.assessments.map(a => (
                        <div key={a.name} className="text-xs bg-[#F8FAFC] rounded-lg px-3 py-1.5">
                          <span className="text-[#94A3B8]">{a.name}: </span>
                          <span className="font-semibold text-[#0F172A]">
                            {a.score !== null ? a.score.toFixed(1) : '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Grade evolution bar */}
                  {sub.history.length > 0 && (
                    <div className="mt-3 flex items-end gap-1 h-8">
                      {sub.history.map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                          <div
                            className="w-full rounded-t"
                            style={{
                              height: `${(v / 10) * 28}px`,
                              backgroundColor: i === sub.history.length - 1 ? sub.color : '#E2E8F0',
                            }}
                          />
                          <span className="text-[9px] text-[#94A3B8]">{`B${i + 1}`}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Atividades */}
        {tab === 'atividades' && (
          <div className="space-y-4">
            <p className="text-sm text-[#64748B]">{MOCK_ACTIVITIES.length} atividades no período</p>
            <div className="card divide-y divide-[#F1F5F9]">
              {MOCK_ACTIVITIES.map(act => (
                <div key={act.id} className="flex items-center gap-4 px-5 py-4">
                  <div
                    className="w-2 self-stretch rounded-full flex-shrink-0"
                    style={{ backgroundColor: act.subjectColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F172A] truncate">{act.title}</p>
                    <p className="text-xs text-[#94A3B8]">{act.subject}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-[#64748B]">{act.due}</span>
                    <span className={clsx(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                      ACTIVITY_STATUS[act.status as keyof typeof ACTIVITY_STATUS].className
                    )}>
                      {ACTIVITY_STATUS[act.status as keyof typeof ACTIVITY_STATUS].label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Frequência */}
        {tab === 'frequencia' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Frequência por disciplina</h3>
              <div className="space-y-4">
                {student.subjects.map(sub => (
                  <div key={sub.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                        <span className="text-sm text-[#0F172A]">{sub.name}</span>
                      </div>
                      <span className={clsx(
                        'text-sm font-bold',
                        sub.attendance < 75 ? 'text-red-600' : sub.attendance < 85 ? 'text-amber-600' : 'text-emerald-600'
                      )}>
                        {sub.attendance}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${sub.attendance}%`,
                          backgroundColor: sub.attendance < 75 ? '#DC2626' : sub.attendance < 85 ? '#D97706' : '#059669',
                        }}
                      />
                    </div>
                    {sub.attendance < 75 && (
                      <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertTriangle size={10} />
                        Abaixo do mínimo exigido (75%)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-2">Frequência geral</h3>
              <div className="flex items-end gap-4">
                <p className="text-4xl font-display font-bold text-[#0F172A]">{student.attendance}%</p>
                <p className="text-sm text-[#64748B] pb-1">
                  {student.attendance >= 75
                    ? 'Dentro do limite mínimo exigido'
                    : 'Atenção: abaixo do mínimo de 75%'
                  }
                </p>
              </div>
              <div className="mt-3 h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${student.attendance}%`,
                    backgroundColor: student.attendance < 75 ? '#DC2626' : '#059669',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
