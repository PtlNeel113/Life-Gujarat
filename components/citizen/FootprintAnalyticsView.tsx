'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Leaf,
  BarChart3,
  HelpCircle,
  TrendingDown,
  Info,
  ShieldCheck,
  CheckCircle2,
  TreeDeciduous,
  Car,
  Zap,
  ArrowRight,
  Sun,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { EnergyReading } from '@/lib/types'
import {
  calculateCarbonFootprint,
  CEA_GRID_EMISSION_FACTOR,
  CEA_FACTOR_VERSION,
} from '@/lib/footprint-calc'
import { PageHeader } from '@/components/shared/PageHeader'
import { MetricCard } from '@/components/shared/MetricCard'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function FootprintAnalyticsView() {
  const [readings, setReadings] = useState<EnergyReading[]>([])
  const [selectedCycleId, setSelectedCycleId] = useState<string>('')
  const [reductionScenario, setReductionScenario] = useState<number>(15)

  useEffect(() => {
    const list = dataStore.getReadings()
    setReadings(list)
    if (list.length > 0) {
      setSelectedCycleId(list[0].id)
    }
  }, [])

  const selectedReading = readings.find((r) => r.id === selectedCycleId) || readings[0]
  const currentKwh = selectedReading ? selectedReading.consumptionKwh : 260
  const footprint = calculateCarbonFootprint(currentKwh)

  // Scenario calculations
  const scenarioSavedKwh = Math.round((currentKwh * reductionScenario) / 100)
  const scenarioFootprint = calculateCarbonFootprint(currentKwh - scenarioSavedKwh)
  const co2AvoidedKg = Number((scenarioSavedKwh * CEA_GRID_EMISSION_FACTOR).toFixed(1))

  // Historical trend of CO2
  const historicalEmissions = readings
    .slice(0, 6)
    .reverse()
    .map((r) => ({
      label: new Date(r.startDate).toLocaleDateString('en-IN', { month: 'short' }),
      kwh: r.consumptionKwh,
      kgCo2: Math.round(r.consumptionKwh * CEA_GRID_EMISSION_FACTOR),
    }))

  const maxKg = Math.max(...historicalEmissions.map((h) => h.kgCo2), 300)

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Carbon Footprint"
        description="Transparent household emissions analytics grounded in official Central Electricity Authority (CEA) emission factors."
        action={{
          label: 'Explore Reduction Missions',
          href: '/missions',
          icon: <Leaf size={15} />,
        }}
      />

      {/* Main Carbon Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Monthly Footprint"
          value={footprint.emissionsKg}
          unit="kg CO₂e"
          icon={Leaf}
          subtext={`Based on ${currentKwh} kWh logged`}
          iconColor="text-[#27AE60]"
          iconBg="bg-[#EAF8EE]"
        />
        <MetricCard
          title="Annualized Run-Rate"
          value={Number((footprint.emissionsTonnes * 12).toFixed(2))}
          unit="Tonnes/yr"
          icon={BarChart3}
          subtext="Annual household pace"
        />
        <MetricCard
          title="Trees Offset Needed"
          value={footprint.treesEquivalentPerYear}
          unit="mature trees"
          icon={TreeDeciduous}
          iconColor="text-[#176B4D]"
          iconBg="bg-[#EEF4E8]"
          subtext="Annual absorption at 22 kg/tree"
        />
        <MetricCard
          title="Petrol Car Distance"
          value={footprint.petrolKmEquivalent}
          unit="km equivalent"
          icon={Car}
          subtext="Standard passenger vehicle km"
        />
      </div>

      {/* Cycle Selector & Formula Breakdown */}
      <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F0F3EC] pb-4">
          <div>
            <h3 className="text-base font-bold text-[#103D30]">Select Billing Cycle to Analyze</h3>
            <p className="text-xs text-[#66736B]">Audited against actual logged power meter readings</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCycleId}
              onChange={(e) => setSelectedCycleId(e.target.value)}
              className="rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] px-3.5 py-2 text-xs font-semibold text-[#103D30] outline-none"
            >
              {readings.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.startDate} to {r.endDate} ({r.consumptionKwh} kWh)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transparent Formula Box */}
        <div className="rounded-2xl bg-[#F6F8F3] p-5 border border-[#E3E8DF]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B4D]">
            <ShieldCheck size={16} /> Official Methodology & Verified Formula
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#103D30]">
            <span className="rounded-lg bg-white px-3 py-1.5 border border-[#D7E2D3]">
              {currentKwh} kWh
            </span>
            <span>×</span>
            <span className="rounded-lg bg-white px-3 py-1.5 border border-[#D7E2D3] text-[#176B4D]">
              {CEA_GRID_EMISSION_FACTOR} kg CO₂/kWh
            </span>
            <span>=</span>
            <span className="rounded-lg bg-[#103D30] text-white px-3 py-1.5">
              {footprint.emissionsKg} kg CO₂e
            </span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[#66736B]">
            Factor Source: <strong>{CEA_FACTOR_VERSION}</strong>. Central Electricity Authority, Ministry of Power,
            Government of India. National weighted average grid emission factor for Western Regional Grid / Indian National Grid.
          </p>
        </div>

        {/* Historical Emission Trend Bars */}
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#103D30]">Historical Monthly Emissions Trend</h4>
            <span className="text-xs text-[#8E9B92]">kg CO₂e per cycle</span>
          </div>

          <div className="mt-6 flex h-48 items-end gap-4 border-b border-[#E3E8DF] px-2 pb-2">
            {historicalEmissions.map((h, idx) => {
              const heightPercent = Math.max(15, Math.round((h.kgCo2 / maxKg) * 100))
              return (
                <div key={idx} className="group relative flex flex-1 flex-col items-center">
                  <div className="absolute -top-10 hidden rounded-md bg-[#103D30] px-2 py-1 text-[10px] font-bold text-white shadow-md group-hover:block">
                    {h.kgCo2} kg ({h.kwh} kWh)
                  </div>
                  <div
                    className="w-full rounded-t-lg bg-[#CBE3C3] transition group-hover:bg-[#176B4D]"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="mt-2 text-[11px] font-semibold text-[#66736B]">{h.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Scenario Comparison Simulator */}
      <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-bold text-[#103D30]">Scenario Comparison: What Could a Shift Achieve?</h3>
        <p className="mt-1 text-xs text-[#66736B]">
          Model the carbon impact of behavioural missions or rooftop solar installation on your current consumption.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-xs font-bold text-[#103D30]">
              Electricity Reduction Target: <span className="text-[#176B4D]">{reductionScenario}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={reductionScenario}
              onChange={(e) => setReductionScenario(parseInt(e.target.value))}
              className="w-full accent-[#176B4D]"
            />
            <div className="flex justify-between text-[11px] text-[#8E9B92]">
              <span>5% (Simple tips)</span>
              <span>20% (BLDC + 24°C AC)</span>
              <span>40% (Major efficiency)</span>
            </div>

            <div className="rounded-2xl bg-[#FBFCF8] p-4 border border-[#E3E8DF] text-xs text-[#66736B] space-y-1">
              <p>
                Target Monthly Energy: <strong className="text-[#103D30]">{currentKwh - scenarioSavedKwh} kWh</strong>
              </p>
              <p>
                Units Saved Monthly: <strong className="text-[#176B4D]">{scenarioSavedKwh} kWh</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-[#103D30] p-6 text-white">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#B8E986]">Projected Carbon Avoided</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold">{co2AvoidedKg}</span>
                <span className="text-sm font-semibold text-white/75">kg CO₂e / month</span>
              </div>
              <p className="mt-2 text-xs text-white/70 leading-relaxed">
                Equivalent to removing a petrol car from Gujarat roads for {Math.round(co2AvoidedKg / 0.192)} km every month.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="text-white/80">New Monthly Footprint:</span>
              <strong className="text-lg text-[#B8E986]">{scenarioFootprint.emissionsKg} kg</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
