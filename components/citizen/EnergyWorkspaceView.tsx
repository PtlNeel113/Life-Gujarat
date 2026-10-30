'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Zap,
  Plus,
  Trash2,
  Edit3,
  FileText,
  ScanLine,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  X,
  Filter,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { EnergyReading } from '@/lib/types'
import { calculateEnergyStats, estimateGujaratBill } from '@/lib/energy-calc'
import { PageHeader } from '@/components/shared/PageHeader'
import { MetricCard } from '@/components/shared/MetricCard'
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function EnergyWorkspaceView() {
  const [readings, setReadings] = useState<EnergyReading[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingReading, setEditingReading] = useState<EnergyReading | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  // Form state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [consumptionKwh, setConsumptionKwh] = useState('')
  const [billAmount, setBillAmount] = useState('')
  const [source, setSource] = useState<'manual' | 'bill_scan' | 'smart_meter' | 'discom_sync'>('manual')
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState('')
  const [formWarning, setFormWarning] = useState('')

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = () => {
    setReadings(dataStore.getReadings())
  }

  const stats = calculateEnergyStats(readings)

  const openAddModal = () => {
    setEditingReading(null)
    const today = new Date()
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15)
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 15)
    setStartDate(lastMonth.toISOString().split('T')[0])
    setEndDate(thisMonth.toISOString().split('T')[0])
    setConsumptionKwh('')
    setBillAmount('')
    setSource('manual')
    setNotes('')
    setFormError('')
    setFormWarning('')
    setModalOpen(true)
  }

  const openEditModal = (r: EnergyReading) => {
    setEditingReading(r)
    setStartDate(r.startDate)
    setEndDate(r.endDate)
    setConsumptionKwh(r.consumptionKwh.toString())
    setBillAmount(r.billAmount ? r.billAmount.toString() : '')
    setSource(r.source)
    setNotes(r.notes || '')
    setFormError('')
    setFormWarning('')
    setModalOpen(true)
  }

  const handleKwhChange = (val: string) => {
    setConsumptionKwh(val)
    const num = parseFloat(val)
    if (!isNaN(num) && num > 0) {
      if (!billAmount || billAmount === '0') {
        const est = estimateGujaratBill(num)
        setBillAmount(est.toString())
      }
      if (num > 800) {
        setFormWarning('High consumption (>800 kWh). Please ensure this matches your electricity meter bill.')
      } else {
        setFormWarning('')
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    const kwh = parseFloat(consumptionKwh)
    if (isNaN(kwh) || kwh < 0) {
      setFormError('Consumption must be a non-negative number.')
      return
    }

    if (!startDate || !endDate) {
      setFormError('Please select both billing start and end dates.')
      return
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setFormError('Billing start date must be strictly before end date.')
      return
    }

    const bill = billAmount ? parseFloat(billAmount) : estimateGujaratBill(kwh)

    if (editingReading) {
      dataStore.updateReading(editingReading.id, {
        startDate,
        endDate,
        consumptionKwh: kwh,
        billAmount: bill,
        source,
        notes,
      })
    } else {
      dataStore.addReading({
        userId: dataStore.getUser().id,
        startDate,
        endDate,
        consumptionKwh: kwh,
        billAmount: bill,
        source,
        notes,
        status: 'user_reported',
      })
    }

    setModalOpen(false)
    refreshData()
  }

  const confirmDelete = () => {
    if (deleteTargetId) {
      dataStore.deleteReading(deleteTargetId)
      setDeleteTargetId(null)
      refreshData()
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Energy Workspace"
        description="Track your electricity consumption, billing history, and compare seasonal trends across Gujarat billing cycles."
        action={{
          label: 'Add Energy Reading',
          onClick: openAddModal,
          icon: <Plus size={16} />,
        }}
        secondaryAction={{
          label: 'Upload Bill PDF / Scan',
          href: '/energy/bill-analysis',
          icon: <ScanLine size={16} />,
        }}
      />

      {/* Top Statistics Cards in Neumorphic Elevation */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Latest Consumption"
          value={stats.latestKwh || 0}
          unit="kWh"
          icon={Zap}
          subtext="Most recent billing cycle"
          trend={{
            value: stats.monthlyChangePercent,
            label: 'vs previous month',
            isPositiveGood: false,
          }}
        />
        <MetricCard
          title="Average Monthly"
          value={stats.averageKwh || 0}
          unit="kWh/mo"
          icon={Calendar}
          subtext={`Across ${readings.length} tracked cycles`}
        />
        <MetricCard
          title="Per-Capita Use"
          value={stats.perCapitaKwh || 0}
          unit="kWh/person"
          icon={Zap}
          subtext="Gujarat benchmark ~70 kWh"
        />
        <MetricCard
          title="Total Tracked"
          value={stats.totalTrackedKwh || 0}
          unit="kWh"
          icon={FileText}
          subtext={`Est. ₹${stats.totalBillAmount.toLocaleString('en-IN')} paid`}
        />
      </div>

      {/* Readings Table Card */}
      <div className="rounded-3xl neu-raised p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(197,202,208,0.35)] pb-4">
          <div>
            <h3 className="text-base font-extrabold text-[#253247]">Recorded Electricity Cycles</h3>
            <p className="text-xs text-[#718096]">
              Persistent records. Click any row to inspect, edit, or delete.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/energy/readings"
              className="rounded-2xl neu-button px-4 py-2 text-xs font-bold text-[#238B57]"
            >
              Full History & CSV Export →
            </Link>
          </div>
        </div>

        {readings.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#718096]">
            No energy readings recorded yet. Click &quot;Add Energy Reading&quot; to begin your baseline.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[rgba(197,202,208,0.35)] text-[11px] font-bold uppercase tracking-wider text-[#718096]">
                  <th className="py-3 px-3">Billing Cycle</th>
                  <th className="py-3 px-3">Consumption</th>
                  <th className="py-3 px-3">Bill Amount</th>
                  <th className="py-3 px-3">Data Source</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(197,202,208,0.25)]">
                {readings.map((r) => (
                  <tr key={r.id} className="hover:neu-inset-sm transition">
                    <td className="py-3.5 px-3 font-bold text-[#253247]">
                      {new Date(r.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} –{' '}
                      {new Date(r.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {r.notes && <p className="text-[11px] font-normal text-[#718096]">{r.notes}</p>}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-sm font-extrabold text-[#238B57]">{r.consumptionKwh}</span>{' '}
                      <span className="text-[11px] text-[#718096]">kWh</span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#253247]">
                      ₹{(r.billAmount || estimateGujaratBill(r.consumptionKwh)).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="capitalize text-[#718096]">
                        {r.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge
                        label={r.status.replace('_', ' ')}
                        variant={r.status === 'verified' ? 'success' : 'neutral'}
                      />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(r)}
                          className="grid size-8 place-items-center rounded-xl neu-button text-[#718096] hover:text-[#238B57]"
                          title="Edit reading"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(r.id)}
                          className="grid size-8 place-items-center rounded-xl neu-button text-[#718096] hover:text-[#C0392B]"
                          title="Delete reading"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Reading Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#253247]/30 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl neu-raised p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(197,202,208,0.35)] pb-4">
              <h3 className="text-lg font-extrabold text-[#253247]">
                {editingReading ? 'Edit Energy Reading' : 'Log New Electricity Reading'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="grid size-8 place-items-center rounded-xl neu-button text-[#718096]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 rounded-2xl neu-inset p-3 text-xs font-bold text-[#C0392B]">
                  <AlertCircle size={15} /> {formError}
                </div>
              )}

              {formWarning && (
                <div className="flex items-center gap-2 rounded-2xl neu-inset p-3 text-xs font-bold text-[#d97706]">
                  <AlertCircle size={15} /> {formWarning}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                    Cycle Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs text-[#253247]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                    Cycle End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs text-[#253247]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                    Consumption <span className="font-normal">(kWh / units)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    placeholder="e.g. 260"
                    value={consumptionKwh}
                    onChange={(e) => handleKwhChange(e.target.value)}
                    className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs text-[#253247]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                    Bill Amount <span className="font-normal">(₹, optional)</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="Auto-calculated"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs text-[#253247]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                  Data Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-full appearance-none rounded-2xl neu-input py-2.5 px-3 text-xs font-bold text-[#253247] cursor-pointer"
                >
                  <option value="manual">Manual Entry from Bill</option>
                  <option value="bill_scan">Scanned Bill (UGVCL/DGVCL/MGVCL/PGVCL/Torrent)</option>
                  <option value="smart_meter">Smart Meter Reading</option>
                  <option value="discom_sync">Discom Portal Sync</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                  Notes <span className="font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Guests visited, high fan usage, AC serviced"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs text-[#253247]"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-[rgba(197,202,208,0.35)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-2xl neu-button px-4 py-2.5 text-xs font-bold text-[#718096]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl neu-button-primary px-5 py-2.5 text-xs font-bold cursor-pointer"
                >
                  {editingReading ? 'Save Changes' : 'Record Reading (+50 Pts)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteTargetId !== null}
        title="Delete Energy Reading"
        message="Are you sure you want to delete this recorded billing cycle? This will update your calculated baseline and history."
        confirmLabel="Delete Record"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
