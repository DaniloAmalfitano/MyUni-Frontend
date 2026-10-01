import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Moon, Sun, LogOut, User, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { StatusBadge } from '../components/StatusBadge'
import { api } from '../api/client'
import { CardSkeleton } from '../components/Skeleton'

export function ImpostazioniPage() {
  const navigate = useNavigate()
  const { userName, connectionStatus, logout } = useAuth()
  const [studentId, setStudentId] = useState<string | null>(null)
  const [degreeCourse, setDegreeCourse] = useState<string | null>(null)
  const { theme, toggleTheme } = useTheme()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => { setLoggingOut(true); try { await logout(); navigate('/login') } catch { navigate('/login') } }

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        const [degreeCourse, studentId] = await Promise.all([
          api.getDegreeCourse(),
          api.getStudentId(),
        ])

        if (!cancelled) {
          setStudentId(studentId)
          setDegreeCourse(degreeCourse)
        }
      } catch {
        if (!cancelled) {
          setStudentId(null)
          setDegreeCourse(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [])

    if (loading) {
      return (
        <div className="space-y-6">
          <div className="h-8 w-64 skeleton rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )
    }
  return (
    <div className="space-y-6 relative">
      <div><h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Impostazioni</h1><p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Gestisci il tuo account e le preferenze</p></div>
      <div className="rounded-2xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Account</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center"><User size={24} className="text-primary-600 dark:text-primary-400" /></div>
          <div><p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{userName || 'Nessun nome trovato'}</p><p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Matricola: {studentId || 'Nessuna Matricola trovata'}</p><p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Corso: {degreeCourse || 'Nessun corso trovato'}</p></div>
        </div>
      </div>
      <div className="rounded-2xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Aspetto</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon size={20} className="text-primary-400" /> : <Sun size={20} className="text-warning-500" />}
            <div><p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Tema {theme === 'dark' ? 'Scuro' : 'Chiaro'}</p><p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Cambia l'aspetto dell'interfaccia</p></div>
          </div>
          <button onClick={toggleTheme} className={`relative w-12 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'}`}><span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} /></button>
        </div>
      </div>
      <div className="rounded-2xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Connessione Segrepass</h2>
        <div className="flex items-center gap-3"><StatusBadge status={connectionStatus} /><p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{connectionStatus === 'connected' ? 'Sessione attiva con il portale' : connectionStatus === 'error' ? 'Errore nella connessione' : 'Non connesso al portale'}</p></div>
      </div>
      <button onClick={() => setShowLogoutDialog(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-danger-500 text-danger-500 font-medium hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors"><LogOut size={18} />Esci</button>
      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="rounded-2xl p-6 max-w-sm w-full shadow-2xl" style={{ backgroundColor: 'var(--color-bg-card)' }}>
            <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-full bg-danger-100 dark:bg-danger-500/20 flex items-center justify-center"><AlertCircle size={20} className="text-danger-500" /></div><h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Conferma logout</h3></div>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Sei sicuro di voler uscire? Verranno chiuse sia la sessione dell'app che quella di Segrepass.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowLogoutDialog(false)} className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>Annulla</button>
              <button onClick={handleLogout} disabled={loggingOut} className="px-4 py-2 rounded-xl text-sm font-medium bg-danger-500 hover:bg-danger-600 text-white transition-colors disabled:opacity-60">{loggingOut ? 'Uscita...' : 'Esci'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
