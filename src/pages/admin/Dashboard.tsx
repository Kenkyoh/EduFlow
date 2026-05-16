import { useNavigate } from 'react-router-dom'
import { Building2, Users, GraduationCap, TrendingUp, ChevronRight, Plus, BookOpen } from 'lucide-react'
import { useAuthStore } from '../../store/auth'
import { mockSchools } from '../../data/mock'
import { STATUS_CONFIG, PLAN_CONFIG } from './adminConfig'

export function AdminDashboard() {
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()

  const activeSchools = mockSchools.filter(s => s.status === 'active').length
  const totalStudents = mockSchools.reduce((acc, s) => acc + s.studentsCount, 0)
  const totalTeachers = mockSchools.reduce((acc, s) => acc + s.teachersCount, 0)
  const totalClasses  = mockSchools.reduce((acc, s) => acc + s.classesCount, 0)

  const kpis = [
    { label: 'Escolas Cadastradas', value: mockSchools.length,                      icon: Building2,     color: '#1E3A8A', bg: '#EFF6FF' },
    { label: 'Escolas Ativas',       value: activeSchools,                           icon: TrendingUp,    color: '#059669', bg: '#ECFDF5' },
    { label: 'Total de Alunos',      value: totalStudents.toLocaleString('pt-BR'),   icon: GraduationCap, color: '#7C3AED', bg: '#F5F3FF' },
    { label: 'Total de Professores', value: totalTeachers,                           icon: Users,         color: '#D97706', bg: '#FFFBEB' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Painel Administrativo</h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Bem-vindo, {user?.name}. Gerencie todas as escolas da plataforma.
          </p>
        </div>
        <button type="button" onClick={() => navigate('/admin/schools')} className="btn-primary gap-2">
          <Plus size={16} />
          Nova Escola
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: bg }}>
              <Icon size={20} style={{ color }} />
            </div>
            <p className="text-2xl font-display font-bold text-[#0F172A]">{value}</p>
            <p className="text-xs text-[#94A3B8] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Schools list */}
      <div className="card">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#F1F5F9]">
          <div>
            <h2 className="font-display font-semibold text-[#0F172A]">Escolas Cadastradas</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">{totalClasses} turmas · {totalStudents.toLocaleString('pt-BR')} alunos no total</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/schools')}
            className="text-xs text-[#1E3A8A] hover:underline flex items-center gap-1"
          >
            Gerenciar todas
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          {mockSchools.map(school => (
            <div
              key={school.id}
              onClick={() => navigate(`/admin/schools/${school.id}`)}
              className="flex items-center gap-4 px-5 py-4 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                <Building2 size={18} className="text-[#1E3A8A]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0F172A] truncate">{school.name}</p>
                <p className="text-xs text-[#94A3B8]">
                  {school.city}, {school.state}
                  {school.studentsCount > 0 && ` · ${school.studentsCount} alunos · ${school.teachersCount} professores`}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PLAN_CONFIG[school.plan].className}`}>
                  {PLAN_CONFIG[school.plan].label}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[school.status].className}`}>
                  {STATUS_CONFIG[school.status].label}
                </span>
              </div>

              <ChevronRight size={16} className="text-[#CBD5E1] flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Por Plano',  icon: TrendingUp, items: [
            { name: 'Premium',  count: mockSchools.filter(s => s.plan === 'premium').length,  color: 'text-violet-600' },
            { name: 'Standard', count: mockSchools.filter(s => s.plan === 'standard').length, color: 'text-blue-600' },
            { name: 'Basic',    count: mockSchools.filter(s => s.plan === 'basic').length,    color: 'text-slate-500' },
          ]},
          { label: 'Por Status', icon: Building2, items: [
            { name: 'Ativo',   count: mockSchools.filter(s => s.status === 'active').length,   color: 'text-emerald-600' },
            { name: 'Trial',   count: mockSchools.filter(s => s.status === 'trial').length,    color: 'text-amber-600' },
            { name: 'Inativo', count: mockSchools.filter(s => s.status === 'inactive').length, color: 'text-red-500' },
          ]},
          { label: 'Turmas',    icon: BookOpen, items: [
            { name: 'Total de turmas',    count: totalClasses,  color: 'text-[#1E3A8A]' },
            { name: 'Média por escola',   count: Math.round(totalClasses / mockSchools.filter(s => s.classesCount > 0).length), color: 'text-[#64748B]' },
            { name: 'Escolas com turmas', count: mockSchools.filter(s => s.classesCount > 0).length, color: 'text-[#64748B]' },
          ]},
        ].map(({ label, icon: Icon, items }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon size={16} className="text-[#94A3B8]" />
              <h3 className="text-sm font-semibold text-[#0F172A]">{label}</h3>
            </div>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">{item.name}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
