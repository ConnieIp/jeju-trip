import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Schedule' },
    { path: '/spots', label: 'Saved spots' },
  ]

  return (
    <header className="flex items-center justify-between px-8 py-3.5 border-b border-border bg-card sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-3 no-underline">
        <div className="w-9 h-9 bg-ink rounded-[10px] flex items-center justify-center">
          <div className="w-3.5 h-3.5 bg-amber rounded-full" />
        </div>
        <div className="flex flex-col text-left">
          <b className="text-base font-bold text-ink tracking-tight">JEJU / in between</b>
          <small className="text-[10px] text-muted tracking-widest font-medium">TRIP FIELD NOTES</small>
        </div>
      </Link>

      <nav className="flex gap-1">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2 rounded-pill text-sm font-medium no-underline transition-colors ${
              location.pathname === item.path
                ? 'bg-teal-light text-teal-dark font-semibold'
                : 'text-muted hover:text-ink'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-bg rounded-pill text-[13px] font-medium">
          <span>Oct 25 – 30, 2026</span>
        </div>
        <div className="w-[34px] h-[34px] rounded-full bg-amber-light text-amber flex items-center justify-center text-xs font-bold">
          CJ
        </div>
      </div>
    </header>
  )
}

export default Header
