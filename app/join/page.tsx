"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function JoinPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    department: "",
    year: "",
    ieeeNumber: "",
    isMember: false,
    interests: "",
    experience: "",
    expectations: "",
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
      // await fetch('/api/join', { method: 'POST', body: JSON.stringify(formData) });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSuccess(true)
    } catch (error) {
      console.error("Submission failed:", error)
      alert("Submission failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-md">
        <Card className="border-green-200 shadow-md">
          <CardHeader className="text-center bg-green-50 border-b border-green-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Application Submitted!</CardTitle>
            <CardDescription className="text-green-700">
              Thank you for your interest in joining IEEE MTT-S CUSAT SB
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <p className="text-gray-700">
                We have received your application and will review it shortly. We will contact you at{" "}
                <span className="font-medium">{formData.email}</span> with further details.
              </p>
              <p className="text-gray-700">
                In the meantime, feel free to explore our website and learn more about our activities and events.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild className="bg-blue-900 hover:bg-blue-800">
              <a href="/">Return to Homepage</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Join IEEE MTT-S CUSAT SB</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Become a part of our vibrant community and explore the exciting world of microwave engineering and RF
            technologies.
          </p>
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
                    <Label htmlFor="year">
                      Year of Study <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.year} onValueChange={(value) => handleSelectChange("year", value)} required>
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                        <SelectItem value="pg">Postgraduate</SelectItem>
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
                <h2 className="text-xl font-semibold text-blue-900">About You</h2>

                <div className="space-y-2">
                  <Label htmlFor="interests">
                    Areas of Interest <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    required
                    placeholder="What areas of microwave theory and RF technologies interest you the most?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Relevant Experience</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Describe any relevant experience or projects you have worked on"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectations">
                    Expectations <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="expectations"
                    name="expectations"
                    value={formData.expectations}
                    onChange={handleChange}
                    required
                    placeholder="What do you hope to gain from joining IEEE MTT-S CUSAT SB?"
                    rows={3}
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
                      By submitting this form, you agree to our privacy policy and consent to being contacted regarding
                      IEEE MTT-S CUSAT SB activities.
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>

          <div>
            <div className="bg-blue-50 border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-blue-900">Benefits of Joining</h2>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-900 mr-2 mt-0.5 shrink-0" />
                  <span>Access to technical workshops and seminars</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-900 mr-2 mt-0.5 shrink-0" />
                  <span>Networking opportunities with industry professionals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-900 mr-2 mt-0.5 shrink-0" />
                  <span>Hands-on experience with RF and microwave technologies</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-900 mr-2 mt-0.5 shrink-0" />
                  <span>Leadership and organizational skills development</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-900 mr-2 mt-0.5 shrink-0" />
                  <span>Opportunity to participate in technical competitions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-900 mr-2 mt-0.5 shrink-0" />
                  <span>Access to IEEE resources and publications</span>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-blue-100">
                <h3 className="font-semibold mb-2 text-blue-900">Have Questions?</h3>
                <p className="text-gray-700 mb-4">
                  If you have any questions about joining IEEE MTT-S CUSAT SB, feel free to contact us.
                </p>
                <Button asChild variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50">
                  <a href="/contact">Contact Us</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
