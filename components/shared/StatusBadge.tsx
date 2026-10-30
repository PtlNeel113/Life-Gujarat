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
    success: 'text-[#238B57]',
    warning: 'text-[#d97706]',
    error: 'text-[#C0392B]',
    info: 'text-[#6489C7]',
    neutral: 'text-[#718096]',
    energy: 'text-[#238B57]',
    water: 'text-[#0284c7]',
    waste: 'text-[#b45309]',
    transport: 'text-[#8b5cf6]',
    food: 'text-[#059669]',
  }

  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center font-extrabold uppercase tracking-wider rounded-xl neu-inset-sm ${styles[variant]} ${sizeClass}`}
    >
      {label}
    </span>
  )
}
