import { useState, useMemo } from 'react'
import { allSpots } from '../data/spots'
import SearchBox from '../components/ui/SearchBox'
import FilterBar from '../components/ui/FilterBar'
import PlaceCard from '../components/ui/PlaceCard'

const FILTERS = ['All', 'Sights', 'Cafes', 'Restaurants', 'Bakeries', 'Souvenirs']

const FILTER_MAP: Record<string, string> = {
  All: 'all',
  Sights: 'attraction',
  Cafes: 'cafe',
  Restaurants: 'restaurant',
  Bakeries: 'bakery',
  Souvenirs: 'souvenir',
}

function SpotsPage() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredSpots = useMemo(() => {
    let spots = allSpots

    if (activeFilter !== 'All') {
      const category = FILTER_MAP[activeFilter]
      spots = spots.filter(s => s.category === category)
    }

    if (search.trim()) {
      const query = search.toLowerCase()
      spots = spots.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.features?.some(f => f.toLowerCase().includes(query)) ||
        s.region.toLowerCase().includes(query)
      )
    }

    return spots
  }, [search, activeFilter])

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="px-8 pt-12 pb-6">
        <div className="mb-6">
          <h1 className="text-[42px] font-extrabold tracking-tight leading-tight mb-2">
            Places worth pulling over for.
          </h1>
          <p className="text-muted text-base max-w-[500px]">
            A curated collection of sights, cafes, and restaurants across Jeju island.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-5 p-4 bg-card rounded-card">
          <strong className="text-[32px] font-bold">{allSpots.length}</strong>
          <div>
            <b className="text-sm block">Places saved</b>
            <small className="text-muted text-xs">Across 5 regions</small>
          </div>
        </div>
      </div>

      <div className="px-8 py-4">
        <SearchBox value={search} onChange={setSearch} />
        <FilterBar filters={FILTERS} active={activeFilter} onChange={setActiveFilter} />
      </div>

      <div className="px-8 pb-12">
        <div className="flex justify-between items-center mb-4 text-sm">
          <span className="text-muted">{filteredSpots.length} places</span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {filteredSpots.map(spot => (
            <PlaceCard key={spot.slug} spot={spot} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpotsPage
