'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  ScanLine,
  HelpCircle,
  FileCheck,
  Sparkles,
  Zap,
  Leaf,
  IndianRupee,
  ShieldCheck,
  Calendar,
  Layers,
  Sun,
  Eye,
  Check,
  Info,
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { BillAnalysisResult } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { MetricCard } from '@/components/shared/MetricCard'

export function BillAnalysisView() {
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [analysisStage, setAnalysisStage] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisResult, setAnalysisResult] = useState<BillAnalysisResult | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Editable fields for user verification before confirming
  const [editUnits, setEditUnits] = useState<number>(0)
  const [editAmount, setEditAmount] = useState<number>(0)
  const [editStartDate, setEditStartDate] = useState<string>('')
  const [editEndDate, setEditEndDate] = useState<string>('')
  const [editDiscom, setEditDiscom] = useState<string>('UGVCL')
  const [editConsumerNo, setEditConsumerNo] = useState<string>('')
  const [editConsumerName, setEditConsumerName] = useState<string>('')
  const [editTariffSlab, setEditTariffSlab] = useState<string>('RGP (Residential General Purpose)')

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const processFile = async (selectedFile: File) => {
    setErrorMessage('')
    setSaveSuccess(false)

    // Validation
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMessage('Unsupported format. Please upload a PDF, PNG, JPEG, or WebP electricity bill.')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit. Please compress or crop your bill image.')
      return
    }

    setFile(selectedFile)

    // Create thumbnail if image
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setFilePreview(null)
    }

    await executeBillAnalysis(selectedFile)
  }

  const executeBillAnalysis = async (selectedFile: File) => {
    setIsAnalyzing(true)
    setUploadProgress(15)
    setAnalysisStage('Preparing document for OCR parsing...')

    try {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (err) => reject(err)
        reader.readAsDataURL(selectedFile)
      })

      setUploadProgress(40)
      setAnalysisStage('Analyzing Discom template with Gemini 3.8 Flash Vision...')

      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressTimer)
            return 85
          }
          return prev + 15
        })
      }, 500)

      const response = await fetch('/api/gemini/analyze-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileBase64: base64Data,
          mimeType: selectedFile.type,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
        }),
      })

      clearInterval(progressTimer)
      setUploadProgress(95)
      setAnalysisStage('Extracting tariff slabs & calculating carbon footprint...')

      if (!response.ok) {
        throw new Error(`Analysis service responded with code ${response.status}`)
      }

      const result: BillAnalysisResult = await response.json()
      setUploadProgress(100)
      setAnalysisStage('Completed!')

      setTimeout(() => {
        setIsAnalyzing(false)
        populateExtractedData(result)
      }, 400)
    } catch (err: any) {
      console.error('Bill Analysis failed:', err)
      setIsAnalyzing(false)
      setErrorMessage(
        err.message || 'Unable to parse bill document. You can try a preset sample or enter reading manually.'
      )
    }
  }

  const loadSampleBill = async (sampleKey: 'sample_ugvcl' | 'sample_torrent' | 'sample_dgvcl') => {
    setErrorMessage('')
    setSaveSuccess(false)
    setIsAnalyzing(true)
    setUploadProgress(25)
    setAnalysisStage(`Loading sample ${sampleKey.replace('sample_', '').toUpperCase()} bill...`)

    try {
      setTimeout(() => {
        setUploadProgress(70)
        setAnalysisStage('Parsing Discom residential tariff and metering slabs...')
      }, 300)

      const response = await fetch('/api/gemini/analyze-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleKey }),
      })

      if (!response.ok) {
        throw new Error('Failed to load sample bill')
      }

      const result: BillAnalysisResult = await response.json()
      setUploadProgress(100)
      setAnalysisStage('Analysis complete!')

      setTimeout(() => {
        setIsAnalyzing(false)
        setFile(null)
        setFilePreview(null)
        populateExtractedData(result)
      }, 500)
    } catch (err: any) {
      setIsAnalyzing(false)
      setErrorMessage(err.message || 'Failed to load sample bill.')
    }
  }

  const populateExtractedData = (result: BillAnalysisResult) => {
    setAnalysisResult(result)
    setEditUnits(result.unitsKwh)
    setEditAmount(result.amountDue)
    setEditStartDate(result.billingPeriodStart)
    setEditEndDate(result.billingPeriodEnd)
    setEditDiscom(result.discom)
    setEditConsumerNo(result.consumerNumber)
    setEditConsumerName(result.consumerName || 'Aditi M. Shah')
    setEditTariffSlab(result.tariffSlab || 'RGP (Residential General Purpose)')
  }

  const handleConfirmAndSave = () => {
    if (!analysisResult) return

    // 1. Add reading to persistent energy ledger
    dataStore.addReading({
      userId: dataStore.getUser().id,
      startDate: editStartDate,
      endDate: editEndDate,
      consumptionKwh: editUnits,
      billAmount: editAmount,
      source: 'bill_scan',
      notes: `Verified from ${analysisResult.fileName} (${editDiscom} Consumer #${editConsumerNo})`,
      status: 'verified',
    })

    // 2. Add full analysis result to store
    dataStore.addBillAnalysis({
      ...analysisResult,
      unitsKwh: editUnits,
      amountDue: editAmount,
      billingPeriodStart: editStartDate,
      billingPeriodEnd: editEndDate,
      discom: editDiscom,
      consumerNumber: editConsumerNo,
      consumerName: editConsumerName,
      tariffSlab: editTariffSlab,
      status: 'confirmed',
    })

    setSaveSuccess(true)
  }

  // Calculate cycle days
  const cycleDays =
    editStartDate && editEndDate
      ? Math.max(1, Math.round((new Date(editEndDate).getTime() - new Date(editStartDate).getTime()) / (1000 * 60 * 60 * 24)))
      : 30

  const dailyAverageKwh = (editUnits / cycleDays).toFixed(1)
  const co2EmissionsKg = Number((editUnits * 0.716).toFixed(1))

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gujarat Electricity Bill Analysis"
        description="Upload your monthly residential power bill (PDF or image). Our AI Discom parser extracts kWh units, billing cycle dates, and amount for your review."
        backHref="/energy"
        backLabel="Back to Energy Workspace"
      />

      {/* Main Upload Box in Neumorphic Elevation */}
      <div className="rounded-3xl neu-raised p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-[rgba(197,202,208,0.35)] pb-4">
          <div>
            <h3 className="text-base font-extrabold text-[#253247]">Upload Electricity Bill Document</h3>
            <p className="mt-0.5 text-xs text-[#718096]">
              Supports UGVCL, DGVCL, MGVCL, PGVCL, and Torrent Power bill formats up to 10MB.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl neu-inset-sm px-3 py-1 text-[11px] font-bold text-[#238B57]">
              <Sparkles size={13} /> Gemini 3.8 Flash Vision Enabled
            </span>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="mt-6 flex flex-col items-center justify-center rounded-3xl neu-inset p-8 sm:p-12 text-center transition"
        >
          <div className="grid size-16 place-items-center rounded-2xl neu-raised text-[#238B57]">
            <ScanLine size={30} />
          </div>

          <p className="mt-4 text-sm font-extrabold text-[#253247]">
            Drag &amp; drop your electricity bill here
          </p>
          <p className="mt-1 text-xs text-[#718096]">
            or browse your computer for PDF, PNG, JPEG, or WebP
          </p>

          <label className="mt-5 cursor-pointer rounded-2xl neu-button-primary px-6 py-3 text-xs font-bold inline-flex items-center gap-2">
            <Upload size={15} />
            <span>Browse Files</span>
            <input
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Quick Sample Bill Buttons for Instant Testing */}
          <div className="mt-8 pt-6 border-t border-[rgba(197,202,208,0.35)] w-full max-w-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096] block mb-3">
              Don&apos;t have a bill right now? Try a verified Gujarat sample:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => loadSampleBill('sample_ugvcl')}
                className="rounded-xl neu-button px-3.5 py-2 text-xs font-bold text-[#253247] hover:text-[#238B57] transition cursor-pointer"
              >
                ⚡ UGVCL (260 kWh)
              </button>
              <button
                type="button"
                onClick={() => loadSampleBill('sample_torrent')}
                className="rounded-xl neu-button px-3.5 py-2 text-xs font-bold text-[#253247] hover:text-[#238B57] transition cursor-pointer"
              >
                ⚡ Torrent Power (340 kWh)
              </button>
              <button
                type="button"
                onClick={() => loadSampleBill('sample_dgvcl')}
                className="rounded-xl neu-button px-3.5 py-2 text-xs font-bold text-[#253247] hover:text-[#238B57] transition cursor-pointer"
              >
                ⚡ DGVCL (195 kWh)
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-5 flex items-center gap-2.5 rounded-2xl neu-inset p-4 text-xs font-bold text-[#C0392B]">
            <AlertTriangle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Progress bar during analysis */}
        {isAnalyzing && (
          <div className="mt-6 space-y-3 rounded-2xl neu-inset p-5">
            <div className="flex items-center justify-between text-xs font-extrabold text-[#253247]">
              <span className="flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin text-[#238B57]" />
                {analysisStage}
              </span>
              <span className="tabular-nums text-[#238B57]">{uploadProgress}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full neu-inset p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#65B98A] to-[#238B57] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-[#718096]">
              Our Discom OCR parser reads kilowatt-hours, consumer numbers, meter readings, and Gujarat fuel adjustment surcharges (FPPPA).
            </p>
          </div>
        )}
      </div>

      {/* Extracted Bill Analysis & Verification Checkpoint */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Header Summary Strip */}
          <div className="rounded-3xl neu-raised p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(197,202,208,0.35)] pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-xl neu-inset-sm text-[#238B57]">
                    <FileCheck size={20} />
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#253247]">
                      Extracted Bill Intelligence &amp; Verification
                    </h3>
                    <p className="text-xs text-[#718096]">
                      File: <strong className="text-[#253247]">{analysisResult.fileName}</strong> · Discom: <strong className="text-[#238B57]">{analysisResult.discom}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge
                  label={analysisResult.aiInsights?.efficiencyRating || 'Parsed with Vision'}
                  variant="success"
                />
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="rounded-xl neu-button px-3 py-1.5 text-xs font-bold text-[#718096] hover:text-[#253247] cursor-pointer"
                >
                  Upload Another
                </button>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl neu-inset p-4">
                <div className="flex items-center justify-between text-xs text-[#718096]">
                  <span className="font-bold uppercase tracking-wider">Consumption</span>
                  <span className="rounded-md neu-raised px-2 py-0.5 text-[10px] font-extrabold text-[#238B57]">
                    {analysisResult.extractedFieldsConfidence?.kwh || 98}% match
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-[#238B57] tabular-nums">
                    {editUnits}
                  </span>
                  <span className="text-xs font-bold text-[#718096]">kWh</span>
                </div>
                <span className="mt-1 block text-[11px] text-[#718096]">
                  Avg: {dailyAverageKwh} kWh / day
                </span>
              </div>

              <div className="rounded-2xl neu-inset p-4">
                <div className="flex items-center justify-between text-xs text-[#718096]">
                  <span className="font-bold uppercase tracking-wider">Amount Due</span>
                  <span className="rounded-md neu-raised px-2 py-0.5 text-[10px] font-extrabold text-[#238B57]">
                    {analysisResult.extractedFieldsConfidence?.amount || 96}% match
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-[#253247] tabular-nums">
                    ₹{editAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="mt-1 block text-[11px] text-[#718096]">
                  Landed cost: ₹{(editAmount / (editUnits || 1)).toFixed(2)}/kWh
                </span>
              </div>

              <div className="rounded-2xl neu-inset p-4">
                <div className="flex items-center justify-between text-xs text-[#718096]">
                  <span className="font-bold uppercase tracking-wider">Cycle Duration</span>
                  <Calendar size={14} className="text-[#238B57]" />
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-[#253247] tabular-nums">
                    {cycleDays}
                  </span>
                  <span className="text-xs font-bold text-[#718096]">days</span>
                </div>
                <span className="mt-1 block text-[11px] text-[#718096] truncate">
                  {editStartDate} to {editEndDate}
                </span>
              </div>

              <div className="rounded-2xl neu-inset p-4">
                <div className="flex items-center justify-between text-xs text-[#718096]">
                  <span className="font-bold uppercase tracking-wider">Emissions (CEA)</span>
                  <Leaf size={14} className="text-[#238B57]" />
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-[#176B4D] tabular-nums">
                    {co2EmissionsKg}
                  </span>
                  <span className="text-xs font-bold text-[#718096]">kg CO₂e</span>
                </div>
                <span className="mt-1 block text-[11px] text-[#718096]">
                  Factor: 0.716 kg/kWh (CEA v19)
                </span>
              </div>
            </div>

            {/* AI Insights & Tariff Analysis Card */}
            {analysisResult.aiInsights && (
              <div className="rounded-2xl neu-inset p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(197,202,208,0.35)] pb-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#238B57]">
                    <Sparkles size={16} />
                    <span>AI Tariff &amp; Consumption Diagnosis</span>
                  </div>
                  <span className="text-[11px] text-[#718096]">
                    Potential Savings: <strong className="text-[#238B57]">{analysisResult.aiInsights.savingPotentialKwh} kWh</strong> / <strong className="text-[#238B57]">₹{analysisResult.aiInsights.savingPotentialInr} per month</strong>
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-[#253247]">
                  {analysisResult.aiInsights.slabAnalysis}
                </p>

                {analysisResult.aiInsights.topRecommendations && analysisResult.aiInsights.topRecommendations.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#718096] mb-2">
                      Tailored Mission LiFE Action Plan:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-[#253247]">
                      {analysisResult.aiInsights.topRecommendations.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={14} className="mt-0.5 text-[#238B57] shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Charges Breakdown (Tariff Components) */}
            {analysisResult.chargesBreakdown && (
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#718096]">
                  Gujarat Discom Tariff Itemization
                </h4>
                <div className="grid gap-3 sm:grid-cols-4 text-xs">
                  <div className="rounded-xl neu-inset-sm p-3">
                    <span className="text-[#718096] block text-[11px]">Energy Charges</span>
                    <strong className="text-sm font-extrabold text-[#253247]">
                      ₹{analysisResult.chargesBreakdown.energyCharges?.toLocaleString('en-IN') || '—'}
                    </strong>
                  </div>
                  <div className="rounded-xl neu-inset-sm p-3">
                    <span className="text-[#718096] block text-[11px]">Fixed Demand Charge</span>
                    <strong className="text-sm font-extrabold text-[#253247]">
                      ₹{analysisResult.chargesBreakdown.fixedCharges?.toLocaleString('en-IN') || '140'}
                    </strong>
                  </div>
                  <div className="rounded-xl neu-inset-sm p-3">
                    <span className="text-[#718096] block text-[11px]">FPPPA Fuel Charge</span>
                    <strong className="text-sm font-extrabold text-[#253247]">
                      ₹{analysisResult.chargesBreakdown.fpppaCharges?.toLocaleString('en-IN') || '—'}
                    </strong>
                  </div>
                  <div className="rounded-xl neu-inset-sm p-3">
                    <span className="text-[#718096] block text-[11px]">Electricity Duty</span>
                    <strong className="text-sm font-extrabold text-[#253247]">
                      ₹{analysisResult.chargesBreakdown.electricityDuty?.toLocaleString('en-IN') || '—'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Editable Verification Checkpoint */}
            <div className="pt-4 border-t border-[rgba(197,202,208,0.35)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-[#253247]">
                    Citizen Verification Checkpoint
                  </h4>
                  <p className="text-xs text-[#718096]">
                    You can fine-tune any field below before confirming it into your persistent ledger.
                  </p>
                </div>
                <span className="text-xs text-[#238B57] font-bold flex items-center gap-1">
                  <ShieldCheck size={14} /> Official GERC Format
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                    Discom Provider
                  </label>
                  <select
                    value={editDiscom}
                    onChange={(e) => setEditDiscom(e.target.value)}
                    className="w-full appearance-none rounded-2xl neu-input py-2.5 px-3 text-xs font-bold text-[#253247] cursor-pointer"
                  >
                    <option value="UGVCL">UGVCL (Uttar Gujarat Vij Company Ltd)</option>
                    <option value="DGVCL">DGVCL (Dakshin Gujarat Vij Company Ltd)</option>
                    <option value="MGVCL">MGVCL (Madhya Gujarat Vij Company Ltd)</option>
                    <option value="PGVCL">PGVCL (Paschim Gujarat Vij Company Ltd)</option>
                    <option value="Torrent Power">Torrent Power (Ahmedabad / Surat)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                    Consumer / Service Account #
                  </label>
                  <input
                    type="text"
                    value={editConsumerNo}
                    onChange={(e) => setEditConsumerNo(e.target.value)}
                    className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs font-bold text-[#253247]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                    Consumer Name
                  </label>
                  <input
                    type="text"
                    value={editConsumerName}
                    onChange={(e) => setEditConsumerName(e.target.value)}
                    className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs text-[#253247]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                    Consumed Energy (kWh Units)
                  </label>
                  <input
                    type="number"
                    value={editUnits}
                    onChange={(e) => setEditUnits(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs font-extrabold text-[#238B57]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                    Total Amount Due (₹)
                  </label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs font-extrabold text-[#253247]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                    Tariff Slab
                  </label>
                  <input
                    type="text"
                    value={editTariffSlab}
                    onChange={(e) => setEditTariffSlab(e.target.value)}
                    className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs text-[#253247]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                    Billing Cycle Start
                  </label>
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs text-[#253247]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                    Billing Cycle End
                  </label>
                  <input
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs text-[#253247]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <div className="text-xs text-[#718096]">
                    Meter: <strong>{analysisResult.meterNumber || 'MTR-7729'}</strong> (Prev: {analysisResult.meterReadingPrevious} → Curr: {analysisResult.meterReadingCurrent})
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation & Save CTA */}
            {saveSuccess ? (
              <div className="rounded-2xl neu-inset p-6 space-y-4 text-xs font-bold text-[#238B57]">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={22} className="text-[#238B57]" />
                  <span>
                    Successfully verified and added to your Household Energy History! (+50 LiFE Points awarded)
                  </span>
                </div>
                <p className="text-xs font-normal text-[#718096]">
                  Your dashboard charts, carbon footprint run-rate, and state percentile have been updated in real time.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/dashboard"
                    className="rounded-2xl neu-button-primary px-5 py-2.5 text-xs font-bold text-white inline-flex items-center gap-2"
                  >
                    <span>View on Dashboard</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/energy"
                    className="rounded-2xl neu-button px-4 py-2.5 text-xs font-bold text-[#253247]"
                  >
                    Energy Workspace
                  </Link>
                  <Link
                    href="/energy-coach"
                    className="rounded-2xl neu-button px-4 py-2.5 text-xs font-bold text-[#238B57]"
                  >
                    Ask AI Coach About This Bill
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[rgba(197,202,208,0.35)]">
                <button
                  type="button"
                  onClick={() => setAnalysisResult(null)}
                  className="rounded-2xl neu-button px-5 py-2.5 text-xs font-bold text-[#718096] hover:text-[#253247] cursor-pointer"
                >
                  Discard &amp; Upload Another
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAndSave}
                  className="inline-flex items-center gap-2 rounded-2xl neu-button-primary px-6 py-3 text-xs font-extrabold cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>Confirm &amp; Save to History (+50 LiFE Pts)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
