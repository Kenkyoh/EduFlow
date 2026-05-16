import { useState } from 'react'
import { Save, Upload, Palette, Calendar, Settings as SettingsIcon, Users, Link } from 'lucide-react'
import { Header } from '../components/Header'
import { toast } from '../components/Toast'
import { useSettingsStore } from '../store/settings'
import { useAuthStore } from '../store/auth'
import type { GradeScale } from '../store/settings'
import { SCALE_INFO, SCALE_PREVIEW, formatThreshold, scoreToConceptual, scoreToMencao, CONCEPTUAL_COLORS, CONCEPTUAL_VALUES } from '../utils/gradeFormat'
import { MENCAO_COLORS, MENCAO_SCORES, MENCAO_ORDER } from '../data/mock'
import clsx from 'clsx'

type Tab = 'geral' | 'ano_letivo' | 'aprovacao' | 'usuarios' | 'integracoes'

export function Settings() {
  const user = useAuthStore(s => s.user)
  const isAdmin = user?.role === 'admin'
  const [tab, setTab] = useState<Tab>('geral')
  const [primaryColor, setPrimaryColor] = useState('#1E3A8A')
  const [saving, setSaving] = useState(false)

  const {
    gradeScale, approvalGrade, recoveryMin, recoveryMax, minAttendance,
    setGradeScale, setApprovalGrade, setRecoveryRange, setMinAttendance,
  } = useSettingsStore()

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    toast('Configurações salvas com sucesso!')
  }

  const allTabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'geral', label: 'Geral', icon: SettingsIcon },
    { id: 'ano_letivo', label: 'Ano Letivo', icon: Calendar },
    { id: 'aprovacao', label: 'Aprovação', icon: Save },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'integracoes', label: 'Integrações', icon: Link },
  ]
  const tabs = isAdmin ? allTabs.filter(t => t.id !== 'aprovacao') : allTabs

  return (
    <>
      <Header title={isAdmin ? 'Configurações da Plataforma' : 'Configurações da Instituição'} />

      {/* Tab strip — horizontal on mobile, vertical sidebar on desktop */}
      <div className="flex gap-1 border-b border-[#E2E8F0] mb-5 overflow-x-auto scrollbar-hide md:hidden">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors flex-shrink-0',
              tab === t.id
                ? 'border-[#1E3A8A] text-[#1E3A8A]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            )}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav — desktop only */}
        <div className="hidden md:block w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={clsx(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  tab === t.id
                    ? 'bg-blue-50 text-[#1E3A8A]'
                    : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]'
                )}
              >
                <t.icon size={15} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">
          {tab === 'geral' && (
            <div className="space-y-5">
              <div className="card p-5 space-y-4">
                <h3 className="font-display font-semibold text-[#0F172A]">Identidade Visual</h3>

                {/* Logo */}
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-2">Logo da instituição</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-[#1E3A8A] flex items-center justify-center text-white text-2xl font-bold border-2 border-[#E2E8F0]">
                      CE
                    </div>
                    <div>
                      <button type="button" className="btn-secondary text-sm">
                        <Upload size={14} /> Upload do logo
                      </button>
                      <p className="text-xs text-[#94A3B8] mt-1">PNG ou SVG, mín. 120×120px, máx. 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Institution name */}
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Nome da instituição</label>
                  <input className="input max-w-sm" defaultValue="Colégio Estadual São Paulo" />
                </div>

                {/* Subdomain */}
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Subdomínio</label>
                  <div className="flex items-center gap-0">
                    <input className="input rounded-r-none border-r-0 max-w-32 text-sm" defaultValue="escola" />
                    <span className="h-10 px-3 flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-r-lg text-sm text-[#64748B] whitespace-nowrap">
                      .eduflow.app
                    </span>
                  </div>
                </div>

                {/* Color palette */}
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-2">
                    <Palette size={12} className="inline mr-1" />
                    Cor principal
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-[#E2E8F0] cursor-pointer"
                    />
                    <input
                      className="input w-28 font-mono text-sm"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                    />
                    <div className="flex gap-2">
                      {['#1E3A8A', '#7C3AED', '#059669', '#DC2626', '#D97706', '#0891B2'].map(c => (
                        <button
                          key={c}
                          type="button"
                          title={c}
                          onClick={() => setPrimaryColor(c)}
                          className={clsx(
                            'w-7 h-7 rounded-full border-2 transition-all',
                            primaryColor === c ? 'border-[#0F172A] scale-110' : 'border-white shadow-sm'
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 p-3 rounded-lg flex items-center gap-3" style={{ backgroundColor: primaryColor + '15' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: primaryColor }}>
                      A
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: primaryColor }}>Preview da cor principal</p>
                      <p className="text-xs text-[#64748B]">Usado em botões, links e destaques</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'ano_letivo' && (
            <div className="card p-5 space-y-4">
              <h3 className="font-display font-semibold text-[#0F172A]">Configurações do Ano Letivo</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Ano letivo</label>
                  <select className="input">
                    <option>2024</option>
                    <option>2025</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Organização</label>
                  <select className="input">
                    <option>Bimestral (4 períodos)</option>
                    <option>Trimestral (3 períodos)</option>
                    <option>Semestral (2 períodos)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-2">Períodos</label>
                <div className="space-y-2">
                  {[
                    { name: '1º Bimestre', start: '2024-02-05', end: '2024-04-19' },
                    { name: '2º Bimestre', start: '2024-04-22', end: '2024-07-12' },
                    { name: '3º Bimestre', start: '2024-07-29', end: '2024-09-27' },
                    { name: '4º Bimestre', start: '2024-09-30', end: '2024-12-06' },
                  ].map(p => (
                    <div key={p.name} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                      <span className="text-sm font-medium text-[#0F172A] w-28">{p.name}</span>
                      <input type="date" className="input h-8 text-sm flex-1" defaultValue={p.start} />
                      <span className="text-[#94A3B8] text-sm">até</span>
                      <input type="date" className="input h-8 text-sm flex-1" defaultValue={p.end} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'aprovacao' && (
            <div className="space-y-5">
              {/* Escala de notas */}
              <div className="card p-5 space-y-4">
                <h3 className="font-display font-semibold text-[#0F172A]">Escala de Notas</h3>
                <p className="text-xs text-[#64748B]">Define como as notas são inseridas e exibidas em todo o sistema.</p>

                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(SCALE_INFO) as GradeScale[]).map(scale => {
                    const info = SCALE_INFO[scale]
                    const active = gradeScale === scale
                    return (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => { setGradeScale(scale); toast(`Escala alterada para ${info.short} — todo o sistema foi atualizado.`, 'success') }}
                        className={clsx(
                          'p-4 rounded-xl border-2 text-left transition-all',
                          active ? 'border-[#1E3A8A] bg-blue-50' : 'border-[#E2E8F0] bg-white hover:border-[#1E3A8A]/40'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={clsx('text-sm font-semibold', active ? 'text-[#1E3A8A]' : 'text-[#0F172A]')}>
                            {info.short}
                          </span>
                          {active && <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />}
                        </div>
                        <p className="text-xs text-[#64748B] leading-snug">{info.description}</p>
                        <div className="flex gap-1 mt-2">
                          {SCALE_PREVIEW[scale].samples.map((s, i) => (
                            <span key={i} className={clsx(
                              'text-[11px] font-bold px-1.5 py-0.5 rounded',
                              active ? 'bg-[#1E3A8A]/10 text-[#1E3A8A]' : 'bg-[#F1F5F9] text-[#64748B]'
                            )}>{s}</span>
                          ))}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Live preview card */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                  <p className="text-xs font-medium text-[#64748B] mb-3">
                    Preview — como as notas aparecem agora com a escala <strong>{SCALE_INFO[gradeScale].short}</strong>
                  </p>
                  <div className="flex items-center gap-6 flex-wrap">
                    {([10, 8.5, 7.0, 5.5, 3.0] as const).map(score => {
                      let display = ''
                      let bg = '', color = ''
                      if (gradeScale === 'numeric')    { display = score.toFixed(1) }
                      else if (gradeScale === 'percentage') { display = `${Math.round(score * 10)}%` }
                      else if (gradeScale === 'conceptual') {
                        const l = scoreToConceptual(score)
                        display = l; bg = CONCEPTUAL_COLORS[l].bg; color = CONCEPTUAL_COLORS[l].text
                      } else {
                        const m = scoreToMencao(score)!
                        display = m; bg = MENCAO_COLORS[m].bg; color = MENCAO_COLORS[m].text
                      }
                      return (
                        <div key={score} className="flex flex-col items-center gap-1">
                          <span className="text-[10px] text-[#94A3B8]">{score.toFixed(1)}</span>
                          <span
                            className="text-sm font-bold px-2 py-1 rounded-lg min-w-[36px] text-center"
                            style={bg ? { backgroundColor: bg, color } : {
                              backgroundColor: score >= approvalGrade ? '#DCFCE7' : score >= recoveryMin ? '#FEF9C3' : '#FEE2E2',
                              color: score >= approvalGrade ? '#166534' : score >= recoveryMin ? '#854D0E' : '#991B1B',
                            }}
                          >
                            {display}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Regras de aprovação */}
              <div className="card p-5 space-y-4">
                <h3 className="font-display font-semibold text-[#0F172A]">Regras de Aprovação</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                      Nota mínima para aprovação
                      <span className="ml-1 text-[#1E3A8A] font-bold">({formatThreshold(approvalGrade, gradeScale)})</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number" className="input w-24"
                        value={approvalGrade} min="0" max="10" step="0.1"
                        onChange={e => setApprovalGrade(parseFloat(e.target.value) || 6)}
                      />
                      <span className="text-sm text-[#64748B]">de 10,0</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">Frequência mínima</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number" className="input w-24"
                        value={minAttendance} min="0" max="100"
                        onChange={e => setMinAttendance(parseInt(e.target.value) || 75)}
                      />
                      <span className="text-sm text-[#64748B]">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                      Faixa de recuperação
                      <span className="ml-1 text-amber-600 font-bold">
                        ({formatThreshold(recoveryMin, gradeScale)} – {formatThreshold(recoveryMax, gradeScale)})
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input type="number" className="input w-20" value={recoveryMin} step="0.1"
                        onChange={e => setRecoveryRange(parseFloat(e.target.value) || 4, recoveryMax)} />
                      <span className="text-sm text-[#64748B]">a</span>
                      <input type="number" className="input w-20" value={recoveryMax} step="0.1"
                        onChange={e => setRecoveryRange(recoveryMin, parseFloat(e.target.value) || 5.9)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">Arredondamento</label>
                    <select className="input">
                      <option>1 decimal (7,4)</option>
                      <option>2 decimais (7,45)</option>
                      <option>Inteiro (7)</option>
                    </select>
                  </div>
                </div>

                {/* Status legend in current scale */}
                <div className="flex gap-3 flex-wrap">
                  {[
                    { label: 'Aprovado', min: approvalGrade, max: 10, bg: '#DCFCE7', color: '#166534' },
                    { label: 'Recuperação', min: recoveryMin, max: approvalGrade - 0.1, bg: '#FEF9C3', color: '#854D0E' },
                    { label: 'Reprovado', min: 0, max: recoveryMin - 0.1, bg: '#FEE2E2', color: '#991B1B' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: s.bg }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-xs font-medium text-[#0F172A]">{s.label}</span>
                      <span className="text-xs text-[#64748B]">
                        {formatThreshold(s.min, gradeScale)} – {formatThreshold(s.max, gradeScale)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Menção reference (always visible) */}
              <div className={clsx(
                'card p-5 space-y-4 transition-all',
                gradeScale === 'mencao' ? 'ring-2 ring-[#1E3A8A]' : 'opacity-70'
              )}>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-[#0F172A]">Escala de Menção (PA–N)</h3>
                  {gradeScale === 'mencao' && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#1E3A8A] text-white">Ativa</span>}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {MENCAO_ORDER.map(v => {
                    const c = MENCAO_COLORS[v]
                    return (
                      <div key={v} className="flex flex-col items-center gap-1 p-3 rounded-xl border" style={{ borderColor: c.bg, backgroundColor: c.bg + '40' }}>
                        <span className="text-base font-bold" style={{ color: c.text }}>{v}</span>
                        <span className="text-lg font-black" style={{ color: c.text }}>{MENCAO_SCORES[v]}</span>
                        <span className="text-[10px] text-center leading-tight" style={{ color: c.text }}>{c.label}</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-[#64748B]">
                  5 objetivos bimestrais por disciplina · Total máx: 5 × 2 = <strong>10 pts</strong> · Aprovação: total ≥ {approvalGrade} pts
                </p>
              </div>
            </div>
          )}

          {tab === 'integracoes' && (
            <div className="space-y-4">
              {[
                {
                  name: 'Google Workspace',
                  description: 'SSO, sincronização de calendário, importação de usuários',
                  icon: '🌐',
                  connected: true,
                },
                {
                  name: 'Microsoft 365',
                  description: 'Azure AD, Outlook, Teams',
                  icon: '🔷',
                  connected: false,
                },
                {
                  name: 'Zoom',
                  description: 'Criação automática de reuniões em aulas ao vivo',
                  icon: '📹',
                  connected: true,
                },
                {
                  name: 'WhatsApp Business',
                  description: 'Notificações críticas com opt-in explícito do responsável',
                  icon: '💬',
                  connected: false,
                },
                {
                  name: 'ERP Escolar / Totvs RM',
                  description: 'Importação via CSV ou API REST, sync de notas finais',
                  icon: '🗂️',
                  connected: false,
                },
              ].map(integration => (
                <div key={integration.name} className="card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">{integration.name}</p>
                      <p className="text-xs text-[#64748B]">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {integration.connected && (
                      <span className="badge-success text-xs">Conectado</span>
                    )}
                    <button
                      type="button"
                      onClick={() => toast(integration.connected ? `${integration.name} desconectado` : `Conectando ${integration.name}...`, 'info')}
                      className={integration.connected ? 'btn-ghost text-xs' : 'btn-secondary text-xs'}
                    >
                      {integration.connected ? 'Desconectar' : 'Conectar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'usuarios' && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-[#0F172A]">Usuários da Instituição</h3>
                <button type="button" className="btn-primary text-sm" onClick={() => toast('Convidando usuário...', 'info')}>
                  <Users size={14} /> Convidar usuário
                </button>
              </div>
              <table className="w-full text-sm">
                <thead className="border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-2 text-left text-xs font-medium text-[#64748B]">Nome</th>
                    <th className="py-2 text-left text-xs font-medium text-[#64748B]">E-mail</th>
                    <th className="py-2 text-left text-xs font-medium text-[#64748B]">Perfil</th>
                    <th className="py-2 text-left text-xs font-medium text-[#64748B]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {[
                    { name: 'Profa. Ana Lima', email: 'ana.lima@escola.eduflow.app', role: 'Professor', active: true },
                    { name: 'Prof. Roberto Souza', email: 'roberto@escola.eduflow.app', role: 'Professor', active: true },
                    { name: 'Lucas Mendes', email: 'lucas@escola.eduflow.app', role: 'Aluno', active: true },
                    { name: 'Maria Silva', email: 'maria@escola.eduflow.app', role: 'Aluno', active: false },
                  ].map(u => (
                    <tr key={u.email} className="hover:bg-[#F8FAFC]">
                      <td className="py-2.5 font-medium text-[#0F172A]">{u.name}</td>
                      <td className="py-2.5 text-[#64748B]">{u.email}</td>
                      <td className="py-2.5 text-[#64748B]">{u.role}</td>
                      <td className="py-2.5">
                        {u.active
                          ? <span className="badge-success">Ativo</span>
                          : <span className="badge-neutral">Inativo</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </span>
              ) : (
                <><Save size={16} /> Salvar configurações</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
