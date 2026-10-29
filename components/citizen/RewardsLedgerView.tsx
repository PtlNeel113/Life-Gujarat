'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Trophy,
  Flame,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  Gift,
  Clock,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { UserProfile, RewardItem, Badge, PointsLedgerEntry } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { MetricCard } from '@/components/shared/MetricCard'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function RewardsLedgerView() {
  const [user, setUser] = useState<UserProfile>(dataStore.getUser())
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [ledger, setLedger] = useState<PointsLedgerEntry[]>([])
  const [activeTab, setActiveTab] = useState<'rewards' | 'badges' | 'ledger'>('rewards')

  useEffect(() => {
    setUser(dataStore.getUser())
    setRewards(dataStore.getRewards())
    setBadges(dataStore.getBadges())
    setLedger(dataStore.getPointsLedger())
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Rewards & LiFE Points Ledger"
        description="Earn verified sustainability points by logging power readings and completing missions. Redeem points for Discom rebates and official certified recognition."
      />

      {/* Top Points Summary Banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-[#103D30] p-6 text-white shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#B8E986]">Current Balance</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold">{user.points}</span>
              <span className="text-sm font-semibold text-white/70">LiFE Points</span>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-white/60">
            Backed by persistent immutable transaction ledger.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#8E9B92]">Active Streak</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#F39C12]">{user.streakDays}</span>
              <span className="text-sm font-semibold text-[#66736B]">Days Continuous</span>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-[#8E9B92]">
            Keep the habit going. 7-day milestone awards +100 bonus pts.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#8E9B92]">Unlocked Badges</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#176B4D]">
                {badges.filter((b) => b.isUnlocked).length} / {badges.length}
              </span>
              <span className="text-sm font-semibold text-[#66736B]">Honours</span>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-[#8E9B92]">
            State Climate Change Dept certification tier.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E3E8DF] text-xs font-bold">
        <button
          onClick={() => setActiveTab('rewards')}
          className={`py-3 px-5 border-b-2 transition ${
            activeTab === 'rewards'
              ? 'border-[#176B4D] text-[#176B4D]'
              : 'border-transparent text-[#66736B] hover:text-[#103D30]'
          }`}
        >
          Available Rewards Catalogue
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`py-3 px-5 border-b-2 transition ${
            activeTab === 'badges'
              ? 'border-[#176B4D] text-[#176B4D]'
              : 'border-transparent text-[#66736B] hover:text-[#103D30]'
          }`}
        >
          Achievement Badges
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`py-3 px-5 border-b-2 transition ${
            activeTab === 'ledger'
              ? 'border-[#176B4D] text-[#176B4D]'
              : 'border-transparent text-[#66736B] hover:text-[#103D30]'
          }`}
        >
          Points Transaction History
        </button>
      </div>

      {/* Tab 1: Rewards Catalogue */}
      {activeTab === 'rewards' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rewards.map((r) => {
            const canAfford = user.points >= r.costPoints

            return (
              <div
                key={r.id}
                className="flex flex-col justify-between rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-xs hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B4D]">
                      {r.category}
                    </span>
                    <span className="font-extrabold text-[#176B4D] text-sm">
                      {r.costPoints} pts
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-[#103D30] leading-snug">{r.title}</h3>
                  <p className="mt-2 text-xs text-[#66736B] leading-relaxed">{r.description}</p>

                  <div className="mt-4 rounded-xl bg-[#F6F8F3] p-2.5 text-[11px] text-[#66736B]">
                    <span className="block font-semibold text-[#103D30]">Partner:</span>
                    {r.partner}
                  </div>
                </div>

                <div className="mt-6 border-t border-[#F0F3EC] pt-4">
                  <button
                    disabled={!canAfford}
                    className={`w-full rounded-xl py-2.5 text-xs font-bold transition ${
                      canAfford
                        ? 'bg-[#176B4D] text-white hover:bg-[#103D30]'
                        : 'bg-[#F0F2EB] text-[#8E9B92] cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Redeem Voucher' : `Need ${r.costPoints - user.points} more pts`}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tab 2: Achievement Badges */}
      {activeTab === 'badges' && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`flex items-start gap-4 rounded-3xl border p-5 transition ${
                b.isUnlocked
                  ? 'border-[#CBE3C3] bg-[#F7FAF4]'
                  : 'border-[#E3E8DF] bg-white opacity-60'
              }`}
            >
              <div
                className={`grid size-12 shrink-0 place-items-center rounded-2xl ${
                  b.isUnlocked ? 'bg-[#176B4D] text-white shadow-sm' : 'bg-[#F0F2EB] text-[#8E9B92]'
                }`}
              >
                {b.isUnlocked ? <Award size={22} /> : <Lock size={20} />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#103D30]">{b.title}</h4>
                  {b.isUnlocked && <StatusBadge label="Unlocked" variant="success" />}
                </div>
                <p className="mt-1 text-xs text-[#66736B] leading-relaxed">{b.description}</p>
                {b.isUnlocked && b.unlockedAt && (
                  <p className="mt-2 text-[10px] text-[#8E9B92]">
                    Unlocked on {new Date(b.unlockedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Transaction History Ledger */}
      {activeTab === 'ledger' && (
        <div className="rounded-3xl border border-[#E3E8DF] bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFCF8] border-b border-[#E3E8DF] text-[11px] font-bold uppercase tracking-wider text-[#8E9B92]">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Event Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-right">Points Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F3EC]">
              {ledger.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#F9FAF6]">
                  <td className="py-3.5 px-4 font-semibold text-[#103D30]">{entry.date}</td>
                  <td className="py-3.5 px-4 font-medium text-[#18241F]">{entry.source}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge
                      label={entry.type}
                      variant={entry.type === 'earned' ? 'success' : entry.type === 'bonus' ? 'warning' : 'neutral'}
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-[#176B4D]">
                    +{entry.points} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
