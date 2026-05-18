import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { useClasses } from '../../hooks/useClasses'
import { useSearchStore } from '../../store/search'
import { useTranslation } from '../../i18n'
import { SkClassGrid } from '../../components/Skeleton'
import clsx from 'clsx'

export function StudentClassList() {
  const navigate = useNavigate()
  const t = useTranslation()
  const query = useSearchStore(s => s.query)
  const { data: classes = [], isLoading, isError } = useClasses()

  const displayed = classes.filter(cls =>
    !query ||
    cls.name.toLowerCase().includes(query.toLowerCase()) ||
    cls.subjectName.toLowerCase().includes(query.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <Header title={t('student.classList.title')} />

      {isLoading && <SkClassGrid count={6} />}

      {isError && (
        <p className="text-center py-12 text-red-500 text-sm">Erro ao carregar turmas.</p>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.length === 0 && (
            <p className="col-span-full text-center py-12 text-[#94A3B8] text-sm">
              {t('student.classList.noClassesFound', { query })}
            </p>
          )}
          {displayed.map(cls => (
            <button
              key={cls.id}
              onClick={() => navigate(`/student/class/${cls.id}`)}
              className="card p-5 text-left hover:shadow-md transition-shadow group"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: cls.color }}
              >
                {cls.subjectName.substring(0, 2).toUpperCase()}
              </div>
              <h3 className="font-display font-semibold text-[#0F172A]">{cls.subjectName}</h3>
              <p className="text-sm text-[#64748B] mt-0.5">{cls.teacher}</p>
              <p className="text-xs text-[#94A3B8] mt-1">{cls.period}</p>
              {cls.average !== null && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">{t('student.classList.myAverage')}</span>
                  <span className={clsx(
                    'text-lg font-bold font-display',
                    cls.average >= 6 ? 'text-emerald-600'
                    : cls.average >= 4 ? 'text-amber-600'
                    : 'text-red-600'
                  )}>
                    {cls.average.toFixed(1)}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
