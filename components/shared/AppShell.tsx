'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Leaf,
  BarChart3,
  Zap,
  FileText,
  ScanLine,
  Flame,
  CheckSquare,
  Sparkles,
  Sun,
  Users,
  Trophy,
  BookOpen,
  PieChart,
  Settings,
  Bell,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  LogOut,
  UserCheck,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  ClipboardList,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { UserProfile, NotificationItem } from '@/lib/types'
import { translations } from '@/lib/translations'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { useAuth } from '@/components/providers/AuthProvider'

interface AppShellProps {
  children: React.ReactNode
  activeNav?: string
  title?: string
  subtitle?: string
}

export function AppShell({ children, activeNav, title, subtitle }: AppShellProps) {
  const pathname = usePathname()
  const { user: authUser, logout, switchRole: authSwitchRole } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserProfile>(authUser || dataStore.getUser())
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [lang, setLang] = useState<'en' | 'gu'>('en')

  useEffect(() => {
    const user = authUser || dataStore.getUser()
    setCurrentUser(user)
    setLang(user.language || 'en')
    setNotifications(dataStore.getNotifications())
  }, [pathname, authUser])

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const t = translations[lang]

  const toggleLanguage = () => {
    const nextLang: 'en' | 'gu' = lang === 'en' ? 'gu' : 'en'
    setLang(nextLang)
    const updated: UserProfile = { ...currentUser, language: nextLang }
    dataStore.setUser(updated)
    setCurrentUser(updated)
  }

  const handleRoleSwitch = (targetRole: 'citizen' | 'admin') => {
    const switched = authSwitchRole ? authSwitchRole(targetRole) : dataStore.switchRole(targetRole)
    setCurrentUser(switched)
    setProfileDropdownOpen(false)
    if (targetRole === 'admin') {
      window.location.href = '/admin'
    } else {
      window.location.href = '/dashboard'
    }
  }

  const handleLogout = () => {
    if (logout) {
      logout()
    } else {
      dataStore.logout()
    }
    setProfileDropdownOpen(false)
    setMobileMenuOpen(false)
    window.location.href = '/login'
  }

  const markAllRead = () => {
    dataStore.markAllNotificationsRead()
    setNotifications(dataStore.getNotifications())
  }

  // Navigation Links
  const citizenNavItems = [
    { label: t.overview, href: '/dashboard', icon: BarChart3 },
    { label: t.myEnergy, href: '/energy', icon: Zap },
    { label: 'Readings History', href: '/energy/readings', icon: FileText },
    { label: 'Bill Analysis', href: '/energy/bill-analysis', icon: ScanLine },
    { label: t.myFootprint, href: '/footprint', icon: Leaf },
    { label: t.dailyMissions, href: '/missions', icon: CheckSquare },
    { label: t.energyCoach, href: '/energy-coach', icon: Sparkles },
    { label: t.solarAdvisor, href: '/solar-advisor', icon: Sun },
    { label: t.community, href: '/community', icon: Users },
    { label: t.rewards, href: '/rewards', icon: Trophy },
    { label: t.learnExplore, href: '/learn', icon: BookOpen },
    { label: t.myReports, href: '/reports', icon: PieChart },
    { label: t.settings, href: '/settings', icon: Settings },
  ]

  const adminNavItems = [
    { label: 'Overview', href: '/admin', icon: Layers },
    { label: 'Evidence Desk', href: '/admin/evidence', icon: CheckCircle2 },
    { label: 'District Impact', href: '/admin/district-impact', icon: MapPin },
    { label: 'Campaigns', href: '/admin/campaigns', icon: Flame },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Communities', href: '/admin/communities', icon: Users },
    { label: 'Users & Roles', href: '/admin/users', icon: UserCheck },
    { label: 'Audit Trail', href: '/admin/audit-logs', icon: ClipboardList },
  ]

  const isAdminSection = pathname.startsWith('/admin')

  return (
    <ProtectedRoute requiredRole={isAdminSection ? 'admin' : undefined}>
      <div className="min-h-screen bg-[#F6F8F3] text-[#18241F]">
        {/* Mobile Top Navigation */}
      <div className="flex h-16 items-center justify-between border-b border-[#E3E8DF] bg-white px-4 lg:hidden print:hidden">
        <Link href="/" className="flex items-center gap-2 font-bold text-[#103D30]">
          <span className="grid size-8 place-items-center rounded-lg bg-[#B8E986] text-[#176B4D]">
            <Leaf size={18} fill="currentColor" />
          </span>
          <span className="text-base tracking-tight">LiFE Gujarat</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative grid size-9 place-items-center rounded-full border border-[#E3E8DF] bg-white text-[#103D30]"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#176B4D] text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid size-9 place-items-center rounded-lg border border-[#E3E8DF] text-[#103D30]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-[#E3E8DF] bg-[#FBFCF8] p-5 lg:flex print:hidden">
          <div>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-[#103D30]">
              <span className="grid size-9 place-items-center rounded-xl bg-[#B8E986] text-[#176B4D] shadow-sm">
                <Leaf size={20} fill="currentColor" />
              </span>
              <div className="flex flex-col">
                <span className="text-[17px] leading-tight">LiFE <span className="font-normal text-[#176B4D]">Gujarat</span></span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#66736B]">Citizen Platform</span>
              </div>
            </Link>

            {/* Mode Switcher Pill */}
            <div className="mt-6 flex items-center justify-between rounded-xl bg-[#EEF4E8] p-1.5 text-xs">
              <button
                onClick={() => handleRoleSwitch('citizen')}
                className={`flex-1 rounded-lg py-1.5 font-medium transition ${
                  currentUser.role === 'citizen' && !isAdminSection
                    ? 'bg-white font-semibold text-[#176B4D] shadow-sm'
                    : 'text-[#66736B] hover:text-[#103D30]'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => handleRoleSwitch('admin')}
                className={`flex-1 rounded-lg py-1.5 font-medium transition ${
                  currentUser.role === 'admin' || isAdminSection
                    ? 'bg-[#176B4D] font-semibold text-white shadow-sm'
                    : 'text-[#66736B] hover:text-[#103D30]'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Navigation links */}
            <div className="mt-6">
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8E9B92]">
                {isAdminSection ? 'Administration' : 'Citizen Workspace'}
              </p>
              <nav className="mt-2.5 flex flex-col gap-1">
                {(isAdminSection ? adminNavItems : citizenNavItems).map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-[#E5F1DF] font-semibold text-[#176B4D]'
                          : 'text-[#5A6860] hover:bg-[#F2F6EE] hover:text-[#103D30]'
                      }`}
                    >
                      <Icon
                        size={17}
                        className={`transition ${isActive ? 'text-[#176B4D]' : 'text-[#85948B] group-hover:text-[#176B4D]'}`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar Footer Card */}
          <div className="mt-6">
            {!isAdminSection ? (
              <div className="rounded-2xl bg-[#103D30] p-4 text-white shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B8E986]">
                  <Sparkles size={14} /> Next Action
                </div>
                <p className="mt-2 text-sm font-semibold">Log this month&apos;s bill</p>
                <p className="mt-1 text-xs text-white/70 leading-relaxed">
                  Earn +50 points and refresh your CEA emission calculation.
                </p>
                <Link
                  href="/energy"
                  className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#B8E986] hover:underline"
                >
                  Add reading <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#D7E2D3] bg-white p-3.5 text-xs text-[#66736B]">
                <p className="font-semibold text-[#103D30]">Gujarat LiFE Directorate</p>
                <p className="mt-0.5">Logged in as {currentUser.name}</p>
                <Link href="/dashboard" className="mt-2 block font-medium text-[#176B4D] hover:underline">
                  ← Return to citizen view
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 flex w-72 max-w-[85%] flex-col justify-between bg-white p-5 shadow-2xl">
              <div>
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2 font-bold text-[#103D30]">
                    <span className="grid size-8 place-items-center rounded-lg bg-[#B8E986] text-[#176B4D]">
                      <Leaf size={18} fill="currentColor" />
                    </span>
                    <span>LiFE Gujarat</span>
                  </Link>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-xl bg-[#EEF4E8] p-1 text-xs">
                  <button
                    onClick={() => {
                      handleRoleSwitch('citizen')
                      setMobileMenuOpen(false)
                    }}
                    className={`flex-1 rounded-lg py-1.5 font-medium ${
                      currentUser.role === 'citizen' && !isAdminSection ? 'bg-white font-semibold text-[#176B4D]' : ''
                    }`}
                  >
                    Citizen
                  </button>
                  <button
                    onClick={() => {
                      handleRoleSwitch('admin')
                      setMobileMenuOpen(false)
                    }}
                    className={`flex-1 rounded-lg py-1.5 font-medium ${
                      currentUser.role === 'admin' || isAdminSection ? 'bg-[#176B4D] font-semibold text-white' : ''
                    }`}
                  >
                    Admin
                  </button>
                </div>

                <nav className="mt-5 flex max-h-[60vh] flex-col gap-1 overflow-y-auto">
                  {(isAdminSection ? adminNavItems : citizenNavItems).map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                          isActive
                            ? 'bg-[#E5F1DF] font-semibold text-[#176B4D]'
                            : 'text-[#66736B] hover:bg-[#F2F6EE]'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              <div className="border-t border-[#E3E8DF] pt-4 space-y-2">
                <button
                  onClick={toggleLanguage}
                  className="flex w-full items-center justify-between rounded-xl border border-[#D7E2D3] px-3 py-2 text-xs font-semibold text-[#103D30]"
                >
                  <span>Language</span>
                  <span className="rounded bg-[#E5F1DF] px-2 py-0.5 text-[#176B4D]">
                    {lang === 'en' ? 'English (EN)' : 'ગુજરાતી (GU)'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl border border-[#FADBD8] bg-[#FDEDEC] px-3 py-2 text-xs font-bold text-[#C0392B] cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Bar Header */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E3E8DF] bg-white/95 px-6 backdrop-blur lg:px-10 print:hidden">
            <div>
              <div className="hidden items-center gap-2 text-xs text-[#8E9B92] sm:flex">
                <span>Gujarat</span>
                <ChevronRight size={12} />
                <span className="capitalize">{currentUser.district}</span>
                <ChevronRight size={12} />
                <span className="font-medium text-[#176B4D]">{title || activeNav || 'Workspace'}</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-[#103D30] sm:text-xl">
                {title || activeNav || 'Overview'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                title="Switch between English and Gujarati"
                className="hidden rounded-full border border-[#D7E2D3] bg-[#FBFCF8] px-3 py-1.5 text-xs font-semibold text-[#103D30] transition hover:bg-[#EEF4E8] sm:flex items-center gap-1.5"
              >
                <span className={lang === 'en' ? 'text-[#176B4D]' : 'text-[#8E9B92]'}>EN</span>
                <span className="text-[#CAD5CB]">/</span>
                <span className={lang === 'gu' ? 'text-[#176B4D]' : 'text-[#8E9B92]'}>ગુજરાતી</span>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative grid size-9 place-items-center rounded-full border border-[#E3E8DF] bg-white text-[#103D30] transition hover:bg-[#F6F8F3]"
                  aria-label="View notifications"
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#176B4D] text-[10px] font-bold text-white shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#D7E2D3] bg-white p-4 shadow-xl sm:w-96">
                    <div className="flex items-center justify-between border-b border-[#E3E8DF] pb-3">
                      <div>
                        <h4 className="font-bold text-[#103D30]">Notifications</h4>
                        <p className="text-xs text-[#66736B]">{unreadCount} unread alert{unreadCount === 1 ? '' : 's'}</p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs font-semibold text-[#176B4D] hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="mt-3 max-h-72 space-y-2.5 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="py-6 text-center text-xs text-[#8E9B92]">No notifications yet.</p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            className={`rounded-xl p-3 text-xs transition ${
                              n.isRead ? 'bg-[#F6F8F3] text-[#66736B]' : 'bg-[#EBF4E5] text-[#103D30]'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="font-semibold text-[#176B4D]">{n.title}</span>
                              <span className="text-[10px] text-[#8E9B92]">
                                {new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p className="mt-1 leading-relaxed">{n.message}</p>
                            {n.link && (
                              <Link
                                href={n.link}
                                onClick={() => setNotifDropdownOpen(false)}
                                className="mt-2 inline-flex items-center gap-1 font-semibold text-[#176B4D] hover:underline"
                              >
                                View detail <ArrowRight size={10} />
                              </Link>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-3 border-t border-[#E3E8DF] pt-2 text-center">
                      <Link
                        href="/notifications"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-xs font-semibold text-[#176B4D] hover:underline"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar & Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-[#D7E2D3] bg-[#FBFCF8] p-1 pr-3 text-left transition hover:bg-[#EEF4E8]"
                >
                  <div className="grid size-8 place-items-center rounded-full bg-[#176B4D] text-xs font-bold text-white shadow-sm">
                    {currentUser.avatarInitials}
                  </div>
                  <div className="hidden flex-col sm:flex">
                    <span className="text-xs font-semibold leading-tight text-[#103D30]">{currentUser.name}</span>
                    <span className="text-[10px] text-[#66736B] capitalize">{currentUser.role}</span>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#D7E2D3] bg-white p-2 shadow-xl">
                    <div className="border-b border-[#E3E8DF] px-3 py-2.5">
                      <p className="text-xs font-bold text-[#103D30]">{currentUser.name}</p>
                      <p className="text-[11px] text-[#8E9B92] truncate">{currentUser.email}</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#E5F1DF] px-2.5 py-0.5 text-[10px] font-semibold text-[#176B4D]">
                        <Trophy size={10} /> {currentUser.points} LiFE Points
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => handleRoleSwitch(currentUser.role === 'admin' ? 'citizen' : 'admin')}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#103D30] hover:bg-[#F6F8F3]"
                      >
                        <UserCheck size={14} className="text-[#176B4D]" />
                        <span>Switch to {currentUser.role === 'admin' ? 'Citizen' : 'Admin'} Mode</span>
                      </button>
                      <Link
                        href="/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#103D30] hover:bg-[#F6F8F3]"
                      >
                        <Settings size={14} className="text-[#176B4D]" />
                        <span>Account Settings</span>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#C0392B] hover:bg-[#FDF2F2] cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Subtitle Banner if given */}
          {subtitle && (
            <div className="border-b border-[#E3E8DF] bg-[#FBFCF8] px-6 py-3 text-xs text-[#66736B] lg:px-10">
              {subtitle}
            </div>
          )}

          {/* Page Body */}
          <main className="flex-1 p-6 lg:p-10 print:p-0">{children}</main>
        </div>
      </div>
    </div>
  </ProtectedRoute>
)
}
