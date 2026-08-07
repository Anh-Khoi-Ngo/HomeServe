import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getService } from '../data/services.js'
import { searchAddresses, geocodeAddress } from '../services/osm.js'
import { saveBooking } from '../services/firebase.js'
import { useAppUser } from '../context/AuthContext.jsx'
import MapView from '../components/MapView.jsx'
import { fetchProviders } from '../services/dummyjson.js'

const TIME_SLOTS = ['8:00 AM', '9:30 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM']

// Computed once at module load (avoids impure Date.now() calls during render)
const MIN_DATE = new Date().toISOString().slice(0, 10)
const TOMORROW = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

export default function BookingPage() {
  const { serviceId } = useParams()
  const [searchParams] = useSearchParams()
  const service = getService(serviceId)
  const navigate = useNavigate()
  const { user, isSignedIn } = useAppUser()

  const [form, setForm] = useState({
    date: TOMORROW, // tomorrow
    time: TIME_SLOTS[0],
    address: '',
    notes: '',
  })
  const [providerId, setProviderId] = useState(searchParams.get('provider') || '')
  const [providers, setProviders] = useState([])
  const [geo, setGeo] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [showSug, setShowSug] = useState(false)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(null)
  const boxRef = useRef(null)

  useEffect(() => {
    let active = true
    fetchProviders().then((p) => active && setProviders(p.filter((x) => x.service === serviceId)))
    return () => {
      active = false
    }
  }, [serviceId])

  /* OSM address autocomplete */
  useEffect(() => {
    let active = true
    const t = setTimeout(async () => {
      if (form.address.trim().length < 4) {
        setSuggestions([])
        setShowSug(false)
        return
      }
      const list = await searchAddresses(form.address)
      if (active) {
        setSuggestions(list)
        setShowSug(list.length > 0)
      }
    }, 400)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [form.address])

  /* Geocode the picked/typed address for the map */
  useEffect(() => {
    let active = true
    const t = setTimeout(async () => {
      if (form.address.trim().length < 6) {
        setGeo(null)
        return
      }
      const result = await geocodeAddress(form.address)
      if (active) setGeo(result)
    }, 500)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [form.address])

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setShowSug(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])


  const confirm = async () => {
    if (!isSignedIn) {
      navigate('/sign-in', { state: { from: `/book/${serviceId}` } })
      return
    }
    if (!form.address.trim()) return
    setSaving(true)
    const provider = providers.find((p) => String(p.id) === String(providerId))
    const booking = await saveBooking({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      serviceId,
      serviceName: service?.name,
      serviceEmoji: service?.emoji,
      priceRange: service?.priceRange,
      date: form.date,
      time: form.time,
      address: form.address,
      notes: form.notes,
      providerName: provider?.name,
      status: 'Confirmed',
    })
    setSaving(false)
    setDone(booking)
  }

  /* ---------- Success screen ---------- */
  if (done) {
    return (
      <div className="page-enter mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-4xl">
          🎉
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-ink">Booking confirmed!</h1>
        <p className="mt-3 text-ink-soft">
          {done.serviceEmoji} <strong>{done.serviceName}</strong> · {done.date} at {done.time}
          {done.providerName && <> with <strong>{done.providerName}</strong></>}
        </p>
        <div className="mt-8 rounded-2xl border border-gray-200/70 bg-white p-5 text-left text-sm shadow-sm">
          <p className="text-mist">📍 Address</p>
          <p className="font-semibold text-ink">{done.address}</p>
          {done.notes && (
            <>
              <p className="mt-3 text-mist">📝 Notes</p>
              <p className="font-semibold text-ink">{done.notes}</p>
            </>
          )}
          <p className="mt-3 text-mist">💳 Pay at the door — starting {done.priceRange}</p>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/bookings"
            className="rounded-full bg-primary px-7 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
          >
            View my bookings →
          </Link>
          <Link
            to="/services"
            className="rounded-full border-2 border-gray-200 px-7 py-3 text-sm font-bold text-ink-soft transition hover:border-primary hover:text-primary"
          >
            Book another
          </Link>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-ink">Service not found</h1>
        <Link to="/services" className="mt-4 inline-block font-bold text-primary">← Back</Link>
      </div>
    )
  }

  /* ---------- Booking form ---------- */
  return (
    <div className="page-enter mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-mist">
        <Link to="/" className="transition hover:text-primary">Home</Link>
        <span className="mx-1">/</span>
        <Link to="/services" className="transition hover:text-primary">Services</Link>
        <span className="mx-1">/</span>
        <Link to={`/services/${service.id}`} className="transition hover:text-primary">{service.name}</Link>
        <span className="mx-1">/</span>
        <span className="text-ink-soft">Book</span>
      </nav>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-4xl">{service.emoji}</span>
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Book {service.name}</h1>
          <p className="text-ink-soft">Starting at {service.priceRange}</p>
        </div>
      </div>

      {!isSignedIn && (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-warning/40 bg-warning/10 px-5 py-4 text-sm">
          <p className="text-ink">
            🔒 You'll need an account to confirm. <strong>Sign in</strong> to keep booking.
          </p>
          <Link
            to="/sign-in"
            state={{ from: `/book/${service.id}` }}
            className="shrink-0 rounded-full bg-ink px-5 py-2 text-xs font-bold text-white transition hover:bg-primary-dark"
          >
            Sign in
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* ---------- Form ---------- */}
        <div className="space-y-8">
          {/* Provider */}
          {providers.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-ink">Choose a pro <span className="text-sm font-normal text-mist">(optional)</span></h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setProviderId('')}
                  className={`rounded-2xl border-2 p-4 text-left transition ${
                    providerId === '' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/40'
                  }`}
                >
                  <p className="font-bold text-ink">🤝 Any available pro</p>
                  <p className="text-xs text-mist">Fastest available slot</p>
                </button>
                {providers.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProviderId(String(p.id))}
                    className={`rounded-2xl border-2 p-4 text-left transition ${
                      providerId === String(p.id) ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-bold text-primary-dark">
                          {p.name[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-ink">{p.name}</p>
                        <p className="text-xs text-mist">⭐ {p.rating} · {p.completedJobs} jobs</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Date & time */}
          <section>
            <h2 className="text-lg font-bold text-ink">When?</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-soft">Date</label>
                <input
                  type="date"
                  min={MIN_DATE}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-soft">Time</label>
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Address + map */}
          <section>
            <h2 className="text-lg font-bold text-ink">Where?</h2>
            <div ref={boxRef} className="relative mt-3">
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street address, city, postal code…"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {showSug && (
                <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                  {suggestions.map((s, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => {
                          setForm({ ...form, address: s.label })
                          setGeo({ lat: s.lat, lon: s.lon })
                          setShowSug(false)
                        }}
                        className="w-full px-4 py-3 text-left text-sm transition hover:bg-primary/5"
                      >
                        📍 {s.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-4">
              <MapView lat={geo?.lat} lon={geo?.lon} title={service.name} />
            </div>
          </section>

          {/* Notes */}
          <section>
            <h2 className="text-lg font-bold text-ink">Anything we should know?</h2>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              placeholder="Gate code, pet details, parking…"
              className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </section>
        </div>

        {/* ---------- Summary card ---------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-gray-200/70 bg-white p-6 shadow-xl shadow-primary/5">
            <h2 className="text-lg font-bold text-ink">Booking summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-mist">Service</dt>
                <dd className="font-semibold text-ink">{service.emoji} {service.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mist">Date</dt>
                <dd className="font-semibold text-ink">{form.date}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mist">Time</dt>
                <dd className="font-semibold text-ink">{form.time}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mist">Pro</dt>
                <dd className="font-semibold text-ink">
                  {providers.find((p) => String(p.id) === String(providerId))?.name || 'Any available'}
                </dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <dt className="text-mist">Est. price</dt>
                <dd className="text-lg font-extrabold text-primary-dark">{service.priceRange}</dd>
              </div>
            </dl>

            <button
              onClick={confirm}
              disabled={saving || !form.address.trim()}
              className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Confirming…' : 'Confirm booking →'}
            </button>
            {!form.address.trim() && (
              <p className="mt-3 text-center text-xs text-mist">Enter an address to confirm.</p>
            )}
            <p className="mt-4 text-center text-xs text-mist">
              🔥 Stored securely {`${import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'in Firebase' : 'on this device'}`}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
