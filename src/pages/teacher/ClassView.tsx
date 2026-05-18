import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Users, FileText, BookOpen, ClipboardList, BarChart3, Zap, X, Loader2, UserPlus, Trash2 } from 'lucide-react'
import { Header } from '../../components/Header'
import { ActivityDrawer } from '../../components/ActivityDrawer'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/auth'
import { mockActivities, mockAnnouncements, getActivityTypeLabel } from '../../data/mock'
import { toast } from '../../components/Toast'
import { useTranslation } from '../../i18n'
import clsx from 'clsx'

// ─── Types ────────────────────────────────────────────────────

interface ClassData {
  id: string
  name: string
  grade_level: string
  year: string
  period: string
  grading_type: 'numeric' | 'mencao'
  students_count: number
  delivery_rate: number
  average: number | null
  at_risk: number
  subjects: { id: string; name: string; color: string; color_light: string } | null
}

interface EnrolledStudent {
  student_id: string
  enrolled_at: string
  profiles: { id: string; name: string; email: string | null } | null
}

type Tab = 'mural' | 'materiais' | 'atividades' | 'alunos' | 'notas'

// ─── Enroll Student Modal ─────────────────────────────────────

function EnrollStudentModal({
  open,
  onClose,
  classId,
  schoolId,
  onEnrolled,
}: {
  open: boolean
  onClose: () => void
  classId: string
  schoolId: string
  onEnrolled: () => void
}) {
  const [email, setEmail] = useState('')
  const [preview, setPreview] = useState<{ id: string; name: string } | null>(null)
  const [lookupError, setLookupError] = useState('')
  const [looking, setLooking] = useState(false)
  const [enrolling, setEnrolling] = useState(false)

  const reset = () => { setEmail(''); setPreview(null); setLookupError(''); setLooking(false); setEnrolling(false) }
  const handleClose = () => { reset(); onClose() }

  const handleLookup = async () => {
    if (!email.trim()) return
    setLooking(true)
    setLookupError('')
    setPreview(null)

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, role')
      .eq('email', email.trim().toLowerCase())
      .eq('school_id', schoolId)
      .single()

    setLooking(false)
    if (error || !data) {
      setLookupError('Aluno não encontrado. Verifique o e-mail e se pertence a esta escola.')
      return
    }
    if (data.role !== 'student') {
      setLookupError('O perfil encontrado não é um aluno.')
      return
    }
    setPreview({ id: data.id, name: data.name })
  }

  const handleEnroll = async () => {
    if (!preview) return
    setEnrolling(true)

    const { error } = await supabase
      .from('class_students')
      .insert({ class_id: classId, student_id: preview.id })

    if (error) {
      if (error.code === '23505') {
        toast('Aluno já está matriculado nesta turma.', 'info')
      } else {
        toast('Erro ao matricular aluno.', 'error')
      }
      setEnrolling(false)
      return
    }

    // Update students_count
    await supabase.rpc('increment_students_count', { class_id_param: classId }).catch(() => {
      supabase
        .from('classes')
        .select('students_count')
        .eq('id', classId)
        .single()
        .then(({ data }) => {
          if (data) {
            supabase.from('classes').update({ students_count: data.students_count + 1 }).eq('id', classId)
          }
        })
    })

    toast(`${preview.name} matriculado(a) com sucesso!`, 'success')
    onEnrolled()
    handleClose()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-modal w-full max-w-sm flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
            <h2 className="font-display font-semibold text-[#0F172A]">Adicionar Aluno</h2>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Fechar"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#64748B]"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                E-mail do aluno
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  className={clsx('input flex-1', lookupError && 'border-red-400')}
                  placeholder="aluno@escola.vekta.app"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setLookupError(''); setPreview(null) }}
                  onKeyDown={e => e.key === 'Enter' && handleLookup()}
                />
                <button
                  type="button"
                  onClick={handleLookup}
                  disabled={!email.trim() || looking}
                  className="btn-secondary text-sm px-3 flex-shrink-0"
                >
                  {looking ? <Loader2 size={14} className="animate-spin" /> : 'Buscar'}
                </button>
              </div>
              {lookupError && (
                <p className="text-xs text-red-500 mt-1">{lookupError}</p>
              )}
            </div>

            {preview && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <div className="w-9 h-9 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] font-semibold text-sm flex-shrink-0">
                  {preview.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">{preview.name}</p>
                  <p className="text-xs text-emerald-600">Aluno encontrado</p>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-[#E2E8F0] flex gap-3 justify-end flex-shrink-0">
            <button type="button" onClick={handleClose} className="btn-secondary text-sm">
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleEnroll}
              disabled={!preview || enrolling}
              className="btn-primary text-sm"
            >
              {enrolling
                ? <><Loader2 size={14} className="animate-spin" /> Matriculando...</>
                : <><UserPlus size={14} /> Matricular</>}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Main Component ───────────────────────────────────────────

export function TeacherClassView() {
  const { classId } = useParams<{ classId: string }>()
  const navigate = useNavigate()
  const t = useTranslation()
  const user = useAuthStore(s => s.user)
  const [tab, setTab] = useState<Tab>('mural')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [enrollModalOpen, setEnrollModalOpen] = useState(false)

  const [cls, setCls] = useState<ClassData | null>(null)
  const [clsLoading, setClsLoading] = useState(true)

  const [students, setStudents] = useState<EnrolledStudent[]>([])
  const [studentsLoading, setStudentsLoading] = useState(false)

  const loadClass = useCallback(async () => {
    if (!classId) return
    setClsLoading(true)
    const { data } = await supabase
      .from('classes')
      .select('id, name, grade_level, year, period, grading_type, students_count, delivery_rate, average, at_risk, subjects(id, name, color, color_light)')
      .eq('id', classId)
      .single()
    setCls(data as unknown as ClassData | null)
    setClsLoading(false)
  }, [classId])

  const loadStudents = useCallback(async () => {
    if (!classId) return
    setStudentsLoading(true)
    const { data } = await supabase
      .from('class_students')
      .select('student_id, enrolled_at, profiles!student_id(id, name, email)')
      .eq('class_id', classId)
      .order('enrolled_at', { ascending: true })
    setStudents((data ?? []) as unknown as EnrolledStudent[])
    setStudentsLoading(false)
  }, [classId])

  useEffect(() => { loadClass() }, [loadClass])
  useEffect(() => { if (tab === 'alunos') loadStudents() }, [tab, loadStudents])

  const handleRemoveStudent = async (studentId: string, studentName: string) => {
    if (!classId) return
    const { error } = await supabase
      .from('class_students')
      .delete()
      .eq('class_id', classId)
      .eq('student_id', studentId)

    if (error) { toast('Erro ao remover aluno.', 'error'); return }
    setStudents(prev => prev.filter(s => s.student_id !== studentId))
    toast(`${studentName} removido(a) da turma.`, 'success')
  }

  const classActivities = mockActivities.filter(a => cls && a.classIds.includes(cls.id))
  const subjectColor = cls?.subjects?.color ?? '#1E3A8A'

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'mural', label: 'Mural', icon: BookOpen },
    { id: 'materiais', label: 'Materiais', icon: FileText },
    { id: 'atividades', label: 'Atividades', icon: ClipboardList },
    { id: 'alunos', label: 'Alunos', icon: Users },
    { id: 'notas', label: t('nav.grades'), icon: BarChart3 },
  ]

  if (clsLoading) {
    return (
      <>
        <Header title="Carregando..." />
        <div className="flex items-center justify-center py-24 text-[#94A3B8]">
          <Loader2 size={28} className="animate-spin" />
        </div>
      </>
    )
  }

  if (!cls) {
    return (
      <>
        <Header title="Turma não encontrada" />
        <div className="card p-10 text-center text-[#94A3B8]">
          <p>Turma não encontrada ou sem permissão de acesso.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header
        title={[cls.grade_level, cls.subjects?.name].filter(Boolean).join(' — ') || cls.name}
        actions={
          <button type="button" onClick={() => setDrawerOpen(true)} className="btn-primary text-sm">
            <Plus size={16} /> Nova atividade
          </button>
        }
      />

      <div className="space-y-4">
        {/* Class header */}
        <div className="card p-4 flex items-center justify-between" style={{ borderLeft: `4px solid ${subjectColor}` }}>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: subjectColor }}
            >
              {cls.name.substring(0, 2)}
            </div>
            <div>
              <h2 className="font-display font-semibold text-[#0F172A]">{cls.name}</h2>
              <p className="text-sm text-[#64748B]">
                {[cls.grade_level, cls.subjects?.name].filter(Boolean).join(' · ')}
                {' · '}{cls.students_count} alunos · {cls.period}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="text-lg font-bold text-[#0F172A]">{cls.delivery_rate}%</p>
              <p className="text-xs text-[#94A3B8]">Entrega</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#0F172A]">{classActivities.length}</p>
              <p className="text-xs text-[#94A3B8]">Atividades</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#0F172A]">{cls.average?.toFixed(1) ?? '—'}</p>
              <p className="text-xs text-[#94A3B8]">Média turma</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E2E8F0]">
          {tabs.map(tabItem => (
            <button
              key={tabItem.id}
              type="button"
              onClick={() => setTab(tabItem.id)}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all',
                tab === tabItem.id
                  ? 'border-[#1E3A8A] text-[#1E3A8A]'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-slate-300'
              )}
            >
              <tabItem.icon size={15} />
              {tabItem.label}
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
                  type="button"
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
              <div key={ann.id} className={clsx('card p-4', ann.urgent && 'border-red-300 border-2')}>
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
                <button type="button" onClick={() => setDrawerOpen(true)} className="btn-primary text-sm">
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#64748B]">
                {studentsLoading ? 'Carregando...' : `${students.length} aluno${students.length !== 1 ? 's' : ''} matriculado${students.length !== 1 ? 's' : ''}`}
              </p>
              <button
                type="button"
                onClick={() => setEnrollModalOpen(true)}
                className="btn-primary text-sm"
              >
                <UserPlus size={14} /> Adicionar Aluno
              </button>
            </div>

            {studentsLoading ? (
              <div className="card overflow-hidden">
                <div className="divide-y divide-[#F1F5F9]">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="px-4 py-3 flex items-center gap-3 animate-pulse">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-slate-100 rounded w-32" />
                        <div className="h-2.5 bg-slate-100 rounded w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : students.length === 0 ? (
              <div className="card p-10 flex flex-col items-center gap-3 text-[#94A3B8]">
                <Users size={36} strokeWidth={1.5} />
                <p className="font-medium">Nenhum aluno matriculado</p>
                <button
                  type="button"
                  onClick={() => setEnrollModalOpen(true)}
                  className="btn-primary text-sm"
                >
                  <UserPlus size={14} /> Adicionar primeiro aluno
                </button>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B]">Aluno</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B]">E-mail</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B]">Desde</th>
                      <th className="px-4 py-3 w-12 sr-only">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {students.map(s => {
                      const name = s.profiles?.name ?? 'Desconhecido'
                      const email = s.profiles?.email ?? '—'
                      const since = new Date(s.enrolled_at).toLocaleDateString('pt-BR')
                      return (
                        <tr key={s.student_id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] text-xs font-semibold">
                                {name.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-[#0F172A]">{name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#64748B]">{email}</td>
                          <td className="px-4 py-3 text-sm text-[#94A3B8]">{since}</td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              title="Remover aluno"
                              onClick={() => handleRemoveStudent(s.student_id, name)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#94A3B8] hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Notas */}
        {tab === 'notas' && (
          <div className="card p-6 text-center">
            <BarChart3 size={36} className="text-[#1E3A8A] mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-semibold text-[#0F172A]">Grade de Notas</p>
            <p className="text-sm text-[#64748B] mt-1">Acesse a grade completa de notas para edição inline</p>
            <button
              type="button"
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
                <button type="button" className="btn-ghost text-xs">Download</button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => toast('Upload de material...', 'info')}
              className="btn-secondary w-full text-sm"
            >
              <Plus size={14} /> Adicionar material
            </button>
          </div>
        )}
      </div>

      <ActivityDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <EnrollStudentModal
        open={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        classId={cls.id}
        schoolId={user?.schoolId ?? ''}
        onEnrolled={() => { loadStudents(); loadClass() }}
      />
    </>
  )
}
