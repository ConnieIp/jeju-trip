import { Link } from 'react-router-dom'
import type { ScheduleStop, Spot } from '../../data/types'

interface StopCardProps {
  stop: ScheduleStop
  spot?: Spot
}

function getCategoryLabel(type: string): string {
  const labels: Record<string, string> = {
    attraction: 'Sight',
    restaurant: 'Restaurant',
    cafe: 'Cafe',
    bakery: 'Bakery',
    souvenir: 'Souvenir',
    transport: 'Transport',
    checkin: 'Check-in',
    activity: 'Activity',
  }
  return labels[type] || type
}

function getCategoryColor(type: string): string {
  const colors: Record<string, string> = {
    attraction: 'bg-teal text-white',
    restaurant: 'bg-green-100 text-green-800',
    cafe: 'bg-yellow-100 text-yellow-800',
    bakery: 'bg-yellow-100 text-yellow-800',
    souvenir: 'bg-pink-100 text-pink-800',
    transport: 'bg-gray-100 text-gray-700',
    checkin: 'bg-purple-100 text-purple-800',
    activity: 'bg-blue-100 text-blue-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-700'
}

function StopCard({ stop, spot }: StopCardProps) {
  const photo = spot?.photos?.[0] || '/photos/placeholder.jpg'
  const categoryLabel = getCategoryLabel(stop.type)
  const categoryColor = getCategoryColor(stop.type)

  const cardContent = (
    <>
      <img src={photo} alt={stop.title} className="w-16 h-16 rounded-lg object-cover" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-pill text-[11px] font-semibold ${categoryColor}`}>
            {categoryLabel}
          </span>
          {stop.endTime && (
            <small className="text-muted text-[11px]">
              {stop.time} – {stop.endTime}
            </small>
          )}
        </div>
        <b className="text-sm font-semibold block truncate">{stop.title}</b>
        {spot?.features?.[0] && (
          <small className="text-muted text-xs block truncate">{spot.features[0]}</small>
        )}
      </div>
    </>
  )

  if (spot) {
    return (
      <Link
        to={`/spot/${spot.slug}`}
        className="flex gap-3 p-3 bg-card border border-border rounded-card cursor-pointer hover:shadow-md transition-shadow no-underline text-ink"
      >
        {cardContent}
      </Link>
    )
  }

  return (
    <div className="flex gap-3 p-3 bg-card border border-border rounded-card">
      {cardContent}
    </div>
  )
}

export default StopCard
