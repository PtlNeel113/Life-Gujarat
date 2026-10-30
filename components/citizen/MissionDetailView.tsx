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
      <div className="rounded-3xl neu-raised p-12 text-center">
        <h3 className="text-lg font-extrabold text-[#253247]">Mission Not Found</h3>
        <p className="mt-2 text-xs text-[#718096]">The requested Mission LiFE action does not exist.</p>
        <Link
          href="/missions"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl neu-button-primary px-5 py-2.5 text-xs font-bold"
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
          {/* Why It Matters Callout in Soft Inset */}
          <div className="rounded-3xl neu-raised p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#238B57]">
              <Leaf size={16} /> Environmental Rationale
            </div>
            <h3 className="text-xl font-extrabold text-[#253247] leading-snug">Why This Choice Matters</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-[#718096]">{mission.whyItMatters}</p>

            <div className="flex flex-wrap items-center gap-4 border-t border-[rgba(197,202,208,0.35)] pt-4 text-xs font-bold text-[#253247]">
              <span className="flex items-center gap-1.5 text-[#238B57]">
                <Zap size={15} /> Estimated ~{mission.estimatedCo2ReductionKg} kg CO₂ avoided
              </span>
              <span className="text-[#718096]">·</span>
              <span className="rounded-xl neu-inset-sm px-2.5 py-1 text-[#238B57]">
                +{mission.points} LiFE points
              </span>
            </div>
          </div>

          {/* Action Checklist */}
          <div className="rounded-3xl neu-raised p-6 sm:p-8">
            <h3 className="text-base font-extrabold text-[#253247]">Step-by-Step Instructions</h3>
            <div className="mt-5 space-y-3">
              {mission.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3.5 rounded-2xl neu-inset p-4 text-xs">
                  <span className="grid size-6 shrink-0 place-items-center rounded-xl neu-raised text-[11px] font-extrabold text-[#238B57]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed text-[#253247] font-medium">{step}</span>
                </div>
              ))}
            </div>

            {mission.officialGuidanceUrl && (
              <div className="mt-6 border-t border-[rgba(197,202,208,0.35)] pt-4">
                <a
                  href={mission.officialGuidanceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#238B57] hover:underline"
                >
                  View official MoEFCC / BEE technical standard <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>

          {/* Action Submission Form */}
          <div className="rounded-3xl neu-raised p-6 sm:p-8">
            <h3 className="text-base font-extrabold text-[#253247]">Complete Mission &amp; Submit Evidence</h3>
            <p className="mt-1 text-xs text-[#718096]">
              Verification Requirement: <strong className="text-[#253247]">{mission.verificationLevel}</strong>
            </p>

            {isApproved ? (
              <div className="mt-5 rounded-2xl neu-inset p-5 text-xs font-bold text-[#238B57] flex items-start gap-3">
                <CheckCircle2 size={22} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-extrabold">Mission Successfully Completed &amp; Verified!</p>
                  <p className="mt-1 text-[#718096] font-normal leading-relaxed">
                    Your evidence was confirmed. +{mission.points} points are safely deposited into your ledger.
                  </p>
                </div>
              </div>
            ) : isPending ? (
              <div className="mt-5 rounded-2xl neu-inset p-5 text-xs font-bold text-[#d97706] flex items-start gap-3">
                <ShieldCheck size={22} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-extrabold">Evidence Submitted — Review in Progress</p>
                  <p className="mt-1 text-[#718096] font-normal leading-relaxed">
                    Our LiFE Gujarat review desk is validating your submission. Points will be automatically awarded upon approval.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {submitError && (
                  <div className="flex items-center gap-2 rounded-2xl neu-inset p-3 text-xs font-bold text-[#C0392B]">
                    <AlertCircle size={15} /> {submitError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                    Action Notes / Citizen Declaration <span className="text-[#C0392B]">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe how you completed this action (e.g. Set bedroom AC thermostat to 24°C alongside ceiling fan; verified with family members)..."
                    value={evidenceText}
                    onChange={(e) => setEvidenceText(e.target.value)}
                    className="w-full rounded-2xl neu-input p-3 text-xs text-[#253247]"
                  />
                </div>

                {mission.verificationLevel === 'Photo Evidence' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                      Photo Evidence Attachment <span className="font-normal">(Optional snapshot)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 rounded-2xl neu-button px-4 py-2.5 text-xs font-bold text-[#253247]">
                        <Upload size={14} className="text-[#238B57]" />
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
                        <span className="text-xs text-[#238B57] font-bold">{submittedFile}</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-2xl neu-button-primary px-6 py-3 text-xs font-bold cursor-pointer disabled:opacity-50"
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
          <div className="rounded-3xl neu-raised p-6 sm:p-8">
            <h3 className="text-sm font-extrabold text-[#253247]">Mission Criteria</h3>
            <div className="mt-4 space-y-3 text-xs text-[#718096]">
              <div className="flex justify-between border-b border-[rgba(197,202,208,0.35)] pb-2.5">
                <span>Category:</span>
                <StatusBadge label={mission.category} variant="energy" />
              </div>
              <div className="flex justify-between border-b border-[rgba(197,202,208,0.35)] pb-2.5">
                <span>Difficulty:</span>
                <strong className="text-[#253247]">{mission.difficulty}</strong>
              </div>
              <div className="flex justify-between border-b border-[rgba(197,202,208,0.35)] pb-2.5">
                <span>Estimated Time:</span>
                <span className="flex items-center gap-1 font-bold text-[#253247]">
                  <Clock size={13} /> {mission.duration}
                </span>
              </div>
              <div className="flex justify-between border-b border-[rgba(197,202,208,0.35)] pb-2.5">
                <span>Reward Value:</span>
                <strong className="text-sm font-extrabold text-[#238B57]">+{mission.points} Points</strong>
              </div>
              <div className="flex justify-between border-b border-[rgba(197,202,208,0.35)] pb-2.5">
                <span>Verification:</span>
                <StatusBadge label={mission.verificationLevel} variant="neutral" />
              </div>
            </div>

            <div className="mt-6 rounded-2xl neu-inset p-4 text-xs text-[#718096]">
              <p className="font-bold text-[#253247] mb-1">Duplicate Prevention Policy</p>
              Citizens can claim points once per active cycle. Our verification engine checks against repeated declarations.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
