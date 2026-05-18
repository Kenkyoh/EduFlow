import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, Chrome, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { useLanguageStore } from '../store/language'
import { useTranslation } from '../i18n'
import type { UserRole } from '../types'
import clsx from 'clsx'

const DEMO_PASSWORD = 'Demo@2025#'
const ADMIN_PASSWORD = 'Vekta@2025#Admin'

const LANG_OPTIONS: { code: 'pt' | 'en' | 'es'; flag: string; label: string }[] = [
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
]

export function Login() {
  const navigate = useNavigate()
  const { user, loginWithCredentials } = useAuthStore()
  const { language, setLanguage } = useLanguageStore()
  const t = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redireciona se já autenticado
  useEffect(() => {
    if (!user) return
    if (user.role === 'student')       navigate('/student',      { replace: true })
    else if (user.role === 'teacher')  navigate('/teacher',      { replace: true })
    else if (user.role === 'guardian') navigate('/guardian',     { replace: true })
    else if (user.role === 'admin')    navigate('/admin',        { replace: true })
    else                               navigate('/coordinator',  { replace: true })
  }, [user, navigate])

  const DEMO_PROFILES: { role: UserRole; label: string; email: string; password: string; avatarBg: string; textColor: string; emoji: string }[] = [
    { role: 'student',     label: t('roles.student'),     email: 'lucas@escola.vekta.app',    password: DEMO_PASSWORD,  avatarBg: 'bg-blue-100',    textColor: 'text-blue-700',    emoji: '🎓' },
    { role: 'teacher',     label: t('roles.teacher'),     email: 'ana.lima@escola.vekta.app', password: DEMO_PASSWORD,  avatarBg: 'bg-purple-100',  textColor: 'text-purple-700',  emoji: '👩‍🏫' },
    { role: 'coordinator', label: t('roles.coordinator'), email: 'carlos@escola.vekta.app',   password: DEMO_PASSWORD,  avatarBg: 'bg-emerald-100', textColor: 'text-emerald-700', emoji: '📊' },
    { role: 'guardian',    label: t('roles.guardian'),    email: 'fernanda.mendes@gmail.com', password: DEMO_PASSWORD,  avatarBg: 'bg-rose-100',    textColor: 'text-rose-700',    emoji: '👪' },
    { role: 'admin',       label: t('roles.admin'),       email: 'admin@vekta.app',           password: ADMIN_PASSWORD, avatarBg: 'bg-slate-100',   textColor: 'text-slate-700',   emoji: '⚙️' },
  ]

  const handleLogin = async (demoEmail?: string, demoPassword?: string) => {
    setError('')
    const loginEmail    = (demoEmail    ?? email).trim().toLowerCase()
    const loginPassword = demoPassword  ?? password

    if (!loginEmail || !loginPassword) {
      setError(t('login.wrongCredentials'))
      return
    }

    setLoading(true)
    try {
      await loginWithCredentials(loginEmail, loginPassword)
      // navegação fica no useEffect acima
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.wrongCredentials'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#1e40af] to-[#1d4ed8] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Language selector */}
        <div className="flex justify-end mb-4">
          <div className="flex rounded-lg overflow-hidden border border-white/20">
            {LANG_OPTIONS.map(opt => (
              <button
                key={opt.code}
                type="button"
                onClick={() => setLanguage(opt.code)}
                className={clsx(
                  'px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1',
                  language === opt.code
                    ? 'bg-white text-[#1E3A8A]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                )}
              >
                <span>{opt.flag}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-lg mb-4">
            <GraduationCap className="w-8 h-8 text-[#1E3A8A]" />
          </div>
          <h1 className="font-display font-bold text-white text-3xl tracking-tight">Vekta</h1>
          <p className="text-blue-200 mt-1 text-sm">{t('login.subtitle')}</p>
          <div className="mt-1 text-xs text-blue-300">{t('login.schoolUrl')}</div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-modal p-8">
          <h2 className="font-display font-semibold text-[#0F172A] text-xl mb-6">{t('login.signIn')}</h2>

          {/* Demo profiles */}
          <div className="mb-5">
            <p className="text-xs font-medium text-[#94A3B8] mb-2.5">{t('login.quickAccess')}</p>
            <div className="space-y-1.5">
              {DEMO_PROFILES.map(p => (
                <button
                  key={p.role}
                  type="button"
                  disabled={loading}
                  onClick={() => handleLogin(p.email, p.password)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-[#E2E8F0] hover:border-[#1E3A8A]/40 hover:bg-[#EFF6FF] transition-all text-left disabled:opacity-60 group"
                >
                  <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0', p.avatarBg)}>
                    {p.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-xs font-semibold leading-tight', p.textColor)}>{p.label}</p>
                    <p className="text-[10px] text-[#94A3B8] truncate mt-0.5">{p.email}</p>
                  </div>
                  <ChevronRight size={13} className="text-[#CBD5E1] group-hover:text-[#1E3A8A] transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-[#94A3B8]">{t('login.orEmail')}</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">{t('login.email')}</label>
              <input
                type="email"
                className="input"
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">{t('login.password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder={t('login.passwordPlaceholder')}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[#E2E8F0] accent-[#1E3A8A]" />
                <span className="text-xs text-[#64748B]">{t('login.rememberMe')}</span>
              </label>
              <button type="button" className="text-xs text-[#1E3A8A] hover:underline">{t('login.forgotPassword')}</button>
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="button"
              onClick={() => handleLogin()}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('login.entering')}
                </span>
              ) : t('login.enterButton')}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span className="text-xs text-[#94A3B8]">{t('login.sso')}</span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="btn-secondary text-xs gap-2 h-9">
                <Chrome size={14} />
                Google
              </button>
              <button type="button" className="btn-secondary text-xs gap-2 h-9">
                <span className="text-blue-600 font-bold text-xs">M</span>
                Microsoft
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-blue-200 text-xs mt-6">
          {t('login.accessProblems')}
        </p>
      </div>
    </div>
  )
}
