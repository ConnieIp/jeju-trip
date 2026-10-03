import { Link } from 'react-router-dom'
import type { ScheduleStop, Spot } from '../../data/types'
import { photoUrl } from '../../lib/photoUrl'

interface StopCardProps {
  stop: ScheduleStop
  spot?: Spot
  onEdit?: () => void
  onDelete?: () => void
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

function StopCard({ stop, spot, onEdit, onDelete }: StopCardProps) {
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

  const actionButtons = (onEdit || onDelete) && (
    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {onEdit && (
        <button
          onClick={(e) => { e.preventDefault(); onEdit() }}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-card border border-border text-muted text-[12px] cursor-pointer hover:border-teal-mid hover:text-teal transition-colors"
          title="Edit"
        >
          ✎
        </button>
      )}
      {onDelete && (
        <button
          onClick={(e) => { e.preventDefault(); onDelete() }}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-card border border-border text-muted text-[12px] cursor-pointer hover:border-red-500 hover:text-red-500 transition-colors"
          title="Delete"
        >
          ✕
        </button>
      )}
    </div>
  )

  if (spot) {
    return (
      <div className="relative group">
        <Link
          to={`/spot/${spot.slug}`}
          className="flex items-center gap-[18px] p-[14px] bg-card border border-border rounded-card-sm cursor-pointer hover:shadow-md transition-shadow no-underline text-ink min-h-[134px] shadow-[0_8px_24px_#15323a0d] max-[640px]:gap-2.5 max-[640px]:p-2.5 max-[640px]:min-h-[112px]"
        >
          {cardContent}
        </Link>
        {actionButtons}
      </div>
    )
  }

  return (
    <div className="relative group">
      <div className="flex items-center gap-[18px] p-[14px] bg-card border border-border rounded-card-sm min-h-[134px] shadow-[0_8px_24px_#15323a0d] max-[640px]:gap-2.5 max-[640px]:p-2.5 max-[640px]:min-h-[112px]">
        {cardContent}
      </div>
      {actionButtons}
    </div>
  )
}

export default StopCard
