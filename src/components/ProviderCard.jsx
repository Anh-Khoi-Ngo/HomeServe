import { Link } from 'react-router-dom'
import StarRating from './StarRating.jsx'
import { getService } from '../data/services.js'

export default function ProviderCard({ provider, showService = false }) {
  const service = getService(provider.service)

  return (
    <Link
      to={`/providers/${provider.id}`}
      className="group rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="flex items-center gap-4">
        {provider.imageUrl ? (
          <img
            src={provider.imageUrl}
            alt={provider.name}
            className="h-16 w-16 shrink-0 rounded-full border-2 border-primary/20 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-dark text-xl font-extrabold text-white">
            {provider.name?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-bold text-ink">{provider.name}</h3>
            {showService && service && (
              <span className="rounded-full bg-fog px-2 py-0.5 text-[11px] font-bold text-ink-soft">
                {service.emoji} {service.name}
              </span>
            )}
          </div>
          <p className="text-sm text-primary-dark">{provider.role}</p>
          <div className="mt-0.5 flex items-center gap-2">
            <StarRating rating={provider.rating} showValue />
            <span className="text-xs text-mist">· {provider.completedJobs} jobs</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(provider.skills || []).slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary-dark"
          >
            {skill}
          </span>
        ))}
      </div>
    </Link>
  )
}
