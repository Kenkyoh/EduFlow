import { useState } from 'react'
import { Save, User, Bell, Shield, Key, Check } from 'lucide-react'
import { Header } from '../../components/Header'
import { toast } from '../../components/Toast'
import { useAuthStore } from '../../store/auth'
import clsx from 'clsx'

type Tab = 'conta' | 'notificacoes' | 'seguranca'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'conta',         label: 'Minha Conta',  icon: User    },
  { id: 'notificacoes',  label: 'Notificações', icon: Bell    },
  { id: 'seguranca',     label: 'Segurança',    icon: Shield  },
]

export function AdminSettings() {
  const user = useAuthStore(s => s.user)
  const [tab, setTab]     = useState<Tab>('conta')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 900))
    setSaving(false)
    toast('Configurações salvas com sucesso!')
  }

  return (
    <>
      <Header title="Configurações" />

      {/* Mobile tab strip */}
      <div className="flex gap-1 border-b border-[#E2E8F0] mb-5 overflow-x-auto scrollbar-hide md:hidden">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-all flex-shrink-0',
              tab === t.id
                ? 'border-[#1E3A8A] text-[#1E3A8A]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            )}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <div className="md:flex md:gap-6">
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

          {/* ── Minha Conta ── */}
          {tab === 'conta' && (
            <div className="space-y-5">
              <div className="card p-5 space-y-4">
                <h3 className="font-display font-semibold text-[#0F172A]">Informações pessoais</h3>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {user?.name?.charAt(0) ?? 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">{user?.name}</p>
                    <p className="text-xs text-[#94A3B8]">Administrador · EduFlow</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">Nome</label>
                    <input className="input" defaultValue={user?.name ?? ''} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">E-mail</label>
                    <input className="input" type="email" defaultValue={user?.email ?? ''} />
                  </div>
                </div>
              </div>

              <div className="card p-5 space-y-4">
                <h3 className="font-display font-semibold text-[#0F172A]">Alterar senha</h3>
                <div className="space-y-3 max-w-sm">
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">Senha atual</label>
                    <input className="input" type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">Nova senha</label>
                    <input className="input" type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">Confirmar nova senha</label>
                    <input className="input" type="password" placeholder="••••••••" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Notificações ── */}
          {tab === 'notificacoes' && (
            <div className="card p-5 space-y-5">
              <h3 className="font-display font-semibold text-[#0F172A]">Preferências de notificação</h3>

              {[
                {
                  group: 'Escolas',
                  items: [
                    { label: 'Nova escola cadastrada',          desc: 'Quando uma escola entrar em período de trial',        defaultOn: true  },
                    { label: 'Escola ativada / desativada',     desc: 'Mudanças de status em escolas existentes',             defaultOn: true  },
                    { label: 'Plano atualizado',                desc: 'Quando uma escola muda de plano',                     defaultOn: true  },
                  ],
                },
                {
                  group: 'Plataforma',
                  items: [
                    { label: 'Relatório semanal',               desc: 'Resumo de atividade de todas as escolas por e-mail',  defaultOn: true  },
                    { label: 'Alertas de sistema',              desc: 'Erros críticos ou indisponibilidade',                 defaultOn: true  },
                    { label: 'Atualizações da plataforma',      desc: 'Novos recursos e mudanças importantes',               defaultOn: false },
                  ],
                },
              ].map(({ group, items }) => (
                <div key={group}>
                  <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">{group}</p>
                  <div className="space-y-3">
                    {items.map(item => (
                      <NotifRow key={item.label} {...item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Segurança ── */}
          {tab === 'seguranca' && (
            <div className="space-y-5">
              <div className="card p-5 space-y-4">
                <h3 className="font-display font-semibold text-[#0F172A]">Autenticação em dois fatores</h3>
                <p className="text-sm text-[#64748B]">Adicione uma camada extra de segurança à sua conta de administrador.</p>
                <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Check size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">Autenticador (TOTP)</p>
                      <p className="text-xs text-[#94A3B8]">Google Authenticator, Authy, etc.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary text-sm"
                    onClick={() => toast('Configuração de 2FA em breve', 'info')}
                  >
                    Configurar
                  </button>
                </div>
              </div>

              <div className="card p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Key size={16} className="text-[#94A3B8]" />
                  <h3 className="font-display font-semibold text-[#0F172A]">Sessões ativas</h3>
                </div>
                {[
                  { device: 'Chrome · Windows 11',  location: 'São Paulo, SP', time: 'Agora',        current: true  },
                  { device: 'Safari · iPhone 15',    location: 'São Paulo, SP', time: 'Há 2 horas',   current: false },
                ].map(s => (
                  <div key={s.device} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">{s.device}</p>
                      <p className="text-xs text-[#94A3B8]">{s.location} · {s.time}</p>
                    </div>
                    {s.current
                      ? <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Sessão atual</span>
                      : <button type="button" className="text-xs text-red-500 hover:underline" onClick={() => toast('Sessão encerrada', 'info')}>Encerrar</button>
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save */}
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
                <><Save size={16} /> Salvar</>
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

function NotifRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-[#0F172A]">{label}</p>
        <p className="text-xs text-[#94A3B8]">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => setOn(v => !v)}
        className={clsx(
          'w-10 h-6 rounded-full transition-colors relative flex-shrink-0',
          on ? 'bg-[#1E3A8A]' : 'bg-[#E2E8F0]'
        )}
      >
        <span className={clsx(
          'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all',
          on ? 'left-5' : 'left-1'
        )} />
      </button>
    </div>
  )
}
