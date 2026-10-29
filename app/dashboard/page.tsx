import React from 'react'
import { AppShell } from '@/components/shared/AppShell'
import { DashboardView } from '@/components/citizen/DashboardView'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell activeNav="Overview" title="Dashboard Overview">
        <DashboardView />
      </AppShell>
    </ProtectedRoute>
  )
}
