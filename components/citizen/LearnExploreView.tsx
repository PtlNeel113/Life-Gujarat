'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  ShieldCheck,
  Tag,
  Calendar,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { LearnArticle } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function LearnExploreView() {
  const [articles, setArticles] = useState<LearnArticle[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  useEffect(() => {
    setArticles(dataStore.getArticles())
  }, [])

  const categories = ['All', 'Energy Efficiency', 'Rooftop Solar']

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = categoryFilter === 'All' || a.category === categoryFilter
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sustainability Knowledge & Practical Guides"
        description="Clear, technically verified guidance on cooling thermodynamics, energy tariffs, BLDC motor technology, and solar installations for homes in Gujarat."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E3E8DF] bg-white p-4 shadow-sm sm:p-5">
        <div className="relative min-w-[260px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9B92]" />
          <input
            type="text"
            placeholder="Search guides (e.g. BLDC fans, PM Surya Ghar, AC 24°C)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] py-2 pl-9 pr-3 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-[#F0F4EC] p-1 text-xs font-semibold">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`rounded-lg px-3 py-1 transition ${
                  categoryFilter === c ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#66736B]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((art) => (
          <div
            key={art.slug}
            className="flex flex-col justify-between rounded-3xl border border-[#E3E8DF] bg-white p-6 shadow-xs hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#8E9B92]">
                <StatusBadge label={art.category} variant="energy" />
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {art.readTime}
                </span>
              </div>

              <h3 className="mt-4 text-base font-bold text-[#103D30] leading-snug">
                {art.title}
              </h3>
              <p className="mt-2 text-xs text-[#66736B] leading-relaxed line-clamp-3">
                {art.summary}
              </p>

              <div className="mt-5 space-y-1.5 border-t border-[#F0F3EC] pt-4 text-[11px] text-[#55635B]">
                <p className="font-bold text-[#103D30]">Key Takeaways:</p>
                {art.keyTakeaways.slice(0, 2).map((k, i) => (
                  <p key={i} className="flex items-start gap-1.5 leading-relaxed text-[#66736B]">
                    <span className="text-[#176B4D] font-bold">•</span>
                    <span>{k}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-[#F0F3EC] pt-4">
              <Link
                href={`/learn/${art.slug}`}
                className="flex items-center justify-between text-xs font-bold text-[#176B4D] hover:underline"
              >
                <span>Read Full Citizen Guide</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
