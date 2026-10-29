'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowLeft,
  Upload,
  AlertCircle,
  ExternalLink,
  Award,
  Leaf,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { Mission, MissionSubmission } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

interface MissionDetailViewProps {
  missionId: string
}

export function MissionDetailView({ missionId }: MissionDetailViewProps) {
  const [mission, setMission] = useState<Mission | undefined>(undefined)
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([])
  const [evidenceText, setEvidenceText] = useState('')
  const [submittedFile, setSubmittedFile] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    refresh()
  }, [missionId])

  const refresh = () => {
    const m = dataStore.getMissionById(missionId)
    setMission(m)
    const userSubs = dataStore.getUserSubmissions(dataStore.getUser().id)
    setSubmissions(userSubs)
  }

  if (!mission) {
    return (
      <div className="rounded-3xl border border-[#E3E8DF] bg-white p-12 text-center">
        <h3 className="text-lg font-bold text-[#103D30]">Mission Not Found</h3>
        <p className="mt-2 text-xs text-[#66736B]">The requested Mission LiFE action does not exist.</p>
        <Link
          href="/missions"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#176B4D] px-4 py-2 text-xs font-bold text-white"
        >
          <ArrowLeft size={14} /> Back to Missions
        </Link>
      </div>
    )
  }

  const existingSubmission = submissions.find((s) => s.missionId === mission.id)
  const isApproved = existingSubmission?.status === 'approved'
  const isPending = existingSubmission?.status === 'pending'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (!evidenceText.trim()) {
      setSubmitError('Please provide a short declaration or description of your action.')
      return
    }

    try {
      setIsSubmitting(true)
      dataStore.submitMissionEvidence(mission.id, evidenceText)
      setSubmitSuccess(true)
      refresh()
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit evidence.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={mission.title}
        description={mission.description}
        backHref="/missions"
        backLabel="Back to All Missions"
      />

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left Column: Mission Guidance & Submission */}
        <div className="space-y-6">
          {/* Why It Matters Callout */}
          <div className="rounded-3xl bg-[#103D30] p-6 text-white shadow-sm sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B8E986]">
              <Leaf size={15} /> Environmental Rationale
            </div>
            <h3 className="mt-3 text-xl font-bold leading-snug">Why This Choice Matters</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/80">{mission.whyItMatters}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 text-xs text-white/90">
              <span className="flex items-center gap-1.5">
                <Zap size={14} className="text-[#B8E986]" /> Estimated ~{mission.estimatedCo2ReductionKg} kg CO₂ avoided
              </span>
              <span>·</span>
              <span className="font-semibold text-[#B8E986]">+{mission.points} LiFE points</span>
            </div>
          </div>

          {/* Action Checklist */}
          <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-base font-bold text-[#103D30]">Step-by-Step Instructions</h3>
            <div className="mt-5 space-y-3">
              {mission.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-2xl bg-[#F6F8F3] p-4 text-xs">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#176B4D] text-[11px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed text-[#18241F]">{step}</span>
                </div>
              ))}
            </div>

            {mission.officialGuidanceUrl && (
              <div className="mt-6 border-t border-[#F0F3EC] pt-4">
                <a
                  href={mission.officialGuidanceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#176B4D] hover:underline"
                >
                  View official MoEFCC / BEE technical standard <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>

          {/* Action Submission Form */}
          <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-base font-bold text-[#103D30]">Complete Mission & Submit Evidence</h3>
            <p className="mt-1 text-xs text-[#66736B]">
              Verification Requirement: <strong className="text-[#103D30]">{mission.verificationLevel}</strong>
            </p>

            {isApproved ? (
              <div className="mt-5 rounded-2xl bg-[#E5F1DF] p-5 text-xs font-semibold text-[#176B4D] flex items-start gap-3">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Mission Successfully Completed & Verified!</p>
                  <p className="mt-1 text-[#103D30]/80">
                    Your evidence was confirmed. +{mission.points} points are safely deposited into your ledger.
                  </p>
                </div>
              </div>
            ) : isPending ? (
              <div className="mt-5 rounded-2xl bg-[#FEF5E7] p-5 text-xs font-semibold text-[#B07C2D] flex items-start gap-3">
                <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Evidence Submitted — Review in Progress</p>
                  <p className="mt-1 text-[#103D30]/80">
                    Our LiFE Gujarat review desk is validating your submission. Points will be automatically awarded upon approval.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {submitError && (
                  <div className="flex items-center gap-2 rounded-xl bg-[#FEECEC] p-3 text-xs font-semibold text-[#C0392B]">
                    <AlertCircle size={15} /> {submitError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#103D30]">
                    Action Notes / Citizen Declaration <span className="text-[#C0392B]">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe how you completed this action (e.g. Set bedroom AC thermostat to 24°C alongside ceiling fan; verified with family members)..."
                    value={evidenceText}
                    onChange={(e) => setEvidenceText(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-3 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
                  />
                </div>

                {mission.verificationLevel === 'Photo Evidence' && (
                  <div>
                    <label className="block text-xs font-bold text-[#103D30]">
                      Photo Evidence Attachment <span className="font-normal text-[#8E9B92]">(Optional snapshot)</span>
                    </label>
                    <div className="mt-1.5 flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] px-4 py-2.5 text-xs font-semibold text-[#103D30] hover:bg-[#EEF4E8]">
                        <Upload size={14} className="text-[#176B4D]" />
                        <span>{submittedFile ? 'Photo Attached' : 'Attach Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSubmittedFile(e.target.files[0].name)
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      {submittedFile && (
                        <span className="text-xs text-[#176B4D] font-semibold">{submittedFile}</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#176B4D] px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#103D30] disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    {mission.verificationLevel === 'Self-Declaration'
                      ? 'Submit Declaration & Claim Points'
                      : 'Submit for LiFE Verification'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Mission Meta & Points Breakdown */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#103D30]">Mission Criteria</h3>
            <div className="mt-4 space-y-3 text-xs text-[#55635B]">
              <div className="flex justify-between border-b border-[#F0F3EC] pb-2">
                <span>Category:</span>
                <StatusBadge label={mission.category} variant="energy" />
              </div>
              <div className="flex justify-between border-b border-[#F0F3EC] pb-2">
                <span>Difficulty:</span>
                <strong className="text-[#103D30]">{mission.difficulty}</strong>
              </div>
              <div className="flex justify-between border-b border-[#F0F3EC] pb-2">
                <span>Estimated Time:</span>
                <span className="flex items-center gap-1 font-semibold text-[#103D30]">
                  <Clock size={13} /> {mission.duration}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#F0F3EC] pb-2">
                <span>Reward Value:</span>
                <strong className="text-sm font-bold text-[#176B4D]">+{mission.points} Points</strong>
              </div>
              <div className="flex justify-between border-b border-[#F0F3EC] pb-2">
                <span>Verification:</span>
                <StatusBadge label={mission.verificationLevel} variant="neutral" />
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#FBFCF8] p-4 border border-[#E3E8DF] text-xs text-[#66736B]">
              <p className="font-bold text-[#103D30] mb-1">Duplicate Prevention Policy</p>
              Citizens can claim points once per active cycle. Our verification engine checks against repeated declarations.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
