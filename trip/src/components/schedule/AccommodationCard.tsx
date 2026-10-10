import { useState } from 'react'

interface AccommodationCardProps {
  name: string
  photo?: string
  variant: 'checkin' | 'checkout'
  addressKo?: string
  addressEn?: string
  bookingUrl?: string
  onEdit?: () => void
  onDelete?: () => void
}

function AccommodationCard({ name, photo, variant, addressKo, addressEn, bookingUrl, onEdit, onDelete }: AccommodationCardProps) {
  const [expanded, setExpanded] = useState(false)
  const label = variant === 'checkin' ? 'Check-in' : 'Check-out'
  const icon = variant === 'checkin' ? '🌙' : '☀️'
  const hasDetails = !!addressKo || !!addressEn || !!bookingUrl

  return (
    <div className="relative group">
      <div
        onClick={() => hasDetails && setExpanded(!expanded)}
        className={`flex items-center gap-[18px] p-[14px] bg-card border border-border rounded-card-sm ${hasDetails ? 'cursor-pointer' : ''} hover:shadow-md transition-shadow text-ink min-h-[100px] shadow-[0_8px_24px_#15323a0d] max-[640px]:gap-2.5 max-[640px]:p-2.5 max-[640px]:min-h-[82px]`}
      >
        {photo && (
          <img src={photo} alt={name} className="w-[120px] h-[80px] rounded-[15px] object-cover flex-shrink-0 max-[640px]:w-[68px] max-[640px]:h-[68px]" />
        )}
        <div className="flex flex-col flex-1 min-w-0 gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-pill text-[12px] font-semibold leading-none text-teal bg-teal-light border border-border w-fit">
            <span className="text-[13px]">{icon}</span>
            {label}
          </span>
          <b className="text-teal text-[17px] font-bold block truncate max-[640px]:text-[14px]">{name}</b>
          {hasDetails && (
            <span className="text-[11px] text-muted-light">{expanded ? 'Hide details' : 'Show details'}</span>
          )}
        </div>
      </div>

      {expanded && hasDetails && (
        <div className="mt-2 px-4 py-3 bg-bg border border-border rounded-[12px] flex flex-col gap-2 text-[13px]">
          {addressKo && (
            <div className="flex items-start gap-2">
              <span className="text-[14px] mt-px flex-shrink-0">📍</span>
              <span className="text-ink-light leading-[1.5]">{addressKo}</span>
            </div>
          )}
          {addressEn && (
            <div className="flex items-start gap-2">
              <span className="text-[14px] mt-px flex-shrink-0">📍</span>
              <span className="text-muted leading-[1.5] text-[12px]">{addressEn}</span>
            </div>
          )}
          {bookingUrl && (
            <div className="flex items-center gap-2">
              <span className="text-[14px] flex-shrink-0">🔗</span>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-bright underline underline-offset-2 text-[12px] font-semibold hover:text-teal transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Reservation Link
              </a>
            </div>
          )}
        </div>
      )}

      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 max-[640px]:opacity-100 transition-opacity">
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
      )}
    </div>
  )
}

export default AccommodationCard
