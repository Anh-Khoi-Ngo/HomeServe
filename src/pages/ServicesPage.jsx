import { Link } from 'react-router-dom'
import ServiceCard from '../components/ServiceCard.jsx'
import { SERVICES } from '../data/services.js'

export default function ServicesPage() {
  return (
    <div className="page-enter mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-mist">
        <Link to="/" className="transition hover:text-primary">Home</Link> <span className="mx-1">/</span>
        <span className="text-ink-soft">Services</span>
      </nav>

      <div className="mt-4 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-ink">Our services</h1>
        <p className="mt-3 text-lg text-ink-soft">
          Seven categories, one standard: vetted pros, upfront pricing, and a guarantee.
          Book any service in under a minute.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  )
}
