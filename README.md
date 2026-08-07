# 🏠 HomeServe

Book trusted home service pros — cleaning, plumbing, electrical, lawn care, snow
removal, painting, and handyman — online in under a minute.

Built with **React + Vite + TailwindCSS v4**, with **Clerk** auth, **Firebase**
(Firestore) for bookings & users, **GeoDB Cities** for city search, **DummyJSON**
for providers & reviews, and **OpenStreetMap** for addresses & maps.

## 🚀 Run it

```bash
npm install
npm run dev
```

## 🔑 Setup: Clerk is required for accounts

Copy `.env.example` to `.env`.

| Variable | Service | Required | What it enables |
| --- | --- | --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | [Clerk](https://dashboard.clerk.com) | ✅ for sign in / sign up | Real accounts, booking, favorites |
| `VITE_FIREBASE_*` | [Firebase](https://console.firebase.google.com) | optional | Bookings & users in Firestore (localStorage otherwise) |
| `VITE_GEO_DB_KEY` | [GeoDB Cities](https://rapidapi.com/wirefreethought/api/geodb-cities) (free RapidAPI key) | optional | Live city search (sample cities otherwise) |

Authentication is **Clerk-only** — the navbar's **Sign in** and **Sign up**
buttons open Clerk's hosted modal, so there are no separate auth pages. Without
the key the app still runs in a read-only state (browsing works; booking and
favorites stay locked until the key is added).

Firebase setup: create a Firestore database, enable it, then paste the web app
config into `.env`. Add a `bookings` collection — it's written with the app's
default rules.

## 📁 Folder structure

```
src/
├── main.jsx                 # Entry: BrowserRouter + AuthProvider
├── App.jsx                  # Routes + layout shell
├── index.css                # Tailwind theme + brand palette
├── context/
│   └── AuthContext.jsx      # Clerk auth (useAppUser hook)
├── data/
│   └── services.js          # The 7 services + fallback data
├── services/
│   ├── dummyjson.js         # API: providers + reviews
│   ├── geodb.js             # API: city search
│   ├── osm.js               # API: OpenStreetMap geocoding + map embeds
│   ├── firebase.js          # API: bookings + users (Firestore / localStorage)
│   └── storage.js           # Favorites (localStorage)
├── components/              # Navbar, Footer, cards, ratings, city search, map
└── pages/                   # One file per page
    ├── HomePage.jsx
    ├── ServicesPage.jsx
    ├── ServiceDetailPage.jsx
    ├── ProvidersPage.jsx
    ├── ProviderDetailPage.jsx
    ├── BookingPage.jsx
    ├── BookingsPage.jsx
    └── FavoritesPage.jsx
```

## 🧭 Routes

| Route | Page |
| --- | --- |
| `/` | Home — hero, city search, services, top providers |
| `/services` | All 7 service categories |
| `/services/:id` | Service detail — description, price, what's included, reviews, Book Now |
| `/providers` | Provider directory (filter by category) |
| `/providers/:id` | Provider profile — photo, skills, rating, completed jobs |
| `/book/:serviceId` | Booking — date, time, address (OSM), notes → confirm |
| `/bookings` | Booking history + cancel |
| `/favorites` | Saved services |

Auth is handled by Clerk's modal (navbar **Sign up** / **Sign in** buttons) —
there are no `/sign-in` or `/sign-up` routes.
