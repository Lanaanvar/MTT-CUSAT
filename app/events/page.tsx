"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getEvents, type Event } from "@/lib/services/events"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    status: "all"
  })

  useEffect(() => {
    fetchEvents()
  }, [filters.type, filters.status])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const fetchedEvents = await getEvents({
        type: filters.type,
        status: filters.status,
        search: filters.search
      })
      setEvents(fetchedEvents)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchEvents()
    }, 300)
    return () => clearTimeout(timeoutId)
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Events</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover our upcoming and past events, workshops, seminars, and competitions focused on microwave theory and
          techniques.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 bg-gray-50 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search events..." 
              className="pl-10" 
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select 
              value={filters.type}
              onValueChange={(value: string) => setFilters(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="lecture">Lecture</SelectItem>
                <SelectItem value="hackathon">Hackathon</SelectItem>
                <SelectItem value="competition">Competition</SelectItem>
                <SelectItem value="visit">Industry Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select 
              value={filters.status}
              onValueChange={(value: string) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-blue-900 hover:bg-blue-800" onClick={() => fetchEvents()}>
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      ) : (
        <>
          {/* Upcoming Events Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Upcoming Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter((event) => event.status === "upcoming")
                .map((event) => (
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
          </section>

          {/* Past Events Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Past Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter((event) => event.status === "past")
                .map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 right-3 bg-gray-600">{event.type}</Badge>
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <Badge className="bg-red-600 text-white px-3 py-1 text-sm">Past Event</Badge>
                      </div>
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
                    <CardFooter>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
