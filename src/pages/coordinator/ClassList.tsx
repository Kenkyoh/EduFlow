import { useState } from 'react'
import { Users, TrendingUp, AlertTriangle, Search, BookOpen } from 'lucide-react'
import { Header } from '../../components/Header'
import { mockCoordinatorClasses } from '../../data/mock'
import clsx from 'clsx'

export function CoordinatorClassList() {
  const [search, setSearch] = useState('')

  const filtered = mockCoordinatorClasses.filter(cls =>
    cls.name.toLowerCase().includes(search.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(search.toLowerCase()) ||
    cls.subject.toLowerCase().includes(search.toLowerCase())
  )

  const totalStudents = mockCoordinatorClasses.reduce((acc, c) => acc + c.studentsCount, 0)
  const avgDelivery = Math.round(
    mockCoordinatorClasses.reduce((acc, c) => acc + c.deliveryRate, 0) / mockCoordinatorClasses.length
  )
  const totalAtRisk = mockCoordinatorClasses.reduce((acc, c) => acc + c.atRisk, 0)

  return (
    <>
      <Header title="Turmas" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <BookOpen size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Total de Turmas</p>
            <p className="text-xl font-display font-bold text-[#0F172A]">{mockCoordinatorClasses.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Users size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Total de Alunos</p>
            <p className="text-xl font-display font-bold text-[#0F172A]">{totalStudents}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Alunos em Risco</p>
            <p className="text-xl font-display font-bold text-[#0F172A]">{totalAtRisk}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Buscar por turma, professor ou disciplina..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
        />
      </div>

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
              {cls.atRisk > 0 && (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle size={11} />
                  {cls.atRisk} em risco
                </span>
              )}
            </div>

            <h3 className="font-display font-semibold text-[#0F172A]">{cls.name}</h3>
            <p className="text-xs text-[#64748B] mt-0.5">{cls.subject}</p>
            <p className="text-xs text-[#94A3B8] mt-0.5 truncate">{cls.teacher}</p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{cls.studentsCount} alunos</span>
                </div>
                <div className="flex items-center gap-1 font-medium" style={{ color: cls.average >= 7 ? '#059669' : cls.average >= 5 ? '#D97706' : '#DC2626' }}>
                  <TrendingUp size={12} />
                  <span>Média {cls.average.toFixed(1)}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#94A3B8]">Taxa de entrega</span>
                  <span
                    className={clsx('font-medium', {
                      'text-emerald-600': cls.deliveryRate >= 80,
                      'text-amber-600': cls.deliveryRate >= 60 && cls.deliveryRate < 80,
                      'text-red-600': cls.deliveryRate < 60,
                    })}
                  >
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
            Nenhuma turma encontrada para "{search}"
          </div>
        )}
      </div>
    </>
  )
}
