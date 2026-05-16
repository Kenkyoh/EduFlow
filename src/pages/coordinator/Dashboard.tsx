import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart
} from 'recharts'
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react'
import { Header } from '../../components/Header'
import { mockCoordinatorData } from '../../data/mock'
import { useSettingsStore } from '../../store/settings'
import { formatGrade, SCALE_INFO } from '../../utils/gradeFormat'
import clsx from 'clsx'

function KpiCard({ label, value, unit, change, icon: Icon, iconColor, iconBg }: {
  label: string
  value: number | string
  unit?: string
  change?: number | string
  icon: React.ElementType
  iconColor: string
  iconBg: string
}) {
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#64748B]">{label}</span>
        <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', iconBg)}>
          <Icon size={16} className={iconColor} />
        </div>
      </div>
      <div className="flex items-end gap-1.5 mt-1">
        <span className="text-2xl font-bold font-display text-[#0F172A]">{value}</span>
        {unit && <span className="text-sm text-[#64748B] mb-0.5">{unit}</span>}
      </div>
      {change !== undefined && (
        <div className={clsx(
          'flex items-center gap-1 text-xs',
          change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-500' : 'text-[#94A3B8]'
        )}>
          {change > 0 ? <TrendingUp size={12} /> : change < 0 ? <TrendingDown size={12} /> : null}
          <span>{change > 0 ? '+' : ''}{change} em relação ao bimestre anterior</span>
        </div>
      )}
    </div>
  )
}

export function CoordinatorDashboard() {
  const { kpis, gradeDistribution, monthlyEvolution, atRisk } = mockCoordinatorData
  const { gradeScale } = useSettingsStore()

  return (
    <>
      <Header title="Painel da Coordenação" />

      <div className="space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label={`Média Geral (${SCALE_INFO[gradeScale].short})`}
            value={formatGrade(kpis.generalAverage, gradeScale)}
            change={kpis.changes.generalAverage}
            icon={BarChart3}
            iconColor="text-[#1E3A8A]"
            iconBg="bg-blue-50"
          />
          <KpiCard
            label="Taxa de Entrega"
            value={kpis.deliveryRate}
            unit="%"
            change={kpis.changes.deliveryRate}
            icon={CheckCircle}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-50"
          />
          <KpiCard
            label="Alunos em Risco"
            value={kpis.atRiskStudents}
            change={kpis.changes.atRiskStudents}
            icon={AlertTriangle}
            iconColor="text-amber-500"
            iconBg="bg-amber-50"
          />
          <KpiCard
            label="Frequência Média"
            value={kpis.attendance}
            unit="%"
            change={kpis.changes.attendance}
            icon={Users}
            iconColor="text-purple-500"
            iconBg="bg-purple-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grade distribution */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-[#0F172A] mb-4">Distribuição de Médias</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={gradeDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                  formatter={(v) => [v, 'Alunos']}
                />
                <Bar dataKey="count" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-center gap-4 text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" /> Aprovados (&gt;=6)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-400" /> Recuperação (4–6)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-400" /> Reprovados (&lt;4)
              </span>
            </div>
          </div>

          {/* Monthly evolution */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-[#0F172A] mb-4">Evolução Mensal da Média</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyEvolution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis domain={[5, 10]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                  formatter={(v) => [v, 'Média']}
                />
                <Area
                  type="monotone"
                  dataKey="average"
                  stroke="#1E3A8A"
                  strokeWidth={2}
                  fill="url(#colorAvg)"
                  dot={{ fill: '#1E3A8A', r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* At risk students */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              <h3 className="font-display font-semibold text-[#0F172A]">Alunos em Situação de Risco</h3>
            </div>
            <span className="badge-warning">{atRisk.length} alunos</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-[#F8FAFC]">
                  <th className="px-5 py-3 text-xs font-medium text-[#64748B]">Aluno</th>
                  <th className="px-5 py-3 text-xs font-medium text-[#64748B]">Turma</th>
                  <th className="px-5 py-3 text-xs font-medium text-[#64748B]">Disciplinas em risco</th>
                  <th className="px-5 py-3 text-xs font-medium text-[#64748B]">Último acesso</th>
                  <th className="px-5 py-3 text-xs font-medium text-[#64748B]">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {atRisk.map((student, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-semibold">
                          {student.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-[#0F172A]">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-[#64748B]">{student.class}</td>
                    <td className="px-5 py-3">
                      <span className={clsx(
                        'badge-neutral',
                        student.subjects >= 3 ? 'badge-danger' : student.subjects >= 2 ? 'badge-warning' : 'badge-neutral'
                      )}>
                        {student.subjects} disciplina{student.subjects > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-[#64748B]">há {student.lastAccess}</td>
                    <td className="px-5 py-3">
                      <button type="button" className="text-xs text-[#1E3A8A] hover:underline">
                        Contatar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total de turmas', value: '12', icon: '📚' },
            { label: 'Professores ativos', value: '8', icon: '👩‍🏫' },
            { label: 'Total de alunos', value: '284', icon: '🎓' },
            { label: 'Atividades este mês', value: '47', icon: '📋' },
          ].map(stat => (
            <div key={stat.label} className="card p-4 flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-xl font-bold font-display text-[#0F172A]">{stat.value}</p>
                <p className="text-xs text-[#64748B]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
