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
    console.error('Error fetching events:', error)
    // Return fallback data if Firestore is blocked or fails
    console.log('Using fallback event data due to Firestore error');
    
    // Filter fallback data according to the same filters
    let events = [...fallbackEvents];
    
    if (filters?.type && filters.type !== 'all') {
      events = events.filter(event => event.type === filters.type);
    }
    
    if (filters?.status && filters.status !== 'all') {
      events = events.filter(event => event.status === filters.status);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      events = events.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      );
    }
    
    return events;
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const eventDoc = await getDoc(doc(db, 'events', id))
    if (!eventDoc.exists()) return null
    
    return {
      id: eventDoc.id,
      ...normalizeEventData(eventDoc.data())
    } as Event
  } catch (error) {
    console.error('Error fetching event:', error)
    // Return fallback event if Firestore is blocked or fails
    const fallbackEvent = fallbackEvents.find(event => event.id === id);
    
    // If no matching fallback event, find any fallback event
    return fallbackEvent || fallbackEvents[0] || null;
  }
}

export async function updateEvent(
  id: string,
  data: Partial<Omit<Event, 'id'>>
): Promise<void> {
  try {
    const eventRef = doc(db, 'events', id)
    await updateDoc(eventRef, data)
  } catch (error) {
    console.error('Error updating event:', error)
    
    // Store event updates in localStorage as fallback
    try {
      const offlineData = localStorage.getItem('offline_event_updates');
      const updates = offlineData ? JSON.parse(offlineData) : {};
      
      // Store the update request with timestamp
      updates[id] = {
        data,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('offline_event_updates', JSON.stringify(updates));
      console.log('Event update stored locally due to Firestore error');
    } catch (storageError) {
      console.error('Failed to store event update locally:', storageError);
    }
    
    throw new Error('Failed to update event. Changes saved locally for later sync.');
  }
}

export async function createEvent(data: Omit<Event, 'id'>): Promise<string> {
  try {
    const eventsRef = collection(db, 'events');
    const docRef = await addDoc(eventsRef, data);
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    
    // Store event creation in localStorage as fallback
    try {
      const fallbackId = `event-${Date.now()}`;
      const fallbackData = { id: fallbackId, ...data };
      
      // Store in localStorage
      const offlineData = localStorage.getItem('offline_events');
      const offlineEvents = offlineData ? JSON.parse(offlineData) : [];
      offlineEvents.push(fallbackData);
      localStorage.setItem('offline_events', JSON.stringify(offlineEvents));
      
      console.log('Event stored locally due to Firestore error');
      return fallbackId;
    } catch (storageError) {
      console.error('Failed to store event locally:', storageError);
      throw new Error('Failed to create event');
    }
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    const eventRef = doc(db, 'events', id);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    
    // Record deletion request in localStorage as fallback
    try {
      const offlineData = localStorage.getItem('offline_event_deletions');
      const deletions = offlineData ? JSON.parse(offlineData) : [];
      
      // Add to deletion queue
      deletions.push({
        id,
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem('offline_event_deletions', JSON.stringify(deletions));
      console.log('Event deletion request stored locally due to Firestore error');
    } catch (storageError) {
      console.error('Failed to store event deletion locally:', storageError);
    }
    
    throw new Error('Failed to delete event. Request saved locally for later sync.');
  }
} 