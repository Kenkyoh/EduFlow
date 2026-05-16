import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, Upload, FileText, CheckCircle, ArrowLeft, AlertTriangle, Edit3, Paperclip } from 'lucide-react'
import { Header } from '../../components/Header'
import { mockActivities, getDaysUntil, getActivityTypeLabel } from '../../data/mock'
import { toast } from '../../components/Toast'
import clsx from 'clsx'

export function SubmitActivity() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const activity = mockActivities.find(a => a.id === id) ?? mockActivities[1]

  const [mode, setMode] = useState<'upload' | 'editor'>('upload')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedAt, setSubmittedAt] = useState<string | null>(null)

  const days = getDaysUntil(activity.dueDate)
  const isLate = days < 0
  const isUrgent = days >= 0 && days <= 1

  const handleSubmit = async () => {
    if (mode === 'editor' && !content.trim()) {
      toast('Escreva algo antes de enviar.', 'error')
      return
    }
    if (mode === 'upload' && files.length === 0) {
      toast('Selecione ao menos um arquivo.', 'error')
      return
    }

    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setSubmitting(false)
    setSubmitted(true)
    setSubmittedAt(new Date().toLocaleString('pt-BR'))
    toast('Atividade entregue com sucesso!')
  }

  if (submitted) {
    return (
      <>
        <Header title="Entrega de Atividade" />
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h2 className="font-display font-bold text-2xl text-[#0F172A] mb-2">Entrega confirmada!</h2>
          <p className="text-[#64748B] mb-1">Sua atividade foi recebida com sucesso.</p>
          <p className="text-sm text-[#94A3B8] mb-6">Enviado em: {submittedAt}</p>

          <div className="card p-4 text-left mb-6">
            <p className="text-sm font-medium text-[#0F172A]">{activity.title}</p>
            <p className="text-xs text-[#64748B] mt-1">{activity.subjectName} · {getActivityTypeLabel(activity.type)}</p>
            <p className="text-xs text-[#94A3B8] mt-1">Tentativa 1 de {activity.maxAttempts ?? 1}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="btn-secondary flex-1">
              Voltar ao dashboard
            </button>
            {activity.allowResubmit && (
              <button onClick={() => setSubmitted(false)} className="btn-ghost flex-1">
                Reenviar
              </button>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="Entregar Atividade" />

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        {/* Activity info */}
        <div className="card p-4 border-l-4" style={{ borderLeftColor: activity.subjectColor }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="subject-pill text-xs"
                  style={{ backgroundColor: activity.subjectColor + '15', color: activity.subjectColor }}
                >
                  {activity.subjectName}
                </span>
                <span className="text-xs text-[#94A3B8]">{getActivityTypeLabel(activity.type)}</span>
              </div>
              <h2 className="font-display font-semibold text-[#0F172A]">{activity.title}</h2>
              <p className="text-sm text-[#64748B] mt-1">Peso: {activity.weight}%</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={clsx(
                'flex items-center gap-1.5 text-sm font-medium',
                isLate ? 'text-red-500' : isUrgent ? 'text-amber-600' : 'text-[#64748B]'
              )}>
                {isLate ? <AlertTriangle size={14} /> : <Clock size={14} />}
                {isLate ? 'Prazo encerrado' : `${days === 0 ? 'Vence hoje' : days === 1 ? 'Vence amanhã' : `${days} dias restantes`}`}
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {new Date(activity.dueDate).toLocaleDateString('pt-BR')} às{' '}
                {new Date(activity.dueDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {isLate && (
            <div className="mt-3 flex items-center gap-2 p-2 bg-red-50 rounded-lg text-xs text-red-600">
              <AlertTriangle size={12} />
              Este prazo já encerrou. Você ainda pode enviar, mas será marcado como atrasado.
            </div>
          )}

          {isUrgent && !isLate && (
            <div className="mt-3 flex items-center gap-2 p-2 bg-amber-50 rounded-lg text-xs text-amber-700">
              <Clock size={12} />
              Entrega urgente! O prazo é amanhã às {new Date(activity.dueDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.
            </div>
          )}
        </div>

        {/* Submission mode toggle */}
        <div className="flex rounded-lg border border-[#E2E8F0] overflow-hidden">
          <button
            onClick={() => setMode('upload')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
              mode === 'upload' ? 'bg-[#1E3A8A] text-white' : 'bg-white text-[#64748B] hover:bg-slate-50'
            )}
          >
            <Upload size={16} /> Upload de arquivo
          </button>
          <button
            onClick={() => setMode('editor')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
              mode === 'editor' ? 'bg-[#1E3A8A] text-white' : 'bg-white text-[#64748B] hover:bg-slate-50'
            )}
          >
            <Edit3 size={16} /> Editor de texto
          </button>
        </div>

        {/* Upload mode */}
        {mode === 'upload' && (
          <div className="space-y-3">
            <label
              className={clsx(
                'flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all',
                files.length > 0
                  ? 'border-[#1E3A8A] bg-blue-50'
                  : 'border-[#E2E8F0] hover:border-[#1E3A8A] hover:bg-blue-50/30'
              )}
            >
              <Upload size={32} className="text-[#94A3B8]" />
              <div className="text-center">
                <p className="text-sm font-medium text-[#0F172A]">Arraste arquivos ou clique para selecionar</p>
                <p className="text-xs text-[#94A3B8] mt-1">PDF, Word, PowerPoint, imagens · Máx. 20MB por arquivo</p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={e => setFiles(Array.from(e.target.files ?? []))}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
              />
            </label>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Paperclip size={16} className="text-[#1E3A8A]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] truncate">{f.name}</p>
                      <p className="text-xs text-[#64748B]">{(f.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                    <button
                      onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                      className="text-[#94A3B8] hover:text-red-500 transition-colors text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Editor mode */}
        {mode === 'editor' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-lg">
              {['B', 'I', 'U', 'H1', 'H2', '• Lista', '1. Lista', '"Citação'].map(fmt => (
                <button
                  key={fmt}
                  className="px-2 py-1 text-xs font-medium text-[#64748B] hover:bg-white rounded hover:shadow-sm transition-all border border-transparent hover:border-[#E2E8F0]"
                >
                  {fmt}
                </button>
              ))}
            </div>
            <textarea
              className="input resize-none rounded-t-none"
              style={{ height: 300, borderTop: 'none' }}
              placeholder="Escreva sua resposta aqui..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <p className="text-[11px] text-[#94A3B8] text-right">{content.length} caracteres</p>
          </div>
        )}

        {/* Previous attempts */}
        {activity.allowResubmit && (
          <div className="card p-4">
            <p className="text-xs font-semibold text-[#64748B] mb-2">Histórico de tentativas</p>
            <div className="text-xs text-[#94A3B8]">Nenhuma tentativa anterior.</div>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary flex-1"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enviando...
              </span>
            ) : (
              <><CheckCircle size={16} /> Enviar entrega</>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
