export interface SolarInputs {
  monthlyKwh: number
  roofAreaSqFt: number
  roofShadingPercent: number
  district: string
  propertyType: string
  budget?: number
}

export interface SolarCalculationResult {
  recommendedCapacityKw: number
  minAreaRequiredSqFt: number
  estimatedAnnualGenerationKwh: number
  annualSavingsInr: number
  estimatedGrossCostInr: number
  estimatedSubsidyInr: number
  netInvestmentInr: number
  paybackPeriodYears: number
  co2MitigatedKgPerYear: number
  subsidySchemeName: string
  assumptions: string[]
  officialPortalUrl: string
}

export function calculateSolarFeasibility(inputs: SolarInputs): SolarCalculationResult {
  const { monthlyKwh, roofAreaSqFt, roofShadingPercent } = inputs

  // Usable area adjusted for shading
  const usableArea = Math.max(50, roofAreaSqFt * (1 - (roofShadingPercent || 0) / 100))

  // Capacity based on roof area: ~100 sq ft shadow-free per 1 kWp
  const maxCapacityFromArea = Math.floor(usableArea / 100)

  // Capacity based on monthly consumption: 1 kWp generates ~120 kWh/month in Gujarat
  const idealCapacityFromKwh = Math.round((monthlyKwh / 120) * 2) / 2 // round to nearest 0.5 kW

  // Recommended system size (min 1 kW, max based on area, typically capped at 10kW for residential)
  let capacity = Math.min(idealCapacityFromKwh, maxCapacityFromArea)
  if (capacity < 1 && maxCapacityFromArea >= 1) capacity = 1
  if (capacity > 10) capacity = 10
  if (capacity <= 0) capacity = 1

  // Annual generation: Gujarat receives ~300 sunny days, approx 1,450 kWh/kWp/year
  const annualGeneration = Math.round(capacity * 1450)

  // Average Gujarat grid tariff displacement: ~₹6.20 per unit
  const annualSavingsInr = Math.round(annualGeneration * 6.20)

  // Estimated gross capital cost: ~₹55,000 per kW (including mono-perc panels, hybrid inverter, mounting, net meter)
  const estimatedGrossCostInr = Math.round(capacity * 55000)

  // PM Surya Ghar Muft Bijli Yojana / Surya Gujarat Subsidy slabs (MNRE guidelines):
  // 1 kW: ₹30,000
  // 2 kW: ₹60,000
  // 3 kW and above: ₹78,000
  let estimatedSubsidyInr = 0
  if (capacity >= 3) {
    estimatedSubsidyInr = 78000
  } else if (capacity >= 2) {
    estimatedSubsidyInr = 60000
  } else if (capacity >= 1) {
    estimatedSubsidyInr = 30000
  }

  const netInvestmentInr = Math.max(10000, estimatedGrossCostInr - estimatedSubsidyInr)
  const paybackPeriodYears = Number((netInvestmentInr / (annualSavingsInr || 1)).toFixed(1))

  // CO2 mitigated: 1 kWh solar displaces 0.716 kg CEA grid CO2
  const co2MitigatedKgPerYear = Math.round(annualGeneration * 0.716)

  return {
    recommendedCapacityKw: capacity,
    minAreaRequiredSqFt: Math.round(capacity * 100),
    estimatedAnnualGenerationKwh: annualGeneration,
    annualSavingsInr,
    estimatedGrossCostInr,
    estimatedSubsidyInr,
    netInvestmentInr,
    paybackPeriodYears,
    co2MitigatedKgPerYear,
    subsidySchemeName: 'PM Surya Ghar: Muft Bijli Yojana & Surya Gujarat',
    assumptions: [
      'Insolation based on Gujarat average of ~5.2–5.5 peak sun hours/day',
      'Mono PERC high-efficiency solar panels with 25-year performance warranty',
      'Grid export credit credited at GERC approved residential solar net metering tariff',
      'Direct Benefit Transfer (DBT) subsidy processed through National Solar Portal',
    ],
    officialPortalUrl: 'https://pmsuryaghar.gov.in',
  }
}
