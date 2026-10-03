import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

function Header() {
  const location = useLocation()
  const { user, signInWithPassword, signOut, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showSignIn, setShowSignIn] = useState(false)
  const [signInError, setSignInError] = useState<string | null>(null)

  const navItems = [
    { path: '/', label: 'Schedule' },
    { path: '/spots', label: 'Saved spots' },
    { path: '/notes', label: 'Island notes' },
  ]

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignInError(null)
    const { error } = await signInWithPassword(email, password)
    if (error) {
      setSignInError(error)
    } else {
      setShowSignIn(false)
      setEmail('')
      setPassword('')
    }
  }

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

      <div className="flex items-center gap-3 max-[640px]:ml-auto max-[640px]:gap-2">
        {!authLoading && user && (
          <>
            <div className="flex items-center gap-2 px-3.5 py-2 bg-bg rounded-pill text-[12px] font-semibold max-[640px]:hidden">
              <span>Oct 25 – 30, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted max-w-[120px] truncate max-[640px]:hidden">{user.email}</span>
              <button
                onClick={signOut}
                className="px-3 py-1.5 text-[11px] font-semibold text-muted border border-border rounded-pill cursor-pointer bg-card hover:text-ink transition-colors"
              >
                Sign out
              </button>
            </div>
          </>
        )}
        {!authLoading && !user && (
            <div className="relative">
              {showSignIn ? (
                <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-card p-4 shadow-[0_8px_24px_#15323a14] w-[280px] z-30">
                  <form onSubmit={handleSignIn} className="flex flex-col gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-3 py-2 bg-bg border border-border rounded-[10px] text-[13px] text-ink placeholder:text-muted-light focus:outline-none focus:border-teal-mid"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full px-3 py-2 bg-bg border border-border rounded-[10px] text-[13px] text-ink placeholder:text-muted-light focus:outline-none focus:border-teal-mid"
                    />
                    {signInError && (
                      <p className="text-[11px] text-red-600 m-0">{signInError}</p>
                    )}
                    <button
                      type="submit"
                      className="px-3 py-2 bg-teal-dark text-white rounded-[10px] text-[12px] font-semibold cursor-pointer border-none hover:opacity-90 transition-opacity"
                    >
                      Sign in
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowSignIn(false); setSignInError(null) }}
                      className="px-3 py-1 text-[11px] text-muted cursor-pointer bg-transparent border-none hover:text-ink"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setShowSignIn(true)}
                  className="w-[38px] h-[38px] rounded-full bg-amber-light text-amber flex items-center justify-center text-[12px] font-bold cursor-pointer border-none"
                >
                  CJ
                </button>
              )}
            </div>
        )}
      </div>
    </header>
  )
}

export default Header
