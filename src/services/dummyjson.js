/**
 * DummyJSON API → providers + reviews.
 * Fetches users as provider profiles and product reviews as customer reviews.
 * Falls back to local data if the network/API is unavailable.
 */

import { FALLBACK_PROVIDERS, getService } from '../data/services.js'

const API = 'https://dummyjson.com'

/** Deterministic pseudo-random numbers so data is stable between renders. */
function seeded(seed) {
  const x = Math.sin(seed * 999) * 10000
  return x - Math.floor(x)
}

/** Fetch provider profiles from DummyJSON users. */
export async function fetchProviders() {
  try {
    const res = await fetch(`${API}/users?limit=20&select=id,firstName,lastName,email,image,company`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    const serviceIds = ['cleaning', 'plumbing', 'electrical', 'lawn-care', 'snow-removal', 'painting', 'handyman']
    return data.users.map((u, i) => {
      const service = serviceIds[i % serviceIds.length]
      const skillPool = {
        cleaning: ['Deep cleaning', 'Move-out clean', 'Eco supplies', 'Organization'],
        plumbing: ['Repipes', 'Water heaters', 'Drain camera', 'Fixture install'],
        electrical: ['Panel upgrades', 'EV chargers', 'Recessed lighting', 'Smart home'],
        'lawn-care': ['Fertilization', 'Weed control', 'Seasonal cleanup', 'Irrigation'],
        'snow-removal': ['Plowing', 'De-icing', 'Storm response', 'Salting'],
        painting: ['Interior paint', 'Cabinets', 'Exterior paint', 'Color consulting'],
        handyman: ['TV mounting', 'Assembly', 'Drywall', 'Door repair'],
      }[service]
      const rating = Math.round((3.8 + seeded(u.id) * 1.2) * 10) / 10
      return {
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        role: u.company?.title || `${service.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')} Pro`,
        imageUrl: u.image,
        skills: skillPool,
        rating,
        completedJobs: Math.round(80 + seeded(u.id + 7) * 900),
        service,
        bio: `${u.company?.department || 'HomeServe'} pro with a reputation for showing up on time and doing the job right.`,
      }
    })
  } catch {
    return FALLBACK_PROVIDERS
  }
}

/** Hash a string to a stable number (used to vary reviews per service). */
function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100000
  return h
}

/** Fetch customer reviews from DummyJSON product reviews, varied per service. */
export async function fetchReviews(serviceId, serviceName) {
  try {
    const res = await fetch(`${API}/products?limit=30&select=id,reviews`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    const pool = data.products
      .flatMap((p) => p.reviews || [])
      .filter((r) => r.rating >= 3)
    if (!pool.length) throw new Error('no reviews')

    // Give each service a different, stable slice of the global review pool
    const doubled = [...pool, ...pool]
    const start = hashString(serviceId || 'all') % pool.length
    return doubled.slice(start, start + 9).map((r) => ({
      user: r.reviewerName || 'Verified customer',
      rating: r.rating,
      text: r.comment,
      date: new Date(r.date).toISOString().slice(0, 10),
    }))
  } catch {
    // Local fallback reviews from the service data
    return (getService(serviceId)?.reviews || []).map((r) => ({
      ...r,
      service: serviceName,
    }))
  }
}
