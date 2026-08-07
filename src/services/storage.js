/**
 * Favorite services — saved per user in localStorage.
 * Favorites are strictly per-account: they require a real user id,
 * so signed-out visitors can never save anything.
 */

const key = (userId) => `hs_favorites_${userId}`

export function getFavorites(userId) {
  if (!userId) return []
  try {
    return JSON.parse(localStorage.getItem(key(userId)) || '[]')
  } catch {
    return []
  }
}

export function toggleFavorite(userId, serviceId) {
  if (!userId) return []
  const list = getFavorites(userId)
  const next = list.includes(serviceId)
    ? list.filter((id) => id !== serviceId)
    : [...list, serviceId]
  localStorage.setItem(key(userId), JSON.stringify(next))
  return next
}

export function isFavorite(userId, serviceId) {
  if (!userId) return false
  return getFavorites(userId).includes(serviceId)
}
