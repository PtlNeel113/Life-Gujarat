'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Search,
  Plus,
  Trophy,
  Zap,
  MapPin,
  CheckCircle2,
  ArrowRight,
  X,
  Filter,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { Community } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function CommunityDiscoveryView() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // New community form
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<Community['type']>('Residential Society')
  const [newDistrict, setNewDistrict] = useState('Ahmedabad')
  const [newChallenge, setNewChallenge] = useState('')
  const [newDescription, setNewDescription] = useState('')

  useEffect(() => {
    refresh()
  }, [])

  const refresh = () => {
    setCommunities(dataStore.getCommunities())
  }

  const handleToggleJoin = (id: string) => {
    dataStore.toggleCommunityJoin(id)
    refresh()
  }

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newChallenge.trim()) return

    dataStore.createCommunity({
      name: newName,
      type: newType,
      district: newDistrict,
      activeChallenge: newChallenge,
      description: newDescription || 'Local neighborhood sustainability initiative.',
    })

    setCreateModalOpen(false)
    setNewName('')
    setNewChallenge('')
    setNewDescription('')
    refresh()
  }

  const types = ['All', 'Residential Society', 'Ward/Taluka', 'College/School', 'Workplace']

  const filtered = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.activeChallenge.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'All' || c.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-8">
      <PageHeader
        title="Community Sustainability Collectives"
        description="Collaborate with your residential society, ward, or university campus to pool energy savings and compete in neighborhood challenges."
        action={{
          label: 'Create Community Collective',
          onClick: () => setCreateModalOpen(true),
          icon: <Plus size={16} />,
        }}
      />

      {/* Filter and Search Bar */}
      <div className="neu-surface neu-raised flex flex-wrap items-center justify-between gap-4 rounded-3xl p-4 sm:p-5 border border-white/50">
        <div className="relative min-w-[260px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718096]" />
          <input
            type="text"
            placeholder="Search communities by society name, city, or challenge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neu-input w-full rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium text-[#253247] placeholder-[#718096] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#718096]" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="neu-input rounded-2xl px-4 py-2.5 text-xs font-bold text-[#253247] outline-none cursor-pointer"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((comm) => (
          <div
            key={comm.id}
            className={`neu-surface flex flex-col justify-between rounded-3xl p-6 transition border ${
              comm.isJoined
                ? 'neu-raised border-[#238B57]/40 ring-1 ring-[#238B57]/30'
                : 'neu-raised border-white/60 hover:shadow-lg'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#238B57]">
                    {comm.type}
                  </span>
                  <h3 className="mt-1 text-lg font-extrabold text-[#253247]">{comm.name}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[#718096]">
                    <MapPin size={13} className="text-[#238B57]" />
                    <span>{comm.district} District</span>
                    <span>·</span>
                    <span>{comm.membersCount} households</span>
                  </div>
                </div>

                {comm.isJoined && (
                  <StatusBadge label="Member" variant="success" />
                )}
              </div>

              <p className="mt-3 text-xs text-[#718096] leading-relaxed">{comm.description}</p>

              {/* Challenge Banner */}
              <div className="neu-inset-sm mt-5 rounded-2xl p-4 text-xs border border-white/40">
                <span className="font-extrabold text-[#238B57] uppercase text-[10px] tracking-wider block">
                  Active Challenge
                </span>
                <p className="mt-1 font-bold text-[#253247]">{comm.activeChallenge}</p>
                <div className="mt-3 flex items-center justify-between text-[#718096]">
                  <span>Total Power Saved:</span>
                  <strong className="text-[#238B57] font-extrabold">{comm.totalKwhSaved.toLocaleString('en-IN')} kWh</strong>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-black/5 pt-4">
              <Link
                href={`/community/${comm.id}`}
                className="text-xs font-bold text-[#238B57] hover:text-[#1d7046] flex items-center gap-1"
              >
                <span>View Challenge Details</span>
                <ArrowRight size={13} />
              </Link>

              <button
                type="button"
                onClick={() => handleToggleJoin(comm.id)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                  comm.isJoined
                    ? 'neu-button text-[#e05252] hover:bg-rose-50'
                    : 'neu-button-primary'
                }`}
              >
                {comm.isJoined ? 'Leave Collective' : 'Join Community'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Community Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setCreateModalOpen(false)} />
          <div className="neu-surface neu-raised relative z-10 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/60">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <h3 className="text-base font-extrabold text-[#253247]">Start a Community Collective</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="neu-button grid size-8 place-items-center rounded-xl text-[#718096] hover:text-[#253247]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCommunity} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#253247]">Community Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goyal Park Housing Society"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="neu-input mt-1.5 w-full rounded-xl p-3 text-xs font-medium text-[#253247] placeholder-[#718096] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#253247]">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="neu-input mt-1.5 w-full rounded-xl p-3 text-xs font-bold text-[#253247] outline-none"
                  >
                    <option value="Residential Society">Residential Society</option>
                    <option value="Ward/Taluka">Ward / Taluka</option>
                    <option value="College/School">College / School</option>
                    <option value="Workplace">Workplace</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#253247]">District</label>
                  <input
                    type="text"
                    required
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="neu-input mt-1.5 w-full rounded-xl p-3 text-xs font-medium text-[#253247] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#253247]">Initial Active Challenge</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50kW Common Solar & LED Hallway Upgrade"
                  value={newChallenge}
                  onChange={(e) => setNewChallenge(e.target.value)}
                  className="neu-input mt-1.5 w-full rounded-xl p-3 text-xs font-medium text-[#253247] placeholder-[#718096] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#253247]">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe your community's sustainability goals..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="neu-input mt-1.5 w-full rounded-xl p-3 text-xs font-medium text-[#253247] placeholder-[#718096] outline-none resize-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="neu-button rounded-xl px-4 py-2.5 text-xs font-bold text-[#718096] hover:text-[#253247]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-button-primary rounded-xl px-5 py-2.5 text-xs font-bold shadow-md"
                >
                  Create & Join Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
