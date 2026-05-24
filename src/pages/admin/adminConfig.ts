import type { School } from '../../types'

export const STATUS_CONFIG: Record<School['status'], { label: string; className: string }> = {
  active:   { label: 'Ativo',   className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  inactive: { label: 'Inativo', className: 'bg-red-50 text-red-700 border border-red-200' },
  trial:    { label: 'Trial',   className: 'bg-amber-50 text-amber-700 border border-amber-200' },
}

export const PLAN_CONFIG: Record<School['plan'], { label: string; className: string; desc?: string }> = {
  premium:  { label: 'Premium',  className: 'bg-violet-50 text-violet-700 border border-violet-200', desc: 'Acesso completo + suporte prioritário' },
  standard: { label: 'Standard', className: 'bg-blue-50 text-blue-700 border border-blue-200',       desc: 'Funcionalidades principais + suporte' },
  basic:    { label: 'Basic',    className: 'bg-slate-100 text-slate-600 border border-slate-200',   desc: 'Funcionalidades essenciais' },
}
