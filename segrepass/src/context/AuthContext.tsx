import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { api, getSessionId, setSessionId } from '../api/client'
import type { ConnectionStatus } from '../types'

interface AuthContextType {
  isAuthenticated: boolean
  sessionId: string | null
  userName: string | null
  credentials: { username: string; password: string } | null
  connectionStatus: ConnectionStatus
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  connectSegrepass: (username: string, password: string) => Promise<void>
  setConnectionStatus: (status: ConnectionStatus) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getSessionId())
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('userName'))
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(() => {
    const saved = localStorage.getItem('connectionStatus')
    return (saved as ConnectionStatus) || 'disconnected'
  })

  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(false)
      setUserName(null)
      setCredentials(null)
      setConnectionStatus('disconnected')
      localStorage.removeItem('userName')
      localStorage.removeItem('connectionStatus')
    }
    window.addEventListener('session-expired', handler)
    return () => window.removeEventListener('session-expired', handler)
  }, [])

  useEffect(() => {
    localStorage.setItem('connectionStatus', connectionStatus)
  }, [connectionStatus])

  const login = useCallback(async (username: string, password: string) => {
    const result = await api.login({ username, password })
    setIsAuthenticated(true)
    setUserName(username)
    setCredentials({ username, password })
    localStorage.setItem('userName', username)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      // logout anyway on client side
    }
    setSessionId(null)
    setIsAuthenticated(false)
    setUserName(null)
    setCredentials(null)
    setConnectionStatus('disconnected')
    localStorage.removeItem('userName')
    localStorage.removeItem('connectionStatus')
  }, [])

  const connectSegrepass = useCallback(async (username: string, password: string) => {
    setConnectionStatus('connecting')
    try {
      await api.connect(username, password)
      setConnectionStatus('connected')
    } catch {
      setConnectionStatus('error')
      throw new Error('Connessione fallita')
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      sessionId: getSessionId(),
      userName,
      credentials,
      connectionStatus,
      login,
      logout,
      connectSegrepass,
      setConnectionStatus,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
