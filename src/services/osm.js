/**
 * OpenStreetMap → maps + addresses.
 *  - geocodeAddress() turns a typed address into lat/lon (Nominatim, free).
 *  - mapEmbedUrl() builds an OpenStreetMap iframe for any lat/lon.
 */

const NOMINATIM = 'https://nominatim.openstreetmap.org/search'

export async function geocodeAddress(address) {
  if (!address || address.trim().length < 5) return null
  try {
    const url = `${NOMINATIM}?format=json&limit=1&q=${encodeURIComponent(address)}`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error('Nominatim error')
    const data = await res.json()
    if (!data.length) return null
    return { lat: Number(data[0].lat), lon: Number(data[0].lon), label: data[0].display_name }
  } catch {
    return null
  }
}

/** Search addresses for the autocomplete dropdown (Nominatim). */
export async function searchAddresses(query) {
  if (!query || query.trim().length < 4) return []
  try {
    const url = `${NOMINATIM}?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error('Nominatim error')
    const data = await res.json()
    return data.map((a) => ({
      label: a.display_name,
      lat: Number(a.lat),
      lon: Number(a.lon),
    }))
  } catch {
    return []
  }
}

export function mapEmbedUrl(lat, lon) {
  const d = 0.015
  const bbox = `${lon - d}%2C${lat - d}%2C${lon + d}%2C${lat + d}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`
}
