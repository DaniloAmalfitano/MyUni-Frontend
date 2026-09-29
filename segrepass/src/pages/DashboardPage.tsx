import React, { useState, useEffect } from 'react'
import { BookOpen, Award, Star, TrendingUp, Calendar } from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { ProgressRing } from '../components/ProgressRing'
import { VoteBadge } from '../components/VoteBadge'
import { CardSkeleton } from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import { mockSummary, mockTranscript } from '../api/mockData'
import type { StudentSummary, TranscriptEntry } from '../types'

export function DashboardPage() {
  const { userName } = useAuth()
  const [summary, setSummary] = useState<StudentSummary | null>(null)
  const [recentExams, setRecentExams] = useState<TranscriptEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [mediaMode, setMediaMode] = useState<'30' | '110'>('30')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [summaryData, transcriptData] = await Promise.all(
          [
            api.getStudentSummary(),
            api.getTranscript(),
          ])
        setSummary(summaryData.studentSummary[0])
        setRecentExams(transcriptData.slice(0,5))
      } catch {
        setSummary(mockSummary)
        setRecentExams(mockTranscript.slice(0,5))
      } finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buongiorno'
    if (hour < 18) return 'Buon pomeriggio'
    return 'Buonasera'
  }

  const formatMedia = (raw: string) => {
    const [num, den] = raw.split('/')
    return { value: parseFloat(num).toFixed(2), denominator: den }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 skeleton rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  if (!summary) return null

  const mediaPond = formatMedia(mediaMode === '30' ? summary.mediaPonderataSu30 : summary.mediaPonderataSu110)
  const mediaArit = formatMedia(mediaMode === '30' ? summary.mediaAritmeticaSu30 : summary.mediaAritmeticaSu110)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{greeting()}, {userName || 'Marco'} 👋</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Ecco un riepilogo della tua carriera universitaria</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="sm:col-span-2 xl:col-span-1">
          <div className="rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
            <p className="text-sm font-medium mb-4" style={{ color: 'var(--color-text-secondary)' }}>Crediti Maturati</p>
            <ProgressRing value={Number(summary.creditiMaturati)} max={Number(summary.creditiTotali)}/>
          </div>
        </div>
        <StatCard label="Esami Sostenuti" value={summary.esamiSostenuti} icon={<BookOpen size={22} />} color="primary" />
        <StatCard label="Esami in Media" value={summary.esamiInMedia} icon={<TrendingUp size={22} />} color="success" />
        <StatCard label="Numero Lodi" value={summary.numeroLodi} icon={<Star size={22} />} color="warning" subtitle={`su ${summary.esamiSostenuti} esami`} />
      </div>
      <div className="rounded-2xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Medie</h2>
          <div className="flex items-center rounded-xl p-1 border" style={{ borderColor: 'var(--color-border)' }}>
            <button onClick={() => setMediaMode('30')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${mediaMode === '30' ? 'bg-primary-600 text-white' : ''}`} style={mediaMode !== '30' ? { color: 'var(--color-text-secondary)' } : {}}>/ 30</button>
            <button onClick={() => setMediaMode('110')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${mediaMode === '110' ? 'bg-primary-600 text-white' : ''}`} style={mediaMode !== '110' ? { color: 'var(--color-text-secondary)' } : {}}>/ 110</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl p-5 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
            <p className="text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">Media Ponderata</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-primary-700 dark:text-primary-300">{mediaPond.value}</span>
              <span className="text-lg text-primary-400">/{mediaPond.denominator}</span>
            </div>
          </div>
          <div className="rounded-xl p-5 border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-primary)' }}>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-secondary)' }}>Media Aritmetica</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{mediaArit.value}</span>
              <span className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>/{mediaArit.denominator}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Ultimi Esami</h2>
        <div className="space-y-3">
          {recentExams.map((exam, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{exam.insegnamento}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{exam.codice}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}><Calendar size={10} className="inline mr-1" />{exam.data}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800" style={{ color: 'var(--color-text-secondary)' }}>{exam.cfu} CFU</span>
                <VoteBadge voto={exam.voto} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
