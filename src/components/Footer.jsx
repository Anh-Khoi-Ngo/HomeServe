import { Link } from 'react-router-dom'
import { SERVICES } from '../data/services.js'

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/homeserve-logo.png" alt="HomeServe logo" className="h-9 w-auto" />
            <span className="text-lg font-extrabold text-white">
              Home<span className="text-primary-light">Serve</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Vetted home service pros for every job — book online in under a minute.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/40">Services</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {SERVICES.slice(0, 5).map((s) => (
              <li key={s.id}>
                <Link to={`/services/${s.id}`} className="text-white/70 transition hover:text-primary-light">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/40">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/providers" className="transition hover:text-primary-light">Our providers</Link></li>
            <li><Link to="/bookings" className="transition hover:text-primary-light">My bookings</Link></li>
            <li><Link to="/favorites" className="transition hover:text-primary-light">Saved services</Link></li>
            <li><Link to="/sign-in" className="transition hover:text-primary-light">Sign in</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/40">Powered by</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>🔑 Clerk authentication</li>
            <li>📍 GeoDB Cities + OpenStreetMap</li>
            <li>👷 DummyJSON providers &amp; reviews</li>
            <li>🔥 Firebase bookings &amp; users</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} HomeServe. All rights reserved.
      </div>
    </footer>
  )
}
