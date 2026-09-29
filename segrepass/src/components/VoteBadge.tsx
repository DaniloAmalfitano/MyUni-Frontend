import React from 'react'
import clsx from 'clsx'

interface VoteBadgeProps {
  voto: string | number
}

export function VoteBadge({ voto }: VoteBadgeProps) {
  const votoStr = String(voto ?? '')
  const numVoto = typeof voto === 'number' ? voto : parseInt(votoStr, 10)
  const isLode = votoStr.toUpperCase().includes('L')
  const isIdoneo = votoStr.toLowerCase().includes('idoneo')

  let colorClass = ''
  if (isIdoneo) {
    colorClass = 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
  } else if (isLode || (!isNaN(numVoto) && numVoto >= 27)) {
    colorClass = 'bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400'
  } else if (!isNaN(numVoto) && numVoto >= 24) {
    colorClass = 'bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400'
  } else if (!isNaN(numVoto) && numVoto >= 18) {
    colorClass = 'bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400'
  } else {
    colorClass = 'bg-danger-100 text-danger-600 dark:bg-danger-500/20 dark:text-danger-400'
  }

  return (
    <span className={clsx('inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold', colorClass)}>
      {votoStr}
    </span>
  )
}