import { useNavigate } from 'react-router-dom'
import { Users, TrendingUp } from 'lucide-react'
import { Header } from '../../components/Header'
import { useClasses } from '../../hooks/useClasses'
import { useSearchStore } from '../../store/search'
import { useTranslation } from '../../i18n'
import { SkClassGrid } from '../../components/Skeleton'
import { EmptyState } from '../../components/EmptyState'

export function TeacherClassList() {
  const navigate = useNavigate()
  const { query, setQuery } = useSearchStore()
  const t = useTranslation()
  const { data: classes = [], isLoading, isError } = useClasses()

  const displayed = classes.filter(cls =>
    !query ||
    cls.name.toLowerCase().includes(query.toLowerCase()) ||
    cls.subjectName.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <Header title={t('teacher.classList.title')} />

      {isLoading && <SkClassGrid count={4} />}

      {isError && (
        <p className="text-center py-12 text-red-500 text-sm">Erro ao carregar turmas.</p>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                variant="search"
                title={query ? t('teacher.classList.noClassesFound', { query }) : t('common.noResults')}
                action={query ? { label: t('common.clearSearch'), onClick: () => setQuery('') } : undefined}
              />
            </div>
          )}
          {displayed.map(cls => (
            <button
              key={cls.id}
              onClick={() => navigate(`/teacher/class/${cls.id}`)}
              className="card p-5 text-left hover:-translate-y-0.5 hover:shadow-md transition-all group overflow-hidden relative"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ backgroundColor: cls.color }}
              />
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: cls.color }}
              >
                {cls.name.substring(0, 2)}
              </div>
              <h3 className="font-display font-semibold text-[#0F172A]">{cls.name}</h3>
              <p className="text-sm text-[#64748B] mt-0.5">{cls.subjectName}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <Users size={13} />
                  <span>{t('teacher.classList.students', { n: cls.studentsCount })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <TrendingUp size={13} />
                  <span>{cls.deliveryRate}% {t('teacher.classList.delivery')}</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${cls.deliveryRate}%`,
                      backgroundColor: cls.deliveryRate >= 80 ? '#059669' : cls.deliveryRate >= 60 ? '#D97706' : '#DC2626',
                    }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
