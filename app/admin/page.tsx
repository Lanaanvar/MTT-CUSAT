"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { handleError, validateEventForm, validateImageFile, AppError, ErrorType } from "@/lib/utils/error-handling"
import { uploadImage } from "@/app/utils/cloudinary"

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
  const [formData, setFormData] = useState<EventFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form data
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

      const eventsRef = collection(db, "events")
      await addDoc(eventsRef, {
        ...formData,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      })

      toast.success("Event added successfully!")
      setFormData(initialFormData)
      setImageFile(null)
      setImagePreview(null)
      router.refresh()
    } catch (error) {
      handleError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Event</CardTitle>
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
                      className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
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
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  setFormData(initialFormData)
                  setImageFile(null)
                  setImagePreview(null)
                }}
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Event..." : "Add Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 