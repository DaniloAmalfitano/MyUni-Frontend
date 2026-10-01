import type { LoginRequest, LoginResponse, StudentSummary, TranscriptEntry, StudyPlanEntry } from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

let sessionId: string | null = localStorage.getItem('sessionId')

export function getSessionId(): string | null {
  return sessionId
}

export function setSessionId(id: string | null) {
  sessionId = id
  if (id) {
    localStorage.setItem('sessionId', id)
  } else {
    localStorage.removeItem('sessionId')
  }
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  if (sessionId) {
    headers['X-Session-Id'] = sessionId

  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      setSessionId(null)
      window.dispatchEvent(new CustomEvent('session-expired'))
    }
    const errorText = await response.text().catch(() => 'Errore sconosciuto')
    throw new ApiError(response.status, errorText)
  }

  return response.json()
}

export const api = {
  health: () => request<{ status: string }>('/health'),

  logout: async (): Promise<void> => {
    await request<void>('/auth/logout', { method: 'POST' })
    setSessionId(null)
  },

  connect: async (username: string, password: string) => {
    const result = await request<{ message: string; sessionId: string }>('/segrepass/connect', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
  })

  setSessionId(result.sessionId)

  return result
},


getStudentSummary: () => request<{ studentSummary: StudentSummary[] }>('/segrepass/student-summary'),

getTranscript: async (): Promise<TranscriptEntry[]> => {
  const res = await request<{ transcript: TranscriptEntry[] }>('/segrepass/transcript')
  return res.transcript
},

//getStudyPlan: () => request<StudyPlanEntry[]>('/segrepass/study-plan'),
  getStudyPlan: async (): Promise<StudyPlanEntry[]> => {
    const res = await request<{ pianoDiStudi: any[] }>('/segrepass/study-plan')
    
    const mapAnnoToNumber = (anno: string | number): number => {
      if (typeof anno === 'number') return anno
      const normalizzato = String(anno).trim().toUpperCase()
      if (normalizzato.includes('PRIM') || normalizzato === '1' || normalizzato === 'I') return 1
      if (normalizzato.includes('SECOND') || normalizzato === '2' || normalizzato === 'II') return 2
      if (normalizzato.includes('TERZ') || normalizzato === '3' || normalizzato === 'III') return 3
      return 1
    }

    return (res.pianoDiStudi || []).map(item => ({
      ...item,
      annoCorso: mapAnnoToNumber(item.annoCorso)
    }))
  },

  getStudentName: async (): Promise<string> => {
    const res = await request<{ studentName: string }>('/segrepass/student-name')
    return res.studentName   
  },

  getStudentId: async (): Promise<string> => {
    const res = await request<{ studentId: string }>('/segrepass/student-id')
    return res.studentId   
  },
  getDegreeCourse: async (): Promise<string> => {
    const res = await request<{ degreeCourse: string }>('/segrepass/degree-course')
    return res.degreeCourse   
  },
}



