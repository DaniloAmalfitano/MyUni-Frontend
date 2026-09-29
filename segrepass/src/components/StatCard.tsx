import React, { useEffect, useState } from 'react'
import clsx from 'clsx'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  color?: 'primary' | 'success' | 'warning' | 'danger'
  subtitle?: string
}

export function StatCard({ label, value, icon, color = 'primary', subtitle }: StatCardProps) {
  const [displayed, setDisplayed] = useState(0)
  const numValue = typeof value === 'number' ? value : parseInt(value)
  const isNum = !isNaN(numValue)

  useEffect(() => {
    if (!isNum) return
    let start = 0
    const duration = 800
    const step = Math.ceil(numValue / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= numValue) {
        setDisplayed(numValue)
        clearInterval(timer)
      } else {
        setDisplayed(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [numValue, isNum])

  const colorMap = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
    success: 'bg-success-50 text-success-600 dark:bg-success-500/20 dark:text-success-400',
    warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400',
    danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/20 dark:text-danger-400',
  }

  return (
    <div className="rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md"
         style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
          <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {isNum ? displayed : value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>{subtitle}</p>
          )}
        </div>
        <div className={clsx('rounded-xl p-3', colorMap[color])}>
          {icon}
        </div>
      </div>
    </div>
  )
}
