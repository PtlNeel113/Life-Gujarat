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
} from 'lucide-react'
import { dataStore } from '@/lib/data-store'
import { BillAnalysisResult } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function BillAnalysisView() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisResult, setAnalysisResult] = useState<BillAnalysisResult | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Editable fields for confirmation
  const [editUnits, setEditUnits] = useState<number>(0)
  const [editAmount, setEditAmount] = useState<number>(0)
  const [editStartDate, setEditStartDate] = useState<string>('')
  const [editEndDate, setEditEndDate] = useState<string>('')
  const [editDiscom, setEditDiscom] = useState<string>('UGVCL')
  const [editConsumerNo, setEditConsumerNo] = useState<string>('')

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

  const processFile = (selectedFile: File) => {
    setErrorMessage('')
    setSaveSuccess(false)

    // Validation
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMessage('Unsupported file type. Please upload a PDF, PNG, or JPEG electricity bill.')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit. Please compress or crop your bill image.')
      return
    }

    setFile(selectedFile)
    simulateExtraction(selectedFile)
  }

  const simulateExtraction = (selectedFile: File) => {
    setIsAnalyzing(true)
    setUploadProgress(20)

    setTimeout(() => {
      setUploadProgress(65)
    }, 600)

    setTimeout(() => {
      setUploadProgress(100)
      setIsAnalyzing(false)

      const simulatedResult: BillAnalysisResult = {
        id: 'scan_' + Date.now(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        uploadedAt: new Date().toISOString(),
        discom: 'UGVCL',
        consumerNumber: '02148/99120',
        billingPeriodStart: '2026-09-15',
        billingPeriodEnd: '2026-10-15',
        unitsKwh: 260,
        amountDue: 1820,
        meterReadingPrevious: 14820,
        meterReadingCurrent: 15080,
        status: 'extracted',
        extractedFieldsConfidence: {
          kwh: 98,
          amount: 96,
          dates: 94,
        },
      }

      setAnalysisResult(simulatedResult)
      setEditUnits(simulatedResult.unitsKwh)
      setEditAmount(simulatedResult.amountDue)
      setEditStartDate(simulatedResult.billingPeriodStart)
      setEditEndDate(simulatedResult.billingPeriodEnd)
      setEditDiscom(simulatedResult.discom)
      setEditConsumerNo(simulatedResult.consumerNumber)
    }, 1200)
  }

  const handleConfirmAndSave = () => {
    if (!analysisResult) return

    dataStore.addReading({
      userId: dataStore.getUser().id,
      startDate: editStartDate,
      endDate: editEndDate,
      consumptionKwh: editUnits,
      billAmount: editAmount,
      source: 'bill_scan',
      notes: `Extracted from ${analysisResult.fileName} (${editDiscom})`,
      status: 'verified',
    })

    dataStore.addBillAnalysis({
      ...analysisResult,
      unitsKwh: editUnits,
      amountDue: editAmount,
      billingPeriodStart: editStartDate,
      billingPeriodEnd: editEndDate,
      discom: editDiscom,
      consumerNumber: editConsumerNo,
      status: 'confirmed',
    })

    setSaveSuccess(true)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gujarat Electricity Bill Analysis"
        description="Upload your monthly residential power bill (PDF or image). Our Discom parser extracts kWh units, billing cycle dates, and amount for your review."
        backHref="/energy"
        backLabel="Back to Energy Workspace"
      />

      {/* Upload Box with Soft Neumorphism */}
      <div className="rounded-3xl neu-raised p-6 sm:p-8">
        <h3 className="text-base font-extrabold text-[#253247]">Upload Electricity Bill Document</h3>
        <p className="mt-1 text-xs text-[#718096]">
          Supports UGVCL, DGVCL, MGVCL, PGVCL, and Torrent Power bill formats up to 10MB.
        </p>

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
            or browse your computer for PDF, PNG, or JPEG
          </p>

          <label className="mt-5 cursor-pointer rounded-2xl neu-button-primary px-6 py-3 text-xs font-bold">
            Browse Files
            <input
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl neu-inset p-3 text-xs font-bold text-[#C0392B]">
            <AlertTriangle size={16} /> {errorMessage}
          </div>
        )}

        {isAnalyzing && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#253247]">
              <span>Extracting Discom fields &amp; tariff breakdown...</span>
              <span className="tabular-nums">{uploadProgress}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full neu-inset p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#65B98A] to-[#238B57] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Extraction Confirmation Workflow */}
      {analysisResult && (
        <div className="rounded-3xl neu-raised p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(197,202,208,0.35)] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck size={20} className="text-[#238B57]" />
                <h3 className="text-base font-extrabold text-[#253247]">
                  Extracted Bill Details — Verification Checkpoint
                </h3>
              </div>
              <p className="mt-0.5 text-xs text-[#718096]">
                Parsed from <span className="font-bold text-[#253247]">{analysisResult.fileName}</span>. Review and adjust if any field differs.
              </p>
            </div>

            <StatusBadge label="Awaiting Confirmation" variant="warning" />
          </div>

          {/* Form with extracted & editable values */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                Discom Company
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
                Consumer Number
              </label>
              <input
                type="text"
                value={editConsumerNo}
                onChange={(e) => setEditConsumerNo(e.target.value)}
                className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs text-[#253247]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
                Units Consumed (kWh)
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
                Billing Period Start
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
                Billing Period End
              </label>
              <input
                type="date"
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
                className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs text-[#253247]"
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
                className="w-full rounded-2xl neu-input py-2.5 px-3 text-xs font-bold text-[#253247]"
              />
            </div>
          </div>

          {/* Explanation of extraction */}
          <div className="rounded-2xl neu-inset-sm p-4 text-xs text-[#718096] space-y-1">
            <p className="font-bold text-[#253247] flex items-center gap-1.5">
              <HelpCircle size={15} className="text-[#238B57]" /> OCR Parsing Transparency
            </p>
            <p>
              Values are extracted using the Gujarat Discom layout recognizer. Previous meter reading: {analysisResult.meterReadingPrevious},
              current reading: {analysisResult.meterReadingCurrent}. Difference equals {analysisResult.unitsKwh} units.
            </p>
          </div>

          {saveSuccess ? (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl neu-inset p-4 text-xs font-bold text-[#238B57]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span>Reading successfully verified and added to your energy history! (+50 LiFE Points awarded)</span>
              </div>
              <Link
                href="/energy"
                className="rounded-2xl neu-button-primary px-4 py-2 text-xs"
              >
                Go to Energy Workspace →
              </Link>
            </div>
          ) : (
            <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(197,202,208,0.35)]">
              <button
                type="button"
                onClick={() => setAnalysisResult(null)}
                className="rounded-2xl neu-button px-4 py-2.5 text-xs font-bold text-[#718096]"
              >
                Discard &amp; Upload Another
              </button>
              <button
                type="button"
                onClick={handleConfirmAndSave}
                className="inline-flex items-center gap-2 rounded-2xl neu-button-primary px-5 py-2.5 text-xs font-bold cursor-pointer"
              >
                <CheckCircle2 size={15} /> Confirm &amp; Save to History (+50 Pts)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
