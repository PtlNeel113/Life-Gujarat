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

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E3E8DF] bg-white p-4 shadow-sm">
        <div className="relative min-w-[240px] flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9B92]" />
          <input
            type="text"
            placeholder="Search dates, notes, or cycle details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] py-2 pl-9 pr-3 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#8E9B92]" />
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] px-3 py-2 text-xs font-semibold text-[#103D30] outline-none"
          >
            <option value="all">All Sources</option>
            <option value="manual">Manual Entry</option>
            <option value="bill_scan">Bill Scan</option>
            <option value="smart_meter">Smart Meter</option>
            <option value="discom_sync">Discom Sync</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl border border-[#E3E8DF] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFCF8] border-b border-[#E3E8DF] text-[11px] font-bold uppercase tracking-wider text-[#8E9B92]">
              <tr>
                <th
                  onClick={() => toggleSort('startDate')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#103D30]"
                >
                  <div className="flex items-center gap-1">
                    <span>Billing Period</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('consumptionKwh')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#103D30]"
                >
                  <div className="flex items-center gap-1">
                    <span>Units (kWh)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3.5 px-4">Estimated Bill</th>
                <th className="py-3.5 px-4">Verification Source</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F3EC]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8E9B92]">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F9FAF6] transition">
                    <td className="py-3.5 px-4 font-semibold text-[#103D30]">
                      {new Date(r.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} –{' '}
                      {new Date(r.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#176B4D]">
                      {r.consumptionKwh} <span className="font-normal text-[11px] text-[#8E9B92]">kWh</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#103D30]">
                      ₹{(r.billAmount || estimateGujaratBill(r.consumptionKwh)).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-[#66736B]">
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
                          className="rounded-lg p-1.5 text-[#55635B] hover:bg-[#EEF4E8] hover:text-[#176B4D]"
                          title="Inspect Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(r.id)}
                          className="rounded-lg p-1.5 text-[#55635B] hover:bg-[#FEECEC] hover:text-[#C0392B]"
                          title="Delete Record"
                        >
                          <Trash2 size={15} />
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

      {/* Reading Detail Drawer */}
      {selectedReading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedReading(null)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#D7E2D3] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E3E8DF] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#103D30]">Billing Cycle Audit Details</h3>
                <p className="text-[11px] text-[#8E9B92]">Record ID: {selectedReading.id}</p>
              </div>
              <button onClick={() => setSelectedReading(null)} className="text-[#8E9B92] hover:text-[#103D30]">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-[#55635B]">
              <div className="flex justify-between border-b border-[#F0F3EC] pb-2">
                <span>Start Date:</span>
                <strong className="text-[#103D30]">{selectedReading.startDate}</strong>
              </div>
              <div className="flex justify-between border-b border-[#F0F3EC] pb-2">
                <span>End Date:</span>
                <strong className="text-[#103D30]">{selectedReading.endDate}</strong>
              </div>
              <div className="flex justify-between border-b border-[#F0F3EC] pb-2">
                <span>Consumption:</span>
                <strong className="text-[#176B4D] font-bold">{selectedReading.consumptionKwh} kWh</strong>
              </div>
              <div className="flex justify-between border-b border-[#F0F3EC] pb-2">
                <span>Bill Amount:</span>
                <strong className="text-[#103D30]">₹{selectedReading.billAmount || estimateGujaratBill(selectedReading.consumptionKwh)}</strong>
              </div>
              <div className="flex justify-between border-b border-[#F0F3EC] pb-2">
                <span>Data Source:</span>
                <span className="capitalize">{selectedReading.source.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between border-b border-[#F0F3EC] pb-2">
                <span>Validation:</span>
                <StatusBadge label={selectedReading.status} variant="success" />
              </div>
              <div className="flex justify-between border-b border-[#F0F3EC] pb-2">
                <span>Logged At:</span>
                <span>{new Date(selectedReading.createdAt).toLocaleString('en-IN')}</span>
              </div>
              {selectedReading.notes && (
                <div className="rounded-xl bg-[#F6F8F3] p-3 text-xs text-[#66736B]">
                  <strong className="block text-[#103D30] mb-0.5">User Notes:</strong>
                  {selectedReading.notes}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedReading(null)}
                className="rounded-xl bg-[#176B4D] px-4 py-2 text-xs font-bold text-white hover:bg-[#103D30]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteTargetId !== null}
        title="Delete Record"
        message="Are you sure you want to delete this recorded reading?"
        confirmLabel="Delete"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
