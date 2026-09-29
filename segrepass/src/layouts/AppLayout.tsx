import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { BottomNav } from '../components/BottomNav'
import { Header } from '../components/Header'
import { useAuth } from '../context/AuthContext'

export function AppLayout() {
  const { isAuthenticated, connectionStatus } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (connectionStatus !== 'connected') return <Navigate to="/connect" replace />

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8 max-w-6xl w-full mx-auto"><Outlet /></main>
      </div>
      <BottomNav />
    </div>
  )
}
