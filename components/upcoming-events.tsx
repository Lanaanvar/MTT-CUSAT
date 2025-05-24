"use client"

import Link from "next/link"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEvents, type Event } from "@/lib/services/events"
import { useEffect, useState } from "react"

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents({ status: 'upcoming' })
        // Take only the first 3 events
        setEvents(fetchedEvents.slice(0, 3))
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative h-48 bg-gray-200 animate-pulse" />
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No upcoming events at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-48">
            <img 
              src={event.image || "/placeholder.svg"} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-3 right-3 bg-blue-900">{event.type}</Badge>
          </div>
          <CardHeader className="pb-2">
            <h3 className="text-xl font-bold">{event.title}</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
            </div>
            <p className="text-gray-700 line-clamp-2 mt-2">{event.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline" size="sm">
              <Link href={`/events/${event.id}`}>Details</Link>
            </Button>
            <Button asChild size="sm" className="bg-blue-900 hover:bg-blue-800">
              <Link href={`/events/${event.id}/register`}>Register</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
