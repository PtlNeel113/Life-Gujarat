import React from 'react'
import { AppShell } from '@/components/shared/AppShell'
import { AdminDashboardView } from '@/components/admin/AdminDashboardView'

export default function AdminPage() {
  return (
    <AppShell activeNav="Command Center" title="Directorate Command Center">
      <AdminDashboardView />
    </AppShell>
  )
}
