import { useState, useMemo } from 'react'
import { useSpots } from '../data/SpotsProvider'
import { useSchedule } from '../data/ScheduleProvider'
import { useAuth } from '../auth/AuthContext'
import { useWeather } from '../hooks/useWeather'
import TimelineRow from '../components/schedule/TimelineRow'
import TransportIndicator from '../components/schedule/TransportIndicator'
import SpecialTimelineRow from '../components/schedule/SpecialTimelineRow'
import AccommodationCard from '../components/schedule/AccommodationCard'
import FlightCard from '../components/schedule/FlightCard'
import RouteOverview from '../components/schedule/RouteOverview'
import LocalNote from '../components/schedule/LocalNote'
import BackupCard from '../components/schedule/BackupCard'
import Modal from '../components/ui/Modal'
import ActivityForm from '../components/schedule/ActivityForm'
import AccommodationForm from '../components/schedule/AccommodationForm'
import FlightForm from '../components/schedule/FlightForm'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { photoUrl } from '../lib/photoUrl'
import type { ScheduleStop, FlightInfo } from '../data/types'

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

const accommodationPhotos: Record<string, string> = {
  'stay-stressless': 'accommodation/stay-stressless-1.jpg',
  'hygge-hotel': 'accommodation/hygge-hotel-1.jpg',
  'regentmarine-the-blue': 'accommodation/regentmarine-1.jpg',
}

type ModalState =
  | null
  | { type: 'add-activity' }
  | { type: 'edit-activity'; index: number }
  | { type: 'add-accommodation' }
  | { type: 'edit-accommodation' }
  | { type: 'add-flight' }
  | { type: 'edit-flight'; position: 'start' | 'end' }
  | { type: 'delete-activity'; index: number }
  | { type: 'delete-accommodation' }
  | { type: 'delete-flight'; position: 'start' | 'end' }

function SchedulePage() {
  const { spots } = useSpots()
  const { schedule, loading, updateSchedule } = useSchedule()
  const { user } = useAuth()
  const [activeDay, setActiveDay] = useState(1)
  const [modal, setModal] = useState<ModalState>(null)

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

  const backupSpots = spots.filter(s => s.backupFor?.includes(activeDay))

  const isFirstDay = activeDay === 1
  const isLastDay = activeDay === schedule.days.length
  const hasStartFlight = isFirstDay && !!currentDay.flight
  const hasEndFlight = isLastDay && !!currentDay.flight
  const hasAccommodation = !!currentDay.accommodation

  function handleAddActivity(stop: ScheduleStop) {
    updateSchedule(prev => ({
      ...prev,
      days: prev.days.map(d =>
        d.day === activeDay ? { ...d, stops: [...d.stops, stop] } : d
      ),
    }))
    setModal(null)
  }

  function handleEditActivity(index: number, stop: ScheduleStop) {
    updateSchedule(prev => ({
      ...prev,
      days: prev.days.map(d =>
        d.day === activeDay ? { ...d, stops: d.stops.map((s, i) => i === index ? stop : s) } : d
      ),
    }))
    setModal(null)
  }

  function handleDeleteActivity(index: number) {
    updateSchedule(prev => ({
      ...prev,
      days: prev.days.map(d =>
        d.day === activeDay ? { ...d, stops: d.stops.filter((_, i) => i !== index) } : d
      ),
    }))
    setModal(null)
  }

  function handleSaveAccommodation(data: { name: string; slug: string; night: string }) {
    updateSchedule(prev => ({
      ...prev,
      days: prev.days.map(d =>
        d.day === activeDay ? { ...d, accommodation: data } : d
      ),
    }))
    setModal(null)
  }

  function handleDeleteAccommodation() {
    updateSchedule(prev => ({
      ...prev,
      days: prev.days.map(d =>
        d.day === activeDay ? { ...d, accommodation: undefined } : d
      ),
    }))
    setModal(null)
  }

  function handleSaveFlight(flight: FlightInfo) {
    if (!modal || modal.type !== 'edit-flight' && modal.type !== 'add-flight') return
    const position = modal.type === 'edit-flight' ? modal.position : (isFirstDay ? 'start' : 'end')
    updateSchedule(prev => ({
      ...prev,
      days: prev.days.map(d => {
        if (position === 'start' && d.day === 1) return { ...d, flight }
        if (position === 'end' && d.day === prev.days.length) return { ...d, flight }
        return d
      }),
    }))
    setModal(null)
  }

  function handleDeleteFlight(position: 'start' | 'end') {
    updateSchedule(prev => ({
      ...prev,
      days: prev.days.map(d => {
        if (position === 'start' && d.day === 1) return { ...d, flight: undefined }
        if (position === 'end' && d.day === prev.days.length) return { ...d, flight: undefined }
        return d
      }),
    }))
    setModal(null)
  }

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
                  {activeDay === day.day ? (user ? `${day.weekday} · DAY ${day.day}` : `DAY ${day.day}`) : (user ? day.date : `DAY ${day.day}`)}
                </small>
                <div className="flex items-center justify-between">
                  <b className="text-[20px] font-bold">Day {day.day}</b>
                  {dayWeather && (
                    <span className="text-[16px]">{getWeatherIcon(dayWeather.weather)}</span>
                  )}
                </div>
                {user && (
                  <span className={`text-[11px] ${activeDay === day.day ? 'text-[#c9d7d9]' : 'text-muted-light'}`}>
                    {dayWeather ? `${Math.round(dayWeather.temperatureMin)}° – ${Math.round(dayWeather.temperatureMax)}°` : day.weekday}
                  </span>
                )}
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
            {user && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setModal({ type: 'add-activity' })}
                className="w-9 h-9 flex items-center justify-center bg-card text-teal border border-border rounded-[13px] cursor-pointer hover:border-teal-mid transition-colors"
                title="Add Activity"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              {!hasAccommodation && (
                <button
                  onClick={() => setModal({ type: 'add-accommodation' })}
                  className="w-9 h-9 flex items-center justify-center bg-card text-teal border border-border rounded-[13px] cursor-pointer hover:border-teal-mid transition-colors"
                  title="Add Accommodation"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7" />
                    <path d="M3 14h18" />
                    <path d="M5 14V9a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v5" />
                  </svg>
                </button>
              )}
              {isFirstDay && !hasStartFlight && (
                <button
                  onClick={() => setModal({ type: 'add-flight' })}
                  className="w-9 h-9 flex items-center justify-center bg-card text-teal border border-border rounded-[13px] cursor-pointer hover:border-teal-mid transition-colors"
                  title="Add Flight"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2" />
                  </svg>
                </button>
              )}
              {isLastDay && !hasEndFlight && (
                <button
                  onClick={() => setModal({ type: 'add-flight' })}
                  className="w-9 h-9 flex items-center justify-center bg-card text-teal border border-border rounded-[13px] cursor-pointer hover:border-teal-mid transition-colors"
                  title="Add Flight"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2" />
                  </svg>
                </button>
              )}
            </div>
            )}
          </div>

          <div>
            {/* Flight at start of Day 1 */}
            {user && isFirstDay && currentDay.flight && (
              <SpecialTimelineRow time={currentDay.flight.arrivalTime} isLast={currentDay.stops.length === 0 && !currentDay.accommodation}>
                <FlightCard
                  flightNumber={currentDay.flight.flightNumber}
                  departure={currentDay.flight.departure}
                  arrival={currentDay.flight.arrival}
                  departureTime={currentDay.flight.departureTime}
                  arrivalTime={currentDay.flight.arrivalTime}
                  departureTerminal={currentDay.flight.departureTerminal}
                  arrivalTerminal={currentDay.flight.arrivalTerminal}
                  variant="arrival"
                  onEdit={() => setModal({ type: 'edit-flight', position: 'start' })}
                  onDelete={() => setModal({ type: 'delete-flight', position: 'start' })}
                />
              </SpecialTimelineRow>
            )}

            {/* Accommodation checkout from previous night */}
            {user && activeDay > 1 && (() => {
              const prevDay = schedule.days.find(d => d.day === activeDay - 1)
              if (!prevDay?.accommodation) return null
              const photo = accommodationPhotos[prevDay.accommodation.slug]
              return (
                <SpecialTimelineRow time="Morning" isLast={currentDay.stops.length === 0 && !currentDay.accommodation && isLastDay}>
                  <AccommodationCard
                    name={prevDay.accommodation.name}
                    photo={photoUrl(photo)}
                    variant="checkout"
                    addressKo={prevDay.accommodation.addressKo}
                    addressEn={prevDay.accommodation.addressEn}
                    bookingUrl={prevDay.accommodation.bookingUrl}
                  />
                </SpecialTimelineRow>
              )
            })()}

            {/* Regular stops */}
            {currentDay.stops.map((stop, idx) => {
              const spot = stop.slug
                ? spots.find(s => s.slug === stop.slug)
                : spots.find(s =>
                    stop.title.toLowerCase().includes(s.name.toLowerCase()) ||
                    s.name.toLowerCase().includes(stop.title.toLowerCase().split(' ')[0])
                  )
              const isLastStop = idx === currentDay.stops.length - 1
              const hasTrailingContent = !!currentDay.accommodation ||
                (isLastDay && currentDay.flight)

              if (stop.type === 'transport') {
                return (
                  <TransportIndicator
                    key={idx}
                    stop={stop}
                    isLast={isLastStop && !hasTrailingContent}
                    onEdit={user ? () => setModal({ type: 'edit-activity', index: idx }) : undefined}
                    onDelete={user ? () => setModal({ type: 'delete-activity', index: idx }) : undefined}
                  />
                )
              }

              return (
                <TimelineRow
                  key={idx}
                  stop={stop}
                  spot={spot}
                  isLast={isLastStop && !hasTrailingContent}
                  onEdit={user ? () => setModal({ type: 'edit-activity', index: idx }) : undefined}
                  onDelete={user ? () => setModal({ type: 'delete-activity', index: idx }) : undefined}
                />
              )
            })}

            {/* Accommodation checkin at end of day */}
            {user && currentDay.accommodation && (() => {
              const photo = accommodationPhotos[currentDay.accommodation.slug]
              const hasFlight = isLastDay && currentDay.flight
              return (
                <SpecialTimelineRow time="Night" isLast={!hasFlight}>
                  <AccommodationCard
                    name={currentDay.accommodation.name}
                    photo={photoUrl(photo)}
                    variant="checkin"
                    addressKo={currentDay.accommodation.addressKo}
                    addressEn={currentDay.accommodation.addressEn}
                    bookingUrl={currentDay.accommodation.bookingUrl}
                    onEdit={() => setModal({ type: 'edit-accommodation' })}
                    onDelete={() => setModal({ type: 'delete-accommodation' })}
                  />
                </SpecialTimelineRow>
              )
            })()}

            {/* Flight at end of last day */}
            {user && isLastDay && currentDay.flight && (
              <SpecialTimelineRow time={currentDay.flight.departureTime} isLast>
                <FlightCard
                  flightNumber={currentDay.flight.flightNumber}
                  departure={currentDay.flight.departure}
                  arrival={currentDay.flight.arrival}
                  departureTime={currentDay.flight.departureTime}
                  arrivalTime={currentDay.flight.arrivalTime}
                  departureTerminal={currentDay.flight.departureTerminal}
                  arrivalTerminal={currentDay.flight.arrivalTerminal}
                  variant="departure"
                  onEdit={() => setModal({ type: 'edit-flight', position: 'end' })}
                  onDelete={() => setModal({ type: 'delete-flight', position: 'end' })}
                />
              </SpecialTimelineRow>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[18px] max-[980px]:order-first max-[980px]:grid max-[980px]:grid-cols-2 max-[640px]:flex">
          <RouteOverview route={currentDay.route} stopCount={currentDay.stops.length} driveTime={currentDay.driveTime} distance={currentDay.distance} />
          <LocalNote />
          <BackupCard spots={backupSpots} />
        </div>
      </div>

      {/* Add Activity Modal */}
      {modal?.type === 'add-activity' && (
        <Modal title="Add Activity" onClose={() => setModal(null)}>
          <ActivityForm spots={spots} onSubmit={handleAddActivity} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {/* Edit Activity Modal */}
      {modal?.type === 'edit-activity' && (
        <Modal title="Edit Activity" onClose={() => setModal(null)}>
          <ActivityForm
            initial={currentDay.stops[modal.index]}
            spots={spots}
            onSubmit={(stop) => handleEditActivity(modal.index, stop)}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Add/Edit Accommodation Modal */}
      {(modal?.type === 'add-accommodation' || modal?.type === 'edit-accommodation') && (
        <Modal title={modal.type === 'add-accommodation' ? 'Add Accommodation' : 'Edit Accommodation'} onClose={() => setModal(null)}>
          <AccommodationForm
            initial={currentDay.accommodation || undefined}
            onSubmit={handleSaveAccommodation}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Add/Edit Flight Modal */}
      {(modal?.type === 'add-flight' || modal?.type === 'edit-flight') && (
        <Modal title={modal.type === 'add-flight' ? 'Add Flight' : 'Edit Flight'} onClose={() => setModal(null)}>
          <FlightForm
            initial={currentDay.flight || undefined}
            onSubmit={handleSaveFlight}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Delete Confirmations */}
      {modal?.type === 'delete-activity' && (
        <ConfirmDialog
          title="Delete Activity"
          message={`Remove "${currentDay.stops[modal.index].title}" from Day ${activeDay}?`}
          confirmLabel="Delete"
          onConfirm={() => handleDeleteActivity(modal.index)}
          onCancel={() => setModal(null)}
        />
      )}
      {modal?.type === 'delete-accommodation' && (
        <ConfirmDialog
          title="Delete Accommodation"
          message={`Remove "${currentDay.accommodation?.name}" from Day ${activeDay}?`}
          confirmLabel="Delete"
          onConfirm={handleDeleteAccommodation}
          onCancel={() => setModal(null)}
        />
      )}
      {modal?.type === 'delete-flight' && (
        <ConfirmDialog
          title="Delete Flight"
          message={`Remove flight from Day ${activeDay}?`}
          confirmLabel="Delete"
          onConfirm={() => handleDeleteFlight(modal.position)}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  )
}

export default SchedulePage
