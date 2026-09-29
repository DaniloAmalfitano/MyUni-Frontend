import React from 'react'
import clsx from 'clsx'
import { Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react'
import type { ConnectionStatus } from '../types'

interface StatusBadgeProps {
  status: ConnectionStatus
  compact?: boolean
}

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  const config = {
    connected: { icon: <Wifi size={14} />, label: 'Connesso', className: 'bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400' },
    disconnected: { icon: <WifiOff size={14} />, label: 'Non connesso', className: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' },
    connecting: { icon: <Loader2 size={14} className="animate-spin" />, label: 'Connessione...', className: 'bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400' },
    error: { icon: <AlertCircle size={14} />, label: 'Errore', className: 'bg-danger-100 text-danger-600 dark:bg-danger-500/20 dark:text-danger-400' },
  }
  const { icon, label, className } = config[status]

  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium', className)}>
      {icon}
      {!compact && label}
    </span>
  )
}
