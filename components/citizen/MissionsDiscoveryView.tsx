'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CheckSquare,
  Search,
  Filter,
  Check,
  Zap,
  Leaf,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Award,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { Mission, MissionSubmission } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function MissionsDiscoveryView() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All')

  useEffect(() => {
    setMissions(dataStore.getMissions())
    setSubmissions(dataStore.getUserSubmissions(dataStore.getUser().id))
  }, [])

  const categories = ['All', 'Energy', 'Water', 'Waste', 'Transport', 'Food']
  const difficulties = ['All', 'Easy', 'Medium', 'Challenging']

  const getMissionStatus = (missionId: string) => {
    const sub = submissions.find((s) => s.missionId === missionId)
    if (!sub) return 'available'
    return sub.status // 'pending' | 'approved' | 'rejected'
  }

  const filteredMissions = missions.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || m.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const completedCount = submissions.filter((s) => s.status === 'approved').length

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mission LiFE Daily Actions"
        description="Practical, high-impact sustainable habits designed for households across Gujarat. Complete actions to cut emissions and earn LiFE points."
        action={{
          label: 'View Points Ledger',
          href: '/rewards',
          icon: <Award size={15} />,
        }}
      />

      {/* Overview Stat Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-[#E3E8DF] bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs uppercase font-semibold text-[#8E9B92]">Missions Catalog</p>
            <p className="text-2xl font-extrabold text-[#103D30]">{missions.length} Available</p>
          </div>
          <div className="grid size-10 place-items-center rounded-xl bg-[#EEF4E8] text-[#176B4D]">
            <CheckSquare size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[#E3E8DF] bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs uppercase font-semibold text-[#8E9B92]">Your Completed</p>
            <p className="text-2xl font-extrabold text-[#176B4D]">{completedCount} Verified</p>
          </div>
          <div className="grid size-10 place-items-center rounded-xl bg-[#EAF8EE] text-[#27AE60]">
            <Check size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[#E3E8DF] bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs uppercase font-semibold text-[#8E9B92]">Points Earnable</p>
            <p className="text-2xl font-extrabold text-[#F39C12]">
              {missions.reduce((acc, m) => acc + m.points, 0)} LiFE Pts
            </p>
          </div>
          <div className="grid size-10 place-items-center rounded-xl bg-[#FEF7EC] text-[#F39C12]">
            <Sparkles size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E3E8DF] bg-white p-4 shadow-sm sm:p-5">
        <div className="relative min-w-[260px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9B92]" />
          <input
            type="text"
            placeholder="Search missions (e.g. AC 24°C, lighting, water)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] py-2 pl-9 pr-3 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center rounded-xl bg-[#F0F4EC] p-1 text-xs font-semibold">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`rounded-lg px-2.5 py-1 text-xs transition ${
                  selectedCategory === c ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#66736B]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] px-3 py-2 text-xs font-semibold text-[#103D30] outline-none"
          >
            {difficulties.map((d) => (
              <option key={d} value={d}>
                Difficulty: {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredMissions.map((m) => {
          const status = getMissionStatus(m.id)
          const isDone = status === 'approved'
          const isPending = status === 'pending'

          return (
            <div
              key={m.id}
              className={`flex flex-col justify-between rounded-3xl border p-6 transition shadow-xs hover:shadow-md ${
                isDone
                  ? 'border-[#CBE3C3] bg-[#F7FAF4]'
                  : isPending
                  ? 'border-[#FADCA8] bg-[#FEFBF5]'
                  : 'border-[#E3E8DF] bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B4D]">
                    {m.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isDone && <StatusBadge label="Completed" variant="success" />}
                    {isPending && <StatusBadge label="Pending Review" variant="warning" />}
                    {!isDone && !isPending && (
                      <span className="rounded-full bg-[#E5F1DF] px-2.5 py-0.5 text-xs font-bold text-[#176B4D]">
                        +{m.points} pts
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mt-3 text-base font-bold text-[#103D30] leading-snug">{m.title}</h3>
                <p className="mt-2 text-xs text-[#66736B] leading-relaxed line-clamp-2">
                  {m.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#F0F3EC] pt-4 text-[11px] text-[#8E9B92]">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {m.duration}
                  </span>
                  <span>·</span>
                  <span>{m.difficulty}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-[#176B4D] font-medium">
                    <ShieldCheck size={12} /> {m.verificationLevel}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href={`/missions/${m.id}`}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                    isDone
                      ? 'bg-[#E5F1DF] text-[#176B4D] hover:bg-[#D5E7CE]'
                      : isPending
                      ? 'bg-[#FEF5E7] text-[#B07C2D] hover:bg-[#FCEFD7]'
                      : 'bg-[#176B4D] text-white hover:bg-[#103D30]'
                  }`}
                >
                  {isDone ? (
                    <>
                      <Check size={14} /> Completed (View Details)
                    </>
                  ) : isPending ? (
                    <>Evidence Submitted (Pending)</>
                  ) : (
                    <>
                      Start Mission <ArrowRight size={14} />
                    </>
                  )}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
