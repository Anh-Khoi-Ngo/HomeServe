/**
 * GeoDB Cities API → city search.
 * Requires a free RapidAPI key in .env (VITE_GEO_DB_KEY).
 * Falls back to a built-in city list so search works without a key.
 */

const GEO_DB_KEY = import.meta.env.VITE_GEO_DB_KEY
const GEO_DB_HOST = 'wft-geo-db.p.mashape.com'

const FALLBACK_CITIES = [
  { id: 1, name: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832 },
  { id: 2, name: 'Vancouver', country: 'Canada', lat: 49.2827, lon: -123.1207 },
  { id: 3, name: 'Montreal', country: 'Canada', lat: 45.5019, lon: -73.5674 },
  { id: 4, name: 'Calgary', country: 'Canada', lat: 51.0447, lon: -114.0719 },
  { id: 5, name: 'Ottawa', country: 'Canada', lat: 45.4215, lon: -75.6972 },
  { id: 6, name: 'Edmonton', country: 'Canada', lat: 53.5461, lon: -113.4938 },
  { id: 7, name: 'Halifax', country: 'Canada', lat: 44.6488, lon: -63.5752 },
  { id: 8, name: 'Seattle', country: 'United States', lat: 47.6062, lon: -122.3321 },
  { id: 9, name: 'Chicago', country: 'United States', lat: 41.8781, lon: -87.6298 },
  { id: 10, name: 'Austin', country: 'United States', lat: 30.2672, lon: -97.7431 },
  { id: 11, name: 'Denver', country: 'United States', lat: 39.7392, lon: -104.9903 },
  { id: 12, name: 'Boston', country: 'United States', lat: 42.3601, lon: -71.0589 },
  { id: 13, name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { id: 14, name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
]

export async function searchCities(query) {
  if (!query || query.trim().length < 2) return []

  if (GEO_DB_KEY) {
    try {
      const url = `https://${GEO_DB_HOST}/v1/geo/cities?namePrefix=${encodeURIComponent(query)}&limit=8&sort=-population&hateoasMode=false`
      const res = await fetch(url, {
        headers: { 'X-RapidAPI-Key': GEO_DB_KEY, 'X-RapidAPI-Host': GEO_DB_HOST },
      })
      if (!res.ok) throw new Error('GeoDB error')
      const data = await res.json()
      return (data.data || []).map((c) => ({
        id: c.id,
        name: c.name,
        country: c.country,
        lat: c.latitude,
        lon: c.longitude,
      }))
    } catch {
      /* fall through to local list */
    }
  }

  // No key or API failure → filter the local list
  const q = query.toLowerCase()
  return FALLBACK_CITIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
  ).slice(0, 8)
}
