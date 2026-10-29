'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Users,
  Zap,
  Leaf,
  CheckCircle2,
  PieChart,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { DistrictImpact } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { MetricCard } from '@/components/shared/MetricCard'

export function AdminAnalyticsView() {
  const [districts, setDistricts] = useState<DistrictImpact[]>([])
  const [period, setPeriod] = useState<'Q2_2026' | 'Q3_2026' | 'All_Time'>('Q3_2026')

  useEffect(() => {
    setDistricts(dataStore.getDistrictImpacts())
  }, [])

  const totalSavedMwh = Math.round(districts.reduce((sum, d) => sum + d.totalKwhSaved, 0) / 1000)
  const totalVerifiedActions = districts.reduce((sum, d) => sum + d.verifiedMissionsCompleted, 0)
  const totalSolarKw = districts.reduce((sum, d) => sum + d.rooftopSolarInstalledKw, 0)

  const monthlyRunRate = [
    { month: 'May 26', mwh: 420 },
    { month: 'Jun 26', mwh: 580 },
    { month: 'Jul 26', mwh: 510 },
    { month: 'Aug 26', mwh: 470 },
    { month: 'Sep 26', mwh: 440 },
    { month: 'Oct 26', mwh: 490 },
  ]

  const maxMwh = 600

  return (
    <div className="space-y-8">
      <PageHeader
        title="Statewide Energy Analytics & Completion Trends"
        description="Detailed analytics on citizen participation curves, Discom avoided demand, and verified emission mitigation."
        action={{
          label: 'Export Analytics Report',
          onClick: () => window.print(),
          icon: <Download size={15} />,
        }}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Consolidated MWh Avoided"
          value={totalSavedMwh.toLocaleString('en-IN')}
          unit="MWh"
          icon={Zap}
          subtext="Statewide grid peak relief"
        />
        <MetricCard
          title="Verified Citizen Missions"
          value={totalVerifiedActions.toLocaleString('en-IN')}
          unit="Actions"
          icon={CheckCircle2}
          subtext="96.4% Evidence Approval Rate"
        />
        <MetricCard
          title="Installed Rooftop Solar"
          value={totalSolarKw.toLocaleString('en-IN')}
          unit="kWp"
          icon={Leaf}
          subtext="Under PM Surya Ghar DBT"
        />
      </div>

      {/* Monthly MWh Avoided Bar Chart */}
      <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0F3EC] pb-4">
          <div>
            <h3 className="text-base font-bold text-[#103D30]">Gujarat Energy Conservation Velocity</h3>
            <p className="text-xs text-[#66736B]">Monthly avoided electricity consumption across residential consumers</p>
          </div>

          <div className="rounded-xl bg-[#F0F4EC] p-1 text-xs font-semibold">
            <span className="bg-white text-[#176B4D] rounded-lg px-3 py-1 shadow-xs inline-block">
              FY 2026-27 Active Cycles
            </span>
          </div>
        </div>

        <div className="mt-8 flex h-52 items-end gap-6 sm:gap-10 border-b border-[#E3E8DF] px-4 pb-2">
          {monthlyRunRate.map((item, idx) => {
            const h = Math.round((item.mwh / maxMwh) * 100)
            return (
              <div key={idx} className="group relative flex flex-1 flex-col items-center">
                <div className="absolute -top-10 hidden rounded-md bg-[#103D30] px-2 py-1 text-[10px] font-bold text-white shadow-md group-hover:block">
                  {item.mwh} MWh
                </div>
                <div
                  className="w-full rounded-t-lg bg-[#CBE3C3] transition group-hover:bg-[#176B4D]"
                  style={{ height: `${h}%` }}
                />
                <span className="mt-2 text-xs font-semibold text-[#66736B]">{item.month}</span>
              </div>
            )
          })}
        </div>

        <div className="flex justify-between items-center text-xs text-[#8E9B92] pt-2">
          <span>Data completeness: <strong>98.7%</strong> across audited billing cycles</span>
          <span>Baseline Model: Central Electricity Authority v19.0 Standard</span>
        </div>
      </div>
    </div>
  )
}
