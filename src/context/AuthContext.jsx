import { createContext, useContext } from 'react'
import { ClerkProvider, useUser, useAuth, useClerk } from '@clerk/react'

/**
 * AuthContext hides Clerk behind one simple hook: useAppUser().
 *
 * Authentication is Clerk-only. Set VITE_CLERK_PUBLISHABLE_KEY in your .env
 * file to enable it. Without a key the app runs in a read-only "no auth"
 * state so browsing still works — sign-in, booking, and favorites stay
 * locked until the key is added.
 */

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const USE_CLERK = Boolean(PUBLISHABLE_KEY)

const AuthContext = createContext(null)

// Exported hook is intentional (context + provider in one file) — fast refresh
// still works for the rest of the app.
// eslint-disable-next-line react-refresh/only-export-components
export const useAppUser = () => useContext(AuthContext)

/* ---------- Real Clerk auth (used when a publishable key exists) ---------- */

function ClerkBridge({ children }) {
  const { user } = useUser()
  const { isSignedIn, isLoaded, signOut } = useAuth()
  const { openSignIn, openSignUp } = useClerk()

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
    // Open Clerk's sign-in / sign-up modals (no separate pages needed).
    openSignIn: (redirectUrl = '/') => openSignIn({ redirectUrl }),
    openSignUp: (redirectUrl = '/') => openSignUp({ redirectUrl }),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/* ---------- No Clerk key yet — browsing works, accounts are off ---------- */

function NoAuthBridge({ children }) {
  const value = {
    authType: 'none',
    isLoaded: true,
    isSignedIn: false,
    user: null,
    signOut: () => {},
    openSignIn: () => {},
    openSignUp: () => {},
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
  return <NoAuthBridge>{children}</NoAuthBridge>
}
