import { useState } from 'react'
import { schedule } from '../data/schedule'
import { allSpots } from '../data/spots'
import DayTabs from '../components/schedule/DayTabs'
import TimelineRow from '../components/schedule/TimelineRow'
import RouteOverview from '../components/schedule/RouteOverview'
import LocalNote from '../components/schedule/LocalNote'
import BackupCard from '../components/schedule/BackupCard'

function SchedulePage() {
  const [activeDay, setActiveDay] = useState(1)
  const currentDay = schedule.days.find(d => d.day === activeDay) || schedule.days[0]

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="px-8 py-12">
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-muted text-[13px] mb-2">
            <span>Five days around the island</span>
          </div>
          <h1 className="text-[42px] font-extrabold tracking-tight leading-tight mb-6">
            A slow lap of Jeju, one coast at a time.
          </h1>

          <div className="flex items-center gap-2.5 p-3 bg-card rounded-[10px] mb-6 w-fit">
            <div className="w-6 h-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <b className="text-sm">Mostly clear</b>
            <span className="text-lg font-bold">19°C</span>
            <small className="text-muted text-xs ml-2">Sunrise 06:42</small>
          </div>

          <DayTabs days={schedule.days} activeDay={activeDay} onDayChange={setActiveDay} />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-8 px-8 pb-12 max-xl:grid-cols-1">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-[22px] font-bold">{currentDay.title}</h2>
              <p className="text-muted text-sm mt-1">{currentDay.route}</p>
            </div>
          </div>

          <div>
            {currentDay.stops.map((stop, idx) => {
              const spot = allSpots.find(s =>
                stop.title.toLowerCase().includes(s.name.toLowerCase()) ||
                s.name.toLowerCase().includes(stop.title.toLowerCase().split(' ')[0])
              )

              return (
                <TimelineRow
                  key={idx}
                  stop={stop}
                  spot={spot}
                  isLast={idx === currentDay.stops.length - 1}
                />
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4 max-xl:order-first">
          <RouteOverview route={currentDay.route} stopCount={currentDay.stops.length} />
          <LocalNote />
          <BackupCard />
        </div>
      </div>
    </div>
  )
}

export default SchedulePage
