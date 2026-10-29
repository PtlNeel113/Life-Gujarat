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
  // If user selected a capacity comparison pill
  const activeCapacity = overrideCapacity !== null ? overrideCapacity : baseResult.recommendedCapacityKw

  // Recalculate tailored metrics for the active capacity
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
        {/* Left Card: Input Parameters */}
        <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#F0F3EC] pb-4">
            <Sliders size={18} className="text-[#176B4D]" />
            <h3 className="text-base font-bold text-[#103D30]">Household Rooftop Inputs</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#103D30]">District in Gujarat</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs font-semibold text-[#103D30] outline-none focus:border-[#176B4D]"
              >
                {gujaratDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d} District
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103D30]">
                Monthly Electricity Consumption: <span className="text-[#176B4D]">{monthlyKwh} kWh</span>
              </label>
              <input
                type="range"
                min="80"
                max="800"
                step="10"
                value={monthlyKwh}
                onChange={(e) => setMonthlyKwh(parseInt(e.target.value))}
                className="mt-2 w-full accent-[#176B4D]"
              />
              <div className="flex justify-between text-[11px] text-[#8E9B92]">
                <span>80 kWh (Small)</span>
                <span>300 kWh (Avg Gujarat)</span>
                <span>800 kWh (Large home)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103D30]">Property Structure</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs font-semibold text-[#103D30] outline-none focus:border-[#176B4D]"
              >
                <option value="apartment">Apartment Penthouse / Society Terrace</option>
                <option value="individual_bungalow">Individual Bungalow / Villa</option>
                <option value="row_house">Row House</option>
                <option value="rural_home">Rural / Farmhouse</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103D30]">
                Usable Roof Area: <span className="text-[#176B4D]">{roofAreaSqFt} sq ft</span>
              </label>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={roofAreaSqFt}
                onChange={(e) => setRoofAreaSqFt(parseInt(e.target.value))}
                className="mt-2 w-full accent-[#176B4D]"
              />
              <span className="text-[11px] text-[#8E9B92]">Approx 100 sq ft shadow-free area needed per 1 kWp capacity</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103D30]">
                Roof Shading / Obstacles: <span className="text-[#176B4D]">{roofShadingPercent}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={roofShadingPercent}
                onChange={(e) => setRoofShadingPercent(parseInt(e.target.value))}
                className="mt-2 w-full accent-[#176B4D]"
              />
            </div>
          </div>

          {/* Quick Capacity Scenario Buttons */}
          <div className="pt-2 border-t border-[#F0F3EC]">
            <label className="block text-xs font-bold text-[#103D30] mb-2">Compare Capacities:</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 5].map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => setOverrideCapacity(cap)}
                  className={`rounded-xl py-2 text-xs font-bold transition ${
                    activeCapacity === cap
                      ? 'bg-[#176B4D] text-white shadow-xs'
                      : 'border border-[#D7E2D3] bg-[#FBFCF8] text-[#103D30] hover:bg-[#EEF4E8]'
                  }`}
                >
                  {cap} kW
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Feasibility Report & Financial Breakdown */}
        <div className="flex flex-col justify-between rounded-3xl bg-[#103D30] p-6 text-white shadow-sm sm:p-8 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#B8E986]">
                <Sun size={14} /> Recommended Scenario: {activeCapacity} kW System
              </span>
              <span className="text-xs text-white/60">PM Surya Ghar Standard</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-4">
              <div>
                <p className="text-[11px] text-[#B8E986] uppercase font-bold">Estimated Generation</p>
                <p className="mt-1 text-2xl font-extrabold">{annualGeneration.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-white/60">kWh / year</p>
              </div>
              <div>
                <p className="text-[11px] text-[#B8E986] uppercase font-bold">Annual Bill Savings</p>
                <p className="mt-1 text-2xl font-extrabold">₹{annualSavings.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-white/60">per year on power bill</p>
              </div>
            </div>

            {/* Financial Ledger */}
            <div className="mt-6 space-y-2.5 text-xs text-white/80">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Estimated Gross Installation Cost:</span>
                <strong className="text-white">₹{grossCost.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2 text-[#B8E986]">
                <span>Central DBT Subsidy (PM Surya Ghar):</span>
                <strong className="font-bold">− ₹{subsidy.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2 font-bold text-white text-sm">
                <span>Net Citizen Investment:</span>
                <span>₹{netInvestment.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Estimated Payback Period:</span>
                <strong className="text-white">{payback} Years</strong>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Annual Carbon Mitigated:</span>
                <strong className="text-[#B8E986]">{co2Avoided} kg CO₂ / yr</strong>
              </div>
            </div>

            {/* Official portal link & assumptions */}
            <div className="mt-5 rounded-2xl bg-white/5 p-4 text-[11px] text-white/70 leading-relaxed space-y-1">
              <p className="font-semibold text-white">Assumptions & GERC Net Metering:</p>
              <p>• Based on average Gujarat solar insolation of 5.2 peak sun hours/day.</p>
              <p>• Direct subsidy credited to citizen bank account linked with consumer number.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            {isSaved ? (
              <div className="flex items-center gap-2 rounded-xl bg-[#B8E986] p-3 text-xs font-bold text-[#103D30]">
                <CheckCircle2 size={16} /> Solar Assessment saved to your profile! (+50 LiFE Points & Badge Unlocked)
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSaveAssessment}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B8E986] py-3 text-xs font-bold text-[#103D30] transition hover:bg-white"
              >
                <Save size={15} /> Save Assessment to Profile (+50 Pts)
              </button>
            )}

            <a
              href="https://pmsuryaghar.gov.in"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white"
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
