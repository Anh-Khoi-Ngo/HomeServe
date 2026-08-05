import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProviders, fetchReviews } from '../services/dummyjson.js'
import { getService } from '../data/services.js'
import StarRating from '../components/StarRating.jsx'

export default function ProviderDetailPage() {
  const { id } = useParams()
  const [provider, setProvider] = useState(null)
  const [reviews, setReviews] = useState(null) // null = still loading

  useEffect(() => {
    let active = true
    fetchProviders().then((all) => {
      const found = all.find((p) => String(p.id) === String(id))
      if (!active) return
      setProvider(found || null)
      if (found?.service) {
        fetchReviews(found.service).then((r) => active && setReviews(r.slice(0, 4)))
      } else {
        setReviews([])
      }
    })
    return () => {
      active = false
    }
  }, [id])

  if (!provider) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-5xl">🔍</p>
        <h1 className="mt-4 text-2xl font-bold text-ink">Loading provider…</h1>
        <Link to="/providers" className="mt-4 inline-block font-bold text-primary hover:text-primary-dark">
          ← Back to providers
        </Link>
      </div>
    )
  }

  const service = getService(provider.service)

  return (
    <div className="page-enter mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-mist">
        <Link to="/" className="transition hover:text-primary">Home</Link>
        <span className="mx-1">/</span>
        <Link to="/providers" className="transition hover:text-primary">Providers</Link>
        <span className="mx-1">/</span>
        <span className="text-ink-soft">{provider.name}</span>
      </nav>

      <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-lg">
        {/* Banner */}
        <div className="h-36 bg-gradient-to-r from-primary to-primary-dark" />
        <div className="px-6 pb-8 sm:px-10">
          <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            {provider.imageUrl ? (
              <img
                src={provider.imageUrl}
                alt={provider.name}
                className="h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-primary to-primary-dark text-5xl font-extrabold text-white shadow-lg">
                {provider.name?.[0]?.toUpperCase()}
              </div>
            )}
            <Link
              to={`/book/${provider.service}?provider=${provider.id}`}
              className="rounded-full bg-primary px-7 py-3 text-center text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
            >
              Book {provider.name.split(' ')[0]} →
            </Link>
          </div>

          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold text-ink">{provider.name}</h1>
              {service && (
                <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary-dark">
                  {service.emoji} {service.name}
                </span>
              )}
            </div>
            <p className="mt-1 font-medium text-primary-dark">{provider.role}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-soft">
              <span className="flex items-center gap-1.5">
                <StarRating rating={provider.rating} showValue />
              </span>
              <span>✅ {provider.completedJobs} completed jobs</span>
              <span>🛡️ Insured &amp; background-checked</span>
            </div>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{provider.bio}</p>
          </div>
        </div>
      </div>

      {/* Skills + stats */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="font-bold text-ink">Skills &amp; specialties</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(provider.skills || []).map((s) => (
              <span key={s} className="rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-sm font-medium text-primary-dark">
                {s}
              </span>
            ))}
          </div>

          <h2 className="mt-8 font-bold text-ink">Recent completed jobs</h2>
          <ul className="mt-4 space-y-3">
            {[1, 2, 3].map((n) => (
              <li key={n} className="flex items-center justify-between rounded-xl border border-gray-100 bg-fog/60 px-4 py-3 text-sm">
                <span className="font-medium text-ink">
                  {service?.emoji} {service?.name} job — {provider.name.split(' ')[0]} handled it start to finish
                </span>
                <span className="text-xs text-mist">✓ Done</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-lg">
            <p className="text-sm text-white/70">Average rating</p>
            <p className="mt-1 text-4xl font-extrabold">{provider.rating.toFixed(1)}</p>
            <div className="mt-2">
              <StarRating rating={provider.rating} />
            </div>
            <p className="mt-4 text-sm text-white/80">
              Response time: <strong className="text-white">under 15 min</strong>
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-ink">Customer reviews</h3>
            {reviews === null && <p className="mt-3 text-sm text-mist">Loading…</p>}
            {reviews?.length === 0 && (
              <p className="mt-3 text-sm text-mist">No reviews yet — this pro is new to HomeServe.</p>
            )}
            {reviews?.map((r, i) => (
              <div key={i} className="mt-4 border-t border-gray-100 pt-4 first:border-0 first:pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink">{r.user}</p>
                  <StarRating rating={r.rating} size={13} />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">“{r.text.slice(0, 90)}…”</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
