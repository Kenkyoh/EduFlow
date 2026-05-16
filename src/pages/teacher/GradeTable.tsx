import { useState, useRef, useEffect } from 'react'
import { Download, ChevronDown, CheckCircle, AlertTriangle, XCircle, Clock, Pencil, Check } from 'lucide-react'
import { Header } from '../../components/Header'
import { useGradesStore } from '../../store/grades'
import { useMencaoStore } from '../../store/mencao'
import { useSettingsStore } from '../../store/settings'
import { mockAssessments, mockClasses, MENCAO_ORDER, MENCAO_COLORS, MENCAO_SCORES } from '../../data/mock'
import {
  CONCEPTUAL_ORDER, CONCEPTUAL_VALUES, CONCEPTUAL_COLORS, scoreToConceptual,
  formatGrade, gradeColorClass,
} from '../../utils/gradeFormat'
import { toast } from '../../components/Toast'
import type { MencaoValue } from '../../types'
import clsx from 'clsx'

// ─── Shared status components ────────────────────────────────────────────────

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'approved': return <CheckCircle size={14} className="text-emerald-500" />
    case 'recovery': return <AlertTriangle size={14} className="text-amber-500" />
    case 'failed': return <XCircle size={14} className="text-red-500" />
    default: return <Clock size={14} className="text-[#94A3B8]" />
  }
}

function StatusBadge({ status }: { status: string }) {
  const map = {
    approved: { label: 'Aprovado', cls: 'badge-success' },
    recovery: { label: 'Recuperação', cls: 'badge-warning' },
    failed: { label: 'Reprovado', cls: 'badge-danger' },
    pending: { label: 'Aguardando', cls: 'badge-neutral' },
  }
  const s = map[status as keyof typeof map] ?? map.pending
  return <span className={s.cls}><StatusIcon status={status} />{s.label}</span>
}

// ─── Numeric / Percentage grade cell ─────────────────────────────────────────

function GradeCell({
  studentId, assessmentId, score, isFlashing, isRecovery, isPercentage = false,
}: {
  studentId: string
  assessmentId: string
  score: number | null
  isFlashing: boolean
  isRecovery?: boolean
  isPercentage?: boolean
}) {
  const displayScore = isPercentage && score !== null ? Math.round(score * 10) : score
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState(displayScore !== null ? String(displayScore) : '')
  const inputRef = useRef<HTMLInputElement>(null)
  const updateGrade = useGradesStore(s => s.updateGrade)
  const { approvalGrade, recoveryMin } = useSettingsStore()

  useEffect(() => { setInputVal(displayScore !== null ? String(displayScore) : '') }, [score])
  useEffect(() => { if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [editing])

  const commit = () => {
    const parsed = parseFloat(inputVal.replace(',', '.'))
    const maxVal = isPercentage ? 100 : 10
    if (inputVal === '' || inputVal === '—') {
      updateGrade(studentId, assessmentId, null)
    } else if (!isNaN(parsed) && parsed >= 0 && parsed <= maxVal) {
      const stored = isPercentage ? Math.round(parsed) / 10 : Math.round(parsed * 10) / 10
      updateGrade(studentId, assessmentId, stored)
      toast(`Nota salva: ${isPercentage ? parsed + '%' : stored.toFixed(1)}`, 'success')
    } else {
      toast(`Nota inválida. Use 0 a ${maxVal}.`, 'error')
      setInputVal(displayScore !== null ? String(displayScore) : '')
    }
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); commit() }
    else if (e.key === 'Escape') { setInputVal(displayScore !== null ? String(displayScore) : ''); setEditing(false) }
  }

  const displayText = score === null ? '—'
    : isPercentage ? `${Math.round(score * 10)}%`
    : score.toFixed(1)

  return (
    <td
      className={clsx('grade-cell relative', isFlashing && 'grade-flash', editing && 'p-0')}
      onClick={() => !editing && setEditing(true)}
    >
      {editing ? (
        <input
          ref={inputRef}
          className="w-full h-9 text-center text-sm border-2 border-[#1E3A8A] rounded outline-none px-1"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          type="text"
          inputMode="decimal"
          placeholder={isPercentage ? '0–100' : '0.0'}
        />
      ) : (
        <div className="flex flex-col items-center gap-0.5">
          <span className={clsx('text-sm font-medium', gradeColorClass(score, approvalGrade, recoveryMin))}>
            {displayText}
          </span>
          {isRecovery && score !== null && (
            <span className="text-[9px] font-bold text-amber-600 bg-amber-100 px-1 rounded">Rec.</span>
          )}
        </div>
      )}
    </td>
  )
}

// ─── Conceptual (A–E) cell ────────────────────────────────────────────────────

function ConceptualCell({
  studentId, assessmentId, score,
}: {
  studentId: string
  assessmentId: string
  score: number | null
}) {
  const [open, setOpen] = useState(false)
  const updateGrade = useGradesStore(s => s.updateGrade)
  const letter = score !== null ? scoreToConceptual(score) : null

  const handleSelect = (v: string | null) => {
    if (v === null) {
      updateGrade(studentId, assessmentId, null)
    } else {
      const numeric = CONCEPTUAL_VALUES[v as keyof typeof CONCEPTUAL_VALUES]
      updateGrade(studentId, assessmentId, numeric)
      toast(`Conceito salvo: ${v}`, 'success')
    }
    setOpen(false)
  }

  return (
    <td className="grade-cell relative cursor-pointer" onClick={() => setOpen(o => !o)}>
      {open ? (
        <div
          className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5"
          onClick={e => e.stopPropagation()}
        >
          {CONCEPTUAL_ORDER.map(v => {
            const c = CONCEPTUAL_COLORS[v]
            return (
              <button
                key={v}
                onClick={() => handleSelect(v)}
                className={clsx('w-8 h-8 rounded-lg text-xs font-bold transition-all border hover:scale-105',
                  letter === v ? 'ring-2 ring-offset-1 scale-110' : '')}
                style={{ backgroundColor: c.bg, color: c.text, borderColor: letter === v ? c.text : 'transparent' }}
                title={c.label}
              >{v}</button>
            )
          })}
          <button onClick={() => handleSelect(null)} className="w-8 h-8 rounded-lg text-xs text-[#94A3B8] border border-[#E2E8F0] hover:bg-[#F8FAFC]">—</button>
        </div>
      ) : (
        letter ? (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: CONCEPTUAL_COLORS[letter].bg, color: CONCEPTUAL_COLORS[letter].text }}>
            {letter}
          </span>
        ) : (
          <span className="text-[#94A3B8] text-sm">—</span>
        )
      )}
    </td>
  )
}

// ─── Menção badge ─────────────────────────────────────────────────────────────

function MencaoBadge({ value }: { value: MencaoValue | null }) {
  if (!value) return <span className="text-[#94A3B8] text-sm select-none">—</span>
  const c = MENCAO_COLORS[value]
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full select-none"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {value}
    </span>
  )
}

// ─── Menção cell ──────────────────────────────────────────────────────────────

function MencaoCell({
  studentId, objectiveId, value, onUpdate,
}: {
  studentId: string
  objectiveId: string
  value: MencaoValue | null
  onUpdate: (v: MencaoValue | null) => void
}) {
  const [open, setOpen] = useState(false)

  const handleSelect = (v: MencaoValue | null) => {
    onUpdate(v)
    setOpen(false)
    if (v !== null) toast(`Menção salva: ${v} (${MENCAO_SCORES[v]} pts)`, 'success')
  }

  return (
    <td
      className="grade-cell relative cursor-pointer"
      onClick={() => setOpen(o => !o)}
    >
      {open ? (
        <div
          className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5"
          onClick={e => e.stopPropagation()}
        >
          {MENCAO_ORDER.map(v => {
            const c = MENCAO_COLORS[v]
            return (
              <button
                key={v}
                onClick={() => handleSelect(v)}
                className={clsx(
                  'w-8 h-8 rounded-lg text-xs font-bold transition-all border',
                  value === v ? 'ring-2 ring-offset-1 scale-110' : 'hover:scale-105'
                )}
                style={{
                  backgroundColor: c.bg,
                  color: c.text,
                  borderColor: value === v ? c.text : 'transparent',
                }}
                title={c.label}
              >
                {v}
              </button>
            )
          })}
          <button
            onClick={() => handleSelect(null)}
            className="w-8 h-8 rounded-lg text-xs text-[#94A3B8] border border-[#E2E8F0] hover:bg-[#F8FAFC]"
            title="Limpar"
          >
            —
          </button>
        </div>
      ) : (
        <MencaoBadge value={value} />
      )}
    </td>
  )
}

// ─── Objective header (editable) ─────────────────────────────────────────────

function ObjectiveHeader({
  objective, order,
}: {
  objective: { id: string; title: string; description?: string }
  order: number
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(objective.title)
  const updateObjective = useMencaoStore(s => s.updateObjective)

  const commit = () => {
    if (title.trim()) {
      updateObjective(objective.id, title.trim(), objective.description)
      toast('Objetivo atualizado', 'success')
    } else {
      setTitle(objective.title)
    }
    setEditing(false)
  }

  return (
    <th className="px-2 py-3 text-center text-xs font-medium text-[#64748B] min-w-[110px]">
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-[#94A3B8] font-normal">Obj. {order}</span>
        {editing ? (
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <input
              autoFocus
              className="text-xs border border-[#1E3A8A] rounded px-1 py-0.5 w-24 outline-none"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={commit}
              onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setTitle(objective.title); setEditing(false) } }}
            />
            <button type="button" aria-label="Confirmar edição" onClick={commit} className="text-emerald-600"><Check size={11} /></button>
          </div>
        ) : (
          <button
            type="button"
            className="flex items-center gap-1 hover:text-[#1E3A8A] group"
            onClick={() => setEditing(true)}
            title={objective.description}
          >
            <span className="text-xs font-medium text-[#0F172A] text-center leading-tight max-w-[100px] truncate">
              {objective.title}
            </span>
            <Pencil size={10} className="text-[#94A3B8] opacity-0 group-hover:opacity-100 flex-shrink-0" />
          </button>
        )}
      </div>
    </th>
  )
}

// ─── Menção grade table ───────────────────────────────────────────────────────

function MencaoGradeTable({ cls }: { cls: typeof mockClasses[0] }) {
  const { grades, objectives } = useMencaoStore()
  const updateGrade = useMencaoStore(s => s.updateGrade)

  const classAvg = grades.filter(g => g.total > 0).length > 0
    ? (grades.filter(g => g.total > 0).reduce((acc, g) => acc + g.total, 0) / grades.filter(g => g.total > 0).length).toFixed(1)
    : '—'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-8 rounded" style={{ backgroundColor: cls.color }} />
          <div>
            <p className="font-display font-semibold text-[#0F172A]">{cls.name} — {cls.subjectName}</p>
            <p className="text-xs text-[#64748B]">{cls.studentsCount} alunos · {cls.period} · Modo: Menção PA–N</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#64748B]">
          {(['PA','AC','A','P','N'] as MencaoValue[]).map(v => {
            const c = MENCAO_COLORS[v]
            return (
              <span key={v} className="flex items-center gap-1">
                <span className="w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: c.bg, color: c.text }}>{v}</span>
                = {MENCAO_SCORES[v]} pts
              </span>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-[#94A3B8] bg-[#F8FAFC] px-4 py-2 rounded-lg border border-[#E2E8F0]">
        <span>Clique na célula para selecionar a menção</span>
        <span>·</span>
        <span>Clique no título do objetivo (<Pencil size={10} className="inline" />) para editar</span>
        <span>·</span>
        <span>Total máximo: 5 × 2 = <strong>10 pontos</strong></span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] w-44">Aluno</th>
                {objectives.map(obj => (
                  <ObjectiveHeader key={obj.id} objective={obj} order={obj.order} />
                ))}
                <th className="px-3 py-3 text-center text-xs font-medium text-[#64748B] bg-slate-100 min-w-[72px]">
                  Total
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-[#64748B] min-w-[110px]">
                  Situação
                </th>
              </tr>
            </thead>
            <tbody>
              {grades.map(student => (
                <tr
                  key={student.studentId}
                  className={clsx('hover:bg-[#F8FAFC] transition-colors', student.inactive && 'opacity-60')}
                >
                  <td className="px-4 py-2 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-semibold flex-shrink-0">
                        {student.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">{student.studentName}</p>
                        {student.inactive && (
                          <span className="text-[10px] text-[#94A3B8] bg-slate-100 px-1.5 py-0.5 rounded">Inativo</span>
                        )}
                      </div>
                    </div>
                  </td>
                  {objectives.map(obj => {
                    const grade = student.grades.find(g => g.objectiveId === obj.id)
                    return (
                      <MencaoCell
                        key={obj.id}
                        studentId={student.studentId}
                        objectiveId={obj.id}
                        value={grade?.value ?? null}
                        onUpdate={v => updateGrade(student.studentId, obj.id, v)}
                      />
                    )
                  })}
                  <td className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] text-center">
                    <span className={clsx(
                      'text-sm font-bold',
                      student.status === 'pending' ? 'text-[#94A3B8]'
                      : student.total >= 6 ? 'text-emerald-700'
                      : student.total >= 4 ? 'text-amber-700'
                      : 'text-red-700'
                    )}>
                      {student.status === 'pending' ? '—' : student.total.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b border-[#F1F5F9] text-center">
                    <StatusBadge status={student.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B]">
          <span>{grades.length} alunos</span>
          <span>
            {grades.filter(g => g.status === 'approved').length} aprovados ·{' '}
            {grades.filter(g => g.status === 'recovery').length} em recuperação ·{' '}
            {grades.filter(g => g.status === 'failed').length} reprovados
          </span>
          <span>Média da turma: {classAvg}</span>
        </div>
      </div>

      <div className="card p-4">
        <p className="text-xs font-medium text-[#64748B] mb-3">Escala de Menção — Objetivos Bimestrais</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {(MENCAO_ORDER).map(v => {
            const c = MENCAO_COLORS[v]
            return (
              <div key={v} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: c.bg }}>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.text }}>{v}</span>
                <span className="text-xs text-[#0F172A] font-medium">{c.label}</span>
                <span className="text-xs text-[#64748B]">= {MENCAO_SCORES[v]} pt{MENCAO_SCORES[v] !== 1 ? 's' : ''}</span>
              </div>
            )
          })}
        </div>
        <p className="text-xs font-mono bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0] text-[#0F172A]">
          Total = Σ(valor de cada objetivo)&nbsp;&nbsp;|&nbsp;&nbsp;Máx: 5 × PA(2) = <strong>10</strong>&nbsp;&nbsp;|&nbsp;&nbsp;Aprovação: Total ≥ 6
        </p>
      </div>
    </div>
  )
}

// ─── Main GradeTable ──────────────────────────────────────────────────────────

export function GradeTable() {
  const { grades, flashCells } = useGradesStore()
  const [selectedClass, setSelectedClass] = useState('turma-a')
  const { gradeScale, approvalGrade, recoveryMin } = useSettingsStore()

  const cls = mockClasses.find(c => c.id === selectedClass) ?? mockClasses[0]
  const isMencao = cls.gradingType === 'mencao' || gradeScale === 'mencao'
  const isPercentage = gradeScale === 'percentage'
  const isConceptual = gradeScale === 'conceptual'

  return (
    <>
      <Header
        title="Grade de Notas"
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                className="input pr-8 appearance-none text-sm h-9 pl-3"
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
              >
                {mockClasses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.subjectName}{c.gradingType === 'mencao' ? ' (Menção)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            </div>
            <button type="button" className="btn-secondary text-sm h-9">
              <Download size={14} /> Exportar
            </button>
          </div>
        }
      />

      {isMencao ? (
        <MencaoGradeTable cls={cls} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-8 rounded" style={{ backgroundColor: cls.color }} />
              <div>
                <p className="font-display font-semibold text-[#0F172A]">{cls.name} — {cls.subjectName}</p>
                <p className="text-xs text-[#64748B]">
                  {cls.studentsCount} alunos · {cls.period} · Escala: <strong>{gradeScale === 'percentage' ? '0–100%' : gradeScale === 'conceptual' ? 'A–E' : '0–10'}</strong> · Clique para editar
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                Aprovado ≥{formatGrade(approvalGrade, gradeScale)}
              </span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
                Recup. {formatGrade(recoveryMin, gradeScale)}–{formatGrade(approvalGrade - 0.1, gradeScale)}
              </span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 border border-red-300" />
                Reprov. &lt;{formatGrade(recoveryMin, gradeScale)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#94A3B8] bg-[#F8FAFC] px-4 py-2 rounded-lg border border-[#E2E8F0]">
            <span><kbd className="bg-white border border-[#E2E8F0] px-1 rounded text-[10px]">Tab</kbd> → Próxima coluna</span>
            <span><kbd className="bg-white border border-[#E2E8F0] px-1 rounded text-[10px]">Enter</kbd> → Próxima linha</span>
            <span><kbd className="bg-white border border-[#E2E8F0] px-1 rounded text-[10px]">Esc</kbd> → Cancelar</span>
            <span>Células vazias não entram na média</span>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] w-48">Aluno</th>
                    {mockAssessments.map(a => (
                      <th key={a.id} className="px-3 py-3 text-center text-xs font-medium text-[#64748B] min-w-[90px]">
                        <div>{a.name}</div>
                        {!isConceptual && <div className="text-[10px] text-[#94A3B8] font-normal">{a.weight}%</div>}
                      </th>
                    ))}
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#64748B] bg-slate-100 min-w-[80px]">
                      {isConceptual ? 'Conceito' : isPercentage ? 'Média %' : 'Média'}
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#64748B] min-w-[110px]">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map(student => (
                    <tr
                      key={student.studentId}
                      className={clsx('hover:bg-[#F8FAFC] transition-colors', student.inactive && 'opacity-60')}
                    >
                      <td className="px-4 py-2 border-b border-[#F1F5F9]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] text-xs font-semibold flex-shrink-0">
                            {student.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#0F172A]">{student.studentName}</p>
                            {student.inactive && (
                              <span className="text-[10px] text-[#94A3B8] bg-slate-100 px-1.5 py-0.5 rounded">Inativo</span>
                            )}
                          </div>
                        </div>
                      </td>
                      {mockAssessments.map(a => {
                        const grade = student.grades.find(g => g.assessmentId === a.id)
                        const flashKey = `${student.studentId}-${a.id}`
                        return isConceptual ? (
                          <ConceptualCell
                            key={a.id}
                            studentId={student.studentId}
                            assessmentId={a.id}
                            score={grade?.score ?? null}
                          />
                        ) : (
                          <GradeCell
                            key={a.id}
                            studentId={student.studentId}
                            assessmentId={a.id}
                            score={grade?.score ?? null}
                            isFlashing={flashCells[flashKey] ?? false}
                            isRecovery={grade?.isRecovery}
                            isPercentage={isPercentage}
                          />
                        )
                      })}
                      <td className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] text-center">
                        <span className={clsx('text-sm font-bold', gradeColorClass(student.average ?? null, approvalGrade, recoveryMin))}>
                          {student.average !== undefined ? formatGrade(student.average, gradeScale) : '—'}
                        </span>
                      </td>
                      <td className="px-3 py-2 border-b border-[#F1F5F9] text-center">
                        <StatusBadge status={student.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B]">
              <span>{grades.length} alunos</span>
              <span>
                {grades.filter(g => g.status === 'approved').length} aprovados ·{' '}
                {grades.filter(g => g.status === 'recovery').length} em recuperação ·{' '}
                {grades.filter(g => g.status === 'failed').length} reprovados
              </span>
              <span>
                Média da turma: {(grades.reduce((acc, g) => acc + (g.average ?? 0), 0) / grades.filter(g => g.average !== undefined).length).toFixed(1)}
              </span>
            </div>
          </div>

          <div className="card p-4">
            <p className="text-xs font-medium text-[#64748B] mb-2">Fórmula da Média — Escala {gradeScale === 'percentage' ? '0–100%' : gradeScale === 'conceptual' ? 'A–E' : '0–10'}</p>
            {isConceptual ? (
              <>
                <p className="text-sm text-[#0F172A] font-mono bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0]">
                  Conceito = Σ(valor × peso) / Σpeso → convertido em A–E
                </p>
                <p className="text-xs text-[#64748B] mt-2">
                  Mapeamento: A ≥ {formatGrade(9, gradeScale)} ({CONCEPTUAL_VALUES['A']}) · B ≥ {formatGrade(7, gradeScale)} ({CONCEPTUAL_VALUES['B']}) · C ≥ {formatGrade(5, gradeScale)} ({CONCEPTUAL_VALUES['C']}) · D ≥ {formatGrade(3, gradeScale)} ({CONCEPTUAL_VALUES['D']}) · E &lt; {formatGrade(3, gradeScale)} ({CONCEPTUAL_VALUES['E']})
                </p>
              </>
            ) : isPercentage ? (
              <>
                <p className="text-sm text-[#0F172A] font-mono bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0]">
                  Média % = Σ(nota × peso) / Σpeso × 10
                </p>
                <p className="text-xs text-[#64748B] mt-2">
                  Exemplo: P1 (80% × 40%) + Trabalho (65% × 30%) + Part. (70% × 30%) = <span className="font-semibold text-[#0F172A]">74%</span>
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-[#0F172A] font-mono bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0]">
                  Média = Σ(nota × peso) / Σpeso
                </p>
                <p className="text-xs text-[#64748B] mt-2">
                  Exemplo: P1 (8,0 × 40%) + Trabalho (6,5 × 30%) + Participação (7,0 × 30%) = <span className="font-semibold text-[#0F172A]">7,4</span>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
