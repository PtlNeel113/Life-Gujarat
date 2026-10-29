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
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E3E8DF] bg-white p-4 shadow-sm sm:p-5">
        <div className="relative min-w-[260px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9B92]" />
          <input
            type="text"
            placeholder="Search communities by society name, city, or challenge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] py-2 pl-9 pr-3 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#8E9B92]" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] px-3 py-2 text-xs font-semibold text-[#103D30] outline-none"
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
            className={`flex flex-col justify-between rounded-3xl border p-6 transition shadow-xs hover:shadow-md ${
              comm.isJoined ? 'border-[#CBE3C3] bg-[#F7FAF4]' : 'border-[#E3E8DF] bg-white'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B4D]">
                    {comm.type}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-[#103D30]">{comm.name}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[#66736B]">
                    <MapPin size={12} className="text-[#176B4D]" />
                    <span>{comm.district} District</span>
                    <span>·</span>
                    <span>{comm.membersCount} households</span>
                  </div>
                </div>

                {comm.isJoined && (
                  <StatusBadge label="Member" variant="success" />
                )}
              </div>

              <p className="mt-3 text-xs text-[#66736B] leading-relaxed">{comm.description}</p>

              {/* Challenge Banner */}
              <div className="mt-5 rounded-2xl bg-[#EEF4E8] p-4 text-xs">
                <span className="font-bold text-[#176B4D] uppercase text-[10px] tracking-wider block">
                  Active Challenge
                </span>
                <p className="mt-0.5 font-bold text-[#103D30]">{comm.activeChallenge}</p>
                <div className="mt-3 flex items-center justify-between text-[#66736B]">
                  <span>Total Power Saved:</span>
                  <strong className="text-[#176B4D]">{comm.totalKwhSaved.toLocaleString('en-IN')} kWh</strong>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#F0F3EC] pt-4">
              <Link
                href={`/community/${comm.id}`}
                className="text-xs font-bold text-[#176B4D] hover:underline"
              >
                View Challenge Details →
              </Link>

              <button
                type="button"
                onClick={() => handleToggleJoin(comm.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  comm.isJoined
                    ? 'border border-[#D7E2D3] bg-white text-[#C0392B] hover:bg-[#FEECEC]'
                    : 'bg-[#176B4D] text-white hover:bg-[#103D30]'
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-[#D7E2D3] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E3E8DF] pb-4">
              <h3 className="text-base font-bold text-[#103D30]">Start a Community Collective</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-[#8E9B92] hover:text-[#103D30]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCommunity} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#103D30]">Community Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goyal Park Housing Society"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#103D30]">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs font-semibold text-[#103D30] outline-none"
                  >
                    <option value="Residential Society">Residential Society</option>
                    <option value="Ward/Taluka">Ward / Taluka</option>
                    <option value="College/School">College / School</option>
                    <option value="Workplace">Workplace</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#103D30]">District</label>
                  <input
                    type="text"
                    required
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103D30]">Initial Active Challenge</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50kW Common Solar & LED Hallway Upgrade"
                  value={newChallenge}
                  onChange={(e) => setNewChallenge(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103D30]">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe your community's sustainability goals..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-[#E3E8DF]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl border border-[#D7E2D3] px-4 py-2.5 text-xs font-semibold text-[#55635B] hover:bg-[#F6F8F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#176B4D] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#103D30]"
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
