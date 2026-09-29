import React from 'react'

interface ProgressRingProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  label?: string
}

export function ProgressRing({ value, max, size = 140, strokeWidth = 10, label }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(value / max, 1)
  const offset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-border)" strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#4F46E5" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>/ {max} CFU</span>
        </div>
      </div>
      {label && <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>}
    </div>
  )
}
