"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Plus, Edit, Users, Download } from "lucide-react"
import { toast } from "sonner"
import {
  getRegistrations,
  updateRegistration,
  deleteRegistration,
  type Registration
} from "@/lib/services/registrations"
import { getEvents, type Event } from "@/lib/services/events"
import { convertRegistrationsToCSV, downloadCSV } from "../../lib/utils/csv"

export default function RegistrationsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "all",
    search: ""
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

  const fetchRegistrations = async (eventId: string) => {
    try {
      setLoading(true)
      const data = await getRegistrations({ ...filters, eventId })
      setRegistrations(data)
    } catch (error) {
      console.error("Error fetching registrations:", error)
      toast.error("Failed to load registrations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (selectedEventId) {
      fetchRegistrations(selectedEventId)
    }
  }, [selectedEventId, filters])

  const handleStatusChange = async (registrationId: string, newStatus: string) => {
    try {
      await updateRegistration(registrationId, { status: newStatus as Registration['status'] })
      toast.success("Registration status updated")
      if (selectedEventId) fetchRegistrations(selectedEventId)
    } catch (error) {
      console.error("Error updating registration:", error)
      toast.error("Failed to update registration status")
    }
  }

  const handlePaymentStatusChange = async (registrationId: string, newStatus: string) => {
    try {
      await updateRegistration(registrationId, { paymentStatus: newStatus as Registration['paymentStatus'] })
      toast.success("Payment status updated")
      if (selectedEventId) fetchRegistrations(selectedEventId)
    } catch (error) {
      console.error("Error updating payment status:", error)
      toast.error("Failed to update payment status")
    }
  }

  const handleDelete = async (registrationId: string) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return

    try {
      await deleteRegistration(registrationId)
      toast.success("Registration deleted")
      if (selectedEventId) fetchRegistrations(selectedEventId)
    } catch (error) {
      console.error("Error deleting registration:", error)
      toast.error("Failed to delete registration")
    }
  }

  const handleEventClick = (eventId: string) => {
    if (selectedEventId === eventId) {
      setSelectedEventId(null)
      setRegistrations([])
    } else {
      setSelectedEventId(eventId)
    }
  }

  const handleExportCSV = (eventId: string, eventTitle: string) => {
    const eventRegistrations = registrations.filter(reg => reg.eventId === eventId);
    if (!eventRegistrations.length) return;
    
    const csvContent = convertRegistrationsToCSV(eventRegistrations);
    const filename = `${eventTitle.toLowerCase().replace(/\s+/g, '-')}-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Events and Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && events.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No events found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-4">
                    <button
                      onClick={() => handleEventClick(event.id)}
                      className="flex items-center space-x-4 hover:text-blue-600"
                    >
                      {selectedEventId === event.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                      <div className="text-left">
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-gray-500">
                          {event.date} • {event.location}
                        </p>
                      </div>
                    </button>
                    <div className="flex items-center gap-3">
                      <Badge>{event.status}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportCSV(event.id, event.title)}
                        disabled={selectedEventId !== event.id || !registrations.length}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                      </Button>
                    </div>
                  </div>

                  {selectedEventId === event.id && (
                    <div className="border-t">
                      <div className="p-4 bg-gray-50 border-b">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              placeholder="Search by name, email, or college..."
                              value={filters.search}
                              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            />
                          </div>
                          <Select
                            value={filters.status}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
                          <p className="mt-2 text-gray-600">Loading registrations...</p>
                        </div>
                      ) : registrations.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-600">No registrations found</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>College</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {registrations.map((registration) => (
                                <TableRow key={registration.id}>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{registration.name}</p>
                                      <p className="text-sm text-gray-500">
                                        {registration.membershipType === "ieee" ? (
                                          <span>IEEE Member • {registration.membershipId}</span>
                                        ) : (
                                          "Non-IEEE Member"
                                        )}
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <p>{registration.email}</p>
                                      <p className="text-sm text-gray-500">{registration.phone}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <p>{registration.college}</p>
                                      <p className="text-sm text-gray-500">
                                        {registration.department} • {registration.year} Year
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Select
                                      value={registration.status}
                                      onValueChange={(value) => handleStatusChange(registration.id, value)}
                                    >
                                      <SelectTrigger className="w-[130px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-2">
                                      <Select
                                        value={registration.paymentStatus}
                                        onValueChange={(value) => handlePaymentStatusChange(registration.id, value)}
                                      >
                                        <SelectTrigger className="w-[130px]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      {registration.amount > 0 && (
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline">₹{registration.amount}</Badge>
                                          {registration.paymentScreenshot && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              asChild
                                            >
                                              <Link href={registration.paymentScreenshot} target="_blank" rel="noopener noreferrer">
                                                View Receipt
                                              </Link>
                                            </Button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDelete(registration.id)}
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 