import { createContext, useContext, useState } from 'react'
import { ClerkProvider, useUser, useAuth } from '@clerk/react'

/**
 * AuthContext hides the auth provider behind one simple hook: useAppUser().
 *
 * - If VITE_CLERK_PUBLISHABLE_KEY is set in the .env file, Clerk powers auth.
 * - Otherwise the app runs in "demo mode" with a guest login stored in
 *   localStorage, so everything still works in the preview.
 */

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const USE_CLERK = Boolean(PUBLISHABLE_KEY)
const DEMO_KEY = 'hs_demo_user'

const AuthContext = createContext(null)

// Exported hook is intentional (context + provider in one file) — fast refresh
// still works for the rest of the app.
// eslint-disable-next-line react-refresh/only-export-components
export const useAppUser = () => useContext(AuthContext)

/* ---------- Real Clerk auth (used when a publishable key exists) ---------- */

function ClerkBridge({ children }) {
  const { user } = useUser()
  const { isSignedIn, isLoaded, signOut } = useAuth()

  const value = {
    authType: 'clerk',
    isLoaded,
    isSignedIn,
    user: user
      ? {
          id: user.id,
          name: user.fullName || user.primaryEmailAddress?.emailAddress || 'Member',
          email: user.primaryEmailAddress?.emailAddress || '',
          imageUrl: user.imageUrl,
        }
      : null,
    signOut: () => signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/* ---------- Demo auth (guest account saved in localStorage) ---------- */

function DemoBridge({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(DEMO_KEY) || 'null')
    } catch {
      return null
    }
  })

  const value = {
    authType: 'demo',
    isLoaded: true,
    isSignedIn: Boolean(user),
    user,
    signInDemo: (name) => {
      const newUser = {
        id: 'demo-' + Date.now(),
        name: name?.trim() || 'Guest',
        email: '',
        imageUrl: null,
        isDemo: true,
      }
      localStorage.setItem(DEMO_KEY, JSON.stringify(newUser))
      setUser(newUser)
    },
    signOut: () => {
      localStorage.removeItem(DEMO_KEY)
      setUser(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/* ---------- Provider that picks the right bridge ---------- */

export function AuthProvider({ children }) {
  if (USE_CLERK) {
    return (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ClerkBridge>{children}</ClerkBridge>
      </ClerkProvider>
    )
  }
  return <DemoBridge>{children}</DemoBridge>
}
