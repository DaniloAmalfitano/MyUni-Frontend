import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link2, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { ConnectionStatus } from '../types'

export function ConnectPage() {
  const navigate = useNavigate()
  const { connectSegrepass, connectionStatus, setConnectionStatus, credentials } = useAuth()
  const [progress, setProgress] = useState(0)

  const handleConnect = async () => {
    setConnectionStatus('connecting')
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => { if (prev >= 90) { clearInterval(interval); return 90 } return prev + Math.random() * 15 })
    }, 2000)
    try {
      await connectSegrepass(credentials!.username, credentials!.password)
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch { clearInterval(interval); setProgress(0) }
  }

  const statusContent: Record<ConnectionStatus, React.ReactNode> = {
    disconnected: (
      <>
        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6"><Link2 size={36} className="text-primary-600 dark:text-primary-400" /></div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Collega il tuo account Segrepass</h2>
        <p className="text-sm mb-8 max-w-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>Per accedere ai dati della tua carriera, è necessario collegare la sessione al portale universitario. La connessione è separata dal login dell'app.</p>
        <button onClick={handleConnect} className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-xl transition-colors flex items-center gap-2"><Link2 size={18} />Connetti</button>
      </>
    ),
    connecting: (
      <>
        <div className="relative w-20 h-20 mb-6">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="var(--color-border)" strokeWidth="6" />
            <circle cx="40" cy="40" r="36" fill="none" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`} className="transition-all duration-500" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-primary-600" /></div>
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Connessione in corso...</h2>
        <p className="text-sm max-w-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>Connessione al portale in corso. Potrebbe richiedere fino a 60 secondi.</p>
      </>
    ),
    connected: (
      <>
        <div className="w-20 h-20 bg-success-100 dark:bg-success-500/20 rounded-full flex items-center justify-center mb-6"><CheckCircle size={36} className="text-success-500" /></div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Connessione riuscita!</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Reindirizzamento alla dashboard...</p>
      </>
    ),
    error: (
      <>
        <div className="w-20 h-20 bg-danger-100 dark:bg-danger-500/20 rounded-full flex items-center justify-center mb-6"><AlertCircle size={36} className="text-danger-500" /></div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Connessione fallita</h2>
        <p className="text-sm mb-6 max-w-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>Non è stato possibile connettersi al portale. Il servizio potrebbe essere temporaneamente non disponibile.</p>
        <button onClick={handleConnect} className="bg-danger-500 hover:bg-danger-600 text-white font-medium py-3 px-8 rounded-xl transition-colors">Riprova</button>
      </>
    ),
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="rounded-2xl p-10 shadow-xl border max-w-lg w-full flex flex-col items-center" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        {statusContent[connectionStatus]}
      </div>
    </div>
  )
}
