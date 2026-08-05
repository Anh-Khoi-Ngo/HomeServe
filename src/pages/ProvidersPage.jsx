import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProviderCard from '../components/ProviderCard.jsx'
import { fetchProviders } from '../services/dummyjson.js'
import { SERVICES } from '../data/services.js'

export default function ProvidersPage() {
  const [providers, setProviders] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let active = true
    fetchProviders().then((p) => active && setProviders(p))
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(
    () =>
      providers.filter((p) => {
        const matchesService = filter === 'all' || p.service === filter
        const q = search.toLowerCase()
        const matchesSearch =
          !q || p.name.toLowerCase().includes(q) || (p.skills || []).some((s) => s.toLowerCase().includes(q))
        return matchesService && matchesSearch
      }),
    [providers, filter, search],
  )

  return (
    <div className="page-enter mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-mist">
        <Link to="/" className="transition hover:text-primary">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-ink-soft">Providers</span>
      </nav>

      <div className="mt-4 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-ink">Meet the pros</h1>
        <p className="mt-3 text-lg text-ink-soft">
          Every provider is vetted, insured, and rated by real customers after each job.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="chips-scroll flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
              filter === 'all' ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-white text-ink-soft hover:bg-primary/10'
            }`}
          >
            All
          </button>
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => setFilter(s.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                filter === s.id ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-white text-ink-soft hover:bg-primary/10'
              }`}
            >
              {s.emoji} {s.name}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or skill…"
          className="w-full rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 md:w-72"
        />
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProviderCard key={p.id} provider={p} showService />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-ink-soft">
          No providers match your filters. <button onClick={() => { setFilter('all'); setSearch('') }} className="font-bold text-primary hover:underline">Clear filters</button>
        </p>
      )}
    </div>
  )
}
