'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sun,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Save,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Home,
  Sliders,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { calculateSolarFeasibility, SolarInputs, SolarCalculationResult } from '@/lib/solar-calc'
import { PageHeader } from '@/components/shared/PageHeader'
import { MetricCard } from '@/components/shared/MetricCard'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function SolarAdvisorView() {
  const [district, setDistrict] = useState<string>('Ahmedabad')
  const [monthlyKwh, setMonthlyKwh] = useState<number>(310)
  const [propertyType, setPropertyType] = useState<string>('apartment')
  const [roofAreaSqFt, setRoofAreaSqFt] = useState<number>(450)
  const [roofShadingPercent, setRoofShadingPercent] = useState<number>(10)
  const [overrideCapacity, setOverrideCapacity] = useState<number | null>(null)
  const [isSaved, setIsSaved] = useState<boolean>(false)

  useEffect(() => {
    const user = dataStore.getUser()
    setDistrict(user.district || 'Ahmedabad')
    const readings = dataStore.getReadings()
    if (readings.length > 0) {
      setMonthlyKwh(readings[0].consumptionKwh)
    }
  }, [])

  const inputs: SolarInputs = {
    monthlyKwh,
    roofAreaSqFt,
    roofShadingPercent,
    district,
    propertyType,
  }

  const baseResult: SolarCalculationResult = calculateSolarFeasibility(inputs)
  const activeCapacity = overrideCapacity !== null ? overrideCapacity : baseResult.recommendedCapacityKw

  const annualGeneration = Math.round(activeCapacity * 1450)
  const annualSavings = Math.round(annualGeneration * 6.20)
  const grossCost = Math.round(activeCapacity * 55000)
  let subsidy = 0
  if (activeCapacity >= 3) subsidy = 78000
  else if (activeCapacity >= 2) subsidy = 60000
  else if (activeCapacity >= 1) subsidy = 30000
  const netInvestment = Math.max(10000, grossCost - subsidy)
  const payback = Number((netInvestment / (annualSavings || 1)).toFixed(1))
  const co2Avoided = Math.round(annualGeneration * 0.716)

  const handleSaveAssessment = () => {
    dataStore.saveSolarAssessment({
      userId: dataStore.getUser().id,
      district,
      monthlyKwh,
      roofAreaSqFt,
      roofShadingPercent,
      propertyType,
      recommendedCapacityKw: activeCapacity,
      annualGenerationKwh: annualGeneration,
      annualSavingsInr: annualSavings,
      estimatedCostInr: grossCost,
      estimatedSubsidyInr: subsidy,
      netInvestmentInr: netInvestment,
      paybackYears: payback,
    })
    setIsSaved(true)
  }

  const gujaratDistricts = [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar',
    'Bhavnagar', 'Jamnagar', 'Junagadh', 'Kutch', 'Anand',
    'Bharuch', 'Navsari', 'Mehsana', 'Valsad', 'Morbi'
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gujarat Rooftop Solar Advisor"
        description="Model technical feasibility, estimated power generation, and central DBT capital subsidies under PM Surya Ghar Muft Bijli Yojana & Surya Gujarat."
      />

      {/* Main Grid: Calculator Inputs & Realtime Outputs */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Left Card: Input Parameters with Neumorphism */}
        <div className="rounded-3xl neu-raised p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-[rgba(197,202,208,0.35)] pb-4">
            <Sliders size={18} className="text-[#238B57]" />
            <h3 className="text-base font-extrabold text-[#253247]">Household Rooftop Inputs</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                District in Gujarat
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full appearance-none rounded-2xl neu-input py-2.5 px-4 text-xs font-bold text-[#253247] cursor-pointer"
              >
                {gujaratDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d} District
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-[#253247] mb-1.5">
                <span className="text-[#718096]">Monthly Electricity:</span>
                <span className="text-[#238B57] tabular-nums">{monthlyKwh} kWh</span>
              </div>
              <div className="rounded-2xl neu-inset p-2">
                <input
                  type="range"
                  min="80"
                  max="800"
                  step="10"
                  value={monthlyKwh}
                  onChange={(e) => setMonthlyKwh(parseInt(e.target.value))}
                  className="w-full accent-[#238B57] cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#718096] mt-1">
                <span>80 kWh (Small)</span>
                <span>300 kWh (Avg)</span>
                <span>800 kWh (Large)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                Property Structure
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full appearance-none rounded-2xl neu-input py-2.5 px-4 text-xs font-bold text-[#253247] cursor-pointer"
              >
                <option value="apartment">Apartment Penthouse / Society Terrace</option>
                <option value="individual_bungalow">Individual Bungalow / Villa</option>
                <option value="row_house">Row House</option>
                <option value="rural_home">Rural / Farmhouse</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-[#253247] mb-1.5">
                <span className="text-[#718096]">Usable Roof Area:</span>
                <span className="text-[#238B57] tabular-nums">{roofAreaSqFt} sq ft</span>
              </div>
              <div className="rounded-2xl neu-inset p-2">
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="50"
                  value={roofAreaSqFt}
                  onChange={(e) => setRoofAreaSqFt(parseInt(e.target.value))}
                  className="w-full accent-[#238B57] cursor-pointer"
                />
              </div>
              <span className="text-[11px] text-[#718096] block mt-1">
                Approx 100 sq ft shadow-free area needed per 1 kWp capacity
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-[#253247] mb-1.5">
                <span className="text-[#718096]">Roof Shading / Obstacles:</span>
                <span className="text-[#d97706] tabular-nums">{roofShadingPercent}%</span>
              </div>
              <div className="rounded-2xl neu-inset p-2">
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={roofShadingPercent}
                  onChange={(e) => setRoofShadingPercent(parseInt(e.target.value))}
                  className="w-full accent-[#238B57] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Quick Capacity Scenario Buttons */}
          <div className="pt-3 border-t border-[rgba(197,202,208,0.35)]">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-2.5">
              Compare Capacities:
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {[1, 2, 3, 5].map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => setOverrideCapacity(cap)}
                  className={`rounded-2xl py-2.5 text-xs font-bold transition cursor-pointer ${
                    activeCapacity === cap
                      ? 'neu-inset text-[#238B57]'
                      : 'neu-button text-[#253247]'
                  }`}
                >
                  {cap} kW
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Feasibility Report & Financial Breakdown */}
        <div className="flex flex-col justify-between rounded-3xl neu-raised p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-xl neu-inset-sm px-3 py-1 text-xs font-bold text-[#d97706]">
                <Sun size={14} /> Scenario: {activeCapacity} kW System
              </span>
              <span className="text-xs text-[#718096] font-bold">PM Surya Ghar</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl neu-inset p-5">
              <div>
                <p className="text-[11px] text-[#718096] uppercase font-bold">Estimated Generation</p>
                <p className="mt-1 text-2xl font-extrabold text-[#253247] tabular-nums">
                  {annualGeneration.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-[#718096]">kWh / year</p>
              </div>
              <div>
                <p className="text-[11px] text-[#238B57] uppercase font-bold">Annual Bill Savings</p>
                <p className="mt-1 text-2xl font-extrabold text-[#238B57] tabular-nums">
                  ₹{annualSavings.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-[#718096]">per year on power bill</p>
              </div>
            </div>

            {/* Financial Ledger */}
            <div className="mt-6 space-y-3 text-xs text-[#718096]">
              <div className="flex justify-between border-b border-[rgba(197,202,208,0.35)] pb-2.5">
                <span>Estimated Gross Installation Cost:</span>
                <strong className="text-[#253247] tabular-nums">₹{grossCost.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between border-b border-[rgba(197,202,208,0.35)] pb-2.5 text-[#238B57] font-bold">
                <span>Central DBT Subsidy (PM Surya Ghar):</span>
                <strong className="tabular-nums">− ₹{subsidy.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between border-b border-[rgba(197,202,208,0.35)] pb-2.5 font-extrabold text-[#253247] text-sm">
                <span>Net Citizen Investment:</span>
                <span className="tabular-nums">₹{netInvestment.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-[rgba(197,202,208,0.35)] pb-2.5">
                <span>Estimated Payback Period:</span>
                <strong className="text-[#253247] tabular-nums">{payback} Years</strong>
              </div>
              <div className="flex justify-between text-[#718096]">
                <span>Annual Carbon Mitigated:</span>
                <strong className="text-[#238B57] tabular-nums">{co2Avoided} kg CO₂ / yr</strong>
              </div>
            </div>

            {/* Official portal link & assumptions */}
            <div className="mt-6 rounded-2xl neu-inset-sm p-4 text-[11px] text-[#718096] leading-relaxed space-y-1">
              <p className="font-bold text-[#253247]">Assumptions &amp; GERC Net Metering:</p>
              <p>• Based on average Gujarat solar insolation of 5.2 peak sun hours/day.</p>
              <p>• Direct subsidy credited to citizen bank account linked with consumer number.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[rgba(197,202,208,0.35)]">
            {isSaved ? (
              <div className="flex items-center gap-2 rounded-2xl neu-inset p-3.5 text-xs font-bold text-[#238B57]">
                <CheckCircle2 size={16} /> Solar Assessment saved to your profile! (+50 LiFE Points &amp; Badge Unlocked)
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSaveAssessment}
                className="flex w-full items-center justify-center gap-2 rounded-2xl neu-button-primary py-3.5 text-xs font-bold cursor-pointer"
              >
                <Save size={15} /> Save Assessment to Profile (+50 Pts)
              </button>
            )}

            <a
              href="https://pmsuryaghar.gov.in"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-1.5 text-xs font-bold text-[#718096] hover:text-[#253247]"
            >
              <span>Visit National Portal (pmsuryaghar.gov.in)</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
