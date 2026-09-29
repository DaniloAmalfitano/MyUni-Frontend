export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  message: string
  sessionId: string
}

export interface StudentSummary {
  creditiMaturati: string
  creditiMancanti: string
  creditiTotali: string
  esamiSostenuti: string
  esamiInMedia: string
  mediaPonderataSu30: string
  mediaAritmeticaSu30: string
  mediaPonderataSu110: string
  mediaAritmeticaSu110: string
  numeroLodi: string
}

export interface TranscriptEntry {
  codice: string
  insegnamento: string
  voto: string
  cfu: number
  data: string
}

export interface StudyPlanEntry {
  codice: string
  insegnamento: string
  annoCorso: number
  cfu: number
  settore: string
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export type SortField = 'data' | 'voto' | 'insegnamento'
export type SortDirection = 'asc' | 'desc'
