import type { StudentSummary, TranscriptEntry, StudyPlanEntry } from '../types'

export const mockSummary: StudentSummary = {
  creditiMaturati: 105,
  creditiMancanti: 71,
  creditiTotali: 176,
  esamiSostenuti: 17,
  esamiInMedia: 15,
  numeroLodi: 3,
  mediaPonderataSu30: '25.794/30',
  mediaAritmeticaSu30: '26.118/30',
  mediaPonderataSu110: '94.562/110',
  mediaAritmeticaSu110: '95.764/110',
}

export const mockTranscript: TranscriptEntry[] = [
  { codice: 'INF01', insegnamento: 'Programmazione I', voto: '28', cfu: 9, data: '15/01/2023' },
  { codice: 'MAT01', insegnamento: 'Analisi Matematica I', voto: '24', cfu: 12, data: '08/02/2023' },
  { codice: 'INF02', insegnamento: 'Architettura degli Elaboratori', voto: '30L', cfu: 6, data: '22/06/2023' },
  { codice: 'INF03', insegnamento: 'Algoritmi e Strutture Dati', voto: '27', cfu: 9, data: '12/07/2023' },
  { codice: 'INF04', insegnamento: 'Basi di Dati', voto: '25', cfu: 6, data: '15/09/2023' },
  { codice: 'INF05', insegnamento: 'Sistemi Operativi', voto: '30', cfu: 9, data: '18/01/2024' },
  { codice: 'INF06', insegnamento: 'Reti di Calcolatori', voto: '22', cfu: 6, data: '10/02/2024' },
  { codice: 'INF07', insegnamento: 'Ingegneria del Software', voto: '29', cfu: 9, data: '05/06/2024' },
  { codice: 'MAT02', insegnamento: 'Analisi Matematica II', voto: '21', cfu: 9, data: '18/06/2024' },
  { codice: 'FIS01', insegnamento: 'Fisica Generale', voto: '26', cfu: 6, data: '10/07/2024' },
  { codice: 'INF08', insegnamento: 'Programmazione II', voto: '30L', cfu: 9, data: '15/09/2024' },
  { codice: 'MAT03', insegnamento: 'Algebra Lineare', voto: '23', cfu: 6, data: '20/01/2025' },
  { codice: 'INF09', insegnamento: 'Logica Matematica', voto: '28', cfu: 6, data: '12/02/2025' },
  { codice: 'INF10', insegnamento: 'Linguaggi Formali e Automi', voto: '30L', cfu: 6, data: '25/06/2025' },
  { codice: 'INF11', insegnamento: 'Calcolo Numerico', voto: '27', cfu: 6, data: '08/07/2025' },
  { codice: 'INF12', insegnamento: 'Interazione Uomo-Macchina', voto: '26', cfu: 6, data: '15/09/2025' },
  { codice: 'INF13', insegnamento: 'Programmazione Web', voto: '29', cfu: 6, data: '20/09/2025' },
]

export const mockStudyPlan: StudyPlanEntry[] = [
  { codice: 'MAT04', insegnamento: 'Calcolo delle Probabilità', annoCorso: 2, cfu: 6, settore: 'MAT/06' },
  { codice: 'INF14', insegnamento: 'Linguaggi di Programmazione', annoCorso: 2, cfu: 6, settore: 'INF/01' },
  { codice: 'INF15', insegnamento: 'Intelligenza Artificiale', annoCorso: 3, cfu: 9, settore: 'INF/01' },
  { codice: 'INF16', insegnamento: 'Sicurezza Informatica', annoCorso: 3, cfu: 6, settore: 'INF/01' },
  { codice: 'INF17', insegnamento: 'Compilatori', annoCorso: 3, cfu: 6, settore: 'INF/01' },
  { codice: 'INF18', insegnamento: 'Sistemi Distribuiti', annoCorso: 3, cfu: 9, settore: 'ING-INF/05' },
  { codice: 'INF19', insegnamento: 'Machine Learning', annoCorso: 3, cfu: 6, settore: 'INF/01' },
  { codice: 'INF20', insegnamento: 'Gestione dei Progetti Software', annoCorso: 3, cfu: 6, settore: 'ING-INF/05' },
  { codice: 'MAT05', insegnamento: 'Ricerca Operativa', annoCorso: 2, cfu: 6, settore: 'MAT/09' },
  { codice: 'INF21', insegnamento: 'Elaborazione di Immagini', annoCorso: 3, cfu: 6, settore: 'INF/01' },
  { codice: 'INF22', insegnamento: 'Prova Finale', annoCorso: 3, cfu: 5, settore: 'PROFIN_S' },
]
