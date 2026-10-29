'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Layers,
  Users,
  CheckCircle2,
  Zap,
  Leaf,
  Sun,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  MapPin,
  ClipboardList,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { DistrictImpact, MissionSubmission } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { MetricCard } from '@/components/shared/MetricCard'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function AdminDashboardView() {
  const [districts, setDistricts] = useState<DistrictImpact[]>([])
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([])

  useEffect(() => {
    setDistricts(dataStore.getDistrictImpacts())
    setSubmissions(dataStore.getSubmissions())
  }, [])

  const totalHouseholds = districts.reduce((acc, d) => acc + d.householdsEnrolled, 0)
  const totalVerifiedMissions = districts.reduce((acc, d) => acc + d.verifiedMissionsCompleted, 0)
  const totalMwhSaved = Math.round(districts.reduce((acc, d) => acc + d.totalKwhSaved, 0) / 1000)
  const totalCo2Mitigated = Math.round(districts.reduce((acc, d) => acc + d.totalCo2AvoidedTonnes, 0))
  const pendingEvidence = submissions.filter((s) => s.status === 'pending').length

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gujarat Mission LiFE Directorate — Programme Overview"
        description="Statewide operational command center monitoring citizen engagement, verified electricity conservation, and district-level carbon mitigation."
        action={{
          label: `Evidence Desk (${pendingEvidence} Pending)`,
          href: '/admin/evidence',
          icon: <CheckCircle2 size={15} />,
        }}
      />

      {/* Aggregate Directorate Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Enrolled Citizens"
          value={totalHouseholds.toLocaleString('en-IN')}
          unit="Households"
          icon={Users}
          subtext="Active across all 33 districts"
          href="/admin/users"
        />

        <MetricCard
          title="Verified Actions"
          value={totalVerifiedMissions.toLocaleString('en-IN')}
          unit="Missions"
          icon={CheckCircle2}
          subtext={`${pendingEvidence} pending review`}
          iconColor="text-[#27AE60]"
          iconBg="bg-[#EAF8EE]"
          href="/admin/evidence"
        />

        <MetricCard
          title="Consolidated Savings"
          value={totalMwhSaved.toLocaleString('en-IN')}
          unit="MWh Saved"
          icon={Zap}
          subtext="Discom avoided grid load"
          href="/admin/analytics"
        />

        <MetricCard
          title="CO₂e Mitigated"
          value={totalCo2Mitigated.toLocaleString('en-IN')}
          unit="Metric Tonnes"
          icon={Leaf}
          subtext="Central CEA v19.0 Standard"
          iconColor="text-[#176B4D]"
          iconBg="bg-[#EEF4E8]"
          href="/admin/district-impact"
        />
      </div>

      {/* District Performance Summary & Recent Submissions */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Top 5 Districts by Energy Conservation */}
        <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between border-b border-[#F0F3EC] pb-4">
            <div>
              <h3 className="text-base font-bold text-[#103D30]">Leading District Impact</h3>
              <p className="text-xs text-[#66736B]">Aggregated verified energy conservation</p>
            </div>
            <Link
              href="/admin/district-impact"
              className="text-xs font-bold text-[#176B4D] hover:underline"
            >
              All 33 Districts →
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {districts.slice(0, 5).map((d, idx) => (
              <div
                key={d.district}
                className="flex items-center justify-between rounded-2xl bg-[#FBFCF8] p-4 text-xs border border-[#F0F3EC]"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-6 place-items-center rounded-full bg-[#176B4D] text-white font-bold text-[11px]">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-[#103D30]">{d.district}</h4>
                    <span className="text-[10px] text-[#8E9B92]">{d.primaryDiscom}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-extrabold text-[#176B4D]">
                    {(d.totalKwhSaved / 1000).toFixed(1)} MWh
                  </p>
                  <p className="text-[10px] text-[#8E9B92]">
                    {d.householdsEnrolled.toLocaleString('en-IN')} homes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Verification Alert Box */}
        <div className="flex flex-col justify-between rounded-3xl bg-[#103D30] p-6 text-white shadow-sm sm:p-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B8E986]">
              <ShieldCheck size={16} /> Verification Queue
            </div>
            <h3 className="mt-3 text-xl font-bold leading-snug">Citizen Submissions Awaiting Audit</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/75">
              Citizens submit photo declarations for 24°C AC set-points, filter cleaning, and waste segregation.
              Authorized review is required before points deposit into public ledgers.
            </p>

            <div className="mt-6 rounded-2xl bg-white/10 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Pending Reviews:</span>
                <strong className="text-[#B8E986] font-bold">{pendingEvidence} items</strong>
              </div>
              <div className="flex justify-between">
                <span>Avg Processing Time:</span>
                <span className="text-white">4.2 hours</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/admin/evidence"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B8E986] py-3 text-xs font-bold text-[#103D30] transition hover:bg-white"
            >
              Open Verification Desk <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
