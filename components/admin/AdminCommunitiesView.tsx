'use client'

import React, { useState, useEffect } from 'react'
import {
  Users,
  Search,
  ShieldAlert,
  CheckCircle2,
  MapPin,
  Trash2,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { Community } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function AdminCommunitiesView() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    setCommunities(dataStore.getCommunities())
  }, [])

  const filtered = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.district.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="Community Collectives & Moderation"
        description="Review registered societies, university chapters, and neighborhood collectives participating in Mission LiFE."
      />

      <div className="rounded-3xl border border-[#E3E8DF] bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FBFCF8] border-b border-[#E3E8DF] text-[11px] font-bold uppercase tracking-wider text-[#8E9B92]">
            <tr>
              <th className="py-3.5 px-4">Collective Name</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">District</th>
              <th className="py-3.5 px-4">Households</th>
              <th className="py-3.5 px-4">Energy Saved</th>
              <th className="py-3.5 px-4 text-right">Moderation Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F3EC]">
            {filtered.map((comm) => (
              <tr key={comm.id} className="hover:bg-[#F9FAF6]">
                <td className="py-3.5 px-4">
                  <span className="font-bold text-[#103D30] block">{comm.name}</span>
                  <span className="text-[10px] text-[#8E9B92] line-clamp-1">{comm.activeChallenge}</span>
                </td>
                <td className="py-3.5 px-4 text-[#55635B]">{comm.type}</td>
                <td className="py-3.5 px-4 font-semibold text-[#103D30]">{comm.district}</td>
                <td className="py-3.5 px-4 font-bold text-[#176B4D]">{comm.membersCount}</td>
                <td className="py-3.5 px-4 font-extrabold text-[#103D30]">
                  {comm.totalKwhSaved.toLocaleString('en-IN')} kWh
                </td>
                <td className="py-3.5 px-4 text-right">
                  <StatusBadge label="Compliant" variant="success" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
