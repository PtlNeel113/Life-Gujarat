'use client'

import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  isDestructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#D7E2D3] bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div
            className={`grid size-10 shrink-0 place-items-center rounded-xl ${
              isDestructive ? 'bg-[#FEECEC] text-[#C0392B]' : 'bg-[#FEF5E7] text-[#B07C2D]'
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-[#103D30]">{title}</h3>
            <p className="mt-1.5 text-xs text-[#66736B] leading-relaxed">{message}</p>
          </div>
          <button onClick={onCancel} className="text-[#8E9B92] hover:text-[#103D30]">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="rounded-xl border border-[#D7E2D3] px-4 py-2 text-xs font-semibold text-[#55635B] hover:bg-[#F6F8F3]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-xs font-bold text-white transition ${
              isDestructive ? 'bg-[#C0392B] hover:bg-[#A93226]' : 'bg-[#176B4D] hover:bg-[#103D30]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
