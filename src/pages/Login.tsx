import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, Chrome } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import type { UserRole } from '../types'
import clsx from 'clsx'

const DEMO_PROFILES: { role: UserRole; label: string; email: string; color: string; emoji: string }[] = [
  { role: 'student',     label: 'Aluno',        email: 'lucas@escola.eduflow.app',         color: 'bg-blue-50 border-blue-200 text-blue-700',     emoji: '🎓' },
  { role: 'teacher',     label: 'Professor',    email: 'ana.lima@escola.eduflow.app',      color: 'bg-purple-50 border-purple-200 text-purple-700', emoji: '👩‍🏫' },
  { role: 'coordinator', label: 'Coordenador',  email: 'carlos@escola.eduflow.app',        color: 'bg-emerald-50 border-emerald-200 text-emerald-700', emoji: '📊' },
  { role: 'guardian',    label: 'Responsável',  email: 'fernanda.mendes@gmail.com',        color: 'bg-rose-50 border-rose-200 text-rose-700',     emoji: '👪' },
]

export function Login() {
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)
  const [email, setEmail] = useState('lucas@escola.eduflow.app')
  const [password, setPassword] = useState('••••••••')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')

  const handleLogin = async (role: UserRole = selectedRole, loginEmail = email) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    login(loginEmail, role)
    setLoading(false)

    if (role === 'student')       navigate('/student')
    else if (role === 'teacher')  navigate('/teacher')
    else if (role === 'admin')    navigate('/admin')
    else if (role === 'guardian') navigate('/guardian')
    else navigate('/coordinator')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#1e40af] to-[#1d4ed8] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-lg mb-4">
            <GraduationCap className="w-8 h-8 text-[#1E3A8A]" />
          </div>
          <h1 className="font-display font-bold text-white text-3xl tracking-tight">EduFlow</h1>
          <p className="text-blue-200 mt-1 text-sm">Plataforma educacional unificada</p>
          <div className="mt-1 text-xs text-blue-300">escola.eduflow.app</div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-modal p-8">
          <h2 className="font-display font-semibold text-[#0F172A] text-xl mb-6">Entrar na plataforma</h2>

          {/* Demo profiles */}
          <div className="mb-5">
            <p className="text-xs font-medium text-[#94A3B8] mb-2">Acesso rápido (demonstração)</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_PROFILES.map(p => (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(p.role)
                    setEmail(p.email)
                    handleLogin(p.role, p.email)
                  }}
                  className={clsx(
                    'flex items-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all hover:scale-[1.02]',
                    p.color
                  )}
                >
                  <span className="text-base">{p.emoji}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Admin access */}
            <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
              <p className="text-xs font-medium text-[#94A3B8] mb-2">Acesso administrativo</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin')
                  setEmail('admin@eduflow.app')
                  handleLogin('admin', 'admin@eduflow.app')
                }}
                className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg border bg-amber-50 border-amber-200 text-amber-800 text-xs font-medium transition-all hover:scale-[1.02] hover:bg-amber-100"
              >
                <span className="text-lg">🏫</span>
                <div className="text-left">
                  <p className="font-semibold">Coordenador do Site</p>
                  <p className="text-amber-600 text-[10px]">Gerenciar todas as escolas</p>
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-[#94A3B8]">ou entre com e-mail</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">E-mail institucional</label>
              <input
                type="email"
                className="input"
                placeholder="seu@escola.eduflow.app"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Sua senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[#E2E8F0] accent-[#1E3A8A]" />
                <span className="text-xs text-[#64748B]">Lembrar de mim</span>
              </label>
              <button type="button" className="text-xs text-[#1E3A8A] hover:underline">Esqueci a senha</button>
            </div>

            <button
              type="button"
              onClick={() => handleLogin(selectedRole, email)}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : 'Entrar'}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span className="text-xs text-[#94A3B8]">SSO</span>
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
          Problemas de acesso? Contate sua instituição
        </p>
      </div>
    </div>
  )
}
