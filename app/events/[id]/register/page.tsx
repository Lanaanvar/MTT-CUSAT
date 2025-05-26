"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { getEventById } from "@/lib/services/events"
import { createRegistration } from "@/lib/services/registrations"
import type { Registration } from "@/lib/services/registrations"
import { isMobile } from "@/lib/firebase"

type MembershipType = "ieee" | "non-ieee"
type RegistrationStatus = "pending" | "approved" | "rejected"
type PaymentStatus = "pending" | "completed"

export default function RegisterPage({ params }: { params: { id: string } }) {
  const eventId = params.id;
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    department: "",
    year: "",
    membershipType: "non-ieee" as MembershipType,
    membershipId: "",
  })
  const [error, setError] = useState<string | null>(null)

  // Fetch event data
  useEffect(() => {
    async function loadEvent() {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
      } catch (error) {
        console.error("Error loading event:", error);
        toast.error("Could not load event details. Please try again later.");
      }
    }
    
    loadEvent();
  }, [eventId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get event details to include in registration
      const eventData = event || await getEventById(eventId)
      if (!eventData) {
        toast.error("Event not found")
        setLoading(false)
        return
      }

      // Calculate registration amount
      const registrationAmount = formData.membershipType === "ieee" ? eventData.fees?.ieee || 0 : eventData.fees?.nonIeee || 0

      // Prepare registration data
      const registrationData: Omit<Registration, 'id'> = {
        ...formData,
        eventId: eventId,
        eventTitle: eventData.title,
        registrationDate: new Date().toISOString(),
        status: registrationAmount === 0 ? "approved" as RegistrationStatus : "pending" as RegistrationStatus,
        paymentStatus: registrationAmount === 0 ? "completed" as PaymentStatus : "pending" as PaymentStatus,
        amount: registrationAmount
      };

      console.log("Device type:", isMobile ? "Mobile" : "Desktop");
      console.log("Browser:", navigator.userAgent);
      console.log("Submitting registration...");
      
      // Create registration in Firestore
      const registrationId = await createRegistration(registrationData);
      console.log("Registration successful with ID:", registrationId);
      
      // Show success message
      if (registrationAmount > 0) {
        toast.info("Your registration is pending approval. You will be notified once it's approved.");
      } else {
        toast.success("Registration successful!");
      }
      
      // Redirect to success page
      router.replace(`/events/${eventId}/register/success`);
      
    } catch (error: any) {
      console.error("Error submitting registration:", error);
      
      // Capture detailed error information
      const errorDetails = {
        code: error.code || 'unknown',
        message: error.message || 'Unknown error',
        stack: error.stack,
        device: isMobile ? 'mobile' : 'desktop',
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      console.error("Error details:", JSON.stringify(errorDetails));
      setError(`Error: ${errorDetails.code} - ${errorDetails.message}`);
      
      // Show appropriate error message based on error code
      if (error.code === 'permission-denied') {
        toast.error("Registration failed: Permission denied. Please try again later or use a desktop browser.");
      } else if (error.code === 'auth/admin-restricted-operation') {
        toast.error("Registration failed: Authentication issue. Please try again later.");
      } else {
        toast.error("Registration failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-4 md:mb-6">
        <Button variant="outline" asChild className="mb-2">
          <Link href={`/events/${eventId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Event
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Event Registration</CardTitle>
          {event && (
            <CardDescription>
              Registering for: <span className="font-medium">{event.title}</span>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
              <p className="text-sm font-medium">Error occurred: {error}</p>
              <p className="text-xs mt-1">Please try again or contact support if the problem persists.</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Personal Information Section */}
              <div className="border-b pb-2 mb-4">
                <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full"
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full"
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full"
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="border-b pb-2 mb-4">
                <h3 className="font-semibold text-lg mb-3">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="college" className="text-sm font-medium">College</Label>
                    <Input
                      id="college"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      required
                      className="w-full"
                      autoComplete="organization"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-medium">Year of Study</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value: string) => handleSelectChange("year", value)}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Membership Information Section */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Membership Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="membershipType" className="text-sm font-medium">Membership Type</Label>
                    <Select
                      value={formData.membershipType}
                      onValueChange={(value: MembershipType) => handleSelectChange("membershipType", value)}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ieee">IEEE Member</SelectItem>
                        <SelectItem value="non-ieee">Non-IEEE Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.membershipType === "ieee" && (
                    <div className="space-y-2">
                      <Label htmlFor="membershipId" className="text-sm font-medium">IEEE Membership ID</Label>
                      <Input
                        id="membershipId"
                        name="membershipId"
                        value={formData.membershipId}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Registration Fee Information */}
              {event && event.fees && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm">
                    <span className="font-medium">Registration Fee:</span>{" "}
                    {formData.membershipType === "ieee" ? (
                      <>₹{event.fees.ieee} for IEEE members</>
                    ) : (
                      <>₹{event.fees.nonIeee} for non-IEEE members</>
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/events/${eventId}`)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Registration"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
