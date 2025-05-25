"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { getEventById, updateEvent } from "@/lib/services/events"
import type { Event } from "@/lib/services/events"
import { handleError, validateImageFile } from "@/lib/utils/error-handling"
import { uploadImage } from "@/app/utils/cloudinary"

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
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
    createdAt: new Date().toISOString(),
    postRegistrationMessage: "",
    postRegistrationLink: "",
    postRegistrationButtonText: ""
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await getEventById(params.id)
        if (!event) {
          toast.error("Event not found")
          router.push("/admin/events")
          return
        }
        setFormData(event)
      } catch (error) {
        console.error("Error fetching event:", error)
        toast.error("Failed to load event")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id, router])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => {
      if (name.startsWith("fees.")) {
        const feeType = name.split(".")[1]
        return {
          ...prev,
          fees: {
            ...prev.fees,
            [feeType]: Number(value) || 0
          }
        }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      // This will throw an error if validation fails
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let imageUrl = formData.image
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile)
        } catch (error) {
          handleError(error)
          setSaving(false)
          return
        }
      }

      await updateEvent(params.id, {
        ...formData,
        image: imageUrl,
      })
      toast.success("Event updated successfully")
      router.push("/admin/events")
    } catch (error) {
      console.error("Error updating event:", error)
      toast.error("Failed to update event")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/admin/events">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
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
                <Input
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Enter event type"
                />
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
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fees.ieee">IEEE Member Fee</Label>
                <Input
                  id="fees.ieee"
                  name="fees.ieee"
                  type="number"
                  min="0"
                  value={formData.fees.ieee}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fees.nonIeee">Non-IEEE Member Fee</Label>
                <Input
                  id="fees.nonIeee"
                  name="fees.nonIeee"
                  type="number"
                  min="0"
                  value={formData.fees.nonIeee}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Event Image</Label>
                <div className="flex flex-col gap-4">
                  {(imagePreview || formData.image) && (
                    <div className="relative w-full h-48">
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {formData.image ? 'Change Image' : 'Upload Image'}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postRegistrationMessage">Post-Registration Message</Label>
              <Textarea
                id="postRegistrationMessage"
                name="postRegistrationMessage"
                value={formData.postRegistrationMessage}
                onChange={handleChange}
                placeholder="Message to show after successful registration"
                rows={3}
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
                  placeholder="e.g., WhatsApp group link"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postRegistrationButtonText">Link Button Text</Label>
                <Input
                  id="postRegistrationButtonText"
                  name="postRegistrationButtonText"
                  value={formData.postRegistrationButtonText}
                  onChange={handleChange}
                  placeholder="e.g., Join WhatsApp Group"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/events")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 