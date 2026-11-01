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

      {/* Main Carbon Overview Cards in Soft UI Elevation */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Monthly Footprint"
          value={footprint.emissionsKg}
          unit="kg CO₂e"
          icon={Leaf}
          subtext={`Based on ${currentKwh} kWh logged`}
          iconColor="text-[#238B57]"
          iconBg="neu-inset-sm"
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
          iconColor="text-[#238B57]"
          iconBg="neu-inset-sm"
          subtext="Annual absorption at 22 kg/tree"
        />
        <MetricCard
          title="Petrol Car Distance"
          value={footprint.petrolKmEquivalent}
          unit="km eq."
          icon={Car}
          subtext="Standard passenger vehicle km"
        />
      </div>

      {/* Cycle Selector & Formula Breakdown */}
      <div className="rounded-3xl neu-raised p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(197,202,208,0.35)] pb-4">
          <div>
            <h3 className="text-base font-extrabold text-[#253247]">Select Billing Cycle to Analyze</h3>
            <p className="text-xs text-[#718096]">Audited against actual logged power meter readings</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCycleId}
              onChange={(e) => setSelectedCycleId(e.target.value)}
              className="appearance-none rounded-2xl neu-input py-2.5 px-4 text-xs font-bold text-[#253247] cursor-pointer"
            >
              {readings.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.startDate} to {r.endDate} ({r.consumptionKwh} kWh)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transparent Formula Box with Soft Inset */}
        <div className="rounded-2xl neu-inset p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#238B57]">
            <ShieldCheck size={16} /> Official Methodology &amp; Verified Formula
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2.5 text-sm font-bold text-[#253247]">
            <span className="rounded-xl neu-raised px-3.5 py-1.5 tabular-nums">
              {currentKwh} kWh
            </span>
            <span className="text-[#718096]">×</span>
            <span className="rounded-xl neu-raised px-3.5 py-1.5 text-[#238B57] tabular-nums">
              {CEA_GRID_EMISSION_FACTOR} kg CO₂/kWh
            </span>
            <span className="text-[#718096]">=</span>
            <span className="rounded-xl neu-inset-sm text-[#238B57] px-4 py-1.5 font-extrabold tabular-nums">
              {footprint.emissionsKg} kg CO₂e
            </span>
          </div>

          <p className="mt-3.5 text-xs leading-relaxed text-[#718096]">
            Factor Source: <strong>{CEA_FACTOR_VERSION}</strong>. Central Electricity Authority, Ministry of Power,
            Government of India. National weighted average grid emission factor for Western Regional Grid / Indian National Grid.
          </p>
        </div>

        {/* Historical Emission Trend Bars */}
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-[#253247]">Historical Monthly Emissions Trend</h4>
            <span className="text-xs text-[#718096]">kg CO₂e per cycle</span>
          </div>

          <div className="mt-6 flex h-48 items-end gap-4 border-b border-[rgba(197,202,208,0.35)] px-2 pb-2">
            {historicalEmissions.map((h, idx) => {
              const heightPercent = Math.max(18, Math.min(100, Math.round((h.kgCo2 / maxKg) * 100)))
              return (
                <div key={idx} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                  <div className="pointer-events-none absolute -top-12 z-20 hidden rounded-xl neu-raised p-1.5 text-[10px] font-bold text-[#253247] shadow-md group-hover:flex">
                    {h.kgCo2} kg ({h.kwh} kWh)
                  </div>
                  <div className="relative flex h-36 w-full items-end justify-center">
                    <div
                      className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-[#65B98A] to-[#238B57] shadow-sm transition-all duration-300 group-hover:from-[#238B57] group-hover:to-[#176B4D]"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="mt-2 text-[11px] font-bold text-[#718096] shrink-0">{h.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Scenario Comparison Simulator */}
      <div className="rounded-3xl neu-raised p-6 sm:p-8">
        <h3 className="text-base font-extrabold text-[#253247]">Scenario Comparison: What Could a Shift Achieve?</h3>
        <p className="mt-1 text-xs text-[#718096]">
          Model the carbon impact of behavioural missions or rooftop solar installation on your current consumption.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-[#253247]">
              <span>Electricity Reduction Target:</span>
              <span className="text-base font-extrabold text-[#238B57]">−{reductionScenario}%</span>
            </div>
            <div className="rounded-2xl neu-inset p-2">
              <input
                type="range"
                min="5"
                max="40"
                step="5"
                value={reductionScenario}
                onChange={(e) => setReductionScenario(parseInt(e.target.value))}
                className="w-full accent-[#238B57] cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#718096]">
              <span>5% (Simple tips)</span>
              <span>20% (BLDC + 24°C AC)</span>
              <span>40% (Major efficiency)</span>
            </div>

            <div className="rounded-2xl neu-inset p-4 text-xs text-[#718096] space-y-1.5">
              <p>
                Target Monthly Energy: <strong className="text-[#253247] tabular-nums">{currentKwh - scenarioSavedKwh} kWh</strong>
              </p>
              <p>
                Units Saved Monthly: <strong className="text-[#238B57] tabular-nums">{scenarioSavedKwh} kWh</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl neu-inset p-6 sm:p-8">
            <div>
              <p className="text-xs uppercase font-extrabold tracking-wider text-[#238B57]">Projected Carbon Avoided</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#238B57] tabular-nums">{co2AvoidedKg}</span>
                <span className="text-xs font-bold text-[#718096]">kg CO₂e / month</span>
              </div>
              <p className="mt-2 text-xs text-[#718096] leading-relaxed">
                Equivalent to removing a petrol car from Gujarat roads for {Math.round(co2AvoidedKg / 0.192)} km every month.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[rgba(197,202,208,0.35)] flex justify-between items-center text-xs">
              <span className="text-[#718096]">New Monthly Footprint:</span>
              <strong className="text-lg font-extrabold text-[#238B57] tabular-nums">{scenarioFootprint.emissionsKg} kg</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
