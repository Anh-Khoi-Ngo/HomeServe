import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { UserButton } from '@clerk/react'
import { useAppUser } from '../context/AuthContext.jsx'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/providers', label: 'Providers' },
  { to: '/bookings', label: 'My Bookings' },
  { to: '/favorites', label: 'Favorites' },
]

export default function Navbar() {
  const { isSignedIn, user, signOut, authType, openSignIn, openSignUp } = useAppUser()
  const [open, setOpen] = useState(false)
  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-primary/10 text-primary-dark'
        : 'text-ink-soft hover:bg-fog hover:text-primary-dark'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src="/homeserve-logo.png" alt="HomeServe logo" className="h-9 w-auto" />
          <span className="text-lg font-extrabold tracking-tight text-primary-dark">
            Home<span className="text-primary">Serve</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {authType === 'clerk' && isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <>
              <button
                type="button"
                onClick={() => openSignUp('/')}
                disabled={authType !== 'clerk'}
                title={authType !== 'clerk' ? 'Clerk not configured — add your key to .env' : 'Create a free account'}
                className="hidden rounded-full border-2 border-primary px-5 py-2 text-sm font-bold text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 md:block"
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => openSignIn('/')}
                disabled={authType !== 'clerk'}
                title={authType !== 'clerk' ? 'Clerk not configured — add your key to .env' : 'Sign in to your account'}
                className="hidden rounded-full bg-primary px-5 py-2 text-sm font-bold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 md:block"
              >
                Sign in
              </button>
            </>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-fog md:hidden"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    isActive ? 'bg-primary/10 text-primary-dark' : 'text-ink-soft hover:bg-fog'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 grid gap-2 border-t border-gray-100 pt-3">
              {!isSignedIn && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      openSignUp('/')
                      setOpen(false)
                    }}
                    disabled={authType !== 'clerk'}
                    className="rounded-xl border-2 border-primary px-4 py-2.5 text-sm font-bold text-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Sign up
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      openSignIn('/')
                      setOpen(false)
                    }}
                    disabled={authType !== 'clerk'}
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Sign in
                  </button>
                </>
              )}
              {isSignedIn && (
                <button
                  onClick={() => {
                    signOut()
                    setOpen(false)
                  }}
                  className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-accent hover:bg-accent/5"
                >
                  Sign out {user?.name ? `(${user.name})` : ''}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
