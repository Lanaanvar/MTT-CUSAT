"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  getRegistrations,
  updateRegistration,
  deleteRegistration,
  type Registration
} from "@/lib/services/registrations"
import { getEventById, type Event } from "@/lib/services/events"

export default function EventRegistrationsPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "all",
    search: ""
  })

  const fetchEvent = async () => {
    try {
      const eventData = await getEventById(params.id)
      if (!eventData) {
        toast.error("Event not found")
        return
      }
      setEvent(eventData)
    } catch (error) {
      console.error("Error fetching event:", error)
      toast.error("Failed to load event")
    }
  }

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const data = await getRegistrations({ ...filters, eventId: params.id })
      setRegistrations(data)
    } catch (error) {
      console.error("Error fetching registrations:", error)
      toast.error("Failed to load registrations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [params.id])

  useEffect(() => {
    if (event) {
      fetchRegistrations()
    }
  }, [event, filters])

  const handleStatusChange = async (registrationId: string, newStatus: string) => {
    try {
      await updateRegistration(registrationId, { status: newStatus as Registration['status'] })
      toast.success("Registration status updated")
      fetchRegistrations()
    } catch (error) {
      console.error("Error updating registration:", error)
      toast.error("Failed to update registration status")
    }
  }

  const handlePaymentStatusChange = async (registrationId: string, newStatus: string) => {
    try {
      await updateRegistration(registrationId, { paymentStatus: newStatus as Registration['paymentStatus'] })
      toast.success("Payment status updated")
      fetchRegistrations()
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
      fetchRegistrations()
    } catch (error) {
      console.error("Error deleting registration:", error)
      toast.error("Failed to delete registration")
    }
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/admin/events">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{event.title}</h1>
          </div>
          <p className="text-gray-500">
            {event.date} • {event.location}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  )
} 