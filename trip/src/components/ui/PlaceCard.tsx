import { Link } from 'react-router-dom'
import type { Spot } from '../../data/types'

interface PlaceCardProps {
  spot: Spot
}

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

function PlaceCard({ spot }: PlaceCardProps) {
  const photo = spot.photos?.[0] || '/photos/placeholder.jpg'
  const categoryLabel = getCategoryLabel(spot.category)
  const badgeColor = getCategoryBadgeColor(spot.category)

  return (
    <Link
      to={`/spot/${spot.slug}`}
      className="bg-card border border-border rounded-card overflow-hidden no-underline text-ink shadow-[0_8px_24px_#15323a12] hover:shadow-[0_12px_32px_#15323a1a] transition-shadow"
    >
      <div className="relative h-[180px]">
        <img src={photo} alt={spot.name} className="w-full h-full object-cover block" />
        <button className="absolute top-3.5 right-3.5 w-[34px] h-[34px] rounded-full bg-white/90 border-none cursor-pointer flex items-center justify-center">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-3 p-[18px]">
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted-light">
          <span className={`inline-flex items-center px-3 py-[7px] rounded-pill text-[12px] font-semibold leading-none ${badgeColor}`}>
            {categoryLabel}
          </span>
          <span>{spot.region}</span>
        </div>
        <div className="flex items-center gap-[7px] text-[19px] font-bold leading-[1.1] text-ink">
          <span className="flex-1">{spot.name}</span>
          <svg className="w-[15px] h-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
        {spot.features?.[0] && (
          <p className="text-[12px] text-muted leading-[1.45] m-0 -mt-[7px]">{spot.features[0]}</p>
        )}
      </div>
    </Link>
  )
}

export default PlaceCard
