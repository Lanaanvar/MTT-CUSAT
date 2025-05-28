"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
        <Card className="max-w-2xl mx-auto shadow-md">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your registration details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-md">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-red-600 font-medium mb-4">Event not found</p>
              <Button asChild>
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
      <Card className="max-w-2xl mx-auto shadow-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-center text-xl md:text-2xl">Registration Successful</CardTitle>
          <CardDescription className="text-center mt-2">
            You have successfully registered for {event.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start mb-2">
              <Calendar className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium">Event Details</p>
                <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                <p className="text-sm text-gray-600">Location: {event.location}</p>
              </div>
            </div>
          </div>

          {event.postRegistrationMessage && (
            <div className="prose prose-blue max-w-none bg-gray-50 p-4 rounded-lg">
              <div className="whitespace-pre-wrap text-sm md:text-base">{event.postRegistrationMessage}</div>
            </div>
          )}

          {event.fees && (
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-medium mb-1">Registration Fee</p>
              <p className="text-sm text-gray-600">
                IEEE Member: ₹{event.fees.ieee} | Non-IEEE Member: ₹{event.fees.nonIeee}
              </p>
              {event.fees.ieee > 0 || event.fees.nonIeee > 0 ? (
                <p className="text-sm text-yellow-600 mt-2">
                  Payment confirmation will be sent to your email.
                </p>
              ) : (
                <p className="text-sm text-green-600 mt-2">
                  This is a free event. No payment required.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={`/events/${event.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Event
              </Link>
            </Button>

            {event.postRegistrationLink && event.postRegistrationButtonText && (
              <Button asChild className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800">
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