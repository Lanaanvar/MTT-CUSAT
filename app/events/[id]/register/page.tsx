"use client"

import { useState, use } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { getEventById } from "@/lib/services/events"
import { createRegistration } from "@/lib/services/registrations"

type MembershipType = "ieee" | "non-ieee"

export default function RegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
      const event = await getEventById(resolvedParams.id)
      if (!event) {
        toast.error("Event not found")
        return
      }

      // Calculate registration amount
      const registrationAmount = formData.membershipType === "ieee" ? event.fees?.ieee || 0 : event.fees?.nonIeee || 0

      // Create registration
      await createRegistration({
        ...formData,
        eventId: resolvedParams.id,
        eventTitle: event.title,
        registrationDate: new Date().toISOString(),
        status: registrationAmount === 0 ? "approved" : "pending", // Auto-approve only free events
        paymentStatus: registrationAmount === 0 ? "completed" : "pending",
        amount: registrationAmount
      })

      if (registrationAmount === 0) {
        // For free events, redirect to success page
        router.replace(`/events/${resolvedParams.id}/register/success`)
      } else {
        // For paid events, show pending message and redirect to event page
        toast.success(
          <div className="space-y-2">
            <p>Registration submitted successfully!</p>
            <p className="text-sm">Your registration is pending approval. You will be notified once it's approved.</p>
          </div>
        )
        router.replace(`/events/${resolvedParams.id}`)
      }
    } catch (error) {
      console.error("Error submitting registration:", error)
      toast.error("Failed to submit registration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild>
          <Link href={`/events/${resolvedParams.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Event
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Event Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="college">College</Label>
                <Input
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year of Study</Label>
                <Select
                  value={formData.year}
                  onValueChange={(value: string) => handleSelectChange("year", value)}
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="membershipType">Membership Type</Label>
                <Select
                  value={formData.membershipType}
                  onValueChange={(value: MembershipType) => handleSelectChange("membershipType", value)}
                >
                  <SelectTrigger>
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
                  <Label htmlFor="membershipId">IEEE Membership ID</Label>
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

            <div className="flex justify-end space-x-4">
              <Button
                className="w-full"
                type="button"
                onClick={() => router.push(`/events/${resolvedParams.id}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800"
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
