import { useEffect, useRef, useState } from 'react'
import { searchCities } from '../services/geodb.js'

export default function CitySearch({ label, placeholder, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        if (!cancelled) {
          setResults([])
          setOpen(false)
          setLoading(false)
        }
        return
      }
      setLoading(true)
      const cities = await searchCities(query)
      if (!cancelled) {
        setResults(cities)
        setOpen(true)
        setLoading(false)
      }
    }, 350)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  const pick = (city) => {
    onSelect?.(city)
    setQuery(city.name + (city.country ? `, ${city.country}` : ''))
    setOpen(false)
  }

  return (
    <div ref={boxRef} className="relative w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-ink-soft">{label}</label>
      )}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder={placeholder || 'Search for a city…'}
          className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-10 text-sm text-ink shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {loading && (
          <span className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          {results.map((c) => (
            <li key={c.id ?? c.name + c.lat}>
              <button
                type="button"
                onClick={() => pick(c)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-primary/5"
              >
                <span className="font-semibold text-ink">{c.name}</span>
                <span className="text-xs text-mist">📍 {c.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
