"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { getEvents, type Event } from "@/lib/services/events"
import { getRegistrations } from "@/lib/services/registrations"

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [registrationsCount, setRegistrationsCount] = useState<Record<string, number>>({})

  const fetchEvents = async () => {
    try {
      const data = await getEvents()
      setEvents(data)
      
      // Fetch registration counts for each event
      const counts: Record<string, number> = {}
      for (const event of data) {
        const registrations = await getRegistrations({ eventId: event.id })
        counts[event.id] = registrations.length
      }
      setRegistrationsCount(counts)
    } catch (error) {
      console.error("Error fetching events:", error)
      toast.error("Failed to load events")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Events Management</h1>
        <Button asChild className="bg-blue-900 hover:bg-blue-800">
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-600">
              <p>No events found</p>
              <Button asChild className="mt-4 bg-blue-900 hover:bg-blue-800">
                <Link href="/admin/events/new">Create your first event</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.date} • {event.location}
                    </p>
                  </div>
                  <Badge>{event.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Registration Fee</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>IEEE Members: {!event.fees?.ieee || event.fees.ieee === 0 ? "Free" : `₹${event.fees.ieee}`}</p>
                      <p>Non-IEEE: {!event.fees?.nonIeee || event.fees.nonIeee === 0 ? "Free" : `₹${event.fees.nonIeee}`}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Registrations</h4>
                    <p className="text-sm text-gray-600">{registrationsCount[event.id] || 0} registrations</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex gap-3 w-full">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/admin/events/${event.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/admin/events/${event.id}/registrations`}>
                      <Users className="mr-2 h-4 w-4" />
                      Registrations
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 