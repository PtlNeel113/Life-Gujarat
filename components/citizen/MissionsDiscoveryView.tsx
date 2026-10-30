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
    return sub.status
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

      {/* Overview Stat Strip in Soft UI Elevation */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-3xl neu-raised p-6">
          <div>
            <p className="text-xs uppercase font-bold text-[#718096]">Missions Catalog</p>
            <p className="text-2xl font-extrabold text-[#253247] mt-1">{missions.length} Available</p>
          </div>
          <div className="grid size-12 place-items-center rounded-2xl neu-inset-sm text-[#238B57]">
            <CheckSquare size={22} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-3xl neu-raised p-6">
          <div>
            <p className="text-xs uppercase font-bold text-[#718096]">Your Completed</p>
            <p className="text-2xl font-extrabold text-[#238B57] mt-1">{completedCount} Verified</p>
          </div>
          <div className="grid size-12 place-items-center rounded-2xl neu-inset-sm text-[#238B57]">
            <Check size={22} strokeWidth={3} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-3xl neu-raised p-6">
          <div>
            <p className="text-xs uppercase font-bold text-[#718096]">Points Earnable</p>
            <p className="text-2xl font-extrabold text-[#d97706] mt-1 tabular-nums">
              {missions.reduce((acc, m) => acc + m.points, 0)} LiFE Pts
            </p>
          </div>
          <div className="grid size-12 place-items-center rounded-2xl neu-inset-sm text-[#d97706]">
            <Sparkles size={22} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar with Neumorphism */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl neu-raised p-5">
        <div className="relative min-w-[260px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718096] pointer-events-none" />
          <input
            type="text"
            placeholder="Search missions (e.g. AC 24°C, lighting, water)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl neu-input py-2.5 pl-10 pr-4 text-xs text-[#253247]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Tabs Inset Container */}
          <div className="flex flex-wrap items-center rounded-2xl neu-inset p-1 text-xs font-bold">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${
                  selectedCategory === c ? 'neu-raised text-[#238B57]' : 'text-[#718096] hover:text-[#253247]'
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
            className="appearance-none rounded-2xl neu-input py-2.5 px-4 text-xs font-bold text-[#253247] cursor-pointer"
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMissions.map((m) => {
          const status = getMissionStatus(m.id)
          const isDone = status === 'approved'
          const isPending = status === 'pending'

          return (
            <div
              key={m.id}
              className={`flex flex-col justify-between rounded-3xl p-6 transition select-none ${
                isDone
                  ? 'neu-inset'
                  : isPending
                  ? 'neu-raised'
                  : 'neu-raised neu-raised-hover'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#238B57]">
                    {m.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isDone && <StatusBadge label="Completed" variant="success" />}
                    {isPending && <StatusBadge label="Pending Review" variant="warning" />}
                    {!isDone && !isPending && (
                      <span className="rounded-xl neu-inset-sm px-2.5 py-0.5 text-xs font-extrabold text-[#238B57]">
                        +{m.points} pts
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mt-4 text-base font-extrabold text-[#253247] leading-snug">{m.title}</h3>
                <p className="mt-2 text-xs text-[#718096] leading-relaxed line-clamp-2">
                  {m.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[rgba(197,202,208,0.35)] pt-4 text-[11px] text-[#718096]">
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {m.duration}
                  </span>
                  <span>·</span>
                  <span>{m.difficulty}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-[#238B57] font-bold">
                    <ShieldCheck size={13} /> {m.verificationLevel}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href={`/missions/${m.id}`}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition ${
                    isDone
                      ? 'neu-button text-[#238B57]'
                      : isPending
                      ? 'neu-button text-[#d97706]'
                      : 'neu-button-primary'
                  }`}
                >
                  {isDone ? (
                    <>
                      <Check size={15} strokeWidth={3} /> Completed (View Details)
                    </>
                  ) : isPending ? (
                    <>Evidence Submitted (Pending)</>
                  ) : (
                    <>
                      Start Mission <ArrowRight size={15} />
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
