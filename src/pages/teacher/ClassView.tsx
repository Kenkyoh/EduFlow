import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Users, FileText, BookOpen, ClipboardList, BarChart3, Zap } from 'lucide-react'
import { Header } from '../../components/Header'
import { ActivityDrawer } from '../../components/ActivityDrawer'
import { mockClasses, mockActivities, mockStudentGrades, mockAnnouncements, getActivityTypeLabel, getStatusBadge } from '../../data/mock'
import { toast } from '../../components/Toast'
import clsx from 'clsx'

type Tab = 'mural' | 'materiais' | 'atividades' | 'alunos' | 'notas'

export function TeacherClassView() {
  const { classId } = useParams<{ classId: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('mural')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const cls = mockClasses.find(c => c.id === classId) ?? mockClasses[0]
  const classActivities = mockActivities.filter(a => a.classIds.includes(cls.id))

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'mural', label: 'Mural', icon: BookOpen },
    { id: 'materiais', label: 'Materiais', icon: FileText },
    { id: 'atividades', label: 'Atividades', icon: ClipboardList },
    { id: 'alunos', label: 'Alunos', icon: Users },
    { id: 'notas', label: 'Notas', icon: BarChart3 },
  ]

  return (
    <>
      <Header
        title={`${cls.name} — ${cls.subjectName}`}
        actions={
          <button onClick={() => setDrawerOpen(true)} className="btn-primary text-sm">
            <Plus size={16} /> Nova atividade
          </button>
        }
      />

      <div className="space-y-4">
        {/* Class header */}
        <div className="card p-4 flex items-center justify-between" style={{ borderLeft: `4px solid ${cls.color}` }}>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: cls.color }}
            >
              {cls.name.substring(0, 2)}
            </div>
            <div>
              <h2 className="font-display font-semibold text-[#0F172A]">{cls.name}</h2>
              <p className="text-sm text-[#64748B]">{cls.subjectName} · {cls.studentsCount} alunos · {cls.period}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="text-lg font-bold text-[#0F172A]">{cls.deliveryRate}%</p>
              <p className="text-xs text-[#94A3B8]">Entrega</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#0F172A]">{classActivities.length}</p>
              <p className="text-xs text-[#94A3B8]">Atividades</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#0F172A]">7.4</p>
              <p className="text-xs text-[#94A3B8]">Média turma</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E2E8F0]">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all',
                tab === t.id
                  ? 'border-[#1E3A8A] text-[#1E3A8A]'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-slate-300'
              )}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Mural */}
        {tab === 'mural' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              {['Aviso', 'Material', 'Enquete', 'Urgente'].map(type => (
                <button
                  key={type}
                  onClick={() => toast(`Criando ${type.toLowerCase()}...`, 'info')}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    type === 'Urgente'
                      ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                      : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#1E3A8A] hover:text-[#1E3A8A]'
                  )}
                >
                  <Plus size={12} className="inline mr-1" />{type}
                </button>
              ))}
            </div>

            {mockAnnouncements.map(ann => (
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
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-[#0F172A]">{ann.title}</h4>
                    <p className="text-sm text-[#64748B] mt-1 line-clamp-2">{ann.content}</p>
                  </div>
                  {ann.viewCount !== undefined && (
                    <span className="text-xs text-[#94A3B8] flex-shrink-0">{ann.viewCount} visualizações</span>
                  )}
                </div>
                {ann.attachments && ann.attachments.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {ann.attachments.map(at => (
                      <span key={at.name} className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-xs text-[#64748B]">
                        <FileText size={12} />{at.name}
                      </span>
                    ))}
                  </div>
                )}
                {ann.type === 'enquete' && ann.pollOptions && (
                  <div className="mt-3 space-y-1.5">
                    {ann.pollOptions.map(opt => {
                      const total = ann.pollOptions!.reduce((a, b) => a + b.votes, 0)
                      const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0
                      return (
                        <div key={opt.text} className="space-y-0.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-[#64748B]">{opt.text}</span>
                            <span className="font-medium">{opt.votes} votos ({pct}%)</span>
                          </div>
                          <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div className="h-full bg-[#1E3A8A] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                <p className="text-xs text-[#94A3B8] mt-2">{ann.timestamp}</p>
              </div>
            ))}
          </div>
        )}

        {/* Atividades */}
        {tab === 'atividades' && (
          <div className="space-y-3">
            {classActivities.length === 0 ? (
              <div className="card p-10 flex flex-col items-center gap-3 text-[#94A3B8]">
                <ClipboardList size={36} strokeWidth={1.5} />
                <p className="font-medium">Nenhuma atividade publicada</p>
                <button onClick={() => setDrawerOpen(true)} className="btn-primary text-sm">
                  Criar primeira atividade
                </button>
              </div>
            ) : (
              classActivities.map(act => (
                <div key={act.id} className="activity-card" style={{ borderLeftColor: act.subjectColor }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#94A3B8]">{getActivityTypeLabel(act.type)}</span>
                        <span className="text-xs text-[#94A3B8]">·</span>
                        <span className="text-xs text-[#94A3B8]">Peso: {act.weight}%</span>
                      </div>
                      <h4 className="text-sm font-medium text-[#0F172A]">{act.title}</h4>
                      <p className="text-xs text-[#64748B] mt-1">
                        Prazo: {new Date(act.dueDate).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(act.dueDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0F172A]">
                        {act.submissionsCount}/{act.totalStudents}
                      </p>
                      <p className="text-xs text-[#94A3B8]">entregas</p>
                      <div className="mt-1 w-20">
                        <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1E3A8A] rounded-full"
                            style={{ width: `${act.totalStudents ? (act.submissionsCount! / act.totalStudents) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Alunos */}
        {tab === 'alunos' && (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B]">Aluno</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B]">Situação</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B]">Média</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B]">Entregas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {mockStudentGrades.map(s => {
                  const badge = getStatusBadge(s.status)
                  return (
                    <tr key={s.studentId} className={clsx('hover:bg-[#F8FAFC] transition-colors', s.inactive && 'opacity-60')}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] text-xs font-semibold">
                            {s.studentName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-[#0F172A]">{s.studentName}</span>
                          {s.inactive && <span className="badge-neutral text-[10px]">Inativo</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={badge.className}>{badge.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx(
                          'text-sm font-bold',
                          (s.average ?? 0) >= 6 ? 'text-emerald-600' : (s.average ?? 0) >= 4 ? 'text-amber-600' : 'text-red-600'
                        )}>
                          {s.average?.toFixed(1) ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#64748B]">
                        {s.grades.filter(g => g.score !== null).length}/{s.grades.length}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Notas - redirect to grade table */}
        {tab === 'notas' && (
          <div className="card p-6 text-center">
            <BarChart3 size={36} className="text-[#1E3A8A] mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-semibold text-[#0F172A]">Grade de Notas</p>
            <p className="text-sm text-[#64748B] mt-1">Acesse a grade completa de notas para edição inline</p>
            <button
              onClick={() => navigate('/teacher/grades')}
              className="btn-primary mt-4 text-sm"
            >
              Abrir grade de notas
            </button>
          </div>
        )}

        {/* Materiais */}
        {tab === 'materiais' && (
          <div className="space-y-3">
            {[
              { title: 'Resumo: Funções Quadráticas', type: 'PDF', size: '1.2 MB', date: '3 dias atrás' },
              { title: 'Videoaula: Discriminante e Raízes', type: 'Vídeo', size: '22 min', date: '1 semana' },
              { title: 'Lista de exercícios extras', type: 'PDF', size: '890 KB', date: '2 semanas' },
            ].map((mat, i) => (
              <div key={i} className="card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText size={20} className="text-[#1E3A8A]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#0F172A]">{mat.title}</p>
                  <p className="text-xs text-[#94A3B8]">{mat.type} · {mat.size} · {mat.date}</p>
                </div>
                <button className="btn-ghost text-xs">Download</button>
              </div>
            ))}
            <button
              onClick={() => toast('Upload de material...', 'info')}
              className="btn-secondary w-full text-sm"
            >
              <Plus size={14} /> Adicionar material
            </button>
          </div>
        )}
      </div>

      <ActivityDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  )
}
