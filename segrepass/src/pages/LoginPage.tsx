import React, { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { connectSegrepass } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username.trim()) { setError('Inserisci il tuo username'); return }
    if (!password) { setError('Inserisci la tua password'); return }
    setLoading(true)
    try {
      await connectSegrepass(username, password)
      navigate('/dashboard')
    } catch (err: any) {
      if (err?.status === 401) setError('Credenziali non valide. Controlla username e password.')
      else setError('Errore di connessione. Riprova più tardi.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-300/20 dark:bg-primary-800/20 rounded-full blur-3xl" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg shadow-primary-600/30">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Segrepass</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Dashboard Universitario UniNA</p>
        </div>
        <div className="rounded-2xl p-8 shadow-xl border" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>Accedi</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="mario.rossi"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} disabled={loading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 px-4 py-3">
                <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? (<><Loader2 size={18} className="animate-spin" />Accesso in corso...</>) : 'Accedi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
