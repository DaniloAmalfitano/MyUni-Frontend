import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { api, getSessionId, setSessionId } from '../api/client'
import type { ConnectionStatus } from '../types'

interface AuthContextType {
  isAuthenticated: boolean
  sessionId: string | null
  userName: string | null
  connectionStatus: ConnectionStatus
  logout: () => Promise<void>
  connectSegrepass: (username: string, password: string) => Promise<void>
  setConnectionStatus: (status: ConnectionStatus) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!getSessionId()
  )

  const [sessionId, setSessionIdState] = useState<string | null>(
    () => getSessionId()
  )

  const [userName, setUserName] = useState<string | null>(
    () => localStorage.getItem('userName')
  )

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>(() => {
      const saved = localStorage.getItem('connectionStatus')
      return (saved as ConnectionStatus) || 'disconnected'
    })

  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(false)
      setSessionIdState(null)
      setUserName(null)
      setConnectionStatus('disconnected')

      localStorage.removeItem('userName')
      localStorage.removeItem('connectionStatus')
    }

    window.addEventListener('session-expired', handler)

    return () => {
      window.removeEventListener('session-expired', handler)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('connectionStatus', connectionStatus)
  }, [connectionStatus])

  const connectSegrepass = useCallback(
    async (username: string, password: string) => {
      setConnectionStatus('connecting')

      try {
        const result = await api.connect(username, password)

        setSessionIdState(result.sessionId)
        setIsAuthenticated(true)
        setUserName(username)

        localStorage.setItem('userName', username)

        setConnectionStatus('connected')
      } catch (error) {
        setConnectionStatus('error')
        throw error
      }
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      
    }

    setSessionId(null)
    setSessionIdState(null)

    setIsAuthenticated(false)
    setUserName(null)
    setConnectionStatus('disconnected')

    localStorage.removeItem('userName')
    localStorage.removeItem('connectionStatus')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        sessionId,
        userName,
        connectionStatus,
        logout,
        connectSegrepass,
        setConnectionStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return ctx
}
