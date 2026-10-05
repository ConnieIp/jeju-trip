import type { DaySchedule } from '../../data/types'
import { useAuth } from '../../auth/AuthContext'

interface DayTabsProps {
  days: DaySchedule[]
  activeDay: number
  onDayChange: (day: number) => void
}

function DayTabs({ days, activeDay, onDayChange }: DayTabsProps) {
  const { user } = useAuth()
  return (
    <div className="grid grid-cols-5 gap-2.5">
      {days.map(day => (
        <button
          key={day.day}
          onClick={() => onDayChange(day.day)}
          className={`flex flex-col text-left cursor-pointer h-[92px] px-[16px] py-[12px] border rounded-[14px] gap-[5px] transition-all ${
            activeDay === day.day
              ? 'border-teal-dark bg-teal-dark text-white'
              : 'border-border bg-card hover:border-ink/30'
          }`}
        >
          <small className={`text-[11px] font-bold uppercase ${activeDay === day.day ? 'text-amber' : 'text-muted'}`}>
            {activeDay === day.day ? (user ? `${day.weekday} · DAY ${day.day}` : `DAY ${day.day}`) : (user ? day.date : `DAY ${day.day}`)}
          </small>
          <b className="text-[20px] font-bold">Day {day.day}</b>
          {user && (
            <span className={`text-[11px] ${activeDay === day.day ? 'text-[#c9d7d9]' : 'text-muted-light'}`}>
              {day.weekday}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default DayTabs
