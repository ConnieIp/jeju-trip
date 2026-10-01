interface RouteOverviewProps {
  route: string
  stopCount: number
}

function RouteOverview({ route, stopCount }: RouteOverviewProps) {
  return (
    <div className="flex gap-3 p-4 bg-card border border-border rounded-card">
      <div className="flex-1">
        <div className="flex items-center gap-1.5 text-xs mb-2">
          <span className="text-muted font-medium">ROUTE OVERVIEW</span>
        </div>
        <p className="text-sm font-semibold mb-3">{route}</p>
        <dl className="grid grid-cols-3 gap-2">
          <div>
            <dt className="text-lg font-bold">{stopCount}</dt>
            <dd className="text-[10px] text-muted tracking-wide">STOPS</dd>
          </div>
          <div>
            <dt className="text-lg font-bold">6</dt>
            <dd className="text-[10px] text-muted tracking-wide">DAYS</dd>
          </div>
          <div>
            <dt className="text-lg font-bold">Self</dt>
            <dd className="text-[10px] text-muted tracking-wide">DRIVE</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default RouteOverview
