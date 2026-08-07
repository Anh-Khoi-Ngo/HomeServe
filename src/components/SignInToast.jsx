import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useAppUser } from '../context/AuthContext.jsx'

/**
 * SignInToast — a small bottom-center prompt shown when a signed-out user
 * tries an action that needs an account (e.g. saving a favorite).
 * It nudges the visitor to sign in and offers a button that opens
 * Clerk's sign-in modal.
 *
 * Rendered through a portal so it always floats over the viewport, even
 * when used inside cards that transform/overflow on hover.
 */
export default function SignInToast({ message = 'Sign in to save favorites', redirectUrl = '/', onClose }) {
  const { openSignIn } = useAppUser()

  // Keep the latest onClose without restarting the auto-dismiss timer on
  // parent re-renders (the parent passes a fresh inline arrow each time).
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Auto-dismiss after a while so the prompt never lingers forever.
  useEffect(() => {
    const t = setTimeout(() => onCloseRef.current(), 6000)
    return () => clearTimeout(t)
  }, [])

  return createPortal(
    <div
      role="status"
      className="toast-pop fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
    >
      <div className="flex items-center gap-3 rounded-2xl bg-ink px-4 py-3.5 text-white shadow-2xl shadow-ink/40">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-lg">
          ♥
        </span>
        <p className="min-w-0 flex-1 text-sm font-semibold leading-snug">{message}</p>
        <button
          type="button"
          onClick={() => {
            openSignIn(redirectUrl)
            onClose()
          }}
          className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white transition hover:bg-primary-dark"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="shrink-0 rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  )
}
