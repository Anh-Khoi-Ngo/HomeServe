import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBookings, cancelBooking } from '../services/firebase.js'
import { useAppUser } from '../context/AuthContext.jsx'
import { getService } from '../data/services.js'

const STATUS_STYLES = {
  Confirmed: 'bg-success/10 text-success',
  Completed: 'bg-primary/10 text-primary-dark',
  Cancelled: 'bg-accent/10 text-accent',
}

export default function BookingsPage() {
  const { user, isSignedIn, openSignIn } = useAppUser()
  const [bookings, setBookings] = useState([])
  const [loaded, setLoaded] = useState(false)

  const reload = async () => {
    const list = await getBookings(user.id)
    setBookings(list)
    setLoaded(true)
  }

  useEffect(() => {
    if (!user?.id) return
    let active = true
    getBookings(user.id).then((list) => {
      if (active) {
        setBookings(list)
        setLoaded(true)
      }
    })
    return () => {
      active = false
    }
  }, [user?.id])

  if (!isSignedIn) {
    return (
      <div className="page-enter mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-5xl">🔒</p>
        <h1 className="mt-4 text-3xl font-extrabold text-ink">Sign in to see your bookings</h1>
        <p className="mt-3 text-ink-soft">Your booking history lives with your account.</p>
        <button
          type="button"
          onClick={() => openSignIn('/bookings')}
          className="mt-8 rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
        >
          Sign in →
        </button>
      </div>
    )
  }

  const upcoming = bookings.filter((b) => b.status === 'Confirmed')
  const past = bookings.filter((b) => b.status !== 'Confirmed')

  return (
    <div className="page-enter mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-extrabold text-ink">My bookings</h1>
      <p className="mt-2 text-ink-soft">Hello {user?.name?.split(' ')[0]} — here's everything on the schedule.</p>

      {!loaded && <p className="mt-10 text-mist">Loading…</p>}

      {loaded && bookings.length === 0 && (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-gray-300 bg-white p-14 text-center">
          <p className="text-5xl">🗓️</p>
          <h2 className="mt-4 text-xl font-bold text-ink">No bookings yet</h2>
          <p className="mt-2 text-sm text-ink-soft">Pick a service and book your first home pro in under a minute.</p>
          <Link
            to="/services"
            className="mt-6 inline-block rounded-full bg-primary px-7 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
          >
            Browse services →
          </Link>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="mt-10">
          <h2 className="font-bold text-ink">Upcoming</h2>
          <div className="mt-4 space-y-4">
            {upcoming.map((b) => (
              <BookingRow key={b.id} booking={b} onCancel={async () => {
                await cancelBooking(b.id)
                reload()
              }} />
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="font-bold text-ink">Past</h2>
          <div className="mt-4 space-y-4">
            {past.map((b) => (
              <BookingRow key={b.id} booking={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function BookingRow({ booking: b, onCancel }) {
  const service = getService(b.serviceId)
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-2xl">
          {b.serviceEmoji || service?.emoji || '🛠️'}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-ink">{b.serviceName || service?.name}</h3>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS_STYLES[b.status] || STATUS_STYLES.Confirmed}`}>
              {b.status}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-ink-soft">
            📅 {b.date} at {b.time}
            {b.providerName && <> · 👷 {b.providerName}</>}
          </p>
          <p className="mt-0.5 text-xs text-mist">📍 {b.address}</p>
          {b.notes && <p className="mt-0.5 text-xs text-mist">📝 {b.notes}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-bold text-primary-dark">{b.priceRange}</span>
        {onCancel && (
          <button
            onClick={onCancel}
            className="rounded-full border-2 border-accent/30 px-4 py-1.5 text-xs font-bold text-accent transition hover:border-accent hover:bg-accent/5"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
