interface RouteOverviewProps {
  route: string
  stopCount: number
  driveTime?: string
  distance?: string
  image?: string
}

function RouteOverview({ route, stopCount, driveTime, distance, image }: RouteOverviewProps) {
  return (
    <div className="bg-dark-card text-white rounded-card overflow-hidden shadow-[0_8px_24px_#15323a14]">
      {image && (
        <img src={image} alt="" className="w-full h-[190px] object-cover block" />
      )}
      <div className="p-5">
        <div className="flex justify-between items-center text-[17px]">
          <span>Day at a glance</span>
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </div>
        <p className="text-[13px] text-sidebar-muted mt-1">{route}</p>
        <dl className="flex justify-between mt-[14px]">
          <div className="flex flex-col gap-1">
            <dt className="text-[16px] font-bold">{stopCount}</dt>
            <dd className="text-[10px] text-sidebar-muted m-0">STOPS</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-[16px] font-bold">{driveTime || '—'}</dt>
            <dd className="text-[10px] text-sidebar-muted m-0">DRIVE</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-[16px] font-bold">{distance || '—'}</dt>
            <dd className="text-[10px] text-sidebar-muted m-0">DISTANCE</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default RouteOverview
