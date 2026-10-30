'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Trophy,
  Zap,
  Leaf,
  MapPin,
  CheckCircle2,
  Calendar,
  Share2,
  ArrowLeft,
  Flame,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { Community } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

interface CommunityDetailViewProps {
  communityId: string
}

export function CommunityDetailView({ communityId }: CommunityDetailViewProps) {
  const [community, setCommunity] = useState<Community | undefined>(undefined)
  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    refresh()
  }, [communityId])

  const refresh = () => {
    const list = dataStore.getCommunities()
    const target = list.find((c) => c.id === communityId)
    setCommunity(target)
    if (target) setIsJoined(!!target.isJoined)
  }

  const handleToggleJoin = () => {
    if (!community) return
    const newState = dataStore.toggleCommunityJoin(community.id)
    setIsJoined(newState)
    refresh()
  }

  if (!community) {
    return (
      <div className="neu-surface neu-raised rounded-3xl p-12 text-center border border-white/60">
        <h3 className="text-base font-extrabold text-[#253247]">Community Not Found</h3>
        <p className="mt-1 text-xs text-[#718096]">The requested collective does not exist or has been archived.</p>
        <Link
          href="/community"
          className="neu-button-primary mt-5 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold"
        >
          <ArrowLeft size={14} /> Back to Communities
        </Link>
      </div>
    )
  }

  const sampleLeaderboard = [
    { rank: 1, name: 'Block B — Tower 4', kwhSaved: 3200, points: 9800 },
    { rank: 2, name: 'Block A — Tower 1', kwhSaved: 2850, points: 8400 },
    { rank: 3, name: 'Block C — Villa Wing', kwhSaved: 2400, points: 7100 },
    { rank: 4, name: 'Clubhouse Committee', kwhSaved: 1800, points: 5200 },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title={community.name}
        description={community.description}
        backHref="/community"
        backLabel="Back to All Communities"
        action={{
          label: isJoined ? 'Leave Collective' : 'Join Collective',
          onClick: handleToggleJoin,
          icon: <Users size={15} />,
          variant: isJoined ? 'outline' : 'primary',
        }}
      />

      {/* Hero Impact Stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="neu-surface neu-raised rounded-3xl p-6 border border-white/60">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#718096]">Enrolled Households</p>
          <p className="mt-2 text-3xl font-black text-[#253247]">{community.membersCount}</p>
          <p className="mt-1 text-xs text-[#718096]">{community.district} District</p>
        </div>

        <div className="neu-surface neu-raised rounded-3xl p-6 border border-white/60">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#718096]">Pooled Energy Saved</p>
          <p className="mt-2 text-3xl font-black text-[#238B57]">
            {community.totalKwhSaved.toLocaleString('en-IN')}{' '}
            <span className="text-sm font-semibold text-[#718096]">kWh</span>
          </p>
          <p className="mt-1 text-xs text-[#718096]">
            ~{Math.round(community.totalKwhSaved * 0.716 / 1000)} tonnes CO₂ avoided
          </p>
        </div>

        <div className="neu-surface neu-raised rounded-3xl p-6 border border-white/60">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#718096]">Collective Points</p>
          <p className="mt-2 text-3xl font-black text-[#6489C7]">
            {community.totalPoints.toLocaleString('en-IN')}{' '}
            <span className="text-sm font-semibold text-[#718096]">LiFE pts</span>
          </p>
          <p className="mt-1 text-xs text-[#718096]">District Rank #2</p>
        </div>
      </div>

      {/* Active Challenge Box & Leaderboard */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="neu-surface neu-raised rounded-3xl p-6 sm:p-8 space-y-6 border border-white/60">
          <div className="flex items-center justify-between border-b border-black/5 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#238B57]">Active Campaign</span>
              <h3 className="mt-0.5 text-base font-extrabold text-[#253247]">{community.activeChallenge}</h3>
            </div>
            <StatusBadge label="In Progress" variant="success" />
          </div>

          <p className="text-xs leading-relaxed text-[#718096]">
            All households in {community.name} are encouraged to audit lighting, shift stairwell and parking illumination
            to timer-based 5-star LEDs, and set air conditioners to 24°C comfort benchmarks.
          </p>

          <div className="neu-inset-sm rounded-2xl p-5 space-y-3 border border-white/40">
            <div className="flex justify-between text-xs font-bold text-[#253247]">
              <span>Collective Progress Target (20,000 kWh)</span>
              <span className="text-[#238B57]">71% Completed</span>
            </div>
            <div className="neu-inset-sm h-3 w-full overflow-hidden rounded-full bg-[#dce3ec] p-0.5">
              <div className="h-full bg-gradient-to-r from-[#238B57] to-[#65B98A] rounded-full w-[71%]" />
            </div>
            <div className="flex justify-between text-[11px] text-[#718096]">
              <span>14,200 kWh achieved</span>
              <span>18 days remaining in challenge</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/missions"
              className="neu-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold"
            >
              Log Individual Mission to Contribute Points →
            </Link>
          </div>
        </div>

        {/* Neighborhood Leaderboard */}
        <div className="neu-surface neu-raised rounded-3xl p-6 sm:p-8 border border-white/60">
          <div className="flex items-center gap-2 border-b border-black/5 pb-4">
            <Trophy size={18} className="text-[#6489C7]" />
            <h3 className="text-base font-extrabold text-[#253247]">Block & Wing Standings</h3>
          </div>

          <div className="mt-5 space-y-3">
            {sampleLeaderboard.map((item) => (
              <div
                key={item.rank}
                className="neu-raised-sm flex items-center justify-between rounded-2xl p-3.5 text-xs border border-white/60"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-7 place-items-center rounded-xl font-black text-xs ${
                      item.rank === 1
                        ? 'neu-inset text-[#238B57]'
                        : item.rank === 2
                        ? 'neu-inset text-[#6489C7]'
                        : 'neu-inset-sm text-[#718096]'
                    }`}
                  >
                    {item.rank}
                  </span>
                  <span className="font-bold text-[#253247]">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-black text-[#238B57]">{item.kwhSaved} kWh</p>
                  <p className="text-[10px] text-[#718096]">{item.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
