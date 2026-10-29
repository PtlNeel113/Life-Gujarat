'use client'

import React, { useState, useEffect } from 'react'
import {
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  Filter,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { MissionSubmission } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function AdminEvidenceView() {
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('pending')
  const [reviewingItem, setReviewingItem] = useState<MissionSubmission | null>(null)
  const [rejectionNote, setRejectionNote] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')

  useEffect(() => {
    refresh()
  }, [])

  const refresh = () => {
    setSubmissions(dataStore.getSubmissions())
  }

  const handleApprove = (item: MissionSubmission) => {
    const adminUser = dataStore.getUser()
    dataStore.reviewSubmission(item.id, 'approved', adminUser.name)
    setReviewingItem(null)
    setActionSuccess(`Approved submission from ${item.userName}. +${item.pointsAwarded} points credited to citizen.`)
    setTimeout(() => setActionSuccess(''), 4000)
    refresh()
  }

  const handleReject = (item: MissionSubmission) => {
    const adminUser = dataStore.getUser()
    dataStore.reviewSubmission(item.id, 'rejected', adminUser.name, rejectionNote || 'Evidence does not clearly satisfy verification criteria.')
    setReviewingItem(null)
    setRejectionNote('')
    setActionSuccess(`Rejected submission from ${item.userName}. Feedback recorded.`)
    setTimeout(() => setActionSuccess(''), 4000)
    refresh()
  }

  const filtered = submissions.filter((s) => {
    if (filterStatus === 'all') return true
    return s.status === filterStatus
  })

  return (
    <div className="space-y-8">
      <PageHeader
        title="Citizen Evidence Verification Desk"
        description="Audit citizen photos, declarations, and meter readings. Approved submissions automatically disburse verified LiFE points into citizen ledgers."
      />

      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#E5F1DF] p-4 text-xs font-semibold text-[#176B4D]">
          <CheckCircle2 size={16} /> {actionSuccess}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-[#E3E8DF] bg-white p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-[#8E9B92]" />
          <span className="text-xs font-bold text-[#103D30]">Status:</span>
          <div className="flex items-center rounded-xl bg-[#F0F4EC] p-1 text-xs font-semibold">
            {['pending', 'approved', 'rejected', 'all'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-lg px-3 py-1 capitalize transition ${
                  filterStatus === st ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#66736B]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-[#8E9B92]">
          Showing {filtered.length} submission{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-[#E3E8DF] bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FBFCF8] border-b border-[#E3E8DF] text-[11px] font-bold uppercase tracking-wider text-[#8E9B92]">
            <tr>
              <th className="py-3.5 px-4">Citizen & District</th>
              <th className="py-3.5 px-4">Mission</th>
              <th className="py-3.5 px-4">Submission Notes</th>
              <th className="py-3.5 px-4">Value</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F3EC]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#8E9B92]">
                  No submissions in this status category.
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#F9FAF6] transition">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#103D30] block">{sub.userName}</span>
                    <span className="text-[10px] text-[#8E9B92]">{sub.userDistrict}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#176B4D]">
                    {sub.missionTitle}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs text-[#66736B] truncate">
                    {sub.evidenceText || 'Self-declaration logged'}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#103D30]">
                    +{sub.pointsAwarded} pts
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge
                      label={sub.status}
                      variant={sub.status === 'approved' ? 'success' : sub.status === 'pending' ? 'warning' : 'error'}
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {sub.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(sub)}
                          className="rounded-lg bg-[#E5F1DF] p-1.5 text-[#176B4D] hover:bg-[#D5E7CE]"
                          title="Approve & Award Points"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setReviewingItem(sub)}
                          className="rounded-lg bg-[#FEECEC] p-1.5 text-[#C0392B] hover:bg-[#FBD5D5]"
                          title="Reject with Note"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#8E9B92]">
                        Audited by {sub.reviewedBy || 'System'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Rejection Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setReviewingItem(null)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#D7E2D3] bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#103D30]">Reject Submission Reason</h3>
            <p className="text-xs text-[#66736B]">
              Please state why this evidence does not meet standards so the citizen can rectify and resubmit.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Photo does not clearly show AC remote thermostat set at 24°C..."
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              className="w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-3 text-xs text-[#103D30] outline-none focus:border-[#C0392B]"
            />

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setReviewingItem(null)}
                className="rounded-xl border border-[#D7E2D3] px-4 py-2 text-xs font-semibold text-[#55635B]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(reviewingItem)}
                className="rounded-xl bg-[#C0392B] px-4 py-2 text-xs font-bold text-white hover:bg-[#A93226]"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
