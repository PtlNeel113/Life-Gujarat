'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Bell,
  CheckCircle2,
  ArrowRight,
  Trash2,
  Calendar,
  Check,
  Zap,
  Leaf,
  Users,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { NotificationItem } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'

export function NotificationsView() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    refresh()
  }, [])

  const refresh = () => {
    setNotifications(dataStore.getNotifications())
  }

  const markRead = (id: string) => {
    dataStore.markNotificationRead(id)
    refresh()
  }

  const markAllRead = () => {
    dataStore.markAllNotificationsRead()
    refresh()
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Notifications & Alerts"
        description="Updates regarding your submitted mission evidence, monthly bill parsing, points awards, and community challenges."
        action={
          unreadCount > 0
            ? {
                label: 'Mark All as Read',
                onClick: markAllRead,
                icon: <Check size={14} />,
              }
            : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications Yet"
          description="You are fully caught up! New alerts will appear here when you complete missions or log energy readings."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border p-5 transition shadow-xs ${
                n.isRead ? 'border-[#E3E8DF] bg-white' : 'border-[#CBE3C3] bg-[#F7FAF4]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                    n.isRead ? 'bg-[#F0F2EB] text-[#66736B]' : 'bg-[#E5F1DF] text-[#176B4D]'
                  }`}
                >
                  <Bell size={18} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#103D30]">{n.title}</h4>
                    {!n.isRead && (
                      <span className="size-2 rounded-full bg-[#176B4D]" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[#66736B] leading-relaxed max-w-xl">{n.message}</p>
                  <span className="mt-2 block text-[10px] text-[#8E9B92]">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                {n.link && (
                  <Link
                    href={n.link}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#EEF4E8] px-3.5 py-1.5 text-xs font-bold text-[#176B4D] hover:bg-[#E5F1DF]"
                  >
                    <span>View</span>
                    <ArrowRight size={12} />
                  </Link>
                )}

                {!n.isRead && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="rounded-xl border border-[#D7E2D3] bg-white px-3 py-1.5 text-xs font-medium text-[#55635B] hover:bg-[#F6F8F3]"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
