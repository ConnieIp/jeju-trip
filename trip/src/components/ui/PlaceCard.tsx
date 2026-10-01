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
  const colors: Record<string, string> = {
    attraction: 'bg-teal text-white',
    restaurant: 'bg-green-100 text-green-800',
    cafe: 'bg-yellow-100 text-yellow-800',
    bakery: 'bg-yellow-100 text-yellow-800',
    souvenir: 'bg-pink-100 text-pink-800',
  }
  return colors[category] || 'bg-gray-100 text-gray-700'
}

function PlaceCard({ spot }: PlaceCardProps) {
  const photo = spot.photos?.[0] || '/photos/placeholder.jpg'
  const categoryLabel = getCategoryLabel(spot.category)
  const badgeColor = getCategoryBadgeColor(spot.category)

  return (
    <Link
      to={`/spot/${spot.slug}`}
      className="bg-card border border-border rounded-card overflow-hidden no-underline text-ink hover:shadow-md transition-shadow"
    >
      <div className="relative h-[160px]">
        <img src={photo} alt={spot.name} className="w-full h-full object-cover" />
        <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 border-none cursor-pointer flex items-center justify-center">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
      <div className="p-3.5">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-muted">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-pill text-[11px] font-semibold ${badgeColor}`}>
            {categoryLabel}
          </span>
          <span>{spot.region}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[15px] font-semibold">
          <span className="truncate">{spot.name}</span>
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
        {spot.features?.[0] && (
          <p className="text-[13px] text-muted mt-1.5 line-clamp-2">{spot.features[0]}</p>
        )}
      </div>
    </Link>
  )
}

export default PlaceCard
