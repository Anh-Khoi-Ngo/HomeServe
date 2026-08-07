/**
 * Firebase → bookings + users.
 * Uses Firestore when the VITE_FIREBASE_* env vars are filled in,
 * otherwise stores data in localStorage so the app works with no setup.
 * The API is the same either way, so swapping in real Firebase is zero-code.
 */

import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const USE_FIREBASE = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

const app = USE_FIREBASE ? initializeApp(firebaseConfig) : null
const db = USE_FIREBASE ? getFirestore(app) : null

const BOOKINGS_KEY = 'hs_bookings'

/* ------------------------- localStorage helpers ------------------------- */

function readLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

/* ----------------------------- Bookings API ----------------------------- */

export async function saveBooking(booking) {
  if (db) {
    // Upsert the user's profile in the users collection alongside the booking
    if (booking.userId) {
      await setDoc(
        doc(db, 'users', booking.userId),
        {
          name: booking.userName || '',
          email: booking.userEmail || '',
          lastBookingAt: new Date().toISOString(),
        },
        { merge: true },
      )
    }
    const ref = await addDoc(collection(db, 'bookings'), {
      ...booking,
      createdAt: new Date().toISOString(),
    })
    return { id: ref.id, ...booking }
  }
  const all = readLocal(BOOKINGS_KEY)
  const saved = { id: 'b' + Date.now(), ...booking, createdAt: new Date().toISOString() }
  all.unshift(saved)
  writeLocal(BOOKINGS_KEY, all)
  return saved
}

export async function getBookings(userId) {
  if (db) {
    const q = query(collection(db, 'bookings'), where('userId', '==', userId))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }
  return readLocal(BOOKINGS_KEY).filter((b) => b.userId === userId)
}

export async function cancelBooking(bookingId) {
  if (db) {
    await updateDoc(doc(db, 'bookings', bookingId), { status: 'Cancelled' })
    return
  }
  writeLocal(
    BOOKINGS_KEY,
    readLocal(BOOKINGS_KEY).map((b) =>
      b.id === bookingId ? { ...b, status: 'Cancelled' } : b,
    ),
  )
}

/* ------------------------------- Users API ------------------------------ */

export async function saveUser(user) {
  if (db) {
    await setDoc(
      doc(db, 'users', user.id),
      { name: user.name || '', email: user.email || '' },
      { merge: true },
    )
    return user
  }
  const users = readLocal('hs_users')
  if (!users.some((u) => u.id === user.id)) {
    users.push({ ...user, createdAt: new Date().toISOString() })
    writeLocal('hs_users', users)
  }
  return user
}

export function usingFirebase() {
  return USE_FIREBASE
}
