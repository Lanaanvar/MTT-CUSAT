"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { getEvents, type Event } from "@/lib/services/events"

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    eventType: "all"
  })

  const fetchEvents = async () => {
    try {
      const data = await getEvents()
      setEvents(data)
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

  const filteredEvents = events.filter(event => {
    if (filters.eventType !== "all" && event.type !== filters.eventType) return false
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Event Management</h1>
        <Button asChild className="bg-blue-900 hover:bg-blue-800">
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Event
          </Link>
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <Select
          value={filters.eventType}
          onValueChange={(value) => setFilters(prev => ({ ...prev, eventType: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
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

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No events found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{event.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <p>{event.date} • {event.location}</p>
                      <Badge variant="outline">{event.type}</Badge>
                      <Badge>{event.status}</Badge>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/events/${event.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 