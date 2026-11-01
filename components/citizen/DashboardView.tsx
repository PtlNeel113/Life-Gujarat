'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Zap,
  Leaf,
  Flame,
  Trophy,
  Sun,
  Plus,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles,
  Users,
  ShieldCheck,
  BarChart3,
  Clock,
  Activity,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { EnergyReading, UserProfile, Mission } from '@/lib/types'
import { calculateEnergyStats } from '@/lib/energy-calc'
import { calculateCarbonFootprint } from '@/lib/footprint-calc'
import { MetricCard } from '@/components/shared/MetricCard'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function DashboardView() {
  const [user, setUser] = useState<UserProfile>(() => dataStore.getUser())
  const [readings, setReadings] = useState<EnergyReading[]>(() => dataStore.getReadings())
  const [missions, setMissions] = useState<Mission[]>(() => dataStore.getMissions())
  const [chartPeriod, setChartPeriod] = useState<'6m' | '12m'>('6m')

  useEffect(() => {
    setUser(dataStore.getUser())
    setReadings(dataStore.getReadings())
    setMissions(dataStore.getMissions())
  }, [])

  const stats = calculateEnergyStats(readings, user?.householdMembers || 4)
  const footprint = calculateCarbonFootprint(stats.latestKwh)
  const recommendedMission = missions.find((m) => m.featured) || missions[0] || {
    id: 'm_ac_24',
    title: 'Set Air Conditioner to 24°C Standard',
    description: 'Every 1°C increase in AC set-temperature saves approx 6% electricity in Gujarat’s climate.',
    category: 'Energy',
    duration: '2 min',
    points: 25,
  }
  const solarAssessments = dataStore.getSolarAssessments()
  const solarSaved = solarAssessments.length > 0 ? solarAssessments[0] : null

  // Chart data: chronological order (oldest to newest)
  const sortedChronological = [...readings].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )
  const chartItems = chartPeriod === '6m' ? sortedChronological.slice(-6) : sortedChronological.slice(-12)
  const maxKwh = Math.max(...chartItems.map((r) => r.consumptionKwh), 400)

  const userDisplayName = user?.name ? user.name.split(' ')[0] : (user?.email ? user.email.split('@')[0] : 'Citizen')
  const userDistrict = user?.district || 'Ahmedabad'
  const userDiscom = user?.discom || 'UGVCL'
  const userStreak = user?.streakDays ?? 6
  const userPoints = user?.points ?? 420

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Soft Neumorphic Raised Container */}
      <div className="flex flex-col justify-between gap-6 rounded-3xl neu-raised p-6 sm:p-8 lg:flex-row lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-2xl neu-inset px-3.5 py-1.5 text-xs font-bold text-[#238B57]">
            <Sparkles size={14} /> {userDistrict} District · {userDiscom} Connection
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#253247]">
            Welcome back, {userDisplayName}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#718096] max-w-xl leading-relaxed">
            Your household is maintaining a <span className="font-extrabold text-[#238B57]">{userStreak}-day</span> sustainability streak.
            Track your electricity consumption, complete daily actions, and explore rooftop solar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/energy"
            className="inline-flex items-center gap-2 rounded-2xl neu-button-primary px-5 py-3 text-xs font-bold"
          >
            <Plus size={16} /> Add Energy Reading
          </Link>
          <Link
            href="/missions"
            className="inline-flex items-center gap-2 rounded-2xl neu-button px-5 py-3 text-xs font-bold text-[#253247]"
          >
            Daily Missions
          </Link>
        </div>
      </div>

      {/* Top Stat Cards in Neumorphic Elevation */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Monthly Electricity"
          value={stats.latestKwh || '—'}
          unit="kWh"
          subtext={`Per-capita: ${stats.perCapitaKwh} kWh/person`}
          icon={Zap}
          trend={{
            value: stats.monthlyChangePercent,
            label: 'vs previous month',
            isPositiveGood: false,
          }}
          href="/energy"
        />

        <MetricCard
          title="Estimated Emissions"
          value={footprint.emissionsKg || '—'}
          unit="kg CO₂e"
          subtext="CEA v19.0 Factor (0.716)"
          icon={Leaf}
          iconColor="text-[#238B57]"
          iconBg="neu-inset-sm"
          href="/footprint"
        />

        <MetricCard
          title="Active Streak & Points"
          value={userPoints}
          unit="pts"
          subtext={`${userStreak} days active streak`}
          icon={Trophy}
          iconColor="text-[#d97706]"
          iconBg="neu-inset-sm"
          href="/rewards"
        />

        <MetricCard
          title="Solar Feasibility"
          value={solarSaved ? `${solarSaved.recommendedCapacityKw} kW` : 'Not assessed'}
          unit={solarSaved ? 'Capacity' : ''}
          subtext={solarSaved ? `₹${solarSaved.annualSavingsInr.toLocaleString('en-IN')}/yr estimated savings` : 'Calculate rooftop potential'}
          icon={Sun}
          iconColor="text-[#d97706]"
          iconBg="neu-inset-sm"
          href="/solar-advisor"
        />
      </div>

      {/* Energy Trend Chart & Recommended Action */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Consumption Bar Chart */}
        <div className="flex flex-col justify-between rounded-3xl neu-raised p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(197,202,208,0.35)] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-[#238B57]" />
                <h3 className="text-base font-extrabold text-[#253247]">Household Energy History</h3>
              </div>
              <p className="mt-0.5 text-xs text-[#718096]">
                Tracked over billing cycles with official Discom tariff estimates
              </p>
            </div>

            {/* Inset Segmented Timeframe Switcher */}
            <div className="flex items-center rounded-2xl neu-inset p-1 text-xs font-bold">
              <button
                onClick={() => setChartPeriod('6m')}
                className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${
                  chartPeriod === '6m' ? 'neu-raised text-[#238B57]' : 'text-[#718096] hover:text-[#253247]'
                }`}
              >
                Last 6 Months
              </button>
              <button
                onClick={() => setChartPeriod('12m')}
                className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${
                  chartPeriod === '12m' ? 'neu-raised text-[#238B57]' : 'text-[#718096] hover:text-[#253247]'
                }`}
              >
                1 Year
              </button>
            </div>
          </div>

          {/* Interactive Neumorphic Visual Bars */}
          <div className="mt-8">
            <div className="flex h-56 items-end gap-3 sm:gap-5 border-b border-[rgba(197,202,208,0.35)] px-2 pb-2">
              {chartItems.map((r, i) => {
                const heightPercent = Math.max(18, Math.min(100, Math.round((r.consumptionKwh / maxKwh) * 100)))
                const dateLabel = new Date(r.startDate).toLocaleDateString('en-IN', { month: 'short' })
                return (
                  <div key={r.id || i} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                    {/* Tooltip on hover */}
                    <div className="pointer-events-none absolute -top-12 z-20 hidden flex-col items-center rounded-xl neu-raised px-2.5 py-1.5 text-[11px] shadow-lg group-hover:flex">
                      <span className="font-extrabold text-[#253247]">{r.consumptionKwh} kWh</span>
                      <span className="text-[10px] font-bold text-[#238B57]">₹{(r.billAmount || 0).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="relative flex h-44 w-full items-end justify-center">
                      <div
                        className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-[#65B98A] to-[#238B57] shadow-sm transition-all duration-300 group-hover:from-[#238B57] group-hover:to-[#176B4D]"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="mt-2 text-[11px] font-bold text-[#718096] shrink-0">{dateLabel}</span>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-[#718096]">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#238B57]" /> Recorded Consumption (kWh)
              </span>
              <span>
                Average:{' '}
                <strong className="text-[#253247] tabular-nums">{stats.averageKwh} kWh/mo</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Recommendation Card with Neumorphism */}
        <div className="flex flex-col justify-between rounded-3xl neu-raised p-6 sm:p-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-xl neu-inset-sm px-3 py-1 text-xs font-bold text-[#238B57]">
              <Sparkles size={13} /> Recommended Mission
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-[#253247] leading-snug">{recommendedMission.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#718096]">{recommendedMission.description}</p>

            <div className="mt-5 space-y-2.5 rounded-2xl neu-inset p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-[#718096]">Category:</span>
                <span className="font-bold text-[#253247]">{recommendedMission.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Time required:</span>
                <span className="font-bold text-[#253247]">{recommendedMission.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Reward:</span>
                <span className="font-extrabold text-[#238B57]">+{recommendedMission.points} LiFE pts</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`/missions/${recommendedMission.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-2xl neu-button-primary py-3 text-xs font-bold"
            >
              Start Mission Now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Community Spotlight & Quick Navigation */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Community Progress */}
        <div className="rounded-3xl neu-raised p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-[rgba(197,202,208,0.35)] pb-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#238B57]" />
              <h3 className="text-base font-extrabold text-[#253247]">Community Action</h3>
            </div>
            <Link href="/community" className="text-xs font-bold text-[#238B57] hover:underline">
              View all →
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl neu-inset p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-[#253247]">Shantigram Green Haven RWA</h4>
                  <p className="mt-0.5 text-xs text-[#718096]">148 active households participating</p>
                </div>
                <StatusBadge label="Active" variant="success" />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-[#718096]">Challenge: LED Common Area Shift</span>
                <span className="font-extrabold text-[#238B57]">14,200 kWh saved</span>
              </div>
            </div>

            <Link
              href="/community"
              className="flex items-center justify-between rounded-2xl neu-button p-3.5 text-xs font-bold text-[#238B57]"
            >
              <span>Explore challenges in {user.district}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Solar Shortcut / Rooftop Calculator */}
        <div className="rounded-3xl neu-raised p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-[rgba(197,202,208,0.35)] pb-4">
            <div className="flex items-center gap-2">
              <Sun size={18} className="text-[#d97706]" />
              <h3 className="text-base font-extrabold text-[#253247]">PM Surya Ghar Calculator</h3>
            </div>
            <Link href="/solar-advisor" className="text-xs font-bold text-[#238B57] hover:underline">
              Open Advisor →
            </Link>
          </div>

          <div className="mt-4 text-xs text-[#718096] leading-relaxed">
            Gujarat homeowners can receive up to <strong className="text-[#253247]">₹78,000</strong> in central DBT subsidies
            under PM Surya Ghar Muft Bijli Yojana. Sized for your {stats.latestKwh} kWh monthly consumption.
          </div>

          <div className="mt-5 rounded-2xl neu-inset p-4">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#718096]">Rec. Size</p>
                <p className="mt-1 text-base font-extrabold text-[#253247]">3 kW</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#238B57]">Central Subsidy</p>
                <p className="mt-1 text-base font-extrabold text-[#238B57]">₹78,000</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#718096]">Est. Payback</p>
                <p className="mt-1 text-base font-extrabold text-[#253247]">3.2 Yrs</p>
              </div>
            </div>
          </div>

          <Link
            href="/solar-advisor"
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#238B57] hover:underline"
          >
            Run full rooftop feasibility scenario <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
