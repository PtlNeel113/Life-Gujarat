'use client'

import React, { useState } from 'react'
import {
  Users,
  Search,
  UserCheck,
  Shield,
  Filter,
  CheckCircle2,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { UserProfile, UserRole } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function AdminUsersView() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const initialUsers: UserProfile[] = [
    dataStore.getUser(),
    {
      id: 'usr_bhavin_admin',
      name: 'Bhavin Patel',
      email: 'bhavin.patel@gujarat.gov.in',
      role: 'admin',
      district: 'Gandhinagar',
      discom: 'UGVCL',
      consumerNumber: '01001/00021',
      householdMembers: 3,
      homeType: 'individual_bungalow',
      points: 1250,
      streakDays: 45,
      joinedDate: '2025-10-01',
      language: 'en',
      avatarInitials: 'BP',
    },
    {
      id: 'usr_chintan_02',
      name: 'Chintan Mehta',
      email: 'chintan.m@surat.in',
      role: 'citizen',
      district: 'Surat',
      discom: 'DGVCL',
      consumerNumber: '04120/88129',
      householdMembers: 5,
      homeType: 'apartment',
      points: 680,
      streakDays: 12,
      joinedDate: '2026-02-15',
      language: 'gu',
      avatarInitials: 'CM',
    },
    {
      id: 'usr_pooja_03',
      name: 'Pooja Trivedi',
      email: 'pooja.t@vadodara.life',
      role: 'moderator',
      district: 'Vadodara',
      discom: 'MGVCL',
      consumerNumber: '09811/44012',
      householdMembers: 2,
      homeType: 'row_house',
      points: 890,
      streakDays: 20,
      joinedDate: '2026-01-10',
      language: 'en',
      avatarInitials: 'PT',
    },
  ]

  const [userList, setUserList] = useState<UserProfile[]>(initialUsers)
  const [statusMsg, setStatusMsg] = useState('')

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          dataStore.addAuditLog({
            actorName: 'Bhavin Patel',
            actorRole: 'Admin',
            action: 'Updated User Role',
            targetEntity: `${u.name} (${u.id})`,
            details: `Role updated from ${u.role} to ${newRole}`,
          })
          return { ...u, role: newRole }
        }
        return u
      })
    )
    setStatusMsg(`Role updated to ${newRole}. Recorded in audit trail.`)
    setTimeout(() => setStatusMsg(''), 3000)
  }

  const filtered = userList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.district.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-8">
      <PageHeader
        title="Citizen Directory & Access Control"
        description="Search citizen records, audit enrolled power connections, and manage administrative privileges."
      />

      {statusMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#E5F1DF] p-4 text-xs font-semibold text-[#176B4D]">
          <CheckCircle2 size={16} /> {statusMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E3E8DF] bg-white p-4 shadow-sm sm:p-5">
        <div className="relative min-w-[260px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9B92]" />
          <input
            type="text"
            placeholder="Search citizens by name, email, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] py-2 pl-9 pr-3 text-xs text-[#103D30] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#8E9B92]" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] px-3 py-2 text-xs font-semibold text-[#103D30] outline-none"
          >
            <option value="all">All Roles</option>
            <option value="citizen">Citizens</option>
            <option value="moderator">Moderators</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl border border-[#E3E8DF] bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FBFCF8] border-b border-[#E3E8DF] text-[11px] font-bold uppercase tracking-wider text-[#8E9B92]">
            <tr>
              <th className="py-3.5 px-4">Citizen Profile</th>
              <th className="py-3.5 px-4">District</th>
              <th className="py-3.5 px-4">Discom & Consumer No</th>
              <th className="py-3.5 px-4">Points</th>
              <th className="py-3.5 px-4">Current Role</th>
              <th className="py-3.5 px-4 text-right">Assign Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F3EC]">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-[#F9FAF6]">
                <td className="py-3.5 px-4">
                  <span className="font-bold text-[#103D30] block">{u.name}</span>
                  <span className="text-[10px] text-[#8E9B92]">{u.email}</span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-[#103D30]">{u.district}</td>
                <td className="py-3.5 px-4 text-[#55635B]">
                  {u.discom} ({u.consumerNumber || '—'})
                </td>
                <td className="py-3.5 px-4 font-extrabold text-[#176B4D]">{u.points} pts</td>
                <td className="py-3.5 px-4">
                  <StatusBadge
                    label={u.role}
                    variant={u.role === 'admin' ? 'warning' : u.role === 'moderator' ? 'info' : 'neutral'}
                  />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                    className="rounded-lg border border-[#D7E2D3] bg-[#FBFCF8] px-2 py-1 text-[11px] font-semibold text-[#103D30] outline-none"
                  >
                    <option value="citizen">Citizen</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
