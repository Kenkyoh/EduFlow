import { useState, useEffect, useCallback } from 'react'
import { Users, TrendingUp, AlertTriangle, BookOpen, Plus, X, Loader2 } from 'lucide-react'
import { Header } from '../../components/Header'
import { useAuthStore } from '../../store/auth'
import { useSettingsStore } from '../../store/settings'
import { supabase } from '../../lib/supabase'
import { useSearchStore } from '../../store/search'
import { toast } from '../../components/Toast'
import { EmptyState } from '../../components/EmptyState'
import { SkClassGrid } from '../../components/Skeleton'
import { useTranslation } from '../../i18n'
import clsx from 'clsx'

// ─── Types ────────────────────────────────────────────────────

interface ClassRow {
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
  teacher_id: string
  subjects: { id: string; name: string; color: string; color_light: string } | null
  profiles: { name: string } | null
}

const GRADE_LEVELS = [
  { group: 'Ensino Fundamental I', options: ['1° ano', '2° ano', '3° ano', '4° ano', '5° ano'] },
  { group: 'Ensino Fundamental II', options: ['6° ano', '7° ano', '8° ano', '9° ano'] },
  { group: 'Ensino Médio', options: ['1° ano do Ensino Médio', '2° ano do Ensino Médio', '3° ano do Ensino Médio'] },
  { group: 'EJA / Outros', options: ['EJA Fundamental', 'EJA Médio', 'Outro'] },
]

interface SubjectRow {
  id: string
  name: string
  color: string
  color_light: string
}

const SUBJECT_COLORS = [
  { color: '#1E3A8A', light: '#EFF6FF' },
  { color: '#7C3AED', light: '#F5F3FF' },
  { color: '#059669', light: '#ECFDF5' },
  { color: '#D97706', light: '#FFFBEB' },
  { color: '#DC2626', light: '#FEF2F2' },
  { color: '#0891B2', light: '#ECFEFF' },
  { color: '#BE185D', light: '#FDF2F8' },
  { color: '#65A30D', light: '#F7FEE7' },
]

function currentPeriod(): string {
  const month = new Date().getMonth() + 1 // 1–12
  if (month <= 4) return '1º Bimestre'
  if (month <= 7) return '2º Bimestre'
  if (month <= 10) return '3º Bimestre'
  return '4º Bimestre'
}

// ─── Create Class Modal ───────────────────────────────────────

function CreateClassModal({
  open,
  onClose,
  schoolId,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  schoolId: string
  onCreated: () => void
}) {
  const [subjects, setSubjects] = useState<SubjectRow[]>([])
  const [name, setName] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [newSubjectName, setNewSubjectName] = useState('')
  const [newSubjectColor, setNewSubjectColor] = useState(SUBJECT_COLORS[0])
  const [teacherEmail, setTeacherEmail] = useState('')
  const { gradeScale } = useSettingsStore()
  const grading_type: 'numeric' | 'mencao' = gradeScale === 'mencao' ? 'mencao' : 'numeric'
  const currentYear = new Date().getFullYear().toString()
  const [saving, setSaving] = useState(false)
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    if (!open || !schoolId) return
    supabase
      .from('subjects')
      .select('id, name, color, color_light')
      .eq('school_id', schoolId)
      .order('name')
      .then(({ data }) => setSubjects(data ?? []))
  }, [open, schoolId])

  const reset = () => {
    setName('')
    setGradeLevel('')
    setSubjectId('')
    setNewSubjectName('')
    setNewSubjectColor(SUBJECT_COLORS[0])
    setTeacherEmail('')
    setEmailError('')
  }

  const handleClose = () => { reset(); onClose() }

  const handleSubmit = async () => {
    if (!name.trim() || !gradeLevel || !teacherEmail.trim()) return
    if (!subjectId && !newSubjectName.trim()) return

    setSaving(true)
    setEmailError('')

    try {
      // 1. Buscar professor pelo e-mail
      const { data: teacher, error: teacherErr } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', teacherEmail.trim().toLowerCase())
        .eq('school_id', schoolId)
        .single()

      if (teacherErr || !teacher) {
        setEmailError('Professor não encontrado. Verifique o e-mail e se pertence a esta escola.')
        return
      }
      if (teacher.role !== 'teacher') {
        setEmailError('O perfil encontrado não é um professor.')
        return
      }

      // 2. Criar nova disciplina se necessário
      let finalSubjectId = subjectId
      if (!finalSubjectId) {
        const { data: newSub, error: subErr } = await supabase
          .from('subjects')
          .insert({ school_id: schoolId, name: newSubjectName.trim(), color: newSubjectColor.color, color_light: newSubjectColor.light })
          .select('id')
          .single()
        if (subErr || !newSub) {
          toast('Erro ao criar disciplina.', 'error')
          return
        }
        finalSubjectId = newSub.id
      }

      // 3. Criar a turma
      const { error: classErr } = await supabase
        .from('classes')
        .insert({
          school_id: schoolId,
          subject_id: finalSubjectId,
          teacher_id: teacher.id,
          name: name.trim(),
          grade_level: gradeLevel,
          grading_type,
          year: currentYear,
          period: currentPeriod(),
        })

      if (classErr) {
        toast('Erro ao criar turma.', 'error')
        return
      }

      toast('Turma criada com sucesso!', 'success')
      onCreated()
      handleClose()
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  const canSubmit =
    !saving &&
    name.trim() !== '' &&
    gradeLevel !== '' &&
    teacherEmail.trim() !== '' &&
    (subjectId !== '' || newSubjectName.trim() !== '')

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-modal w-full max-w-md flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
            <h2 className="font-display font-semibold text-[#0F172A]">Nova Turma</h2>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Fechar"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#64748B]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Nome da turma */}
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                Nome da turma <span className="text-red-500">*</span>
              </label>
              <input
                className="input"
                placeholder="Ex.: Turma A"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            {/* Série / Ano escolar */}
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                Série <span className="text-red-500">*</span>
              </label>
              <select
                aria-label="Série"
                className="input"
                value={gradeLevel}
                onChange={e => setGradeLevel(e.target.value)}
              >
                <option value="">Selecionar série...</option>
                {GRADE_LEVELS.map(g => (
                  <optgroup key={g.group} label={g.group}>
                    {g.options.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Disciplina */}
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                Disciplina <span className="text-red-500">*</span>
              </label>
              <select
                aria-label="Disciplina"
                className="input"
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
              >
                <option value="">+ Nova disciplina personalizada</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              {/* Custom subject form */}
              {!subjectId && (
                <div className="mt-3 p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">Nome da disciplina</label>
                    <input
                      className="input"
                      placeholder="Ex.: Filosofia, Artes, Física..."
                      value={newSubjectName}
                      onChange={e => setNewSubjectName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">Cor da disciplina</label>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECT_COLORS.map(c => (
                        <button
                          key={c.color}
                          type="button"
                          title={c.color}
                          onClick={() => setNewSubjectColor(c)}
                          className="w-8 h-8 rounded-lg transition-transform hover:scale-110 focus-visible:outline-none"
                          style={{ backgroundColor: c.color, outline: newSubjectColor.color === c.color ? `3px solid ${c.color}` : undefined, outlineOffset: newSubjectColor.color === c.color ? '2px' : undefined }}
                        >
                          {newSubjectColor.color === c.color && (
                            <span className="flex items-center justify-center w-full h-full">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-5 h-5 rounded flex-shrink-0" style={{ backgroundColor: newSubjectColor.color }} />
                      <span className="text-xs text-[#64748B]">Prévia: </span>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: newSubjectColor.light, color: newSubjectColor.color }}
                      >
                        {newSubjectName || 'Nova Disciplina'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* E-mail do professor */}
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                E-mail do professor responsável <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className={clsx('input', emailError && 'border-red-400 focus:border-red-500')}
                placeholder="professor@escola.vekta.app"
                value={teacherEmail}
                onChange={e => { setTeacherEmail(e.target.value); setEmailError('') }}
              />
              {emailError && (
                <p className="text-xs text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            {/* Tipo de avaliação — herdado das configurações */}
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Tipo de avaliação</label>
              <div className="input flex items-center justify-between bg-slate-50 cursor-default select-none">
                <span className="text-[#0F172A]">
                  {grading_type === 'mencao' ? 'Menção (PA / AC / A / P / N)' : 'Numérica (0 – 10)'}
                </span>
                <a
                  href="/settings"
                  className="text-xs text-[#1E3A8A] hover:underline flex-shrink-0 ml-3"
                  onClick={handleClose}
                >
                  Alterar nas configurações
                </a>
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-1">Definido na aba Aprovação das configurações da escola</p>
            </div>

            {/* Ano letivo e período — automáticos */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-1.5">Ano letivo</label>
                <div className="input flex items-center text-[#64748B] bg-slate-50 cursor-default select-none">
                  {currentYear}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-1.5">Período</label>
                <div className="input flex items-center text-[#64748B] bg-slate-50 cursor-default select-none">
                  {currentPeriod()}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#94A3B8] -mt-2">Ano e período definidos automaticamente pela data atual</p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#E2E8F0] flex gap-3 justify-end flex-shrink-0">
            <button type="button" onClick={handleClose} className="btn-secondary text-sm">
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="btn-primary text-sm"
            >
              {saving
                ? <><Loader2 size={14} className="animate-spin" /> Criando...</>
                : <><Plus size={14} /> Criar Turma</>}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────

export function CoordinatorClassList() {
  const user = useAuthStore(s => s.user)
  const { query, setQuery } = useSearchStore()
  const t = useTranslation()

  const [classes, setClasses] = useState<ClassRow[]>([])
  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => {
    if (!user?.schoolId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('classes')
      .select(`
        id, name, grade_level, year, period, grading_type, students_count, delivery_rate, average, at_risk,
        teacher_id,
        subjects(id, name, color, color_light),
        profiles!teacher_id(name)
      `)
      .eq('school_id', user.schoolId)
      .order('name')

    if (error) { setIsError(true); setLoading(false); return }
    setClasses((data ?? []) as unknown as ClassRow[])
    setLoading(false)
    setIsError(false)
  }, [user?.schoolId])

  useEffect(() => { load() }, [load])

  const filtered = classes.filter(cls =>
    !query ||
    cls.name.toLowerCase().includes(query.toLowerCase()) ||
    cls.grade_level.toLowerCase().includes(query.toLowerCase()) ||
    (cls.subjects?.name ?? '').toLowerCase().includes(query.toLowerCase()) ||
    (cls.profiles?.name ?? '').toLowerCase().includes(query.toLowerCase())
  )

  const totalStudents = classes.reduce((acc, c) => acc + c.students_count, 0)
  const totalAtRisk = classes.reduce((acc, c) => acc + (c.at_risk ?? 0), 0)

  return (
    <>
      <Header
        title={t('coordinator.classList.title')}
        actions={
          <button type="button" onClick={() => setModalOpen(true)} className="btn-primary text-sm">
            <Plus size={16} /> Nova Turma
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <BookOpen size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">{t('coordinator.classList.totalClasses')}</p>
            <p className="text-xl font-display font-bold text-[#0F172A]">{classes.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Users size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">{t('coordinator.classList.totalStudents')}</p>
            <p className="text-xl font-display font-bold text-[#0F172A]">{totalStudents}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">{t('coordinator.classList.atRisk')}</p>
            <p className="text-xl font-display font-bold text-[#0F172A]">{totalAtRisk}</p>
          </div>
        </div>
      </div>

      {loading && <SkClassGrid count={8} cols={4} />}

      {isError && (
        <p className="text-center py-12 text-red-500 text-sm">Erro ao carregar turmas.</p>
      )}

      {!loading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(cls => (
            <div key={cls.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base"
                  style={{ backgroundColor: cls.subjects?.color ?? '#1E3A8A' }}
                >
                  {cls.name.substring(0, 2)}
                </div>
                {(cls.at_risk ?? 0) > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    <AlertTriangle size={11} />
                    {t('coordinator.classList.atRiskBadge', { n: cls.at_risk })}
                  </span>
                )}
              </div>

              <h3 className="font-display font-semibold text-[#0F172A]">{cls.name}</h3>
              {cls.grade_level && (
                <p className="text-xs font-medium text-[#64748B] mt-0.5">{cls.grade_level}</p>
              )}
              <p className="text-xs text-[#94A3B8] mt-0.5">{cls.subjects?.name ?? '—'}</p>
              <p className="text-xs text-[#94A3B8] mt-0.5 truncate">{cls.profiles?.name ?? '—'}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{t('coordinator.classList.students', { n: cls.students_count })}</span>
                  </div>
                  {cls.average !== null && (
                    <div
                      className="flex items-center gap-1 font-medium"
                      style={{ color: (cls.average ?? 0) >= 7 ? '#059669' : (cls.average ?? 0) >= 5 ? '#D97706' : '#DC2626' }}
                    >
                      <TrendingUp size={12} />
                      <span>{t('coordinator.classList.average', { avg: (cls.average ?? 0).toFixed(1) })}</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#94A3B8]">{t('coordinator.classList.deliveryRate')}</span>
                    <span className={clsx('font-medium', {
                      'text-emerald-600': cls.delivery_rate >= 80,
                      'text-amber-600': cls.delivery_rate >= 60 && cls.delivery_rate < 80,
                      'text-red-600': cls.delivery_rate < 60,
                    })}>
                      {cls.delivery_rate}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${cls.delivery_rate}%`,
                        backgroundColor: cls.delivery_rate >= 80 ? '#059669' : cls.delivery_rate >= 60 ? '#D97706' : '#DC2626',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                variant="search"
                title={query ? t('coordinator.classList.noClassesFound', { query }) : t('common.noResults')}
                action={query ? { label: t('common.clearSearch'), onClick: () => setQuery('') } : undefined}
              />
            </div>
          )}
        </div>
      )}

      <CreateClassModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        schoolId={user?.schoolId ?? ''}
        onCreated={load}
      />
    </>
  )
}
