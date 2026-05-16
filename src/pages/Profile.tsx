import { useState, useRef } from 'react'
import { Camera, Save, Lock, Bell, User, Check, Eye, EyeOff } from 'lucide-react'
import { Header } from '../components/Header'
import { UserAvatar } from '../components/UserAvatar'
import { useAuthStore } from '../store/auth'
import { useTranslation } from '../i18n'
import { toast } from '../components/Toast'
import clsx from 'clsx'

type Tab = 'perfil' | 'seguranca' | 'preferencias'

const AVATAR_COLORS = [
  '#1E3A8A', '#7C3AED', '#059669', '#DC2626', '#D97706',
  '#0891B2', '#DB2777', '#65A30D', '#EA580C', '#6366F1',
  '#0F172A', '#64748B',
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
  const t             = useTranslation()

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'perfil',       label: t('profile.tabs.profile'),      icon: User },
    { id: 'seguranca',    label: t('profile.tabs.security'),     icon: Lock },
    { id: 'preferencias', label: t('profile.tabs.preferences'),  icon: Bell },
  ]

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
    if (file.size > 3 * 1024 * 1024) { toast(t('profile.imageTooLarge'), 'error'); return }
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
    toast(t('profile.preferencesUpdated'), 'success')
  }

  const handleSavePerfil = async () => {
    if (!name.trim()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    updateProfile({ name: name.trim(), avatar: currentAvatar })
    setSaving(false)
    toast(t('profile.profileUpdated'), 'success')
  }

  const handleSaveSenha = async () => {
    setPwError('')
    if (!currentPw) { setPwError(t('profile.currentPasswordRequired')); return }
    if (newPw.length < 6) { setPwError(t('profile.passwordTooShort')); return }
    if (newPw !== confirmPw) { setPwError(t('profile.passwordMismatch')); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    toast(t('profile.passwordChanged'), 'success')
  }

  return (
    <>
      <Header title={t('profile.title')} />

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
                title={t('profile.changePhotoTitle')}
              >
                <Camera size={13} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                aria-label={t('profile.profilePhoto')}
                onChange={handleFileChange}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-lg font-display font-bold text-[#0F172A] truncate">
                {user?.name}
              </p>
              <p className="text-sm text-[#64748B]">
                {user?.role ? t(`roles.${user.role}`) : ''}
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
              <h3 className="font-display font-semibold text-[#0F172A]">{t('profile.profilePhoto')}</h3>

              <div className="flex items-start gap-6">
                {/* Big preview */}
                <UserAvatar user={previewUser} size={72} className="flex-shrink-0" />

                <div className="flex-1 space-y-3">
                  {/* Color swatches */}
                  <div>
                    <p className="text-xs font-medium text-[#64748B] mb-2">{t('profile.avatarColor')}</p>
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
                      {previewImg ? t('profile.changePhoto') : t('profile.uploadPhoto')}
                    </button>
                    {previewImg && (
                      <button
                        type="button"
                        onClick={() => setPreviewImg(null)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        {t('profile.removePhoto')}
                      </button>
                    )}
                    <p className="text-xs text-[#94A3B8]">{t('profile.uploadSpecs')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal info */}
            <div className="card p-5 space-y-4">
              <h3 className="font-display font-semibold text-[#0F172A]">{t('profile.personalInfo')}</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">{t('profile.fullName')}</label>
                  <input
                    className="input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={t('profile.namePlaceholder')}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                    {t('profile.email')}
                    <span className="ml-1.5 text-[10px] font-normal text-[#94A3B8] bg-slate-100 px-1.5 py-0.5 rounded">{t('profile.institutional')}</span>
                  </label>
                  <input
                    className="input bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed"
                    value={user?.email ?? ''}
                    readOnly
                    title={t('profile.managedByInstitution')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-1.5">{t('profile.bio')} <span className="text-[#94A3B8]">({t('profile.optional')})</span></label>
                <textarea
                  className="input resize-none h-20 text-sm"
                  placeholder={t('profile.bioPlaceholder')}
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
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('profile.saving')}</>
                  : <><Save size={15} /> {t('profile.saveChanges')}</>
                }
              </button>
            </div>
          </div>
        )}

        {/* ── Tab: Segurança ── */}
        {tab === 'seguranca' && (
          <div className="space-y-5">
            <div className="card p-5 space-y-4">
              <h3 className="font-display font-semibold text-[#0F172A]">{t('profile.changePassword')}</h3>

              <div className="max-w-sm space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">{t('profile.currentPassword')}</label>
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
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">{t('profile.newPassword')}</label>
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input"
                    placeholder={t('profile.newPasswordPlaceholder')}
                    value={newPw}
                    onChange={e => { setNewPw(e.target.value); setPwError('') }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1.5">{t('profile.confirmPassword')}</label>
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input"
                    placeholder={t('profile.confirmPasswordPlaceholder')}
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
                      {newPw.length < 3 ? t('profile.passwordStrength.veryWeak') : newPw.length < 6 ? t('profile.passwordStrength.weak') : newPw.length < 9 ? t('profile.passwordStrength.good') : t('profile.passwordStrength.strong')}
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
                    <Check size={12} /> {t('profile.passwordsMatch')}
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
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('profile.saving')}</>
                  : <><Lock size={15} /> {t('profile.changePasswordBtn')}</>
                }
              </button>
            </div>
          </div>
        )}

        {/* ── Tab: Preferências ── */}
        {tab === 'preferencias' && (
          <div className="card p-5 space-y-5">
            <h3 className="font-display font-semibold text-[#0F172A]">{t('profile.notifications')}</h3>

            {[
              {
                group: t('profile.prefGroups.activities'),
                items: [
                  { key: 'Nova nota lançada',       label: t('profile.prefItems.newGrade.label'),          desc: t('profile.prefItems.newGrade.desc')          },
                  { key: 'Prazo se aproximando',    label: t('profile.prefItems.upcomingDeadline.label'),  desc: t('profile.prefItems.upcomingDeadline.desc')  },
                  { key: 'Atividade atrasada',      label: t('profile.prefItems.lateActivity.label'),      desc: t('profile.prefItems.lateActivity.desc')      },
                ],
              },
              {
                group: t('profile.prefGroups.communication'),
                items: [
                  { key: 'Novas mensagens',         label: t('profile.prefItems.newMessages.label'),       desc: t('profile.prefItems.newMessages.desc')       },
                  { key: 'Avisos no mural',         label: t('profile.prefItems.bulletinBoard.label'),     desc: t('profile.prefItems.bulletinBoard.desc')     },
                  { key: 'Urgentes',                label: t('profile.prefItems.urgent.label'),            desc: t('profile.prefItems.urgent.desc')            },
                ],
              },
              {
                group: t('profile.prefGroups.platform'),
                items: [
                  { key: 'E-mail semanal',          label: t('profile.prefItems.weeklyEmail.label'),       desc: t('profile.prefItems.weeklyEmail.desc')       },
                  { key: 'Novidades do sistema',    label: t('profile.prefItems.systemNews.label'),        desc: t('profile.prefItems.systemNews.desc')        },
                ],
              },
            ].map(({ group, items }) => (
              <div key={group}>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">{group}</p>
                <div className="divide-y divide-[#F8FAFC]">
                  {items.map(item => (
                    <PrefToggle
                      key={item.key}
                      label={item.label}
                      desc={item.desc}
                      on={prefs[item.key] ?? false}
                      onToggle={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key] }))}
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
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('profile.saving')}</>
                  : <><Save size={15} /> {t('profile.savePreferences')}</>
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
        aria-checked={on}
      >
        <span className={clsx(
          'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all',
          on ? 'left-5' : 'left-1'
        )} />
      </button>
    </div>
  )
}
