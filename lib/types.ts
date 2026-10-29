export type UserRole = 'citizen' | 'admin' | 'moderator'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole
  district: string
  discom: 'UGVCL' | 'DGVCL' | 'MGVCL' | 'PGVCL' | 'Torrent Power'
  consumerNumber?: string
  householdMembers: number
  homeType: 'apartment' | 'individual_bungalow' | 'row_house' | 'rural_home'
  points: number
  streakDays: number
  joinedDate: string
  language: 'en' | 'gu'
  avatarInitials: string
}

export interface EnergyReading {
  id: string
  userId: string
  startDate: string
  endDate: string
  consumptionKwh: number
  billAmount?: number
  source: 'manual' | 'bill_scan' | 'smart_meter' | 'discom_sync'
  notes?: string
  status: 'verified' | 'user_reported' | 'flagged'
  createdAt: string
}

export interface BillAnalysisResult {
  id: string
  fileName: string
  fileSize: number
  uploadedAt: string
  discom: string
  consumerNumber: string
  billingPeriodStart: string
  billingPeriodEnd: string
  unitsKwh: number
  amountDue: number
  meterReadingPrevious: number
  meterReadingCurrent: number
  status: 'extracted' | 'confirmed' | 'rejected'
  extractedFieldsConfidence: {
    kwh: number
    amount: number
    dates: number
  }
}

export interface Mission {
  id: string
  title: string
  titleGu: string
  description: string
  descriptionGu: string
  category: 'Energy' | 'Water' | 'Waste' | 'Transport' | 'Food' | 'Lifestyle'
  difficulty: 'Easy' | 'Medium' | 'Challenging'
  duration: string
  points: number
  estimatedCo2ReductionKg: number
  verificationLevel: 'Self-Declaration' | 'Photo Evidence' | 'Meter Reading'
  instructions: string[]
  whyItMatters: string
  officialGuidanceUrl?: string
  featured?: boolean
}

export interface MissionSubmission {
  id: string
  missionId: string
  missionTitle: string
  userId: string
  userName: string
  userDistrict: string
  submittedAt: string
  evidenceText?: string
  evidenceImageUrl?: string
  status: 'pending' | 'approved' | 'rejected'
  pointsAwarded: number
  reviewedBy?: string
  reviewedAt?: string
  rejectionReason?: string
}

export interface Community {
  id: string
  name: string
  type: 'Residential Society' | 'Ward/Taluka' | 'College/School' | 'Workplace'
  district: string
  membersCount: number
  totalKwhSaved: number
  totalPoints: number
  activeChallenge: string
  description: string
  isJoined?: boolean
}

export interface CommunityChallenge {
  id: string
  communityId: string
  title: string
  targetKwh: number
  achievedKwh: number
  daysLeft: number
  participantsCount: number
}

export interface RewardItem {
  id: string
  title: string
  description: string
  costPoints: number
  category: 'Discount' | 'Eco-Kit' | 'Certificate' | 'Tree Planting'
  partner: string
  isAvailable: boolean
  stockRemaining: number
}

export interface Badge {
  id: string
  title: string
  description: string
  iconName: string
  unlockedAt?: string
  isUnlocked: boolean
}

export interface PointsLedgerEntry {
  id: string
  userId: string
  points: number
  type: 'earned' | 'redeemed' | 'bonus'
  source: string
  date: string
}

export interface SolarAssessment {
  id: string
  userId: string
  district: string
  monthlyKwh: number
  roofAreaSqFt: number
  roofShadingPercent: number
  propertyType: string
  recommendedCapacityKw: number
  annualGenerationKwh: number
  annualSavingsInr: number
  estimatedCostInr: number
  estimatedSubsidyInr: number
  netInvestmentInr: number
  paybackYears: number
  createdAt: string
}

export interface LearnArticle {
  slug: string
  title: string
  titleGu: string
  category: string
  readTime: string
  summary: string
  lastReviewed: string
  author: string
  keyTakeaways: string[]
  contentSections: {
    heading: string
    body: string
  }[]
  actionChecklist: string[]
  relatedMissionIds: string[]
  officialResources: { name: string; url: string }[]
}

export interface NotificationItem {
  id: string
  userId: string
  title: string
  message: string
  type: 'mission' | 'energy' | 'reward' | 'community' | 'system'
  link?: string
  isRead: boolean
  createdAt: string
}

export interface DistrictImpact {
  district: string
  householdsEnrolled: number
  verifiedMissionsCompleted: number
  totalKwhSaved: number
  totalCo2AvoidedTonnes: number
  rooftopSolarInstalledKw: number
  primaryDiscom: string
}

export interface AdminCampaign {
  id: string
  title: string
  targetDistrict: string
  startDate: string
  endDate: string
  goalKwhReduction: number
  currentKwhReduction: number
  enrolledCitizens: number
  status: 'active' | 'upcoming' | 'completed'
}

export interface AdminAuditLog {
  id: string
  timestamp: string
  actorName: string
  actorRole: string
  action: string
  targetEntity: string
  details: string
}
