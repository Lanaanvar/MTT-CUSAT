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
  paymentScreenshot?: string
}

// Sample registration for fallback in case Firestore is blocked
const fallbackRegistration: Registration = {
  id: 'sample-registration-1',
  eventId: 'sample-event-1',
  eventTitle: 'Microwave Design Workshop',
  name: 'Sample User',
  email: 'user@example.com',
  phone: '1234567890',
  college: 'CUSAT',
  department: 'Electronics',
  year: '3',
  membershipType: 'ieee',
  membershipId: 'IEEE12345',
  registrationDate: new Date().toISOString(),
  status: 'approved',
  paymentStatus: 'completed',
  amount: 100
};

export async function createRegistration(data: Omit<Registration, 'id'>): Promise<string> {
  try {
    // Handle mobile Safari issue where some browsers have restrictions on Firestore
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      try {
        const registrationsRef = collection(db, 'registrations');
        const docRef = await addDoc(registrationsRef, data);
        return docRef.id;
      } catch (mobileError) {
        console.error('Mobile Firestore error:', mobileError);
        // Fallback to localStorage for mobile
        return saveRegistrationLocally(data);
      }
    } else {
      // Normal flow for desktop
      const registrationsRef = collection(db, 'registrations');
      const docRef = await addDoc(registrationsRef, data);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error creating registration:', error);
    
    // Store registration in localStorage as fallback
    return saveRegistrationLocally(data);
  }
}

// Helper function to save registration locally
function saveRegistrationLocally(data: Omit<Registration, 'id'>): string {
  try {
    const fallbackId = `registration-${Date.now()}`;
    const fallbackData = { id: fallbackId, ...data };
    
    // Read existing data with error handling
    let offlineRegistrations = [];
    try {
      const existingData = localStorage.getItem('offline_registrations');
      if (existingData) {
        offlineRegistrations = JSON.parse(existingData);
      }
    } catch (readError) {
      console.error('Error reading from localStorage:', readError);
      // Continue with empty array if can't read
    }
    
    // Add new registration
    offlineRegistrations.push(fallbackData);
    
    // Write back with error handling
    try {
      localStorage.setItem('offline_registrations', JSON.stringify(offlineRegistrations));
    } catch (writeError) {
      console.error('Error writing to localStorage:', writeError);
      // Try with just this registration if full array is too big
      try {
        localStorage.setItem('offline_registrations', JSON.stringify([fallbackData]));
      } catch (fallbackError) {
        console.error('Failed even with single registration:', fallbackError);
      }
    }
    
    console.log('Registration stored locally due to Firestore error');
    return fallbackId;
  } catch (storageError) {
    console.error('Failed to store registration locally:', storageError);
    return 'temp-' + Date.now();
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
    
    // Try to load any offline registrations from localStorage
    try {
      const offlineData = localStorage.getItem('offline_registrations');
      if (offlineData) {
        const offlineRegistrations = JSON.parse(offlineData) as Registration[];
        
        // Apply the same filters
        let filteredRegistrations = [...offlineRegistrations];
        
        if (filters?.eventId) {
          filteredRegistrations = filteredRegistrations.filter(reg => reg.eventId === filters.eventId);
        }
        
        if (filters?.status && filters.status !== 'all') {
          filteredRegistrations = filteredRegistrations.filter(reg => reg.status === filters.status);
        }
        
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredRegistrations = filteredRegistrations.filter(reg =>
            reg.name.toLowerCase().includes(searchLower) ||
            reg.email.toLowerCase().includes(searchLower) ||
            reg.college.toLowerCase().includes(searchLower)
          );
        }
        
        if (filteredRegistrations.length > 0) {
          return filteredRegistrations;
        }
      }
    } catch (storageError) {
      console.error('Error retrieving offline registrations:', storageError);
    }
    
    // Return fallback data if nothing else is available
    return [fallbackRegistration];
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
    
    // Check localStorage for offline registrations
    try {
      const offlineData = localStorage.getItem('offline_registrations');
      if (offlineData) {
        const offlineRegistrations = JSON.parse(offlineData) as Registration[];
        const offlineReg = offlineRegistrations.find(reg => reg.id === id);
        if (offlineReg) return offlineReg;
      }
    } catch (storageError) {
      console.error('Error retrieving offline registration:', storageError);
    }
    
    // Return fallback registration as last resort
    return fallbackRegistration;
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
    
    // Update in localStorage if firestore fails
    try {
      const offlineData = localStorage.getItem('offline_registrations');
      if (offlineData) {
        const offlineRegistrations = JSON.parse(offlineData) as Registration[];
        const index = offlineRegistrations.findIndex(reg => reg.id === id);
        
        if (index !== -1) {
          offlineRegistrations[index] = { ...offlineRegistrations[index], ...data };
          localStorage.setItem('offline_registrations', JSON.stringify(offlineRegistrations));
          console.log('Registration updated locally due to Firestore error');
        }
      }
    } catch (storageError) {
      console.error('Failed to update registration locally:', storageError);
    }
  }
}

export async function deleteRegistration(id: string): Promise<void> {
  try {
    const registrationRef = doc(db, 'registrations', id)
    await deleteDoc(registrationRef)
  } catch (error) {
    console.error('Error deleting registration:', error)
    
    // Remove from localStorage if firestore fails
    try {
      const offlineData = localStorage.getItem('offline_registrations');
      if (offlineData) {
        let offlineRegistrations = JSON.parse(offlineData) as Registration[];
        offlineRegistrations = offlineRegistrations.filter(reg => reg.id !== id);
        localStorage.setItem('offline_registrations', JSON.stringify(offlineRegistrations));
        console.log('Registration deleted locally due to Firestore error');
      }
    } catch (storageError) {
      console.error('Failed to delete registration locally:', storageError);
    }
  }
}

export const getRegistrationsByEventAndEmail = async (eventId: string) => {
  try {
    const registrationsRef = collection(db, 'registrations')
    const q = query(
      registrationsRef,
      where('eventId', '==', eventId),
      orderBy('registrationDate', 'desc'),
      // Note: In a real app, you'd get the user's email from the session
      // For now, we'll just get the most recent registration for this event
      // as a simple way to identify the user's registration
      limit(1)
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Registration[]
  } catch (error) {
    console.error('Error getting registrations:', error)
    
    // Check localStorage for offline registrations
    try {
      const offlineData = localStorage.getItem('offline_registrations');
      if (offlineData) {
        const offlineRegistrations = JSON.parse(offlineData) as Registration[];
        const filteredRegs = offlineRegistrations.filter(reg => reg.eventId === eventId);
        if (filteredRegs.length > 0) {
          return filteredRegs;
        }
      }
    } catch (storageError) {
      console.error('Error retrieving offline registrations:', storageError);
    }
    
    // Return fallback data if nothing else is available
    return [fallbackRegistration];
  }
} 