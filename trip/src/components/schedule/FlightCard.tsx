interface FlightCardProps {
  flightNumber?: string
  departure?: string
  arrival?: string
  departureTime?: string
  arrivalTime?: string
  departureTerminal?: string
  arrivalTerminal?: string
  variant: 'departure' | 'arrival'
  onEdit?: () => void
  onDelete?: () => void
}

function FlightCard({ flightNumber, departure, arrival, departureTime, arrivalTime, departureTerminal, arrivalTerminal, variant, onEdit, onDelete }: FlightCardProps) {
  const label = variant === 'arrival' ? 'Arrival' : 'Departure'
  const icon = variant === 'arrival' ? '🛬' : '🛫'

  return (
    <div className="relative group">
      <div className="flex items-center gap-[18px] p-[14px] bg-card border border-border rounded-card-sm min-h-[100px] shadow-[0_8px_24px_#15323a0d] max-[640px]:gap-2.5 max-[640px]:p-2.5 max-[640px]:min-h-[82px]">
        <div className="w-[120px] h-[80px] rounded-[15px] bg-teal-light flex items-center justify-center flex-shrink-0 max-[640px]:w-[68px] max-[640px]:h-[68px]">
          <span className="text-[36px]">{icon}</span>
        </div>
        <div className="flex flex-col flex-1 min-w-0 gap-1.5">
          <span className="inline-flex items-center px-3 py-[7px] rounded-pill text-[12px] font-semibold leading-none text-muted-light bg-bg w-fit">
            {label}
          </span>
          <b className="text-teal text-[17px] font-bold block truncate max-[640px]:text-[14px]">
            {departure} → {arrival}
          </b>
          <div className="flex items-center gap-2 text-[11px] text-muted">
            {flightNumber && <span className="font-semibold">{flightNumber}</span>}
            {departureTime && arrivalTime && (
              <span>{departureTime} – {arrivalTime}</span>
            )}
          </div>
          {(departureTerminal || arrivalTerminal) && (
            <div className="flex items-center gap-2 text-[10px] text-muted-light">
              {departureTerminal && <span>Dep: {departureTerminal}</span>}
              {arrivalTerminal && <span>Arr: {arrivalTerminal}</span>}
            </div>
          )}
        </div>
      </div>
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 max-[640px]:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={onEdit}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-card border border-border text-muted text-[12px] cursor-pointer hover:border-teal-mid hover:text-teal transition-colors"
              title="Edit"
            >
              ✎
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
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

export default FlightCard
