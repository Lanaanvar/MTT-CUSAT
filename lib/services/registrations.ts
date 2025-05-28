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

export async function createRegistration(registrationData: Omit<Registration, 'id'>): Promise<string> {
  try {
    // Try to anonymously authenticate if possible
    if (isAnonymousAuthEnabled) {
      await signInAnonymously(auth);
    }
    
    // First attempt - using standard collection
    const registrationsRef = collection(db, 'registrations');
    const docRef = await addDoc(registrationsRef, {
      ...registrationData,
      createdAt: new Date().toISOString()
    });
    
    return docRef.id;
  } catch (error) {
    // If first attempt fails, try direct approach
    try {
      // Try a different approach - direct path
      const directDocRef = await addDoc(collection(db, 'registrations'), {
        ...registrationData,
        createdAt: new Date().toISOString(),
        directSubmission: true
      });
      
      return directDocRef.id;
    } catch (directError) {
      // If all Firebase attempts fail, try storing locally
      try {
        const fallbackId = `offline-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const registrationWithId = { 
          id: fallbackId,
          ...registrationData,
          isOffline: true,
          createdAt: new Date().toISOString()
        };
        
        // Store offline
        const existingItems = localStorage.getItem('offline-registrations');
        const offlineRegistrations = existingItems ? JSON.parse(existingItems) : [];
        offlineRegistrations.push(registrationWithId);
        localStorage.setItem('offline-registrations', JSON.stringify(offlineRegistrations));
        
        return fallbackId;
      } catch (storageError) {
        // Re-throw the original error if local storage fails
        throw error;
      }
    }
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
    const docRef = doc(db, 'registrations', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Registration;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export async function updateRegistration(id: string, data: Partial<Registration>): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'registrations', id), { 
      ...data,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function deleteRegistration(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'registrations', id));
    return true;
  } catch (error) {
    return false;
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

export async function getRegistrationsByEventId(eventId: string): Promise<Registration[]> {
  try {
    const q = query(
      collection(db, 'registrations'),
      where('eventId', '==', eventId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Registration));
  } catch (error) {
    // Return empty array on error
    return [];
  }
} 