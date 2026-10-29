import React from 'react'

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'energy'
  | 'water'
  | 'waste'
  | 'transport'
  | 'food'

interface StatusBadgeProps {
  label: string
  variant?: BadgeVariant
  size?: 'sm' | 'md'
}

export function StatusBadge({ label, variant = 'neutral', size = 'sm' }: StatusBadgeProps) {
  const styles: Record<BadgeVariant, string> = {
    success: 'bg-[#E5F1DF] text-[#176B4D] border-[#C8E4BE]',
    warning: 'bg-[#FEF5E7] text-[#B07C2D] border-[#FADCA8]',
    error: 'bg-[#FEECEC] text-[#C0392B] border-[#F8BDBD]',
    info: 'bg-[#EBF3FD] text-[#2463EB] border-[#BFDBFE]',
    neutral: 'bg-[#F0F2EB] text-[#55635B] border-[#DCE0D4]',
    energy: 'bg-[#EBF7EE] text-[#147A46] border-[#BEE7C8]',
    water: 'bg-[#E8F4FB] text-[#0A6EA7] border-[#B8DFFA]',
    waste: 'bg-[#F8F1EB] text-[#9A5B2E] border-[#E8CEBE]',
    transport: 'bg-[#F5EDF9] text-[#7E3AA8] border-[#DFBFF0]',
    food: 'bg-[#FEF8E6] text-[#A67010] border-[#F7E2A3]',
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-md border ${styles[variant]} ${sizeClass}`}
    >
      {label}
    </span>
  )
}
