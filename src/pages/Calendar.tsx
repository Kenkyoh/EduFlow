import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Clock, BookOpen } from 'lucide-react'
import { Header } from '../components/Header'
import { ActivityDrawer } from '../components/ActivityDrawer'
import { toast } from '../components/Toast'
import { mockCalendarEvents, mockSubjects, getActivityTypeLabel } from '../data/mock'
import { useAuthStore } from '../store/auth'
import type { CalendarEvent } from '../types'
import clsx from 'clsx'

type ViewMode = 'month' | 'week' | 'agenda'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const TYPE_ICONS: Record<string, string> = {
  prova: '📝',
  trabalho: '📁',
  apresentacao: '🎤',
  leitura: '📖',
  aula_ao_vivo: '🎥',
  outro: '📌',
}

function EventDetailDrawer({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="text-xl">{TYPE_ICONS[event.type]}</span>
            <div>
              <h2 className="font-display font-semibold text-[#0F172A]">{event.title}</h2>
              <p className="text-xs text-[#64748B]">{getActivityTypeLabel(event.type)}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#64748B]">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
            <span className="text-sm font-medium" style={{ color: event.color }}>{event.subjectName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <Clock size={14} />
            <span>{new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          {event.description && (
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <p className="text-sm text-[#64748B]">{event.description}</p>
            </div>
          )}
          <div className="pt-4 border-t border-[#E2E8F0]">
            <button type="button" className="btn-primary w-full" onClick={onClose}>Ver atividade completa</button>
          </div>
        </div>
      </div>
    </>
  )
}

export function CalendarPage() {
  const user = useAuthStore(s => s.user)
  const isTeacher = user?.role === 'teacher' || user?.role === 'coordinator'

  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(mockSubjects.map(s => s.id))
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerDate, setDrawerDate] = useState<string | undefined>()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const goToPrev = () => {
    const d = new Date(currentDate)
    if (viewMode === 'month') d.setMonth(d.getMonth() - 1)
    else d.setDate(d.getDate() - 7)
    setCurrentDate(d)
  }

  const goToNext = () => {
    const d = new Date(currentDate)
    if (viewMode === 'month') d.setMonth(d.getMonth() + 1)
    else d.setDate(d.getDate() + 7)
    setCurrentDate(d)
  }

  const filteredEvents = mockCalendarEvents.filter(e => selectedSubjects.includes(e.subjectId))

  const getEventsForDate = (dateStr: string) =>
    filteredEvents.filter(e => e.date === dateStr)

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const todayStr = new Date().toISOString().split('T')[0]

  const handleDayClick = (dateStr: string) => {
    if (isTeacher) {
      setDrawerDate(dateStr)
      setDrawerOpen(true)
    }
  }

  const renderMonthView = () => {
    const cells: (number | null)[] = [
      ...Array(startPad).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
    while (cells.length % 7 !== 0) cells.push(null)

    const weeks: (number | null)[][] = []
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

    return (
      <div className="card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-[#E2E8F0]">
          {WEEKDAYS.map(d => (
            <div key={d} className="py-2 text-center text-xs font-medium text-[#94A3B8]">{d}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-[#E2E8F0] last:border-0">
            {week.map((day, di) => {
              if (!day) return <div key={di} className="p-1 md:p-2 min-h-[56px] md:min-h-[90px] bg-[#F8FAFC]" />

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayEvents = getEventsForDate(dateStr)
              const isToday = dateStr === todayStr
              const isWeekend = di === 0 || di === 6

              const heatCount = dayEvents.length
              const heatColor = heatCount === 0 ? 'transparent'
                : heatCount === 1 ? '#D1FAE5'
                : heatCount <= 3 ? '#FDE68A'
                : '#FECACA'

              return (
                <div
                  key={di}
                  className={clsx(
                    'p-1 md:p-1.5 min-h-[56px] md:min-h-[90px] border-r border-[#E2E8F0] last:border-r-0',
                    isWeekend && 'bg-[#F8FAFC]',
                    isTeacher && 'cursor-pointer hover:bg-blue-50/30 transition-colors'
                  )}
                  onClick={() => handleDayClick(dateStr)}
                >
                  {heatCount > 0 && (
                    <div className="h-1 rounded-full mb-1" style={{ backgroundColor: heatColor }} />
                  )}
                  <div className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1',
                    isToday ? 'bg-[#1E3A8A] text-white' : 'text-[#64748B]'
                  )}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map(ev => (
                      <button
                        key={ev.id}
                        onClick={e => { e.stopPropagation(); setSelectedEvent(ev) }}
                        className="calendar-event-pill w-full text-left"
                        style={{ backgroundColor: ev.colorLight, color: ev.color }}
                        title={ev.title}
                      >
                        <span className="md:hidden">{TYPE_ICONS[ev.type]}</span>
                        <span className="hidden md:inline">{TYPE_ICONS[ev.type]} {ev.title}</span>
                      </button>
                    ))}
                    {dayEvents.length > 3 && (
                      <p className="text-[10px] text-[#94A3B8] pl-1">+{dayEvents.length - 3} mais</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  const renderAgendaView = () => {
    const sorted = [...filteredEvents].sort((a, b) => a.date.localeCompare(b.date))
    const grouped = sorted.reduce((acc, ev) => {
      if (!acc[ev.date]) acc[ev.date] = []
      acc[ev.date].push(ev)
      return acc
    }, {} as Record<string, CalendarEvent[]>)

    if (Object.keys(grouped).length === 0) {
      return (
        <div className="card p-12 flex flex-col items-center gap-3 text-[#94A3B8]">
          <BookOpen size={36} strokeWidth={1.5} />
          <p className="font-medium">Nenhum evento encontrado</p>
          {isTeacher && (
            <button type="button" onClick={() => setDrawerOpen(true)} className="btn-primary text-sm">
              Criar primeira atividade
            </button>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {Object.entries(grouped).map(([date, events]) => {
          const d = new Date(date + 'T12:00:00')
          const isToday = date === todayStr
          return (
            <div key={date} className="card overflow-hidden">
              <div className={clsx('px-4 py-2.5 border-b border-[#E2E8F0]', isToday ? 'bg-[#1E3A8A]' : 'bg-[#F8FAFC]')}>
                <p className={clsx('text-sm font-semibold', isToday ? 'text-white' : 'text-[#0F172A]')}>
                  {d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  {isToday && <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">Hoje</span>}
                </p>
              </div>
              {events.map(ev => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => setSelectedEvent(ev)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0 text-left"
                >
                  <span className="text-xl">{TYPE_ICONS[ev.type]}</span>
                  <span className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: ev.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F172A] truncate">{ev.title}</p>
                    <p className="text-xs text-[#64748B]">{ev.subjectName} · {getActivityTypeLabel(ev.type)}</p>
                  </div>
                </button>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <Header
        title="Calendário"
        actions={
          isTeacher ? (
            <button type="button" onClick={() => setDrawerOpen(true)} className="btn-primary text-sm">
              <Plus size={16} /> Nova atividade
            </button>
          ) : undefined
        }
      />

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Sidebar filters — desktop only */}
        <div className="hidden md:block w-48 flex-shrink-0 space-y-4">
          <div className="card p-3">
            <p className="text-xs font-semibold text-[#64748B] mb-2">Disciplinas</p>
            <div className="space-y-1.5">
              {mockSubjects.map(s => (
                <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedSubjects.includes(s.id)}
                    onChange={e => {
                      setSelectedSubjects(prev =>
                        e.target.checked ? [...prev, s.id] : prev.filter(id => id !== s.id)
                      )
                    }}
                    style={{ accentColor: s.color }}
                  />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-xs text-[#0F172A]">{s.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="card p-3">
            <p className="text-xs font-semibold text-[#64748B] mb-2">Densidade de carga</p>
            <div className="space-y-1.5 text-[11px] text-[#64748B]">
              <div className="flex items-center gap-2"><span className="w-4 h-1.5 rounded-full bg-emerald-200" />1 atividade</div>
              <div className="flex items-center gap-2"><span className="w-4 h-1.5 rounded-full bg-amber-300" />2–3 atividades</div>
              <div className="flex items-center gap-2"><span className="w-4 h-1.5 rounded-full bg-red-300" />4+ atividades</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast('Exportando calendário .ics...')}
            className="btn-secondary w-full text-xs"
          >
            Exportar .ics
          </button>
        </div>

        {/* Main */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <button type="button" onClick={goToPrev} aria-label="Mês anterior" className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center hover:bg-slate-100 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <h2 className="font-display font-semibold text-[#0F172A] min-w-[140px] md:min-w-[180px] text-center text-sm md:text-base">
                {MONTHS[month]} {year}
              </h2>
              <button type="button" onClick={goToNext} aria-label="Próximo mês" className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center hover:bg-slate-100 transition-colors">
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-xs border border-[#E2E8F0] rounded-lg hover:bg-slate-100 transition-colors text-[#64748B]"
              >
                Hoje
              </button>
            </div>
            <div className="flex rounded-lg border border-[#E2E8F0] overflow-hidden">
              {(['month', 'week', 'agenda'] as ViewMode[]).map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setViewMode(v)}
                  className={clsx(
                    'px-2.5 md:px-3 py-1.5 text-xs font-medium transition-colors',
                    viewMode === v ? 'bg-[#1E3A8A] text-white' : 'bg-white text-[#64748B] hover:bg-slate-50'
                  )}
                >
                  {v === 'month' ? 'Mês' : v === 'week' ? 'Semana' : 'Agenda'}
                </button>
              ))}
            </div>
          </div>

          {viewMode === 'agenda' ? renderAgendaView() : renderMonthView()}
        </div>
      </div>

      {selectedEvent && (
        <EventDetailDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {isTeacher && (
        <ActivityDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          initialDate={drawerDate}
        />
      )}
    </>
  )
}
