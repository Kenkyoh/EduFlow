import clsx from 'clsx'

// ─── bloco base ───────────────────────────────────────────────────────────────
function Sk({ className }: { className?: string }) {
  return <div className={clsx('bg-[#E2E8F0] animate-pulse rounded', className)} />
}

// ─── peças atômicas ───────────────────────────────────────────────────────────

export function SkKpiCard() {
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between mb-3">
        <Sk className="h-3 w-24" />
        <Sk className="h-8 w-8 rounded-lg" />
      </div>
      <Sk className="h-8 w-20 mb-2 rounded-md" />
      <Sk className="h-3 w-28" />
    </div>
  )
}

export function SkKpiRow({ cols = 4 }: { cols?: 2 | 4 }) {
  return (
    <div className={clsx('grid gap-4', cols === 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2')}>
      {Array.from({ length: cols }).map((_, i) => <SkKpiCard key={i} />)}
    </div>
  )
}

export function SkClassCard() {
  return (
    <div className="card p-5">
      <Sk className="h-12 w-12 rounded-xl mb-4" />
      <Sk className="h-5 w-3/4 mb-1.5 rounded-md" />
      <Sk className="h-3 w-1/2 mb-4" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <Sk className="h-3 w-20" />
          <Sk className="h-3 w-8" />
        </div>
        <Sk className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  )
}

export function SkActivityRow() {
  return (
    <div className="activity-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Sk className="h-5 w-20 rounded-full" />
            <Sk className="h-5 w-14 rounded-full" />
          </div>
          <Sk className="h-4 w-3/4 rounded-md" />
          <Sk className="h-3 w-1/2" />
        </div>
        <Sk className="h-6 w-16 rounded-full flex-shrink-0" />
      </div>
    </div>
  )
}

export function SkListItem() {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <Sk className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Sk className="h-4 w-40 rounded-md" />
          <Sk className="h-3 w-56" />
        </div>
        <Sk className="h-5 w-20 rounded-full flex-shrink-0" />
      </div>
    </div>
  )
}

export function SkSubjectRow() {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <Sk className="h-2.5 w-2.5 rounded-full flex-shrink-0" />
      <Sk className="h-3 flex-1" />
      <Sk className="h-4 w-10 rounded-md" />
      <Sk className="h-5 w-28 rounded-full" />
    </div>
  )
}

export function SkClassGrid({ count = 6, cols = 3 }: { count?: number; cols?: 3 | 4 }) {
  return (
    <div className={clsx('grid gap-4', cols === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')}>
      {Array.from({ length: count }).map((_, i) => <SkClassCard key={i} />)}
    </div>
  )
}

// ─── dashboards compostos ─────────────────────────────────────────────────────

export function SkStudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome bar */}
      <Sk className="h-24 w-full rounded-xl" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna esquerda */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <Sk className="h-5 w-48 rounded-md" />
            <Sk className="h-4 w-20" />
          </div>
          {[0, 1, 2].map(i => <SkActivityRow key={i} />)}

          <Sk className="h-5 w-40 rounded-md mt-2" />
          {[0, 1].map(i => (
            <div key={i} className="card p-4 space-y-2">
              <Sk className="h-4 w-3/4 rounded-md" />
              <Sk className="h-3 w-full" />
              <Sk className="h-3 w-2/3" />
            </div>
          ))}
        </div>

        {/* Coluna direita */}
        <div className="space-y-4">
          {/* Notas recentes */}
          <div className="card p-4 space-y-3">
            <Sk className="h-4 w-32 rounded-md" />
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-2">
                <Sk className="h-7 w-7 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <Sk className="h-3 w-24" />
                  <Sk className="h-2.5 w-16" />
                </div>
                <Sk className="h-5 w-8 rounded-md" />
              </div>
            ))}
          </div>

          {/* Progresso por disciplina */}
          <div className="card p-4 space-y-3">
            <Sk className="h-4 w-36 rounded-md" />
            {[0, 1, 2].map(i => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <Sk className="h-3 w-24" />
                  <Sk className="h-3 w-8" />
                </div>
                <Sk className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>

          {/* Acesso rápido */}
          <div className="card p-4">
            <Sk className="h-4 w-32 rounded-md mb-3" />
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map(i => <Sk key={i} className="h-16 rounded-lg" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkTeacherDashboard() {
  return (
    <div className="space-y-6">
      <SkKpiRow />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <Sk className="h-5 w-48 rounded-md" />
            <Sk className="h-6 w-24 rounded-full" />
          </div>
          {[0, 1, 2].map(i => <SkListItem key={i} />)}

          <Sk className="h-5 w-44 rounded-md mt-4" />
          {[0, 1, 2].map(i => <SkListItem key={`c${i}`} />)}
        </div>

        <div className="space-y-4">
          <div className="card p-4 space-y-3">
            <Sk className="h-4 w-28 rounded-md" />
            {[0, 1, 2].map(i => (
              <div key={i} className="flex gap-2.5">
                <Sk className="h-7 w-7 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <Sk className="h-3 w-32" />
                  <Sk className="h-2.5 w-48" />
                </div>
              </div>
            ))}
          </div>
          <div className="card p-4 space-y-3">
            <Sk className="h-4 w-40 rounded-md" />
            {[0, 1, 2].map(i => (
              <div key={i} className="flex gap-2.5 py-1.5">
                <Sk className="h-2 w-2 rounded-full flex-shrink-0 mt-1" />
                <div className="flex-1 space-y-1">
                  <Sk className="h-3 w-36" />
                  <Sk className="h-2.5 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkCoordinatorDashboard() {
  return (
    <div className="space-y-6">
      <SkKpiRow />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5 space-y-3">
          <Sk className="h-5 w-44 rounded-md" />
          <Sk className="h-48 w-full rounded-lg" />
        </div>
        <div className="card p-5 space-y-3">
          <Sk className="h-5 w-44 rounded-md" />
          <Sk className="h-48 w-full rounded-lg" />
        </div>
      </div>

      <div className="card">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
          <Sk className="h-5 w-40 rounded-md" />
          <Sk className="h-6 w-24 rounded-full" />
        </div>
        <div className="p-5 space-y-3">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4">
              <Sk className="h-7 w-7 rounded-full flex-shrink-0" />
              <Sk className="h-4 flex-1 max-w-[160px]" />
              <Sk className="h-4 w-20" />
              <Sk className="h-4 w-16" />
              <Sk className="h-4 w-24 ml-auto" />
            </div>
          ))}
        </div>
      </div>

      <SkKpiRow />
    </div>
  )
}

export function SkGuardianDashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Sk className="h-8 w-64 rounded-md" />
        <Sk className="h-4 w-48" />
      </div>

      <div className="card p-5 space-y-5">
        {/* Cabeçalho do aluno */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sk className="h-12 w-12 rounded-2xl flex-shrink-0" />
            <div className="space-y-1.5">
              <Sk className="h-5 w-40 rounded-md" />
              <Sk className="h-3 w-28" />
            </div>
          </div>
          <Sk className="h-4 w-28" />
        </div>

        {/* KPI strip */}
        <div className="pt-5 border-t border-[#F1F5F9]">
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <Sk className="h-8 w-8 rounded-lg" />
                <Sk className="h-7 w-12 rounded-md" />
                <Sk className="h-2.5 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <Sk className="h-4 w-40 rounded-md" />
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {[0, 1, 2, 3, 4].map(i => <SkSubjectRow key={i} />)}
          </div>
        </div>
        <div className="card">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <Sk className="h-4 w-36 rounded-md" />
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex items-start gap-3 px-5 py-3">
                <Sk className="h-8 w-8 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <Sk className="h-3 w-40" />
                  <Sk className="h-2.5 w-28" />
                </div>
                <Sk className="h-2.5 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Sk className="h-8 w-56 rounded-md" />
          <Sk className="h-4 w-40" />
        </div>
        <Sk className="h-9 w-36 rounded-lg" />
      </div>

      <SkKpiRow />

      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
          <div className="space-y-1">
            <Sk className="h-5 w-40 rounded-md" />
            <Sk className="h-3 w-56" />
          </div>
          <Sk className="h-4 w-24" />
        </div>
        <div className="divide-y divide-[#F1F5F9]">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <Sk className="h-10 w-10 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Sk className="h-4 w-48 rounded-md" />
                <Sk className="h-3 w-36" />
              </div>
              <div className="flex gap-2">
                <Sk className="h-5 w-16 rounded-full" />
                <Sk className="h-5 w-14 rounded-full" />
              </div>
              <Sk className="h-4 w-4 rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map(i => (
          <div key={i} className="card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sk className="h-4 w-4" />
              <Sk className="h-4 w-32 rounded-md" />
            </div>
            <div className="space-y-2">
              {[0, 1, 2].map(j => (
                <div key={j} className="flex justify-between items-center">
                  <Sk className="h-3 w-20" />
                  <Sk className="h-4 w-8 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
