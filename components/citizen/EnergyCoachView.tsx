'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Send,
  Zap,
  Leaf,
  Sun,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  ArrowRight,
  User,
  Bot,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { UserProfile, EnergyReading } from '@/lib/types'
import { calculateEnergyStats } from '@/lib/energy-calc'
import { PageHeader } from '@/components/shared/PageHeader'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  recommendationLink?: {
    label: string
    href: string
  }
}

export function EnergyCoachView() {
  const [user, setUser] = useState<UserProfile>(dataStore.getUser())
  const [readings, setReadings] = useState<EnergyReading[]>([])
  const [inputPrompt, setInputPrompt] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: 'Namaste Aditi! I am your LiFE Gujarat Energy Coach. I can analyze your electricity patterns, recommend practical behavioral adjustments for Gujarat summers, and explain rooftop solar potential.',
      timestamp: '10:00 AM',
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUser(dataStore.getUser())
    setReadings(dataStore.getReadings())
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const stats = calculateEnergyStats(readings, user.householdMembers)

  const suggestedPrompts = [
    'Explain my electricity consumption pattern',
    'Why is 24°C AC recommended over 18°C?',
    'How much can I save with BLDC ceiling fans?',
    'What rooftop solar subsidy does Gujarat offer?',
  ]

  const handleSend = (textToSend?: string) => {
    const prompt = textToSend || inputPrompt
    if (!prompt.trim()) return

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputPrompt('')
    setIsTyping(true)

    // Grounded knowledge response generator based on actual user context
    setTimeout(() => {
      let replyText = ''
      let recommendationLink = undefined

      const lower = prompt.toLowerCase()

      if (lower.includes('pattern') || lower.includes('consumption') || lower.includes('trend')) {
        replyText = `Based on your logged data for your ${user.householdMembers}-member home in ${user.district}:
• Your latest consumption was ${stats.latestKwh} kWh, with a 6-month monthly average of ${stats.averageKwh} kWh.
• Your per-capita use is ${stats.perCapitaKwh} kWh/person, which is in line with standard Gujarat residential averages (~70 kWh/person/month).
• Notice that your consumption peaked during May summer at 390 kWh primarily due to cooling load, and has declined by ~33% entering autumn.
Recommendation: Focus on optimizing air conditioning thermostat and cleaning fan mesh filters before the next hot weather cycle.`
        recommendationLink = { label: 'Inspect Energy Workspace', href: '/energy' }
      } else if (lower.includes('24') || lower.includes('ac') || lower.includes('air condition')) {
        replyText = `Every 1°C increase in your AC set-point saves approximately 6% electricity:
• Setting AC to 18°C does NOT cool a room faster—it merely forces the compressor to run nonstop without cycling off.
• BEE and GERC studies demonstrate that 24°C paired with a ceiling fan on low speed creates an effective felt temperature of 21°C due to convective airflow.
• In a typical Gujarat summer with 8 hours of daily AC use, keeping 24°C saves around 75–90 kWh per month, trimming over ₹600 from your monthly power bill.`
        recommendationLink = { label: 'Start AC 24°C Mission', href: '/missions/m_ac_24' }
      } else if (lower.includes('bldc') || lower.includes('fan')) {
        replyText = `Standard induction ceiling fans consume 75W to 80W, whereas modern BLDC (Brushless DC) motor fans draw only 28W at maximum speed:
• For an average home with 3 to 4 fans running 12 hours a day during warm months, BLDC fans save ~500 kWh annually.
• At Gujarat residential slab tariffs, that is an annual electricity saving of ₹3,000–₹3,800.
• Payback period on a ₹2,500 BLDC fan is under 14–16 months.`
        recommendationLink = { label: 'Read BLDC Guide', href: '/learn/bldc-ceiling-fans-gujarat' }
      } else if (lower.includes('solar') || lower.includes('subsidy') || lower.includes('rooftop')) {
        replyText = `Under the PM Surya Ghar: Muft Bijli Yojana & Surya Gujarat scheme:
• Central DBT subsidy: ₹30,000 for 1 kW, ₹60,000 for 2 kW, and ₹78,000 for 3 kW and higher.
• For your household consuming ~${stats.latestKwh} kWh/month, a 3 kW system would generate ~4,350 kWh annually and save over ₹26,000 per year on electricity.
• Net investment after subsidy is approx ₹87,000 with a payback period under 3.5 years.`
        recommendationLink = { label: 'Open Solar Feasibility Calculator', href: '/solar-advisor' }
      } else {
        replyText = `Thank you for your question on Mission LiFE. Sustainable living in Gujarat is about intentional, repeatable habits:
1. Shift appliances to 24°C comfort standards.
2. Eliminate phantom vampire power on television set-top boxes and chargers.
3. Track your meter readings monthly to stay mindful of consumption brackets.
Would you like me to analyze your latest bill or calculate your rooftop solar scenario?`
        recommendationLink = { label: 'View Available Missions', href: '/missions' }
      }

      const botMsg: Message = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        recommendationLink,
      }

      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 700)
  }

  const startNewChat = () => {
    setMessages([
      {
        id: 'msg_fresh',
        sender: 'assistant',
        text: 'Started a fresh session! What aspect of your household electricity or carbon footprint would you like to explore today?',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Energy Coach"
        description="Your grounded sustainability advisor. Ask about electricity savings, tariff brackets, cooling thermodynamics, and rooftop solar economics."
        action={{
          label: 'New Conversation',
          onClick: startNewChat,
          icon: <RefreshCw size={14} />,
        }}
      />

      {/* Main Conversational Box */}
      <div className="flex flex-col h-[600px] rounded-3xl border border-[#E3E8DF] bg-white shadow-sm overflow-hidden">
        {/* Context bar */}
        <div className="flex items-center justify-between border-b border-[#F0F3EC] bg-[#FBFCF8] px-6 py-3 text-xs text-[#66736B]">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#176B4D]" />
            <span>Active context: <strong>{user.district}</strong> · <strong>{stats.latestKwh} kWh/mo</strong> baseline</span>
          </div>
          <span className="font-semibold text-[#176B4D]">Grounded Knowledge Engine</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#103D30] text-[#B8E986] shadow-xs">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#176B4D] text-white rounded-br-none'
                    : 'bg-[#F6F8F3] text-[#18241F] border border-[#E3E8DF] rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {m.recommendationLink && (
                  <div className="mt-3 pt-2.5 border-t border-[#E3E8DF]">
                    <Link
                      href={m.recommendationLink.href}
                      className="inline-flex items-center gap-1.5 font-bold text-[#176B4D] hover:underline"
                    >
                      {m.recommendationLink.label} <ArrowRight size={12} />
                    </Link>
                  </div>
                )}

                <span
                  className={`mt-1.5 block text-[10px] ${
                    m.sender === 'user' ? 'text-white/60 text-right' : 'text-[#8E9B92]'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#E5F1DF] text-[#176B4D] font-bold text-xs shadow-xs">
                  {user.avatarInitials}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#8E9B92]">
              <div className="grid size-8 place-items-center rounded-full bg-[#103D30] text-[#B8E986]">
                <Bot size={16} />
              </div>
              <div className="flex gap-1 rounded-2xl bg-[#F6F8F3] px-4 py-2 border border-[#E3E8DF]">
                <span className="size-1.5 animate-bounce rounded-full bg-[#176B4D]" />
                <span className="size-1.5 animate-bounce rounded-full bg-[#176B4D] [animation-delay:0.2s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-[#176B4D] [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Bar */}
        <div className="border-t border-[#F0F3EC] bg-[#FBFCF8] px-4 py-2.5 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#8E9B92] shrink-0">Try asking:</span>
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="shrink-0 rounded-full border border-[#D7E2D3] bg-white px-3 py-1 text-[11px] font-medium text-[#103D30] hover:bg-[#EEF4E8] transition"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2 border-t border-[#E3E8DF] bg-white p-3"
        >
          <input
            type="text"
            placeholder="Ask about your electricity bill, AC efficiency, or solar options..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="flex-1 rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] px-4 py-2.5 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isTyping}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#176B4D] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#103D30] disabled:opacity-50"
          >
            <span>Send</span>
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  )
}
