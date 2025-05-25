"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEventById } from "@/lib/services/events"
import type { Event } from "@/lib/services/events"

export default function RegistrationSuccessPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(params.id)
        setEvent(eventData)
      } catch (error) {
        console.error("Error fetching event:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600">Event not found</p>
              <Button asChild className="mt-4">
                <Link href="/events">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Registration Successful</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-blue max-w-none">
            {event.postRegistrationMessage && (
              <div className="whitespace-pre-wrap text-lg">{event.postRegistrationMessage}</div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline">
              <Link href={`/events/${event.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Event
              </Link>
            </Button>

            {event.postRegistrationLink && event.postRegistrationButtonText && (
              <Button asChild className="bg-blue-900 hover:bg-blue-800">
                <Link href={event.postRegistrationLink} target="_blank" rel="noopener noreferrer">
                  {event.postRegistrationButtonText}
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 