import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import { useAuth } from './context/AuthContext'
import { AppLayout } from './layouts/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { LibrettoPage } from './pages/LibrettoPage'
import { PianoStudiPage } from './pages/PianoStudiPage'
import { ImpostazioniPage } from './pages/ImpostazioniPage'

function AppRoutes() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const handler = () => navigate('/login')

    window.addEventListener('session-expired', handler)

    return () => window.removeEventListener('session-expired', handler)
  }, [navigate])

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <LoginPage />
        }
      />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/libretto" element={<LibrettoPage />} />
        <Route path="/piano-studi" element={<PianoStudiPage />} />
        <Route path="/impostazioni" element={<ImpostazioniPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  )
}