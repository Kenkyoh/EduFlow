import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, FileText, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '../../components/Header'
import { mockSubmissions } from '../../data/mock'
import { useNotificationsStore } from '../../store/notifications'
import { toast } from '../../components/Toast'
import clsx from 'clsx'

export function CorrectSubmission() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const addNotification = useNotificationsStore(s => s.addNotification)

  const uncorrected = mockSubmissions.filter(s => s.status === 'submitted')
  const currentIdx = uncorrected.findIndex(s => s.id === id)
  const submission = uncorrected[currentIdx] ?? uncorrected[0]

  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleConfirm = async () => {
    const parsedGrade = parseFloat(grade.replace(',', '.'))
    if (isNaN(parsedGrade) || parsedGrade < 0 || parsedGrade > 10) {
      toast('Informe uma nota válida entre 0 e 10.', 'error')
      return
    }

    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    setSaving(false)
    setSaved(true)

    addNotification({
      id: `notif-grade-${Date.now()}`,
      type: 'grade',
      title: 'Nota lançada',
      body: `Sua nota de "${submission.activityTitle}" foi lançada: ${parsedGrade.toFixed(1)}`,
      source: 'Matemática — 3º Ano A',
      timestamp: 'agora mesmo',
      read: false,
      actionLabel: 'Ver boletim',
      actionPath: '/student/report-card',
    })

    toast(`Nota ${parsedGrade.toFixed(1)} confirmada para ${submission.studentName}. Aluno notificado!`)

    setTimeout(() => {
      const next = uncorrected[currentIdx + 1]
      if (next) navigate(`/teacher/correct/${next.id}`)
      else navigate('/teacher')
    }, 1500)
  }

  return (
    <>
      <Header title="Corrigir Entrega" />

      <div className="space-y-4">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A]"
          >
            <ArrowLeft size={16} /> Voltar à fila
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#64748B]">
              {currentIdx + 1} de {uncorrected.length} entregas
            </span>
            <button
              type="button"
              aria-label="Entrega anterior"
              disabled={currentIdx === 0}
              onClick={() => navigate(`/teacher/correct/${uncorrected[currentIdx - 1].id}`)}
              className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Próxima entrega"
              disabled={currentIdx >= uncorrected.length - 1}
              onClick={() => navigate(`/teacher/correct/${uncorrected[currentIdx + 1].id}`)}
              className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: submission viewer */}
          <div className="space-y-4">
            {/* Student info */}
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] font-bold">
                  {submission.studentName.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-semibold text-[#0F172A]">{submission.studentName}</p>
                  <p className="text-xs text-[#64748B]">Tentativa {submission.attempt}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-[#94A3B8]">Enviado em</p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {new Date(submission.submittedAt).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    {new Date(submission.submittedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity info */}
            <div className="card p-4">
              <p className="text-xs font-medium text-[#94A3B8] mb-1">Atividade</p>
              <p className="text-sm font-medium text-[#0F172A]">{submission.activityTitle}</p>
            </div>

            {/* Submission content */}
            <div className="card flex-1">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E2E8F0]">
                <FileText size={16} className="text-[#1E3A8A]" />
                <span className="text-sm font-medium text-[#0F172A]">Conteúdo da entrega</span>
              </div>
              <div className="p-4">
                {submission.files && submission.files.length > 0 && (
                  <div className="space-y-2">
                    {submission.files.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
                        <FileText size={20} className="text-[#1E3A8A]" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#0F172A]">{f.name}</p>
                          <p className="text-xs text-[#64748B]">{f.size}</p>
                        </div>
                        <span className="text-xs text-[#1E3A8A] font-medium">Visualizar</span>
                      </div>
                    ))}
                  </div>
                )}
                {submission.content && (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm text-[#0F172A] leading-relaxed">{submission.content}</p>
                  </div>
                )}

                {/* Simulated PDF viewer */}
                {submission.files?.[0]?.type === 'pdf' && (
                  <div className="mt-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-8 text-center">
                    <FileText size={48} className="text-[#94A3B8] mx-auto mb-3" strokeWidth={1} />
                    <p className="text-sm text-[#64748B]">Visualizador de PDF</p>
                    <p className="text-xs text-[#94A3B8] mt-1">{submission.files[0].name}</p>
                    <button type="button" className="mt-3 btn-secondary text-xs">
                      Abrir em nova aba
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: grading panel */}
          <div className="space-y-4">
            <div className="card p-5 space-y-4">
              <h3 className="font-display font-semibold text-[#0F172A]">Avaliação</h3>

              {/* Grade input */}
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-2">
                  Nota (0–10) <span className="text-[#DC2626]">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    className="input text-2xl font-bold text-center w-28 h-14"
                    placeholder="0.0"
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    inputMode="decimal"
                  />
                  <div className="flex-1 space-y-1">
                    {[10, 9, 8, 7, 6, 5].map(n => (
                      <div key={n} className="flex items-center gap-2">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${n * 10}%`,
                            backgroundColor: n >= 7 ? '#059669' : n >= 6 ? '#D97706' : '#DC2626',
                          }}
                        />
                        <span className="text-[11px] text-[#94A3B8] w-6">{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Quick grades */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGrade(n.toFixed(1))}
                      className={clsx(
                        'px-2 py-0.5 rounded text-xs font-medium border transition-all',
                        grade === n.toFixed(1)
                          ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                          : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1E3A8A]'
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-2">Feedback detalhado</label>
                <textarea
                  className="input resize-none"
                  style={{ height: 140 }}
                  placeholder="Forneça um feedback construtivo sobre a entrega do aluno..."
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />
              </div>

              {/* Rubric (simplified) */}
              <div>
                <p className="text-xs font-medium text-[#64748B] mb-2">Rubrica de avaliação</p>
                <div className="space-y-2">
                  {[
                    { criterion: 'Estrutura e organização', max: 3 },
                    { criterion: 'Argumentação e fundamentação', max: 4 },
                    { criterion: 'Uso de fontes e referências', max: 2 },
                    { criterion: 'Ortografia e gramática', max: 1 },
                  ].map(r => (
                    <div key={r.criterion} className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B]">{r.criterion}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: r.max }, (_, i) => i + 1).map(v => (
                          <button
                            key={v}
                            type="button"
                            className="w-6 h-6 rounded border border-[#E2E8F0] hover:border-[#1E3A8A] hover:bg-blue-50 transition-all text-[11px] text-[#64748B]"
                          >
                            {v}
                          </button>
                        ))}
                        <span className="text-[#94A3B8] ml-1">/{r.max}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note about notification */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <AlertCircle size={14} className="text-[#1E3A8A] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#1E3A8A]">
                  Ao confirmar, o aluno receberá uma notificação in-app e por e-mail com a nota e o feedback.
                </p>
              </div>

              {saved ? (
                <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 rounded-lg">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-sm text-emerald-700 font-medium">Nota confirmada! Redirecionando...</span>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button type="button" onClick={() => navigate(-1)} className="btn-ghost flex-1">
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={saving}
                    className="btn-primary flex-1"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Confirmando...
                      </span>
                    ) : (
                      <><CheckCircle size={16} /> Confirmar nota</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
