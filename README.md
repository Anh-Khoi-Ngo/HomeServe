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

It works with **zero configuration** — every external service has a graceful
demo fallback (guest login, localStorage, sample cities, local reviews).

## 🔑 Optional env vars

Copy `.env.example` to `.env` and fill in what you have. Every value is optional.

| Variable | Service | What it enables |
| --- | --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | [Clerk](https://dashboard.clerk.com) | Real accounts, sign in/up UI |
| `VITE_FIREBASE_*` | [Firebase](https://console.firebase.google.com) | Bookings & users in Firestore |
| `VITE_GEO_DB_KEY` | [GeoDB Cities](https://rapidapi.com/wirefreethought/api/geodb-cities) (free RapidAPI key) | Live city search |

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
│   └── AuthContext.jsx      # Clerk auth, with demo-mode fallback (useAppUser)
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
    ├── FavoritesPage.jsx
    └── SignInPage.jsx
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
| `/sign-in` | Clerk sign-in / demo guest login |
