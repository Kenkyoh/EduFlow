import { useState, useEffect } from 'react'
import { Download, CheckCircle, AlertTriangle, XCircle, Clock, TrendingUp, ChevronDown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Header } from '../../components/Header'
import { MENCAO_COLORS, MENCAO_SCORES, MENCAO_ORDER } from '../../data/mock'
import { useAuthStore } from '../../store/auth'
import { useSettingsStore } from '../../store/settings'
import { supabase } from '../../lib/supabase'
import { formatGrade, gradeColorClass, scoreToMencao, scoreToConceptual, CONCEPTUAL_COLORS } from '../../utils/gradeFormat'
import { toast } from '../../components/Toast'
import { useTranslation } from '../../i18n'
import type { ReportCardSubjectData, MencaoValue } from '../../types'
import clsx from 'clsx'

// --------------- data fetching ---------------

interface GradeRow {
  class_id: string
  bimester: number
  assessment: string
  weight: number
  score: number | null
  attendance: number
}

interface ObjectiveRow {
  class_id: string
  bimester: number
  objective_index: number
  title: string
  value: MencaoValue | null
  attendance: number
}

interface ClassRow {
  id: string
  grading_type: 'numeric' | 'mencao'
  teacher_id: string
  subjects: { id: string; name: string; color: string; color_light: string } | null
}

function weightedAvg(rows: GradeRow[]): number {
  const withScore = rows.filter(r => r.score !== null)
  if (withScore.length === 0) return 0
  const totalWeight = withScore.reduce((s, r) => s + r.weight, 0)
  if (totalWeight === 0) return 0
  return withScore.reduce((s, r) => s + r.score! * r.weight, 0) / totalWeight
}

function mencaoAvg(rows: ObjectiveRow[]): number {
  const withValue = rows.filter(r => r.value !== null)
  if (withValue.length === 0) return 0
  return withValue.reduce((s, r) => s + MENCAO_SCORES[r.value!], 0) * 2
}

function toStatus(avg: number, hasData: boolean): ReportCardSubjectData['status'] {
  if (!hasData) return 'pending'
  if (avg >= 6) return 'approved'
  if (avg >= 4) return 'recovery'
  return 'failed'
}

async function fetchReportCardData(userId: string, bimester: number): Promise<ReportCardSubjectData[]> {
  const [{ data: enrollments }, { data: allGrades }, { data: allObjectives }] = await Promise.all([
    supabase.from('class_students').select('class_id').eq('student_id', userId),
    supabase.from('student_grades').select('class_id, bimester, assessment, weight, score, attendance').eq('student_id', userId),
    supabase.from('student_objectives').select('class_id, bimester, objective_index, title, value, attendance').eq('student_id', userId),
  ])

  const classIds = (enrollments ?? []).map((e: any) => e.class_id)
  if (classIds.length === 0) return []

  const { data: classes } = await supabase
    .from('classes')
    .select('id, grading_type, teacher_id, subjects(id, name, color, color_light)')
    .in('id', classIds)

  const teacherIds = [...new Set((classes ?? []).map((c: any) => c.teacher_id).filter(Boolean))]
  const { data: teachers } = teacherIds.length > 0
    ? await supabase.from('profiles').select('id, name').in('id', teacherIds)
    : { data: [] }

  const teacherMap = Object.fromEntries((teachers ?? []).map((t: any) => [t.id, t.name as string]))
  const grades = (allGrades ?? []) as GradeRow[]
  const objectives = (allObjectives ?? []) as ObjectiveRow[]

  return (classes ?? []).map((cls: any) => {
    const c = cls as ClassRow
    const subj = c.subjects
    const color = subj?.color ?? '#64748B'
    const colorLight = subj?.color_light ?? '#F8FAFC'
    const subjectName = subj?.name ?? 'Disciplina'
    const teacher = teacherMap[c.teacher_id] ?? ''

    const clsGrades = grades.filter(g => g.class_id === c.id)
    const clsObjectives = objectives.filter(o => o.class_id === c.id)

    const bimGrades = clsGrades.filter(g => g.bimester === bimester)
    const bimObjectives = clsObjectives.filter(o => o.bimester === bimester)

    // history: averages for bimesters 1-3
    const history = [1, 2, 3].map(b => {
      if (c.grading_type === 'mencao') {
        const rows = clsObjectives.filter(o => o.bimester === b)
        return rows.length > 0 ? mencaoAvg(rows) : 0
      }
      const rows = clsGrades.filter(g => g.bimester === b)
      return rows.length > 0 ? weightedAvg(rows) : 0
    })

    const attendance = c.grading_type === 'mencao'
      ? bimObjectives[0]?.attendance ?? 100
      : bimGrades[0]?.attendance ?? 100

    if (c.grading_type === 'mencao') {
      const avg = mencaoAvg(bimObjectives)
      return {
        subjectId: subj?.id ?? c.id,
        subjectName,
        teacher,
        color,
        colorLight,
        gradingType: 'mencao' as const,
        average: avg,
        status: toStatus(avg, bimObjectives.length > 0),
        attendance,
        history,
        mencaoObjectives: bimObjectives
          .sort((a, b) => a.objective_index - b.objective_index)
          .map(o => ({ id: `${c.id}-${o.objective_index}`, title: o.title, value: o.value })),
      }
    }

    const avg = weightedAvg(bimGrades)
    return {
      subjectId: subj?.id ?? c.id,
      subjectName,
      teacher,
      color,
      colorLight,
      average: avg,
      status: toStatus(avg, bimGrades.some(g => g.score !== null)),
      attendance,
      history,
      assessments: bimGrades.map(g => ({ name: g.assessment, weight: g.weight, score: g.score })),
    }
  })
}

// --------------- UI components ---------------

function StatusBadge({ status }: { status: 'approved' | 'recovery' | 'failed' | 'pending' }) {
  const t = useTranslation()
  switch (status) {
    case 'approved':  return <span className="badge-success"><CheckCircle size={12} /> {t('common.approved')}</span>
    case 'recovery':  return <span className="badge-warning"><AlertTriangle size={12} /> {t('common.recovery')}</span>
    case 'failed':    return <span className="badge-danger"><XCircle size={12} /> {t('common.failed')}</span>
    default:          return <span className="badge-neutral"><Clock size={12} /> Aguardando</span>
  }
}

function MencaoObjectivesPanel({ subject }: { subject: ReportCardSubjectData & { gradingType: 'mencao' } }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-[#64748B]">Objetivos Bimestrais — Menção</p>
        <span className="text-xs text-[#94A3B8]">Máx: 5 × 2 = 10 pts</span>
      </div>
      <div className="space-y-2">
        {subject.mencaoObjectives.map((obj, i) => {
          const c = obj.value ? MENCAO_COLORS[obj.value] : null
          const pts = obj.value !== null ? MENCAO_SCORES[obj.value!] : null
          return (
            <div key={obj.id} className="flex items-center gap-3 py-2 border-b border-[#E2E8F0] last:border-0">
              <span className="text-[10px] font-bold text-[#94A3B8] w-12 flex-shrink-0">Obj. {i + 1}</span>
              <span className="text-sm text-[#0F172A] flex-1">{obj.title}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                {obj.value && c ? (
                  <>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: c.bg, color: c.text }}
                      title={c.label}
                    >
                      {obj.value}
                    </span>
                    <span className="text-xs text-[#64748B] w-12 text-right">{pts} pt{pts !== 1 ? 's' : ''}</span>
                  </>
                ) : (
                  <span className="text-xs text-[#94A3B8] w-20 text-right">Aguardando</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex items-center justify-between bg-[#E2E8F0] px-3 py-2 rounded-lg">
        <span className="text-xs font-medium text-[#64748B]">Total de pontos</span>
        <span className={clsx(
          'text-base font-bold font-display',
          subject.average >= 6 ? 'text-emerald-700' : subject.average >= 4 ? 'text-amber-700' : 'text-red-700'
        )}>
          {subject.average.toFixed(1)} / 10
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {MENCAO_ORDER.map(v => {
          const c = MENCAO_COLORS[v]
          return (
            <span key={v} className="flex items-center gap-1 text-[10px]">
              <span className="font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.text }}>{v}</span>
              <span className="text-[#94A3B8]">{c.label} ({MENCAO_SCORES[v]} pts)</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

function SubjectCard({ subject }: { subject: ReportCardSubjectData }) {
  const [expanded, setExpanded] = useState(false)
  const { gradeScale, approvalGrade, recoveryMin } = useSettingsStore()

  const isMencaoSubject = subject.gradingType === 'mencao'
  const isMencaoScale = gradeScale === 'mencao'
  const isMencao = isMencaoSubject || isMencaoScale

  const chartData = subject.history.map((avg, i) => ({
    bimestre: `${i + 1}º Bim`,
    média: gradeScale === 'percentage' ? Math.round(avg * 10) : avg,
  }))
  const chartDomain = gradeScale === 'percentage' ? [0, 100] : [0, 10]
  const chartTickFormatter = (v: number) => gradeScale === 'percentage' ? `${v}%` : gradeScale === 'conceptual' ? scoreToConceptual(v) : String(v)

  return (
    <div className="card overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
        style={{ borderLeft: `4px solid ${subject.color}` }}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display font-semibold text-[#0F172A]">{subject.subjectName}</p>
              {isMencaoSubject && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Menção PA–N
                </span>
              )}
              {!isMencaoSubject && gradeScale !== 'numeric' && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {gradeScale === 'percentage' ? '0–100%' : gradeScale === 'conceptual' ? 'A–E' : 'PA–N'}
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B]">{subject.teacher}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[11px] text-[#94A3B8]">Frequência</p>
            <p className={clsx('text-sm font-medium', subject.attendance >= recoveryMin * 10 / 6 ? 'text-emerald-600' : 'text-red-600')}>
              {subject.attendance}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-[#94A3B8]">{isMencaoSubject ? 'Total' : gradeScale === 'conceptual' ? 'Conceito' : 'Média'}</p>
            <p className={clsx('text-xl font-bold font-display', gradeColorClass(subject.average, approvalGrade, recoveryMin).replace('700', '600'))}>
              {isMencaoSubject ? subject.average.toFixed(1) : formatGrade(subject.average, gradeScale)}
            </p>
          </div>
          <StatusBadge status={subject.status} />
          <ChevronDown size={16} className={clsx('text-[#94A3B8] transition-transform', expanded && 'rotate-180')} />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#E2E8F0] p-4 bg-[#F8FAFC]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {isMencaoSubject ? (
              <MencaoObjectivesPanel subject={subject as ReportCardSubjectData & { gradingType: 'mencao' }} />
            ) : isMencaoScale ? (
              <div>
                <p className="text-xs font-medium text-[#64748B] mb-2">Menção Derivada (escala PA–N)</p>
                <div className="space-y-2">
                  {(subject as any).assessments.map((a: any) => {
                    const m = scoreToMencao(a.score)
                    const c = m ? MENCAO_COLORS[m] : null
                    return (
                      <div key={a.name} className="flex items-center gap-3 py-1.5 border-b border-[#E2E8F0] last:border-0">
                        <span className="text-xs text-[#94A3B8] w-16 flex-shrink-0">{a.weight}%</span>
                        <span className="text-sm text-[#0F172A] flex-1">{a.name}</span>
                        {m && c ? (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.text }}>{m}</span>
                        ) : <span className="text-xs text-[#94A3B8]">—</span>}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between bg-[#E2E8F0] px-3 py-2 rounded-lg">
                  <span className="text-xs text-[#64748B]">Menção geral derivada</span>
                  {(() => {
                    const m = scoreToMencao(subject.average)
                    const c = m ? MENCAO_COLORS[m] : null
                    return m && c ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.text }}>{m}</span>
                        <span className="text-xs text-[#64748B]">(média {subject.average.toFixed(1)})</span>
                      </div>
                    ) : null
                  })()}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-[#64748B] mb-2">Avaliações</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-2 text-xs font-medium text-[#94A3B8]">Avaliação</th>
                      <th className="pb-2 text-xs font-medium text-[#94A3B8] text-center">Peso</th>
                      <th className="pb-2 text-xs font-medium text-[#94A3B8] text-center">
                        {gradeScale === 'conceptual' ? 'Conceito' : gradeScale === 'percentage' ? 'Nota %' : 'Nota'}
                      </th>
                      {gradeScale === 'numeric' && <th className="pb-2 text-xs font-medium text-[#94A3B8] text-right">Contribuição</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {(subject as any).assessments.map((a: any) => {
                      const display = formatGrade(a.score, gradeScale)
                      const letter = gradeScale === 'conceptual' && a.score !== null ? scoreToConceptual(a.score) : null
                      const contrib = gradeScale === 'numeric' && a.score !== null ? ((a.score * a.weight) / 100).toFixed(2) : null
                      return (
                        <tr key={a.name}>
                          <td className="py-2 text-[#0F172A]">{a.name}</td>
                          <td className="py-2 text-center text-[#64748B]">{a.weight}%</td>
                          <td className="py-2 text-center">
                            {a.score !== null ? (
                              letter ? (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: CONCEPTUAL_COLORS[letter].bg, color: CONCEPTUAL_COLORS[letter].text }}>{letter}</span>
                              ) : (
                                <span className={clsx('font-semibold', gradeColorClass(a.score, approvalGrade, recoveryMin))}>{display}</span>
                              )
                            ) : <span className="text-[#94A3B8]">—</span>}
                          </td>
                          {gradeScale === 'numeric' && <td className="py-2 text-right text-[#64748B]">{contrib ?? '—'}</td>}
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[#E2E8F0]">
                      <td colSpan={gradeScale === 'numeric' ? 3 : 2} className="pt-2 text-xs font-medium text-[#64748B]">
                        {gradeScale === 'conceptual' ? 'Conceito final' : 'Média ponderada'}
                      </td>
                      <td className="pt-2 text-right font-bold text-[#0F172A]">
                        {formatGrade(subject.average, gradeScale)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-[#64748B] mb-2">
                Histórico de {isMencaoSubject ? 'Pontos' : gradeScale === 'conceptual' ? 'Conceitos' : gradeScale === 'percentage' ? 'Médias %' : 'Médias'}
              </p>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="bimestre" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis domain={chartDomain} tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={chartTickFormatter} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #E2E8F0' }}
                    formatter={(v: number) => [gradeScale === 'percentage' ? `${v}%` : gradeScale === 'conceptual' ? scoreToConceptual(v / 10 * 10) : v, 'Média']}
                  />
                  <Line type="monotone" dataKey="média" stroke={subject.color} strokeWidth={2} dot={{ fill: subject.color, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-[#64748B]">
                <span className="w-3 h-0.5 bg-red-400 inline-block" />
                Frequência mínima: 75%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --------------- main page ---------------

export function StudentReportCard() {
  const user = useAuthStore(s => s.user)
  const t = useTranslation()
  const [period, setPeriod] = useState('2')
  const [data, setData] = useState<ReportCardSubjectData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    fetchReportCardData(user.id, Number(period)).then(result => {
      if (!cancelled) { setData(result); setLoading(false) }
    })
    return () => { cancelled = true }
  }, [user, period])

  const handleExport = () => {
    toast('Exportação de PDF em breve!', 'info')
  }

  const overallAverage = data.length > 0
    ? (data.reduce((acc, s) => acc + s.average, 0) / data.length).toFixed(1)
    : '—'

  return (
    <>
      <Header
        title="Boletim Escolar"
        actions={
          <div className="flex items-center gap-2">
            <select
              aria-label="Selecionar bimestre"
              className="input h-9 text-sm pr-8"
              value={period}
              onChange={e => setPeriod(e.target.value)}
            >
              {['1', '2', '3', '4'].map(p => (
                <option key={p} value={p}>{p}º Bimestre</option>
              ))}
            </select>
            <button type="button" onClick={handleExport} className="btn-primary text-sm h-9">
              <Download size={14} /> Exportar PDF
            </button>
          </div>
        }
      />

      <div className="space-y-4">
        {/* Student info */}
        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-lg font-bold">
              {user?.name?.charAt(0) ?? '?'}
            </div>
            <div>
              <h2 className="font-display font-semibold text-[#0F172A]">{user?.name ?? '—'}</h2>
              <p className="text-sm text-[#64748B]">3º Ano A · {period}º Bimestre · 2024</p>
              <p className="text-xs text-[#94A3B8]">{user?.institution ?? 'Vekta'} · Matrícula: 2024001</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#94A3B8]">Média geral do período</p>
            {loading ? (
              <div className="h-9 w-16 bg-slate-100 rounded animate-pulse mt-1" />
            ) : (
              <p className={clsx(
                'text-3xl font-bold font-display',
                overallAverage === '—' ? 'text-[#94A3B8]'
                : parseFloat(overallAverage) >= 6 ? 'text-emerald-600'
                : parseFloat(overallAverage) >= 4 ? 'text-amber-600'
                : 'text-red-600'
              )}>
                {overallAverage}
              </p>
            )}
            {!loading && overallAverage !== '—' && (
              <StatusBadge status={parseFloat(overallAverage) >= 6 ? 'approved' : 'recovery'} />
            )}
          </div>
        </div>

        {/* Summary */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Aprovado em', value: `${data.filter(s => s.status === 'approved').length}/${data.length}`, sub: 'disciplinas' },
              { label: 'Frequência média', value: `${Math.round(data.reduce((a, s) => a + s.attendance, 0) / data.length)}%`, sub: 'das aulas' },
              { label: 'Em recuperação', value: `${data.filter(s => s.status === 'recovery').length}`, sub: 'disciplina(s)' },
            ].map(stat => (
              <div key={stat.label} className="card p-4 text-center">
                <p className="text-xs text-[#64748B]">{stat.label}</p>
                <p className="text-2xl font-bold font-display text-[#0F172A] mt-1">{stat.value}</p>
                <p className="text-xs text-[#94A3B8]">{stat.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card p-4 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                </div>
                <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Subject cards */}
        {!loading && (
          <div className="space-y-3">
            {data.map(subject => (
              <SubjectCard key={subject.subjectId} subject={subject} />
            ))}
            {data.length === 0 && (
              <div className="card p-12 text-center text-[#94A3B8]">
                <p className="font-medium">Nenhuma nota lançada para o {period}º Bimestre.</p>
              </div>
            )}
          </div>
        )}

        {/* PDF export note */}
        {!loading && data.length > 0 && (
          <div className="card p-4 flex items-start gap-3 bg-blue-50 border-blue-200">
            <TrendingUp size={16} className="text-[#1E3A8A] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#1E3A8A]">Exportação PDF</p>
              <p className="text-xs text-[#1E3A8A]/70 mt-0.5">
                O PDF inclui logo da instituição, dados do aluno, tabela completa de notas, frequências, situação final e QR Code de verificação digital.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
