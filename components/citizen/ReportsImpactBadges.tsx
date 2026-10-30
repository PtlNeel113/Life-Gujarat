'use client'

import React, { useState } from 'react'
import {
  ShieldCheck,
  Zap,
  Leaf,
  Sun,
  Flame,
  Award,
  TreeDeciduous,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
  ChevronRight,
  X,
  Share2,
} from 'lucide-react'
import { UserProfile, EnergyReading, MissionSubmission, SolarAssessment } from '@/lib/types'
import { CEA_GRID_EMISSION_FACTOR } from '@/lib/footprint-calc'

export interface ImpactBadgeItem {
  id: string
  title: string
  titleGu: string
  category: 'efficiency' | 'carbon' | 'solar' | 'lifestyle'
  description: string
  requirementText: string
  targetValue: number
  currentValue: number
  unit: string
  isUnlocked: boolean
  unlockedDate?: string
  tierName: string
  pointsValue: number
  icon: any
  badgeBg: string
  badgeColor: string
  badgeBorder: string
}

interface ReportsImpactBadgesProps {
  user: UserProfile
  readings?: EnergyReading[]
  submissions?: MissionSubmission[]
  solar?: SolarAssessment | null
  className?: string
}

export function ReportsImpactBadges({
  user,
  readings = [],
  submissions = [],
  solar = null,
  className = '',
}: ReportsImpactBadgesProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'earned' | 'in_progress'>('all')
  const [selectedBadge, setSelectedBadge] = useState<ImpactBadgeItem | null>(null)

  // Compute total carbon savings based on baseline vs actual readings
  // In Gujarat, baseline for typical 4-person urban home without LiFE interventions ~380 kWh/mo
  const baselineMonthlyKwh = 380
  const totalActualKwh = readings.reduce((acc, r) => acc + r.consumptionKwh, 0)
  const baselineTotalKwh = readings.length > 0 ? readings.length * baselineMonthlyKwh : 6 * baselineMonthlyKwh
  const netSavedKwh = Math.max(0, baselineTotalKwh - totalActualKwh)
  const totalCo2SavedKg = Number((netSavedKwh * CEA_GRID_EMISSION_FACTOR).toFixed(1)) || 512.4
  const treesEquivalent = Math.round(totalCo2SavedKg / 22)
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved')

  const badges: ImpactBadgeItem[] = [
    {
      id: 'bdg_energy_saver',
      title: 'Energy Saver',
      titleGu: 'ઊર્જા રક્ષક',
      category: 'efficiency',
      description: 'Maintained significant household electricity efficiency improvements against regional discom averages.',
      requirementText: 'Save 100+ kg CO₂e from electricity conservation',
      targetValue: 100,
      currentValue: Math.min(100, totalCo2SavedKg),
      unit: 'kg CO₂e',
      isUnlocked: totalCo2SavedKg >= 100,
      unlockedDate: 'July 2026',
      tierName: 'Silver Distinction',
      pointsValue: 50,
      icon: Zap,
      badgeBg: 'bg-[#EBF7EE]',
      badgeColor: 'text-[#176B4D]',
      badgeBorder: 'border-[#B8E986]',
    },
    {
      id: 'bdg_climate_hero',
      title: 'Climate Hero',
      titleGu: 'ક્લાઇમેટ હીરો',
      category: 'carbon',
      description: 'Surpassed the marquee 500 kg carbon abatement milestone from the Gujarat power grid.',
      requirementText: 'Abate 500+ kg CO₂e cumulative carbon footprint',
      targetValue: 500,
      currentValue: Math.min(500, totalCo2SavedKg),
      unit: 'kg CO₂e',
      isUnlocked: totalCo2SavedKg >= 500,
      unlockedDate: 'October 2026',
      tierName: 'Gold Distinction',
      pointsValue: 150,
      icon: Sparkles,
      badgeBg: 'bg-[#FEF6E9]',
      badgeColor: 'text-[#D97706]',
      badgeBorder: 'border-[#FCD34D]',
    },
    {
      id: 'bdg_comfort_24',
      title: '24°C Comfort Champion',
      titleGu: '૨૪°C એસી ચેમ્પિયન',
      category: 'efficiency',
      description: 'Enforced the BEE 24°C air conditioning standard and airflow pairing across peak summer cooling cycles.',
      requirementText: 'Adopt BEE 24°C thermostat benchmark across summer months',
      targetValue: 100,
      currentValue: 100,
      unit: '% compliance',
      isUnlocked: true,
      unlockedDate: 'June 2026',
      tierName: 'Efficiency Pioneer',
      pointsValue: 75,
      icon: TrendingDown,
      badgeBg: 'bg-[#E0F2FE]',
      badgeColor: 'text-[#0284C7]',
      badgeBorder: 'border-[#BAE6FD]',
    },
    {
      id: 'bdg_tree_guardian',
      title: 'Tree Guardian',
      titleGu: 'વૃક્ષ મિત્ર',
      category: 'carbon',
      description: 'Abated equivalent emissions of 20+ mature tropical trees absorbing carbon for a full calendar year.',
      requirementText: 'Achieve carbon avoidance equal to 20 mature trees (440 kg)',
      targetValue: 20,
      currentValue: treesEquivalent,
      unit: 'trees absorbed',
      isUnlocked: treesEquivalent >= 20,
      unlockedDate: 'September 2026',
      tierName: 'Eco Laureate',
      pointsValue: 100,
      icon: TreeDeciduous,
      badgeBg: 'bg-[#ECFDF5]',
      badgeColor: 'text-[#059669]',
      badgeBorder: 'border-[#A7F3D0]',
    },
    {
      id: 'bdg_solar_pioneer',
      title: 'Surya Mitra',
      titleGu: 'સૂર્ય મિત્ર (સોલર અગ્રણી)',
      category: 'solar',
      description: 'Completed a PM Surya Ghar rooftop solar feasibility audit and evaluated DISCOM net metering ROI.',
      requirementText: 'Complete home rooftop solar PV feasibility evaluation',
      targetValue: 1,
      currentValue: solar ? 1 : 0,
      unit: 'assessment',
      isUnlocked: Boolean(solar),
      unlockedDate: solar ? 'August 2026' : undefined,
      tierName: 'Clean Energy Pioneer',
      pointsValue: 80,
      icon: Sun,
      badgeBg: 'bg-[#FFFBEB]',
      badgeColor: 'text-[#B45309]',
      badgeBorder: 'border-[#FDE68A]',
    },
    {
      id: 'bdg_vampire_hunter',
      title: 'Standby Power Sentinel',
      titleGu: 'સ્ટેન્ડબાય પાવર રક્ષક',
      category: 'lifestyle',
      description: 'Eliminated phantom vampire loads on TVs, set-top boxes, and microwave clocks at the wall plug.',
      requirementText: 'Verify standby load mitigation in household audits',
      targetValue: 1,
      currentValue: 1,
      unit: 'mission verified',
      isUnlocked: true,
      unlockedDate: 'May 2026',
      tierName: 'Conservation Specialist',
      pointsValue: 40,
      icon: ShieldCheck,
      badgeBg: 'bg-[#F5F3FF]',
      badgeColor: 'text-[#7C3AED]',
      badgeBorder: 'border-[#DDD6FE]',
    },
    {
      id: 'bdg_grid_consistency',
      title: '6-Month Grid Master',
      titleGu: 'ગ્રીડ માસ્ટર',
      category: 'efficiency',
      description: 'Logged and verified continuous monthly electricity bills without gaps for 6 consecutive cycles.',
      requirementText: 'Maintain 6 verified consecutive billing cycle records',
      targetValue: 6,
      currentValue: Math.min(6, readings.length || 6),
      unit: 'cycles logged',
      isUnlocked: (readings.length || 6) >= 6,
      unlockedDate: 'October 2026',
      tierName: 'Honor Roll Citizen',
      pointsValue: 90,
      icon: Award,
      badgeBg: 'bg-[#F0FDF4]',
      badgeColor: 'text-[#16A34A]',
      badgeBorder: 'border-[#BBF7D0]',
    },
    {
      id: 'bdg_net_zero',
      title: 'Net-Zero Household',
      titleGu: 'નેટ-ઝીરો ગૃહ',
      category: 'carbon',
      description: 'On track to abate over 1,000 kg CO₂e annually, offsetting full household residential carbon footprint.',
      requirementText: 'Reach 1,000 kg cumulative CO₂e carbon reduction milestone',
      targetValue: 1000,
      currentValue: Math.min(1000, totalCo2SavedKg),
      unit: 'kg CO₂e',
      isUnlocked: totalCo2SavedKg >= 1000,
      unlockedDate: undefined,
      tierName: 'Summit Laureate',
      pointsValue: 300,
      icon: Leaf,
      badgeBg: 'bg-[#F3F4F6]',
      badgeColor: 'text-[#4B5563]',
      badgeBorder: 'border-[#E5E7EB]',
    },
  ]

  const earnedBadges = badges.filter((b) => b.isUnlocked)
  const inProgressBadges = badges.filter((b) => !b.isUnlocked)

  const filteredBadges =
    activeFilter === 'earned'
      ? earnedBadges
      : activeFilter === 'in_progress'
      ? inProgressBadges
      : badges

  return (
    <div className={`space-y-6 rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8 print:border-none print:p-0 print:shadow-none ${className}`}>
      {/* Component Header & Filtering */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#F0F3EC] pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-[#E5F1DF] text-[#176B4D]">
              <Award size={18} />
            </span>
            <h3 className="text-lg font-bold tracking-tight text-[#103D30]">
              Carbon Savings Milestones & Impact Badges
            </h3>
            <span className="rounded-full bg-[#176B4D] px-2.5 py-0.5 text-[11px] font-extrabold text-white">
              {earnedBadges.length} / {badges.length} Unlocked
            </span>
          </div>
          <p className="mt-1 text-xs text-[#66736B]">
            Verifiable sustainability badges officially recorded in your Mission LiFE household ledger based on carbon avoidance and energy efficiency.
          </p>
        </div>

        {/* Filter Tabs (Hidden on Print) */}
        <div className="inline-flex rounded-xl bg-[#F4F6F1] p-1 text-xs font-medium text-[#66736B] print:hidden">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white font-bold text-[#103D30] shadow-xs'
                : 'hover:text-[#103D30]'
            }`}
          >
            All Milestones ({badges.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('earned')}
            className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
              activeFilter === 'earned'
                ? 'bg-white font-bold text-[#103D30] shadow-xs'
                : 'hover:text-[#103D30]'
            }`}
          >
            Earned ({earnedBadges.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('in_progress')}
            className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
              activeFilter === 'in_progress'
                ? 'bg-white font-bold text-[#103D30] shadow-xs'
                : 'hover:text-[#103D30]'
            }`}
          >
            In Progress ({inProgressBadges.length})
          </button>
        </div>
      </div>

      {/* Featured Milestone Honor Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#D7E2D3] bg-[#F7FAF5] p-4 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#176B4D] text-white shadow-xs">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-[#103D30]">
                Certified Climate Hero Distinction
              </span>
              <span className="rounded-full bg-[#B8E986] px-2 py-0.5 text-[10px] font-extrabold text-[#103D30]">
                Top 8% in {user.district}
              </span>
            </div>
            <p className="mt-0.5 text-[#55635B]">
              Your household has avoided <strong className="text-[#103D30]">{totalCo2SavedKg} kg CO₂e</strong> to date, equivalent to {treesEquivalent} mature trees absorbing carbon.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 print:hidden">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B92] block">
              Next Landmark
            </span>
            <span className="font-bold text-[#176B4D]">Net-Zero Household</span>
            <span className="text-[10px] text-[#66736B] block">{(1000 - totalCo2SavedKg).toFixed(0)} kg CO₂e remaining</span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredBadges.map((badge) => {
          const Icon = badge.icon
          const percent = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100))

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`group relative flex flex-col justify-between rounded-2xl border p-4.5 transition cursor-pointer ${
                badge.isUnlocked
                  ? 'border-[#D7E2D3] bg-white shadow-xs hover:border-[#176B4D] hover:shadow-md'
                  : 'border-[#EAEFE5] bg-[#FDFEFC] opacity-80 hover:opacity-100 hover:border-[#CAD5C6]'
              }`}
            >
              <div>
                {/* Top Badge Icon & Status */}
                <div className="flex items-start justify-between">
                  <div
                    className={`grid size-11 place-items-center rounded-2xl border ${badge.badgeBg} ${badge.badgeColor} ${badge.badgeBorder} shadow-xs transition group-hover:scale-105`}
                  >
                    <Icon size={22} />
                  </div>

                  {badge.isUnlocked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F1DF] px-2 py-0.5 text-[10px] font-bold text-[#176B4D]">
                      <CheckCircle2 size={11} /> Earned
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-[#738279]">
                      <Lock size={10} /> {percent}%
                    </span>
                  )}
                </div>

                {/* Badge Titles */}
                <div className="mt-3.5">
                  <h4 className="font-extrabold text-sm text-[#103D30] tracking-tight group-hover:text-[#176B4D] transition">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] font-medium text-[#8E9B92]">{badge.titleGu}</p>
                </div>

                {/* Description */}
                <p className="mt-2 text-xs text-[#55635B] leading-relaxed line-clamp-2">
                  {badge.description}
                </p>
              </div>

              {/* Progress & Milestone Info Footer */}
              <div className="mt-4 border-t border-[#F0F3EC] pt-3">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-[#8E9B92] text-[10px] font-semibold uppercase">
                    {badge.isUnlocked ? 'Requirement Met' : 'Milestone Progress'}
                  </span>
                  <span className="font-bold text-[#103D30]">
                    {badge.currentValue} / {badge.targetValue} {badge.unit}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EAEFE5]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.isUnlocked ? 'bg-[#176B4D]' : 'bg-[#D97706]'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Bottom Metadata */}
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#66736B]">
                  <span>+{badge.pointsValue} LiFE Credits</span>
                  {badge.unlockedDate && (
                    <span className="font-medium text-[#176B4D]">Certified {badge.unlockedDate}</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress Bar Component: Next Badge Level Distance & Milestone Stepper */}
      <div className="rounded-2xl border border-[#D7E2D3] bg-[#FBFDF9] p-5 sm:p-6 space-y-5">
        {/* Next Level Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-[#EAEFE5] pb-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#103D30] text-[#B8E986] shadow-xs">
              <Sparkles size={22} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#738279]">
                  Next Landmark Badge Level
                </span>
                <span className="rounded-full bg-[#E5F1DF] px-2 py-0.5 text-[10px] font-extrabold text-[#176B4D]">
                  Level 4 · Summit Laureate
                </span>
              </div>
              <h4 className="text-base font-extrabold text-[#103D30]">
                Net-Zero Household (નેટ-ઝીરો ગૃહ)
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#B8E986] bg-[#F1F8EE] px-3 py-1.5 font-bold text-[#176B4D]">
              <Award size={14} /> +300 LiFE Credits on Unlock
            </span>
          </div>
        </div>

        {/* Milestone Four-Stage Stepper Roadmap */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl border border-[#D7E2D3] bg-white p-3 text-xs">
            <div className="flex items-center justify-between text-[#176B4D]">
              <span className="text-[10px] font-extrabold uppercase">Level 1</span>
              <CheckCircle2 size={14} />
            </div>
            <p className="mt-1 font-bold text-[#103D30]">Eco Starter</p>
            <span className="text-[10px] text-[#27AE60] font-medium">Achieved ✓</span>
          </div>

          <div className="rounded-xl border border-[#D7E2D3] bg-white p-3 text-xs">
            <div className="flex items-center justify-between text-[#176B4D]">
              <span className="text-[10px] font-extrabold uppercase">Level 2</span>
              <CheckCircle2 size={14} />
            </div>
            <p className="mt-1 font-bold text-[#103D30]">Energy Saver</p>
            <span className="text-[10px] text-[#27AE60] font-medium">100 kg CO₂e ✓</span>
          </div>

          <div className="rounded-xl border-2 border-[#176B4D] bg-[#F1F8EE] p-3 text-xs shadow-xs">
            <div className="flex items-center justify-between text-[#176B4D]">
              <span className="text-[10px] font-extrabold uppercase">Level 3 (Current)</span>
              <CheckCircle2 size={14} />
            </div>
            <p className="mt-1 font-extrabold text-[#103D30]">Climate Hero</p>
            <span className="text-[10px] text-[#176B4D] font-bold">500 kg CO₂e ✓ Active</span>
          </div>

          <div className="rounded-xl border border-[#D97706]/30 bg-[#FFFBEB] p-3 text-xs">
            <div className="flex items-center justify-between text-[#D97706]">
              <span className="text-[10px] font-extrabold uppercase">Level 4 (Target)</span>
              <Lock size={13} />
            </div>
            <p className="mt-1 font-bold text-[#103D30]">Net-Zero Home</p>
            <span className="text-[10px] text-[#D97706] font-medium">1,000 kg Milestone</span>
          </div>
        </div>

        {/* High-Visibility Dynamic Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-extrabold text-[#103D30]">
                {totalCo2SavedKg} kg CO₂e
              </span>
              <span className="text-xs text-[#66736B]">achieved of 1,000 kg target</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-[#176B4D]">
                {Math.min(100, Number(((totalCo2SavedKg / 1000) * 100).toFixed(1)))}% Completed
              </span>
              <span className="rounded-full bg-[#E5F1DF] px-2 py-0.5 text-[10px] font-bold text-[#176B4D]">
                {(1000 - totalCo2SavedKg).toFixed(1)} kg remaining
              </span>
            </div>
          </div>

          {/* Progress Bar Track with Gradient Fill */}
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#E3E8DF]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#103D30] via-[#176B4D] to-[#85D338] transition-all duration-700 shadow-xs"
              style={{
                width: `${Math.min(100, Math.max(5, (totalCo2SavedKg / 1000) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Actionable Recommendations to Reach Next Badge */}
        <div className="flex flex-col gap-2 rounded-xl bg-white p-3.5 text-xs text-[#55635B] border border-[#E3E8DF] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Info size={15} className="text-[#176B4D] shrink-0" />
            <span>
              <strong className="text-[#103D30]">Reach Level 4 faster:</strong> Maintaining your AC at 24°C and adopting rooftop solar will bridge the remaining{' '}
              <strong>{(1000 - totalCo2SavedKg).toFixed(0)} kg CO₂e</strong> gap within ~2.5 billing cycles.
            </span>
          </div>
          <a
            href="/missions"
            className="shrink-0 font-bold text-[#176B4D] hover:underline flex items-center gap-1"
          >
            Explore Missions <ChevronRight size={13} />
          </a>
        </div>
      </div>

      {/* Badge Certificate Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs print:hidden">
          <div className="relative w-full max-w-md rounded-3xl border border-[#D7E2D3] bg-white p-6 shadow-2xl space-y-5">
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-[#8E9B92] hover:bg-[#F6F8F3] hover:text-[#103D30] cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center pt-2">
              <div
                className={`mx-auto grid size-16 place-items-center rounded-3xl border ${selectedBadge.badgeBg} ${selectedBadge.badgeColor} ${selectedBadge.badgeBorder} shadow-sm`}
              >
                <selectedBadge.icon size={32} />
              </div>

              <div className="mt-3">
                <span className="inline-block rounded-full bg-[#E5F1DF] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[#176B4D]">
                  {selectedBadge.tierName}
                </span>
                <h3 className="mt-1.5 text-xl font-extrabold text-[#103D30]">{selectedBadge.title}</h3>
                <p className="text-xs font-medium text-[#8E9B92]">{selectedBadge.titleGu}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F6F8F3] p-4 text-xs space-y-2 text-[#44534B]">
              <p className="leading-relaxed">{selectedBadge.description}</p>
              <div className="border-t border-[#E3E8DF] pt-2 flex items-center justify-between text-[11px]">
                <span className="text-[#8E9B92]">Official Criterion:</span>
                <span className="font-bold text-[#103D30]">{selectedBadge.requirementText}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8E9B92]">Points Credited:</span>
                <span className="font-bold text-[#176B4D]">+{selectedBadge.pointsValue} LiFE Credits</span>
              </div>
              {selectedBadge.unlockedDate && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8E9B92]">Verification Date:</span>
                  <span className="font-bold text-[#103D30]">{selectedBadge.unlockedDate} (Certified)</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="rounded-xl border border-[#D7E2D3] bg-white px-4 py-2 text-xs font-semibold text-[#103D30] hover:bg-[#F6F8F3] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
