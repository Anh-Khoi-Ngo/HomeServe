import { Link } from 'react-router-dom'
import StarRating from './StarRating.jsx'
import { getService } from '../data/services.js'

export default function ProviderCard({ provider, showService = false }) {
  const service = getService(provider.service)
  const initials = provider.name
    ?.split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const responseMin = ((provider.id * 13) % 40) + 10 // stable pseudo-random
  const topRated = provider.rating >= 4.8

  return (
    <Link
      to={`/providers/${provider.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/15"
    >
      {/* ------- Avatar + identity ------- */}
      <div className="flex items-center gap-4 px-5 pt-5">
        <div className="shrink-0">
          {provider.imageUrl ? (
            <img
              src={provider.imageUrl}
              alt={provider.name}
              className="h-20 w-20 rounded-2xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary-dark text-2xl font-extrabold text-white shadow-lg">
              {initials}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-extrabold text-ink">{provider.name}</h3>
            {topRated && (
              <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warning">
                ★ Top rated
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ------- Badges ------- */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 px-5">
        {showService && service ? (
          <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary-dark">
            {service.emoji} {service.name}
          </span>
        ) : (
          <span className="rounded-full bg-fog px-2.5 py-1 text-xs font-semibold text-ink-soft">
            ✓ Verified pro
          </span>
        )}
        <span className="rounded-full bg-fog px-2.5 py-1 text-xs font-semibold text-ink-soft">
          🛡️ Insured
        </span>
      </div>

      {/* ------- Rating row ------- */}
      <div className="mt-3 flex items-center gap-2 px-5">
        <StarRating rating={provider.rating} showValue />
        <span className="text-xs text-mist">· ~{responseMin} min response</span>
      </div>

      {/* ------- Skills + bio ------- */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-mist">Skills</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(provider.skills || []).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary-dark transition group-hover:border-primary/40 group-hover:bg-primary/10"
            >
              {skill}
            </span>
          ))}
        </div>
        {provider.bio && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">{provider.bio}</p>
        )}

        {/* ------- Footer ------- */}
        <div className="mt-auto flex items-center justify-between border-t border-dashed border-gray-200 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-mist">From</p>
            <p className="text-sm font-extrabold text-ink">{service?.priceRange || 'Check pricing'}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary/30 transition-all duration-300 group-hover:bg-primary-dark group-hover:shadow-primary/50">
            View profile
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
