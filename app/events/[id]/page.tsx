"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEventById, type Event } from "@/lib/services/events"

export default function EventPage({ params }: { params: { id: string } }) {
  const eventId = params.id;
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(eventId)
        setEvent(eventData)
      } catch (error) {
        console.error("Error fetching event:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading event details...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Event Not Found</h1>
        <p className="text-gray-600 mb-6">
          The event you are looking for does not exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <div className="relative h-[300px] md:h-[400px]">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <Badge
                className={`absolute top-4 right-4 ${
                  event.status === "upcoming"
                    ? "bg-blue-900"
                    : "bg-gray-600"
                }`}
              >
                {event.type}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span>
                    {(event.fees?.ieee === 0 && event.fees?.nonIeee === 0) || !event.fees
                      ? "Free for all"
                      : `IEEE Members: ${
                          !event.fees?.ieee || event.fees.ieee === 0
                            ? "Free"
                            : `₹${event.fees.ieee}`
                        } | Non-Members: ${
                          !event.fees?.nonIeee || event.fees.nonIeee === 0
                            ? "Free"
                            : `₹${event.fees.nonIeee}`
                        }`}
                  </span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-2">About This Event</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Registration Fee</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    IEEE Members:{" "}
                    <span className="font-medium">
                      {!event.fees?.ieee || event.fees.ieee === 0 ? "Free" : `₹${event.fees.ieee}`}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Non-IEEE Members:{" "}
                    <span className="font-medium">
                      {!event.fees?.nonIeee || event.fees.nonIeee === 0
                        ? "Free"
                        : `₹${event.fees.nonIeee}`}
                    </span>
                  </p>
                </div>
              </div>

              {event.status === "upcoming" && (
                <Button
                  asChild
                  className="w-full bg-blue-900 hover:bg-blue-800"
                >
                  <Link href={`/events/${event.id}/register`}>
                    Register Now
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
