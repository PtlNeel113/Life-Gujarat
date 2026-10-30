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
    <div className="flex flex-col items-center justify-center rounded-3xl neu-inset p-10 text-center">
      <div className="grid size-16 place-items-center rounded-3xl neu-raised text-[#238B57]">
        <Icon size={28} />
      </div>
      <h3 className="mt-5 text-base font-extrabold text-[#253247]">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs text-[#718096] leading-relaxed">{description}</p>
      {actionLabel && (
        <div className="mt-6">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1.5 rounded-2xl neu-button-primary px-5 py-2.5 text-xs font-bold"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-1.5 rounded-2xl neu-button-primary px-5 py-2.5 text-xs font-bold cursor-pointer"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
