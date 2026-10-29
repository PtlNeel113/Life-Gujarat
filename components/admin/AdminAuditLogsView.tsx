'use client'

import React, { useState, useEffect } from 'react'
import {
  ClipboardList,
  Search,
  ShieldCheck,
  Calendar,
  Lock,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { AdminAuditLog } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function AdminAuditLogsView() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLogs(dataStore.getAuditLogs())
  }, [])

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actorName.toLowerCase().includes(search.toLowerCase()) ||
      l.targetEntity.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="Administrative Security & Audit Trail"
        description="Immutable record of administrative actions, evidence approvals, tariff parameter adjustments, and role updates."
      />

      <div className="flex items-center justify-between rounded-2xl border border-[#E3E8DF] bg-white p-4 shadow-xs">
        <div className="relative min-w-[260px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9B92]" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, or target entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] py-2 pl-9 pr-3 text-xs text-[#103D30] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#176B4D] font-bold">
          <Lock size={13} />
          <span>Tamper-Resistant Security Store</span>
        </div>
      </div>

      <div className="rounded-3xl border border-[#E3E8DF] bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FBFCF8] border-b border-[#E3E8DF] text-[11px] font-bold uppercase tracking-wider text-[#8E9B92]">
            <tr>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Actor</th>
              <th className="py-3.5 px-4">Action</th>
              <th className="py-3.5 px-4">Target Entity</th>
              <th className="py-3.5 px-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F3EC]">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-[#F9FAF6]">
                <td className="py-3.5 px-4 font-mono text-[11px] text-[#8E9B92] whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-[#103D30] block">{log.actorName}</span>
                  <span className="text-[10px] text-[#8E9B92]">{log.actorRole}</span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-[#176B4D]">
                  {log.action}
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-[#55635B]">
                  {log.targetEntity}
                </td>
                <td className="py-3.5 px-4 text-[#66736B] leading-relaxed max-w-sm">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
