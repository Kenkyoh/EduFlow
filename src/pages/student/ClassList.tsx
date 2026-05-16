import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { mockSubjects, mockReportCardData } from '../../data/mock'
import { useSearchStore } from '../../store/search'
import { useTranslation } from '../../i18n'
import clsx from 'clsx'

export function StudentClassList() {
  const navigate = useNavigate()
  const t = useTranslation()
  const query = useSearchStore(s => s.query)

  const displayed = mockSubjects.slice(0, 5).filter(s =>
    !query ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.teacher.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <Header title={t('student.classList.title')} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.length === 0 ? (
          <p className="col-span-full text-center py-12 text-[#94A3B8] text-sm">
            {t('student.classList.noClassesFound', { query })}
          </p>
        ) : null}
        {displayed.map(s => {
          const reportData = mockReportCardData.find(r => r.subjectId === s.id)
          return (
            <button
              key={s.id}
              onClick={() => navigate(`/student/class/${s.id}`)}
              className="card p-5 text-left hover:shadow-md transition-shadow group"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: s.color }}
              >
                {s.name.substring(0, 2).toUpperCase()}
              </div>
              <h3 className="font-display font-semibold text-[#0F172A]">{s.name}</h3>
              <p className="text-sm text-[#64748B] mt-0.5">{s.teacher}</p>
              <p className="text-xs text-[#94A3B8] mt-1">{t('student.classList.period')}</p>
              {reportData && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">{t('student.classList.myAverage')}</span>
                  <span className={clsx(
                    'text-lg font-bold font-display',
                    reportData.average >= 6 ? 'text-emerald-600'
                    : reportData.average >= 4 ? 'text-amber-600'
                    : 'text-red-600'
                  )}>
                    {reportData.average.toFixed(1)}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </>
  )
}
