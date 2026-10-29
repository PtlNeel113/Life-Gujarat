import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
    variant?: 'primary' | 'secondary' | 'outline'
  }
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
  }
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel = 'Back',
  action,
  secondaryAction,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#176B4D] hover:underline"
          >
            <ArrowLeft size={13} /> {backLabel}
          </Link>
        )}
        <h2 className="text-2xl font-extrabold tracking-tight text-[#103D30] sm:text-3xl">{title}</h2>
        {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#66736B]">{description}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {secondaryAction && (
          secondaryAction.href ? (
            <Link
              href={secondaryAction.href}
              className="inline-flex items-center gap-2 rounded-xl border border-[#D7E2D3] bg-white px-4 py-2.5 text-xs font-bold text-[#103D30] shadow-sm transition hover:bg-[#F6F8F3]"
            >
              {secondaryAction.icon}
              {secondaryAction.label}
            </Link>
          ) : (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center gap-2 rounded-xl border border-[#D7E2D3] bg-white px-4 py-2.5 text-xs font-bold text-[#103D30] shadow-sm transition hover:bg-[#F6F8F3]"
            >
              {secondaryAction.icon}
              {secondaryAction.label}
            </button>
          )
        )}

        {action && (
          action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 rounded-xl bg-[#176B4D] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#103D30]"
            >
              {action.icon}
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 rounded-xl bg-[#176B4D] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#103D30]"
            >
              {action.icon}
              {action.label}
            </button>
          )
        )}
      </div>
    </div>
  )
}
