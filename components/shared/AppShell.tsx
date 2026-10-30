'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  ArrowRight,
  LogOut,
  UserCheck,
  CheckCircle2,
  Layers,
  MapPin,
  ClipboardList,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
  Check,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { UserProfile, NotificationItem } from '@/lib/types'
import { translations, Language } from '@/lib/translations'
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
  const router = useRouter()
  const { user: authUser, logout, switchRole: authSwitchRole } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserProfile>(authUser || dataStore.getUser())
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [lang, setLang] = useState<Language>('en')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const user = authUser || dataStore.getUser()
    setCurrentUser(user)
    setLang((user.language as Language) || 'en')
    setNotifications(dataStore.getNotifications())
  }, [pathname, authUser])

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const t = translations[lang] || translations.en

  const handleLanguageSelect = (selectedLang: Language) => {
    setLang(selectedLang)
    setLangDropdownOpen(false)
    const updated: UserProfile = { ...currentUser, language: selectedLang }
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const q = searchQuery.toLowerCase().trim()
    if (q.includes('solar') || q.includes('sun') || q.includes('rooftop')) {
      router.push('/solar-advisor')
    } else if (q.includes('reading') || q.includes('bill') || q.includes('energy') || q.includes('kwh')) {
      router.push('/energy')
    } else if (q.includes('mission') || q.includes('challenge')) {
      router.push('/missions')
    } else if (q.includes('coach') || q.includes('ai') || q.includes('chat')) {
      router.push('/energy-coach')
    } else if (q.includes('report') || q.includes('pdf') || q.includes('impact')) {
      router.push('/reports')
    } else if (q.includes('reward') || q.includes('point') || q.includes('voucher')) {
      router.push('/rewards')
    } else if (q.includes('community') || q.includes('society')) {
      router.push('/community')
    } else {
      router.push('/learn')
    }
    setSearchQuery('')
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
    { label: 'Command Overview', href: '/admin', icon: Layers },
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
      <div className="min-h-screen bg-[#E8EDF3] text-[#253247]">
        {/* Mobile Top Navigation */}
        <header className="flex h-16 items-center justify-between border-b border-[rgba(197,202,208,0.4)] bg-[#E8EDF3] px-4 lg:hidden print:hidden">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-[#253247]">
            <span className="grid size-9 place-items-center rounded-2xl neu-raised text-[#238B57]">
              <Leaf size={18} fill="currentColor" />
            </span>
            <div className="flex flex-col">
              <span className="text-base leading-tight font-extrabold">LiFE <span className="font-semibold text-[#238B57]">Gujarat</span></span>
              <span className="text-[9px] uppercase tracking-wider text-[#718096]">Soft UI</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative grid size-10 place-items-center rounded-2xl neu-button text-[#253247]"
              aria-label="Notifications"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#238B57] text-[10px] font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid size-10 place-items-center rounded-2xl neu-button text-[#253247]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>

        <div className="flex min-h-screen">
          {/* Desktop Neumorphic Collapsible Left Sidebar */}
          <aside
            className={`hidden lg:flex shrink-0 flex-col justify-between p-5 border-r border-[rgba(197,202,208,0.35)] bg-[#E8EDF3] transition-all duration-300 ease-in-out print:hidden ${
              sidebarCollapsed ? 'w-22' : 'w-68'
            }`}
          >
            <div>
              {/* Brand Header & Collapse Toggle */}
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className={`flex items-center gap-3 font-extrabold tracking-tight text-[#253247] ${
                    sidebarCollapsed ? 'justify-center w-full' : ''
                  }`}
                  title="LiFE Gujarat Platform"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl neu-raised text-[#238B57]">
                    <Leaf size={22} fill="currentColor" />
                  </span>
                  {!sidebarCollapsed && (
                    <div className="flex flex-col">
                      <span className="text-[17px] leading-tight font-extrabold">
                        LiFE <span className="font-semibold text-[#238B57]">Gujarat</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096]">
                        {isAdminSection ? 'State Directorate' : 'Citizen Platform'}
                      </span>
                    </div>
                  )}
                </Link>

                {!sidebarCollapsed && (
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    className="grid size-8 place-items-center rounded-xl neu-button text-[#718096] hover:text-[#253247]"
                    title="Collapse sidebar"
                    aria-label="Collapse sidebar"
                  >
                    <PanelLeftClose size={15} />
                  </button>
                )}
              </div>

              {sidebarCollapsed && (
                <div className="mt-3 flex justify-center">
                  <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="grid size-8 place-items-center rounded-xl neu-button text-[#718096] hover:text-[#253247]"
                    title="Expand sidebar"
                    aria-label="Expand sidebar"
                  >
                    <PanelLeftOpen size={15} />
                  </button>
                </div>
              )}

              {/* Citizen / Admin Role Switcher Segment */}
              {!sidebarCollapsed ? (
                <div className="mt-6 flex items-center justify-between rounded-2xl neu-inset p-1.5 text-xs">
                  <button
                    onClick={() => handleRoleSwitch('citizen')}
                    className={`flex-1 rounded-xl py-2 font-bold transition cursor-pointer ${
                      currentUser.role === 'citizen' && !isAdminSection
                        ? 'neu-raised text-[#238B57]'
                        : 'text-[#718096] hover:text-[#253247]'
                    }`}
                  >
                    Citizen
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className={`flex-1 rounded-xl py-2 font-bold transition cursor-pointer ${
                      currentUser.role === 'admin' || isAdminSection
                        ? 'neu-raised text-[#238B57]'
                        : 'text-[#718096] hover:text-[#253247]'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => handleRoleSwitch(isAdminSection ? 'citizen' : 'admin')}
                    className="grid size-9 place-items-center rounded-xl neu-inset text-xs font-bold text-[#238B57]"
                    title={`Switch to ${isAdminSection ? 'Citizen' : 'Admin'} mode`}
                  >
                    {isAdminSection ? 'ADM' : 'CIT'}
                  </button>
                </div>
              )}

              {/* Navigation Section */}
              <div className="mt-6">
                {!sidebarCollapsed && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#718096]">
                    {isAdminSection ? 'Administration' : 'Citizen Workspace'}
                  </p>
                )}
                <nav className="mt-2.5 flex flex-col gap-1.5">
                  {(isAdminSection ? adminNavItems : citizenNavItems).map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={sidebarCollapsed ? item.label : undefined}
                        className={`group relative flex items-center rounded-2xl py-2.5 transition cursor-pointer ${
                          sidebarCollapsed ? 'justify-center px-0' : 'px-3.5 gap-3'
                        } ${
                          isActive
                            ? 'neu-inset font-bold text-[#238B57]'
                            : 'text-[#718096] hover:neu-raised-sm hover:text-[#253247]'
                        }`}
                      >
                        {/* Green accent indicator on active item */}
                        {isActive && (
                          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-[#238B57]" />
                        )}
                        <Icon
                          size={18}
                          className={`shrink-0 transition ${
                            isActive ? 'text-[#238B57]' : 'text-[#718096] group-hover:text-[#238B57]'
                          }`}
                        />
                        {!sidebarCollapsed && (
                          <span className="text-sm truncate">{item.label}</span>
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Sidebar Footer Card */}
            <div className="mt-6">
              {!sidebarCollapsed ? (
                !isAdminSection ? (
                  <div className="rounded-3xl neu-raised p-4 transition">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#238B57]">
                      <Sparkles size={14} /> Quick LiFE Mission
                    </div>
                    <p className="mt-2 text-sm font-bold text-[#253247]">Log this month&apos;s bill</p>
                    <p className="mt-1 text-xs text-[#718096] leading-relaxed">
                      Earn +50 points &amp; refresh your carbon footprint.
                    </p>
                    <Link
                      href="/energy"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#238B57] hover:underline"
                    >
                      Add reading <ArrowRight size={13} />
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-3xl neu-inset-sm p-4 text-xs text-[#718096]">
                    <p className="font-bold text-[#253247]">Gujarat LiFE Directorate</p>
                    <p className="mt-0.5">Admin: {currentUser.name}</p>
                    <Link href="/dashboard" className="mt-2 block font-bold text-[#238B57] hover:underline">
                      ← Return to citizen view
                    </Link>
                  </div>
                )
              ) : (
                <div className="flex justify-center">
                  <Link
                    href={isAdminSection ? '/dashboard' : '/energy'}
                    className="grid size-10 place-items-center rounded-2xl neu-button text-[#238B57]"
                    title={isAdminSection ? 'Return to Citizen View' : 'Add Reading'}
                  >
                    <Sparkles size={18} />
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="fixed inset-0 bg-[#253247]/30 backdrop-blur-sm transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="relative z-10 flex w-76 max-w-[85%] flex-col justify-between bg-[#E8EDF3] p-5 shadow-2xl neu-raised border-r border-white/60">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[rgba(197,202,208,0.35)]">
                    <Link href="/" className="flex items-center gap-2.5 font-extrabold text-[#253247]">
                      <span className="grid size-9 place-items-center rounded-2xl neu-raised text-[#238B57]">
                        <Leaf size={18} fill="currentColor" />
                      </span>
                      <span>LiFE Gujarat</span>
                    </Link>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="grid size-9 place-items-center rounded-2xl neu-button text-[#718096]"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Mode switcher mobile */}
                  <div className="mt-5 flex items-center justify-between rounded-2xl neu-inset p-1 text-xs">
                    <button
                      onClick={() => {
                        handleRoleSwitch('citizen')
                        setMobileMenuOpen(false)
                      }}
                      className={`flex-1 rounded-xl py-2 font-bold cursor-pointer ${
                        currentUser.role === 'citizen' && !isAdminSection ? 'neu-raised text-[#238B57]' : 'text-[#718096]'
                      }`}
                    >
                      Citizen
                    </button>
                    <button
                      onClick={() => {
                        handleRoleSwitch('admin')
                        setMobileMenuOpen(false)
                      }}
                      className={`flex-1 rounded-xl py-2 font-bold cursor-pointer ${
                        currentUser.role === 'admin' || isAdminSection ? 'neu-raised text-[#238B57]' : 'text-[#718096]'
                      }`}
                    >
                      Admin
                    </button>
                  </div>

                  <nav className="mt-5 flex max-h-[60vh] flex-col gap-1.5 overflow-y-auto pr-1">
                    {(isAdminSection ? adminNavItems : citizenNavItems).map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition ${
                            isActive
                              ? 'neu-inset text-[#238B57]'
                              : 'text-[#718096] hover:neu-raised-sm hover:text-[#253247]'
                          }`}
                        >
                          <Icon size={18} className={isActive ? 'text-[#238B57]' : 'text-[#718096]'} />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </nav>
                </div>

                {/* Mobile Language & Logout */}
                <div className="border-t border-[rgba(197,202,208,0.35)] pt-4 space-y-2">
                  <div className="flex items-center justify-between rounded-2xl neu-inset p-1 text-xs">
                    {(['en', 'hi', 'gu'] as Language[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => handleLanguageSelect(l)}
                        className={`flex-1 rounded-xl py-1.5 font-bold uppercase transition ${
                          lang === l ? 'neu-raised text-[#238B57]' : 'text-[#718096]'
                        }`}
                      >
                        {l === 'en' ? 'EN' : l === 'hi' ? 'HI' : 'GU'}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl neu-button px-4 py-2.5 text-xs font-bold text-[#C0392B] cursor-pointer"
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
            {/* Top Bar Header with Soft Neumorphic Elements */}
            <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[rgba(197,202,208,0.35)] bg-[#E8EDF3]/95 px-6 backdrop-blur lg:px-10 print:hidden">
              {/* Breadcrumbs & Title */}
              <div className="flex flex-col">
                <div className="hidden items-center gap-2 text-xs text-[#718096] sm:flex">
                  <span>Gujarat State</span>
                  <ChevronRight size={12} />
                  <span className="capitalize">{currentUser.district}</span>
                  <ChevronRight size={12} />
                  <span className="font-bold text-[#238B57]">{title || activeNav || 'Workspace'}</span>
                </div>
                <h1 className="text-xl font-extrabold tracking-tight text-[#253247] sm:text-2xl mt-0.5">
                  {title || activeNav || 'Overview'}
                </h1>
              </div>

              {/* Search, Language, Notifications & Profile Action Cluster */}
              <div className="flex items-center gap-3">
                {/* Global Search Field */}
                <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center">
                  <Search size={16} className="absolute left-3.5 text-[#718096] pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search missions, solar, readings..."
                    className="w-56 lg:w-72 rounded-2xl neu-input py-2 pl-10 pr-10 text-xs text-[#253247] placeholder:text-[#718096]"
                  />
                  <span className="absolute right-3 rounded-lg neu-inset-sm px-1.5 py-0.5 text-[10px] font-bold text-[#718096]">
                    ↵
                  </span>
                </form>

                {/* Language Selector: English, Hindi, Gujarati */}
                <div className="relative">
                  <button
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    title="Change language"
                    className="flex items-center gap-1.5 rounded-2xl neu-button px-3.5 py-2 text-xs font-bold text-[#253247]"
                  >
                    <Globe size={15} className="text-[#238B57]" />
                    <span className="hidden sm:inline">
                      {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'ગુજરાતી'}
                    </span>
                    <span className="sm:hidden uppercase">{lang}</span>
                  </button>

                  {langDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 rounded-2xl neu-raised p-1.5 z-40 space-y-1">
                      <button
                        onClick={() => handleLanguageSelect('en')}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                          lang === 'en' ? 'neu-inset text-[#238B57]' : 'text-[#253247] hover:neu-raised-sm'
                        }`}
                      >
                        <span>English (EN)</span>
                        {lang === 'en' && <Check size={14} className="text-[#238B57]" />}
                      </button>
                      <button
                        onClick={() => handleLanguageSelect('hi')}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                          lang === 'hi' ? 'neu-inset text-[#238B57]' : 'text-[#253247] hover:neu-raised-sm'
                        }`}
                      >
                        <span>हिंदी (HI)</span>
                        {lang === 'hi' && <Check size={14} className="text-[#238B57]" />}
                      </button>
                      <button
                        onClick={() => handleLanguageSelect('gu')}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                          lang === 'gu' ? 'neu-inset text-[#238B57]' : 'text-[#253247] hover:neu-raised-sm'
                        }`}
                      >
                        <span>ગુજરાતી (GU)</span>
                        {lang === 'gu' && <Check size={14} className="text-[#238B57]" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="relative grid size-10 place-items-center rounded-2xl neu-button text-[#253247]"
                    aria-label="View notifications"
                  >
                    <Bell size={17} />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#238B57] text-[10px] font-bold text-white shadow-sm">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Neumorphic Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl neu-raised p-5 z-40">
                      <div className="flex items-center justify-between border-b border-[rgba(197,202,208,0.35)] pb-3">
                        <div>
                          <h4 className="font-extrabold text-[#253247]">Notifications</h4>
                          <p className="text-xs text-[#718096]">
                            {unreadCount} unread alert{unreadCount === 1 ? '' : 's'}
                          </p>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs font-bold text-[#238B57] hover:underline cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="mt-3 max-h-72 space-y-2.5 overflow-y-auto pr-1">
                        {notifications.length === 0 ? (
                          <p className="py-6 text-center text-xs text-[#718096]">No notifications yet.</p>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div
                              key={n.id}
                              className={`rounded-2xl p-3 text-xs transition ${
                                n.isRead ? 'neu-flat text-[#718096]' : 'neu-inset text-[#253247]'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <span className="font-bold text-[#238B57]">{n.title}</span>
                                <span className="text-[10px] text-[#718096]">
                                  {new Date(n.createdAt).toLocaleDateString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                              <p className="mt-1 leading-relaxed text-[#253247]">{n.message}</p>
                              {n.link && (
                                <Link
                                  href={n.link}
                                  onClick={() => setNotifDropdownOpen(false)}
                                  className="mt-2 inline-flex items-center gap-1 font-bold text-[#238B57] hover:underline"
                                >
                                  View detail <ArrowRight size={11} />
                                </Link>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      <div className="mt-3 border-t border-[rgba(197,202,208,0.35)] pt-2.5 text-center">
                        <Link
                          href="/notifications"
                          onClick={() => setNotifDropdownOpen(false)}
                          className="text-xs font-bold text-[#238B57] hover:underline"
                        >
                          View all notifications →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 rounded-2xl neu-button p-1.5 pr-3 text-left"
                  >
                    <div className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-[#238B57] to-[#1b6c43] text-xs font-extrabold text-white shadow-sm">
                      {currentUser.avatarInitials}
                    </div>
                    <div className="hidden flex-col sm:flex">
                      <span className="text-xs font-extrabold leading-tight text-[#253247]">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] text-[#718096] capitalize font-semibold">
                        {currentUser.role}
                      </span>
                    </div>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-3xl neu-raised p-3 z-40">
                      <div className="border-b border-[rgba(197,202,208,0.35)] px-3 py-2.5">
                        <p className="text-sm font-extrabold text-[#253247]">{currentUser.name}</p>
                        <p className="text-xs text-[#718096] truncate">{currentUser.email}</p>
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-xl neu-inset-sm px-2.5 py-1 text-xs font-bold text-[#238B57]">
                          <Trophy size={12} /> {currentUser.points} LiFE Points
                        </div>
                      </div>
                      <div className="py-1.5 space-y-1">
                        <button
                          onClick={() => handleRoleSwitch(currentUser.role === 'admin' ? 'citizen' : 'admin')}
                          className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-bold text-[#253247] hover:neu-raised-sm cursor-pointer"
                        >
                          <UserCheck size={15} className="text-[#238B57]" />
                          <span>Switch to {currentUser.role === 'admin' ? 'Citizen' : 'Admin'} Mode</span>
                        </button>
                        <Link
                          href="/settings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-bold text-[#253247] hover:neu-raised-sm"
                        >
                          <Settings size={15} className="text-[#238B57]" />
                          <span>Account Settings</span>
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-bold text-[#C0392B] hover:neu-inset-sm cursor-pointer"
                        >
                          <LogOut size={15} />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Optional Subtitle Banner */}
            {subtitle && (
              <div className="border-b border-[rgba(197,202,208,0.3)] bg-[#E8EDF3] px-6 py-2.5 text-xs font-semibold text-[#718096] lg:px-10">
                {subtitle}
              </div>
            )}

            {/* Main Page Body */}
            <main className="flex-1 p-6 lg:p-10 print:p-0">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
