import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Building2, ChevronLeft, Users, GraduationCap, BookOpen,
  Settings, Mail, MapPin, Calendar, Edit2, Check, X, UserPlus,
} from 'lucide-react'
import { mockSchools } from '../../data/mock'
import type { School } from '../../types'
import clsx from 'clsx'
import { STATUS_CONFIG, PLAN_CONFIG } from './adminConfig'
import { useTranslation } from '../../i18n'

type Tab = 'overview' | 'users' | 'classes' | 'settings'

const MOCK_USERS_BY_SCHOOL: Record<string, { id: string; name: string; role: string; email: string; joinedAt: string }[]> = {
  'school-1': [
    { id: 'u1', name: 'Dir. Carlos Santos',   role: 'Coordenador', email: 'carlos.santos@escola.eduflow.app', joinedAt: '2023-02-15' },
    { id: 'u2', name: 'Profa. Ana Lima',       role: 'Professor',   email: 'ana.lima@escola.eduflow.app',      joinedAt: '2023-02-16' },
    { id: 'u3', name: 'Prof. Roberto Souza',   role: 'Professor',   email: 'roberto@escola.eduflow.app',       joinedAt: '2023-02-16' },
    { id: 'u4', name: 'Lucas Mendes',          role: 'Aluno',       email: 'lucas@escola.eduflow.app',         joinedAt: '2023-02-20' },
    { id: 'u5', name: 'Maria Silva',           role: 'Aluno',       email: 'maria@escola.eduflow.app',         joinedAt: '2023-02-20' },
    { id: 'u6', name: 'Pedro Oliveira',        role: 'Aluno',       email: 'pedro@escola.eduflow.app',         joinedAt: '2023-02-20' },
  ],
  'school-2': [
    { id: 'u7', name: 'Dir. Fernanda Costa',   role: 'Coordenador', email: 'fernanda.costa@rj.eduflow.app',    joinedAt: '2023-08-20' },
    { id: 'u8', name: 'Prof. Marcos Leal',     role: 'Professor',   email: 'marcos@rj.eduflow.app',            joinedAt: '2023-08-22' },
  ],
}

const MOCK_CLASSES_BY_SCHOOL: Record<string, { id: string; name: string; subject: string; teacher: string; students: number; period: string }[]> = {
  'school-1': [
    { id: 'c1', name: '1º Ano A', subject: 'Matemática', teacher: 'Profa. Ana Lima',     students: 32, period: '2º Bimestre' },
    { id: 'c2', name: '1º Ano B', subject: 'Português',  teacher: 'Prof. Roberto Souza', students: 29, period: '2º Bimestre' },
    { id: 'c3', name: '2º Ano A', subject: 'Física',     teacher: 'Profa. Ana Lima',     students: 28, period: '2º Bimestre' },
    { id: 'c4', name: '3º Ano A', subject: 'Química',    teacher: 'Prof. Roberto Souza', students: 25, period: '2º Bimestre' },
  ],
  'school-2': [
    { id: 'c5', name: '1º Ano A', subject: 'Matemática', teacher: 'Prof. Marcos Leal', students: 30, period: '2º Bimestre' },
    { id: 'c6', name: '2º Ano A', subject: 'História',   teacher: 'Prof. Marcos Leal', students: 28, period: '2º Bimestre' },
  ],
}

const ROLE_COLORS: Record<string, string> = {
  'Coordenador': 'bg-emerald-50 text-emerald-700',
  'Professor':   'bg-blue-50 text-blue-700',
  'Aluno':       'bg-slate-100 text-slate-600',
}

export function AdminSchoolDetails() {
  const { schoolId } = useParams<{ schoolId: string }>()
  const navigate = useNavigate()
  const t = useTranslation()
  const [tab, setTab] = useState<Tab>('overview')
  const [school, setSchool] = useState<School | undefined>(mockSchools.find(s => s.id === schoolId))
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<School>>({})
  const [saved, setSaved] = useState(false)
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (savedTimerRef.current) clearTimeout(savedTimerRef.current) }, [])

  if (!school) {
    return (
      <div className="text-center py-20">
        <Building2 size={40} className="mx-auto text-[#CBD5E1] mb-4" />
        <p className="text-[#64748B]">Escola não encontrada.</p>
        <button type="button" onClick={() => navigate('/admin/schools')} className="btn-secondary mt-4">{t('common.back')}</button>
      </div>
    )
  }

  const users   = MOCK_USERS_BY_SCHOOL[schoolId ?? ''] ?? []
  const classes = MOCK_CLASSES_BY_SCHOOL[schoolId ?? ''] ?? []

  const startEdit = () => {
    setEditForm({ name: school.name, city: school.city, state: school.state, plan: school.plan, status: school.status })
    setEditing(true)
  }

  const saveEdit = () => {
    setSchool(s => s ? { ...s, ...editForm } : s)
    setSaved(true)
    setEditing(false)
    savedTimerRef.current = setTimeout(() => setSaved(false), 2000)
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Visão Geral',   icon: Building2 },
    { id: 'users',    label: `Usuários (${users.length})`,   icon: Users },
    { id: 'classes',  label: `Turmas (${classes.length})`,   icon: BookOpen },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/schools')}
          className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] mb-4 transition-colors"
        >
          <ChevronLeft size={16} />
          Todas as escolas
        </button>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
              <Building2 size={22} className="text-[#1E3A8A]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-display font-bold text-[#0F172A]">{school.name}</h1>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[school.status].className}`}>
                  {STATUS_CONFIG[school.status].label}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PLAN_CONFIG[school.plan].className}`}>
                  {PLAN_CONFIG[school.plan].label}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                  <MapPin size={12} />
                  {school.city}, {school.state}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                  <Calendar size={12} />
                  Desde {new Date(school.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <Check size={12} />
                {t('common.save')}
              </span>
            )}
            <button type="button" onClick={startEdit} className="btn-secondary gap-2 text-sm">
              <Edit2 size={14} />
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#E2E8F0]">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === id
                ? 'border-[#1E3A8A] text-[#1E3A8A]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: t('common.students'), value: school.studentsCount, icon: GraduationCap, color: '#7C3AED', bg: '#F5F3FF' },
              { label: t('common.teachers'), value: school.teachersCount, icon: Users,         color: '#059669', bg: '#ECFDF5' },
              { label: 'Turmas',             value: school.classesCount,  icon: BookOpen,       color: '#1E3A8A', bg: '#EFF6FF' },
              { label: 'Plano',              value: PLAN_CONFIG[school.plan].label, icon: Settings, color: '#D97706', bg: '#FFFBEB' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card p-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <p className="text-xl font-display font-bold text-[#0F172A]">{value}</p>
                <p className="text-xs text-[#94A3B8] mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {school.coordinatorName && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Coordenador</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-sm font-semibold">
                  {school.coordinatorName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">{school.coordinatorName}</p>
                  {school.coordinatorEmail && (
                    <p className="text-xs text-[#94A3B8] flex items-center gap-1">
                      <Mail size={11} />
                      {school.coordinatorEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Plano atual</h3>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${PLAN_CONFIG[school.plan].className}`}>
                {PLAN_CONFIG[school.plan].label}
              </span>
              <p className="text-sm text-[#64748B]">{PLAN_CONFIG[school.plan].desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#64748B]">{users.length} usuários nesta escola</p>
            <button type="button" className="btn-secondary gap-2 text-sm">
              <UserPlus size={14} />
              Convidar usuário
            </button>
          </div>

          {users.length === 0 ? (
            <div className="card py-12 text-center">
              <Users size={32} className="mx-auto text-[#CBD5E1] mb-3" />
              <p className="text-sm text-[#94A3B8]">Nenhum usuário cadastrado nesta escola</p>
            </div>
          ) : (
            <div className="card divide-y divide-[#F1F5F9]">
              {users.map(u => (
                <div key={u.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F172A] truncate">{u.name}</p>
                    <p className="text-xs text-[#94A3B8] flex items-center gap-1">
                      <Mail size={10} />
                      {u.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role] ?? 'bg-slate-100 text-slate-600'}`}>
                      {u.role}
                    </span>
                    <span className="text-xs text-[#94A3B8]">
                      Desde {new Date(u.joinedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Classes */}
      {tab === 'classes' && (
        <div className="space-y-4">
          <p className="text-sm text-[#64748B]">{classes.length} turmas ativas nesta escola</p>

          {classes.length === 0 ? (
            <div className="card py-12 text-center">
              <BookOpen size={32} className="mx-auto text-[#CBD5E1] mb-3" />
              <p className="text-sm text-[#94A3B8]">Nenhuma turma cadastrada</p>
            </div>
          ) : (
            <div className="card divide-y divide-[#F1F5F9]">
              {classes.map(c => (
                <div key={c.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} className="text-[#1E3A8A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0F172A]">{c.name} — {c.subject}</p>
                    <p className="text-xs text-[#94A3B8]">{c.teacher} · {c.period}</p>
                  </div>
                  <span className="text-sm font-medium text-[#0F172A]">{c.students} alunos</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Settings */}
      {tab === 'settings' && (
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Dados da escola</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Nome</label>
                  <p className="text-sm text-[#0F172A]">{school.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Localização</label>
                  <p className="text-sm text-[#0F172A]">{school.city}, {school.state}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Plano</label>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PLAN_CONFIG[school.plan].className}`}>
                    {PLAN_CONFIG[school.plan].label}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Status</label>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[school.status].className}`}>
                    {STATUS_CONFIG[school.status].label}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
              <button type="button" onClick={startEdit} className="btn-secondary gap-2 text-sm">
                <Edit2 size={14} />
                Editar dados
              </button>
            </div>
          </div>

          <div className="card p-5 border border-red-100">
            <h3 className="text-sm font-semibold text-red-600 mb-2">Zona de perigo</h3>
            <p className="text-xs text-[#64748B] mb-3">Estas ações são irreversíveis. Proceda com cuidado.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSchool(s => s ? { ...s, status: s.status === 'inactive' ? 'active' : 'inactive' } : s)}
                className={clsx('btn-secondary text-sm', school.status === 'inactive' ? 'text-emerald-600 border-emerald-200 hover:bg-emerald-50' : 'text-amber-600 border-amber-200 hover:bg-amber-50')}
              >
                {school.status === 'inactive' ? 'Reativar escola' : 'Desativar escola'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditing(false)} />
          <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9]">
              <h2 className="font-display font-semibold text-[#0F172A]">Editar escola</h2>
              <button type="button" onClick={() => setEditing(false)} className="text-[#94A3B8] hover:text-[#64748B]">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-1.5">Nome da escola</label>
                <input
                  className="input"
                  value={editForm.name ?? ''}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Cidade</label>
                  <input
                    className="input"
                    value={editForm.city ?? ''}
                    onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Estado</label>
                  <input
                    className="input"
                    value={editForm.state ?? ''}
                    onChange={e => setEditForm(f => ({ ...f, state: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-1.5">Plano</label>
                <select
                  className="input"
                  value={editForm.plan}
                  onChange={e => setEditForm(f => ({ ...f, plan: e.target.value as School['plan'] }))}
                >
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-1.5">Status</label>
                <select
                  className="input"
                  value={editForm.status}
                  onChange={e => setEditForm(f => ({ ...f, status: e.target.value as School['status'] }))}
                >
                  <option value="active">{t('common.active')}</option>
                  <option value="trial">Trial</option>
                  <option value="inactive">{t('common.inactive')}</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
                <button type="button" onClick={saveEdit} className="btn-primary flex-1">{t('common.save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
