'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Clock,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  User,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { LearnArticle, Mission } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

interface ArticleDetailViewProps {
  slug: string
}

export function ArticleDetailView({ slug }: ArticleDetailViewProps) {
  const [article, setArticle] = useState<LearnArticle | undefined>(undefined)
  const [relatedMissions, setRelatedMissions] = useState<Mission[]>([])

  useEffect(() => {
    const art = dataStore.getArticleBySlug(slug)
    setArticle(art)
    if (art) {
      const allMissions = dataStore.getMissions()
      const related = allMissions.filter((m) => art.relatedMissionIds.includes(m.id))
      setRelatedMissions(related)
    }
  }, [slug])

  if (!article) {
    return (
      <div className="rounded-3xl border border-[#E3E8DF] bg-white p-12 text-center">
        <h3 className="text-base font-bold text-[#103D30]">Article Not Found</h3>
        <p className="mt-1 text-xs text-[#66736B]">The requested guide could not be located.</p>
        <Link
          href="/learn"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#176B4D] px-4 py-2 text-xs font-bold text-white"
        >
          <ArrowLeft size={14} /> Back to Guides
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={article.title}
        description={article.summary}
        backHref="/learn"
        backLabel="Back to All Guides"
      />

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Main Article Content */}
        <div className="space-y-6">
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white border border-[#E3E8DF] p-4 text-xs text-[#66736B]">
            <StatusBadge label={article.category} variant="energy" />
            <span className="flex items-center gap-1">
              <Clock size={13} /> {article.readTime} read
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar size={13} /> Last reviewed: {article.lastReviewed}
            </span>
            <span>·</span>
            <span>Author: {article.author}</span>
          </div>

          {/* Key Takeaways Card */}
          <div className="rounded-3xl bg-[#EEF4E8] p-6 sm:p-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#176B4D]">
              Executive Summary & Key Takeaways
            </h3>
            <div className="mt-4 space-y-2.5">
              {article.keyTakeaways.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#18241F] leading-relaxed">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#176B4D] text-[10px] font-bold text-white">
                    ✓
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Body Sections */}
          <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8 space-y-6">
            {article.contentSections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-base font-bold text-[#103D30]">{sec.heading}</h4>
                <p className="text-xs leading-relaxed text-[#55635B]">{sec.body}</p>
              </div>
            ))}
          </div>

          {/* Action Checklist */}
          <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm sm:p-8">
            <h4 className="text-base font-bold text-[#103D30]">Household Action Checklist</h4>
            <div className="mt-4 space-y-2.5">
              {article.actionChecklist.map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 rounded-xl bg-[#FBFCF8] p-3 text-xs text-[#18241F] cursor-pointer hover:bg-[#F6F8F3]">
                  <input type="checkbox" className="size-4 accent-[#176B4D]" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Official Resources */}
          {article.officialResources.length > 0 && (
            <div className="rounded-2xl border border-[#E3E8DF] bg-white p-6 text-xs text-[#66736B]">
              <h4 className="font-bold text-[#103D30] mb-2">Official Government References:</h4>
              <div className="space-y-1.5">
                {article.officialResources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[#176B4D] font-semibold hover:underline"
                  >
                    <span>{res.name}</span>
                    <ExternalLink size={12} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Related Missions */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#103D30]">Related Mission LiFE Actions</h3>
            <p className="mt-1 text-xs text-[#66736B]">
              Turn knowledge from this guide into verified action on your profile.
            </p>

            <div className="mt-5 space-y-3">
              {relatedMissions.map((m) => (
                <div key={m.id} className="rounded-2xl bg-[#F6F8F3] p-4 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-[#176B4D] font-bold">
                    <span>{m.category}</span>
                    <span>+{m.points} pts</span>
                  </div>
                  <h4 className="mt-1.5 font-bold text-[#103D30]">{m.title}</h4>
                  <Link
                    href={`/missions/${m.id}`}
                    className="mt-3 inline-flex items-center gap-1 font-bold text-[#176B4D] hover:underline"
                  >
                    Start Mission <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
