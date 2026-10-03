import type { Spot, Region } from '../../data/types'

type FormCategory = 'attraction' | 'restaurant' | 'cafe' | 'bakery' | 'souvenir'

interface SpotFormProps {
  initial?: Spot
  onSubmit: (spot: Spot) => void
  onCancel: () => void
  submitLabel: string
}

const CATEGORIES: { value: FormCategory; label: string }[] = [
  { value: 'attraction', label: 'Sight' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'souvenir', label: 'Souvenir' },
]

const REGIONS: { value: Region; label: string }[] = [
  { value: 'east', label: 'East' },
  { value: 'north', label: 'North' },
  { value: 'west', label: 'West' },
  { value: 'south', label: 'South' },
  { value: 'central', label: 'Central' },
]

function SpotForm({ initial, onSubmit, onCancel, submitLabel }: SpotFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    const category = fd.get('category') as FormCategory
    const base: Partial<Spot> = {
      slug: initial?.slug || `user-${crypto.randomUUID()}`,
      name: (fd.get('name') as string).trim(),
      nameZh: (fd.get('nameZh') as string).trim() || undefined,
      nameKo: (fd.get('nameKo') as string).trim() || undefined,
      category,
      region: fd.get('region') as Region,
      address: (fd.get('address') as string).trim() || undefined,
      addressKo: (fd.get('addressKo') as string).trim() || undefined,
      addressEn: (fd.get('addressEn') as string).trim() || undefined,
      phone: (fd.get('phone') as string).trim() || undefined,
      website: (fd.get('website') as string).trim() || undefined,
      websiteLabel: (fd.get('websiteLabel') as string).trim() || undefined,
      features: (fd.get('features') as string)
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      notes: (fd.get('notes') as string)
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      photos: (fd.get('photos') as string)
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      status: (fd.get('status') as 'open' | 'closed') || undefined,
    }

    const hoursStr = (fd.get('hours') as string).trim()

    let spot: Spot
    if (category === 'attraction') {
      spot = {
        ...base,
        category: 'attraction',
        hours: hoursStr
          ? hoursStr.split('\n').map((s) => s.trim()).filter(Boolean)
          : undefined,
        admission: (fd.get('admission') as string).trim() || undefined,
        bestTime: (fd.get('bestTime') as string).trim() || undefined,
        recommendedTime: (fd.get('recommendedTime') as string).trim() || undefined,
      } as Spot
    } else if (category === 'cafe') {
      spot = {
        ...base,
        category: 'cafe',
        hours: hoursStr || undefined,
        bestTime: (fd.get('bestTime') as string).trim() || undefined,
      } as Spot
    } else if (category === 'restaurant') {
      spot = {
        ...base,
        category: 'restaurant',
        hours: hoursStr || undefined,
      } as Spot
    } else {
      spot = base as Spot
    }

    onSubmit(spot)
  }

  const inputClass =
    'w-full px-4 py-3 bg-card border border-border rounded-[14px] text-[14px] text-ink placeholder:text-muted-light focus:outline-none focus:border-teal-mid transition-colors'
  const labelClass = 'block text-[12px] font-semibold text-ink mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label className={labelClass}>Name *</label>
          <input name="name" defaultValue={initial?.name} required className={inputClass} placeholder="Spot name" />
        </div>
        <div>
          <label className={labelClass}>Name (Korean)</label>
          <input name="nameKo" defaultValue={initial?.nameKo} className={inputClass} placeholder="한국어 이름" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Name (Chinese)</label>
        <input name="nameZh" defaultValue={initial?.nameZh} className={inputClass} placeholder="中文名稱" />
      </div>

      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label className={labelClass}>Category *</label>
          <select name="category" defaultValue={initial?.category || 'attraction'} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Region *</label>
          <select name="region" defaultValue={initial?.region || 'east'} className={inputClass}>
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Address</label>
        <input name="address" defaultValue={initial?.address} className={inputClass} placeholder="Address" />
      </div>

      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label className={labelClass}>Address (Korean)</label>
          <input name="addressKo" defaultValue={initial?.addressKo} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Address (English)</label>
          <input name="addressEn" defaultValue={initial?.addressEn} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label className={labelClass}>Phone</label>
          <input name="phone" defaultValue={initial?.phone} className={inputClass} placeholder="064-xxx-xxxx" />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={initial?.status || ''} className={inputClass}>
            <option value="">—</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Website</label>
        <input name="website" defaultValue={initial?.website} className={inputClass} placeholder="https://..." />
      </div>

      <div>
        <label className={labelClass}>Website Label</label>
        <input name="websiteLabel" defaultValue={initial?.websiteLabel} className={inputClass} placeholder="Display text for link" />
      </div>

      <div>
        <label className={labelClass}>Features (one per line)</label>
        <textarea name="features" defaultValue={initial?.features?.join('\n')} rows={3} className={inputClass} placeholder="Key highlights, one per line" />
      </div>

      <div>
        <label className={labelClass}>Notes (one per line)</label>
        <textarea name="notes" defaultValue={initial?.notes?.join('\n')} rows={2} className={inputClass} placeholder="Visitor tips, one per line" />
      </div>

      <div>
        <label className={labelClass}>Hours (one per line, or single line for cafe/restaurant)</label>
        <textarea name="hours" rows={2} className={inputClass} placeholder="e.g. 09:00-18:00" defaultValue={
          Array.isArray((initial as { hours?: string | string[] })?.hours)
            ? ((initial as { hours?: string[] }).hours || []).join('\n')
            : ((initial as { hours?: string })?.hours || '')
        } />
      </div>

      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label className={labelClass}>Admission</label>
          <input name="admission" defaultValue={(initial as { admission?: string })?.admission} className={inputClass} placeholder="e.g. ₩5,000" />
        </div>
        <div>
          <label className={labelClass}>Best Time</label>
          <input name="bestTime" defaultValue={(initial as { bestTime?: string })?.bestTime} className={inputClass} placeholder="e.g. Sunrise" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Recommended Visit Duration</label>
        <input name="recommendedTime" defaultValue={(initial as { recommendedTime?: string })?.recommendedTime} className={inputClass} placeholder="e.g. 1.5-2 hours" />
      </div>

      <div>
        <label className={labelClass}>Photo URLs (one per line)</label>
        <textarea name="photos" defaultValue={initial?.photos?.join('\n')} rows={3} className={inputClass} placeholder="/photos/attraction/example.jpg" />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-3 bg-teal-dark text-white rounded-[13px] text-[13px] font-semibold cursor-pointer border-none hover:opacity-90 transition-opacity"
        >
          {submitLabel}
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

export default SpotForm
