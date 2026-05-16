import { useState } from 'react'
import { Download, CheckCircle, AlertTriangle, XCircle, Clock, TrendingUp, ChevronDown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Header } from '../../components/Header'
import { mockReportCardData, MENCAO_COLORS, MENCAO_SCORES, MENCAO_ORDER } from '../../data/mock'
import { useSettingsStore } from '../../store/settings'
import { formatGrade, gradeColorClass, scoreToMencao, scoreToConceptual, CONCEPTUAL_COLORS } from '../../utils/gradeFormat'
import { toast } from '../../components/Toast'
import type { ReportCardSubjectData } from '../../types'
import clsx from 'clsx'

function StatusBadge({ status }: { status: 'approved' | 'recovery' | 'failed' | 'pending' }) {
  switch (status) {
    case 'approved':  return <span className="badge-success"><CheckCircle size={12} /> Aprovado</span>
    case 'recovery':  return <span className="badge-warning"><AlertTriangle size={12} /> Recuperação</span>
    case 'failed':    return <span className="badge-danger"><XCircle size={12} /> Reprovado</span>
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

  // For chart: percentage scale multiplies values × 10
  const chartData = subject.history.map((avg, i) => ({
    bimestre: `${i + 1}º Bim`,
    média: gradeScale === 'percentage' ? Math.round(avg * 10) : avg,
  }))
  const historyData = chartData
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
              /* Global Menção scale: derive PA-N from numeric average */
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
                <LineChart data={historyData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
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

export function StudentReportCard() {
  const [period, setPeriod] = useState('2')

  const handleExport = () => {
    toast('Gerando PDF... Isso pode levar alguns segundos.', 'info')
    setTimeout(() => toast('Boletim exportado com sucesso! Download iniciado.'), 2000)
  }

  const overallAverage = (
    mockReportCardData.reduce((acc, s) => acc + s.average, 0) / mockReportCardData.length
  ).toFixed(1)

  return (
    <>
      <Header
        title="Boletim Escolar"
        actions={
          <div className="flex items-center gap-2">
            <select
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
              L
            </div>
            <div>
              <h2 className="font-display font-semibold text-[#0F172A]">Lucas Mendes</h2>
              <p className="text-sm text-[#64748B]">3º Ano A · {period}º Bimestre · 2024</p>
              <p className="text-xs text-[#94A3B8]">Colégio Estadual São Paulo · Matrícula: 2024001</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#94A3B8]">Média geral do período</p>
            <p className={clsx(
              'text-3xl font-bold font-display',
              parseFloat(overallAverage) >= 6 ? 'text-emerald-600'
              : parseFloat(overallAverage) >= 4 ? 'text-amber-600'
              : 'text-red-600'
            )}>
              {overallAverage}
            </p>
            <StatusBadge status={parseFloat(overallAverage) >= 6 ? 'approved' : 'recovery'} />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Aprovado em', value: `${mockReportCardData.filter(s => s.status === 'approved').length}/${mockReportCardData.length}`, sub: 'disciplinas' },
            { label: 'Frequência média', value: `${Math.round(mockReportCardData.reduce((a, s) => a + s.attendance, 0) / mockReportCardData.length)}%`, sub: 'das aulas' },
            { label: 'Em recuperação', value: `${mockReportCardData.filter(s => s.status === 'recovery').length}`, sub: 'disciplina(s)' },
          ].map(stat => (
            <div key={stat.label} className="card p-4 text-center">
              <p className="text-xs text-[#64748B]">{stat.label}</p>
              <p className="text-2xl font-bold font-display text-[#0F172A] mt-1">{stat.value}</p>
              <p className="text-xs text-[#94A3B8]">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Subject cards */}
        <div className="space-y-3">
          {mockReportCardData.map(subject => (
            <SubjectCard key={subject.subjectId} subject={subject} />
          ))}
        </div>

        {/* PDF export note */}
        <div className="card p-4 flex items-start gap-3 bg-blue-50 border-blue-200">
          <TrendingUp size={16} className="text-[#1E3A8A] mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#1E3A8A]">Exportação PDF</p>
            <p className="text-xs text-[#1E3A8A]/70 mt-0.5">
              O PDF inclui logo da instituição, dados do aluno, tabela completa de notas, frequências, situação final e QR Code de verificação digital.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
