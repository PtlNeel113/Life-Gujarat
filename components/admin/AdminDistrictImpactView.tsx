'use client'

import React, { useState, useEffect } from 'react'
import {
  MapPin,
  Search,
  Download,
  Zap,
  Leaf,
  Sun,
  Users,
  ShieldCheck,
  ArrowUpDown,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { DistrictImpact } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { MetricCard } from '@/components/shared/MetricCard'

export function AdminDistrictImpactView() {
  const [districts, setDistricts] = useState<DistrictImpact[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<'totalKwhSaved' | 'householdsEnrolled'>('totalKwhSaved')

  useEffect(() => {
    setDistricts(dataStore.getDistrictImpacts())
  }, [])

  const filtered = districts
    .filter((d) => d.district.toLowerCase().includes(searchQuery.toLowerCase()) || d.primaryDiscom.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b[sortField] - a[sortField])

  const exportDistrictCSV = () => {
    const headers = ['District', 'Enrolled Households', 'Verified Missions', 'Electricity Saved (kWh)', 'CO2 Avoided (Tonnes)', 'Rooftop Solar (kW)', 'Primary Discom']
    const rows = districts.map((d) => [
      d.district,
      d.householdsEnrolled,
      d.verifiedMissionsCompleted,
      d.totalKwhSaved,
      d.totalCo2AvoidedTonnes,
      d.rooftopSolarInstalledKw,
      `"${d.primaryDiscom}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encoded = encodeURI(csvContent)
    const a = document.createElement('a')
    a.href = encoded
    a.download = `Gujarat_District_Impact_Statement_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gujarat 33 Districts — Geographic Carbon & Energy Impact"
        description="Territorial breakdown of verified Mission LiFE participation, household energy savings, and solar adoption across all 33 administrative districts of Gujarat."
        action={{
          label: 'Export District Ledger (CSV)',
          onClick: exportDistrictCSV,
          icon: <Download size={15} />,
        }}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E3E8DF] bg-white p-4 shadow-sm sm:p-5">
        <div className="relative min-w-[260px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9B92]" />
          <input
            type="text"
            placeholder="Search districts (e.g. Surat, Kutch, Gandhinagar)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] py-2 pl-9 pr-3 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-[#8E9B92]">Sort by:</span>
          <button
            onClick={() => setSortField('totalKwhSaved')}
            className={`rounded-lg px-3 py-1 transition ${
              sortField === 'totalKwhSaved' ? 'bg-[#176B4D] text-white' : 'bg-[#F0F4EC] text-[#66736B]'
            }`}
          >
            Energy Saved
          </button>
          <button
            onClick={() => setSortField('householdsEnrolled')}
            className={`rounded-lg px-3 py-1 transition ${
              sortField === 'householdsEnrolled' ? 'bg-[#176B4D] text-white' : 'bg-[#F0F4EC] text-[#66736B]'
            }`}
          >
            Enrolled Homes
          </button>
        </div>
      </div>

      {/* District Table */}
      <div className="rounded-3xl border border-[#E3E8DF] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFCF8] border-b border-[#E3E8DF] text-[11px] font-bold uppercase tracking-wider text-[#8E9B92]">
              <tr>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Primary Discom</th>
                <th className="py-3.5 px-4">Enrolled Homes</th>
                <th className="py-3.5 px-4">Energy Saved</th>
                <th className="py-3.5 px-4">CO₂e Avoided</th>
                <th className="py-3.5 px-4 text-right">Rooftop Solar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F3EC]">
              {filtered.map((d) => (
                <tr key={d.district} className="hover:bg-[#F9FAF6] transition">
                  <td className="py-3.5 px-4 font-bold text-[#103D30] flex items-center gap-2">
                    <MapPin size={14} className="text-[#176B4D]" />
                    <span>{d.district}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#66736B]">{d.primaryDiscom}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#103D30]">
                    {d.householdsEnrolled.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#176B4D]">
                    {(d.totalKwhSaved / 1000).toFixed(1)} MWh
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#27AE60]">
                    {d.totalCo2AvoidedTonnes.toFixed(1)} Tonnes
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#D35400]">
                    {d.rooftopSolarInstalledKw.toLocaleString('en-IN')} kW
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
