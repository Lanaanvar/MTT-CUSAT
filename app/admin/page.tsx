"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, addDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, ChevronDown, ChevronRight, Pencil } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { handleError, validateEventForm, validateImageFile } from "@/lib/utils/error-handling"
import { uploadImage } from "@/app/utils/cloudinary"
import { getEvents, type Event } from "@/lib/services/events"
import {
  getRegistrations,
  updateRegistration,
  deleteRegistration,
  type Registration
} from "@/lib/services/registrations"

interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  image: string;
  description: string;
  status: 'upcoming' | 'past';
  fees: {
    ieee: number;
    nonIeee: number;
  };
  postRegistrationMessage: string;
  postRegistrationLink: string;
  postRegistrationButtonText: string;
}

const initialFormData: EventFormData = {
  title: "",
  date: "",
  time: "",
  location: "",
  type: "",
  image: "",
  description: "",
  status: "upcoming",
  fees: {
    ieee: 0,
    nonIeee: 0
  },
  postRegistrationMessage: "",
  postRegistrationLink: "",
  postRegistrationButtonText: ""
}

export default function AdminPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [formData, setFormData] = useState<EventFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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
    if (selectedEvent?.id) {
      fetchRegistrations(selectedEvent.id)
    }
  }, [selectedEvent?.id, filters])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name === "ieee" || name === "nonIeee") {
      setFormData((prev) => ({
        ...prev,
        fees: {
          ...prev.fees,
          [name]: Number(value) || 0
        }
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      validateImageFile(file)

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      handleError(error)
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      validateEventForm(formData)

      let imageUrl = formData.image
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile)
        } catch (error) {
          handleError(error)
          setIsSubmitting(false)
          return
        }
      }

      const eventData = {
        ...formData,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      }

      if (selectedEvent) {
        // Update existing event
        const eventRef = doc(db, "events", selectedEvent.id)
        await updateDoc(eventRef, eventData)
        toast.success("Event updated successfully!")
      } else {
        // Create new event
        const eventsRef = collection(db, "events")
        await addDoc(eventsRef, eventData)
        toast.success("Event added successfully!")
      }

      setFormData(initialFormData)
      setImageFile(null)
      setImagePreview(null)
      setSelectedEvent(null)
      fetchEvents()
    } catch (error) {
      handleError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEventClick = (event: Event) => {
    if (selectedEvent?.id === event.id) {
      setSelectedEvent(null)
      setRegistrations([])
    } else {
      setSelectedEvent(event)
      // Pre-fill form data for editing
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        type: event.type,
        image: event.image,
        description: event.description,
        status: event.status,
        fees: event.fees || { ieee: 0, nonIeee: 0 },
        postRegistrationMessage: event.postRegistrationMessage || "",
        postRegistrationLink: event.postRegistrationLink || "",
        postRegistrationButtonText: event.postRegistrationButtonText || ""
      })
      setImagePreview(event.image)
    }
  }

  const handleStatusChange = async (registrationId: string, newStatus: string) => {
    try {
      await updateRegistration(registrationId, { status: newStatus as Registration['status'] })
      toast.success("Registration status updated")
      if (selectedEvent) fetchRegistrations(selectedEvent.id)
    } catch (error) {
      console.error("Error updating registration:", error)
      toast.error("Failed to update registration status")
    }
  }

  const handlePaymentStatusChange = async (registrationId: string, newStatus: string) => {
    try {
      await updateRegistration(registrationId, { paymentStatus: newStatus as Registration['paymentStatus'] })
      toast.success("Payment status updated")
      if (selectedEvent) fetchRegistrations(selectedEvent.id)
    } catch (error) {
      console.error("Error updating payment status:", error)
      toast.error("Failed to update payment status")
    }
  }

  const handleDeleteRegistration = async (registrationId: string) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return

    try {
      await deleteRegistration(registrationId)
      toast.success("Registration deleted")
      if (selectedEvent) fetchRegistrations(selectedEvent.id)
    } catch (error) {
      console.error("Error deleting registration:", error)
      toast.error("Failed to delete registration")
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Events Management</CardTitle>
          <Button
            onClick={() => {
              setSelectedEvent(null)
              setFormData(initialFormData)
              setImageFile(null)
              setImagePreview(null)
            }}
            className="bg-blue-900 hover:bg-blue-800"
          >
            Add New Event
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => handleEventClick(event)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    {selectedEvent?.id === event.id ? (
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
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge>{event.status}</Badge>
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </div>
                </button>

                {selectedEvent?.id === event.id && (
                  <div className="border-t">
                    <Tabs defaultValue="details" className="w-full">
                      <div className="border-b px-4">
                        <TabsList>
                          <TabsTrigger value="details">Event Details</TabsTrigger>
                          <TabsTrigger value="registrations">Registrations</TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="details" className="p-4">
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="title">Event Title</Label>
                              <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="type">Event Type</Label>
                              <Select
                                value={formData.type}
                                onValueChange={(value: string) => handleSelectChange("type", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="workshop">Workshop</SelectItem>
                                  <SelectItem value="lecture">Lecture</SelectItem>
                                  <SelectItem value="hackathon">Hackathon</SelectItem>
                                  <SelectItem value="competition">Competition</SelectItem>
                                  <SelectItem value="visit">Industry Visit</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="date">Date</Label>
                              <Input
                                id="date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="time">Time</Label>
                              <Input
                                id="time"
                                name="time"
                                type="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="status">Status</Label>
                              <Select
                                value={formData.status}
                                onValueChange={(value: 'upcoming' | 'past') => handleSelectChange("status", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="upcoming">Upcoming</SelectItem>
                                  <SelectItem value="past">Past</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Event Image</Label>
                              <div className="flex flex-col gap-4">
                                {imagePreview && (
                                  <div className="relative w-full h-48">
                                    <img
                                      src={imagePreview}
                                      alt="Preview"
                                      className="w-full h-full object-cover rounded-md"
                                    />
                                  </div>
                                )}
                                <div className="flex items-center gap-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Image
                                  </Button>
                                  <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                  />
                                  {imageFile && <span className="text-sm text-gray-500">{imageFile.name}</span>}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <Label>Registration Fees</Label>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="ieee">IEEE Members (₹)</Label>
                                  <Input
                                    id="ieee"
                                    name="ieee"
                                    type="number"
                                    min="0"
                                    value={formData.fees.ieee}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="nonIeee">Non-IEEE Members (₹)</Label>
                                  <Input
                                    id="nonIeee"
                                    name="nonIeee"
                                    type="number"
                                    min="0"
                                    value={formData.fees.nonIeee}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="postRegistrationMessage">Post-Registration Message</Label>
                            <Textarea
                              id="postRegistrationMessage"
                              name="postRegistrationMessage"
                              value={formData.postRegistrationMessage}
                              onChange={handleChange}
                              placeholder="Enter message to show after successful registration (e.g., instructions, links, etc.)"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="postRegistrationLink">Post-Registration Link (Optional)</Label>
                              <Input
                                id="postRegistrationLink"
                                name="postRegistrationLink"
                                value={formData.postRegistrationLink}
                                onChange={handleChange}
                                placeholder="Enter a link to show after registration"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="postRegistrationButtonText">Link Button Text</Label>
                              <Input
                                id="postRegistrationButtonText"
                                name="postRegistrationButtonText"
                                value={formData.postRegistrationButtonText}
                                onChange={handleChange}
                                placeholder="Enter button text for the link (e.g., 'Join WhatsApp Group')"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end space-x-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setFormData(initialFormData)
                                setImageFile(null)
                                setImagePreview(null)
                                setSelectedEvent(null)
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="bg-blue-900 hover:bg-blue-800"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (selectedEvent ? "Updating..." : "Adding...") : (selectedEvent ? "Update Event" : "Add Event")}
                            </Button>
                          </div>
                        </form>
                      </TabsContent>

                      <TabsContent value="registrations" className="p-4">
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
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2">Name</th>
                                    <th className="text-left py-2">Contact</th>
                                    <th className="text-left py-2">College</th>
                                    <th className="text-left py-2">Status</th>
                                    <th className="text-left py-2">Payment</th>
                                    <th className="text-left py-2">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {registrations.map((registration) => (
                                    <tr key={registration.id} className="border-b">
                                      <td className="py-2">
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
                                      </td>
                                      <td className="py-2">
                                        <div>
                                          <p>{registration.email}</p>
                                          <p className="text-sm text-gray-500">{registration.phone}</p>
                                        </div>
                                      </td>
                                      <td className="py-2">
                                        <div>
                                          <p>{registration.college}</p>
                                          <p className="text-sm text-gray-500">
                                            {registration.department} • {registration.year} Year
                                          </p>
                                        </div>
                                      </td>
                                      <td className="py-2">
                                        <Select
                                          value={registration.status}
                                          onValueChange={(value) => handleStatusChange(registration.id, value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue>
                                              <Badge
                                                className={
                                                  registration.status === "approved"
                                                    ? "bg-green-600"
                                                    : registration.status === "rejected"
                                                    ? "bg-red-600"
                                                    : "bg-yellow-600"
                                                }
                                              >
                                                {registration.status}
                                              </Badge>
                                            </SelectValue>
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </td>
                                      <td className="py-2">
                                        <Select
                                          value={registration.paymentStatus}
                                          onValueChange={(value) =>
                                            handlePaymentStatusChange(registration.id, value)
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue>
                                              <Badge
                                                className={
                                                  registration.paymentStatus === "completed"
                                                    ? "bg-green-600"
                                                    : "bg-yellow-600"
                                                }
                                              >
                                                {registration.paymentStatus}
                                              </Badge>
                                            </SelectValue>
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </td>
                                      <td className="py-2">
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => handleDeleteRegistration(registration.id)}
                                        >
                                          Delete
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 