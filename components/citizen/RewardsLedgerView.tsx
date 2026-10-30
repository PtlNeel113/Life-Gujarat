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
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="neu-surface neu-raised rounded-3xl p-6 border border-[#238B57]/30 ring-1 ring-[#238B57]/20 flex flex-col justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#238B57]">Current Balance</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#253247]">{user.points}</span>
              <span className="text-xs font-bold text-[#238B57]">LiFE Points</span>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-[#718096]">
            Backed by persistent immutable transaction ledger.
          </p>
        </div>

        <div className="neu-surface neu-raised rounded-3xl p-6 border border-white/60 flex flex-col justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#718096]">Active Streak</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#6489C7]">{user.streakDays}</span>
              <span className="text-xs font-bold text-[#718096]">Days Continuous</span>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-[#718096]">
            Keep the habit going. 7-day milestone awards +100 bonus pts.
          </p>
        </div>

        <div className="neu-surface neu-raised rounded-3xl p-6 border border-white/60 flex flex-col justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#718096]">Unlocked Badges</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#238B57]">
                {badges.filter((b) => b.isUnlocked).length} / {badges.length}
              </span>
              <span className="text-xs font-bold text-[#718096]">Honours</span>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-[#718096]">
            State Climate Change Dept certification tier.
          </p>
        </div>
      </div>

      {/* Navigation Tabs (Neumorphic) */}
      <div className="neu-inset-sm flex flex-wrap gap-2 rounded-2xl p-1.5 border border-white/40">
        <button
          onClick={() => setActiveTab('rewards')}
          className={`rounded-xl px-5 py-2.5 text-xs font-extrabold transition cursor-pointer ${
            activeTab === 'rewards'
              ? 'neu-raised bg-[#E8EDF3] text-[#238B57]'
              : 'text-[#718096] hover:text-[#253247]'
          }`}
        >
          Available Rewards Catalogue
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`rounded-xl px-5 py-2.5 text-xs font-extrabold transition cursor-pointer ${
            activeTab === 'badges'
              ? 'neu-raised bg-[#E8EDF3] text-[#238B57]'
              : 'text-[#718096] hover:text-[#253247]'
          }`}
        >
          Achievement Badges
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`rounded-xl px-5 py-2.5 text-xs font-extrabold transition cursor-pointer ${
            activeTab === 'ledger'
              ? 'neu-raised bg-[#E8EDF3] text-[#238B57]'
              : 'text-[#718096] hover:text-[#253247]'
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
                className="neu-surface neu-raised flex flex-col justify-between rounded-3xl p-6 border border-white/60 transition hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#238B57]">
                      {r.category}
                    </span>
                    <span className="neu-inset-sm rounded-lg px-2.5 py-1 font-black text-[#238B57] text-xs">
                      {r.costPoints} pts
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-extrabold text-[#253247] leading-snug">{r.title}</h3>
                  <p className="mt-2 text-xs text-[#718096] leading-relaxed">{r.description}</p>

                  <div className="neu-inset-sm mt-4 rounded-xl p-3 text-[11px] text-[#718096] border border-white/40">
                    <span className="block font-bold text-[#253247]">Partner:</span>
                    {r.partner}
                  </div>
                </div>

                <div className="mt-6 border-t border-black/5 pt-4">
                  <button
                    disabled={!canAfford}
                    className={`w-full rounded-xl py-2.5 text-xs font-bold transition cursor-pointer ${
                      canAfford
                        ? 'neu-button-primary'
                        : 'neu-inset-sm text-[#718096] opacity-60 cursor-not-allowed'
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
              className={`neu-surface flex items-start gap-4 rounded-3xl p-5 transition border ${
                b.isUnlocked
                  ? 'neu-raised border-[#238B57]/30 ring-1 ring-[#238B57]/20'
                  : 'neu-inset-sm border-white/40 opacity-70'
              }`}
            >
              <div
                className={`grid size-12 shrink-0 place-items-center rounded-2xl ${
                  b.isUnlocked
                    ? 'neu-raised bg-[#E8EDF3] text-[#238B57]'
                    : 'neu-inset-sm text-[#718096]'
                }`}
              >
                {b.isUnlocked ? <Award size={24} /> : <Lock size={20} />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-[#253247]">{b.title}</h4>
                  {b.isUnlocked && <StatusBadge label="Unlocked" variant="success" />}
                </div>
                <p className="mt-1 text-xs text-[#718096] leading-relaxed">{b.description}</p>
                {b.isUnlocked && b.unlockedAt && (
                  <p className="mt-2 text-[10px] text-[#718096]">
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
        <div className="neu-surface neu-raised rounded-3xl overflow-hidden border border-white/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="neu-inset-sm border-b border-black/5 text-[11px] font-black uppercase tracking-wider text-[#718096]">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Event Description</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-right">Points Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/40 transition">
                    <td className="py-3.5 px-4 font-bold text-[#253247]">{entry.date}</td>
                    <td className="py-3.5 px-4 font-medium text-[#253247]">{entry.source}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge
                        label={entry.type}
                        variant={entry.type === 'earned' ? 'success' : entry.type === 'bonus' ? 'warning' : 'neutral'}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#238B57]">
                      +{entry.points} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
