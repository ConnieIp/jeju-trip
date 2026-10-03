import { useState } from 'react'
import type { ScheduleStop, Category, Spot, TransportMode } from '../../data/types'

interface ActivityFormProps {
  initial?: ScheduleStop
  spots: Spot[]
  onSubmit: (stop: ScheduleStop) => void
  onCancel: () => void
}

const TYPES: { value: Category | 'transport' | 'activity'; label: string }[] = [
  { value: 'attraction', label: 'Sight' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'souvenir', label: 'Souvenir' },
  { value: 'activity', label: 'Activity' },
  { value: 'transport', label: 'Transport' },
]

const TRANSPORT_MODES: { value: TransportMode; label: string }[] = [
  { value: 'drive', label: 'Drive' },
  { value: 'walk', label: 'Walk' },
  { value: 'bus', label: 'Bus' },
  { value: 'ferry', label: 'Ferry' },
  { value: 'taxi', label: 'Taxi' },
  { value: 'bike', label: 'Bike' },
]

function spotToStopType(category: Category): ScheduleStop['type'] {
  return category
}

function ActivityForm({ initial, spots, onSubmit, onCancel }: ActivityFormProps) {
  const [selectedSlug, setSelectedSlug] = useState(initial?.slug || '')
  const [selectedType, setSelectedType] = useState(initial?.type || 'attraction')

  const handleSpotSelect = (slug: string) => {
    setSelectedSlug(slug)
    const spot = spots.find(s => s.slug === slug)
    if (spot) {
      const form = document.getElementById('activity-form') as HTMLFormElement | null
      if (form) {
        const titleInput = form.querySelector('[name="title"]') as HTMLInputElement
        const slugInput = form.querySelector('[name="slug"]') as HTMLInputElement
        const typeSelect = form.querySelector('[name="type"]') as HTMLSelectElement
        const descInput = form.querySelector('[name="description"]') as HTMLInputElement
        if (titleInput) titleInput.value = spot.name
        if (slugInput) slugInput.value = spot.slug
        if (typeSelect) typeSelect.value = spotToStopType(spot.category)
        if (descInput) descInput.value = spot.features?.[0] || ''
        setSelectedType(spotToStopType(spot.category))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const type = (fd.get('type') as ScheduleStop['type'])
    const stop: ScheduleStop = {
      time: (fd.get('time') as string).trim(),
      endTime: (fd.get('endTime') as string).trim() || undefined,
      duration: (fd.get('duration') as string).trim() || undefined,
      type,
      transportMode: type === 'transport' ? (fd.get('transportMode') as TransportMode) || undefined : undefined,
      title: (fd.get('title') as string).trim(),
      slug: (fd.get('slug') as string).trim() || undefined,
      description: (fd.get('description') as string).trim() || undefined,
      note: (fd.get('note') as string).trim() || undefined,
    }
    onSubmit(stop)
  }

  const inputClass =
    'w-full px-4 py-3 bg-card border border-border rounded-[14px] text-[14px] text-ink placeholder:text-muted-light focus:outline-none focus:border-teal-mid transition-colors'
  const labelClass = 'block text-[12px] font-semibold text-ink mb-1.5'

  const sortedSpots = [...spots].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <form id="activity-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className={labelClass}>Select from saved spots</label>
        <select
          value={selectedSlug}
          onChange={(e) => handleSpotSelect(e.target.value)}
          className={inputClass}
        >
          <option value="">— Choose a spot —</option>
          {sortedSpots.map(s => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label className={labelClass}>Title *</label>
          <input name="title" defaultValue={initial?.title} required className={inputClass} placeholder="e.g. Seongsan Ilchulbong" />
        </div>
        <div>
          <label className={labelClass}>Type *</label>
          <select name="type" defaultValue={initial?.type || 'attraction'} className={inputClass} onChange={(e) => setSelectedType(e.target.value as ScheduleStop['type'])}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedType === 'transport' && (
        <div>
          <label className={labelClass}>Transport Mode</label>
          <select name="transportMode" defaultValue={initial?.transportMode || 'drive'} className={inputClass}>
            {TRANSPORT_MODES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label className={labelClass}>Start Time *</label>
          <input name="time" defaultValue={initial?.time} required className={inputClass} placeholder="e.g. 09:00" />
        </div>
        <div>
          <label className={labelClass}>End Time</label>
          <input name="endTime" defaultValue={initial?.endTime} className={inputClass} placeholder="e.g. 11:00" />
        </div>
        <div>
          <label className={labelClass}>Duration</label>
          <input name="duration" defaultValue={initial?.duration} className={inputClass} placeholder="e.g. 2h" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Slug (link to spot)</label>
        <input name="slug" defaultValue={initial?.slug} className={inputClass} placeholder="e.g. seongsan-ilchulbong" />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <input name="description" defaultValue={initial?.description} className={inputClass} placeholder="Brief description" />
      </div>

      <div>
        <label className={labelClass}>Note</label>
        <input name="note" defaultValue={initial?.note} className={inputClass} placeholder="Optional note" />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-3 bg-teal-dark text-white rounded-[13px] text-[13px] font-semibold cursor-pointer border-none hover:opacity-90 transition-opacity"
        >
          {initial ? 'Save Changes' : 'Add Activity'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-card text-muted border border-border rounded-[13px] text-[13px] font-semibold cursor-pointer hover:border-ink/30 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ActivityForm
