import React, { useState, useEffect, useMemo } from 'react'
import { Search, ArrowUpDown, BookOpen, Award } from 'lucide-react'
import { VoteBadge } from '../components/VoteBadge'
import { EmptyState } from '../components/EmptyState'
import { TableRowSkeleton } from '../components/Skeleton'
import { api } from '../api/client'
import { mockTranscript } from '../api/mockData'
import type { TranscriptEntry, SortField, SortDirection } from '../types'

export function LibrettoPage() {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('data')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try { const data = await api.getTranscript(); setTranscript(data) }
      catch { setTranscript(mockTranscript) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  
  }

  const filtered = useMemo(() => {
    let items = [...transcript]
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(e => e.insegnamento.toLowerCase().includes(q) || e.codice.toLowerCase().includes(q))
    }
    items.sort((a, b) => {
      let cmp = 0
      if (sortField === 'data') {
        const [dA, mA, yA] = a.data.split('/'); const [dB, mB, yB] = b.data.split('/')
        cmp = new Date(`${yA}-${mA}-${dA}`).getTime() - new Date(`${yB}-${mB}-${dB}`).getTime()
      } else if (sortField === 'voto') { cmp = parseInt(a.voto) - parseInt(b.voto) }
      else if (sortField === 'insegnamento') { cmp = a.insegnamento.localeCompare(b.insegnamento) }
      else if (sortField === 'voto') { cmp = parseInt(a.voto) - parseInt(b.voto) }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return items
  }, [transcript, search, sortField, sortDir])

  const totalCfu = transcript.reduce((sum, e) => sum + e.cfu, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Libretto</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Registro degli esami sostenuti</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"><BookOpen size={16} />{transcript.length} Esami superati</span>
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-success-50 text-success-600 dark:bg-success-500/20 dark:text-success-400"><Award size={16} />{totalCfu} CFU totali</span>
      </div>
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca insegnamento..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
      </div>
      <div className="hidden md:block rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-primary)' }}>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Codice</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer" style={{ color: 'var(--color-text-secondary)' }} onClick={() => toggleSort('insegnamento')}><span className="inline-flex items-center gap-1">Insegnamento <ArrowUpDown size={12} /></span></th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer" style={{ color: 'var(--color-text-secondary)' }} onClick={() => toggleSort('voto')}><span className="inline-flex items-center gap-1">Voto <ArrowUpDown size={12} /></span></th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>CFU</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider cursor-pointer" style={{ color: 'var(--color-text-secondary)' }} onClick={() => toggleSort('data')}><span className="inline-flex items-center gap-1 justify-end">Data <ArrowUpDown size={12} /></span></th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ backgroundColor: 'var(--color-bg-card)' }}>
            {loading ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} />) : filtered.length === 0 ? (
              <tr><td colSpan={5}><EmptyState title="Nessun risultato" description={search ? 'Prova con un termine diverso' : 'Nessun esame registrato'} /></td></tr>
            ) : filtered.map((exam, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" style={{ borderColor: 'var(--color-border)' }}>
                <td className="px-4 py-3"><span className="text-xs font-mono px-2 py-1 rounded bg-gray-100 dark:bg-gray-800" style={{ color: 'var(--color-text-secondary)' }}>{exam.codice}</span></td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{exam.insegnamento}</td>
                <td className="px-4 py-3 text-center"><VoteBadge voto={exam.voto} /></td>
                <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>{exam.cfu}</td>
                <td className="px-4 py-3 text-right text-sm" style={{ color: 'var(--color-text-secondary)' }}>{exam.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl p-4 border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}>
            <div className="skeleton h-4 w-3/4 rounded mb-2" /><div className="skeleton h-3 w-1/2 rounded mb-3" />
            <div className="flex gap-2"><div className="skeleton h-6 w-12 rounded-full" /><div className="skeleton h-6 w-16 rounded-full" /></div>
          </div>
        )) : filtered.length === 0 ? <EmptyState title="Nessun risultato" description={search ? 'Prova con un termine diverso' : 'Nessun esame registrato'} /> :
        filtered.map((exam, i) => (
          <div key={i} className="rounded-xl p-4 border shadow-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{exam.insegnamento}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{exam.codice}</p>
              </div>
              <VoteBadge voto={exam.voto} />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800" style={{ color: 'var(--color-text-secondary)' }}>{exam.cfu} CFU</span>
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{exam.data}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
