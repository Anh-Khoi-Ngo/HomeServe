import { Link, useLocation } from 'react-router-dom'
import { toggleFavorite, isFavorite } from '../services/storage.js'
import { useAppUser } from '../context/AuthContext.jsx'
import StarRating from './StarRating.jsx'
import SignInToast from './SignInToast.jsx'
import { useState } from 'react'

export default function ServiceCard({ service }) {
  const { user, isSignedIn } = useAppUser()
  const location = useLocation()
  const [fav, setFav] = useState(() => isFavorite(user?.id, service.id))
  const [bump, setBump] = useState(false)
  const [prompt, setPrompt] = useState(false)

  const handleFav = (e) => {
    e.preventDefault()
    if (!isSignedIn) {
      // Nudge the visitor to create an account first.
      setPrompt(true)
      return
    }
    const next = toggleFavorite(user.id, service.id)
    setFav(next.includes(service.id))
    setBump(true)
    setTimeout(() => setBump(false), 300)
  }

  return (
    <Link
      to={`/services/${service.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Sign-in prompt for signed-out visitors */}
      {prompt && (
        <SignInToast
          message="You need an account to save favorites"
          redirectUrl={location.pathname}
          onClose={() => setPrompt(false)}
        />
      )}

      {/* Emoji banner */}
      <div className="relative flex h-36 items-center justify-center bg-linear-to-br from-primary-light via-white to-fog">
        <span className="text-6xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
          {service.emoji}
        </span>
        <button
          onClick={handleFav}
          aria-label={fav ? 'Remove from favorites' : 'Save to favorites'}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm backdrop-blur transition-all duration-200 ${
            fav ? 'scale-110 text-accent' : 'text-gray-400 hover:text-accent'
          } ${bump ? 'scale-125' : ''}`}
        >
          {fav ? '♥' : '♡'}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-ink">{service.name}</h3>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary-dark">
            {service.priceRange}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{service.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <StarRating rating={4.8} showValue />
          <span className="text-sm font-semibold text-primary transition group-hover:translate-x-0.5">
            View details →
          </span>
        </div>
      </div>
    </Link>
  )
}
