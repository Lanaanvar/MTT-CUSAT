"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// This would typically come from a database
const getEventById = (id: string) => {
  const events = [
    {
      id: "1",
      title: "Workshop on RF Circuit Design",
      date: "June 15, 2023",
      time: "10:00 AM - 4:00 PM",
      location: "CUSAT Seminar Hall",
      type: "Workshop",
      image: "/placeholder.svg?height=200&width=400&text=RF+Circuit+Design",
      description: "Learn the fundamentals of RF circuit design with hands-on exercises using industry-standard tools.",
      status: "upcoming",
      registrationFee: "₹500 for IEEE members, ₹800 for non-members",
    },
    // More events would be here
  ]

  return events.find((event) => event.id === id)
}

export default function EventRegistrationPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  const event = getEventById(eventId)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    department: "",
    year: "",
    ieeeNumber: "",
    isMember: false,
    requirements: "",
    agreeTerms: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    try {
      // In a real app, you would send this data to your backend
      // await fetch('/api/register', { method: 'POST', body: JSON.stringify(formData) });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSuccess(true)
      // In a real app, you might redirect to a success page or show a success message
    } catch (error) {
      console.error("Registration failed:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Event Not Found</h1>
        <p className="text-gray-600 mb-6">The event you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </Button>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-md">
        <Card className="border-green-200 shadow-md">
          <CardHeader className="text-center bg-green-50 border-b border-green-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Registration Successful!</CardTitle>
            <CardDescription className="text-green-700">Thank you for registering for {event.title}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <p className="text-gray-700">
                We have sent a confirmation email to <span className="font-medium">{formData.email}</span> with all the
                details.
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 mr-2 text-blue-900" />
                  <span className="font-medium">{event.date}</span>
                </div>
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 mr-2 text-blue-900" />
                  <span className="font-medium">{event.time}</span>
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-900" />
                  <span className="font-medium">{event.location}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button asChild className="w-full bg-blue-900 hover:bg-blue-800">
              <Link href={`/events/${eventId}`}>View Event Details</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/events">Browse More Events</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href={`/events/${eventId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Event
          </Link>
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Register for Event</h1>
          <p className="text-gray-600">{event.title}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-blue-900">Personal Information</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution">
                      Institution <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      required
                      placeholder="Enter your institution name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">
                      Department <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      placeholder="E.g., Electronics, Computer Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year of Study</Label>
                    <Select value={formData.year} onValueChange={(value) => handleSelectChange("year", value)}>
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                        <SelectItem value="pg">Postgraduate</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h2 className="text-xl font-semibold text-blue-900">IEEE Membership</h2>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isMember"
                    checked={formData.isMember}
                    onCheckedChange={(checked) => handleCheckboxChange("isMember", checked as boolean)}
                  />
                  <Label htmlFor="isMember">I am an IEEE member</Label>
                </div>

                {formData.isMember && (
                  <div className="space-y-2">
                    <Label htmlFor="ieeeNumber">IEEE Membership Number</Label>
                    <Input
                      id="ieeeNumber"
                      name="ieeeNumber"
                      value={formData.ieeeNumber}
                      onChange={handleChange}
                      placeholder="Enter your IEEE membership number"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h2 className="text-xl font-semibold text-blue-900">Additional Information</h2>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Special Requirements or Questions</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Any dietary requirements, accessibility needs, or questions about the event"
                    rows={4}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-start space-x-2 mb-6">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleCheckboxChange("agreeTerms", checked as boolean)}
                    required
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="agreeTerms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the terms and conditions
                    </Label>
                    <p className="text-sm text-gray-500">
                      By registering, you agree to our{" "}
                      <Link href="/terms" className="text-blue-900 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-900 hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Complete Registration"}
                </Button>
              </div>
            </form>
          </div>

          <div>
            <div className="bg-gray-50 border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-blue-900">Event Summary</h2>

              <div className="mb-4">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                <Badge className="mb-3 bg-blue-900">{event.type}</Badge>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-900" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-900" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-900" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold mb-2">Registration Fee</h3>
                <p className="text-gray-700 mb-4">{event.registrationFee}</p>
                <p className="text-sm text-gray-500">Payment will be collected at the venue on the day of the event.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
