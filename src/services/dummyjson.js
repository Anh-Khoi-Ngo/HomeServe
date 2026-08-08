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
      const rolePool = {
        cleaning: ['Lead Cleaner', 'Deep Clean Specialist', 'Home Cleaning Pro'],
        plumbing: ['Master Plumber', 'Licensed Plumber', 'Plumbing Pro'],
        electrical: ['Certified Electrician', 'Master Electrician', 'Electrical Pro'],
        'lawn-care': ['Lawn Specialist', 'Lawn Care Pro', 'Yard Care Specialist'],
        'snow-removal': ['Snow Crew Lead', 'Plowing Specialist', 'Snow Removal Pro'],
        painting: ['Painter', 'Master Painter', 'Painting Specialist'],
        handyman: ['Handyman', 'Fix-It Specialist', 'Handyman Pro'],
      }[service]
      const bioPool = {
        cleaning: [
          `${u.firstName} keeps every corner spotless — from weekly tidies to full move-out deep cleans, supplies included.`,
          `${u.firstName} is a cleaning pro with an eye for the details most people miss: baseboards, grout, and windows.`,
          `${u.firstName} has been making homes shine for years, with a checklist you can approve before the work starts.`,
        ],
        plumbing: [
          `${u.firstName} fixes leaks, clogs, and water heaters with flat-rate pricing agreed before any work begins.`,
          `${u.firstName} is a licensed plumber who shows up in your chosen window and leaves the workspace cleaner than they found it.`,
          `${u.firstName} has unclogged, repiped, and swapped enough water heaters to do it with eyes closed.`,
        ],
        electrical: [
          `${u.firstName} is a certified electrician for outlets, lighting, panels, and EV chargers — code-compliant, every time.`,
          `${u.firstName} takes the fear out of electricity: tidy panels, clean wiring, and a full parts-and-labor warranty.`,
          `${u.firstName} has upgraded panels and installed smart-home gear for hundreds of homes around town.`,
        ],
        'lawn-care': [
          `${u.firstName} keeps lawns green with mowing, fertilization, and weed control — recurring plans available.`,
          `${u.firstName} is a lawn specialist who treats every yard like a showpiece, with pet-friendly care.`,
          `${u.firstName} has been keeping neighborhoods green for seasons, one flawless mow line at a time.`,
        ],
        'snow-removal': [
          `${u.firstName} clears driveways and walkways before your coffee is done, with 24/7 storm response.`,
          `${u.firstName} is first on the street when the flakes fly — plowing, salting, and de-icing with text alerts.`,
          `${u.firstName} has spent winters keeping driveways clear with seasonal plans and fast call-outs.`,
        ],
        painting: [
          `${u.firstName} paints interiors, exteriors, and cabinets with premium paints and crisp lines.`,
          `${u.firstName} is a painter who protects every surface, preps thoroughly, and backs the work with a 5-year warranty.`,
          `${u.firstName} has transformed hundreds of rooms with careful prep and drop-cloth-everything protection.`,
        ],
        handyman: [
          `${u.firstName} knocks out your whole to-do list in one visit — assembly, mounting, drywall, and small fixes.`,
          `${u.firstName} is a handyman who books by the hour and only charges for what gets done.`,
          `${u.firstName} has fixed, mounted, and assembled more than most people own — all in a day's work.`,
        ],
      }[service]
      const pick = (pool) => pool[Math.floor(seeded(u.id * 7 + pool.length) * pool.length)]
      return {
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        role: pick(rolePool),
        imageUrl: u.image,
        skills: skillPool,
        rating,
        completedJobs: Math.round(80 + seeded(u.id + 7) * 900),
        service,
        bio: pick(bioPool),
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
