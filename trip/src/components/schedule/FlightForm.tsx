import type { FlightInfo } from '../../data/types'

interface FlightFormProps {
  initial?: FlightInfo
  onSubmit: (data: FlightInfo) => void
  onCancel: () => void
}

function FlightForm({ initial, onSubmit, onCancel }: FlightFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const departureTerminal = (fd.get('departureTerminal') as string).trim()
    const arrivalTerminal = (fd.get('arrivalTerminal') as string).trim()
    onSubmit({
      flightNumber: (fd.get('flightNumber') as string).trim(),
      departure: (fd.get('departure') as string).trim(),
      arrival: (fd.get('arrival') as string).trim(),
      departureTime: (fd.get('departureTime') as string).trim(),
      arrivalTime: (fd.get('arrivalTime') as string).trim(),
      departureTerminal: departureTerminal || undefined,
      arrivalTerminal: arrivalTerminal || undefined,
    })
  }

  const inputClass =
    'w-full px-4 py-3 bg-card border border-border rounded-[14px] text-[14px] text-ink placeholder:text-muted-light focus:outline-none focus:border-teal-mid transition-colors'
  const labelClass = 'block text-[12px] font-semibold text-ink mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className={labelClass}>Flight Number *</label>
        <input name="flightNumber" defaultValue={initial?.flightNumber} required className={inputClass} placeholder="e.g. TW701" />
      </div>

      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label className={labelClass}>Departure *</label>
          <input name="departure" defaultValue={initial?.departure} required className={inputClass} placeholder="e.g. Taipei" />
        </div>
        <div>
          <label className={labelClass}>Arrival *</label>
          <input name="arrival" defaultValue={initial?.arrival} required className={inputClass} placeholder="e.g. Jeju" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label className={labelClass}>Departure Time *</label>
          <input name="departureTime" defaultValue={initial?.departureTime} required className={inputClass} placeholder="e.g. 06:00" />
        </div>
        <div>
          <label className={labelClass}>Arrival Time *</label>
          <input name="arrivalTime" defaultValue={initial?.arrivalTime} required className={inputClass} placeholder="e.g. 10:30" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label className={labelClass}>Departure Terminal</label>
          <input name="departureTerminal" defaultValue={initial?.departureTerminal} className={inputClass} placeholder="e.g. Terminal 2" />
        </div>
        <div>
          <label className={labelClass}>Arrival Terminal</label>
          <input name="arrivalTerminal" defaultValue={initial?.arrivalTerminal} className={inputClass} placeholder="e.g. Terminal 1" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-3 bg-teal-dark text-white rounded-[13px] text-[13px] font-semibold cursor-pointer border-none hover:opacity-90 transition-opacity"
        >
          {initial ? 'Save Changes' : 'Add Flight'}
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

export default FlightForm
