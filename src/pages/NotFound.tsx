import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export function NotFound() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)

  const homeRoute = () => {
    if (!user) return '/login'
    if (user.role === 'student')     return '/student'
    if (user.role === 'teacher')     return '/teacher'
    if (user.role === 'admin')       return '/admin'
    if (user.role === 'guardian')    return '/guardian'
    return '/coordinator'
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">

        {/* SVG ilustração temática de educação */}
        <div className="flex justify-center mb-8">
          <svg
            width="260"
            height="200"
            viewBox="0 0 260 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Fundo sutil */}
            <ellipse cx="130" cy="180" rx="100" ry="14" fill="#E2E8F0" />

            {/* Pilha de livros */}
            {/* Livro de baixo — azul escuro */}
            <rect x="60" y="140" width="100" height="22" rx="4" fill="#1E3A8A" />
            <rect x="60" y="140" width="10" height="22" rx="2" fill="#1e40af" />
            <rect x="60" y="140" width="100" height="3" rx="1" fill="#1e40af" />

            {/* Livro do meio — roxo */}
            <rect x="65" y="120" width="94" height="22" rx="4" fill="#7C3AED" />
            <rect x="65" y="120" width="10" height="22" rx="2" fill="#6d28d9" />
            <rect x="65" y="120" width="94" height="3" rx="1" fill="#6d28d9" />

            {/* Livro de cima — verde */}
            <rect x="70" y="100" width="88" height="22" rx="4" fill="#059669" />
            <rect x="70" y="100" width="10" height="22" rx="2" fill="#047857" />
            <rect x="70" y="100" width="88" height="3" rx="1" fill="#047857" />

            {/* Lupa com "404" */}
            <circle cx="155" cy="72" r="38" fill="white" stroke="#E2E8F0" strokeWidth="3" />
            <circle cx="155" cy="72" r="30" fill="#EFF6FF" stroke="#1E3A8A" strokeWidth="3" />
            {/* Cabo da lupa */}
            <line x1="178" y1="95" x2="196" y2="114" stroke="#1E3A8A" strokeWidth="5" strokeLinecap="round" />

            {/* Texto 404 dentro da lupa */}
            <text
              x="155"
              y="78"
              textAnchor="middle"
              fontSize="22"
              fontWeight="bold"
              fill="#1E3A8A"
              fontFamily="system-ui, sans-serif"
            >
              404
            </text>

            {/* Estrelinha 1 */}
            <circle cx="48" cy="88" r="3" fill="#FCD34D" />
            {/* Estrelinha 2 */}
            <circle cx="38" cy="72" r="2" fill="#FCD34D" opacity="0.7" />
            {/* Estrelinha 3 */}
            <circle cx="58" cy="62" r="2.5" fill="#FCD34D" opacity="0.5" />

            {/* Ponto de interrogação flutuante */}
            <text
              x="205"
              y="52"
              fontSize="28"
              fontWeight="bold"
              fill="#1E3A8A"
              opacity="0.15"
              fontFamily="system-ui, sans-serif"
            >
              ?
            </text>
            <text
              x="32"
              y="118"
              fontSize="22"
              fontWeight="bold"
              fill="#7C3AED"
              opacity="0.12"
              fontFamily="system-ui, sans-serif"
            >
              ?
            </text>
          </svg>
        </div>

        {/* Mensagem */}
        <h1 className="font-display font-bold text-3xl text-[#0F172A] mb-3">
          Página não encontrada
        </h1>
        <p className="text-[#64748B] text-base leading-relaxed mb-8">
          Parece que essa página não existe ou foi movida.<br />
          Verifique o endereço ou volte ao início.
        </p>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate(homeRoute())}
            className="btn-primary px-8"
          >
            {user ? 'Ir para o início' : 'Ir para o login'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary px-8"
          >
            Voltar
          </button>
        </div>

        {/* URL com problema */}
        <p className="mt-8 text-xs text-[#94A3B8]">
          Código de erro: <span className="font-mono">404 Not Found</span>
        </p>
      </div>
    </div>
  )
}
