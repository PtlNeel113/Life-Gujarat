'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Flame,
  Leaf,
  Menu,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Trophy,
  Users,
  X,
  Zap,
  Globe,
  Sliders,
  TrendingDown,
} from 'lucide-react'

const navLinks = [
  ['How It Works', '#how-it-works'],
  ['Mission LiFE', '#missions'],
  ['Solar Advisor', '/solar-advisor'],
  ['Community', '/community'],
  ['Knowledge Hub', '/learn'],
]

function NeumorphicLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 font-extrabold tracking-tight text-[#253247]">
      <span className="grid size-11 place-items-center rounded-2xl neu-raised text-[#238B57]">
        <Leaf size={22} fill="currentColor" />
      </span>
      <div className="flex flex-col">
        <span className="text-lg leading-tight font-extrabold">
          LiFE <span className="font-semibold text-[#238B57]">Gujarat</span>
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#718096]">
          Clean Lifestyle Platform
        </span>
      </div>
    </Link>
  )
}

function NeumorphicSimulator() {
  const [kwh, setKwh] = useState(320)
  const [cut, setCut] = useState(15)
  const savedKwh = Math.round((kwh * cut) / 100)
  const savedCo2Kg = Math.round(savedKwh * 0.716) // CEA v19 factor
  const savedInr = Math.round(savedKwh * 6.5) // Avg Gujarat residential tariff approx ₹6.5/unit

  return (
    <div className="rounded-3xl neu-raised p-6 md:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#238B57]">
            <Sliders size={16} /> Interactive Household Simulator
          </div>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#253247]">
            What could one conscious shift achieve?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#718096] leading-relaxed">
            Adjust your monthly electricity consumption and realistic reduction target to see your real impact in kWh, CO₂, and money saved.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#253247] mb-2">
                <span className="text-[#718096]">Current Monthly Electricity (kWh)</span>
                <span className="text-base text-[#238B57] tabular-nums">{kwh} kWh</span>
              </div>
              <div className="rounded-2xl neu-inset p-2">
                <input
                  type="range"
                  min="80"
                  max="800"
                  step="10"
                  value={kwh}
                  onChange={(e) => setKwh(+e.target.value)}
                  className="w-full accent-[#238B57] cursor-pointer"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#253247] mb-2">
                <span className="text-[#718096]">Efficiency Target Reduction (%)</span>
                <span className="text-base text-[#238B57] tabular-nums">−{cut}%</span>
              </div>
              <div className="rounded-2xl neu-inset p-2">
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="5"
                  value={cut}
                  onChange={(e) => setCut(+e.target.value)}
                  className="w-full accent-[#238B57] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <p className="mt-6 text-[11px] text-[#718096]">
            *Calculated using Central Electricity Authority (CEA) Baseline Database v19.0 weighted grid emission factor (0.716 kg CO₂e/kWh) and standard Gujarat discom slabs.
          </p>
        </div>

        {/* Results Panel */}
        <div className="flex flex-col justify-between rounded-3xl neu-inset p-6 sm:p-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-xl neu-raised-sm px-3 py-1 text-xs font-bold text-[#238B57]">
              <Sparkles size={13} /> Projected Monthly Gains
            </div>
            <div className="mt-6">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#238B57] tabular-nums">
                {savedKwh}
              </span>
              <span className="text-sm font-bold text-[#718096] ml-2">kWh avoided / mo</span>
            </div>
          </div>

          <div className="mt-8 space-y-3.5 border-t border-[rgba(197,202,208,0.35)] pt-6 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#718096]">Carbon Avoided:</span>
              <strong className="text-base font-extrabold text-[#253247] tabular-nums">{savedCo2Kg} kg CO₂e</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#718096]">Estimated Bill Savings:</span>
              <strong className="text-base font-extrabold text-[#238B57] tabular-nums">₹{savedInr.toLocaleString('en-IN')}/mo</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#718096]">Adjusted Consumption:</span>
              <span className="font-bold text-[#253247] tabular-nums">{kwh - savedKwh} kWh</span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/register"
              className="flex w-full items-center justify-center gap-2 rounded-2xl neu-button-primary py-3.5 text-xs font-bold"
            >
              Lock In This Scenario <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function MissionCard({
  title,
  category,
  time,
  points,
  done = false,
}: {
  title: string
  category: string
  time: string
  points: string
  done?: boolean
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl neu-raised-sm p-4 transition hover:neu-raised">
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
          done ? 'neu-button text-[#238B57]' : 'neu-inset text-[#238B57]'
        }`}
      >
        {done ? <Check size={18} strokeWidth={3} /> : <Zap size={18} />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[11px] text-[#718096]">
          <span className="font-bold uppercase tracking-wider text-[#238B57]">{category}</span>
          <span>·</span>
          <span>{time}</span>
        </div>
        <h4 className="mt-0.5 text-sm font-extrabold text-[#253247] truncate">{title}</h4>
      </div>
      <span className="rounded-xl neu-inset-sm px-2.5 py-1 text-xs font-extrabold text-[#238B57]">
        +{points} pts
      </span>
    </div>
  )
}

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#E8EDF3] text-[#253247]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-[rgba(197,202,208,0.35)] bg-[#E8EDF3]/95 backdrop-blur px-6 py-4 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <NeumorphicLogo />

          <nav className="hidden items-center gap-8 text-sm font-bold text-[#718096] lg:flex">
            {navLinks.map(([label, href]) => (
              <Link key={label} href={href} className="transition hover:text-[#238B57]">
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3.5 lg:flex">
            <Link
              href="/login"
              className="rounded-2xl neu-button px-5 py-2.5 text-xs font-bold text-[#253247]"
            >
              Citizen Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-2xl neu-button-primary px-5 py-2.5 text-xs font-bold"
            >
              Get Started Free
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid size-10 place-items-center rounded-2xl neu-button text-[#253247] lg:hidden"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <nav className="mt-4 flex flex-col gap-2 rounded-3xl neu-raised p-5 lg:hidden">
            {navLinks.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-bold text-[#718096] hover:neu-inset-sm hover:text-[#238B57]"
              >
                {label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-[rgba(197,202,208,0.3)] pt-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center rounded-2xl neu-button py-2.5 text-xs font-bold text-[#253247]"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center rounded-2xl neu-button-primary py-2.5 text-xs font-bold"
              >
                Create Free Account
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 lg:px-12 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-2xl neu-inset px-3.5 py-1.5 text-xs font-bold text-[#238B57]">
                <Sparkles size={14} /> MISSION LiFE · GUJARAT CLIMATE INITIATIVE
              </div>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#253247] sm:text-5xl lg:text-6xl">
                Live lighter. <br />
                <span className="text-[#238B57]">Save electricity.</span> <br />
                Shape a greener Gujarat.
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#718096]">
                LiFE Gujarat empowers households across Ahmedabad, Surat, Vadodara, Rajkot, and all 33 districts to track electricity usage, adopt rooftop solar, and verify real carbon reductions.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl neu-button-primary px-6 py-3.5 text-sm font-bold shadow-md"
                >
                  Start Your Journey <ArrowRight size={16} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-2xl neu-button px-6 py-3.5 text-sm font-bold text-[#253247]"
                >
                  One-Click Demo Access
                </Link>
              </div>

              {/* 3 Pillars strip */}
              <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[rgba(197,202,208,0.35)] pt-6">
                <div>
                  <strong className="block text-sm font-extrabold text-[#238B57]">Understand</strong>
                  <span className="text-xs text-[#718096]">Actual consumption</span>
                </div>
                <div>
                  <strong className="block text-sm font-extrabold text-[#238B57]">Act</strong>
                  <span className="text-xs text-[#718096]">Daily micro-habits</span>
                </div>
                <div>
                  <strong className="block text-sm font-extrabold text-[#238B57]">Measure</strong>
                  <span className="text-xs text-[#718096]">CEA carbon savings</span>
                </div>
              </div>
            </div>

            {/* Extruded Hero Interactive Mockup */}
            <div className="rounded-3xl neu-raised p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-[rgba(197,202,208,0.35)] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-xl neu-inset text-[#238B57]">
                    <Zap size={18} />
                  </span>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#253247]">Household Meter Live Hub</h4>
                    <p className="text-[11px] text-[#718096]">UGVCL / DGVCL / MGVCL / PGVCL</p>
                  </div>
                </div>
                <span className="rounded-xl neu-inset-sm px-2.5 py-1 text-[10px] font-bold text-[#238B57]">
                  Verified
                </span>
              </div>

              {/* Mini KPI row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl neu-inset p-3.5 text-center">
                  <p className="text-[10px] font-bold uppercase text-[#718096]">Last Month</p>
                  <p className="text-2xl font-extrabold text-[#253247] mt-1 tabular-nums">280 kWh</p>
                  <p className="text-[10px] font-bold text-[#238B57] mt-0.5">−12% vs benchmark</p>
                </div>
                <div className="rounded-2xl neu-inset p-3.5 text-center">
                  <p className="text-[10px] font-bold uppercase text-[#718096]">CO₂e Footprint</p>
                  <p className="text-2xl font-extrabold text-[#253247] mt-1 tabular-nums">200 kg</p>
                  <p className="text-[10px] text-[#718096] mt-0.5">CEA v19 factor</p>
                </div>
              </div>

              {/* Interactive preview missions */}
              <div className="space-y-2.5 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#718096]">Featured Today</p>
                <MissionCard title="Set AC thermostat to 24°C" category="Cooling" time="2 min" points="25" done />
                <MissionCard title="Audit phantom vampire loads" category="Home" time="5 min" points="30" />
              </div>

              <div className="rounded-2xl neu-raised-sm p-4 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun size={18} className="text-[#d97706]" />
                  <div>
                    <p className="font-bold text-[#253247]">PM Surya Ghar Scheme</p>
                    <p className="text-[11px] text-[#718096]">Up to ₹78,000 direct subsidy</p>
                  </div>
                </div>
                <Link href="/solar-advisor" className="font-bold text-[#238B57] hover:underline">
                  Calculate →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* State Environmental Impact Statistics */}
      <section className="px-6 py-12 lg:px-12 border-y border-[rgba(197,202,208,0.35)]">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl neu-raised p-6 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#238B57] tabular-nums">4.2M+</span>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#718096]">Units (kWh) Tracked</p>
            </div>
            <div className="rounded-3xl neu-raised p-6 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#253247] tabular-nums">3,000+</span>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#718096]">MT CO₂e Avoided</p>
            </div>
            <div className="rounded-3xl neu-raised p-6 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#238B57] tabular-nums">₹2.1 Cr</span>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#718096]">Citizen Bill Savings</p>
            </div>
            <div className="rounded-3xl neu-raised p-6 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#253247] tabular-nums">33 Districts</span>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#718096]">Gujarat State Network</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 rounded-xl neu-inset-sm px-3 py-1 text-xs font-bold text-[#238B57]">
              HOW IT WORKS
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#253247]">
              Practical climate action, made effortless
            </h2>
            <p className="mt-3 text-sm text-[#718096] leading-relaxed">
              No radical sacrifices or extreme lifestyles. Just three straightforward habits that save you money and protect Gujarat&apos;s ecology.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                num: '01',
                title: 'Track Consumption',
                desc: 'Log monthly electricity readings manually, upload your bill, or inspect your DISCOM consumer slab.',
                icon: Zap,
              },
              {
                num: '02',
                title: 'Complete LiFE Missions',
                desc: 'Take on bite-sized, 2-minute to 15-minute daily challenges to cut phantom loads and optimize cooling.',
                icon: CheckSquare,
              },
              {
                num: '03',
                title: 'Earn & Export Proof',
                desc: 'Redeem LiFE reward points, unlock verifiable impact badges, and export printable statements.',
                icon: Trophy,
              },
            ].map((step) => {
              const Icon = step.icon
              return (
                <div key={step.num} className="rounded-3xl neu-raised p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="grid size-12 place-items-center rounded-2xl neu-inset text-[#238B57]">
                        <Icon size={22} />
                      </span>
                      <span className="text-2xl font-extrabold text-[#718096]/50">{step.num}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-extrabold text-[#253247]">{step.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#718096] leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="mt-6 border-t border-[rgba(197,202,208,0.35)] pt-4">
                    <span className="text-xs font-bold text-[#238B57]">Seamless onboarding →</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Simulator Section */}
      <section className="px-6 pb-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <NeumorphicSimulator />
        </div>
      </section>

      {/* Solar Advisor Promo Banner */}
      <section className="px-6 pb-24 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-3xl neu-raised p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-xl neu-inset-sm px-3 py-1 text-xs font-bold text-[#d97706]">
                <Sun size={14} /> PM SURYA GHAR MUFT BIJLI YOJANA
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#253247]">
                Could your rooftop generate zero-bill power?
              </h2>
              <p className="mt-3 text-sm text-[#718096] leading-relaxed max-w-lg">
                Gujarat enjoys over 300 days of bright sunshine. Calculate rooftop solar feasibility, central DBT subsidies (up to ₹78,000), net metering, and payback period in seconds.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/solar-advisor"
                  className="rounded-2xl neu-button-primary px-6 py-3.5 text-xs font-bold"
                >
                  Open Solar Advisor
                </Link>
                <Link
                  href="/energy"
                  className="rounded-2xl neu-button px-6 py-3.5 text-xs font-bold text-[#253247]"
                >
                  Review Energy First
                </Link>
              </div>
            </div>

            <div className="rounded-3xl neu-inset p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#718096]">Sample 3 kW Rooftop System</span>
                <span className="text-[#238B57]">Ahmedabad / Surat</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl neu-raised p-3">
                  <p className="text-[10px] text-[#718096] uppercase font-bold">Cost Est.</p>
                  <p className="text-base font-extrabold text-[#253247] mt-1">₹1.45 L</p>
                </div>
                <div className="rounded-2xl neu-raised p-3">
                  <p className="text-[10px] text-[#238B57] uppercase font-bold">DBT Subsidy</p>
                  <p className="text-base font-extrabold text-[#238B57] mt-1">₹78,000</p>
                </div>
                <div className="rounded-2xl neu-raised p-3">
                  <p className="text-[10px] text-[#718096] uppercase font-bold">Net Outlay</p>
                  <p className="text-base font-extrabold text-[#253247] mt-1">₹67,000</p>
                </div>
              </div>
              <p className="text-[11px] text-[#718096] text-center pt-2">
                Estimated payback: <strong>~3.1 years</strong> at current DISCOM tariffs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(197,202,208,0.35)] px-6 py-12 lg:px-12 bg-[#E8EDF3]">
        <div className="mx-auto max-w-7xl flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-xs text-[#718096]">
          <NeumorphicLogo />
          <div className="flex flex-wrap gap-6 font-bold text-[#718096]">
            <Link href="/login" className="hover:text-[#238B57]">Citizen Portal</Link>
            <Link href="/admin" className="hover:text-[#238B57]">Directorate Admin</Link>
            <Link href="/solar-advisor" className="hover:text-[#238B57]">Solar Advisor</Link>
            <Link href="/learn" className="hover:text-[#238B57]">Guides</Link>
          </div>
          <p>© 2026 Climate Change Department, Government of Gujarat.</p>
        </div>
      </footer>
    </div>
  )
}

// Keep legacy named exports so any direct references continue working seamlessly
export function Dashboard() {
  return null
}
export function Workspace({ slug }: { slug: string }) {
  return null
}
export function Auth({ register = false }: { register?: boolean }) {
  return null
}
