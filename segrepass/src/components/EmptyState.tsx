import React from 'react'
import { FileX } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full p-4 mb-4 bg-gray-100 dark:bg-gray-800">
        {icon || <FileX size={32} className="text-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
      {description && <p className="text-sm max-w-sm" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
