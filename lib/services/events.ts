import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc
} from 'firebase/firestore'
import { db } from '../firebase'

export interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: string
  image: string
  description: string
  status: 'upcoming' | 'past'
  fees?: {
    ieee: number
    nonIeee: number
  }
  createdAt: string
  postRegistrationMessage?: string
  postRegistrationLink?: string
  postRegistrationButtonText?: string
}

// Sample fallback data in case Firestore is blocked
const fallbackEvents: Event[] = [
  {
    id: 'sample-event-1',
    title: 'Microwave Design Workshop',
    date: 'December 15, 2023',
    time: '10:00 AM',
    location: 'CUSAT Campus',
    type: 'workshop',
    image: '/images/events/workshop.jpg',
    description: 'Learn about advanced microwave design principles and techniques.',
    status: 'upcoming',
    fees: { ieee: 100, nonIeee: 200 },
    createdAt: '2023-11-15T10:00:00Z'
  },
  {
    id: 'sample-event-2',
    title: 'RF Systems Seminar',
    date: 'January 20, 2024',
    time: '2:00 PM',
    location: 'Online',
    type: 'lecture',
    image: '/images/events/seminar.jpg',
    description: 'Expert talk on modern RF systems and their applications.',
    status: 'upcoming',
    fees: { ieee: 0, nonIeee: 50 },
    createdAt: '2023-12-01T10:00:00Z'
  }
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':')
  const date = new Date()
  date.setHours(parseInt(hours), parseInt(minutes))
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
}

function determineEventStatus(dateStr: string): 'upcoming' | 'past' {
  const eventDate = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventDate >= today ? 'upcoming' : 'past'
}

function normalizeEventData(data: any): Omit<Event, 'id'> {
  return {
    ...data,
    fees: data.fees || { ieee: 0, nonIeee: 0 },
    date: formatDate(data.date),
    time: formatTime(data.time),
    status: determineEventStatus(data.date)
  }
}

export async function getEvents(filters?: {
  type?: string
  status?: string
  search?: string
}): Promise<Event[]> {
  try {
    let eventsQuery = collection(db, 'events')
    let constraints = []

    if (filters?.type && filters.type !== 'all') {
      constraints.push(where('type', '==', filters.type))
    }

    // Always order by date
    constraints.push(orderBy('date', 'desc'))

    const q = query(eventsQuery, ...constraints)
    const querySnapshot = await getDocs(q)
    
    let events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...normalizeEventData(doc.data())
    })) as Event[]

    // Handle status filter in memory since it's dynamic based on current date
    if (filters?.status && filters.status !== 'all') {
      events = events.filter(event => event.status === filters.status)
    }

    // Handle search filter in memory
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      events = events.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      )
    }

    return events
  } catch (error) {
    // Return empty array on error
    return [];
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Event;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'events', id), { 
      ...data,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    // If Firestore update fails, try to store update locally
    try {
      const existingItems = localStorage.getItem('pending-event-updates');
      const pendingUpdates = existingItems ? JSON.parse(existingItems) : [];
      pendingUpdates.push({ id, data, timestamp: new Date().toISOString() });
      localStorage.setItem('pending-event-updates', JSON.stringify(pendingUpdates));
      return true;
    } catch (storageError) {
      return false;
    }
  }
}

export async function createEvent(data: Omit<Event, 'id'>): Promise<string | null> {
  try {
    const eventsRef = collection(db, 'events');
    const docRef = await addDoc(eventsRef, {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    // If Firestore creation fails, try to store locally
    try {
      const fallbackId = `offline-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const eventWithId = { 
        id: fallbackId,
        ...data,
        isOffline: true,
        createdAt: new Date().toISOString()
      };
      
      // Store offline
      const existingItems = localStorage.getItem('offline-events');
      const offlineEvents = existingItems ? JSON.parse(existingItems) : [];
      offlineEvents.push(eventWithId);
      localStorage.setItem('offline-events', JSON.stringify(offlineEvents));
      
      return fallbackId;
    } catch (storageError) {
      return null;
    }
  }
}

export async function deleteEvent(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'events', id));
    return true;
  } catch (error) {
    // If Firestore deletion fails, try to store deletion request locally
    try {
      const existingItems = localStorage.getItem('pending-event-deletions');
      const pendingDeletions = existingItems ? JSON.parse(existingItems) : [];
      pendingDeletions.push({ id, timestamp: new Date().toISOString() });
      localStorage.setItem('pending-event-deletions', JSON.stringify(pendingDeletions));
      return true;
    } catch (storageError) {
      return false;
    }
  }
} 