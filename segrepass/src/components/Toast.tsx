import React, { useEffect, useState, useCallback, createContext, useContext } from 'react'
import clsx from 'clsx'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'
interface Toast { id: string; type: ToastType; message: string }
interface ToastContextType { showToast: (type: ToastType, message: string) => void }

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, message }])
  }, [])
  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map(toast => <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />)}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 5000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const icons = { success: <CheckCircle size={18} className="text-success-500" />, error: <AlertCircle size={18} className="text-danger-500" />, warning: <AlertTriangle size={18} className="text-warning-500" />, info: <Info size={18} className="text-primary-500" /> }
  const bgColors = { success: 'border-success-200 dark:border-success-500/30', error: 'border-danger-200 dark:border-danger-500/30', warning: 'border-warning-200 dark:border-warning-500/30', info: 'border-primary-200 dark:border-primary-500/30' }

  return (
    <div className={clsx('flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg border animate-count', bgColors[toast.type])} style={{ backgroundColor: 'var(--color-bg-card)' }}>
      {icons[toast.type]}
      <p className="flex-1 text-sm" style={{ color: 'var(--color-text-primary)' }}>{toast.message}</p>
      <button onClick={() => onDismiss(toast.id)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
    </div>
  )
}
