import type { ScheduleStop, Spot } from '../../data/types'
import StopCard from './StopCard'

interface TimelineRowProps {
  stop: ScheduleStop
  spot?: Spot
  isLast?: boolean
}

function TimelineRow({ stop, spot, isLast }: TimelineRowProps) {
  return (
    <div className="grid grid-cols-[74px_16px_1fr] gap-3 mb-[18px] relative max-[640px]:grid-cols-[48px_12px_1fr] max-[640px]:gap-[7px]">
      <div className="flex flex-col text-right pt-[18px]">
        <b className="text-[15px] font-bold">{stop.time}</b>
        {stop.endTime && <small className="text-[10px] text-muted-light mt-[3px]">{stop.endTime}</small>}
      </div>
      <div className="flex justify-center">
        <div className="w-[11px] h-[11px] rounded-full bg-white border-[3px] border-teal-bright mt-2 flex-shrink-0 z-[1]" />
      </div>
      <div>
        <StopCard stop={stop} spot={spot} />
      </div>
      {!isLast && (
        <div className="absolute top-4 bottom-[-22px] left-[94px] w-px bg-connector max-[640px]:left-[60px]" />
      )}
    </div>
  )
}

export default TimelineRow
