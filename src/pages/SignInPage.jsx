import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SignIn } from '@clerk/react'
import { useAppUser } from '../context/AuthContext.jsx'

export default function SignInPage() {
  const { authType, signInDemo } = useAppUser()
  const [mode, setMode] = useState('demo')
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const continueAsGuest = () => {
    signInDemo(name)
    navigate(from, { replace: true })
  }

  return (
    <div className="page-enter mx-auto max-w-md px-4 py-16">
      <div className="text-center">
        <img src="/homeserve-logo.png" alt="HomeServe" className="mx-auto h-14 w-auto" />
        <h1 className="mt-4 text-3xl font-extrabold text-ink">Welcome back</h1>
        <p className="mt-2 text-ink-soft">Sign in to book pros, track visits, and save favorites.</p>
      </div>

      <div className="mt-8 rounded-3xl border border-gray-200/70 bg-white p-7 shadow-xl shadow-primary/5">
        {/* Mode tabs */}
        <div className="grid grid-cols-2 gap-1 rounded-full bg-fog p-1">
          <button
            onClick={() => setMode('demo')}
            className={`rounded-full py-2 text-sm font-bold transition ${mode === 'demo' ? 'bg-white text-primary-dark shadow' : 'text-ink-soft'}`}
          >
            Quick demo
          </button>
          <button
            onClick={() => setMode(authType === 'clerk' ? 'clerk' : 'demo')}
            disabled={authType !== 'clerk'}
            title={authType !== 'clerk' ? 'Add VITE_CLERK_PUBLISHABLE_KEY to enable Clerk' : ''}
            className={`rounded-full py-2 text-sm font-bold transition disabled:cursor-not-allowed ${
              mode === 'clerk' ? 'bg-white text-primary-dark shadow' : 'text-ink-soft disabled:opacity-50'
            }`}
          >
            Clerk {authType !== 'clerk' && '· off'}
          </button>
        </div>

        {/* Clerk sign-in (only rendered when Clerk is enabled) */}
        {mode === 'clerk' && authType === 'clerk' && (
          <div className="mt-6">
            <SignIn
              fallbackRedirectUrl={from}
              signUpUrl="#"
            />
            <p className="mt-4 text-center text-xs text-mist">
              New here? Switch the tab if you're on Clerk — or use the demo below.
            </p>
          </div>
        )}

        {/* Demo guest login */}
        {mode === 'demo' && (
          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-semibold text-ink-soft">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={continueAsGuest}
              className="mt-4 w-full rounded-full bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
            >
              Continue as {name.trim() || 'guest'} →
            </button>
            <p className="mt-4 text-center text-xs leading-relaxed text-mist">
              {authType === 'demo'
                ? 'Demo mode: no Clerk key configured, so we save a guest account on this device. Add VITE_CLERK_PUBLISHABLE_KEY to enable real accounts.'
                : 'Or sign in with your Clerk account above.'}
            </p>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        No account needed for demo — <button onClick={continueAsGuest} className="font-bold text-primary hover:underline">skip straight in</button>.
      </p>
    </div>
  )
}
