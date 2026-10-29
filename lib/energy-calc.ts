import { EnergyReading } from './types'

/**
 * Gujarat Electricity Regulatory Commission (GERC) standard residential tariff model
 * Approximated based on GUVNL (UGVCL, DGVCL, MGVCL, PGVCL) residential tariff:
 * - First 100 units: ₹3.05 / unit
 * - Next 150 units (101-250): ₹3.50 / unit
 * - Above 250 units: ₹5.20 / unit
 * - Fixed meter charge: ₹45/month
 * - Fuel Price and Power Purchase Agreement (FPPPA) ~₹2.60 / unit
 */
export function estimateGujaratBill(unitsKwh: number): number {
  if (unitsKwh <= 0) return 45

  let energyCharges = 0
  if (unitsKwh <= 100) {
    energyCharges = unitsKwh * 3.05
  } else if (unitsKwh <= 250) {
    energyCharges = 100 * 3.05 + (unitsKwh - 100) * 3.50
  } else {
    energyCharges = 100 * 3.05 + 150 * 3.50 + (unitsKwh - 250) * 5.20
  }

  const fpppaCharges = unitsKwh * 2.60
  const fixedCharges = 45
  const electricityDuty = (energyCharges + fpppaCharges) * 0.15 // 15% Gujarat Electricity Duty

  return Math.round(energyCharges + fpppaCharges + fixedCharges + electricityDuty)
}

/**
 * Calculates month-over-month and average metrics from readings
 */
export function calculateEnergyStats(readings: EnergyReading[], householdMembers: number = 3) {
  if (!readings || readings.length === 0) {
    return {
      latestKwh: 0,
      previousKwh: 0,
      monthlyChangePercent: 0,
      averageKwh: 0,
      perCapitaKwh: 0,
      totalTrackedKwh: 0,
      totalBillAmount: 0,
    }
  }

  // Sort descending by startDate
  const sorted = [...readings].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  const latest = sorted[0]
  const previous = sorted[1]

  const latestKwh = latest ? latest.consumptionKwh : 0
  const previousKwh = previous ? previous.consumptionKwh : 0

  let monthlyChangePercent = 0
  if (previousKwh > 0 && latestKwh > 0) {
    monthlyChangePercent = Math.round(((latestKwh - previousKwh) / previousKwh) * 100)
  }

  const totalTrackedKwh = sorted.reduce((sum, r) => sum + r.consumptionKwh, 0)
  const averageKwh = Math.round(totalTrackedKwh / sorted.length)
  const perCapitaKwh = Math.round(latestKwh / (householdMembers || 1))
  const totalBillAmount = sorted.reduce((sum, r) => sum + (r.billAmount || estimateGujaratBill(r.consumptionKwh)), 0)

  return {
    latestKwh,
    previousKwh,
    monthlyChangePercent,
    averageKwh,
    perCapitaKwh,
    totalTrackedKwh,
    totalBillAmount,
  }
}
