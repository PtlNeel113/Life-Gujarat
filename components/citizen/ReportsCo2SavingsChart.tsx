'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'
import {
  TrendingDown,
  TrendingUp,
  Leaf,
  Zap,
  TreeDeciduous,
  IndianRupee,
  Layers,
  BarChart2,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react'
import { EnergyReading } from '@/lib/types'
import { CEA_GRID_EMISSION_FACTOR } from '@/lib/footprint-calc'

interface ReportsCo2SavingsChartProps {
  readings?: EnergyReading[]
  className?: string
}

interface MonthlyDataPoint {
  month: string
  fullMonth: string
  year: number
  prevYearKwh: number
  currYearKwh: number
  prevYearCo2: number
  currYearCo2: number
  co2SavedKg: number
  efficiencyGainPercent: number
  billSavingsInr: number
  cumulativeCo2SavedKg: number
  lifeActionTag: string
  isTracked: boolean
}

// Baseline previous year (2025) and standard year comparison defaults for Gujarat households
const DEFAULT_BASELINE_MONTHS = [
  { month: 'Jan', fullMonth: 'January', prevKwh: 310, currKwh: 245, tag: 'LED Lighting & Solar Water Geyser' },
  { month: 'Feb', fullMonth: 'February', prevKwh: 295, currKwh: 230, tag: 'Standby Power Elimination' },
  { month: 'Mar', fullMonth: 'March', prevKwh: 360, currKwh: 280, tag: 'BLDC Energy-Saving Fans' },
  { month: 'Apr', fullMonth: 'April', prevKwh: 430, currKwh: 335, tag: 'Natural Ventilation & Shading' },
  { month: 'May', fullMonth: 'May', prevKwh: 510, currKwh: 390, tag: 'AC 24°C Thermostat Standard' },
  { month: 'Jun', fullMonth: 'June', prevKwh: 460, currKwh: 345, tag: 'AC Timer & Fan Combo Operation' },
  { month: 'Jul', fullMonth: 'July', prevKwh: 410, currKwh: 310, tag: 'Monsoon Dehumidification Mode' },
  { month: 'Aug', fullMonth: 'August', prevKwh: 375, currKwh: 285, tag: 'Smart Plug Management' },
  { month: 'Sep', fullMonth: 'September', prevKwh: 345, currKwh: 260, tag: 'Appliance Maintenance & Filter Cleaning' },
  { month: 'Oct', fullMonth: 'October', prevKwh: 320, currKwh: 240, tag: 'BEE 5-Star Refrigerator Upgrade' },
  { month: 'Nov', fullMonth: 'November', prevKwh: 290, currKwh: 225, tag: 'Cool Roof Reflective Coating' },
  { month: 'Dec', fullMonth: 'December', prevKwh: 305, currKwh: 235, tag: 'LiFE Winter Energy Habit' },
]

export function ReportsCo2SavingsChart({ readings = [], className = '' }: ReportsCo2SavingsChartProps) {
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<'comparison' | 'abatement' | 'cumulative'>('comparison')
  const [timeRange, setTimeRange] = useState<'tracked' | 'annual'>('tracked')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Process data combining user readings with historical baseline
  const processedData = useMemo(() => {
    // Map existing readings by month if any
    const readingMap = new Map<string, number>()
    readings.forEach((r) => {
      if (r.startDate) {
        const d = new Date(r.startDate)
        const monthShort = d.toLocaleDateString('en-US', { month: 'short' })
        readingMap.set(monthShort, r.consumptionKwh)
      }
    })

    let runningCumulativeSaved = 0

    const fullYearData: MonthlyDataPoint[] = DEFAULT_BASELINE_MONTHS.map((base) => {
      const isActual = readingMap.has(base.month)
      const currKwh = isActual ? (readingMap.get(base.month) as number) : base.currKwh
      const prevKwh = base.prevKwh

      const prevYearCo2 = Number((prevKwh * CEA_GRID_EMISSION_FACTOR).toFixed(1))
      const currYearCo2 = Number((currKwh * CEA_GRID_EMISSION_FACTOR).toFixed(1))
      const co2SavedKg = Number((prevYearCo2 - currYearCo2).toFixed(1))
      const efficiencyGainPercent = Number((((prevKwh - currKwh) / prevKwh) * 100).toFixed(1))
      const billSavingsInr = Math.round((prevKwh - currKwh) * 7.15) // Gujarat avg residential tariff ~₹7.15/kWh

      runningCumulativeSaved += Math.max(0, co2SavedKg)

      return {
        month: base.month,
        fullMonth: base.fullMonth,
        year: 2026,
        prevYearKwh: prevKwh,
        currYearKwh: currKwh,
        prevYearCo2,
        currYearCo2,
        co2SavedKg,
        efficiencyGainPercent,
        billSavingsInr,
        cumulativeCo2SavedKg: Number(runningCumulativeSaved.toFixed(1)),
        lifeActionTag: base.tag,
        isTracked: isActual || ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].includes(base.month),
      }
    })

    if (timeRange === 'tracked') {
      // Focus on active 6-month verification cycle (May to Oct)
      const subset = fullYearData.filter((d) => ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].includes(d.month))
      // Recalculate cumulative for the subset view
      let subsetCumulative = 0
      return subset.map((d) => {
        subsetCumulative += d.co2SavedKg
        return {
          ...d,
          cumulativeCo2SavedKg: Number(subsetCumulative.toFixed(1)),
        }
      })
    }

    return fullYearData
  }, [readings, timeRange])

  // Summary Metrics calculations
  const totalPrevCo2 = useMemo(
    () => processedData.reduce((acc, curr) => acc + curr.prevYearCo2, 0),
    [processedData]
  )
  const totalCurrCo2 = useMemo(
    () => processedData.reduce((acc, curr) => acc + curr.currYearCo2, 0),
    [processedData]
  )
  const totalCo2Saved = useMemo(
    () => Number((totalPrevCo2 - totalCurrCo2).toFixed(1)),
    [totalPrevCo2, totalCurrCo2]
  )
  const avgEfficiencyGain = useMemo(() => {
    if (totalPrevCo2 === 0) return 0
    return Number((((totalPrevCo2 - totalCurrCo2) / totalPrevCo2) * 100).toFixed(1))
  }, [totalPrevCo2, totalCurrCo2])

  const totalBillSaved = useMemo(
    () => processedData.reduce((acc, curr) => acc + curr.billSavingsInr, 0),
    [processedData]
  )
  const treesEquivalent = useMemo(
    () => Number((totalCo2Saved / 22).toFixed(1)), // 1 mature tree absorbs ~22kg CO2/yr
    [totalCo2Saved]
  )

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-[#E3E8DF] bg-white p-6 shadow-sm">
        <div className="h-64 animate-pulse rounded-xl bg-[#F6F8F3]" />
      </div>
    )
  }

  return (
    <div className={`space-y-6 rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8 print:border-none print:p-0 print:shadow-none ${className}`}>
      {/* Component Header & Controls */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#F0F3EC] pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-[#E5F1DF] text-[#176B4D]">
              <TrendingDown size={18} />
            </span>
            <h3 className="text-lg font-bold tracking-tight text-[#103D30]">
              Year-over-Year CO₂ Savings & Efficiency Trends
            </h3>
          </div>
          <p className="mt-1 text-xs text-[#66736B]">
            Monthly emissions comparison against 2025 baseline under Central Electricity Authority (CEA) standard factor (0.716 kg CO₂/kWh).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {/* Time range selector */}
          <div className="inline-flex rounded-xl bg-[#F4F6F1] p-1 text-xs font-medium text-[#66736B]">
            <button
              type="button"
              onClick={() => setTimeRange('tracked')}
              className={`rounded-lg px-3 py-1.5 transition ${
                timeRange === 'tracked'
                  ? 'bg-white font-bold text-[#103D30] shadow-xs'
                  : 'hover:text-[#103D30]'
              }`}
            >
              Verified Cycles (6M)
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('annual')}
              className={`rounded-lg px-3 py-1.5 transition ${
                timeRange === 'annual'
                  ? 'bg-white font-bold text-[#103D30] shadow-xs'
                  : 'hover:text-[#103D30]'
              }`}
            >
              Full Year (12M)
            </button>
          </div>

          {/* View Mode Selector */}
          <div className="inline-flex rounded-xl bg-[#F4F6F1] p-1 text-xs font-medium text-[#66736B]">
            <button
              type="button"
              onClick={() => setViewMode('comparison')}
              title="Dual monthly comparison with efficiency gain %"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                viewMode === 'comparison'
                  ? 'bg-white font-bold text-[#103D30] shadow-xs'
                  : 'hover:text-[#103D30]'
              }`}
            >
              <BarChart2 size={13} />
              <span>Comparison</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('abatement')}
              title="Monthly net CO2 abated"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                viewMode === 'abatement'
                  ? 'bg-white font-bold text-[#103D30] shadow-xs'
                  : 'hover:text-[#103D30]'
              }`}
            >
              <Leaf size={13} />
              <span>Net Savings</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cumulative')}
              title="Compounding cumulative carbon reduction"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                viewMode === 'cumulative'
                  ? 'bg-white font-bold text-[#103D30] shadow-xs'
                  : 'hover:text-[#103D30]'
              }`}
            >
              <Layers size={13} />
              <span>Cumulative</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Impact Stat Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-[#E3E8DF] bg-[#FBFDF9] p-4">
          <div className="flex items-center justify-between text-[#8E9B92]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total CO₂ Abated</span>
            <Leaf size={15} className="text-[#27AE60]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-[#176B4D]">
              {totalCo2Saved > 0 ? `-${totalCo2Saved}` : '0'}
            </span>
            <span className="text-xs font-semibold text-[#66736B]">kg CO₂e</span>
          </div>
          <p className="mt-1 text-[11px] text-[#27AE60] font-medium flex items-center gap-1">
            <TrendingDown size={12} /> Avoided from Gujarat grid
          </p>
        </div>

        <div className="rounded-2xl border border-[#E3E8DF] bg-[#FBFDF9] p-4">
          <div className="flex items-center justify-between text-[#8E9B92]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Efficiency Gain</span>
            <Zap size={15} className="text-[#F39C12]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-[#103D30]">+{avgEfficiencyGain}%</span>
            <span className="text-xs font-semibold text-[#66736B]">gain</span>
          </div>
          <p className="mt-1 text-[11px] text-[#176B4D] font-medium flex items-center gap-1">
            <TrendingUp size={12} /> Lower kWh per month
          </p>
        </div>

        <div className="rounded-2xl border border-[#E3E8DF] bg-[#FBFDF9] p-4">
          <div className="flex items-center justify-between text-[#8E9B92]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tree Absorption Eq.</span>
            <TreeDeciduous size={15} className="text-[#176B4D]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-[#103D30]">{treesEquivalent}</span>
            <span className="text-xs font-semibold text-[#66736B]">Trees / yr</span>
          </div>
          <p className="mt-1 text-[11px] text-[#66736B]">Based on 22kg/tree standard</p>
        </div>

        <div className="rounded-2xl border border-[#E3E8DF] bg-[#FBFDF9] p-4">
          <div className="flex items-center justify-between text-[#8E9B92]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Household Bill Saved</span>
            <IndianRupee size={15} className="text-[#103D30]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-[#103D30]">₹{totalBillSaved.toLocaleString('en-IN')}</span>
          </div>
          <p className="mt-1 text-[11px] text-[#66736B]">Across evaluated period</p>
        </div>
      </div>

      {/* Main Interactive Recharts Canvas */}
      <div className="relative rounded-2xl border border-[#E3E8DF] bg-[#FCFDFB] p-4 pt-6 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-[#176B4D]" />
            <span className="font-bold text-[#103D30]">
              {viewMode === 'comparison' && 'Emissions Footprint: 2025 Baseline vs 2026 (kg CO₂e) + Efficiency Gain (%)'}
              {viewMode === 'abatement' && 'Monthly Avoided CO₂ Emissions (kg CO₂e Net Reductions)'}
              {viewMode === 'cumulative' && 'Cumulative Avoided Carbon Footprint (kg CO₂e Trajectory)'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#66736B]">
            {viewMode === 'comparison' && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded-xs bg-[#CBD5E1]" /> 2025 Baseline
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded-xs bg-[#176B4D]" /> 2026 Current
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-[#F39C12]">
                  <span className="inline-block size-2 rounded-full bg-[#F39C12]" /> Efficiency Gain %
                </span>
              </>
            )}
            {viewMode === 'abatement' && (
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-xs bg-[#27AE60]" /> Monthly Net Avoided CO₂ (kg)
              </span>
            )}
            {viewMode === 'cumulative' && (
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-xs bg-[#176B4D]" /> Cumulative Saved CO₂ (kg)
              </span>
            )}
          </div>
        </div>

        {/* Chart Rendering */}
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'comparison' ? (
              <ComposedChart
                data={processedData}
                margin={{ top: 20, right: 25, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEFE5" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#D9E2D5' }}
                  tick={{ fill: '#66736B', fontSize: 12, fontWeight: 500 }}
                />
                {/* Left Y Axis for CO2 (kg) */}
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={{ stroke: '#D9E2D5' }}
                  tick={{ fill: '#66736B', fontSize: 11 }}
                  unit=" kg"
                />
                {/* Right Y Axis for Efficiency Gain % */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#F39C12', fontSize: 11, fontWeight: 600 }}
                  unit="%"
                  domain={[0, 45]}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* 2025 Baseline Bar */}
                <Bar
                  yAxisId="left"
                  dataKey="prevYearCo2"
                  name="2025 Baseline"
                  fill="#CBD5E1"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                {/* 2026 Current Bar */}
                <Bar
                  yAxisId="left"
                  dataKey="currYearCo2"
                  name="2026 Current"
                  fill="#176B4D"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                {/* Efficiency Gain Line */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="efficiencyGainPercent"
                  name="Efficiency Gain %"
                  stroke="#F39C12"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#F39C12', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, stroke: '#103D30', strokeWidth: 2 }}
                />
              </ComposedChart>
            ) : viewMode === 'abatement' ? (
              <AreaChart
                data={processedData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="co2SavingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#27AE60" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#27AE60" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEFE5" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#D9E2D5' }}
                  tick={{ fill: '#66736B', fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: '#D9E2D5' }}
                  tick={{ fill: '#66736B', fontSize: 11 }}
                  unit=" kg"
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#CBD5E1" />
                <Area
                  type="monotone"
                  dataKey="co2SavedKg"
                  name="Net CO₂ Saved"
                  stroke="#27AE60"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#co2SavingsGradient)"
                  dot={{ r: 4, fill: '#27AE60', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, stroke: '#103D30', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : (
              <AreaChart
                data={processedData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#176B4D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#176B4D" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEFE5" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#D9E2D5' }}
                  tick={{ fill: '#66736B', fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: '#D9E2D5' }}
                  tick={{ fill: '#66736B', fontSize: 11 }}
                  unit=" kg"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cumulativeCo2SavedKg"
                  name="Cumulative Avoided CO₂"
                  stroke="#176B4D"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#cumulativeGradient)"
                  dot={{ r: 4, fill: '#176B4D', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, stroke: '#B8E986', strokeWidth: 2 }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explanatory Context Footer */}
      <div className="flex flex-col gap-3 rounded-2xl bg-[#F6F8F3] p-4 text-xs text-[#55635B] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <Info size={16} className="mt-0.5 shrink-0 text-[#176B4D]" />
          <div>
            <strong className="text-[#103D30]">Efficiency Drivers Observed: </strong>
            Peak savings occurred in summer months (May–June) when shifting AC thermostat to 24°C BEE standard abated ~85 kg CO₂/mo, followed by ceiling fan BLDC retrofits and vampire standby power elimination.
          </div>
        </div>
        <div className="shrink-0 text-[11px] font-semibold text-[#176B4D]">
          Verified against CEA v19.0 Grid Factor (0.716 kg/kWh)
        </div>
      </div>
    </div>
  )
}

/**
 * Custom Rich Tooltip for Recharts
 */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data: MonthlyDataPoint = payload[0].payload
    return (
      <div className="rounded-2xl border border-[#D9E2D5] bg-[#103D30] p-4 text-xs text-white shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-2">
          <span className="font-extrabold tracking-wide text-white">
            {data.fullMonth} 2026 vs 2025
          </span>
          <span className="rounded-full bg-[#B8E986] px-2 py-0.5 text-[10px] font-bold text-[#103D30]">
            +{data.efficiencyGainPercent}% Efficient
          </span>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between gap-6">
            <span className="text-[#9DB3A6]">2025 Baseline Footprint:</span>
            <span className="font-semibold text-white">
              {data.prevYearCo2} kg ({data.prevYearKwh} kWh)
            </span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <span className="text-[#9DB3A6]">2026 Current Footprint:</span>
            <span className="font-semibold text-[#B8E986]">
              {data.currYearCo2} kg ({data.currYearKwh} kWh)
            </span>
          </div>

          <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-1.5 font-bold">
            <span className="text-[#E5F1DF]">Net CO₂ Abated:</span>
            <span className="text-[#B8E986]">
              -{data.co2SavedKg} kg CO₂e
            </span>
          </div>

          <div className="flex items-center justify-between gap-6 text-[11px] text-[#9DB3A6]">
            <span>Estimated Bill Saved:</span>
            <span className="text-white font-medium">₹{data.billSavingsInr}</span>
          </div>

          <div className="flex items-center justify-between gap-6 text-[11px] text-[#9DB3A6]">
            <span>Cumulative Saved:</span>
            <span className="text-white font-medium">{data.cumulativeCo2SavedKg} kg CO₂e</span>
          </div>
        </div>

        {data.lifeActionTag && (
          <div className="mt-3 rounded-lg bg-white/10 p-2 text-[10px] text-[#E5F1DF]">
            <span className="font-bold text-white">Key LiFE Intervention: </span>
            {data.lifeActionTag}
          </div>
        )}
      </div>
    )
  }

  return null
}
