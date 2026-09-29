import React, { useState, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronRight, ListChecks, AlertTriangle } from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { CardSkeleton } from '../components/Skeleton'
import { api } from '../api/client'
import { mockStudyPlan } from '../api/mockData'
import type { StudyPlanEntry } from '../types'

export function PianoStudiPage() {
  const [plan, setPlan] = useState<StudyPlanEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<number | null>(null)
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set())

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try { 
        const data = await api.getStudyPlan()
        setPlan(Array.isArray(data) ? data : [])
      }
      catch { 
        setPlan(mockStudyPlan) 
      }
      finally { 
        setLoading(false) 
      }
    }
    fetchData()
    }, [])

  useEffect(() => { if (plan.length > 0) setExpandedYears(new Set(plan.map(e => e.annoCorso))) }, [plan])

  const filtered = useMemo(() => activeFilter === null ? plan : plan.filter(e => e.annoCorso === activeFilter), [plan, activeFilter])

  const grouped = useMemo(() => {
    const groups: Record<number, StudyPlanEntry[]> = {}
    filtered.forEach(entry => { if (!groups[entry.annoCorso]) groups[entry.annoCorso] = []; groups[entry.annoCorso].push(entry) })
    return Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b)).map(([year, entries]) => ({ year: Number(year), entries }))
  }, [filtered])

  const totalCfuMancanti = plan.reduce((sum, e) => sum + e.cfu, 0)
  const uniqueYears = [...new Set(plan.map(e => e.annoCorso))].sort()
  const toggleYear = (year: number) => { setExpandedYears(prev => { const next = new Set(prev); if (next.has(year)) next.delete(year); else next.add(year); return next }) }

  if (loading) return (<div className="space-y-6"><div className="h-8 w-64 skeleton rounded-lg" /><div className="flex gap-2">{[1,2,3].map(i => <div key={i} className="skeleton h-9 w-20 rounded-full" />)}</div>{Array.from({length:3}).map((_,i) => <CardSkeleton key={i} />)}</div>)

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Piano di Studi</h1><p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Esami ancora da superare</p></div>
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-warning-50 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400"><AlertTriangle size={16} />{totalCfuMancanti} CFU mancanti</span>
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"><ListChecks size={16} />{plan.length} Esami rimanenti</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActiveFilter(null)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === null ? 'bg-primary-600 text-white' : 'border hover:bg-gray-50 dark:hover:bg-gray-800'}`} style={activeFilter !== null ? { borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' } : {}}>Tutti</button>
        {uniqueYears.map(year => (<button key={year} onClick={() => setActiveFilter(year)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === year ? 'bg-primary-600 text-white' : 'border hover:bg-gray-50 dark:hover:bg-gray-800'}`} style={activeFilter !== year ? { borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' } : {}}>Anno {year === 1 ? 'I' : year === 2 ? 'II' : 'III'}</button>))}
      </div>
      {grouped.length === 0 ? <EmptyState title="Nessun esame trovato" description="Tutti gli esami sono stati superati!" icon={<ListChecks size={32} className="text-success-500" />} /> : (
        <div className="space-y-4">
          {grouped.map(({ year, entries }) => { const isExpanded = expandedYears.has(year); const yearCfu = entries.reduce((s,e) => s+e.cfu, 0); const yearLabel = year===1?'I':year===2?'II':'III'; return (
            <div key={year} className="rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
              <button onClick={() => toggleYear(year)} className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50" style={{ backgroundColor: 'var(--color-bg-card)' }}>
                <div className="flex items-center gap-3">{isExpanded ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}<span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Anno {yearLabel}</span><span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800" style={{ color: 'var(--color-text-secondary)' }}>{entries.length} esami</span></div>
                <span className="text-sm font-medium text-warning-600 dark:text-warning-400">{yearCfu} CFU</span>
              </button>
              {isExpanded && (<div className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                <table className="w-full hidden md:table"><thead><tr style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                  <th className="px-5 py-2 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Codice</th>
                  <th className="px-5 py-2 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Insegnamento</th>
                  <th className="px-5 py-2 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>CFU</th>
                  <th className="px-5 py-2 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Settore</th>
                </tr></thead><tbody style={{ backgroundColor: 'var(--color-bg-card)' }}>
                  {entries.map((entry, i) => (<tr key={i} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-5 py-3"><span className="text-xs font-mono px-2 py-1 rounded bg-gray-100 dark:bg-gray-800" style={{ color: 'var(--color-text-secondary)' }}>{entry.codice}</span></td>
                    <td className="px-5 py-3 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{entry.insegnamento}</td>
                    <td className="px-5 py-3 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>{entry.cfu}</td>
                    <td className="px-5 py-3 text-right"><span className="text-xs font-mono px-2 py-1 rounded bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">{entry.settore}</span></td>
                  </tr>))}
                </tbody></table>
                <div className="md:hidden divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {entries.map((entry, i) => (<div key={i} className="px-5 py-3" style={{ backgroundColor: 'var(--color-bg-card)' }}><div className="flex items-start justify-between"><div><p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{entry.insegnamento}</p><p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{entry.codice} · {entry.settore}</p></div><span className="text-xs px-2 py-0.5 rounded-full bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400 font-medium">{entry.cfu} CFU</span></div></div>))}
                </div>
              </div>)}
            </div>
          )})}
        </div>
      )}
    </div>
  )
}
