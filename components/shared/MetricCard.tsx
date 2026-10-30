import React from 'react'
import Link from 'next/link'
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  subtext?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: {
    value: number
    label: string
    isPositiveGood?: boolean
  }
  href?: string
}

export function MetricCard({
  title,
  value,
  unit,
  subtext,
  icon: Icon,
  iconColor = 'text-[#238B57]',
  iconBg = 'neu-inset-sm',
  trend,
  href,
}: MetricCardProps) {
  const content = (
    <div className="flex flex-col justify-between rounded-3xl neu-raised neu-raised-hover p-6 h-full transition select-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#718096]">{title}</p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-[#253247] tabular-nums">{value}</span>
            {unit && <span className="text-sm font-semibold text-[#718096]">{unit}</span>}
          </div>
        </div>
        <div className={`grid size-12 place-items-center rounded-2xl ${iconBg} ${iconColor} shrink-0`}>
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[rgba(197,202,208,0.35)] pt-3 text-xs">
        {trend ? (
          <div className="flex items-center gap-1.5 font-bold">
            {trend.value > 0 ? (
              <span
                className={`inline-flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-[11px] neu-inset-sm ${
                  trend.isPositiveGood ? 'text-[#238B57]' : 'text-[#C0392B]'
                }`}
              >
                <ArrowUpRight size={13} /> {Math.abs(trend.value)}%
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-[11px] neu-inset-sm ${
                  trend.isPositiveGood ? 'text-[#C0392B]' : 'text-[#238B57]'
                }`}
              >
                <ArrowDownRight size={13} /> {Math.abs(trend.value)}%
              </span>
            )}
            <span className="text-[#718096] font-normal">{trend.label}</span>
          </div>
        ) : (
          <span className="text-[#718096]">{subtext || 'Verified profile data'}</span>
        )}

        {href && (
          <span className="font-bold text-[#238B57] hover:underline">
            View details →
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    return <Link href={href} className="block h-full">{content}</Link>
  }

  return content
}
