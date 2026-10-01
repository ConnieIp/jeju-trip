import { Link } from 'react-router-dom'
import type { ScheduleStop, Spot } from '../../data/types'
import { photoUrl } from '../../lib/photoUrl'

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
  if (type === 'attraction') return 'text-teal bg-teal-light border border-border'
  if (['restaurant', 'cafe', 'bakery', 'souvenir'].includes(type)) return 'text-amber bg-amber-light'
  return 'text-muted-light bg-bg'
}

function StopCard({ stop, spot }: StopCardProps) {
  const photo = spot?.photos?.[0] || '/photos/placeholder.jpg'
  const categoryLabel = getCategoryLabel(stop.type)
  const categoryColor = getCategoryColor(stop.type)

  const cardContent = (
    <>
      <img src={photoUrl(photo)} alt={stop.title} className="w-[150px] h-[106px] rounded-[15px] object-cover flex-shrink-0 max-[640px]:w-[82px] max-[640px]:h-[82px]" />
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <div className="flex items-center justify-between gap-2.5">
          <span className={`inline-flex items-center px-3 py-[7px] rounded-pill text-[12px] font-semibold leading-none ${categoryColor}`}>
            {categoryLabel}
          </span>
          {stop.endTime && (
            <small className="text-muted-light text-[11px]">
              {stop.time} – {stop.endTime}
            </small>
          )}
        </div>
        <b className="text-teal text-[19px] font-bold block truncate max-[640px]:text-[15px]">{stop.title}</b>
        {spot?.features?.[0] && (
          <small className="text-muted text-[12px] block truncate max-[640px]:text-[10px]">{spot.features[0]}</small>
        )}
      </div>
    </>
  )

  if (spot) {
    return (
      <Link
        to={`/spot/${spot.slug}`}
        className="flex items-center gap-[18px] p-[14px] bg-card border border-border rounded-card-sm cursor-pointer hover:shadow-md transition-shadow no-underline text-ink min-h-[134px] shadow-[0_8px_24px_#15323a0d] max-[640px]:gap-2.5 max-[640px]:p-2.5 max-[640px]:min-h-[112px]"
      >
        {cardContent}
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-[18px] p-[14px] bg-card border border-border rounded-card-sm min-h-[134px] shadow-[0_8px_24px_#15323a0d] max-[640px]:gap-2.5 max-[640px]:p-2.5 max-[640px]:min-h-[112px]">
      {cardContent}
    </div>
  )
}

export default StopCard
