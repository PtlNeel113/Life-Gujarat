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
      <div className="fixed inset-0 bg-[#253247]/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-3xl neu-raised p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div
            className={`grid size-11 shrink-0 place-items-center rounded-2xl neu-inset-sm ${
              isDestructive ? 'text-[#C0392B]' : 'text-[#d97706]'
            }`}
          >
            <AlertTriangle size={22} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-extrabold text-[#253247]">{title}</h3>
            <p className="mt-1.5 text-xs text-[#718096] leading-relaxed">{message}</p>
          </div>
          <button onClick={onCancel} className="grid size-8 place-items-center rounded-xl neu-button text-[#718096]">
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-2xl neu-button px-4 py-2 text-xs font-bold text-[#718096] hover:text-[#253247] cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-2xl px-5 py-2 text-xs font-bold transition cursor-pointer ${
              isDestructive
                ? 'neu-button text-[#C0392B] hover:neu-inset-sm'
                : 'neu-button-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
