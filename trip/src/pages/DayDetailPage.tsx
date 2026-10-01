import { useParams, Link } from 'react-router-dom'
import { getSpotBySlug } from '../data/spots'
import { schedule } from '../data/schedule'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import PhotoGallery from '../components/ui/PhotoGallery'
import InfoCard from '../components/ui/InfoCard'
import MapButton from '../components/ui/MapButton'
import type { Attraction } from '../data/types'

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    attraction: 'Sight',
    restaurant: 'Restaurant',
    cafe: 'Cafe',
    bakery: 'Bakery',
    souvenir: 'Souvenir',
  }
  return labels[category] || category
}

function getCategoryBadgeColor(category: string): string {
  const colors: Record<string, string> = {
    attraction: 'bg-teal text-white',
    restaurant: 'bg-green-100 text-green-800',
    cafe: 'bg-yellow-100 text-yellow-800',
    bakery: 'bg-yellow-100 text-yellow-800',
    souvenir: 'bg-pink-100 text-pink-800',
  }
  return colors[category] || 'bg-gray-100 text-gray-700'
}

function DayDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const spot = slug ? getSpotBySlug(slug) : undefined

  if (!spot) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        <h1 className="text-2xl font-bold mb-4">Spot not found</h1>
        <Link to="/spots" className="text-teal hover:underline">
          ← Back to all spots
        </Link>
      </div>
    )
  }

  const attraction = spot as Attraction
  const address = spot.addressKo || spot.addressEn || spot.address || ''

  const scheduleInfo = schedule.days.find(day =>
    day.stops.some(stop =>
      stop.title.toLowerCase().includes(spot.name.toLowerCase()) ||
      spot.name.toLowerCase().includes(stop.title.toLowerCase().split(' ')[0])
    )
  )

  const stopInSchedule = scheduleInfo?.stops.find(stop =>
    stop.title.toLowerCase().includes(spot.name.toLowerCase()) ||
    spot.name.toLowerCase().includes(stop.title.toLowerCase().split(' ')[0])
  )

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-6">
      <Breadcrumbs
        items={[
          { label: 'Saved spots', to: '/spots' },
          { label: getCategoryLabel(spot.category), to: '/spots' },
          { label: spot.name },
        ]}
      />

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-pill text-xs font-semibold ${getCategoryBadgeColor(spot.category)}`}>
              {getCategoryLabel(spot.category)}
            </span>
            {attraction.isUNESCO && (
              <span className="px-3 py-1 bg-amber-light text-amber rounded-pill text-xs font-semibold">
                UNESCO
              </span>
            )}
          </div>
          <h1 className="text-[42px] font-extrabold tracking-tight leading-tight mb-2">
            {spot.name}
          </h1>
          {address && (
            <div className="flex items-center gap-1.5 text-muted text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{address}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2.5">
          <button className="flex items-center gap-2 px-5 py-2.5 border border-border bg-card rounded-[10px] text-sm font-medium cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
            Share
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 border border-border bg-card rounded-[10px] text-sm font-medium cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Saved
          </button>
        </div>
      </div>

      <div className="mb-8">
        <PhotoGallery photos={spot.photos} />
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-8 max-lg:grid-cols-1">
        <div className="flex flex-col gap-6">
          <InfoCard
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 15.38 11.88 10.64 7.76 16.24 16.24 7.76" />
              </svg>
            }
            title="Why it belongs on the route"
          >
            {spot.features && spot.features.length > 0 && (
              <p className="text-ink-light text-[15px] leading-relaxed mb-4">
                {spot.features.join('. ')}
              </p>
            )}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {attraction.recommendedTime && (
                <div className="p-3 bg-bg rounded-[10px]">
                  <div className="text-xs text-muted mb-1">Time needed</div>
                  <div className="text-sm font-semibold">{attraction.recommendedTime}</div>
                </div>
              )}
              {attraction.hikingInfo && (
                <>
                  <div className="p-3 bg-bg rounded-[10px]">
                    <div className="text-xs text-muted mb-1">Trail</div>
                    <div className="text-sm font-semibold">{attraction.hikingInfo.distance}</div>
                  </div>
                  <div className="p-3 bg-bg rounded-[10px]">
                    <div className="text-xs text-muted mb-1">Adult entry</div>
                    <div className="text-sm font-semibold">{attraction.admission || 'Free'}</div>
                  </div>
                </>
              )}
            </div>
          </InfoCard>

          {spot.notes && spot.notes.length > 0 && (
            <InfoCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              }
              title="Visit notes & remarks"
            >
              <ul className="space-y-2 mb-4">
                {spot.notes.map((note, idx) => (
                  <li key={idx} className="text-ink-light text-[15px] leading-relaxed flex gap-2">
                    <span className="text-amber font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {address && (
            <InfoCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              }
              title="Directions"
              dark
            >
              <div className="flex flex-col gap-3">
                <MapButton platform="naver" address={address} />
                <MapButton platform="kakao" address={address} />
              </div>
            </InfoCard>
          )}

          {attraction.hours && (
            <InfoCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              title="Hours & practical info"
            >
              <div className="space-y-3 text-sm">
                {Array.isArray(attraction.hours) && attraction.hours.length > 0 && (
                  <div>
                    <div className="text-muted text-xs mb-1">Hours</div>
                    <div className="space-y-1">
                      {attraction.hours.map((hour, idx) => (
                        <div key={idx} className="text-ink-light">{hour}</div>
                      ))}
                    </div>
                  </div>
                )}
                {spot.phone && (
                  <div>
                    <div className="text-muted text-xs mb-1">Contact</div>
                    <div className="text-ink-light">{spot.phone}</div>
                  </div>
                )}
              </div>
            </InfoCard>
          )}

          {scheduleInfo && stopInSchedule && (
            <InfoCard title="In your schedule">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-amber-light text-amber rounded-pill text-xs font-semibold">
                  Day {scheduleInfo.day}
                </span>
                {stopInSchedule.time && (
                  <span className="px-3 py-1 bg-teal-light text-teal-dark rounded-pill text-xs font-semibold">
                    {stopInSchedule.time}
                  </span>
                )}
              </div>
              <div className="text-sm text-muted">
                {scheduleInfo.date} {scheduleInfo.weekday}
              </div>
            </InfoCard>
          )}
        </div>
      </div>
    </div>
  )
}

export default DayDetailPage
