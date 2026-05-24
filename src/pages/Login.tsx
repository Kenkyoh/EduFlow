import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, Sun, Moon, ArrowRight, TrendingUp, Users, CheckCircle2, CalendarDays } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { useLanguageStore } from '../store/language'
import { useThemeStore } from '../store/theme'
import { useTranslation } from '../i18n'
import clsx from 'clsx'

const LANG_OPTIONS: { code: 'pt' | 'en' | 'es'; flag: string; label: string }[] = [
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
]

function PreviewCard({ t }: { t: (key: string) => string }) {
  return (
    <div className="relative">
      {/* Main card */}
      <div className="bg-white/8 border border-white/12 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white font-semibold text-sm">{t('login.preview.class')}</p>
            <p className="text-slate-400 text-xs mt-0.5">{t('login.preview.teacher')}</p>
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            {t('login.preview.active')}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { labelKey: 'login.preview.average', value: '8.4', icon: TrendingUp, color: 'text-emerald-400' },
            { labelKey: 'login.preview.students', value: '28', icon: Users, color: 'text-blue-400' },
            { labelKey: 'login.preview.submissions', value: '94%', icon: CheckCircle2, color: 'text-purple-400' },
          ].map(stat => (
            <div key={stat.labelKey} className="bg-white/5 rounded-xl p-3">
              <stat.icon size={13} className={clsx('mb-1.5', stat.color)} />
              <p className="text-white font-bold text-base leading-none">{stat.value}</p>
              <p className="text-slate-500 text-[10px] mt-1">{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>

        {/* Mini progress bar */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
            <span>{t('login.preview.deliveryRate')}</span>
            <span className="text-emerald-400 font-medium">94%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
          </div>
        </div>
      </div>

      {/* Floating notification */}
      <div className="absolute -top-3 -right-3 bg-[#1E3A8A] border border-blue-500/30 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-white text-xs font-medium whitespace-nowrap">{t('login.preview.gradePosted')}</span>
      </div>

      {/* Floating grade pill */}
      <div className="absolute -bottom-3 -left-3 bg-slate-800 border border-white/10 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-[10px] text-slate-400">{t('login.preview.studentName')}</p>
        <p className="text-white font-bold text-sm">9.5 <span className="text-emerald-400 text-xs">✓</span></p>
      </div>
    </div>
  )
}

export function Login() {
  const navigate = useNavigate()
  const { user, loginWithCredentials } = useAuthStore()
  const { language, setLanguage } = useLanguageStore()
  const { theme, toggleTheme } = useThemeStore()
  const t = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    if (user.role === 'student')       navigate('/student',     { replace: true })
    else if (user.role === 'teacher')  navigate('/teacher',     { replace: true })
    else if (user.role === 'guardian') navigate('/guardian',    { replace: true })
    else if (user.role === 'admin')    navigate('/admin',       { replace: true })
    else                               navigate('/coordinator', { replace: true })
  }, [user, navigate])

  const handleLogin = async () => {
    setError('')
    const loginEmail    = email.trim().toLowerCase()
    const loginPassword = password
    if (!loginEmail || !loginPassword) { setError(t('login.wrongCredentials')); return }
    setLoading(true)
    try {
      await loginWithCredentials(loginEmail, loginPassword)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.wrongCredentials'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden flex bg-[#F8FAFC] dark:bg-slate-950">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex w-[480px] xl:w-[540px] flex-shrink-0 flex-col p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #111827 60%, #0c1a3a 100%)' }}>

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Top glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#2563eb] flex items-center justify-center shadow-lg">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-white text-xl tracking-tight">Vekta</span>
        </div>

        {/* Headline */}
        <div className="relative z-10 mt-10 mb-8">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-5">{t('login.tagline')}</p>
          <h2 className="font-display font-extrabold text-white leading-[1.1] mb-4" style={{ fontSize: '2.6rem' }}>
            {t('login.headline')}<br />
            <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundImage: 'linear-gradient(90deg, #60A5FA, #818CF8)' }}>
              {t('login.headlineAccent')}
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            {t('login.description')}
          </p>
        </div>

        {/* Preview card */}
        <div className="relative z-10 mb-auto px-2">
          <PreviewCard t={t} />
        </div>

        {/* Bottom */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/8 flex items-center justify-between">
          <p className="text-slate-600 text-xs">© 2025 Vekta</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 sm:px-10 sm:py-4">
          <div className="flex items-center gap-2">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-7 h-7 rounded-lg bg-[#1E3A8A] flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-[#0F172A] dark:text-white text-base tracking-tight">Vekta</span>
            </div>
            {/* Agendar demonstração — texto só em sm+ */}
            <a
              href="mailto:contato@vekta.app?subject=Demonstração Vekta"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-700 text-xs font-medium text-[#1E3A8A] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              <CalendarDays size={13} />
              <span className="hidden sm:inline">{t('login.scheduleDemo')}</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-400 transition-colors">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            {/* Language — apenas flags no mobile, flags+label no sm+ */}
            <div className="flex rounded-lg overflow-hidden border border-[#E2E8F0] dark:border-slate-700">
              {LANG_OPTIONS.map(opt => (
                <button key={opt.code} type="button" onClick={() => setLanguage(opt.code)}
                  className={clsx('px-2 py-1.5 text-xs font-medium transition-colors flex items-center gap-1',
                    language === opt.code
                      ? 'bg-[#1E3A8A] text-white'
                      : 'text-[#64748B] hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800')}>
                  <span>{opt.flag}</span>
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-start sm:justify-center items-center px-5 sm:px-10 pt-4 sm:pt-0 pb-6 overflow-hidden">
          <div className="w-full max-w-[360px]">

            {/* Mobile brand block — hidden on desktop (left panel covers this) */}
            <div className="lg:hidden mb-8 p-5 rounded-2xl text-white bg-gradient-to-br from-slate-900 to-[#1e3a8a]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-display font-bold text-base leading-none">Vekta</p>
                  <p className="text-blue-300 text-xs mt-0.5">{t('login.tagline')}</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{t('login.description')}</p>
            </div>

            <h2 className="font-display font-bold text-[#0F172A] dark:text-white text-2xl mb-1">
              {t('login.welcomeBack')}
            </h2>
            <p className="text-[#64748B] dark:text-slate-400 text-sm mb-6">
              {t('login.signInToContinue')}
            </p>

            {/* Email form */}
            <div className="space-y-3">
              <input type="email" className="input" placeholder={t('login.emailPlaceholder')}
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />

              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="input pr-10"
                  placeholder={t('login.passwordPlaceholder')}
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button type="button" onClick={() => handleLogin()} disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('login.entering')}</>
                ) : (
                  <>{t('login.enterButton')} <ArrowRight size={15} /></>
                )}
              </button>
            </div>

            <p className="text-center text-[#94A3B8] text-xs mt-8">{t('login.accessProblems')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
