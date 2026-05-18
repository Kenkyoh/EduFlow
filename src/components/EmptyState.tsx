import clsx from 'clsx'

function SvgSearch() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="18" y="12" width="52" height="66" rx="5" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
      <path d="M58 12 L70 24 L58 24 Z" fill="#BFDBFE" />
      <line x1="58" y1="12" x2="70" y2="24" stroke="#BFDBFE" strokeWidth="1.5" />
      <line x1="30" y1="36" x2="54" y2="36" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="47" x2="54" y2="47" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="58" x2="44" y2="58" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" />
      <circle cx="68" cy="68" r="18" fill="white" stroke="#93C5FD" strokeWidth="2" />
      <line x1="81" y1="81" x2="93" y2="93" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
      <text x="68" y="75" textAnchor="middle" fill="#93C5FD" fontSize="16" fontFamily="ui-sans-serif,sans-serif" fontWeight="700">?</text>
    </svg>
  )
}

function SvgDone() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="15" y="72" width="68" height="14" rx="4" fill="#BFDBFE" />
      <rect x="20" y="57" width="58" height="13" rx="4" fill="#93C5FD" />
      <rect x="25" y="43" width="48" height="13" rx="4" fill="#60A5FA" />
      <circle cx="72" cy="28" r="18" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="2" />
      <path d="M63 28 L70 35 L82 20" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="32" r="3" fill="#FEF3C7" />
      <circle cx="33" cy="22" r="2" fill="#FDE68A" />
      <path d="M14 22 L16 18 L18 22 Z" fill="#93C5FD" />
    </svg>
  )
}

function SvgStudents() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <polygon points="50,18 82,32 50,46 18,32" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
      <rect x="77" y="32" width="3" height="16" rx="1.5" fill="#93C5FD" />
      <circle cx="78.5" cy="50" r="3.5" fill="#60A5FA" />
      <circle cx="34" cy="66" r="9" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M19 90 Q34 79 49 90" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 2" fill="none" strokeLinecap="round" />
      <circle cx="66" cy="66" r="9" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M51 90 Q66 79 81 90" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

const SVGS = { search: SvgSearch, done: SvgDone, students: SvgStudents }

type Variant = 'search' | 'done' | 'students'

interface EmptyStateProps {
  variant?: Variant
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  asCard?: boolean
  className?: string
}

export function EmptyState({
  variant = 'search',
  title,
  description,
  action,
  asCard = true,
  className,
}: EmptyStateProps) {
  const Illustration = SVGS[variant]
  const sizeClass = asCard ? 'w-28 h-28' : 'w-20 h-20'
  const paddingClass = asCard ? 'py-14 px-8' : 'py-8 px-6'

  const content = (
    <>
      <div className={sizeClass}>
        <Illustration />
      </div>
      <div className="space-y-1 text-center">
        <p className="font-display font-semibold text-[#0F172A]">{title}</p>
        {description && <p className="text-sm text-[#64748B] max-w-xs">{description}</p>}
      </div>
      {action && (
        <button type="button" onClick={action.onClick} className="btn-secondary text-sm mt-1">
          {action.label}
        </button>
      )}
    </>
  )

  if (asCard) {
    return (
      <div className={clsx('card flex flex-col items-center gap-4', paddingClass, className)}>
        {content}
      </div>
    )
  }

  return (
    <div className={clsx('flex flex-col items-center gap-3', paddingClass, className)}>
      {content}
    </div>
  )
}
