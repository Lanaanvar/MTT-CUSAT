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
  // Ensure all required fields exist
  const completeRegistrationData = {
    ...registrationData,
    status: registrationData.status || 'pending',
    paymentStatus: registrationData.paymentStatus || 'pending',
    amount: registrationData.amount || 0,
    registrationDate: registrationData.registrationDate || new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  // Direct attempt to create registration without auth check
  try {
    const registrationsRef = collection(db, 'registrations');
    const docRef = await addDoc(registrationsRef, completeRegistrationData);
    return docRef.id;
  } catch (error) {
    console.error("Registration creation failed:", error);
    throw error;
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