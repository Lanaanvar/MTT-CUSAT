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
  deleteDoc,
  limit
} from 'firebase/firestore'
import { db, auth, isAnonymousAuthEnabled } from '../firebase'
import { signInAnonymously } from 'firebase/auth'

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
  paymentScreenshot?: string
}

export async function createRegistration(data: Omit<Registration, 'id'>): Promise<string> {
  try {
    // Add to Firestore directly - don't try to authenticate here
    // The Firestore rules are set to allow unauthenticated registration
    const registrationsRef = collection(db, 'registrations');
    console.log('Adding registration to Firestore...');
    
    try {
      const docRef = await addDoc(registrationsRef, data);
      console.log('Registration added with ID:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('Error in first registration attempt:', error);
      
      // If we get a permission error, try a direct approach without auth
      if (error.code === 'permission-denied') {
        console.log('Permission denied, trying direct approach...');
        
        // Try again with a direct approach
        try {
          const directRef = collection(db, 'registrations');
          const directDocRef = await addDoc(directRef, {
            ...data,
            // Add a timestamp to ensure we have a fresh document
            _timestamp: new Date().toISOString()
          });
          console.log('Registration added with direct approach:', directDocRef.id);
          return directDocRef.id;
        } catch (directError) {
          console.error('Direct approach failed:', directError);
          throw directError;
        }
      } else {
        throw error; // Re-throw other errors
      }
    }
  } catch (error) {
    console.error('Error creating registration:', error);
    throw error; // Re-throw to handle in the component
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
    console.error('Error fetching registrations:', error)
    throw error;
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
    throw error;
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
    throw error;
  }
}

export async function deleteRegistration(id: string): Promise<void> {
  try {
    const registrationRef = doc(db, 'registrations', id)
    await deleteDoc(registrationRef)
  } catch (error) {
    console.error('Error deleting registration:', error)
    throw error;
  }
}

export const getRegistrationsByEventAndEmail = async (eventId: string) => {
  try {
    const registrationsRef = collection(db, 'registrations')
    const q = query(
      registrationsRef,
      where('eventId', '==', eventId),
      orderBy('registrationDate', 'desc'),
      limit(1)
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Registration[]
  } catch (error) {
    console.error('Error getting registrations:', error)
    throw error;
  }
} 