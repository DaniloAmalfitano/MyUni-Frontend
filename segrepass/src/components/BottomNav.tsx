import React from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { LayoutDashboard, BookOpen, ListChecks, Settings } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/libretto', icon: BookOpen, label: 'Libretto' },
  { to: '/piano-studi', icon: ListChecks, label: 'Piano' },
  { to: '/impostazioni', icon: Settings, label: 'Altro' },
]

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t z-40" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => clsx('flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors', isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500')}>
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
