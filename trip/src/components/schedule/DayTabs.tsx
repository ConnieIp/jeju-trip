import type { DaySchedule } from '../../data/types'

interface DayTabsProps {
  days: DaySchedule[]
  activeDay: number
  onDayChange: (day: number) => void
}

function DayTabs({ days, activeDay, onDayChange }: DayTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {days.map(day => (
        <button
          key={day.day}
          onClick={() => onDayChange(day.day)}
          className={`flex flex-col p-3 border rounded-[10px] cursor-pointer min-w-[120px] transition-all ${
            activeDay === day.day
              ? 'border-ink bg-ink text-white'
              : 'border-border bg-card hover:border-ink/30'
          }`}
        >
          <small className={`text-[11px] ${activeDay === day.day ? 'text-white/70' : 'text-muted'}`}>
            {day.date}
          </small>
          <b className="text-sm font-semibold">Day {day.day}</b>
          <span className={`text-xs mt-1 ${activeDay === day.day ? 'opacity-70' : 'text-muted'}`}>
            {day.weekday}
          </span>
        </button>
      ))}
    </div>
  )
}

export default DayTabs
