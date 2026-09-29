import React from 'react'
import clsx from 'clsx'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'row' | 'circle'
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const variants = { text: 'h-4 w-3/4 rounded', card: 'h-32 w-full rounded-2xl', row: 'h-12 w-full rounded-lg', circle: 'h-10 w-10 rounded-full' }
  return <div className={clsx('skeleton rounded', variants[variant], className)} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl p-6 shadow-sm border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}>
      <Skeleton variant="text" className="w-1/3 mb-3" />
      <Skeleton variant="text" className="w-1/2 h-8 mb-2" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton variant="text" className={i === 1 ? 'w-full' : 'w-2/3'} />
        </td>
      ))}
    </tr>
  )
}
