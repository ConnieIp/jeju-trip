interface AccommodationFormProps {
  initial?: { name: string; slug: string; night: string; addressKo?: string; addressEn?: string; bookingUrl?: string }
  onSubmit: (data: { name: string; slug: string; night: string; addressKo?: string; addressEn?: string; bookingUrl?: string }) => void
  onCancel: () => void
}

function AccommodationForm({ initial, onSubmit, onCancel }: AccommodationFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const addressKo = (fd.get('addressKo') as string).trim()
    const addressEn = (fd.get('addressEn') as string).trim()
    const bookingUrl = (fd.get('bookingUrl') as string).trim()
    onSubmit({
      name: (fd.get('name') as string).trim(),
      slug: (fd.get('slug') as string).trim(),
      night: (fd.get('night') as string).trim(),
      addressKo: addressKo || undefined,
      addressEn: addressEn || undefined,
      bookingUrl: bookingUrl || undefined,
    })
  }

  const inputClass =
    'w-full px-4 py-3 bg-card border border-border rounded-[14px] text-[14px] text-ink placeholder:text-muted-light focus:outline-none focus:border-teal-mid transition-colors'
  const labelClass = 'block text-[12px] font-semibold text-ink mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className={labelClass}>Name *</label>
        <input name="name" defaultValue={initial?.name} required className={inputClass} placeholder="e.g. Stay_stressless" />
      </div>

      <div>
        <label className={labelClass}>Slug *</label>
        <input name="slug" defaultValue={initial?.slug} required className={inputClass} placeholder="e.g. stay-stressless" />
      </div>

      <div>
        <label className={labelClass}>Night *</label>
        <input name="night" defaultValue={initial?.night} required className={inputClass} placeholder="e.g. Night 1" />
      </div>

      <div>
        <label className={labelClass}>Address (Korean)</label>
        <input name="addressKo" defaultValue={initial?.addressKo} className={inputClass} placeholder="제주 제주시 ..." />
      </div>

      <div>
        <label className={labelClass}>Address (English)</label>
        <input name="addressEn" defaultValue={initial?.addressEn} className={inputClass} placeholder="30-7, Sinchonbuk 3-gil, Jeju-si" />
      </div>

      <div>
        <label className={labelClass}>Reservation Link</label>
        <input name="bookingUrl" defaultValue={initial?.bookingUrl} className={inputClass} placeholder="https://..." />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-3 bg-teal-dark text-white rounded-[13px] text-[13px] font-semibold cursor-pointer border-none hover:opacity-90 transition-opacity"
        >
          {initial ? 'Save Changes' : 'Add Accommodation'}
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

export default AccommodationForm
