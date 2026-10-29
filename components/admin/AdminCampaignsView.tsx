'use client'

import React, { useState, useEffect } from 'react'
import {
  Flame,
  Plus,
  Calendar,
  Target,
  Users,
  CheckCircle2,
  X,
  Filter,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { AdminCampaign } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function AdminCampaignsView() {
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  // New campaign state
  const [title, setTitle] = useState('')
  const [targetDistrict, setTargetDistrict] = useState('All 33 Districts')
  const [startDate, setStartDate] = useState('2026-11-01')
  const [endDate, setEndDate] = useState('2026-12-31')
  const [goalKwh, setGoalKwh] = useState(500000)

  useEffect(() => {
    refresh()
  }, [])

  const refresh = () => {
    setCampaigns(dataStore.getAdminCampaigns())
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    dataStore.createCampaign({
      title,
      targetDistrict,
      startDate,
      endDate,
      goalKwhReduction: goalKwh,
      status: 'active',
    })

    setModalOpen(false)
    setTitle('')
    refresh()
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mission LiFE State Campaigns"
        description="Configure seasonal energy-reduction campaigns, set district targets, and track aggregate MWh conservation."
        action={{
          label: 'Launch New Campaign',
          onClick: () => setModalOpen(true),
          icon: <Plus size={15} />,
        }}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((cmp) => {
          const progressPercent = Math.min(
            100,
            Math.round((cmp.currentKwhReduction / cmp.goalKwhReduction) * 100)
          )

          return (
            <div
              key={cmp.id}
              className="flex flex-col justify-between rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-xs hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B4D]">
                    {cmp.targetDistrict}
                  </span>
                  <StatusBadge
                    label={cmp.status}
                    variant={cmp.status === 'active' ? 'success' : 'neutral'}
                  />
                </div>

                <h3 className="mt-3 text-base font-bold text-[#103D30] leading-snug">{cmp.title}</h3>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-[#8E9B92]">
                  <Calendar size={13} />
                  <span>
                    {cmp.startDate} to {cmp.endDate}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-5 space-y-2 rounded-2xl bg-[#F6F8F3] p-4 text-xs">
                  <div className="flex justify-between font-bold text-[#103D30]">
                    <span>Reduction Goal</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#E3E8DF]">
                    <div
                      className="h-full bg-[#176B4D]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#66736B]">
                    <span>{(cmp.currentKwhReduction / 1000).toFixed(0)} MWh saved</span>
                    <span>{(cmp.goalKwhReduction / 1000).toFixed(0)} MWh target</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-[#66736B]">
                  <span>Enrolled Citizens:</span>
                  <strong className="text-[#103D30]">{cmp.enrolledCitizens.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-[#D7E2D3] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E3E8DF] pb-4">
              <h3 className="text-base font-bold text-[#103D30]">Launch State Campaign</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#8E9B92] hover:text-[#103D30]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#103D30]">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Geyser & Heat Management Drive"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103D30]">Target Jurisdiction</label>
                <input
                  type="text"
                  required
                  value={targetDistrict}
                  onChange={(e) => setTargetDistrict(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#103D30]">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#103D30]">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103D30]">
                  Target Electricity Savings (kWh)
                </label>
                <input
                  type="number"
                  step="10000"
                  required
                  value={goalKwh}
                  onChange={(e) => setGoalKwh(parseInt(e.target.value) || 0)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-[#E3E8DF]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-[#D7E2D3] px-4 py-2.5 text-xs font-semibold text-[#55635B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#176B4D] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#103D30]"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
