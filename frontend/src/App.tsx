import { Route, Routes, Navigate } from 'react-router-dom'
import AppShell from './components/AppShell'
import LandingPage from './pages/LandingPage'
import AdminDashboard from './pages/AdminDashboard'
import PublicBookingPage from './pages/PublicBookingPage'
import './index.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/book/:slug" element={<PublicBookingPage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/event-types" element={<Navigate to="/dashboard" replace />} />
        <Route path="/bookings" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
