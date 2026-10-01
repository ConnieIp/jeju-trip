import { useState } from 'react'
import { schedule } from '../data/schedule'
import { allSpots } from '../data/spots'
import TimelineRow from '../components/schedule/TimelineRow'
import RouteOverview from '../components/schedule/RouteOverview'
import LocalNote from '../components/schedule/LocalNote'
import BackupCard from '../components/schedule/BackupCard'

function SchedulePage() {
  const [activeDay, setActiveDay] = useState(1)
  const currentDay = schedule.days.find(d => d.day === activeDay) || schedule.days[0]

  return (
    <div className="mx-auto w-[min(1310px,100%-80px)] max-[980px]:w-[min(100%-36px,760px)] max-[640px]:w-[calc(100%-28px)]">
      <div className="pt-[46px] pb-[34px] px-8 max-[980px]:px-[18px] max-[640px]:px-[14px]">
        <div className="grid grid-cols-[1fr_auto] items-end gap-7 mb-6 max-[640px]:grid-cols-1 max-[640px]:pt-[30px]">
          <div>
            <div className="flex items-center gap-2 text-amber text-[12px] font-bold uppercase mb-3">
              <span className="w-[7px] h-[7px] bg-amber rounded-full inline-block" />
              FIVE DAYS AROUND THE ISLAND
            </div>
            <h1 className="text-[44px] font-extrabold tracking-[-1.5px] leading-[1.08] mb-6 max-w-[720px] max-[640px]:text-[34px]">
              A slow lap of Jeju, one coast at a time.
            </h1>
          </div>

          <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-[14px] max-[640px]:justify-self-stretch">
            <div className="w-[22px] h-[22px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5 text-[12px]">
              <div className="flex gap-2 items-center">
                <b className="font-bold">Mostly clear</b>
                <span className="text-[15px] font-bold">19°C</span>
              </div>
              <small className="text-muted text-[11px]">Sunrise 06:42 · Pack light</small>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2.5 max-[640px]:flex max-[640px]:overflow-x-auto">
          {schedule.days.map(day => (
            <button
              key={day.day}
              onClick={() => setActiveDay(day.day)}
              className={`flex flex-col text-left cursor-pointer h-[92px] px-[16px] py-[12px] border rounded-[14px] gap-[5px] transition-all max-[640px]:min-w-[150px] max-[640px]:flex-shrink-0 ${
                activeDay === day.day
                  ? 'border-teal-dark bg-teal-dark text-white'
                  : 'border-border bg-card hover:border-ink/30'
              }`}
            >
              <small className={`text-[11px] font-bold uppercase ${activeDay === day.day ? 'text-amber' : 'text-muted'}`}>
                {activeDay === day.day ? `${day.weekday} · DAY ${day.day}` : day.date}
              </small>
              <b className="text-[20px] font-bold">Day {day.day}</b>
              <span className={`text-[11px] ${activeDay === day.day ? 'text-[#c9d7d9]' : 'text-muted-light'}`}>
                {day.weekday}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-[34px] px-8 pb-[72px] max-[980px]:px-[18px] max-[980px]:grid-cols-1 max-[640px]:px-[14px] max-[640px]:gap-6">
        <div>
          <div className="flex justify-between items-center mb-7 max-[640px]:items-start max-[640px]:gap-3">
            <div>
              <h2 className="text-[28px] font-bold m-0 mb-[5px] max-[640px]:text-[22px]">{currentDay.title}</h2>
              <p className="text-muted text-[12px] m-0">{currentDay.route}</p>
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

        <div className="flex flex-col gap-[18px] max-[980px]:order-first max-[980px]:grid max-[980px]:grid-cols-2 max-[640px]:flex">
          <RouteOverview route={currentDay.route} stopCount={currentDay.stops.length} driveTime={currentDay.driveTime} distance={currentDay.distance} />
          <LocalNote />
          <BackupCard />
        </div>
      </div>
    </div>
  )
}

export default SchedulePage
