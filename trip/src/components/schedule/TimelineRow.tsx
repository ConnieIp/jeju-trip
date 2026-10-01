import type { ScheduleStop, Spot } from '../../data/types'
import StopCard from './StopCard'

interface TimelineRowProps {
  stop: ScheduleStop
  spot?: Spot
  isLast?: boolean
}

function TimelineRow({ stop, spot, isLast }: TimelineRowProps) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="min-w-[60px] text-right">
        <b className="text-sm block">{stop.time}</b>
        {stop.endTime && <small className="text-[11px] text-muted">{stop.endTime}</small>}
      </div>
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-ink mt-1.5 flex-shrink-0" />
        {!isLast && <div className="w-0.5 flex-1 bg-border mt-2" />}
      </div>
      <div className="flex-1">
        <StopCard stop={stop} spot={spot} />
      </div>
    </div>
  )
}

export default TimelineRow
