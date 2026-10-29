'use client'

import React, { useState, useEffect } from 'react'
import {
  CheckSquare,
  Plus,
  Edit3,
  Clock,
  ShieldCheck,
  Zap,
  X,
  Search,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { Mission } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function AdminMissionsView() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Mission['category']>('Energy')
  const [difficulty, setDifficulty] = useState<Mission['difficulty']>('Easy')
  const [duration, setDuration] = useState('10 min')
  const [points, setPoints] = useState(25)
  const [co2Reduction, setCo2Reduction] = useState(1.5)
  const [verification, setVerification] = useState<Mission['verificationLevel']>('Photo Evidence')
  const [description, setDescription] = useState('')
  const [whyItMatters, setWhyItMatters] = useState('')

  useEffect(() => {
    refresh()
  }, [])

  const refresh = () => {
    setMissions(dataStore.getMissions())
  }

  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newM: Mission = {
      id: 'm_' + Date.now(),
      title,
      titleGu: title,
      description,
      descriptionGu: description,
      category,
      difficulty,
      duration,
      points,
      estimatedCo2ReductionKg: co2Reduction,
      verificationLevel: verification,
      instructions: [
        'Review the recommended standard.',
        'Implement the action inside your household.',
        'Submit evidence for verification.',
      ],
      whyItMatters,
    }

    // Persist to store
    const current = dataStore.getMissions()
    localStorage.setItem('life_gujarat_missions', JSON.stringify([newM, ...current]))
    dataStore.addAuditLog({
      actorName: 'Bhavin Patel',
      actorRole: 'Admin',
      action: 'Created Mission',
      targetEntity: newM.title,
      details: `Award: ${newM.points} pts, Verification: ${newM.verificationLevel}`,
    })

    setModalOpen(false)
    setTitle('')
    setDescription('')
    refresh()
  }

  const filtered = missions.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mission LiFE Catalog Management"
        description="Configure authorized household sustainable habits, point disbursements, and verification standards."
        action={{
          label: 'Add New Mission',
          onClick: () => setModalOpen(true),
          icon: <Plus size={15} />,
        }}
      />

      <div className="rounded-3xl border border-[#E3E8DF] bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FBFCF8] border-b border-[#E3E8DF] text-[11px] font-bold uppercase tracking-wider text-[#8E9B92]">
            <tr>
              <th className="py-3.5 px-4">Mission Title</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Difficulty</th>
              <th className="py-3.5 px-4">Time</th>
              <th className="py-3.5 px-4">Reward</th>
              <th className="py-3.5 px-4 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F3EC]">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-[#F9FAF6]">
                <td className="py-3.5 px-4">
                  <span className="font-bold text-[#103D30] block">{m.title}</span>
                  <span className="text-[10px] text-[#8E9B92] line-clamp-1">{m.description}</span>
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge label={m.category} variant="energy" />
                </td>
                <td className="py-3.5 px-4 text-[#55635B] font-medium">{m.difficulty}</td>
                <td className="py-3.5 px-4 text-[#55635B]">{m.duration}</td>
                <td className="py-3.5 px-4 font-bold text-[#176B4D]">+{m.points} pts</td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-[11px] font-semibold text-[#103D30]">{m.verificationLevel}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-[#D7E2D3] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E3E8DF] pb-3">
              <h3 className="text-base font-bold text-[#103D30]">Add Mission to Catalog</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#8E9B92] hover:text-[#103D30]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateMission} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#103D30]">Mission Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean Ceiling Fan Blades for Airflow Efficiency"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs text-[#103D30] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#103D30]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs outline-none"
                  >
                    <option value="Energy">Energy</option>
                    <option value="Water">Water</option>
                    <option value="Waste">Waste</option>
                    <option value="Transport">Transport</option>
                    <option value="Food">Food</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#103D30]">Verification Level</label>
                  <select
                    value={verification}
                    onChange={(e) => setVerification(e.target.value as any)}
                    className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs outline-none"
                  >
                    <option value="Self-Declaration">Self-Declaration</option>
                    <option value="Photo Evidence">Photo Evidence</option>
                    <option value="Meter Reading">Meter Reading</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#103D30]">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#103D30]">Points</label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                    className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#103D30]">Est. CO₂ (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={co2Reduction}
                    onChange={(e) => setCo2Reduction(parseFloat(e.target.value) || 0)}
                    className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103D30]">Action Summary</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-[#FBFCF8] p-2.5 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E3E8DF]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-[#D7E2D3] px-4 py-2 text-xs font-semibold text-[#55635B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#176B4D] px-5 py-2 text-xs font-bold text-white hover:bg-[#103D30]"
                >
                  Publish Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
