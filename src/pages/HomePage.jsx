import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CitySearch from '../components/CitySearch.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import ProviderCard from '../components/ProviderCard.jsx'
import { SERVICES } from '../data/services.js'
import { fetchProviders } from '../services/dummyjson.js'

export default function HomePage() {
  const [city, setCity] = useState(null)
  const [providers, setProviders] = useState([])

  useEffect(() => {
    let active = true
    fetchProviders().then((p) => active && setProviders(p.slice(0, 4)))
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="page-enter">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-dark via-primary to-primary-light">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
              ⚡ Book trusted home pros in under a minute
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
              Your home, <span className="text-primary-light">handled.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              Cleaning, plumbing, electrical, lawn care, snow removal, painting, and
              handyman services — vetted pros, upfront pricing, and reviews you can trust.
            </p>

            {/* City search (GeoDB Cities) */}
            <div className="mt-8 max-w-md">
              <p className="mb-2 text-sm font-semibold text-white/80">
                🏙️ Where do you need help?
              </p>
              <CitySearch
                onSelect={setCity}
                placeholder="Search cities (e.g. Toronto, Seattle)…"
              />
              {city && (
                <p className="mt-3 text-sm text-white/90">
                  Great — serving <strong>{city.name}, {city.country}</strong>!{' '}
                  <Link to="/services" className="font-bold underline underline-offset-4 hover:text-primary-light">
                    Browse services →
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Service categories ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-ink">What do you need done?</h2>
            <p className="mt-2 text-ink-soft">Seven categories, hundreds of vetted pros.</p>
          </div>
          <Link
            to="/services"
            className="hidden shrink-0 rounded-full border-2 border-primary px-5 py-2 text-sm font-bold text-primary transition hover:bg-primary hover:text-white sm:block"
          >
            All services
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICES.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
          {/* CTA tile completes the grid */}
          <Link
            to="/providers"
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center transition hover:border-primary hover:bg-primary/10"
          >
            <span className="text-5xl transition-transform duration-300 group-hover:scale-110">👋</span>
            <h3 className="mt-3 font-bold text-primary-dark">Meet the pros</h3>
            <p className="mt-1 text-sm text-ink-soft">Browse vetted providers, ratings &amp; completed jobs</p>
          </Link>
        </div>
      </section>

      {/* ---------- Featured providers (DummyJSON) ---------- */}
      {providers.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-ink">Top-rated providers</h2>
                <p className="mt-2 text-ink-soft">Real profiles, ratings, and job counts.</p>
              </div>
              <Link to="/providers" className="shrink-0 text-sm font-bold text-primary transition hover:text-primary-dark">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {providers.map((p) => (
                <ProviderCard key={p.id} provider={p} showService />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- How it works ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold text-ink">How HomeServe works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { icon: '🔎', title: '1. Find your service', text: 'Pick a category or provider and compare prices, ratings, and reviews.' },
            { icon: '📅', title: '2. Pick a time', text: 'Choose a date, time slot, and address — your pro gets it instantly.' },
            { icon: '✅', title: '3. Relax', text: 'Track your booking, get reminders, and rate the work when it’s done.' },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-gray-200/70 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-3xl">
                {step.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center justify-center gap-4 rounded-3xl bg-linear-to-r from-primary to-primary-dark p-10 text-center text-white sm:flex-row sm:text-left">
          <div className="flex-1">
            <h3 className="text-2xl font-extrabold">Ready to get it done?</h3>
            <p className="mt-1 text-white/80">Join thousands of homeowners booking pros online.</p>
          </div>
          <Link
            to="/sign-in"
            className="rounded-full bg-white px-8 py-3 text-sm font-bold text-primary-dark shadow-lg transition hover:scale-105"
          >
            Get started free →
          </Link>
        </div>
      </section>
    </div>
  )
}
