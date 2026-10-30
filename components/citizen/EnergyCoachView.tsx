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
  Trash2,
  Cpu,
  Calculator,
  Compass,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { UserProfile, EnergyReading } from '@/lib/types'
import { calculateEnergyStats } from '@/lib/energy-calc'
import { PageHeader } from '@/components/shared/PageHeader'
import { saveChatMessageToFirestore, fetchChatMessagesFromFirestore } from '@/lib/firestore-sync'
import { useAuth } from '@/components/providers/AuthProvider'

type ModelChoice = 'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'
type RolePersona = 'coach' | 'solar' | 'auditor'

interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  modelUsed?: ModelChoice
  rolePersona?: RolePersona
}

export function EnergyCoachView() {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<UserProfile>(authUser || dataStore.getUser())
  const [readings, setReadings] = useState<EnergyReading[]>([])
  const [inputPrompt, setInputPrompt] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedModel, setSelectedModel] = useState<ModelChoice>('gemini-3.8-flash')
  const [rolePersona, setRolePersona] = useState<RolePersona>('coach')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Namaste! I am your LiFE Gujarat AI Energy Advisor powered by Google Gemini.

I maintain full multi-turn memory of our conversation. You can ask me to:
• Analyze your household's seasonal electricity consumption patterns
• Detail the Bureau of Energy Efficiency (BEE) 24°C AC thermostat guidelines
• Calculate subsidy and net metering ROI under the PM Surya Ghar Muft Bijli Yojana
• Explain Gujarat DISCOM tariff slabs (UGVCL, DGVCL, MGVCL, PGVCL, Torrent Power)`,
      timestamp: '10:00 AM',
      modelUsed: 'gemini-3.8-flash',
      rolePersona: 'coach',
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const current = authUser || dataStore.getUser()
    setUser(current)
    const list = dataStore.getReadings()
    setReadings(list)

    // Load persisted chat history from Firestore if available
    if (current && current.id) {
      fetchChatMessagesFromFirestore(current.id)
        .then((remoteMessages) => {
          if (remoteMessages && remoteMessages.length > 0) {
            setMessages(
              remoteMessages.map((m) => ({
                id: m.id,
                sender: m.sender,
                text: m.text,
                timestamp: m.timestamp,
                modelUsed: (m.model as ModelChoice) || 'gemini-3.8-flash',
                rolePersona: (m.rolePersona as RolePersona) || 'coach',
              }))
            )
          }
        })
        .catch(() => {
          // Fallback to default in-memory welcome message
        })
    }
  }, [authUser])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const stats = calculateEnergyStats(readings, user.householdMembers)

  const roleDescriptions: Record<RolePersona, { label: string; badge: string; icon: any; desc: string }> = {
    coach: {
      label: 'Mission LiFE Eco-Coach',
      badge: 'Household Actions',
      icon: Leaf,
      desc: 'Expert in everyday behavioral energy conservation, AC optimization, and carbon footprint reduction.',
    },
    solar: {
      label: 'PM Surya Ghar Solar Advisor',
      badge: 'Rooftop Solar',
      icon: Sun,
      desc: 'Specialized in PV capacity sizing, Gujarat DISCOM net metering, and central subsidy calculations.',
    },
    auditor: {
      label: 'Tariff & Energy Auditor',
      badge: 'Audit & Slabs',
      icon: Calculator,
      desc: 'Detailed breakdown of electricity bills, fixed charges, FPPPA slabs, and BEE appliance efficiency math.',
    },
  }

  const modelDescriptions: Record<ModelChoice, { name: string; tag: string; icon: any }> = {
    'gemini-3.8-flash': {
      name: 'Gemini 3.8 Flash',
      tag: 'General Tasks (Recommended)',
      icon: Sparkles,
    },
    'gemini-3.1-flash-lite': {
      name: 'Gemini 3.1 Flash-Lite',
      tag: 'Fast Responses & Quick Math',
      icon: Zap,
    },
    'gemini-4-argon': {
      name: 'Gemini 4 Argon',
      tag: 'Complex Modeling & Deep Audit',
      icon: Cpu,
    },
  }

  const suggestedPrompts: Record<RolePersona, string[]> = {
    coach: [
      'Why is 24°C AC recommended over 18°C in Gujarat summers?',
      'How much electricity do BLDC ceiling fans save compared to old induction fans?',
      'How can our household reduce standby power consumption?',
      'What are the top 3 easiest actions to earn Mission LiFE points today?',
    ],
    solar: [
      'What is the central subsidy on a 3 kW rooftop solar system in Gujarat?',
      'How many square feet of rooftop area do I need for a 2 kW solar setup?',
      'How does DISCOM net metering work with UGVCL in Ahmedabad?',
      'What is the payback period for a residential solar plant in Gujarat?',
    ],
    auditor: [
      'Explain how the FPPPA and fixed charges work on my electricity bill.',
      'Audit my household energy: we consumed 310 kWh last month with 4 people.',
      'How do I calculate cooling heat load for a 150 sq ft master bedroom?',
      'What is the rupee difference between a 3-star vs 5-star inverter AC?',
    ],
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClearHistory = () => {
    const welcomeMsg: ChatMessage = {
      id: 'msg_welcome_' + Date.now(),
      sender: 'assistant',
      text: `Chat history cleared. I am ready to help you with household energy efficiency, solar feasibility, or tariff analysis!`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      modelUsed: selectedModel,
      rolePersona,
    }
    setMessages([welcomeMsg])
    setApiError(null)
  }

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt
    if (!prompt.trim() || isTyping) return

    setApiError(null)
    const userMsgId = 'usr_' + Date.now()
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: prompt.trim(),
      timestamp,
      modelUsed: selectedModel,
      rolePersona,
    }

    const updatedHistory = [...messages, userMsg]
    setMessages(updatedHistory)
    setInputPrompt('')
    setIsTyping(true)

    // Save user message to Firestore
    saveChatMessageToFirestore({
      id: userMsg.id,
      userId: user.id,
      sender: 'user',
      text: userMsg.text,
      model: selectedModel,
      rolePersona,
      timestamp,
      createdAt: new Date().toISOString(),
    }).catch(() => {})

    try {
      // Build conversation turns for multi-turn Gemini API
      // Send past turns so Gemini retains conversational continuity
      const conversationTurns = updatedHistory
        .filter((m) => m.id !== 'msg_welcome' || m.sender === 'user')
        .map((m) => ({
          sender: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        }))

      // If only current turn, pass current message
      if (conversationTurns.length === 0) {
        conversationTurns.push({ sender: 'user', text: userMsg.text })
      }

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationTurns,
          model: selectedModel,
          rolePersona,
          userContext: {
            name: user.name,
            district: user.district,
            discom: user.discom,
            householdMembers: user.householdMembers,
            latestKwh: stats.latestKwh,
            points: user.points,
          },
        }),
      })

      const data = await res.json()

      let replyText = ''
      if (res.ok && data.text) {
        replyText = data.text
      } else {
        // High-quality contextual fallback
        replyText = getGroundedFallbackResponse(prompt, rolePersona, user, stats)
        if (data.error && !data.text) {
          console.warn('Gemini API returned error, used verified domain fallback:', data.error)
        }
      }

      const assistantMsgId = 'ai_' + Date.now()
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
        rolePersona,
      }

      setMessages((prev) => [...prev, assistantMsg])

      // Persist assistant message in Firestore
      saveChatMessageToFirestore({
        id: assistantMsg.id,
        userId: user.id,
        sender: 'assistant',
        text: assistantMsg.text,
        model: selectedModel,
        rolePersona,
        timestamp: assistantMsg.timestamp,
        createdAt: new Date().toISOString(),
      }).catch(() => {})
    } catch (err: any) {
      console.error('Chat error:', err)
      const fallbackReply = getGroundedFallbackResponse(prompt, rolePersona, user, stats)
      const assistantMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
        rolePersona,
      }
      setMessages((prev) => [...prev, assistantMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const ActiveRoleIcon = roleDescriptions[rolePersona].icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="AI Energy & Sustainability Coach"
        description="Multi-turn conversational advisor powered by Google Gemini, grounded in Gujarat DISCOM tariffs, BEE energy standards, and PM Surya Ghar solar rules."
        action={{
          label: 'Clear History',
          onClick: handleClearHistory,
          icon: <Trash2 size={14} />,
        }}
      />

      {/* Role & Model Controls Strip with Neumorphism */}
      <div className="grid gap-5 rounded-3xl neu-raised p-6 lg:grid-cols-2">
        {/* Role Persona Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#718096] flex items-center gap-1.5">
            <Compass size={15} className="text-[#238B57]" />
            Specialized Energy Persona
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(Object.keys(roleDescriptions) as RolePersona[]).map((r) => {
              const item = roleDescriptions[r]
              const Icon = item.icon
              const isSelected = rolePersona === r
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRolePersona(r)}
                  className={`flex flex-col items-start rounded-2xl p-3 text-left transition cursor-pointer ${
                    isSelected
                      ? 'neu-inset text-[#238B57]'
                      : 'neu-button text-[#718096] hover:text-[#253247]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 w-full">
                    <span
                      className={`grid size-7 place-items-center rounded-xl ${
                        isSelected ? 'neu-raised text-[#238B57]' : 'neu-inset-sm text-[#718096]'
                      }`}
                    >
                      <Icon size={14} />
                    </span>
                    <span className="text-[11px] font-extrabold truncate">{item.badge}</span>
                  </div>
                  <span className="mt-1 text-[10px] text-[#718096] line-clamp-1">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Gemini Model Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#718096] flex items-center gap-1.5">
            <Cpu size={15} className="text-[#238B57]" />
            Gemini Reasoning Model
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(Object.keys(modelDescriptions) as ModelChoice[]).map((m) => {
              const item = modelDescriptions[m]
              const Icon = item.icon
              const isSelected = selectedModel === m
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedModel(m)}
                  className={`flex flex-col items-start rounded-2xl p-3 text-left transition cursor-pointer ${
                    isSelected
                      ? 'neu-inset text-[#238B57]'
                      : 'neu-button text-[#718096] hover:text-[#253247]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 w-full">
                    <span
                      className={`grid size-7 place-items-center rounded-xl ${
                        isSelected ? 'neu-raised text-[#238B57]' : 'neu-inset-sm text-[#718096]'
                      }`}
                    >
                      <Icon size={14} />
                    </span>
                    <span className="text-[11px] font-extrabold truncate">{m.replace('gemini-', '')}</span>
                  </div>
                  <span className="mt-1 text-[10px] text-[#718096] line-clamp-1">{item.tag}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Multi-Turn Chat Thread Panel */}
      <div className="flex flex-col rounded-3xl neu-raised overflow-hidden min-h-[580px]">
        {/* Active Session Info Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(197,202,208,0.35)] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl neu-inset text-[#238B57]">
              <ActiveRoleIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#253247]">{roleDescriptions[rolePersona].label}</span>
                <span className="inline-flex items-center gap-1 rounded-xl neu-inset-sm px-2.5 py-0.5 text-[10px] font-bold text-[#238B57]">
                  <Sparkles size={10} /> {selectedModel}
                </span>
              </div>
              <p className="text-[11px] text-[#718096]">
                Active Context: {user.name} · {user.district} ({user.discom}) · {stats.latestKwh} kWh latest reading
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-xl neu-inset-sm text-[#238B57] px-3 py-1 font-bold text-[11px]">
              <span className="size-2 rounded-full bg-[#238B57]" />
              Gemini Active
            </span>
          </div>
        </div>

        {/* Scrollable Messages Thread */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-5 max-h-[440px] bg-[#E8EDF3]/50"
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user'
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="grid size-9 shrink-0 place-items-center rounded-2xl neu-raised text-[#238B57] mt-0.5">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] sm:max-w-[75%] rounded-3xl p-5 ${
                    isUser
                      ? 'neu-button-primary text-white rounded-br-md'
                      : 'neu-raised text-[#253247] rounded-bl-md'
                  }`}
                >
                  {/* Sender & Model Metadata */}
                  <div className={`flex items-center justify-between gap-4 pb-1 mb-2 border-b text-[10px] ${
                    isUser ? 'border-white/20 text-white/80' : 'border-[rgba(197,202,208,0.35)] text-[#718096]'
                  }`}>
                    <span className="font-bold">
                      {isUser ? user.name || 'You' : roleDescriptions[msg.rolePersona || rolePersona].label}
                    </span>
                    <div className="flex items-center gap-2">
                      {!isUser && msg.modelUsed && (
                        <span className="rounded-lg neu-inset-sm px-1.5 py-0.5 font-mono text-[9px] text-[#238B57]">
                          {msg.modelUsed}
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        title="Copy message text"
                        className="opacity-0 group-hover:opacity-100 transition hover:text-[#238B57] cursor-pointer"
                      >
                        {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed space-y-1">
                    {msg.text}
                  </div>
                </div>

                {isUser && (
                  <div className="grid size-9 shrink-0 place-items-center rounded-2xl neu-raised text-[#238B57] font-extrabold text-xs mt-0.5">
                    {user.avatarInitials || 'ME'}
                  </div>
                )}
              </div>
            )
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 text-xs text-[#718096]">
              <div className="grid size-9 place-items-center rounded-2xl neu-raised text-[#238B57]">
                <Bot size={18} />
              </div>
              <div className="flex items-center gap-2 rounded-2xl neu-inset px-4 py-3">
                <span className="size-2 rounded-full bg-[#238B57] animate-bounce" />
                <span className="size-2 rounded-full bg-[#238B57] animate-bounce [animation-delay:0.2s]" />
                <span className="size-2 rounded-full bg-[#238B57] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-bold text-[#718096] ml-1">
                  Gemini is thinking with {selectedModel}...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Starter Chips */}
        <div className="border-t border-[rgba(197,202,208,0.35)] px-6 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="shrink-0 text-[11px] font-bold text-[#718096] uppercase">Try:</span>
            {suggestedPrompts[rolePersona].map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={isTyping}
                className="shrink-0 rounded-2xl neu-button px-3.5 py-1.5 text-[11px] font-bold text-[#253247] transition hover:text-[#238B57] disabled:opacity-50 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar Form */}
        <div className="border-t border-[rgba(197,202,208,0.35)] p-4 sm:p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`Ask ${roleDescriptions[rolePersona].label} about bills, solar, or efficiency...`}
              disabled={isTyping}
              className="flex-1 rounded-2xl neu-input px-4 py-3 text-xs text-[#253247] placeholder:text-[#718096]"
            />

            <button
              type="submit"
              disabled={isTyping || !inputPrompt.trim()}
              className="flex items-center gap-2 rounded-2xl neu-button-primary px-5 py-3 text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              <span>Send</span>
              <Send size={14} />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-[#718096]">
            <span>Grounded in CEA v19.0 standard emission baseline and PM Surya Ghar guidelines.</span>
            <span>Responses powered by Google Gemini.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Verified domain fallback response generator if offline
 */
function getGroundedFallbackResponse(
  prompt: string,
  role: RolePersona,
  user: UserProfile,
  stats: any
): string {
  const lower = prompt.toLowerCase()

  if (role === 'solar' || lower.includes('solar') || lower.includes('subsidy') || lower.includes('surya')) {
    return `☀️ PM Surya Ghar Muft Bijli Yojana — Gujarat Rooftop Sizing & Subsidy:

1. Subsidy Structure (Direct Benefit Transfer):
   • 1 kW system: ₹30,000 subsidy (covers ~45% of capital cost)
   • 2 kW system: ₹60,000 subsidy
   • 3 kW+ system: ₹78,000 maximum central subsidy

2. Gujarat Generation Run-Rate:
   • 1 kW generates approx 4 to 4.5 kWh per day (over 1,450 kWh annually in Gujarat).
   • A 3 kW setup yields ~4,350 units/year, generating bill credits of ~₹28,000.

3. Net Metering Process:
   • Requires approx 100 sq ft shadow-free rooftop per kW.
   • Registered with ${user.discom || 'regional Discom'} via pmsuryaghar.gov.in.
   • Payback period typically ranges between 3.2 and 4.2 years.`
  }

  if (role === 'auditor' || lower.includes('tariff') || lower.includes('fpppa') || lower.includes('slab')) {
    return `⚡ Gujarat Residential Tariff & Energy Audit Breakdown:

1. Tariff Slab Structure (${user.discom || 'UGVCL'} / Residential R-LT):
   • First 50 kWh: Lower baseline rate (~₹3.20/kWh)
   • Next 50 to 100 kWh: Tier 2 (~₹3.80/kWh)
   • Next 100 to 250 kWh: Tier 3 (~₹4.50/kWh)
   • 250+ kWh: Peak residential bracket (~₹5.30/kWh)

2. Fuel Price & Power Purchase Adjustment (FPPPA):
   • Quarterly variable charge currently around ₹2.40 to ₹2.80 per unit.
   • Total effective landed cost for peak consumption is approx ₹7.20 to ₹7.50/unit.

3. Your Profile Audit:
   • Recent monthly use: ${stats.latestKwh || 260} kWh for ${user.householdMembers} people.
   • Per-capita: ${stats.perCapitaKwh} kWh/person (Gujarat urban average is ~70 kWh).
   • Trimming peak summer AC runtime by 1 hr/day prevents entering the highest tariff tier!`
  }

  return `🌿 Mission LiFE Gujarat Energy Efficiency Guidance:

• BEE 24°C Comfort Standard:
  Setting your air conditioner to 24°C instead of 18°C saves ~36% electricity because the compressor cycles off when thermal equilibrium is reached.

• BLDC Ceiling Fans:
  Standard induction fans consume 75W. 5-Star BLDC fans consume only 28W—saving ~60% power on appliances running 12-14 hours daily.

• Avoid Vampire Standby:
  Televisions, set-top boxes, and idle chargers draw 5W to 15W continuously. Turning them off at the wall socket abates ~40 kg CO₂e per year.

Would you like me to calculate your specific savings for any of these actions?`
}
