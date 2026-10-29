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
      <div className="rounded-3xl border border-[#E3E8DF] bg-white p-12 text-center">
        <h3 className="text-base font-bold text-[#103D30]">Community Not Found</h3>
        <p className="mt-1 text-xs text-[#66736B]">The requested collective does not exist or has been archived.</p>
        <Link
          href="/community"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#176B4D] px-4 py-2 text-xs font-bold text-white"
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
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8E9B92]">Enrolled Households</p>
          <p className="mt-2 text-3xl font-extrabold text-[#103D30]">{community.membersCount}</p>
          <p className="mt-1 text-xs text-[#66736B]">{community.district} District</p>
        </div>

        <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8E9B92]">Pooled Energy Saved</p>
          <p className="mt-2 text-3xl font-extrabold text-[#176B4D]">
            {community.totalKwhSaved.toLocaleString('en-IN')}{' '}
            <span className="text-sm font-normal text-[#8E9B92]">kWh</span>
          </p>
          <p className="mt-1 text-xs text-[#66736B]">
            ~{Math.round(community.totalKwhSaved * 0.716 / 1000)} tonnes CO₂ avoided
          </p>
        </div>

        <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8E9B92]">Collective Points</p>
          <p className="mt-2 text-3xl font-extrabold text-[#F39C12]">
            {community.totalPoints.toLocaleString('en-IN')}{' '}
            <span className="text-sm font-normal text-[#8E9B92]">LiFE pts</span>
          </p>
          <p className="mt-1 text-xs text-[#66736B]">District Rank #2</p>
        </div>
      </div>

      {/* Active Challenge Box & Leaderboard */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0F3EC] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B4D]">Active Campaign</span>
              <h3 className="mt-0.5 text-base font-bold text-[#103D30]">{community.activeChallenge}</h3>
            </div>
            <StatusBadge label="In Progress" variant="success" />
          </div>

          <p className="text-xs leading-relaxed text-[#66736B]">
            All households in {community.name} are encouraged to audit lighting, shift stairwell and parking illumination
            to timer-based 5-star LEDs, and set air conditioners to 24°C comfort benchmarks.
          </p>

          <div className="rounded-2xl bg-[#F6F8F3] p-5 space-y-3">
            <div className="flex justify-between text-xs font-bold text-[#103D30]">
              <span>Collective Progress Target (20,000 kWh)</span>
              <span>71% Completed</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E3E8DF]">
              <div className="h-full bg-[#176B4D] w-[71%]" />
            </div>
            <div className="flex justify-between text-[11px] text-[#8E9B92]">
              <span>14,200 kWh achieved</span>
              <span>18 days remaining in challenge</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/missions"
              className="inline-flex items-center gap-2 rounded-xl bg-[#176B4D] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#103D30]"
            >
              Log Individual Mission to Contribute Points →
            </Link>
          </div>
        </div>

        {/* Neighborhood Leaderboard */}
        <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2 border-b border-[#F0F3EC] pb-4">
            <Trophy size={18} className="text-[#F39C12]" />
            <h3 className="text-base font-bold text-[#103D30]">Block & Wing Standings</h3>
          </div>

          <div className="mt-5 space-y-3">
            {sampleLeaderboard.map((item) => (
              <div
                key={item.rank}
                className="flex items-center justify-between rounded-2xl bg-[#FBFCF8] p-3 text-xs border border-[#F0F3EC]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-6 place-items-center rounded-full font-bold text-[11px] ${
                      item.rank === 1
                        ? 'bg-[#FEF5E7] text-[#B07C2D]'
                        : item.rank === 2
                        ? 'bg-[#F0F2EB] text-[#55635B]'
                        : 'bg-[#F6F8F3] text-[#8E9B92]'
                    }`}
                  >
                    {item.rank}
                  </span>
                  <span className="font-bold text-[#103D30]">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-[#176B4D]">{item.kwhSaved} kWh</p>
                  <p className="text-[10px] text-[#8E9B92]">{item.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
