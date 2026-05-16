import type { GradeScale } from '../store/settings'
import type { MencaoValue } from '../types'

// ─── Conceptual (A–E) ────────────────────────────────────────────────────────

export const CONCEPTUAL_ORDER = ['A', 'B', 'C', 'D', 'E'] as const
export type ConceptualGrade = typeof CONCEPTUAL_ORDER[number]

export function scoreToConceptual(score: number): ConceptualGrade {
  if (score >= 9) return 'A'
  if (score >= 7) return 'B'
  if (score >= 5) return 'C'
  if (score >= 3) return 'D'
  return 'E'
}

export const CONCEPTUAL_VALUES: Record<ConceptualGrade, number> = {
  A: 9.5, B: 8.0, C: 6.0, D: 4.0, E: 1.5,
}

export const CONCEPTUAL_COLORS: Record<ConceptualGrade, { bg: string; text: string; label: string }> = {
  A: { bg: '#DCFCE7', text: '#166534', label: 'Excelente' },
  B: { bg: '#DBEAFE', text: '#1E40AF', label: 'Bom' },
  C: { bg: '#FEF9C3', text: '#854D0E', label: 'Regular' },
  D: { bg: '#FFEDD5', text: '#9A3412', label: 'Insuficiente' },
  E: { bg: '#FEE2E2', text: '#991B1B', label: 'Muito Insuficiente' },
}

// ─── Menção (PA–N) derived ───────────────────────────────────────────────────

export function scoreToMencao(score: number | null): MencaoValue | null {
  if (score === null) return null
  if (score >= 9) return 'PA'
  if (score >= 7) return 'AC'
  if (score >= 5) return 'A'
  if (score >= 3) return 'P'
  return 'N'
}

// ─── Generic formatter ────────────────────────────────────────────────────────

export function formatGrade(score: number | null, scale: GradeScale): string {
  if (score === null) return '—'
  switch (scale) {
    case 'percentage':  return `${Math.round(score * 10)}%`
    case 'conceptual':  return scoreToConceptual(score)
    case 'mencao':      return scoreToMencao(score) ?? '—'
    default:            return score.toFixed(1)
  }
}

export function formatThreshold(score: number, scale: GradeScale): string {
  switch (scale) {
    case 'percentage':  return `${Math.round(score * 10)}%`
    case 'conceptual':  return `≥ ${scoreToConceptual(score)}`
    case 'mencao':      return `${score} pts`
    default:            return score.toFixed(1)
  }
}

export function gradeColorClass(score: number | null, approvalGrade = 6, recoveryMin = 4): string {
  if (score === null) return 'text-[#94A3B8]'
  if (score >= approvalGrade) return 'text-emerald-700'
  if (score >= recoveryMin) return 'text-amber-700'
  return 'text-red-700'
}

// ─── Scale metadata ───────────────────────────────────────────────────────────

export const SCALE_INFO: Record<GradeScale, { label: string; short: string; description: string; inputHint: string }> = {
  numeric:    { label: '0–10 (numérico)',    short: '0–10',   description: 'Notas de 0,0 a 10,0 com até 1 decimal',                inputHint: 'ex: 7.5' },
  percentage: { label: '0–100 (percentual)', short: '0–100%', description: 'Notas de 0 a 100, equivalente a escala 0–10 × 10',    inputHint: 'ex: 75' },
  conceptual: { label: 'A–E (conceitual)',   short: 'A–E',    description: 'A (≥9), B (7–8,9), C (5–6,9), D (3–4,9), E (<3)',    inputHint: 'selecione A–E' },
  mencao:     { label: 'PA–N (Menção)',       short: 'PA–N',   description: '5 objetivos bimestrais de PA (2 pts) a N (0 pts)',    inputHint: 'selecione PA–N' },
}

// Preview samples for each scale
export const SCALE_PREVIEW: Record<GradeScale, { label: string; samples: string[] }> = {
  numeric:    { label: 'Exemplos',  samples: ['10,0', '8,5', '7,0', '5,5', '3,0'] },
  percentage: { label: 'Exemplos',  samples: ['100%', '85%', '70%', '55%', '30%'] },
  conceptual: { label: 'Exemplos',  samples: ['A',    'B',   'B',   'C',   'D'  ] },
  mencao:     { label: 'Exemplos',  samples: ['PA',   'AC',  'AC',  'A',   'P'  ] },
}
