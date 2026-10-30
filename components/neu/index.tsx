'use client'

import React, { forwardRef } from 'react'
import Link from 'next/link'
import { LucideIcon, ArrowUpRight, ArrowDownRight, ChevronDown } from 'lucide-react'

/* ==========================================================================
   NeumorphicCard
   ========================================================================== */
export interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'raised' | 'raised-sm' | 'raised-lg' | 'inset' | 'inset-sm' | 'flat'
  hoverEffect?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

export function NeumorphicCard({
  variant = 'raised',
  hoverEffect = false,
  padding = 'md',
  className = '',
  children,
  ...props
}: NeumorphicCardProps) {
  const variantClass = {
    raised: 'neu-raised',
    'raised-sm': 'neu-raised-sm',
    'raised-lg': 'neu-raised-lg',
    inset: 'neu-inset',
    'inset-sm': 'neu-inset-sm',
    flat: 'neu-flat',
  }[variant]

  const paddingClass = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-10',
  }[padding]

  const hoverClass = hoverEffect ? 'neu-raised-hover' : ''

  return (
    <div
      className={`rounded-3xl ${variantClass} ${hoverClass} ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

/* ==========================================================================
   NeumorphicButton
   ========================================================================== */
export interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'raised' | 'primary' | 'accent' | 'inset' | 'flat'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  href?: string
  active?: boolean
}

export function NeumorphicButton({
  variant = 'raised',
  size = 'md',
  icon,
  iconRight,
  href,
  active = false,
  className = '',
  children,
  disabled,
  ...props
}: NeumorphicButtonProps) {
  const variantClass = {
    raised: 'neu-button',
    primary: 'neu-button-primary',
    accent: 'neu-button-accent',
    inset: 'neu-inset font-semibold text-[#238B57]',
    flat: 'neu-flat hover:neu-raised-sm text-[#253247]',
  }[variant]

  const sizeClass = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4.5 py-2.5 text-sm rounded-2xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5',
  }[size]

  const combinedClasses = `inline-flex items-center justify-center font-bold tracking-tight cursor-pointer transition ${variantClass} ${sizeClass} ${active ? 'neu-inset text-[#238B57]' : ''} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {icon}
        {children}
        {iconRight}
      </Link>
    )
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {icon}
      {children}
      {iconRight}
    </button>
  )
}

/* ==========================================================================
   NeumorphicInput
   ========================================================================== */
export interface NeumorphicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  label?: string
  error?: string
  helperText?: string
}

export const NeumorphicInput = forwardRef<HTMLInputElement, NeumorphicInputProps>(
  ({ icon, iconRight, label, error, helperText, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block mb-2 text-xs font-bold uppercase tracking-wider text-[#718096]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#718096]">
              {icon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={`w-full rounded-2xl neu-input py-3 text-sm text-[#253247] placeholder:text-[#718096]/70 ${
              icon ? 'pl-11' : 'pl-4'
            } ${iconRight ? 'pr-11' : 'pr-4'} ${error ? 'border-red-400 focus:border-red-500' : ''} ${className}`}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3.5 flex items-center text-[#718096]">
              {iconRight}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-[#718096]">{helperText}</p>
        ) : null}
      </div>
    )
  }
)
NeumorphicInput.displayName = 'NeumorphicInput'

/* ==========================================================================
   NeumorphicSelect
   ========================================================================== */
export interface NeumorphicSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export function NeumorphicSelect({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  children,
  ...props
}: NeumorphicSelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block mb-2 text-xs font-bold uppercase tracking-wider text-[#718096]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#718096]">
            {icon}
          </div>
        )}
        <select
          id={id}
          className={`w-full appearance-none rounded-2xl neu-input py-3 pr-10 text-sm text-[#253247] cursor-pointer ${
            icon ? 'pl-11' : 'pl-4'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3.5 flex items-center pointer-events-none text-[#718096]">
          <ChevronDown size={18} />
        </div>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-[#718096]">{helperText}</p>
      ) : null}
    </div>
  )
}

/* ==========================================================================
   NeumorphicToggle
   ========================================================================== */
export interface NeumorphicToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
}

export function NeumorphicToggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: NeumorphicToggleProps) {
  return (
    <label className={`flex items-start justify-between gap-4 cursor-pointer select-none ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {(label || description) && (
        <div className="flex-1">
          {label && <p className="text-sm font-bold text-[#253247]">{label}</p>}
          {description && <p className="text-xs text-[#718096] mt-0.5 leading-relaxed">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-7 w-13 shrink-0 rounded-full transition-all duration-300 p-1 ${
          checked ? 'neu-inset bg-[#238B57]/15' : 'neu-inset bg-[#E8EDF3]'
        }`}
      >
        <span
          className={`inline-block size-5 rounded-full transition-transform duration-300 ${
            checked
              ? 'translate-x-6 bg-[#238B57] shadow-sm'
              : 'translate-x-0 bg-[#E8EDF3] neu-raised-sm'
          }`}
        />
      </button>
    </label>
  )
}

/* ==========================================================================
   NeumorphicProgress
   ========================================================================== */
export interface NeumorphicProgressProps {
  value: number // 0 to 100
  label?: string
  valueLabel?: string
  color?: 'green' | 'blue' | 'amber'
  height?: 'sm' | 'md' | 'lg'
  className?: string
}

export function NeumorphicProgress({
  value,
  label,
  valueLabel,
  color = 'green',
  height = 'md',
  className = '',
}: NeumorphicProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  const heightClass = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  }[height]

  const colorGradient = {
    green: 'bg-gradient-to-r from-[#65B98A] to-[#238B57]',
    blue: 'bg-gradient-to-r from-[#8ba7df] to-[#6489C7]',
    amber: 'bg-gradient-to-r from-[#f7c873] to-[#e67e22]',
  }[color]

  return (
    <div className={`w-full ${className}`}>
      {(label || valueLabel) && (
        <div className="flex items-center justify-between text-xs mb-2">
          {label && <span className="font-semibold text-[#718096]">{label}</span>}
          {valueLabel && <span className="font-bold text-[#253247] tabular-nums">{valueLabel}</span>}
        </div>
      )}
      <div className={`w-full rounded-full neu-inset p-0.5 overflow-hidden ${heightClass}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorGradient} shadow-sm`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}

/* ==========================================================================
   NeumorphicStatCard
   ========================================================================== */
export interface NeumorphicStatCardProps {
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

export function NeumorphicStatCard({
  title,
  value,
  unit,
  subtext,
  icon: Icon,
  iconColor = 'text-[#238B57]',
  iconBg = 'neu-inset-sm',
  trend,
  href,
}: NeumorphicStatCardProps) {
  const content = (
    <div className="flex flex-col justify-between rounded-3xl neu-raised neu-raised-hover p-6 h-full transition">
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
          <span className="text-[#718096]">{subtext || 'Verified record'}</span>
        )}

        {href && (
          <span className="font-bold text-[#238B57] hover:underline">
            View →
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

/* ==========================================================================
   NeumorphicTabs
   ========================================================================== */
export interface NeumorphicTabsProps<T extends string> {
  tabs: { id: T; label: string; icon?: React.ReactNode }[]
  activeTab: T
  onChange: (id: T) => void
  size?: 'sm' | 'md'
  className?: string
}

export function NeumorphicTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  size = 'md',
  className = '',
}: NeumorphicTabsProps<T>) {
  const padClass = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'

  return (
    <div className={`inline-flex items-center rounded-2xl neu-inset p-1.5 gap-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${padClass} ${
              isActive
                ? 'neu-raised text-[#238B57]'
                : 'text-[#718096] hover:text-[#253247]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ==========================================================================
   NeumorphicBadge
   ========================================================================== */
export interface NeumorphicBadgeProps {
  label: string
  variant?: 'green' | 'blue' | 'amber' | 'red' | 'neutral'
  inset?: boolean
  className?: string
}

export function NeumorphicBadge({
  label,
  variant = 'green',
  inset = true,
  className = '',
}: NeumorphicBadgeProps) {
  const colors = {
    green: 'text-[#238B57]',
    blue: 'text-[#6489C7]',
    amber: 'text-[#d97706]',
    red: 'text-[#C0392B]',
    neutral: 'text-[#718096]',
  }[variant]

  const shadowClass = inset ? 'neu-inset-sm' : 'neu-raised-sm'

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider ${shadowClass} ${colors} ${className}`}
    >
      {label}
    </span>
  )
}
