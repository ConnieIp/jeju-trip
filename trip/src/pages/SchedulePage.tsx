import { useState, useMemo } from 'react'
import { useSpots } from '../data/SpotsProvider'
import { useSchedule } from '../data/ScheduleProvider'
import { useWeather } from '../hooks/useWeather'
import TimelineRow from '../components/schedule/TimelineRow'
import RouteOverview from '../components/schedule/RouteOverview'
import LocalNote from '../components/schedule/LocalNote'
import BackupCard from '../components/schedule/BackupCard'

function getWeatherIcon(weather: string): string {
  const icons: Record<string, string> = {
    'sunny': '☀️',
    'mostly_sunny': '🌤️',
    'partly_sunny': '⛅',
    'mostly_cloudy': '🌥️',
    'cloudy': '☁️',
    'rain': '🌧️',
    'light_rain': '🌦️',
    'thunderstorm': '⛈️',
    'snow': '🌨️',
  }
  return icons[weather] || '🌤️'
}

function SchedulePage() {
  const { spots } = useSpots()
  const { schedule, loading } = useSchedule()
  const [activeDay, setActiveDay] = useState(1)

  const tripDates = useMemo(() => {
    if (!schedule) return []
    return schedule.days.map(d => {
      const [month, day] = d.date.split('/')
      return `2026-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    })
  }, [schedule])

  const { weather, todayWeather, loading: weatherLoading } = useWeather(tripDates)

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-muted text-[14px]">Loading schedule…</p>
    </div>
  )

  if (!schedule) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-muted text-[14px]">No schedule available.</p>
    </div>
  )

  const currentDay = schedule.days.find(d => d.day === activeDay) || schedule.days[0]
  const [currentMonth, currentDayNum] = currentDay.date.split('/')
  const currentDateStr = `2026-${currentMonth.padStart(2, '0')}-${currentDayNum.padStart(2, '0')}`
  const currentWeather = weather[currentDateStr]
  const displayWeather = currentWeather || todayWeather
  const hasTripForecast = !!currentWeather

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
            {weatherLoading ? (
              <div className="flex flex-col gap-0.5 text-[12px]">
                <span className="text-muted text-[12px]">Loading weather…</span>
              </div>
            ) : displayWeather ? (
              <>
                <div className="w-[22px] h-[22px] flex items-center justify-center text-[18px]">
                  {getWeatherIcon(displayWeather.weather)}
                </div>
                <div className="flex flex-col gap-0.5 text-[12px]">
                  <div className="flex gap-2 items-center">
                    <b className="font-bold">{displayWeather.weather.replace(/_/g, ' ')}</b>
                    <span className="text-[15px] font-bold">{Math.round(displayWeather.temperatureMax)}°C</span>
                  </div>
                  <small className="text-muted text-[11px]">
                    {Math.round(displayWeather.temperatureMin)}°C – {Math.round(displayWeather.temperatureMax)}°C
                    {displayWeather.precipitationType !== 'none' && ` · ${displayWeather.precipitationType}`}
                  </small>
                  <small className={`text-[10px] font-medium mt-0.5 ${hasTripForecast ? 'text-teal-dark' : 'text-amber'}`}>
                    {hasTripForecast ? 'Forecast' : "Today's weather · Forecast not yet available"}
                  </small>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-0.5 text-[12px]">
                <small className="text-muted text-[11px]">Weather forecast not yet available</small>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2.5 max-[640px]:flex max-[640px]:overflow-x-auto">
          {schedule.days.map(day => {
            const [month, dayNum] = day.date.split('/')
            const dateStr = `2026-${month.padStart(2, '0')}-${dayNum.padStart(2, '0')}`
            const dayWeather = weather[dateStr]

            return (
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
                <div className="flex items-center justify-between">
                  <b className="text-[20px] font-bold">Day {day.day}</b>
                  {dayWeather && (
                    <span className="text-[16px]">{getWeatherIcon(dayWeather.weather)}</span>
                  )}
                </div>
                <span className={`text-[11px] ${activeDay === day.day ? 'text-[#c9d7d9]' : 'text-muted-light'}`}>
                  {dayWeather ? `${Math.round(dayWeather.temperatureMin)}° – ${Math.round(dayWeather.temperatureMax)}°` : day.weekday}
                </span>
              </button>
            )
          })}
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
              const spot = spots.find(s =>
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
