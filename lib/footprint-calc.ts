/**
 * Official Central Electricity Authority (CEA) Baseline Emission Factors
 * Source: CEA CO2 Baseline Database for the Indian Power Sector, User Guide Version 19.0 (Published by Ministry of Power, Govt. of India).
 * National Weighted Average Grid Emission Factor: 0.716 kg CO2 / kWh (0.000716 metric tonnes CO2 / kWh).
 */
export const CEA_GRID_EMISSION_FACTOR = 0.716 // kg CO2 per kWh
export const CEA_FACTOR_VERSION = 'Version 19.0 (CEA, MoP, GoI)'

export interface FootprintCalculation {
  consumptionKwh: number
  emissionsKg: number
  emissionsTonnes: number
  factorUsed: number
  factorSource: string
  treesEquivalentPerYear: number
  petrolKmEquivalent: number
  baselineComparisonPercent: number // compared to Gujarat household average ~280 kWh
}

export function calculateCarbonFootprint(consumptionKwh: number): FootprintCalculation {
  const safeKwh = Math.max(0, consumptionKwh || 0)
  const emissionsKg = Number((safeKwh * CEA_GRID_EMISSION_FACTOR).toFixed(2))
  const emissionsTonnes = Number((emissionsKg / 1000).toFixed(3))

  // 1 mature tropical tree absorbs ~22 kg CO2 per year
  const treesEquivalentPerYear = Number((emissionsKg / 22).toFixed(1))

  // Standard petrol passenger car emits ~0.192 kg CO2 per km (approx 192g CO2/km)
  const petrolKmEquivalent = Math.round(emissionsKg / 0.192)

  // Average Gujarat urban household consumption ~280 kWh/month (approx 200.5 kg CO2)
  const gujaratAverageEmissions = 280 * CEA_GRID_EMISSION_FACTOR
  const baselineComparisonPercent = Math.round(((emissionsKg - gujaratAverageEmissions) / gujaratAverageEmissions) * 100)

  return {
    consumptionKwh: safeKwh,
    emissionsKg,
    emissionsTonnes,
    factorUsed: CEA_GRID_EMISSION_FACTOR,
    factorSource: CEA_FACTOR_VERSION,
    treesEquivalentPerYear,
    petrolKmEquivalent,
    baselineComparisonPercent,
  }
}
