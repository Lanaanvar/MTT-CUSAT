import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const sampleEvents = [
  {
    title: "Introduction to RF Design Workshop",
    date: "2024-06-15",
    time: "10:00 AM",
    location: "DOE CUSAT",
    type: "workshop",
    image: "/events/rf-workshop.jpg",
    description: "Join us for an intensive workshop on RF Design fundamentals. Learn about transmission lines, Smith charts, and practical RF circuit design.",
    status: "upcoming",
    fees: {
      ieee: 500,
      nonIeee: 750
    },
    createdAt: new Date().toISOString()
  },
  {
    title: "Guest Lecture: Future of 6G Technology",
    date: "2024-05-20",
    time: "02:00 PM",
    location: "Seminar Hall, DOE CUSAT",
    type: "lecture",
    image: "/events/6g-lecture.jpg",
    description: "Distinguished lecture on the future prospects of 6G technology and its potential impact on global communications.",
    status: "upcoming",
    fees: {
      ieee: 0,
      nonIeee: 100
    },
    createdAt: new Date().toISOString()
  },
  {
    title: "RF Circuit Design Competition",
    date: "2024-07-10",
    time: "09:00 AM",
    location: "Electronics Lab, DOE CUSAT",
    type: "competition",
    image: "/events/rf-competition.jpg",
    description: "Show off your RF circuit design skills in this exciting competition. Design, simulate, and present your innovative RF solutions.",
    status: "upcoming",
    fees: {
      ieee: 200,
      nonIeee: 400
    },
    createdAt: new Date().toISOString()
  }
]

async function seedEvents() {
  try {
    const eventsRef = collection(db, 'events')
    
    for (const event of sampleEvents) {
      await addDoc(eventsRef, event)
      console.log(`Added event: ${event.title}`)
    }
    
    console.log('Successfully seeded events!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding events:', error)
    process.exit(1)
  }
}

seedEvents() 