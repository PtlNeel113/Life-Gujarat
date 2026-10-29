'use client'

import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore'
import { db, auth, handleFirestoreError, OperationType } from './firebase'
import { UserProfile, EnergyReading, SolarAssessment } from './types'

export interface ChatMessageRecord {
  id: string
  userId: string
  sender: 'user' | 'assistant'
  text: string
  model?: string
  rolePersona?: string
  timestamp: string
  createdAt?: string
}

/**
 * Persist or update citizen profile in Firestore (/users/{userId})
 */
export async function syncUserProfileToFirestore(profile: UserProfile): Promise<void> {
  if (!auth.currentUser) return
  const path = `users/${profile.id}`
  try {
    await setDoc(
      doc(db, 'users', profile.id),
      {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        district: profile.district,
        discom: profile.discom,
        consumerNumber: profile.consumerNumber || '',
        householdMembers: profile.householdMembers,
        homeType: profile.homeType,
        points: profile.points,
        streakDays: profile.streakDays,
        joinedDate: profile.joinedDate,
        language: profile.language,
        avatarInitials: profile.avatarInitials,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    )
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path)
  }
}

/**
 * Load citizen profile from Firestore
 */
export async function fetchUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  if (!auth.currentUser) return null
  const path = `users/${userId}`
  try {
    const snap = await getDoc(doc(db, 'users', userId))
    if (snap.exists()) {
      return snap.data() as UserProfile
    }
    return null
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path)
  }
}

/**
 * Persist an energy reading to Firestore (/users/{userId}/readings/{readingId})
 */
export async function syncReadingToFirestore(reading: EnergyReading): Promise<void> {
  if (!auth.currentUser) return
  const path = `users/${reading.userId}/readings/${reading.id}`
  try {
    await setDoc(doc(db, 'users', reading.userId, 'readings', reading.id), {
      id: reading.id,
      userId: reading.userId,
      startDate: reading.startDate,
      endDate: reading.endDate,
      consumptionKwh: reading.consumptionKwh,
      billAmount: reading.billAmount || 0,
      source: reading.source,
      notes: reading.notes || '',
      status: reading.status,
      createdAt: reading.createdAt || new Date().toISOString(),
    })
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path)
  }
}

/**
 * Fetch all energy readings for current citizen
 */
export async function fetchReadingsFromFirestore(userId: string): Promise<EnergyReading[]> {
  if (!auth.currentUser) return []
  const path = `users/${userId}/readings`
  try {
    const coll = collection(db, 'users', userId, 'readings')
    const snap = await getDocs(coll)
    const list: EnergyReading[] = []
    snap.forEach((d) => {
      list.push(d.data() as EnergyReading)
    })
    return list
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path)
  }
}

/**
 * Save chat message in Firestore (/users/{userId}/messages/{messageId})
 */
export async function saveChatMessageToFirestore(msg: ChatMessageRecord): Promise<void> {
  if (!auth.currentUser) return
  const path = `users/${msg.userId}/messages/${msg.id}`
  try {
    await setDoc(doc(db, 'users', msg.userId, 'messages', msg.id), {
      id: msg.id,
      userId: msg.userId,
      sender: msg.sender,
      text: msg.text,
      model: msg.model || 'gemini-3.8-flash',
      rolePersona: msg.rolePersona || 'coach',
      timestamp: msg.timestamp,
      createdAt: msg.createdAt || new Date().toISOString(),
    })
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path)
  }
}

/**
 * Load chat history from Firestore
 */
export async function fetchChatMessagesFromFirestore(userId: string): Promise<ChatMessageRecord[]> {
  if (!auth.currentUser) return []
  const path = `users/${userId}/messages`
  try {
    const q = query(
      collection(db, 'users', userId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    )
    const snap = await getDocs(q)
    const list: ChatMessageRecord[] = []
    snap.forEach((d) => {
      list.push(d.data() as ChatMessageRecord)
    })
    return list
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path)
  }
}
