'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Leaf,
  CheckCircle2,
  ArrowRight,
  Zap,
  Home,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { UserProfile } from '@/lib/types'

export function OnboardingView() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [district, setDistrict] = useState('Ahmedabad')
  const [discom, setDiscom] = useState<UserProfile['discom']>('UGVCL')
  const [consumerNumber, setConsumerNumber] = useState('')
  const [members, setMembers] = useState(4)
  const [coolingType, setCoolingType] = useState('split_ac')
  const [pledgeAccepted, setPledgeAccepted] = useState(false)

  const handleComplete = () => {
    const user = dataStore.getUser()
    dataStore.setUser({
      ...user,
      district,
      discom,
      consumerNumber,
      householdMembers: members,
    })

    // Award onboarding bonus points
    dataStore.addPoints(100, 'Onboarding & Mission LiFE Citizen Pledge Completed')
    window.location.href = '/dashboard'
  }

  return (
    <main className="min-h-screen bg-[#F6F8F3] py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-10 space-y-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-[#F0F3EC] pb-5">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-[#B8E986] text-[#176B4D]">
              <Leaf size={18} fill="currentColor" />
            </span>
            <span className="text-sm font-bold text-[#103D30]">Citizen Onboarding</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#8E9B92]">
            <span className={step >= 1 ? 'text-[#176B4D] font-bold' : ''}>1. Utility</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-[#176B4D] font-bold' : ''}>2. Baseline</span>
            <span>→</span>
            <span className={step === 3 ? 'text-[#176B4D] font-bold' : ''}>3. Pledge</span>
          </div>
        </div>

        {/* Step 1: Utility & District */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[#103D30]">Connect Your Gujarat Power Discom</h2>
              <p className="mt-1 text-xs text-[#66736B]">
                Links your household to regional tariff brackets and rooftop solar net-metering rules.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#103D30]">District Location</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-3 text-xs font-semibold text-[#103D30] outline-none focus:border-[#176B4D]"
                >
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Surat">Surat</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Rajkot">Rajkot</option>
                  <option value="Gandhinagar">Gandhinagar</option>
                  <option value="Bhavnagar">Bhavnagar</option>
                  <option value="Jamnagar">Jamnagar</option>
                  <option value="Junagadh">Junagadh</option>
                  <option value="Kutch">Kutch</option>
                  <option value="Anand">Anand</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103D30]">Discom Provider</label>
                <select
                  value={discom}
                  onChange={(e) => setDiscom(e.target.value as any)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-3 text-xs font-semibold text-[#103D30] outline-none focus:border-[#176B4D]"
                >
                  <option value="UGVCL">UGVCL (Uttar Gujarat Vij Company Ltd)</option>
                  <option value="DGVCL">DGVCL (Dakshin Gujarat Vij Company Ltd)</option>
                  <option value="MGVCL">MGVCL (Madhya Gujarat Vij Company Ltd)</option>
                  <option value="PGVCL">PGVCL (Paschim Gujarat Vij Company Ltd)</option>
                  <option value="Torrent Power">Torrent Power (Ahmedabad / Surat)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103D30]">
                  Consumer Number <span className="text-[#8E9B92] font-normal">(Printed on bill)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 02148/99120"
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-3 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#176B4D] py-3 text-xs font-bold text-white transition hover:bg-[#103D30]"
            >
              Continue to Step 2 <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Step 2: Household Baseline */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[#103D30]">Household Characteristics</h2>
              <p className="mt-1 text-xs text-[#66736B]">
                Allows accurate per-capita baseline energy comparisons and tailored mission suggestions.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#103D30]">Household Members</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={members}
                  onChange={(e) => setMembers(parseInt(e.target.value) || 1)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-3 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103D30]">Primary Summer Cooling</label>
                <select
                  value={coolingType}
                  onChange={(e) => setCoolingType(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-3 text-xs font-semibold text-[#103D30] outline-none focus:border-[#176B4D]"
                >
                  <option value="split_ac">Inverter Split Air Conditioners</option>
                  <option value="window_ac">Window AC Units</option>
                  <option value="evaporative_cooler">Air Coolers / Desert Coolers</option>
                  <option value="fans_only">Ceiling Fans Only</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="rounded-xl border border-[#D7E2D3] px-4 py-3 text-xs font-semibold text-[#55635B]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#176B4D] py-3 text-xs font-bold text-white transition hover:bg-[#103D30]"
              >
                Continue to Pledge <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: LiFE Pledge */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[#103D30]">Citizen Mission LiFE Pledge</h2>
              <p className="mt-1 text-xs text-[#66736B]">
                Make a conscious commitment to mindful resource consumption across Gujarat.
              </p>
            </div>

            <div className="rounded-2xl bg-[#EEF4E8] p-5 text-xs text-[#18241F] space-y-3">
              <div className="flex items-center gap-2 font-bold text-[#176B4D]">
                <Sparkles size={16} /> I pledge to:
              </div>
              <p>• Keep air conditioners at the healthy 24°C standard during hot months.</p>
              <p>• Avoid phantom power standby on televisions and appliances.</p>
              <p>• Track my household electricity readings monthly to monitor progress.</p>
              <p>• Segregate household waste and conserve municipal water supplies.</p>
            </div>

            <label className="flex items-start gap-3 text-xs text-[#103D30] font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={pledgeAccepted}
                onChange={(e) => setPledgeAccepted(e.target.checked)}
                className="mt-0.5 size-4 accent-[#176B4D]"
              />
              <span>I affirm this pledge for a greener Gujarat (+100 Welcome Points reward).</span>
            </label>

            <button
              disabled={!pledgeAccepted}
              onClick={handleComplete}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#176B4D] py-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#103D30] disabled:opacity-50"
            >
              <CheckCircle2 size={16} /> Enter LiFE Dashboard (+100 Pts)
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
