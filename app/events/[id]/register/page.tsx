"use client"

import { useState, use, useEffect } from "react"
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

export default function RegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [offlineMode, setOfflineMode] = useState(false)
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

  // Detect if user is on a mobile device
  useEffect(() => {
    if (isMobile) {
      console.log("Mobile device detected");
      // Pre-emptively enable offline mode for mobile devices
      if (/iPhone|iPad/i.test(navigator.userAgent)) {
        // iOS devices are more likely to have Firestore issues
        setOfflineMode(true);
      }
    }
  }, []);

  // Fetch event data
  useEffect(() => {
    async function loadEvent() {
      try {
        const eventData = await getEventById(resolvedParams.id);
        setEvent(eventData);
      } catch (error) {
        console.error("Error loading event:", error);
        setOfflineMode(true);
        toast.error("Loading in offline mode. Some features may be limited.");
      }
    }
    
    loadEvent();
  }, [resolvedParams.id]);

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

    try {
      // Get event details to include in registration
      const eventData = event || await getEventById(resolvedParams.id)
      if (!eventData) {
        toast.error("Event not found")
        return
      }

      // Calculate registration amount
      const registrationAmount = formData.membershipType === "ieee" ? eventData.fees?.ieee || 0 : eventData.fees?.nonIeee || 0

      // Prepare registration data with proper type assertions
      const registrationData: Omit<Registration, 'id'> = {
        ...formData,
        eventId: resolvedParams.id,
        eventTitle: eventData.title,
        registrationDate: new Date().toISOString(),
        status: registrationAmount === 0 ? "approved" as RegistrationStatus : "pending" as RegistrationStatus,
        paymentStatus: registrationAmount === 0 ? "completed" as PaymentStatus : "pending" as PaymentStatus,
        amount: registrationAmount
      };

      // Try to create registration with fallback for mobile
      try {
        await createRegistration(registrationData);
      } catch (firebaseError) {
        console.error("Firebase registration error:", firebaseError);
        
        // Fallback to localStorage on any Firebase error
        const fallbackId = `registration-${Date.now()}`;
        const fallbackData = { id: fallbackId, ...registrationData };
        const existingData = localStorage.getItem('offline_registrations');
        const offlineRegistrations = existingData ? JSON.parse(existingData) : [];
        offlineRegistrations.push(fallbackData);
        localStorage.setItem('offline_registrations', JSON.stringify(offlineRegistrations));
        
        // We'll consider this a success since we saved it locally
        console.log('Registration stored locally');
        setOfflineMode(true);
      }

      // Always redirect to success page
      // Add small delay to ensure localStorage is written
      setTimeout(() => {
        router.replace(`/events/${resolvedParams.id}/register/success`);
      }, 300);
      
      // Show additional toast for paid events
      if (registrationAmount > 0) {
        toast.info("Your registration is pending approval. You will be notified once it's approved.");
      } else {
        toast.success("Registration successful!");
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      
      // Always try localStorage as fallback
      try {
        // Store registration in localStorage as fallback
        const fallbackId = `registration-${Date.now()}`;
        const fallbackData = { 
          id: fallbackId, 
          ...formData,
          eventId: resolvedParams.id,
          eventTitle: event?.title || "Event",
          registrationDate: new Date().toISOString(),
          status: "pending" as RegistrationStatus,
          paymentStatus: "pending" as PaymentStatus,
          amount: 0
        };
        const existingData = localStorage.getItem('offline_registrations');
        const offlineRegistrations = existingData ? JSON.parse(existingData) : [];
        offlineRegistrations.push(fallbackData);
        localStorage.setItem('offline_registrations', JSON.stringify(offlineRegistrations));
        
        // Consider it a success since we saved locally
        setOfflineMode(true);
        toast.success("Registration saved locally. It will be synchronized when you're back online.");
        
        // Redirect after a small delay to ensure localStorage is written
        setTimeout(() => {
          router.replace(`/events/${resolvedParams.id}/register/success`);
        }, 300);
      } catch (storageError) {
        console.error("Failed to store registration locally:", storageError);
        toast.error("Failed to submit registration. Please try again or check your connection.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-4 md:mb-6">
        <Button variant="outline" asChild className="mb-2">
          <Link href={`/events/${resolvedParams.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Event
          </Link>
        </Button>
        
        {offlineMode && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-4">
            <p className="text-sm font-medium">You are in offline mode. Your registration will be saved locally.</p>
          </div>
        )}
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
                onClick={() => router.push(`/events/${resolvedParams.id}`)}
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
