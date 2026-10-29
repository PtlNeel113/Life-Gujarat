'use client'

import React, { useState } from 'react'
import {
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Printer,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'

export function AdminReportsView() {
  const [reportType, setReportType] = useState('quarterly_compliance')
  const [generated, setGenerated] = useState(false)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    setGenerated(true)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Directorate Programme Reports"
        description="Generate official Mission LiFE compliance, energy audit, and carbon mitigation certificates for ministerial presentation."
      />

      <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-[#103D30]">Generate Report Dossier</h3>

        <form onSubmit={handleGenerate} className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold text-[#103D30]">Report Model</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs font-semibold text-[#103D30] outline-none"
            >
              <option value="quarterly_compliance">Quarterly State LiFE Compliance</option>
              <option value="district_energy_audit">33 District Energy Audit Dossier</option>
              <option value="solar_dbt_summary">PM Surya Ghar DBT Reconciliation</option>
              <option value="community_leaderboard">Urban Collective Standings</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#103D30]">Reporting Cycle</label>
            <select className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs font-semibold text-[#103D30] outline-none">
              <option>FY 2026-27 (Q2 Summer-Monsoon)</option>
              <option>FY 2026-27 (Q1 Spring)</option>
              <option>Full Year 2025-26</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-[#176B4D] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#103D30] transition"
            >
              Compile Official Report
            </button>
          </div>
        </form>

        {generated && (
          <div className="mt-6 rounded-2xl border border-[#CBE3C3] bg-[#F7FAF4] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#103D30] text-sm">
                Report Compiled: {reportType.replace(/_/g, ' ').toUpperCase()}
              </span>
              <span className="text-xs font-bold text-[#176B4D]">Status: Certified</span>
            </div>
            <p className="text-xs text-[#66736B]">
              Aggregated across 33 Gujarat districts, 5 Discom utilities, and 50,000+ participating households.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#176B4D] px-4 py-2 text-xs font-bold text-white hover:bg-[#103D30]"
              >
                <Printer size={13} /> Print Certified Dossier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
