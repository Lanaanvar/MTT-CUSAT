import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import { db } from '../firebase'

export interface Registration {
  id: string
  eventId: string
  eventTitle: string
  name: string
  email: string
  phone: string
  college: string
  department: string
  year: string
  membershipType: 'ieee' | 'non-ieee'
  membershipId?: string
  registrationDate: string
  status: 'pending' | 'approved' | 'rejected'
  paymentStatus: 'pending' | 'completed'
  amount: number
}

export async function createRegistration(data: Omit<Registration, 'id'>): Promise<string> {
  try {
    const registrationsRef = collection(db, 'registrations')
    const docRef = await addDoc(registrationsRef, data)
    return docRef.id
  } catch (error) {
    console.error('Error creating registration:', error)
    throw error
  }
}

export async function getRegistrations(filters?: {
  eventId?: string
  status?: string
  search?: string
}): Promise<Registration[]> {
  try {
    let registrationsQuery = collection(db, 'registrations')
    let constraints = []

    if (filters?.eventId) {
      constraints.push(where('eventId', '==', filters.eventId))
    }

    if (filters?.status && filters.status !== 'all') {
      constraints.push(where('status', '==', filters.status))
    }

    // Add registrationDate ordering last to match the composite index
    constraints.push(orderBy('registrationDate', 'desc'))

    const q = query(registrationsQuery, ...constraints)
    const querySnapshot = await getDocs(q)
    
    let registrations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Registration[]

    // Handle search filter in memory
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      registrations = registrations.filter(reg =>
        reg.name.toLowerCase().includes(searchLower) ||
        reg.email.toLowerCase().includes(searchLower) ||
        reg.college.toLowerCase().includes(searchLower)
      )
    }

    return registrations
  } catch (error) {
    if (error instanceof Error && error.message.includes('requires an index')) {
      console.error('Missing Firestore index. Please create the required index.')
      // Return empty array instead of throwing to handle gracefully
      return []
    }
    console.error('Error fetching registrations:', error)
    throw error
  }
}

export async function getRegistrationById(id: string): Promise<Registration | null> {
  try {
    const registrationDoc = await getDoc(doc(db, 'registrations', id))
    if (!registrationDoc.exists()) return null
    
    return {
      id: registrationDoc.id,
      ...registrationDoc.data()
    } as Registration
  } catch (error) {
    console.error('Error fetching registration:', error)
    throw error
  }
}

export async function updateRegistration(
  id: string,
  data: Partial<Omit<Registration, 'id'>>
): Promise<void> {
  try {
    const registrationRef = doc(db, 'registrations', id)
    await updateDoc(registrationRef, data)
  } catch (error) {
    console.error('Error updating registration:', error)
    throw error
  }
}

export async function deleteRegistration(id: string): Promise<void> {
  try {
    const registrationRef = doc(db, 'registrations', id)
    await deleteDoc(registrationRef)
  } catch (error) {
    console.error('Error deleting registration:', error)
    throw error
  }
} 