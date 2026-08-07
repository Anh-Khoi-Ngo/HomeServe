import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import ServiceDetailPage from './pages/ServiceDetailPage.jsx'
import ProvidersPage from './pages/ProvidersPage.jsx'
import ProviderDetailPage from './pages/ProviderDetailPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import BookingsPage from './pages/BookingsPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/providers/:id" element={<ProviderDetailPage />} />
          <Route path="/book/:serviceId" element={<BookingPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
