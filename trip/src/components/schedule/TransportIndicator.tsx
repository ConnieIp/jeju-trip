import { useState, useRef, useEffect } from 'react'
import type { ScheduleStop, TransportMode } from '../../data/types'

interface TransportIndicatorProps {
  stop: ScheduleStop
  isLast?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

function detectTransportMode(stop: ScheduleStop): TransportMode {
  if (stop.transportMode) return stop.transportMode
  const text = `${stop.title} ${stop.description}`.toLowerCase()
  if (text.includes('ferry') || text.includes('渡輪') || text.includes('boat') || text.includes('ship')) return 'ferry'
  if (text.includes('walk')) return 'walk'
  if (text.includes('bus')) return 'bus'
  if (text.includes('bike') || text.includes('cycle')) return 'bike'
  if (text.includes('taxi') || text.includes('cab')) return 'taxi'
  return 'drive'
}

function TransportIcon({ mode }: { mode: TransportMode }) {
  const cls = "w-[14px] h-[14px]"
  switch (mode) {
    case 'drive':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 17h14l-1.5-5h-11L5 17Z" />
          <path d="M3 17h18v2H3z" />
          <circle cx="7.5" cy="19.5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="19.5" r="1.5" fill="currentColor" stroke="none" />
          <path d="M7 12l1-3h8l1 3" />
        </svg>
      )
    case 'walk':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4" r="2" />
          <path d="M14 10l-2 8-2.5 4" />
          <path d="M10 10l-2 6 3 2" />
          <path d="M10 10l4 0" />
        </svg>
      )
    case 'bus':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="16" rx="2" />
          <path d="M4 11h16" />
          <path d="M12 3v8" />
          <circle cx="8" cy="16" r="1" fill="currentColor" stroke="none" />
          <circle cx="16" cy="16" r="1" fill="currentColor" stroke="none" />
          <path d="M6 19v2M18 19v2" />
        </svg>
      )
    case 'ferry':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v10" />
          <path d="M7 8l5-5 5 5" />
          <path d="M4 17l2-4h12l2 4" />
          <path d="M2 21c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
        </svg>
      )
    case 'taxi':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 17h14l-1.5-5h-11L5 17Z" />
          <path d="M3 17h18v2H3z" />
          <circle cx="7.5" cy="19.5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="19.5" r="1.5" fill="currentColor" stroke="none" />
          <rect x="9" y="2" width="6" height="3" rx="1" />
          <path d="M7 12l1-3h8l1 3" />
        </svg>
      )
    case 'bike':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="17" r="3" />
          <circle cx="18" cy="17" r="3" />
          <path d="M6 17l4-8h5l3 8" />
          <path d="M10 9l2-4h3" />
        </svg>
      )
  }
}

const MODE_LABELS: Record<TransportMode, string> = {
  drive: 'Drive',
  walk: 'Walk',
  bus: 'Bus',
  ferry: 'Ferry',
  taxi: 'Taxi',
  bike: 'Bike',
}

function TransportIndicator({ stop, isLast, onEdit, onDelete }: TransportIndicatorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const mode = detectTransportMode(stop)
  const duration = stop.description || ''

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="group grid grid-cols-[74px_16px_1fr] gap-3 relative max-[640px]:grid-cols-[48px_12px_1fr] max-[640px]:gap-[7px]" style={{ marginBottom: isLast ? 0 : '18px' }}>
      <div />
      <div className="flex justify-center">
        <div className="w-[11px] h-[11px] rounded-full bg-white border-[3px] border-teal-bright flex-shrink-0 z-[1]" style={{ marginTop: '6px' }} />
      </div>
      <div className="relative" ref={ref}>
        <div className="inline-flex items-center">
          <button
            onClick={() => setOpen(o => !o)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-light/50 border border-teal/20 text-teal-dark text-[11px] font-semibold cursor-pointer hover:bg-teal-light/80 transition-colors"
            title={stop.title}
          >
            <TransportIcon mode={mode} />
            <span>{duration}</span>
          </button>

          {(onEdit || onDelete) && (
            <div className="flex gap-1 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit() }}
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-card border border-border text-muted text-[10px] cursor-pointer hover:border-teal-mid hover:text-teal transition-colors"
                  title="Edit"
                >
                  ✎
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete() }}
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-card border border-border text-muted text-[10px] cursor-pointer hover:border-red-500 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {open && (
          <div className="absolute top-full left-0 mt-1.5 z-20 min-w-[180px] p-3 bg-card border border-border rounded-[12px] shadow-[0_8px_24px_#15323a1a]">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-teal-light flex items-center justify-center text-teal-dark">
                <TransportIcon mode={mode} />
              </div>
              <span className="text-[13px] font-bold text-ink">{MODE_LABELS[mode]}</span>
            </div>
            {stop.title && (
              <p className="text-[12px] text-ink mb-1">{stop.title}</p>
            )}
            {duration && (
              <p className="text-[11px] text-muted">{duration}</p>
            )}
            {stop.note && (
              <p className="text-[11px] text-muted mt-1">{stop.note}</p>
            )}
          </div>
        )}
      </div>
      {!isLast && (
        <div className="absolute top-[14px] bottom-[-22px] left-[94px] w-px bg-connector max-[640px]:left-[60px]" />
      )}
    </div>
  )
}

export default TransportIndicator
