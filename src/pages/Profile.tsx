import { useState, useRef } from 'react'
import { Camera, Save, Lock, Bell, User, Check, Eye, EyeOff } from 'lucide-react'
import { Header } from '../components/Header'
import { UserAvatar } from '../components/UserAvatar'
import { useAuthStore } from '../store/auth'
import { toast } from '../components/Toast'
import clsx from 'clsx'
import { ROLE_LABELS } from '../utils/roleLabels'

type Tab = 'perfil' | 'seguranca' | 'preferencias'

const AVATAR_COLORS = [
  '#1E3A8A', '#7C3AED', '#059669', '#DC2626', '#D97706',
  '#0891B2', '#DB2777', '#65A30D', '#EA580C', '#6366F1',
  '#0F172A', '#64748B',
]

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'perfil',        label: 'Perfil',        icon: User  },
  { id: 'seguranca',     label: 'Segurança',      icon: Lock  },
  { id: 'preferencias',  label: 'Preferências',   icon: Bell  },
]

const PREF_DEFAULTS: Record<string, boolean> = {
  'Nova nota lançada':    true,
  'Prazo se aproximando': true,
  'Atividade atrasada':   true,
  'Novas mensagens':      true,
  'Avisos no mural':      true,
  'Urgentes':             true,
  'E-mail semanal':       false,
  'Novidades do sistema': false,
}

function strengthColor(i: number): string {
  if (i <= 1) return 'bg-red-400'
  if (i <= 2) return 'bg-amber-400'
  if (i <= 3) return 'bg-emerald-400'
  return 'bg-emerald-600'
}

export function Profile() {
  const user          = useAuthStore(s => s.user)
  const updateProfile = useAuthStore(s => s.updateProfile)

  const [tab, setTab]         = useState<Tab>('perfil')
  const [saving, setSaving]   = useState(false)

  // Perfil
  const [name, setName]       = useState(user?.name ?? '')
  const [bio,  setBio]        = useState('')
  const [avatarColor, setAvatarColor] = useState(
    user?.avatar?.startsWith('#') ? user.avatar : '#1E3A8A'
  )
  const [previewImg, setPreviewImg]   = useState<string | null>(
    user?.avatar && !user.avatar.startsWith('#') ? user.avatar : null
  )
  const fileRef   = useRef<HTMLInputElement>(null)
  const readerRef = useRef<FileReader | null>(null)

  // Preferências
  const [prefs, setPrefs] = useState<Record<string, boolean>>(PREF_DEFAULTS)

  // Segurança
  const [currentPw,  setCurrentPw]  = useState('')
  const [newPw,      setNewPw]      = useState('')
  const [confirmPw,  setConfirmPw]  = useState('')
  const [showPw,     setShowPw]     = useState(false)
  const [pwError,    setPwError]    = useState('')

  const currentAvatar = previewImg ?? avatarColor
  const previewUser   = user ? { ...user, avatar: currentAvatar } : user

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { toast('Imagem muito grande (máx. 3 MB)', 'error'); return }
    readerRef.current?.abort()
    const reader = new FileReader()
    readerRef.current = reader
    reader.onload = ev => setPreviewImg(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSavePrefs = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    toast('Preferências salvas!', 'success')
  }

  const handleSavePerfil = async () => {
    if (!name.trim()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    updateProfile({ name: name.trim(), avatar: currentAvatar })
    setSaving(false)
    toast('Perfil atualizado com sucesso!', 'success')
  }

  const handleSaveSenha = async () => {
    setPwError('')
    if (!currentPw) { setPwError('Informe a senha atual'); return }
    if (newPw.length < 6) { setPwError('Nova senha deve ter ao menos 6 caracteres'); return }
    if (newPw !== confirmPw) { setPwError('As senhas não coincidem'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    toast('Senha alterada com sucesso!', 'success')
  }

  return (
    <>
      <Header title="Meu Perfil" />

      <div className="max-w-2xl space-y-5">
        {/* Profile hero card */}
        <div className="card p-6">
          <div className="flex items-center gap-5">
            {/* Avatar with camera overlay */}
            <div className="relative flex-shrink-0">
              <UserAvatar user={previewUser} size={80} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1E3A8A] border-2 border-white flex items-center justify-center text-white shadow-md hover:bg-[#1e40af] transition-colors"
                title="Alterar foto"
              >
                <Camera size={13} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                aria-label="Foto de perfil"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-lg font-display font-bold text-[#0F172A] truncate">
                {user?.name}
              </p>
              <p className="text-sm text-[#64748B]">
                {ROLE_LABELS[user?.role ?? ''] ?? user?.role}
                {user?.institution && <span className="text-[#CBD5E1]"> · {user.institution}</span>}
              </p>
              <p className="text-xs text-[#94A3B8] mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#E2E8F0]">
          {TABS.map(({ id, label, icon: Icon }) => (
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

        {/* ── Tab: Perfil ── */}
        {tab === 'perfil' && (
          <div className="space-y-5">
            {/* Avatar color picker */}
            <div className="card p-5 space-y-4">
              <h3 className="font-display font-semibold text-[#0F172A]">Foto de perfil</h3>

              <div className="flex items-start gap-6">
                {/* Big preview */}
                <UserAvatar user={previewUser} size={72} className="flex-shrink-0" />

                <div className="flex-1 space-y-3">
                  {/* Color swatches */}
                  <div>
                    <p className="text-xs font-medium text-[#64748B] mb-2">Cor do avatar</p>
                    <div className="flex flex-wrap gap-2">
                      {AVATAR_COLORS.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setAvatarColor(c); setPreviewImg(null) }}
                          className={clsx(
                            'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
                            (previewImg ? false : avatarColor === c)
                              ? 'border-[#0F172A] scale-110 shadow-md'
                              : 'border-white shadow-sm'
                          )}
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Upload button */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="btn-secondary text-sm gap-2"
                    >
                      <Camera size={14} />
                      {previewImg ? 'Trocar foto' : 'Fazer upload'}
                    </button>
                    {previewImg && (
                      <button
                        type="button"
                        onClick={() => setPreviewImg(null)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remover foto
                      </button>
                    )}
                    <p className="text-xs text-[#94A3B8]">JPG, PNG ou GIF · máx. 3 MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal info */}
            <div className="card p-5 space-y-4">
              <h3 className="font-display font-semibold text-[#0F172A]">Informações pessoais</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Nome completo</label>
                  <input
                    className="input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                    E-mail
                    <span className="ml-1.5 text-[10px] font-normal text-[#94A3B8] bg-slate-100 px-1.5 py-0.5 rounded">institucional</span>
                  </label>
                  <input
                    className="input bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed"
                    value={user?.email ?? ''}
                    readOnly
                    title="Gerenciado pela instituição"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-1.5">Bio <span className="text-[#94A3B8]">(opcional)</span></label>
                <textarea
                  className="input resize-none h-20 text-sm"
                  placeholder="Escreva algo sobre você..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  maxLength={200}
                />
                <p className="text-right text-[10px] text-[#94A3B8] mt-0.5">{bio.length}/200</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSavePerfil}
                disabled={saving || !name.trim()}
                className="btn-primary gap-2"
              >
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Salvando...</>
                  : <><Save size={15} /> Salvar alterações</>
                }
              </button>
            </div>
          </div>
        )}

        {/* ── Tab: Segurança ── */}
        {tab === 'seguranca' && (
          <div className="space-y-5">
            <div className="card p-5 space-y-4">
              <h3 className="font-display font-semibold text-[#0F172A]">Alterar senha</h3>

              <div className="max-w-sm space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Senha atual</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      className="input pr-10"
                      placeholder="••••••••"
                      value={currentPw}
                      onChange={e => { setCurrentPw(e.target.value); setPwError('') }}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Nova senha</label>
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input"
                    placeholder="Mínimo 6 caracteres"
                    value={newPw}
                    onChange={e => { setNewPw(e.target.value); setPwError('') }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">Confirmar nova senha</label>
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input"
                    placeholder="Repita a nova senha"
                    value={confirmPw}
                    onChange={e => { setConfirmPw(e.target.value); setPwError('') }}
                  />
                </div>

                {/* Password strength */}
                {newPw.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={clsx(
                            'h-1 flex-1 rounded-full transition-colors',
                            newPw.length >= i * 3 ? strengthColor(i) : 'bg-[#E2E8F0]'
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-[#94A3B8]">
                      {newPw.length < 3 ? 'Muito fraca' : newPw.length < 6 ? 'Fraca' : newPw.length < 9 ? 'Boa' : 'Forte'}
                    </p>
                  </div>
                )}

                {pwError && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full border border-red-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">!</span>
                    {pwError}
                  </p>
                )}

                {confirmPw.length > 0 && newPw === confirmPw && !pwError && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1.5">
                    <Check size={12} /> Senhas coincidem
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveSenha}
                disabled={saving}
                className="btn-primary gap-2"
              >
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Salvando...</>
                  : <><Lock size={15} /> Alterar senha</>
                }
              </button>
            </div>
          </div>
        )}

        {/* ── Tab: Preferências ── */}
        {tab === 'preferencias' && (
          <div className="card p-5 space-y-5">
            <h3 className="font-display font-semibold text-[#0F172A]">Notificações</h3>

            {[
              {
                group: 'Atividades',
                items: [
                  { label: 'Nova nota lançada',       desc: 'Quando uma nota for publicada para você'         },
                  { label: 'Prazo se aproximando',    desc: 'Lembrete 24h antes do vencimento de uma entrega' },
                  { label: 'Atividade atrasada',      desc: 'Quando uma entrega passar do prazo'              },
                ],
              },
              {
                group: 'Comunicação',
                items: [
                  { label: 'Novas mensagens',         desc: 'Mensagens diretas recebidas'                     },
                  { label: 'Avisos no mural',         desc: 'Publicações dos professores nas suas turmas'     },
                  { label: 'Urgentes',                desc: 'Avisos marcados como urgentes'                   },
                ],
              },
              {
                group: 'Plataforma',
                items: [
                  { label: 'E-mail semanal',          desc: 'Resumo semanal de desempenho por e-mail'         },
                  { label: 'Novidades do sistema',    desc: 'Atualizações e novos recursos do EduFlow'        },
                ],
              },
            ].map(({ group, items }) => (
              <div key={group}>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">{group}</p>
                <div className="divide-y divide-[#F8FAFC]">
                  {items.map(item => (
                    <PrefToggle
                      key={item.label}
                      label={item.label}
                      desc={item.desc}
                      on={prefs[item.label] ?? false}
                      onToggle={() => setPrefs(p => ({ ...p, [item.label]: !p[item.label] }))}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSavePrefs}
                disabled={saving}
                className="btn-primary gap-2"
              >
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Salvando...</>
                  : <><Save size={15} /> Salvar preferências</>
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function PrefToggle({ label, desc, on, onToggle }: { label: string; desc: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="mr-4">
        <p className="text-sm font-medium text-[#0F172A]">{label}</p>
        <p className="text-xs text-[#94A3B8]">{desc}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={clsx(
          'w-10 h-6 rounded-full transition-colors relative flex-shrink-0',
          on ? 'bg-[#1E3A8A]' : 'bg-[#E2E8F0]'
        )}
        role="switch"
        aria-label={label}
        aria-checked={on ? 'true' : 'false'}
      >
        <span className={clsx(
          'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all',
          on ? 'left-5' : 'left-1'
        )} />
      </button>
    </div>
  )
}
