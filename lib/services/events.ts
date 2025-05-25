import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore'
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