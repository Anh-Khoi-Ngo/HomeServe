import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getService } from '../data/services.js'
import { fetchReviews, fetchProviders } from '../services/dummyjson.js'
import { toggleFavorite, isFavorite } from '../services/storage.js'
import { useAppUser } from '../context/AuthContext.jsx'
import StarRating from '../components/StarRating.jsx'
import ProviderCard from '../components/ProviderCard.jsx'

export default function ServiceDetailPage() {
  const { id } = useParams()
  const service = getService(id)
  const { user, isSignedIn } = useAppUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [reviews, setReviews] = useState([])
  const [providers, setProviders] = useState([])
  const [fav, setFav] = useState(() => isFavorite(user?.id, id))

  useEffect(() => {
    let active = true
    fetchReviews(id, service?.name).then((r) => active && setReviews(r))
    fetchProviders().then((p) => active && setProviders(p.filter((x) => x.service === id)))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id])

  if (!service) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-5xl">🤔</p>
        <h1 className="mt-4 text-2xl font-bold text-ink">Service not found</h1>
        <Link to="/services" className="mt-4 inline-block font-bold text-primary hover:text-primary-dark">
          ← Back to all services
        </Link>
      </div>
    )
  }

  const handleFav = () => {
    if (!isSignedIn) {
      navigate('/sign-in', { state: { from: location.pathname } })
      return
    }
    setFav(toggleFavorite(user.id, service.id).includes(service.id))
  }

  return (
    <div className="page-enter mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-mist">
        <Link to="/" className="transition hover:text-primary">Home</Link>
        <span className="mx-1">/</span>
        <Link to="/services" className="transition hover:text-primary">Services</Link>
        <span className="mx-1">/</span>
        <span className="text-ink-soft">{service.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* ------- Left: details ------- */}
        <div>
          <div className="overflow-hidden rounded-3xl bg-linear-to-br from-primary-light via-white to-fog p-10 text-center">
            <span className="text-7xl drop-shadow">{service.emoji}</span>
            <h1 className="mt-4 text-4xl font-extrabold text-ink">{service.name}</h1>
            <p className="mt-2 text-lg font-medium text-primary-dark">{service.tagline}</p>
          </div>

          {/* Description */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-ink">About this service</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{service.description}</p>
          </section>

          {/* What's included */}
          <section className="mt-8 rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-ink">What's included</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-xs font-bold text-success">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Customer reviews */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink">Customer reviews</h2>
              <StarRating rating={4.8} showValue />
            </div>
            <div className="mt-4 space-y-4">
              {reviews.length === 0 && (
                <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-mist">
                  Loading reviews…
                </p>
              )}
              {reviews.map((r, i) => (
                <div key={i} className="rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary-dark">
                        {r.user?.[0]?.toUpperCase() || 'R'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink">{r.user}</p>
                        <p className="text-xs text-mist">{r.date}</p>
                      </div>
                    </div>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">“{r.text}”</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ------- Right: booking card ------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-gray-200/70 bg-white p-6 shadow-xl shadow-primary/5">
            <p className="text-sm font-semibold text-mist">Starting at</p>
            <p className="mt-1 text-3xl font-extrabold text-primary-dark">{service.priceRange}</p>
            <div className="mt-3 space-y-2 text-sm text-ink-soft">
              <p>⏱️ Typical job: <strong className="text-ink">{service.duration}</strong></p>
              <p>⭐ <strong className="text-ink">4.8</strong> average from {120 + service.avgPrice * 2} reviews</p>
              <p>🛡️ Insured &amp; background-checked</p>
            </div>
            <div className="mt-5 flex flex-col gap-2.5">
              <Link
                to={`/book/${service.id}`}
                className="rounded-full bg-primary py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark hover:shadow-primary/40"
              >
                Book now →
              </Link>
              <button
                onClick={handleFav}
                className={`rounded-full border-2 py-3 text-sm font-bold transition ${
                  fav
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-gray-200 text-ink-soft hover:border-accent hover:text-accent'
                }`}
              >
                {!isSignedIn
                  ? '♡ Sign in to save'
                  : fav
                    ? '♥ Saved to favorites'
                    : '♡ Save to favorites'}
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-mist">
              Free cancellation up to 24h before the visit.
            </p>
          </div>

          {/* Providers for this service */}
          {providers.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 font-bold text-ink">Pros for {service.name.toLowerCase()}</h3>
              <div className="space-y-3">
                {providers.slice(0, 3).map((p) => (
                  <ProviderCard key={p.id} provider={p} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
