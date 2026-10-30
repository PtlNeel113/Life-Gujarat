'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Printer,
  Download,
  Calendar,
  Zap,
  Leaf,
  CheckCircle2,
  Trophy,
  Sun,
  ShieldCheck,
  FileDown,
  Check,
  FileText,
  BadgeCheck,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { EnergyReading, UserProfile, MissionSubmission, SolarAssessment } from '@/lib/types'
import { calculateEnergyStats } from '@/lib/energy-calc'
import { calculateCarbonFootprint, CEA_FACTOR_VERSION, CEA_GRID_EMISSION_FACTOR } from '@/lib/footprint-calc'
import { PageHeader } from '@/components/shared/PageHeader'
import { MetricCard } from '@/components/shared/MetricCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ReportsCo2SavingsChart } from '@/components/citizen/ReportsCo2SavingsChart'
import { ReportsImpactBadges } from '@/components/citizen/ReportsImpactBadges'
import { generatePersonalImpactStatementPdf } from '@/lib/pdf-export'
import { useAuth } from '@/components/providers/AuthProvider'

export function ReportsView() {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<UserProfile>(authUser || dataStore.getUser())
  const [readings, setReadings] = useState<EnergyReading[]>([])
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([])
  const [solar, setSolar] = useState<SolarAssessment | null>(null)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [exportedSuccess, setExportedSuccess] = useState(false)

  useEffect(() => {
    const current = authUser || dataStore.getUser()
    setUser(current)
    setReadings(dataStore.getReadings())
    setSubmissions(dataStore.getUserSubmissions(current.id))
    const assessments = dataStore.getSolarAssessments()
    if (assessments.length > 0) setSolar(assessments[0])
  }, [authUser])

  const stats = calculateEnergyStats(readings, user.householdMembers)
  const footprint = calculateCarbonFootprint(stats.latestKwh)

  const handlePrint = () => {
    window.print()
  }

  const handleExportPdf = () => {
    setIsExportingPdf(true)
    try {
      generatePersonalImpactStatementPdf({
        user,
        readings,
        submissions,
        solar,
        stats,
        footprint,
      })
      setExportedSuccess(true)
      setTimeout(() => setExportedSuccess(false), 3000)
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      setIsExportingPdf(false)
    }
  }

  const exportReportCSV = () => {
    const lines = [
      ['LiFE Gujarat — Official Household Sustainability Statement'],
      ['Citizen Name', user.name],
      ['Consumer Number', user.consumerNumber || '—'],
      ['District', user.district],
      ['Discom Provider', user.discom],
      ['Total Tracked Energy (kWh)', stats.totalTrackedKwh],
      ['Latest Monthly Energy (kWh)', stats.latestKwh],
      ['Estimated CO2e Emissions (kg)', footprint.emissionsKg],
      ['Emissions Factor Applied', CEA_FACTOR_VERSION],
      ['Verified Missions Completed', submissions.filter((s) => s.status === 'approved').length],
      ['Total LiFE Points Ledger Balance', user.points],
      ['Report Generated On', new Date().toISOString()],
    ]

    const csvContent = 'data:text/csv;charset=utf-8,' + lines.map((l) => l.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `LiFE_Gujarat_Statement_${user.id}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 print:p-0 print:space-y-4">
      {/* Non-print Header with actions */}
      <div className="print:hidden">
        <PageHeader
          title="Personal Sustainability Statement"
          description="Official certified citizen statement combining household electricity consumption, verified carbon avoidance under CEA v19.0 factors, and PM Surya Ghar solar feasibility."
          action={{
            label: isExportingPdf ? 'Generating PDF...' : exportedSuccess ? 'PDF Downloaded!' : 'Export PDF Report',
            onClick: handleExportPdf,
            icon: exportedSuccess ? <Check size={15} /> : <FileDown size={15} />,
          }}
          secondaryAction={{
            label: 'Print / Save as PDF',
            onClick: handlePrint,
            icon: <Printer size={15} />,
          }}
        />
      </div>

      {/* Floating Export Action Banner (Visible on screen, hidden on print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#D7E2D3] bg-[#F1F8EE] p-4 text-xs print:hidden">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-xl bg-[#176B4D] text-white">
            <BadgeCheck size={18} />
          </span>
          <div>
            <strong className="text-[#103D30]">Print-Ready Official Certificate Available</strong>
            <p className="text-[#66736B]">
              Formatted for state green society challenges, municipal environmental rebates, and school/college credits.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 rounded-xl bg-[#176B4D] px-3.5 py-2 font-bold text-white shadow-xs transition hover:bg-[#103D30] disabled:opacity-60 cursor-pointer"
          >
            {exportedSuccess ? <Check size={14} /> : <FileDown size={14} />}
            <span>{isExportingPdf ? 'Exporting...' : 'Export Printable PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-[#D7E2D3] bg-white px-3.5 py-2 font-semibold text-[#103D30] transition hover:bg-[#F9FBF8] cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Sheet</span>
          </button>

          <button
            type="button"
            onClick={exportReportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-[#D7E2D3] bg-white px-3.5 py-2 font-semibold text-[#103D30] transition hover:bg-[#F9FBF8] cursor-pointer"
          >
            <Download size={14} />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Official Printable Statement Sheet */}
      <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0 print:space-y-6">
        {/* Certificate / Statement Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#103D30] pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-xl bg-[#B8E986] text-[#176B4D] font-bold">
                <Leaf size={22} fill="currentColor" />
              </span>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-[#103D30]">
                  Government of Gujarat — Mission LiFE
                </h2>
                <p className="text-xs text-[#66736B]">
                  Department of Climate Change · Citizen Impact Certificate & Energy Statement
                </p>
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-[#66736B]">
            <p className="font-mono font-bold text-[#103D30]">
              REF: LIFE-GJ-{(user.id || 'CITIZEN').toUpperCase().slice(0, 14)}
            </p>
            <p className="mt-0.5">
              Issued: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Citizen Information Card */}
        <div className="grid gap-4 rounded-2xl bg-[#F6F8F3] p-5 text-xs sm:grid-cols-4 border border-[#EAEFE5]">
          <div>
            <span className="text-[#8E9B92] block uppercase text-[10px] font-bold">Citizen Name</span>
            <strong className="text-[#103D30] text-sm mt-0.5 block">{user.name}</strong>
          </div>
          <div>
            <span className="text-[#8E9B92] block uppercase text-[10px] font-bold">Location & District</span>
            <strong className="text-[#103D30] text-sm mt-0.5 block">{user.district}, Gujarat</strong>
          </div>
          <div>
            <span className="text-[#8E9B92] block uppercase text-[10px] font-bold">Discom Utility</span>
            <strong className="text-[#103D30] text-sm mt-0.5 block">
              {user.discom} ({user.consumerNumber || '02148/99120'})
            </strong>
          </div>
          <div>
            <span className="text-[#8E9B92] block uppercase text-[10px] font-bold">LiFE Points Tier</span>
            <strong className="text-[#176B4D] text-sm mt-0.5 block">{user.points} Points (Certified)</strong>
          </div>
        </div>

        {/* Core Indicators */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E3E8DF] p-5">
            <span className="text-xs text-[#8E9B92] block uppercase font-bold">Total Electricity Tracked</span>
            <p className="mt-2 text-2xl font-extrabold text-[#103D30]">{stats.totalTrackedKwh} kWh</p>
            <p className="mt-1 text-xs text-[#66736B]">Across {readings.length} verified billing cycles</p>
          </div>

          <div className="rounded-2xl border border-[#E3E8DF] p-5">
            <span className="text-xs text-[#8E9B92] block uppercase font-bold">Latest Monthly Footprint</span>
            <p className="mt-2 text-2xl font-extrabold text-[#27AE60]">{footprint.emissionsKg} kg CO₂e</p>
            <p className="mt-1 text-xs text-[#66736B]">Grounded in CEA v19.0 Grid Factor</p>
          </div>

          <div className="rounded-2xl border border-[#E3E8DF] p-5">
            <span className="text-xs text-[#8E9B92] block uppercase font-bold">Verified Mission Actions</span>
            <p className="mt-2 text-2xl font-extrabold text-[#F39C12]">
              {submissions.filter((s) => s.status === 'approved').length} Completed
            </p>
            <p className="mt-1 text-xs text-[#66736B]">{user.streakDays}-day continuous streak</p>
          </div>
        </div>

        {/* Year-over-Year CO2 Savings Trends & Efficiency Gains (Recharts) */}
        <ReportsCo2SavingsChart readings={readings} />

        {/* Carbon Savings Milestones & Impact Badges */}
        <ReportsImpactBadges
          user={user}
          readings={readings}
          submissions={submissions}
          solar={solar}
        />

        {/* Detailed Energy Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#103D30]">Energy Consumption History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBFCF8] border-b border-[#E3E8DF] text-[11px] font-bold uppercase tracking-wider text-[#8E9B92]">
                <tr>
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Consumption</th>
                  <th className="py-2.5 px-3">Estimated Bill</th>
                  <th className="py-2.5 px-3">Calculated CO₂e</th>
                  <th className="py-2.5 px-3">Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F3EC]">
                {readings.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2.5 px-3 font-semibold text-[#103D30]">
                      {r.startDate} to {r.endDate}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#176B4D]">{r.consumptionKwh} kWh</td>
                    <td className="py-2.5 px-3">₹{r.billAmount || '—'}</td>
                    <td className="py-2.5 px-3">
                      {Math.round(r.consumptionKwh * CEA_GRID_EMISSION_FACTOR)} kg CO₂
                    </td>
                    <td className="py-2.5 px-3 capitalize text-[#66736B] font-semibold">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Solar Status Section */}
        {solar && (
          <div className="rounded-2xl border border-[#E3E8DF] p-5 space-y-2 text-xs bg-[#FBFDF9]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#176B4D]">
              <Sun size={15} /> Rooftop Solar Feasibility Status (PM Surya Ghar)
            </div>
            <p className="text-[#55635B]">
              Assessed on {new Date(solar.createdAt).toLocaleDateString('en-IN')}: Recommended {solar.recommendedCapacityKw} kW system
              capable of generating ~{solar.annualGenerationKwh} kWh/year, reducing household emissions by ~
              {Math.round(solar.annualGenerationKwh * CEA_GRID_EMISSION_FACTOR)} kg CO₂ annually with direct DBT central subsidy eligibility.
            </p>
          </div>
        )}

        {/* Official Footer / Methodology Notice & Digital Verification Stamp */}
        <div className="flex flex-col justify-between gap-6 border-t border-[#E3E8DF] pt-6 sm:flex-row sm:items-center">
          <div className="text-[11px] text-[#8E9B92] leading-relaxed space-y-1 sm:max-w-[70%]">
            <p className="font-semibold text-[#103D30]">Verification & Calculation Standards:</p>
            <p>
              1. Electricity grid baseline emission factors sourced from Central Electricity Authority (CEA) CO2 Baseline Database
              for the Indian Power Sector, User Guide Version 19.0 (0.716 kg CO₂/kWh).
            </p>
            <p>
              2. This digital statement is officially certified under the Mission LiFE Citizen Climate Portal, Government of Gujarat.
            </p>
          </div>

          {/* Official Verification Seal Block */}
          <div className="rounded-2xl border-2 border-[#176B4D] bg-[#F1F8EE] p-4 text-center text-xs text-[#103D30] shrink-0 sm:min-w-[190px]">
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#176B4D]">
              OFFICIALLY CERTIFIED
            </span>
            <span className="mt-1 block font-bold text-xs">Mission LiFE Directorate</span>
            <span className="text-[10px] text-[#66736B] block">Climate Change Dept, Gujarat</span>
            <span className="mt-2 block font-mono text-[9px] text-[#8E9B92]">
              HASH: LIFE-GJ-{user.id.toUpperCase().slice(0, 8)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
