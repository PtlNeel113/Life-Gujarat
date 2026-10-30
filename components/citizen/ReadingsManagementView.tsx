'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FileText,
  Download,
  Filter,
  Search,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit3,
  Eye,
  X,
  Zap,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { EnergyReading } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog'
import { estimateGujaratBill } from '@/lib/energy-calc'

export function ReadingsManagementView() {
  const [readings, setReadings] = useState<EnergyReading[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<'startDate' | 'consumptionKwh'>('startDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedReading, setSelectedReading] = useState<EnergyReading | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  useEffect(() => {
    refresh()
  }, [])

  const refresh = () => {
    setReadings(dataStore.getReadings())
  }

  const filtered = readings
    .filter((r) => {
      const matchesSearch =
        r.startDate.includes(searchTerm) ||
        r.endDate.includes(searchTerm) ||
        (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesSource = sourceFilter === 'all' || r.source === sourceFilter
      return matchesSearch && matchesSource
    })
    .sort((a, b) => {
      if (sortField === 'startDate') {
        const timeA = new Date(a.startDate).getTime()
        const timeB = new Date(b.startDate).getTime()
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA
      } else {
        return sortOrder === 'asc'
          ? a.consumptionKwh - b.consumptionKwh
          : b.consumptionKwh - a.consumptionKwh
      }
    })

  const toggleSort = (field: 'startDate' | 'consumptionKwh') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const exportCSV = () => {
    const headers = ['ID', 'Start Date', 'End Date', 'Consumption (kWh)', 'Bill Amount (INR)', 'Source', 'Status', 'Notes']
    const rows = readings.map((r) => [
      r.id,
      r.startDate,
      r.endDate,
      r.consumptionKwh,
      r.billAmount || estimateGujaratBill(r.consumptionKwh),
      r.source,
      r.status,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `LiFE_Gujarat_Energy_Readings_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const confirmDelete = () => {
    if (deleteTargetId) {
      dataStore.deleteReading(deleteTargetId)
      setDeleteTargetId(null)
      refresh()
      if (selectedReading?.id === deleteTargetId) {
        setSelectedReading(null)
      }
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Energy Readings Ledger"
        description="Comprehensive audit of all logged billing cycles, source validation, and historical consumption data."
        backHref="/energy"
        backLabel="Back to Energy Workspace"
        action={{
          label: 'Export CSV Ledger',
          onClick: exportCSV,
          icon: <Download size={15} />,
        }}
      />

      {/* Filter and Search Bar with Neumorphic Styling */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl neu-raised p-5">
        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718096] pointer-events-none" />
          <input
            type="text"
            placeholder="Search dates, notes, or cycle details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl neu-input py-2.5 pl-10 pr-4 text-xs text-[#253247]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-[#718096]" />
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="appearance-none rounded-2xl neu-input py-2.5 px-4 text-xs font-bold text-[#253247] cursor-pointer"
          >
            <option value="all">All Sources</option>
            <option value="manual">Manual Entry</option>
            <option value="bill_scan">Bill Scan</option>
            <option value="smart_meter">Smart Meter</option>
            <option value="discom_sync">Discom Sync</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-3xl neu-raised p-6 sm:p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgba(197,202,208,0.35)] text-[11px] font-bold uppercase tracking-wider text-[#718096]">
                <th
                  onClick={() => toggleSort('startDate')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#253247]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Billing Period</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('consumptionKwh')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#253247]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Units (kWh)</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th className="py-3.5 px-4">Estimated Bill</th>
                <th className="py-3.5 px-4">Verification Source</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(197,202,208,0.25)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#718096]">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:neu-inset-sm transition">
                    <td className="py-3.5 px-4 font-bold text-[#253247]">
                      {new Date(r.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} –{' '}
                      {new Date(r.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#238B57]">
                      {r.consumptionKwh} <span className="font-normal text-[11px] text-[#718096]">kWh</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#253247]">
                      ₹{(r.billAmount || estimateGujaratBill(r.consumptionKwh)).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-[#718096]">
                      {r.source.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge
                        label={r.status.replace('_', ' ')}
                        variant={r.status === 'verified' ? 'success' : 'neutral'}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReading(r)}
                          className="grid size-8 place-items-center rounded-xl neu-button text-[#718096] hover:text-[#238B57]"
                          title="Inspect Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(r.id)}
                          className="grid size-8 place-items-center rounded-xl neu-button text-[#718096] hover:text-[#C0392B]"
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Detail Modal */}
      {selectedReading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#253247]/30 backdrop-blur-sm" onClick={() => setSelectedReading(null)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl neu-raised p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(197,202,208,0.35)] pb-4">
              <h3 className="text-lg font-extrabold text-[#253247]">Cycle Detail View</h3>
              <button
                onClick={() => setSelectedReading(null)}
                className="grid size-8 place-items-center rounded-xl neu-button text-[#718096]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 space-y-3.5 text-xs">
              <div className="rounded-2xl neu-inset p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#718096]">Record ID:</span>
                  <span className="font-mono text-[#253247]">{selectedReading.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Billing Start:</span>
                  <span className="font-bold text-[#253247]">{selectedReading.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Billing End:</span>
                  <span className="font-bold text-[#253247]">{selectedReading.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Consumption:</span>
                  <span className="font-extrabold text-[#238B57]">{selectedReading.consumptionKwh} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Bill Amount:</span>
                  <span className="font-extrabold text-[#253247]">₹{(selectedReading.billAmount || estimateGujaratBill(selectedReading.consumptionKwh)).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Data Source:</span>
                  <span className="font-bold text-[#253247] capitalize">{selectedReading.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Verification Status:</span>
                  <StatusBadge
                    label={selectedReading.status}
                    variant={selectedReading.status === 'verified' ? 'success' : 'neutral'}
                  />
                </div>
              </div>

              {selectedReading.notes && (
                <div className="rounded-2xl neu-inset-sm p-3.5">
                  <p className="text-[10px] font-bold uppercase text-[#718096]">Household Notes</p>
                  <p className="mt-1 text-[#253247] leading-relaxed">{selectedReading.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedReading(null)}
                className="rounded-2xl neu-button px-5 py-2.5 text-xs font-bold text-[#253247]"
              >
                Close
              </button>
            </div>
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
