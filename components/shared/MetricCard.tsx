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
  iconColor = 'text-[#176B4D]',
  iconBg = 'bg-[#EEF4E8]',
  trend,
  href,
}: MetricCardProps) {
  const content = (
    <div className="flex flex-col justify-between rounded-2xl border border-[#E3E8DF] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#738279]">{title}</p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-[#103D30]">{value}</span>
            {unit && <span className="text-sm font-semibold text-[#66736B]">{unit}</span>}
          </div>
        </div>
        <div className={`grid size-10 place-items-center rounded-xl ${iconBg} ${iconColor}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#F0F3EC] pt-3 text-xs">
        {trend ? (
          <div className="flex items-center gap-1 font-semibold">
            {trend.value > 0 ? (
              <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] ${
                trend.isPositiveGood ? 'bg-[#E5F1DF] text-[#176B4D]' : 'bg-[#FEECEC] text-[#C0392B]'
              }`}>
                <ArrowUpRight size={12} /> {Math.abs(trend.value)}%
              </span>
            ) : (
              <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] ${
                trend.isPositiveGood ? 'bg-[#FEECEC] text-[#C0392B]' : 'bg-[#E5F1DF] text-[#176B4D]'
              }`}>
                <ArrowDownRight size={12} /> {Math.abs(trend.value)}%
              </span>
            )}
            <span className="text-[#8E9B92] font-normal">{trend.label}</span>
          </div>
        ) : (
          <span className="text-[#8E9B92]">{subtext || 'Logged in profile'}</span>
        )}

        {href && (
          <span className="font-semibold text-[#176B4D] hover:underline">
            View details →
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    return <Link href={href} className="block">{content}</Link>
  }

  return content
}
