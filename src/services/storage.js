/**
 * Favorite services — saved per user in localStorage.
 * Simple, fast, and works in every auth mode.
 */

const key = (userId) => `hs_favorites_${userId || 'guest'}`

export function getFavorites(userId) {
  try {
    return JSON.parse(localStorage.getItem(key(userId)) || '[]')
  } catch {
    return []
  }
}

export function toggleFavorite(userId, serviceId) {
  const list = getFavorites(userId)
  const next = list.includes(serviceId)
    ? list.filter((id) => id !== serviceId)
    : [...list, serviceId]
  localStorage.setItem(key(userId), JSON.stringify(next))
  return next
}

export function isFavorite(userId, serviceId) {
  return getFavorites(userId).includes(serviceId)
}
