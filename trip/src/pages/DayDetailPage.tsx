import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSpots } from '../data/SpotsProvider'
import { useSchedule } from '../data/ScheduleProvider'
import { useAuth } from '../auth/AuthContext'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import PhotoGallery from '../components/ui/PhotoGallery'
import InfoCard from '../components/ui/InfoCard'
import MapButton from '../components/ui/MapButton'
import ConfirmDialog from '../components/ui/ConfirmDialog'
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
  if (category === 'attraction') return 'text-teal bg-teal-light border border-border'
  if (['restaurant', 'cafe', 'bakery', 'souvenir'].includes(category)) return 'text-amber bg-amber-light'
  return 'text-muted bg-bg'
}

function DayDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { getSpot, removeSpot } = useSpots()
  const { schedule } = useSchedule()
  const { user } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const spot = slug ? getSpot(slug) : undefined

  if (!spot) {
    return (
      <div className="mx-auto px-8 py-12 max-[980px]:px-[18px] max-[640px]:px-[14px]" style={{ width: 'min(1310px, 100% - 80px)' }}>
        <h1 className="text-2xl font-bold mb-4">Spot not found</h1>
        <Link to="/spots" className="text-teal hover:underline">
          ← Back to all spots
        </Link>
      </div>
    )
  }

  const attraction = spot as Attraction
  const address = spot.addressKo || spot.addressEn || spot.address || ''

  const scheduleInfo = schedule?.days.find(day =>
    day.stops.some(stop =>
      stop.title.toLowerCase().includes(spot.name.toLowerCase()) ||
      spot.name.toLowerCase().includes(stop.title.toLowerCase().split(' ')[0])
    )
  )

  const stopInSchedule = scheduleInfo?.stops.find(stop =>
    stop.title.toLowerCase().includes(spot.name.toLowerCase()) ||
    spot.name.toLowerCase().includes(stop.title.toLowerCase().split(' ')[0])
  )

  const handleDelete = async () => {
    if (!slug) return
    setDeleting(true)
    try {
      await removeSpot(slug)
      navigate('/spots')
    } catch (err) {
      console.error('Failed to delete spot:', err)
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="mx-auto pt-[34px] pb-[72px] px-8 w-[min(1310px,100%-80px)] max-[980px]:w-[min(100%-36px,760px)] max-[980px]:px-[18px] max-[640px]:w-[calc(100%-28px)] max-[640px]:px-[14px]">
      <Breadcrumbs
        items={[
          { label: 'Saved spots', to: '/spots' },
          { label: getCategoryLabel(spot.category), to: '/spots' },
          { label: spot.name },
        ]}
      />

      <div className="flex justify-between items-end mb-7 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-[18px]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-3 py-[7px] rounded-pill text-[12px] font-semibold leading-none ${getCategoryBadgeColor(spot.category)}`}>
              {getCategoryLabel(spot.category)}
            </span>
            {attraction.isUNESCO && (
              <span className="px-2.5 py-[7px] bg-amber-light text-amber rounded-pill text-[11px] font-semibold ml-2">
                UNESCO World Heritage
              </span>
            )}
          </div>
          <h1 className="text-[46px] font-extrabold tracking-[-1.5px] leading-[1.08] mt-2 mb-2 max-[640px]:text-[34px]">
            {spot.name}
          </h1>
          {address && (
            <div className="flex items-center gap-2 text-muted text-[12px]">
              <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{address}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2.5 flex-wrap">
          {user && (
            <>
              <Link
                to={`/spot/${slug}/edit`}
                className="flex items-center gap-2 px-4 py-[13px] border border-border bg-card rounded-[13px] text-[12px] font-semibold cursor-pointer no-underline text-ink hover:border-ink/30 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-[13px] border border-red-300 bg-card rounded-[13px] text-[12px] font-semibold text-red-600 cursor-pointer hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete
              </button>
            </>
          )}
          <button className="flex items-center gap-2 px-4 py-[13px] border border-border bg-card rounded-[13px] text-[12px] font-semibold cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-[13px] border border-border bg-card rounded-[13px] text-[12px] font-semibold cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Saved
          </button>
        </div>
      </div>

      <PhotoGallery photos={spot.photos} />

      <div className="grid grid-cols-[1fr_380px] gap-7 max-[980px]:grid-cols-1 max-lg:grid-cols-1">
        <div className="flex flex-col gap-[18px] max-[980px]:grid max-[980px]:grid-cols-2 max-[640px]:flex">
          <InfoCard
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#15718a" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 15.38 11.88 10.64 7.76 16.24 16.24 7.76" />
              </svg>
            }
            title="Why it belongs on the route"
          >
            {spot.features && spot.features.length > 0 && (
              <p className="text-ink-light text-[13px] leading-[1.65] mb-4">
                {spot.features.join('. ')}
              </p>
            )}
            <div className="grid grid-cols-3 gap-2 mt-4 max-[640px]:grid-cols-1">
              {attraction.recommendedTime && (
                <span className="bg-bg rounded-[14px] p-3 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 grid-rows-[auto_auto]">
                  <svg className="w-4 h-4 row-span-2 self-center text-teal-mid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <small className="text-[9px] text-muted">Time needed</small>
                  <b className="text-[11px] font-bold">{attraction.recommendedTime}</b>
                </span>
              )}
              {attraction.hikingInfo && (
                <>
                  <span className="bg-bg rounded-[14px] p-3 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 grid-rows-[auto_auto]">
                    <svg className="w-4 h-4 row-span-2 self-center text-teal-mid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 20l4-8 4 4 4-10 4 6" />
                    </svg>
                    <small className="text-[9px] text-muted">Trail</small>
                    <b className="text-[11px] font-bold">{attraction.hikingInfo.distance}</b>
                  </span>
                  <span className="bg-bg rounded-[14px] p-3 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 grid-rows-[auto_auto]">
                    <svg className="w-4 h-4 row-span-2 self-center text-teal-mid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 9h20M4 9v10a2 2 0 002 2h12a2 2 0 002-2V9" />
                      <path d="M8 9V5a4 4 0 018 0v4" />
                    </svg>
                    <small className="text-[9px] text-muted">Adult entry</small>
                    <b className="text-[11px] font-bold">{attraction.admission || 'Free'}</b>
                  </span>
                </>
              )}
            </div>
          </InfoCard>

          {spot.notes && spot.notes.length > 0 && (
            <InfoCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#f28b2e" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              }
              title="Visit notes & remarks"
            >
              <ul className="text-ink-light pl-[18px] text-[12px] leading-[1.6] m-0">
                {spot.notes.map((note, idx) => (
                  <li key={idx} className="my-2 [&::marker]:text-teal-mid [&::marker]:content-['•']">
                    {note}
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}
        </div>

        <div className="flex flex-col gap-[18px] max-[980px]:grid max-[980px]:grid-cols-2 max-[640px]:flex">
          {address && (
            <InfoCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#f28b2e" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              }
              title="Directions"
              dark
            >
              <p className="text-sidebar-muted text-[11px] my-1.5 mb-3.5">
                Main parking entrance
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <MapButton platform="naver" address={address} />
                <MapButton platform="kakao" address={address} />
              </div>
            </InfoCard>
          )}

          {attraction.hours && (
            <InfoCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#f28b2e" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              title="Hours & practical info"
            >
              <div className="p-5">
                <dl className="my-3.5 text-[11px]">
                  {Array.isArray(attraction.hours) && attraction.hours.length > 0 && (
                    <>
                      {attraction.hours.map((hour, idx) => (
                        <div key={idx} className="flex justify-between py-1.5">
                          <dt className="text-muted">{idx === 0 ? 'Today · Thursday' : `Day ${idx + 1}`}</dt>
                          <dd className="m-0 font-semibold">{hour}</dd>
                        </div>
                      ))}
                    </>
                  )}
                </dl>
                <hr className="border-0 border-t border-border my-3.5" />
                {spot.phone && (
                  <div className="flex items-start gap-3 text-[11px] leading-[1.35] mt-3">
                    <svg className="w-[34px] h-[34px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    <div className="flex flex-col">
                      <small className="text-[9px] text-muted tracking-[0.5px]">CONTACT</small>
                      <span className="font-semibold">{spot.phone}</span>
                    </div>
                  </div>
                )}
              </div>
            </InfoCard>
          )}

          {scheduleInfo && stopInSchedule && (
            <div className="p-5 bg-card border border-border rounded-card">
              <div className="flex justify-between items-center">
                <b className="text-[15px] font-bold">In your schedule</b>
                <span className="text-amber bg-amber-light rounded-pill px-2.5 py-1.5 text-[10px] font-semibold">
                  Day {scheduleInfo.day}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-3.5">
                <strong className="text-teal bg-teal-light rounded-[10px] self-stretch grid place-items-center px-2.5 text-[11px] font-semibold">
                  {stopInSchedule.time}
                </strong>
                <div className="flex flex-col flex-1">
                  <b className="text-[11px] font-bold">{stopInSchedule.title}</b>
                  <small className="text-muted text-[12px] mt-[3px]">{scheduleInfo.date} · {scheduleInfo.weekday}</small>
                </div>
                <svg className="w-4 h-4 text-teal flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete spot"
          message={`Are you sure you want to remove "${spot.name}"? It will be hidden from all views.`}
          confirmLabel={deleting ? 'Deleting...' : 'Delete'}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  )
}

export default DayDetailPage
