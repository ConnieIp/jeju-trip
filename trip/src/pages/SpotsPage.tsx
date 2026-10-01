import { useState, useMemo } from 'react'
import { allSpots } from '../data/spots'
import SearchBox from '../components/ui/SearchBox'
import PlaceCard from '../components/ui/PlaceCard'

const FILTERS = ['All spots', 'Accommodation', 'Restaurant', 'Cafe', 'Sight', 'Souvenir']

const FILTER_MAP: Record<string, string> = {
  'All spots': 'all',
  Accommodation: 'accommodation',
  Restaurant: 'restaurant',
  Cafe: 'cafe',
  Sight: 'attraction',
  Souvenir: 'souvenir',
}

function SpotsPage() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All spots')

  const filteredSpots = useMemo(() => {
    let spots = allSpots

    if (activeFilter !== 'All spots') {
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
    <div className="mx-auto w-[min(1310px,100%-80px)] max-[980px]:w-[min(100%-36px,760px)] max-[640px]:w-[calc(100%-28px)]">
      <div className="px-8 pt-12 pb-[34px] max-[980px]:px-[18px] max-[640px]:px-[14px] max-[640px]:pt-[30px]">
        <div className="flex justify-between items-end gap-10 mb-6 max-[640px]:flex-col max-[640px]:items-start">
          <div>
            <div className="flex items-center gap-2 text-amber text-[12px] font-bold uppercase mb-3">
              <span className="w-[7px] h-[7px] bg-amber rounded-full inline-block" />
              ISLAND SHORTLIST
            </div>
            <h1 className="text-[46px] font-extrabold tracking-[-1.5px] leading-[1.08] mb-3.5 max-w-[650px] max-[640px]:text-[34px]">
              Places worth pulling over for.
            </h1>
            <p className="text-muted text-[15px] leading-[1.55] max-w-[580px] mt-3.5">
              A curated collection of sights, cafes, and restaurants across Jeju island.
            </p>
          </div>
          <div className="bg-dark-card text-white rounded-card p-5 shadow-[0_8px_24px_#15323a14] max-[640px]:w-full">
            <div className="flex items-center gap-3">
              <strong className="bg-amber rounded-full w-[42px] h-[42px] flex items-center justify-center text-[15px] font-bold flex-shrink-0">{allSpots.length}</strong>
              <div className="flex flex-col gap-[3px]">
                <b className="text-[13px] font-bold whitespace-nowrap">Saved across Jeju</b>
                <small className="text-sidebar-muted text-[12px]">{allSpots.length} already in your schedule</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-4 grid grid-cols-[1fr_auto] gap-3 max-[980px]:px-[18px] max-[640px]:px-[14px] max-[640px]:grid-cols-1">
        <SearchBox value={search} onChange={setSearch} />
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(filter => {
            const count = filter === 'All spots' ? filteredSpots.length : allSpots.filter(s => s.category === FILTER_MAP[filter]).length
            const label = filter === 'All spots' ? `${filter} · ${count}` : filter
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-[7px] border rounded-pill text-[12px] font-semibold cursor-pointer transition-colors ${
                  activeFilter === filter
                    ? 'bg-dark-card text-white border-dark-card'
                    : 'bg-bg text-muted border-border hover:border-ink/30'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-8 pb-[72px] max-[980px]:px-[18px] max-[640px]:px-[14px]">
        <div className="flex justify-between items-center mb-[18px] text-[13px]">
          <span className="text-muted text-[12px]"><b className="text-ink">{filteredSpots.length}</b> saved spots</span>
          <span className="text-muted text-[12px]">Sorted by <b className="text-ink">Trip order</b></span>
        </div>
        <div className="grid grid-cols-4 gap-[32px_18px] max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
          {filteredSpots.map(spot => (
            <PlaceCard key={spot.slug} spot={spot} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpotsPage
