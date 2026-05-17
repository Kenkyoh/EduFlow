import { Users, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react'
import { Header } from '../../components/Header'
import { useClasses } from '../../hooks/useClasses'
import { useSearchStore } from '../../store/search'
import clsx from 'clsx'
import { useTranslation } from '../../i18n'

export function CoordinatorClassList() {
  const query = useSearchStore(s => s.query)
  const t = useTranslation()
  const { data: classes = [], isLoading, isError } = useClasses()

  const filtered = classes.filter(cls =>
    !query ||
    cls.name.toLowerCase().includes(query.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(query.toLowerCase()) ||
    cls.subjectName.toLowerCase().includes(query.toLowerCase())
  )

  const totalStudents = classes.reduce((acc, c) => acc + c.studentsCount, 0)
  const avgDelivery = classes.length
    ? Math.round(classes.reduce((acc, c) => acc + c.deliveryRate, 0) / classes.length)
    : 0
  const totalAtRisk = classes.reduce((acc, c) => acc + (c.atRisk ?? 0), 0)

  return (
    <>
      <Header title={t('coordinator.classList.title')} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <BookOpen size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">{t('coordinator.classList.totalClasses')}</p>
            <p className="text-xl font-display font-bold text-[#0F172A]">{classes.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Users size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">{t('coordinator.classList.totalStudents')}</p>
            <p className="text-xl font-display font-bold text-[#0F172A]">{totalStudents}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">{t('coordinator.classList.atRisk')}</p>
            <p className="text-xl font-display font-bold text-[#0F172A]">{totalAtRisk}</p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <span className="w-6 h-6 border-2 border-[#1E3A8A]/20 border-t-[#1E3A8A] rounded-full animate-spin" />
        </div>
      )}

      {isError && (
        <p className="text-center py-12 text-red-500 text-sm">Erro ao carregar turmas.</p>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(cls => (
            <div key={cls.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base"
                  style={{ backgroundColor: cls.color }}
                >
                  {cls.name.substring(0, 2)}
                </div>
                {(cls.atRisk ?? 0) > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    <AlertTriangle size={11} />
                    {t('coordinator.classList.atRiskBadge', { n: cls.atRisk })}
                  </span>
                )}
              </div>

              <h3 className="font-display font-semibold text-[#0F172A]">{cls.name}</h3>
              <p className="text-xs text-[#64748B] mt-0.5">{cls.subjectName}</p>
              <p className="text-xs text-[#94A3B8] mt-0.5 truncate">{cls.teacher}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{t('coordinator.classList.students', { n: cls.studentsCount })}</span>
                  </div>
                  {cls.average !== null && (
                    <div
                      className="flex items-center gap-1 font-medium"
                      style={{ color: (cls.average ?? 0) >= 7 ? '#059669' : (cls.average ?? 0) >= 5 ? '#D97706' : '#DC2626' }}
                    >
                      <TrendingUp size={12} />
                      <span>{t('coordinator.classList.average', { avg: (cls.average ?? 0).toFixed(1) })}</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#94A3B8]">{t('coordinator.classList.deliveryRate')}</span>
                    <span className={clsx('font-medium', {
                      'text-emerald-600': cls.deliveryRate >= 80,
                      'text-amber-600': cls.deliveryRate >= 60 && cls.deliveryRate < 80,
                      'text-red-600': cls.deliveryRate < 60,
                    })}>
                      {cls.deliveryRate}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${cls.deliveryRate}%`,
                        backgroundColor: cls.deliveryRate >= 80 ? '#059669' : cls.deliveryRate >= 60 ? '#D97706' : '#DC2626',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-[#94A3B8] text-sm">
              {t('coordinator.classList.noClassesFound', { query })}
            </div>
          )}
        </div>
      )}
    </>
  )
}
