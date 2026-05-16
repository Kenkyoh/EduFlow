import { useNavigate } from 'react-router-dom'
import { Users, TrendingUp } from 'lucide-react'
import { Header } from '../../components/Header'
import { mockClasses } from '../../data/mock'
import { useSearchStore } from '../../store/search'
import clsx from 'clsx'
import { useTranslation } from '../../i18n'

export function TeacherClassList() {
  const navigate = useNavigate()
  const query = useSearchStore(s => s.query)
  const t = useTranslation()

  const displayed = mockClasses.filter(cls =>
    !query ||
    cls.name.toLowerCase().includes(query.toLowerCase()) ||
    cls.subjectName.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <Header title={t('teacher.classList.title')} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.length === 0 && (
          <p className="col-span-full text-center py-12 text-[#94A3B8] text-sm">
            {t('teacher.classList.noClassesFound', { query })}
          </p>
        )}
        {displayed.map(cls => (
          <button
            key={cls.id}
            onClick={() => navigate(`/teacher/class/${cls.id}`)}
            className="card p-5 text-left hover:shadow-md transition-shadow group"
          >
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
                    backgroundColor: (cls.deliveryRate ?? 0) >= 80 ? '#059669' : (cls.deliveryRate ?? 0) >= 60 ? '#D97706' : '#DC2626',
                  }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}
