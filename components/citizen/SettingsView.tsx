'use client'

import React, { useState, useEffect } from 'react'
import {
  User,
  Home,
  Globe,
  Bell,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { UserProfile } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog'

export function SettingsView() {
  const [user, setUser] = useState<UserProfile>(dataStore.getUser())
  const [name, setName] = useState('')
  const [district, setDistrict] = useState('')
  const [discom, setDiscom] = useState<UserProfile['discom']>('UGVCL')
  const [consumerNumber, setConsumerNumber] = useState('')
  const [householdMembers, setHouseholdMembers] = useState(4)
  const [homeType, setHomeType] = useState<UserProfile['homeType']>('apartment')
  const [language, setLanguage] = useState<UserProfile['language']>('en')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [societySharing, setSocietySharing] = useState(true)

  const [saveSuccess, setSaveSuccess] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteRequestSubmitted, setDeleteRequestSubmitted] = useState(false)

  useEffect(() => {
    const current = dataStore.getUser()
    setUser(current)
    setName(current.name)
    setDistrict(current.district)
    setDiscom(current.discom)
    setConsumerNumber(current.consumerNumber || '')
    setHouseholdMembers(current.householdMembers)
    setHomeType(current.homeType)
    setLanguage(current.language)
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const updated: UserProfile = {
      ...user,
      name,
      district,
      discom,
      consumerNumber,
      householdMembers,
      homeType,
      language,
    }
    dataStore.setUser(updated)
    setUser(updated)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleExportData = () => {
    const backup = {
      user,
      readings: dataStore.getReadings(),
      submissions: dataStore.getUserSubmissions(user.id),
      solarAssessments: dataStore.getSolarAssessments(),
      pointsLedger: dataStore.getPointsLedger(),
      exportedAt: new Date().toISOString(),
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `LiFE_Gujarat_Data_${user.id}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handleDeleteRequest = () => {
    setDeleteModalOpen(false)
    setDeleteRequestSubmitted(true)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Settings & Household Preferences"
        description="Manage your profile, Discom utility connection, household parameters, privacy toggles, and data export."
      />

      <form onSubmit={handleSave} className="space-y-8">
        {saveSuccess && (
          <div className="flex items-center gap-2 rounded-2xl bg-[#E5F1DF] p-4 text-xs font-semibold text-[#176B4D]">
            <CheckCircle2 size={16} /> Preferences successfully updated and saved to your profile!
          </div>
        )}

        {/* Section 1: Profile Information */}
        <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8 space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F0F3EC] pb-4">
            <User size={18} className="text-[#176B4D]" />
            <h3 className="text-base font-bold text-[#103D30]">Citizen Profile</h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#103D30]">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103D30]">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#F6F8F3] p-2.5 text-xs text-[#8E9B92] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103D30]">District in Gujarat</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103D30]">Interface Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs font-semibold text-[#103D30] outline-none focus:border-[#176B4D]"
              >
                <option value="en">English (EN)</option>
                <option value="gu">ગુજરાતી (GU)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Household & Discom Utility */}
        <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8 space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F0F3EC] pb-4">
            <Home size={18} className="text-[#176B4D]" />
            <h3 className="text-base font-bold text-[#103D30]">Household & Power Utility</h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#103D30]">Power Distribution Company (Discom)</label>
              <select
                value={discom}
                onChange={(e) => setDiscom(e.target.value as any)}
                className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs font-semibold text-[#103D30] outline-none focus:border-[#176B4D]"
              >
                <option value="UGVCL">UGVCL (Uttar Gujarat)</option>
                <option value="DGVCL">DGVCL (Dakshin Gujarat)</option>
                <option value="MGVCL">MGVCL (Madhya Gujarat)</option>
                <option value="PGVCL">PGVCL (Paschim Gujarat)</option>
                <option value="Torrent Power">Torrent Power</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103D30]">Consumer Number</label>
              <input
                type="text"
                placeholder="e.g. 02148/99120"
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103D30]">Household Members</label>
              <input
                type="number"
                min="1"
                max="20"
                value={householdMembers}
                onChange={(e) => setHouseholdMembers(parseInt(e.target.value) || 1)}
                className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103D30]">Dwelling Structure</label>
              <select
                value={homeType}
                onChange={(e) => setHomeType(e.target.value as any)}
                className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs font-semibold text-[#103D30] outline-none focus:border-[#176B4D]"
              >
                <option value="apartment">Apartment</option>
                <option value="individual_bungalow">Individual Bungalow</option>
                <option value="row_house">Row House</option>
                <option value="rural_home">Rural Home</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Privacy & Notifications */}
        <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F0F3EC] pb-4">
            <Shield size={18} className="text-[#176B4D]" />
            <h3 className="text-base font-bold text-[#103D30]">Privacy & Notifications</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-2xl bg-[#FBFCF8] p-4 text-xs cursor-pointer">
              <div>
                <span className="font-bold text-[#103D30] block">Mission LiFE Reminders</span>
                <span className="text-[#66736B]">Receive weekly updates on daily missions and challenge deadlines.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="size-4 accent-[#176B4D]"
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl bg-[#FBFCF8] p-4 text-xs cursor-pointer">
              <div>
                <span className="font-bold text-[#103D30] block">Anonymized Society Leaderboard Contribution</span>
                <span className="text-[#66736B]">Contribute pooled energy savings to your registered community collective.</span>
              </div>
              <input
                type="checkbox"
                checked={societySharing}
                onChange={(e) => setSocietySharing(e.target.checked)}
                className="size-4 accent-[#176B4D]"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-[#176B4D] px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#103D30]"
          >
            Save Household Preferences
          </button>
        </div>
      </form>

      {/* Section 4: Data Portability & Account Deletion */}
      <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8 space-y-5">
        <h3 className="text-base font-bold text-[#103D30]">Data Portability & Account Requests</h3>
        <p className="text-xs text-[#66736B] leading-relaxed">
          Download a complete machine-readable archive of all your logged electricity readings, solar assessments,
          and mission records.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center gap-2 rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] px-4 py-2.5 text-xs font-bold text-[#103D30] hover:bg-[#EEF4E8]"
          >
            <Download size={14} className="text-[#176B4D]" /> Export My Data (JSON)
          </button>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#F8BDBD] bg-white px-4 py-2.5 text-xs font-bold text-[#C0392B] hover:bg-[#FEECEC]"
          >
            <Trash2 size={14} /> Request Account Deletion
          </button>
        </div>

        {deleteRequestSubmitted && (
          <div className="rounded-xl bg-[#FEF5E7] p-4 text-xs text-[#B07C2D] font-semibold flex items-center gap-2">
            <AlertTriangle size={16} /> Account deletion request registered (Ref: DEL-REQ-{user.id}). Under review by State Directorate.
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={deleteModalOpen}
        title="Request Account Deletion"
        message="Are you sure you want to request deletion of your LiFE Gujarat account? An administrator will review and archive your profile in accordance with state data retention standards."
        confirmLabel="Submit Deletion Request"
        isDestructive={true}
        onConfirm={handleDeleteRequest}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  )
}
