import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Schedule' },
    { path: '/spots', label: 'Saved spots' },
    { path: '/notes', label: 'Island notes' },
  ]

  return (
    <header className="flex items-center justify-between h-[78px] border-b border-border bg-card sticky top-0 z-20 max-[980px]:px-[18px] max-[640px]:flex-wrap max-[640px]:h-auto max-[640px]:min-h-[68px] max-[640px]:py-2.5 max-[640px]:px-3.5" style={{ padding: '0 max(40px, calc(50% - 655px))' }}>
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-[34px] h-[34px] bg-ink rounded-[10px] flex items-center justify-center">
          <div className="w-3.5 h-3.5 bg-amber rounded-full" />
        </div>
        <div className="flex flex-col text-left">
          <b className="text-[17px] font-bold text-ink tracking-[-0.3px] leading-[1.15] max-[640px]:text-[14px]">JEJU / in between</b>
          <small className="text-[10px] text-muted tracking-[1.5px] font-medium mt-0.5 max-[640px]:hidden">TRIP FIELD NOTES</small>
        </div>
      </Link>

      <nav className="flex gap-3 max-[640px]:order-3 max-[640px]:justify-center max-[640px]:w-full max-[640px]:mt-2">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`inline-block rounded-pill text-[13px] font-medium no-underline transition-colors max-[640px]:px-2.5 max-[640px]:py-[7px] max-[640px]:text-[11px] ${
              location.pathname === item.path
                ? 'bg-teal-light text-teal font-semibold'
                : 'text-muted hover:text-ink'
            }`}
            style={{ padding: '12px 20px' }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 max-[640px]:hidden">
        <div className="flex items-center gap-2 px-3.5 py-2 bg-bg rounded-pill text-[12px] font-semibold">
          <span>Oct 25 – 30, 2026</span>
        </div>
        <div className="w-[38px] h-[38px] rounded-full bg-amber-light text-amber flex items-center justify-center text-[12px] font-bold">
          CJ
        </div>
      </div>
    </header>
  )
}

export default Header
