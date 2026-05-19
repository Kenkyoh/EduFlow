import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, BookOpen, ClipboardList, BarChart3, Upload } from 'lucide-react'
import { Header } from '../../components/Header'
import { mockSubjects, mockActivities, mockAnnouncements, mockReportCardData, getActivityTypeLabel, getDaysUntil } from '../../data/mock'
import { toast } from '../../components/Toast'
import { useTranslation } from '../../i18n'
import clsx from 'clsx'

type Tab = 'mural' | 'materiais' | 'atividades' | 'notas'

export function StudentClassView() {
  const { classId } = useParams<{ classId: string }>()
  const navigate = useNavigate()
  const t = useTranslation()
  const [tab, setTab] = useState<Tab>('mural')

  const subject = mockSubjects[0]
  const activities = mockActivities.slice(0, 4)
  const reportData = mockReportCardData[0]

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'mural', label: 'Mural', icon: BookOpen },
    { id: 'materiais', label: 'Materiais', icon: FileText },
    { id: 'atividades', label: 'Atividades', icon: ClipboardList },
    { id: 'notas', label: 'Minhas Notas', icon: BarChart3 },
  ]

  return (
    <>
      <Header title={`${subject.name} — 3º Ano A`} />

      <div className="space-y-4">
        {/* Header */}
        <div className="card p-4 flex items-center gap-4" style={{ borderLeft: `4px solid ${subject.color}` }}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: subject.color }}
          >
            {subject.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="font-display font-semibold text-[#0F172A]">{subject.name}</h2>
            <p className="text-sm text-[#64748B]">{subject.teacher} · 3º Ano A · 2º Bimestre</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-[#94A3B8]">Minha média</p>
            <p className="text-2xl font-bold font-display text-emerald-600">{reportData.average.toFixed(1)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E2E8F0]">
          {tabs.map(t => (
            <button
              type="button"
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all',
                tab === t.id
                  ? 'border-[#1E3A8A] text-[#1E3A8A]'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-slate-300'
              )}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'mural' && (
          <div className="space-y-3">
            {mockAnnouncements.map(ann => (
              <div key={ann.id} className={clsx('card p-4', ann.urgent && 'border-red-300 border-2')}>
                {ann.urgent && (
                  <div className="text-xs font-bold text-[#DC2626] uppercase tracking-wide mb-1">🔴 Urgente</div>
                )}
                <h4 className="font-medium text-[#0F172A]">{ann.title}</h4>
                <p className="text-sm text-[#64748B] mt-1">{ann.content}</p>
                {ann.type === 'material' && ann.estimatedTime && (
                  <span className="text-xs text-[#94A3B8] mt-1 block">⏱ {ann.estimatedTime}</span>
                )}
                {ann.type === 'enquete' && ann.pollOptions && (
                  <div className="mt-3 space-y-2">
                    {ann.pollOptions.map(opt => (
                      <button
                        type="button"
                        key={opt.text}
                        onClick={() => toast(`Voto registrado: "${opt.text}"`, 'success')}
                        className="w-full flex items-center justify-between p-2 rounded-lg border border-[#E2E8F0] hover:border-[#1E3A8A] hover:bg-blue-50 transition-all text-sm text-left"
                      >
                        <span>{opt.text}</span>
                        <span className="text-xs text-[#94A3B8]">{opt.votes} votos</span>
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-[#94A3B8] mt-2">{ann.author} · {ann.timestamp}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'atividades' && (
          <div className="space-y-3">
            {activities.map(act => {
              const days = getDaysUntil(act.dueDate)
              return (
                <div key={act.id} className="activity-card" style={{ borderLeftColor: act.subjectColor }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-[#94A3B8]">{getActivityTypeLabel(act.type)}</span>
                        <span className="text-xs text-[#94A3B8]">· Peso: {act.weight}%</span>
                      </div>
                      <h4 className="text-sm font-medium text-[#0F172A]">{act.title}</h4>
                      <p className="text-xs text-[#64748B] mt-1">
                        {new Date(act.dueDate).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(act.dueDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={clsx(
                        'text-xs font-medium',
                        days < 0 ? 'text-red-500' : days <= 3 ? 'text-amber-600' : 'text-[#64748B]'
                      )}>
                        {days < 0 ? t('common.late') : days === 0 ? t('common.today') : `${days} dias`}
                      </span>
                      {act.status === 'pending' || act.status === 'upcoming' ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/student/submit/${act.id}`)}
                          className="btn-primary text-xs h-7 px-3"
                        >
                          <Upload size={12} /> {t('student.activities.deliver')}
                        </button>
                      ) : act.status === 'submitted' ? (
                        <span className="badge-success text-xs">{t('common.submitted')}</span>
                      ) : act.status === 'late' ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/student/submit/${act.id}`)}
                          className="btn-danger text-xs h-7 px-3"
                        >
                          {t('student.activities.deliverLate')}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'notas' && (
          <div className="card p-4">
            <h3 className="font-display font-semibold text-[#0F172A] mb-4">Minhas Notas em {subject.name}</h3>
            <table className="w-full text-sm">
              <thead className="border-b border-[#E2E8F0]">
                <tr>
                  <th className="pb-2 text-left text-xs font-medium text-[#64748B]">Avaliação</th>
                  <th className="pb-2 text-center text-xs font-medium text-[#64748B]">Peso</th>
                  <th className="pb-2 text-center text-xs font-medium text-[#64748B]">Nota</th>
                  <th className="pb-2 text-right text-xs font-medium text-[#64748B]">Contribuição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {reportData.assessments.map(a => (
                  <tr key={a.name}>
                    <td className="py-3">{a.name}</td>
                    <td className="py-3 text-center text-[#64748B]">{a.weight}%</td>
                    <td className="py-3 text-center">
                      {a.score !== null ? (
                        <span className={clsx('font-bold', a.score >= 6 ? 'text-emerald-600' : 'text-amber-600')}>
                          {a.score.toFixed(1)}
                        </span>
                      ) : <span className="text-[#94A3B8]">—</span>}
                    </td>
                    <td className="py-3 text-right text-[#64748B]">
                      {a.score !== null ? ((a.score * a.weight) / 100).toFixed(2) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#E2E8F0]">
                  <td colSpan={3} className="pt-3 font-semibold text-[#0F172A]">Média ponderada</td>
                  <td className="pt-3 text-right font-bold text-emerald-600 text-lg">{reportData.average.toFixed(1)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {tab === 'materiais' && (
          <div className="card p-10 flex flex-col items-center gap-3 text-[#94A3B8]">
            <FileText size={36} strokeWidth={1.5} />
            <p className="font-medium text-[#64748B]">Nenhum material disponível</p>
            <p className="text-sm text-center max-w-xs">O professor ainda não compartilhou materiais nesta turma.</p>
          </div>
        )}
      </div>
    </>
  )
}
