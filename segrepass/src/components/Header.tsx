import React from 'react'
import { GraduationCap } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { useAuth } from '../context/AuthContext'

export function Header() {
  const { connectionStatus } = useAuth()

  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-30" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <GraduationCap size={16} className="text-white" />
        </div>
        <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Segrepass</span>
      </div>
      <StatusBadge status={connectionStatus} compact />
    </header>
  )
}
