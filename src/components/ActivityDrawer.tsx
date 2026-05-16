import { X, AlertTriangle, Calendar, Clock, Paperclip, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { mockSubjects, mockClasses } from '../data/mock'
import { toast } from './Toast'

const ACTIVITY_TYPES = [
  { value: 'prova', label: 'Prova' },
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'apresentacao', label: 'Apresentação' },
  { value: 'leitura', label: 'Leitura' },
  { value: 'aula_ao_vivo', label: 'Aula ao Vivo' },
  { value: 'outro', label: 'Outro' },
]

interface ActivityDrawerProps {
  isOpen: boolean
  onClose: () => void
  initialDate?: string
  onPublish?: (data: ActivityFormData) => void
}

export interface ActivityFormData {
  title: string
  subjectId: string
  classIds: string[]
  type: string
  startDate: string
  dueDate: string
  dueTime: string
  weight: number
  description: string
  allowResubmit: boolean
  maxAttempts: number
  notifyStudents: boolean
  visibility: 'now' | 'scheduled'
}

export function ActivityDrawer({ isOpen, onClose, initialDate, onPublish }: ActivityDrawerProps) {
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState<ActivityFormData>({
    title: '',
    subjectId: 'mat',
    classIds: ['turma-a'],
    type: 'trabalho',
    startDate: initialDate ?? today,
    dueDate: initialDate ?? today,
    dueTime: '23:59',
    weight: 30,
    description: '',
    allowResubmit: false,
    maxAttempts: 2,
    notifyStudents: true,
    visibility: 'now',
  })
  const [conflict, setConflict] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (initialDate) {
      setForm(f => ({ ...f, startDate: initialDate, dueDate: initialDate }))
    }
  }, [initialDate])

  useEffect(() => {
    if (form.type === 'prova') {
      setConflict(Math.random() > 0.5)
    } else {
      setConflict(false)
    }
  }, [form.type, form.dueDate])

  const selectedSubject = mockSubjects.find(s => s.id === form.subjectId)

  const impactPreview = (() => {
    const currentWeights = 70
    const newTotal = currentWeights + form.weight
    if (newTotal > 100) return { over: true, total: newTotal }
    return { over: false, total: newTotal }
  })()

  const handlePublish = async () => {
    if (!form.title.trim()) {
      toast('Informe o título da atividade', 'error')
      return
    }
    setPublishing(true)
    await new Promise(r => setTimeout(r, 1000))
    setPublishing(false)
    onPublish?.(form)
    toast(`"${form.title}" publicada com sucesso!`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] flex-shrink-0">
          <div>
            <h2 className="font-display font-semibold text-[#0F172A]">Nova Atividade</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Preencha os campos abaixo</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#64748B]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Conflict alert */}
          {conflict && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle size={16} className="text-[#D97706] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Conflito detectado</p>
                <p className="text-xs text-amber-700 mt-0.5">Já existe uma prova no 3º Ano A neste dia.</p>
                <div className="flex gap-2 mt-2">
                  {['+1 dia', '+3 dias', '+1 sem'].map(d => (
                    <button
                      key={d}
                      className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-medium hover:bg-amber-200 transition-colors"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">
              Título <span className="text-[#DC2626]">*</span>
            </label>
            <input
              className="input"
              placeholder="Ex: Prova Bimestral — Funções Quadráticas"
              maxLength={120}
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            <p className="text-[11px] text-[#94A3B8] mt-1 text-right">{form.title.length}/120</p>
          </div>

          {/* Subject + Class */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Disciplina</label>
              <div className="relative">
                <select
                  className="input appearance-none pr-8"
                  value={form.subjectId}
                  onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}
                >
                  {mockSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
              </div>
              {selectedSubject && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: selectedSubject.color }}
                  />
                  <span className="text-[11px] text-[#64748B]">{selectedSubject.name}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Turma(s)</label>
              <div className="space-y-1.5 max-h-24 overflow-y-auto">
                {mockClasses.map(c => (
                  <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 rounded border-[#E2E8F0] text-[#1E3A8A] accent-[#1E3A8A]"
                      checked={form.classIds.includes(c.id)}
                      onChange={e => {
                        setForm(f => ({
                          ...f,
                          classIds: e.target.checked
                            ? [...f.classIds, c.id]
                            : f.classIds.filter(id => id !== c.id),
                        }))
                      }}
                    />
                    <span className="text-xs text-[#0F172A]">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">Tipo</label>
            <div className="flex flex-wrap gap-1.5">
              {ACTIVITY_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setForm(f => ({ ...f, type: t.value }))}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    form.type === t.value
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1E3A8A] hover:text-[#1E3A8A]'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                <Calendar size={12} className="inline mr-1" />
                Data de início
              </label>
              <input
                type="date"
                className="input"
                value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                <Clock size={12} className="inline mr-1" />
                Data de entrega <span className="text-[#DC2626]">*</span>
              </label>
              <div className="flex gap-1.5">
                <input
                  type="date"
                  className="input flex-1"
                  value={form.dueDate}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                />
                <input
                  type="time"
                  className="input w-24"
                  value={form.dueTime}
                  onChange={e => setForm(f => ({ ...f, dueTime: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Weight */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#64748B]">
                Peso na nota
              </label>
              <span className="text-sm font-semibold text-[#1E3A8A]">{form.weight}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={form.weight}
              onChange={e => setForm(f => ({ ...f, weight: parseInt(e.target.value) }))}
              className="w-full accent-[#1E3A8A]"
            />
            <div className={clsx(
              'mt-2 p-2.5 rounded-lg text-xs',
              impactPreview.over ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
            )}>
              {impactPreview.over ? (
                <span>⚠ Total de pesos: {impactPreview.total}% — excede 100%</span>
              ) : (
                <span>
                  Preview: P1 (40%) + Trabalho ({form.weight}%) + Part. (30%) = {impactPreview.total}%
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">Descrição</label>
            <textarea
              className="input resize-none"
              style={{ height: 80 }}
              placeholder="Instruções, critérios, links de referência..."
              maxLength={5000}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
            <p className="text-[11px] text-[#94A3B8] mt-1 text-right">{form.description.length}/5000</p>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">
              <Paperclip size={12} className="inline mr-1" />
              Anexos (até 5 arquivos, 20MB cada)
            </label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 cursor-pointer hover:border-[#1E3A8A] hover:bg-blue-50/30 transition-all">
              <Paperclip size={16} className="text-[#94A3B8]" />
              <span className="text-sm text-[#94A3B8]">Clique para selecionar ou arraste arquivos</span>
              <input type="file" multiple className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg" />
            </label>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Permitir reentrega</p>
                <p className="text-xs text-[#94A3B8]">Alunos podem enviar novamente</p>
              </div>
              <button
                onClick={() => setForm(f => ({ ...f, allowResubmit: !f.allowResubmit }))}
                className={clsx(
                  'relative w-10 h-5.5 rounded-full transition-colors',
                  form.allowResubmit ? 'bg-[#1E3A8A]' : 'bg-[#E2E8F0]'
                )}
                style={{ height: 22 }}
              >
                <span className={clsx(
                  'absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform',
                  form.allowResubmit ? 'translate-x-5' : 'translate-x-0.5'
                )} style={{ width: 18, height: 18 }} />
              </button>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Notificar alunos</p>
                <p className="text-xs text-[#94A3B8]">Enviar alerta ao publicar</p>
              </div>
              <button
                onClick={() => setForm(f => ({ ...f, notifyStudents: !f.notifyStudents }))}
                className={clsx(
                  'relative w-10 rounded-full transition-colors',
                  form.notifyStudents ? 'bg-[#1E3A8A]' : 'bg-[#E2E8F0]'
                )}
                style={{ height: 22 }}
              >
                <span className={clsx(
                  'absolute top-0.5 w-4.5 rounded-full bg-white shadow transition-transform',
                  form.notifyStudents ? 'translate-x-5' : 'translate-x-0.5'
                )} style={{ width: 18, height: 18 }} />
              </button>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-[#E2E8F0] flex-shrink-0">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn-primary flex-1"
          >
            {publishing ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publicando...
              </span>
            ) : 'Publicar'}
          </button>
        </div>
      </div>
    </>
  )
}
