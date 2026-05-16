import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Plus, ChevronRight, X, Check } from 'lucide-react'
import { mockSchools } from '../../data/mock'
import type { School } from '../../types'
import clsx from 'clsx'
import { STATUS_CONFIG, PLAN_CONFIG } from './adminConfig'
import { useSearchStore } from '../../store/search'

const BR_STATES = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

interface AddSchoolForm {
  name: string
  city: string
  state: string
  plan: School['plan']
  coordinatorName: string
  coordinatorEmail: string
}

const EMPTY_FORM: AddSchoolForm = {
  name: '', city: '', state: 'SP', plan: 'basic', coordinatorName: '', coordinatorEmail: '',
}

export function AdminSchools() {
  const navigate = useNavigate()
  const [schools, setSchools] = useState<School[]>(mockSchools)
  const query = useSearchStore(s => s.query)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<AddSchoolForm>(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<AddSchoolForm>>({})
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current) }, [])

  const filtered = schools.filter(s => {
    const q = query.toLowerCase()
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.state.toLowerCase().includes(q)
    const matchStatus = filterStatus === 'all' || s.status === filterStatus
    const matchPlan   = filterPlan === 'all'   || s.plan === filterPlan
    return matchSearch && matchStatus && matchPlan
  })

  const validate = (): boolean => {
    const e: Partial<AddSchoolForm> = {}
    if (!form.name.trim())  e.name = 'Obrigatório'
    if (!form.city.trim())  e.city = 'Obrigatório'
    if (!form.state.trim()) e.state = 'Obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAdd = () => {
    if (!validate()) return
    const newSchool: School = {
      id: `school-${Date.now()}`,
      name: form.name.trim(),
      city: form.city.trim(),
      state: form.state,
      plan: form.plan,
      status: 'trial',
      createdAt: new Date().toISOString().split('T')[0],
      studentsCount: 0,
      teachersCount: 0,
      classesCount: 0,
      coordinatorName: form.coordinatorName.trim() || undefined,
      coordinatorEmail: form.coordinatorEmail.trim() || undefined,
    }
    setSchools(prev => [newSchool, ...prev])
    setSubmitted(true)
    closeTimerRef.current = setTimeout(() => {
      setShowModal(false)
      setSubmitted(false)
      setForm(EMPTY_FORM)
      setErrors({})
    }, 1400)
  }

  const field = (key: keyof AddSchoolForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [key]: e.target.value }))
      setErrors(er => ({ ...er, [key]: undefined }))
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Escolas</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{schools.length} escolas cadastradas na plataforma</p>
        </div>
        <button type="button" onClick={() => setShowModal(true)} className="btn-primary gap-2">
          <Plus size={16} />
          Nova Escola
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="input h-9 text-sm w-auto pr-8"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="trial">Trial</option>
          <option value="inactive">Inativo</option>
        </select>
        <select
          className="input h-9 text-sm w-auto pr-8"
          value={filterPlan}
          onChange={e => setFilterPlan(e.target.value)}
        >
          <option value="all">Todos os planos</option>
          <option value="premium">Premium</option>
          <option value="standard">Standard</option>
          <option value="basic">Basic</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Building2 size={32} className="mx-auto text-[#CBD5E1] mb-3" />
            <p className="text-sm text-[#94A3B8]">Nenhuma escola encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F1F5F9]">
                  {['Escola', 'Localização', 'Plano', 'Status', 'Alunos', 'Professores', 'Criada em', ''].map((h, i) => (
                    <th key={i} className="text-left text-xs font-semibold text-[#94A3B8] px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.map(school => (
                  <tr
                    key={school.id}
                    onClick={() => navigate(`/admin/schools/${school.id}`)}
                    className="hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                          <Building2 size={15} className="text-[#1E3A8A]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">{school.name}</p>
                          {school.coordinatorName && (
                            <p className="text-xs text-[#94A3B8]">{school.coordinatorName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#64748B] whitespace-nowrap">
                      {school.city}, {school.state}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PLAN_CONFIG[school.plan].className}`}>
                        {PLAN_CONFIG[school.plan].label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[school.status].className}`}>
                        {STATUS_CONFIG[school.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#0F172A] font-medium">{school.studentsCount.toLocaleString('pt-BR')}</td>
                    <td className="px-5 py-4 text-sm text-[#0F172A] font-medium">{school.teachersCount}</td>
                    <td className="px-5 py-4 text-xs text-[#94A3B8] whitespace-nowrap">
                      {new Date(school.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-5 py-4">
                      <ChevronRight size={16} className="text-[#CBD5E1]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add School Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setShowModal(false); setForm(EMPTY_FORM); setErrors({}) }} />
          <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9]">
              <div>
                <h2 className="font-display font-semibold text-[#0F172A]">Nova Escola</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">Preencha os dados da nova escola</p>
              </div>
              <button type="button" onClick={() => { setShowModal(false); setForm(EMPTY_FORM); setErrors({}) }} className="text-[#94A3B8] hover:text-[#64748B]">
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              <div className="px-6 py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-emerald-600" />
                </div>
                <p className="font-semibold text-[#0F172A]">Escola cadastrada!</p>
                <p className="text-xs text-[#94A3B8] mt-1">A escola foi adicionada à plataforma.</p>
              </div>
            ) : (
              <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Dados da escola</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[#64748B] mb-1.5">Nome da escola *</label>
                      <input className={clsx('input', errors.name && 'border-red-300 focus:border-red-400')} placeholder="Ex: Colégio Estadual..." {...field('name')} />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#64748B] mb-1.5">Cidade *</label>
                        <input className={clsx('input', errors.city && 'border-red-300')} placeholder="São Paulo" {...field('city')} />
                        {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#64748B] mb-1.5">Estado *</label>
                        <select className="input" {...field('state')}>
                          {BR_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#64748B] mb-1.5">Plano</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['basic', 'standard', 'premium'] as School['plan'][]).map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, plan: p }))}
                            className={clsx(
                              'py-2 px-3 rounded-lg border text-xs font-medium transition-all',
                              form.plan === p
                                ? p === 'premium' ? 'bg-violet-50 border-violet-400 text-violet-700'
                                  : p === 'standard' ? 'bg-blue-50 border-blue-400 text-blue-700'
                                  : 'bg-slate-100 border-slate-400 text-slate-700'
                                : 'border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
                            )}
                          >
                            {PLAN_CONFIG[p].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Coordenador (opcional)</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[#64748B] mb-1.5">Nome do coordenador</label>
                      <input className="input" placeholder="Dir. João Silva" {...field('coordinatorName')} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#64748B] mb-1.5">E-mail do coordenador</label>
                      <input className="input" type="email" placeholder="joao@escola.eduflow.app" {...field('coordinatorEmail')} />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setForm(EMPTY_FORM); setErrors({}) }}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button type="button" onClick={handleAdd} className="btn-primary flex-1">
                    Cadastrar Escola
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
