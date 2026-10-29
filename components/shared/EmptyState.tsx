import React from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D7E2D3] bg-white/60 p-10 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-[#EEF4E8] text-[#176B4D]">
        <Icon size={26} />
      </div>
      <h3 className="mt-4 text-base font-bold text-[#103D30]">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-[#66736B] leading-relaxed">{description}</p>
      {actionLabel && (
        <div className="mt-5">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#176B4D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#103D30]"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#176B4D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#103D30]"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
