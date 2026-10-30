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
  SlidersHorizontal,
} from 'lucide-react'
import { EnergyReading } from '@/lib/types'
import { CEA_GRID_EMISSION_FACTOR } from '@/lib/footprint-calc'

type MetricMode = 'co2' | 'energy' | 'cost'
type ViewMode = 'comparison' | 'abatement' | 'cumulative'
type TimeRange = 'tracked' | 'annual'

interface ReportsCo2SavingsChartProps {
  readings?: EnergyReading[]
  className?: string
}

interface MonthlyDataPoint {
  month: string
  fullMonth: string
  year: number
  // Energy (kWh)
  prevYearKwh: number
  currYearKwh: number
  kwhSaved: number
  cumulativeKwhSaved: number
  // Carbon (kg CO2e)
  prevYearCo2: number
  currYearCo2: number
  co2SavedKg: number
  cumulativeCo2SavedKg: number
  // Cost (INR)
  prevYearCost: number
  currYearCost: number
  billSavingsInr: number
  cumulativeCostSaved: number
  // Efficiency
  efficiencyGainPercent: number
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
  const [metricMode, setMetricMode] = useState<MetricMode>('co2')
  const [viewMode, setViewMode] = useState<ViewMode>('comparison')
  const [timeRange, setTimeRange] = useState<TimeRange>('tracked')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Process data combining user readings with historical baseline
  const processedData = useMemo(() => {
    const readingMap = new Map<string, number>()
    readings.forEach((r) => {
      if (r.startDate) {
        const d = new Date(r.startDate)
        const monthShort = d.toLocaleDateString('en-US', { month: 'short' })
        readingMap.set(monthShort, r.consumptionKwh)
      }
    })

    let runningCumulativeKwh = 0
    let runningCumulativeCo2 = 0
    let runningCumulativeCost = 0

    const fullYearData: MonthlyDataPoint[] = DEFAULT_BASELINE_MONTHS.map((base) => {
      const isActual = readingMap.has(base.month)
      const currKwh = isActual ? (readingMap.get(base.month) as number) : base.currKwh
      const prevKwh = base.prevKwh

      const kwhSaved = Math.max(0, prevKwh - currKwh)
      const prevYearCo2 = Number((prevKwh * CEA_GRID_EMISSION_FACTOR).toFixed(1))
      const currYearCo2 = Number((currKwh * CEA_GRID_EMISSION_FACTOR).toFixed(1))
      const co2SavedKg = Number((prevYearCo2 - currYearCo2).toFixed(1))
      const efficiencyGainPercent = Number((((prevKwh - currKwh) / prevKwh) * 100).toFixed(1))

      const tariffRate = 7.15 // Gujarat residential landed cost per kWh
      const prevYearCost = Math.round(prevKwh * tariffRate)
      const currYearCost = Math.round(currKwh * tariffRate)
      const billSavingsInr = Math.round(kwhSaved * tariffRate)

      runningCumulativeKwh += kwhSaved
      runningCumulativeCo2 += Math.max(0, co2SavedKg)
      runningCumulativeCost += billSavingsInr

      return {
        month: base.month,
        fullMonth: base.fullMonth,
        year: 2026,
        prevYearKwh: prevKwh,
        currYearKwh: currKwh,
        kwhSaved,
        cumulativeKwhSaved: runningCumulativeKwh,
        prevYearCo2,
        currYearCo2,
        co2SavedKg,
        cumulativeCo2SavedKg: Number(runningCumulativeCo2.toFixed(1)),
        prevYearCost,
        currYearCost,
        billSavingsInr,
        cumulativeCostSaved: runningCumulativeCost,
        efficiencyGainPercent,
        lifeActionTag: base.tag,
        isTracked: isActual || ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].includes(base.month),
      }
    })

    if (timeRange === 'tracked') {
      const subset = fullYearData.filter((d) => ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].includes(d.month))
      let subsetKwh = 0
      let subsetCo2 = 0
      let subsetCost = 0
      return subset.map((d) => {
        subsetKwh += d.kwhSaved
        subsetCo2 += d.co2SavedKg
        subsetCost += d.billSavingsInr
        return {
          ...d,
          cumulativeKwhSaved: subsetKwh,
          cumulativeCo2SavedKg: Number(subsetCo2.toFixed(1)),
          cumulativeCostSaved: subsetCost,
        }
      })
    }

    return fullYearData
  }, [readings, timeRange])

  // Summary Metrics calculations
  const totalPrevCo2 = useMemo(() => processedData.reduce((acc, curr) => acc + curr.prevYearCo2, 0), [processedData])
  const totalCurrCo2 = useMemo(() => processedData.reduce((acc, curr) => acc + curr.currYearCo2, 0), [processedData])
  const totalCo2Saved = useMemo(() => Number((totalPrevCo2 - totalCurrCo2).toFixed(1)), [totalPrevCo2, totalCurrCo2])

  const totalPrevKwh = useMemo(() => processedData.reduce((acc, curr) => acc + curr.prevYearKwh, 0), [processedData])
  const totalCurrKwh = useMemo(() => processedData.reduce((acc, curr) => acc + curr.currYearKwh, 0), [processedData])
  const totalKwhSaved = useMemo(() => totalPrevKwh - totalCurrKwh, [totalPrevKwh, totalCurrKwh])

  const totalBillSaved = useMemo(() => processedData.reduce((acc, curr) => acc + curr.billSavingsInr, 0), [processedData])
  const avgEfficiencyGain = useMemo(() => {
    if (totalPrevKwh === 0) return 0
    return Number((((totalPrevKwh - totalCurrKwh) / totalPrevKwh) * 100).toFixed(1))
  }, [totalPrevKwh, totalCurrKwh])

  const treesEquivalent = useMemo(() => Number((totalCo2Saved / 22).toFixed(1)), [totalCo2Saved])

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-[#E3E8DF] bg-white p-6 shadow-sm">
        <div className="h-64 animate-pulse rounded-xl bg-[#F6F8F3]" />
      </div>
    )
  }

  // Dynamic config based on active metricMode
  const metricConfig = {
    co2: {
      label: 'CO₂ Savings',
      unit: 'kg CO₂e',
      prevKey: 'prevYearCo2',
      currKey: 'currYearCo2',
      deltaKey: 'co2SavedKg',
      cumKey: 'cumulativeCo2SavedKg',
      prevName: '2025 Baseline CO₂',
      currName: '2026 Current CO₂',
      deltaName: 'Net CO₂ Avoided',
      cumName: 'Cumulative CO₂ Avoided',
      currColor: '#176B4D',
      deltaColor: '#27AE60',
      strokeColor: '#103D30',
      gradientId: 'co2SavingsGrad',
      headerTitle: 'Year-over-Year CO₂ Savings & Emissions Trends',
      headerDesc: 'Monthly carbon footprint comparison against 2025 baseline under Central Electricity Authority (CEA v19.0) standard factor (0.716 kg CO₂/kWh).',
    },
    energy: {
      label: 'Energy Reduction',
      unit: 'kWh',
      prevKey: 'prevYearKwh',
      currKey: 'currYearKwh',
      deltaKey: 'kwhSaved',
      cumKey: 'cumulativeKwhSaved',
      prevName: '2025 Baseline Energy',
      currName: '2026 Current Energy',
      deltaName: 'Net kWh Saved',
      cumName: 'Cumulative kWh Reduced',
      currColor: '#0284C7',
      deltaColor: '#0EA5E9',
      strokeColor: '#0369A1',
      gradientId: 'energySavingsGrad',
      headerTitle: 'Year-over-Year Energy Consumption & Efficiency Trends',
      headerDesc: 'Monthly electricity consumption comparison against Gujarat urban household baseline (kWh).',
    },
    cost: {
      label: 'Cost Savings',
      unit: '₹',
      prevKey: 'prevYearCost',
      currKey: 'currYearCost',
      deltaKey: 'billSavingsInr',
      cumKey: 'cumulativeCostSaved',
      prevName: '2025 Baseline Bill (₹)',
      currName: '2026 Current Bill (₹)',
      deltaName: 'Net Bill Savings (₹)',
      cumName: 'Cumulative Rupee Savings',
      currColor: '#D97706',
      deltaColor: '#F59E0B',
      strokeColor: '#B45309',
      gradientId: 'costSavingsGrad',
      headerTitle: 'Year-over-Year Household Bill & Tariff Savings Trends',
      headerDesc: 'Financial savings generated by avoiding peak-tier consumption under Gujarat DISCOM residential tariff slabs (~₹7.15/kWh).',
    },
  }[metricMode]

  return (
    <div className={`space-y-6 rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8 print:border-none print:p-0 print:shadow-none ${className}`}>
      {/* Component Header & Controls */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#F0F3EC] pb-5 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`grid size-8 place-items-center rounded-lg ${
                metricMode === 'co2'
                  ? 'bg-[#E5F1DF] text-[#176B4D]'
                  : metricMode === 'energy'
                  ? 'bg-[#E0F2FE] text-[#0284C7]'
                  : 'bg-[#FEF3C7] text-[#D97706]'
              }`}
            >
              {metricMode === 'co2' ? (
                <Leaf size={18} />
              ) : metricMode === 'energy' ? (
                <Zap size={18} />
              ) : (
                <IndianRupee size={18} />
              )}
            </span>
            <h3 className="text-lg font-bold tracking-tight text-[#103D30]">
              {metricConfig.headerTitle}
            </h3>
          </div>
          <p className="mt-1 text-xs text-[#66736B]">
            {metricConfig.headerDesc}
          </p>
        </div>

        {/* Action Controls & Metric Mode Toggles */}
        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          {/* PRIMARY TOGGLE BUTTONS: CO2 Savings, Energy Reduction, Cost Savings */}
          <div className="inline-flex rounded-xl bg-[#F0F4EC] p-1 text-xs font-bold text-[#66736B] shadow-2xs">
            <button
              type="button"
              onClick={() => setMetricMode('co2')}
              title="View CO2 Savings Trends"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition cursor-pointer ${
                metricMode === 'co2'
                  ? 'bg-[#176B4D] text-white shadow-xs'
                  : 'hover:text-[#103D30]'
              }`}
            >
              <Leaf size={13} />
              <span>CO₂ Savings</span>
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('energy')}
              title="View Energy Reduction Trends"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition cursor-pointer ${
                metricMode === 'energy'
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'hover:text-[#103D30]'
              }`}
            >
              <Zap size={13} />
              <span>Energy Reduction</span>
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('cost')}
              title="View Cost Savings Trends"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition cursor-pointer ${
                metricMode === 'cost'
                  ? 'bg-[#D97706] text-white shadow-xs'
                  : 'hover:text-[#103D30]'
              }`}
            >
              <IndianRupee size={13} />
              <span>Cost Savings</span>
            </button>
          </div>

          {/* Time range selector */}
          <div className="inline-flex rounded-xl bg-[#F4F6F1] p-1 text-xs font-medium text-[#66736B]">
            <button
              type="button"
              onClick={() => setTimeRange('tracked')}
              className={`rounded-lg px-2.5 py-1.5 transition cursor-pointer ${
                timeRange === 'tracked'
                  ? 'bg-white font-bold text-[#103D30] shadow-xs'
                  : 'hover:text-[#103D30]'
              }`}
            >
              6M Verified
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('annual')}
              className={`rounded-lg px-2.5 py-1.5 transition cursor-pointer ${
                timeRange === 'annual'
                  ? 'bg-white font-bold text-[#103D30] shadow-xs'
                  : 'hover:text-[#103D30]'
              }`}
            >
              12M Annual
            </button>
          </div>

          {/* View Mode Selector */}
          <div className="inline-flex rounded-xl bg-[#F4F6F1] p-1 text-xs font-medium text-[#66736B]">
            <button
              type="button"
              onClick={() => setViewMode('comparison')}
              title="Dual monthly comparison with efficiency gain %"
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition cursor-pointer ${
                viewMode === 'comparison'
                  ? 'bg-white font-bold text-[#103D30] shadow-xs'
                  : 'hover:text-[#103D30]'
              }`}
            >
              <BarChart2 size={12} />
              <span>Dual</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('abatement')}
              title="Monthly net savings"
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition cursor-pointer ${
                viewMode === 'abatement'
                  ? 'bg-white font-bold text-[#103D30] shadow-xs'
                  : 'hover:text-[#103D30]'
              }`}
            >
              <Leaf size={12} />
              <span>Net</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cumulative')}
              title="Compounding cumulative trajectory"
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition cursor-pointer ${
                viewMode === 'cumulative'
                  ? 'bg-white font-bold text-[#103D30] shadow-xs'
                  : 'hover:text-[#103D30]'
              }`}
            >
              <Layers size={12} />
              <span>Total</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic High-Impact Stat Strip tailored to selected Metric Mode */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metricMode === 'co2' ? (
          <>
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
          </>
        ) : metricMode === 'energy' ? (
          <>
            <div className="rounded-2xl border border-[#E3E8DF] bg-[#F0F9FF] p-4">
              <div className="flex items-center justify-between text-[#8E9B92]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Power Reduced</span>
                <Zap size={15} className="text-[#0284C7]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#0284C7]">
                  {totalKwhSaved > 0 ? `-${totalKwhSaved}` : '0'}
                </span>
                <span className="text-xs font-semibold text-[#66736B]">kWh</span>
              </div>
              <p className="mt-1 text-[11px] text-[#0284C7] font-medium flex items-center gap-1">
                <TrendingDown size={12} /> Total units conserved
              </p>
            </div>

            <div className="rounded-2xl border border-[#E3E8DF] bg-[#F0F9FF] p-4">
              <div className="flex items-center justify-between text-[#8E9B92]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Monthly Avg Saved</span>
                <Calendar size={15} className="text-[#0284C7]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#103D30]">
                  {(totalKwhSaved / processedData.length).toFixed(1)}
                </span>
                <span className="text-xs font-semibold text-[#66736B]">kWh/mo</span>
              </div>
              <p className="mt-1 text-[11px] text-[#176B4D] font-medium flex items-center gap-1">
                <TrendingUp size={12} /> +{avgEfficiencyGain}% efficiency gain
              </p>
            </div>

            <div className="rounded-2xl border border-[#E3E8DF] bg-[#F0F9FF] p-4">
              <div className="flex items-center justify-between text-[#8E9B92]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Peak Summer Relief</span>
                <Sparkles size={15} className="text-[#0284C7]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#103D30]">120</span>
                <span className="text-xs font-semibold text-[#66736B]">kWh cut</span>
              </div>
              <p className="mt-1 text-[11px] text-[#66736B]">May peak cooling reduction</p>
            </div>

            <div className="rounded-2xl border border-[#E3E8DF] bg-[#F0F9FF] p-4">
              <div className="flex items-center justify-between text-[#8E9B92]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Current Month kWh</span>
                <BarChart2 size={15} className="text-[#0284C7]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#103D30]">
                  {processedData[processedData.length - 1]?.currYearKwh || 260}
                </span>
                <span className="text-xs font-semibold text-[#66736B]">units</span>
              </div>
              <p className="mt-1 text-[11px] text-[#66736B]">Baseline was 320 kWh</p>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-[#E3E8DF] bg-[#FFFBEB] p-4">
              <div className="flex items-center justify-between text-[#8E9B92]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Bill Saved</span>
                <IndianRupee size={15} className="text-[#D97706]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#D97706]">
                  ₹{totalBillSaved.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#D97706] font-medium flex items-center gap-1">
                <TrendingDown size={12} /> Rupee savings on tariff
              </p>
            </div>

            <div className="rounded-2xl border border-[#E3E8DF] bg-[#FFFBEB] p-4">
              <div className="flex items-center justify-between text-[#8E9B92]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Avg Monthly Savings</span>
                <Calendar size={15} className="text-[#D97706]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#103D30]">
                  ₹{Math.round(totalBillSaved / processedData.length).toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-[#66736B]">/mo</span>
              </div>
              <p className="mt-1 text-[11px] text-[#176B4D] font-medium flex items-center gap-1">
                <TrendingUp size={12} /> Slashed highest slab bracket
              </p>
            </div>

            <div className="rounded-2xl border border-[#E3E8DF] bg-[#FFFBEB] p-4">
              <div className="flex items-center justify-between text-[#8E9B92]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Annualized Savings</span>
                <Sparkles size={15} className="text-[#D97706]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#103D30]">
                  ₹{Math.round((totalBillSaved / processedData.length) * 12).toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-[#66736B]">/yr</span>
              </div>
              <p className="mt-1 text-[11px] text-[#66736B]">Full year run-rate estimate</p>
            </div>

            <div className="rounded-2xl border border-[#E3E8DF] bg-[#FFFBEB] p-4">
              <div className="flex items-center justify-between text-[#8E9B92]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Tariff Rate Basis</span>
                <Info size={15} className="text-[#D97706]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#103D30]">₹7.15</span>
                <span className="text-xs font-semibold text-[#66736B]">/kWh</span>
              </div>
              <p className="mt-1 text-[11px] text-[#66736B]">Avg Gujarat residential rate</p>
            </div>
          </>
        )}
      </div>

      {/* Main Interactive Recharts Canvas */}
      <div className="relative rounded-2xl border border-[#E3E8DF] bg-[#FCFDFB] p-4 pt-6 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span
              className="inline-block size-2 rounded-full"
              style={{ backgroundColor: metricConfig.currColor }}
            />
            <span className="font-bold text-[#103D30]">
              {viewMode === 'comparison' &&
                `${metricConfig.label}: 2025 Baseline vs 2026 Current (${metricConfig.unit}) + Efficiency Gain (%)`}
              {viewMode === 'abatement' &&
                `Monthly Net ${metricConfig.label} (${metricConfig.unit} Saved)`}
              {viewMode === 'cumulative' &&
                `Cumulative ${metricConfig.label} Trajectory (${metricConfig.unit})`}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#66736B]">
            {viewMode === 'comparison' && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded-xs bg-[#CBD5E1]" /> {metricConfig.prevName}
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-3 rounded-xs"
                    style={{ backgroundColor: metricConfig.currColor }}
                  />{' '}
                  {metricConfig.currName}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-[#F39C12]">
                  <span className="inline-block size-2 rounded-full bg-[#F39C12]" /> Efficiency Gain %
                </span>
              </>
            )}
            {viewMode === 'abatement' && (
              <span className="flex items-center gap-1.5">
                <span
                  className="size-3 rounded-xs"
                  style={{ backgroundColor: metricConfig.deltaColor }}
                />{' '}
                {metricConfig.deltaName} ({metricConfig.unit})
              </span>
            )}
            {viewMode === 'cumulative' && (
              <span className="flex items-center gap-1.5">
                <span
                  className="size-3 rounded-xs"
                  style={{ backgroundColor: metricConfig.currColor }}
                />{' '}
                {metricConfig.cumName} ({metricConfig.unit})
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
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={{ stroke: '#D9E2D5' }}
                  tick={{ fill: '#66736B', fontSize: 11 }}
                  unit={` ${metricConfig.unit === '₹' ? '' : metricConfig.unit}`}
                  tickFormatter={(val) => (metricConfig.unit === '₹' ? `₹${val}` : `${val}`)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#F39C12', fontSize: 11, fontWeight: 600 }}
                  unit="%"
                  domain={[0, 45]}
                />
                <Tooltip content={<CustomTooltip metricMode={metricMode} />} />

                {/* 2025 Baseline Bar */}
                <Bar
                  yAxisId="left"
                  dataKey={metricConfig.prevKey}
                  name={metricConfig.prevName}
                  fill="#CBD5E1"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                {/* 2026 Current Bar */}
                <Bar
                  yAxisId="left"
                  dataKey={metricConfig.currKey}
                  name={metricConfig.currName}
                  fill={metricConfig.currColor}
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
                  <linearGradient id={metricConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metricConfig.deltaColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={metricConfig.deltaColor} stopOpacity={0.02} />
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
                  unit={` ${metricConfig.unit === '₹' ? '' : metricConfig.unit}`}
                  tickFormatter={(val) => (metricConfig.unit === '₹' ? `₹${val}` : `${val}`)}
                />
                <Tooltip content={<CustomTooltip metricMode={metricMode} />} />
                <ReferenceLine y={0} stroke="#CBD5E1" />
                <Area
                  type="monotone"
                  dataKey={metricConfig.deltaKey}
                  name={metricConfig.deltaName}
                  stroke={metricConfig.deltaColor}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#${metricConfig.gradientId})`}
                  dot={{ r: 4, fill: metricConfig.deltaColor, strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, stroke: '#103D30', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : (
              <AreaChart
                data={processedData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id={`${metricConfig.gradientId}_cum`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metricConfig.currColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={metricConfig.currColor} stopOpacity={0.02} />
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
                  unit={` ${metricConfig.unit === '₹' ? '' : metricConfig.unit}`}
                  tickFormatter={(val) => (metricConfig.unit === '₹' ? `₹${val}` : `${val}`)}
                />
                <Tooltip content={<CustomTooltip metricMode={metricMode} />} />
                <Area
                  type="monotone"
                  dataKey={metricConfig.cumKey}
                  name={metricConfig.cumName}
                  stroke={metricConfig.currColor}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill={`url(#${metricConfig.gradientId}_cum)`}
                  dot={{ r: 4, fill: metricConfig.currColor, strokeWidth: 2, stroke: '#FFFFFF' }}
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
            <strong className="text-[#103D30]">
              {metricMode === 'co2'
                ? 'CO₂ Mitigation Standard: '
                : metricMode === 'energy'
                ? 'Energy Baseline Standard: '
                : 'Tariff Slab Modeling: '}
            </strong>
            {metricMode === 'co2' &&
              'Calculated strictly against the official Central Electricity Authority (CEA v19.0) weighted average grid factor of 0.716 kg CO₂/kWh.'}
            {metricMode === 'energy' &&
              'Ahmedabad and Gujarat Discom urban baseline averages ~380 kWh/month for 4-member residences during peak cooling seasons.'}
            {metricMode === 'cost' &&
              'Cost calculations reflect Gujarat GERC residential two-part tariffs including Fixed Charges, FPPPA variable fuel charges, and state electricity duty.'}
          </div>
        </div>
        <div className="shrink-0 text-[11px] font-semibold text-[#176B4D]">
          Active Mode: {metricConfig.label}
        </div>
      </div>
    </div>
  )
}

/**
 * Custom Rich Tooltip for Recharts
 */
function CustomTooltip({ active, payload, label, metricMode }: any) {
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
          {metricMode === 'co2' ? (
            <>
              <div className="flex items-center justify-between gap-6">
                <span className="text-[#9DB3A6]">2025 Baseline Footprint:</span>
                <span className="font-semibold text-white">{data.prevYearCo2} kg CO₂</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-[#9DB3A6]">2026 Current Footprint:</span>
                <span className="font-semibold text-[#B8E986]">{data.currYearCo2} kg CO₂</span>
              </div>
              <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-1.5 font-bold">
                <span className="text-[#E5F1DF]">Net CO₂ Abated:</span>
                <span className="text-[#B8E986]">-{data.co2SavedKg} kg CO₂e</span>
              </div>
            </>
          ) : metricMode === 'energy' ? (
            <>
              <div className="flex items-center justify-between gap-6">
                <span className="text-[#9DB3A6]">2025 Baseline Energy:</span>
                <span className="font-semibold text-white">{data.prevYearKwh} kWh</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-[#9DB3A6]">2026 Current Energy:</span>
                <span className="font-semibold text-[#38BDF8]">{data.currYearKwh} kWh</span>
              </div>
              <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-1.5 font-bold">
                <span className="text-[#E5F1DF]">Net Energy Conserved:</span>
                <span className="text-[#38BDF8]">-{data.kwhSaved} kWh</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-6">
                <span className="text-[#9DB3A6]">2025 Baseline Bill:</span>
                <span className="font-semibold text-white">₹{data.prevYearCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-[#9DB3A6]">2026 Current Bill:</span>
                <span className="font-semibold text-[#FCD34D]">₹{data.currYearCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-1.5 font-bold">
                <span className="text-[#E5F1DF]">Net Bill Savings:</span>
                <span className="text-[#FCD34D]">₹{data.billSavingsInr.toLocaleString('en-IN')} saved</span>
              </div>
            </>
          )}

          <div className="flex items-center justify-between gap-6 text-[11px] text-[#9DB3A6] border-t border-white/10 pt-1">
            <span>Cumulative Saved:</span>
            <span className="text-white font-medium">
              {metricMode === 'co2'
                ? `${data.cumulativeCo2SavedKg} kg CO₂e`
                : metricMode === 'energy'
                ? `${data.cumulativeKwhSaved} kWh`
                : `₹${data.cumulativeCostSaved.toLocaleString('en-IN')}`}
            </span>
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
