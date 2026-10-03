import { Link } from 'react-router-dom'
import type { Spot } from '../../data/types'

const CATEGORY_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  attraction: { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Sight' },
  restaurant: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Restaurant' },
  cafe: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Cafe' },
  bakery: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Bakery' },
  souvenir: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'Souvenir' },
}

interface BackupCardProps {
  spots: Spot[]
}

function BackupCard({ spots }: BackupCardProps) {
  if (spots.length === 0) return null

  return (
    <div className="p-5 bg-card border border-border rounded-card flex flex-col gap-3">
      <small className="text-[10px] text-muted tracking-wide font-bold uppercase">
        NEARBY BACKUP
      </small>
      <div className="flex flex-col gap-2.5">
        {spots.map((spot) => {
          const badge = CATEGORY_BADGE[spot.category] || CATEGORY_BADGE.attraction
          return (
            <Link
              key={spot.slug}
              to={`/spot/${spot.slug}`}
              className="flex items-start gap-2.5 no-underline group"
            >
              <span className={`shrink-0 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[13px] font-bold text-teal-dark group-hover:text-teal transition-colors truncate">
                  {spot.name}
                </span>
                {spot.features[0] && (
                  <span className="text-[11px] text-muted-light truncate">
                    {spot.features[0]}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default BackupCard
