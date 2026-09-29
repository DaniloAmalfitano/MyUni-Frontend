import React from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { LayoutDashboard, BookOpen, ListChecks, Settings, GraduationCap } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/libretto', icon: BookOpen, label: 'Libretto' },
  { to: '/piano-studi', icon: ListChecks, label: 'Piano di Studi' },
  { to: '/impostazioni', icon: Settings, label: 'Impostazioni' },
]

export function Sidebar() {
  const { connectionStatus } = useAuth()

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r h-screen sticky top-0" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Segrepass</h1>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Dashboard UniNA</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => clsx('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors', isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800')}
            style={({ isActive }) => isActive ? {} : { color: 'var(--color-text-secondary)' }}>
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 px-4 py-2">
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Portale:</span>
          <StatusBadge status={connectionStatus} />
        </div>
      </div>
    </aside>
  )
}
