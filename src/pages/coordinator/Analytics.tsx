import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react'
import { Header } from '../../components/Header'
import { mockCoordinatorData } from '../../data/mock'
import { useSettingsStore } from '../../store/settings'
import { formatGrade, gradeColorClass, SCALE_INFO } from '../../utils/gradeFormat'
import clsx from 'clsx'

const BLUE = '#1E3A8A'

export function CoordinatorAnalytics() {
  const { kpis, monthlyEvolution, subjectPerformance, classPerformance, attendanceByClass, gradeDistribution } = mockCoordinatorData
  const { gradeScale, approvalGrade, recoveryMin } = useSettingsStore()

  return (
    <>
      <Header title="Analytics" />

      <div className="space-y-6">
        {/* KPI summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: `Média Geral (${SCALE_INFO[gradeScale].short})`,
              value: formatGrade(kpis.generalAverage, gradeScale),
              change: kpis.changes.generalAverage,
              icon: BarChart3,
              iconColor: 'text-blue-700',
              iconBg: 'bg-blue-50',
            },
            {
              label: 'Taxa de Entrega',
              value: `${kpis.deliveryRate}%`,
              change: kpis.changes.deliveryRate,
              icon: CheckCircle,
              iconColor: 'text-emerald-600',
              iconBg: 'bg-emerald-50',
            },
            {
              label: 'Alunos em Risco',
              value: kpis.atRiskStudents,
              change: kpis.changes.atRiskStudents,
              icon: AlertTriangle,
              iconColor: 'text-amber-600',
              iconBg: 'bg-amber-50',
              invertChange: true,
            },
            {
              label: 'Frequência Média',
              value: `${kpis.attendance}%`,
              change: kpis.changes.attendance,
              icon: Users,
              iconColor: 'text-purple-600',
              iconBg: 'bg-purple-50',
            },
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#64748B]">{kpi.label}</span>
                <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', kpi.iconBg)}>
                  <kpi.icon size={16} className={kpi.iconColor} />
                </div>
              </div>
              <p className="text-2xl font-bold font-display text-[#0F172A] mt-1">{kpi.value}</p>
              {kpi.change !== undefined && (
                <div className={clsx(
                  'flex items-center gap-1 text-xs mt-0.5',
                  (kpi.invertChange ? kpi.change < 0 : kpi.change > 0) ? 'text-emerald-600' :
                  (kpi.invertChange ? kpi.change > 0 : kpi.change < 0) ? 'text-red-500' : 'text-[#94A3B8]'
                )}>
                  {kpi.change > 0 ? <TrendingUp size={12} /> : kpi.change < 0 ? <TrendingDown size={12} /> : null}
                  <span>{kpi.change > 0 ? '+' : ''}{kpi.change} vs. bimestre anterior</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Evolução mensal — 3 métricas */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-[#0F172A] mb-4">Evolução Mensal</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyEvolution} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Line type="monotone" dataKey="average" name="Média" stroke={BLUE} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="attendance" name="Frequência (%)" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="deliveryRate" name="Taxa Entrega (%)" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="2 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Desempenho por turma */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-[#0F172A] mb-4">Média por Turma</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={classPerformance} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis type="category" dataKey="class" tick={{ fontSize: 11, fill: '#64748B' }} width={36} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                  formatter={(v) => [v, 'Média']}
                />
                <Bar dataKey="average" fill={BLUE} radius={[0, 4, 4, 0]}>
                  {classPerformance.map((entry, i) => (
                    <rect
                      key={i}
                      fill={entry.average >= 7 ? '#1E3A8A' : entry.average >= 6 ? '#D97706' : '#DC2626'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Frequência por turma */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-[#0F172A] mb-4">Frequência por Turma (%)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={attendanceByClass} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis type="category" dataKey="class" tick={{ fontSize: 11, fill: '#64748B' }} width={36} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                  formatter={(v) => [`${v}%`, 'Frequência']}
                />
                <Bar dataKey="attendance" fill="#7C3AED" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Desempenho por disciplina */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-[#0F172A] mb-4">Desempenho por Disciplina</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-[#F8FAFC]">
                  <th className="px-4 py-3 text-xs font-medium text-[#64748B]">Disciplina</th>
                  <th className="px-4 py-3 text-xs font-medium text-[#64748B]">Média</th>
                  <th className="px-4 py-3 text-xs font-medium text-[#64748B] w-48">Desempenho</th>
                  <th className="px-4 py-3 text-xs font-medium text-[#64748B]">Taxa de Entrega</th>
                  <th className="px-4 py-3 text-xs font-medium text-[#64748B] w-48">Entrega</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {subjectPerformance
                  .slice()
                  .sort((a, b) => b.average - a.average)
                  .map(s => (
                    <tr key={s.subject} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                          <span className="text-sm font-medium text-[#0F172A]">{s.subject}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx('text-sm font-semibold', gradeColorClass(s.average, approvalGrade, recoveryMin))}>
                          {formatGrade(s.average, gradeScale)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(s.average / 10) * 100}%`,
                              backgroundColor: s.average >= 7 ? '#059669' : s.average >= 5 ? '#D97706' : '#DC2626',
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx(
                          'text-sm font-medium',
                          s.deliveryRate >= 80 ? 'text-emerald-600' : s.deliveryRate >= 60 ? 'text-amber-600' : 'text-red-600'
                        )}>
                          {s.deliveryRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${s.deliveryRate}%`,
                              backgroundColor: s.deliveryRate >= 80 ? '#059669' : s.deliveryRate >= 60 ? '#D97706' : '#DC2626',
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distribuição de notas + alunos em risco por turma */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <Bar dataKey="count" fill={BLUE} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-semibold text-[#0F172A] mb-1">Alunos em Risco por Turma</h3>
            <p className="text-xs text-[#94A3B8] mb-4">Turmas com maior concentração de alunos em risco</p>
            <div className="space-y-3">
              {classPerformance
                .filter(c => c.atRisk > 0)
                .sort((a, b) => b.atRisk - a.atRisk)
                .map(c => (
                  <div key={c.class}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-[#0F172A]">{c.class}</span>
                      <span className={clsx(
                        'font-medium',
                        c.atRisk >= 5 ? 'text-red-600' : c.atRisk >= 3 ? 'text-amber-600' : 'text-[#64748B]'
                      )}>
                        {c.atRisk} de {c.studentsCount} alunos
                      </span>
                    </div>
                    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(c.atRisk / c.studentsCount) * 100}%`,
                          backgroundColor: c.atRisk >= 5 ? '#DC2626' : c.atRisk >= 3 ? '#D97706' : '#94A3B8',
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
