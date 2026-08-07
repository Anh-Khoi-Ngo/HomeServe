import { Navigate, useLocation } from 'react-router-dom'
import { SignIn } from '@clerk/react'
import { useAppUser } from '../context/AuthContext.jsx'

export default function SignInPage() {
  const { authType, isSignedIn, isLoaded } = useAppUser()
  const location = useLocation()
  const from =
    location.state?.from || new URLSearchParams(location.search).get('redirect') || '/'

  // Already signed in? Skip the form.
  if (isLoaded && isSignedIn) {
    return <Navigate to={from} replace />
  }

  // No Clerk key configured yet.
  if (authType !== 'clerk') {
    return (
      <div className="page-enter mx-auto max-w-md px-4 py-16 text-center">
        <img src="/homeserve-logo.png" alt="HomeServe" className="mx-auto h-14 w-auto" />
        <h1 className="mt-4 text-3xl font-extrabold text-ink">Sign in with Clerk</h1>
        <p className="mt-2 text-ink-soft">
          Authentication is powered by Clerk and isn't connected yet.
        </p>
        <div className="mt-8 rounded-3xl border border-gray-200/70 bg-white p-7 text-left shadow-xl shadow-primary/5">
          <p className="text-sm leading-relaxed text-ink-soft">
            Add your <code className="rounded bg-fog px-1.5 py-0.5 text-xs font-bold text-primary-dark">VITE_CLERK_PUBLISHABLE_KEY</code>{' '}
            to a <code className="rounded bg-fog px-1.5 py-0.5 text-xs font-bold text-primary-dark">.env</code> file
            (see <code className="rounded bg-fog px-1.5 py-0.5 text-xs font-bold text-primary-dark">.env.example</code>)
            to enable sign in &amp; sign up for your visitors.
          </p>
          <p className="mt-4 text-sm text-mist">
            You can still browse services and providers — just not book or save favorites yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter mx-auto max-w-md px-4 py-16">
      <div className="text-center">
        <img src="/homeserve-logo.png" alt="HomeServe" className="mx-auto h-14 w-auto" />
        <h1 className="mt-4 text-3xl font-extrabold text-ink">Welcome back</h1>
        <p className="mt-2 text-ink-soft">Sign in to book pros, track visits, and save favorites.</p>
      </div>

      <div className="mt-8 rounded-3xl border border-gray-200/70 bg-white p-7 shadow-xl shadow-primary/5">
        <SignIn fallbackRedirectUrl={from} signUpUrl={`/sign-up?redirect=${encodeURIComponent(from)}`} />
      </div>
    </div>
  )
}
