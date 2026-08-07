import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getFavorites, toggleFavorite } from '../services/storage.js'
import { getService, SERVICES } from '../data/services.js'
import { useAppUser } from '../context/AuthContext.jsx'

export default function FavoritesPage() {
  const { user, isSignedIn, openSignIn } = useAppUser()
  const [favIds, setFavIds] = useState(() => getFavorites(user?.id))

  const saved = favIds.map(getService).filter(Boolean)
  const more = SERVICES.filter((s) => !favIds.includes(s.id))

  if (!isSignedIn) {
    return (
      <div className="page-enter mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-5xl">🔒</p>
        <h1 className="mt-4 text-3xl font-extrabold text-ink">Sign in to see your favorites</h1>
        <p className="mt-3 text-ink-soft">Saved services sync with your account.</p>
        <button
          type="button"
          onClick={() => openSignIn('/favorites')}
          className="mt-8 rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
        >
          Sign in →
        </button>
      </div>
    )
  }

  return (
    <div className="page-enter mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-extrabold text-ink">Saved services</h1>
      <p className="mt-2 text-ink-soft">Your favorites, ready to book whenever you are.</p>

      {saved.length === 0 ? (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-gray-300 bg-white p-14 text-center">
          <p className="text-5xl">♡</p>
          <h2 className="mt-4 text-xl font-bold text-ink">Nothing saved yet</h2>
          <p className="mt-2 text-sm text-ink-soft">Tap the heart on any service to keep it here.</p>
          <Link
            to="/services"
            className="mt-6 inline-block rounded-full bg-primary px-7 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
          >
            Browse services →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {saved.map((s) => (
            <div key={s.id} className="flex items-center gap-4 rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm transition hover:border-primary/40">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-2xl">
                {s.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-ink">{s.name}</h3>
                <p className="text-sm text-primary-dark">{s.priceRange}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <Link
                  to={`/book/${s.id}`}
                  className="rounded-full bg-primary px-4 py-1.5 text-center text-xs font-bold text-white transition hover:bg-primary-dark"
                >
                  Book
                </Link>
                <button
                  onClick={() => setFavIds(toggleFavorite(user.id, s.id))}
                  className="rounded-full px-4 py-1.5 text-xs font-bold text-accent transition hover:bg-accent/5"
                >
                  ♥ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Explore others */}
      {more.length > 0 && (
        <section className="mt-14">
          <h2 className="font-bold text-ink">You might also like</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {more.map((s) => (
              <Link
                key={s.id}
                to={`/services/${s.id}`}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-ink-soft transition hover:border-primary hover:text-primary"
              >
                {s.emoji} {s.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
