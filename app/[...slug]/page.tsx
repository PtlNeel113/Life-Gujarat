import React from 'react'
import { AuthView } from '@/components/public/AuthView'
import { OnboardingView } from '@/components/public/OnboardingView'
import { AppShell } from '@/components/shared/AppShell'

// Citizen Views
import { DashboardView } from '@/components/citizen/DashboardView'
import { EnergyWorkspaceView } from '@/components/citizen/EnergyWorkspaceView'
import { ReadingsManagementView } from '@/components/citizen/ReadingsManagementView'
import { BillAnalysisView } from '@/components/citizen/BillAnalysisView'
import { FootprintAnalyticsView } from '@/components/citizen/FootprintAnalyticsView'
import { MissionsDiscoveryView } from '@/components/citizen/MissionsDiscoveryView'
import { MissionDetailView } from '@/components/citizen/MissionDetailView'
import { EnergyCoachView } from '@/components/citizen/EnergyCoachView'
import { SolarAdvisorView } from '@/components/citizen/SolarAdvisorView'
import { CommunityDiscoveryView } from '@/components/citizen/CommunityDiscoveryView'
import { CommunityDetailView } from '@/components/citizen/CommunityDetailView'
import { RewardsLedgerView } from '@/components/citizen/RewardsLedgerView'
import { LearnExploreView } from '@/components/citizen/LearnExploreView'
import { ArticleDetailView } from '@/components/citizen/ArticleDetailView'
import { ReportsView } from '@/components/citizen/ReportsView'
import { SettingsView } from '@/components/citizen/SettingsView'
import { NotificationsView } from '@/components/citizen/NotificationsView'

// Admin Views
import { AdminDashboardView } from '@/components/admin/AdminDashboardView'
import { AdminCampaignsView } from '@/components/admin/AdminCampaignsView'
import { AdminMissionsView } from '@/components/admin/AdminMissionsView'
import { AdminCommunitiesView } from '@/components/admin/AdminCommunitiesView'
import { AdminEvidenceView } from '@/components/admin/AdminEvidenceView'
import { AdminAnalyticsView } from '@/components/admin/AdminAnalyticsView'
import { AdminDistrictImpactView } from '@/components/admin/AdminDistrictImpactView'
import { AdminReportsView } from '@/components/admin/AdminReportsView'
import { AdminUsersView } from '@/components/admin/AdminUsersView'
import { AdminAuditLogsView } from '@/components/admin/AdminAuditLogsView'

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const path = slug.join('/')

  // PUBLIC ROUTES
  if (path === 'login') return <AuthView mode="login" />
  if (path === 'register') return <AuthView mode="register" />
  if (path === 'forgot-password') return <AuthView mode="forgot-password" />
  if (path === 'onboarding') return <OnboardingView />

  // CITIZEN ROUTES
  if (path === 'dashboard') {
    return (
      <AppShell activeNav="Overview" title="Dashboard Overview">
        <DashboardView />
      </AppShell>
    )
  }

  if (path === 'energy') {
    return (
      <AppShell activeNav="My Energy" title="My Energy Workspace">
        <EnergyWorkspaceView />
      </AppShell>
    )
  }

  if (path === 'energy/readings') {
    return (
      <AppShell activeNav="Readings History" title="Energy Readings History">
        <ReadingsManagementView />
      </AppShell>
    )
  }

  if (path === 'energy/bill-analysis') {
    return (
      <AppShell activeNav="Bill Analysis" title="Electricity Bill Analysis">
        <BillAnalysisView />
      </AppShell>
    )
  }

  if (path === 'footprint') {
    return (
      <AppShell activeNav="My Footprint" title="My Carbon Footprint">
        <FootprintAnalyticsView />
      </AppShell>
    )
  }

  if (path === 'missions') {
    return (
      <AppShell activeNav="Daily Missions" title="Mission LiFE Daily Actions">
        <MissionsDiscoveryView />
      </AppShell>
    )
  }

  if (slug[0] === 'missions' && slug[1]) {
    return (
      <AppShell activeNav="Daily Missions" title="Mission Details">
        <MissionDetailView missionId={slug[1]} />
      </AppShell>
    )
  }

  if (path === 'energy-coach') {
    return (
      <AppShell activeNav="AI Energy Coach" title="AI Energy Coach">
        <EnergyCoachView />
      </AppShell>
    )
  }

  if (path === 'solar-advisor') {
    return (
      <AppShell activeNav="Solar Advisor" title="PM Surya Ghar Solar Advisor">
        <SolarAdvisorView />
      </AppShell>
    )
  }

  if (path === 'community') {
    return (
      <AppShell activeNav="Community" title="Community Collectives">
        <CommunityDiscoveryView />
      </AppShell>
    )
  }

  if (slug[0] === 'community' && slug[1]) {
    return (
      <AppShell activeNav="Community" title="Community Challenge">
        <CommunityDetailView communityId={slug[1]} />
      </AppShell>
    )
  }

  if (path === 'rewards') {
    return (
      <AppShell activeNav="Rewards" title="LiFE Rewards & Ledger">
        <RewardsLedgerView />
      </AppShell>
    )
  }

  if (path === 'learn') {
    return (
      <AppShell activeNav="Learn & Explore" title="Learn & Explore">
        <LearnExploreView />
      </AppShell>
    )
  }

  if (slug[0] === 'learn' && slug[1]) {
    return (
      <AppShell activeNav="Learn & Explore" title="Citizen Guide">
        <ArticleDetailView slug={slug[1]} />
      </AppShell>
    )
  }

  if (path === 'reports') {
    return (
      <AppShell activeNav="Reports" title="Personal Impact Statement">
        <ReportsView />
      </AppShell>
    )
  }

  if (path === 'settings') {
    return (
      <AppShell activeNav="Settings" title="Account Settings">
        <SettingsView />
      </AppShell>
    )
  }

  if (path === 'notifications') {
    return (
      <AppShell activeNav="Notifications" title="Notifications">
        <NotificationsView />
      </AppShell>
    )
  }

  // ADMIN ROUTES
  if (path === 'admin') {
    return (
      <AppShell activeNav="Overview" title="Directorate Command Center">
        <AdminDashboardView />
      </AppShell>
    )
  }

  if (path === 'admin/campaigns') {
    return (
      <AppShell activeNav="Campaigns" title="State Campaigns">
        <AdminCampaignsView />
      </AppShell>
    )
  }

  if (path === 'admin/missions') {
    return (
      <AppShell activeNav="Missions" title="Mission Catalog">
        <AdminMissionsView />
      </AppShell>
    )
  }

  if (path === 'admin/communities') {
    return (
      <AppShell activeNav="Communities" title="Community Moderation">
        <AdminCommunitiesView />
      </AppShell>
    )
  }

  if (path === 'admin/evidence') {
    return (
      <AppShell activeNav="Evidence Desk" title="Evidence Verification Desk">
        <AdminEvidenceView />
      </AppShell>
    )
  }

  if (path === 'admin/analytics') {
    return (
      <AppShell activeNav="Analytics" title="Programme Analytics">
        <AdminAnalyticsView />
      </AppShell>
    )
  }

  if (path === 'admin/district-impact') {
    return (
      <AppShell activeNav="District Impact" title="Gujarat District Impact">
        <AdminDistrictImpactView />
      </AppShell>
    )
  }

  if (path === 'admin/reports') {
    return (
      <AppShell activeNav="Reports" title="Directorate Reports">
        <AdminReportsView />
      </AppShell>
    )
  }

  if (path === 'admin/users') {
    return (
      <AppShell activeNav="Users & Roles" title="Citizen & Role Management">
        <AdminUsersView />
      </AppShell>
    )
  }

  if (path === 'admin/audit-logs') {
    return (
      <AppShell activeNav="Audit Trail" title="Security Audit Trail">
        <AdminAuditLogsView />
      </AppShell>
    )
  }

  // Fallback to Dashboard
  return (
    <AppShell activeNav="Overview" title="Dashboard Overview">
      <DashboardView />
    </AppShell>
  )
}
