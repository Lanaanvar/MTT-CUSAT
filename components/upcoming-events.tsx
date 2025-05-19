import Link from "next/link"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample upcoming events data
const upcomingEvents = [
  {
    id: 1,
    title: "Workshop on RF Circuit Design",
    date: "June 15, 2023",
    time: "10:00 AM - 4:00 PM",
    location: "CUSAT Seminar Hall",
    type: "Workshop",
    image: "/placeholder.svg?height=200&width=400&text=RF+Circuit+Design",
    description: "Learn the fundamentals of RF circuit design with hands-on exercises using industry-standard tools.",
  },
  {
    id: 2,
    title: "Guest Lecture: 5G and Beyond",
    date: "June 22, 2023",
    time: "2:00 PM - 4:00 PM",
    location: "Online (Zoom)",
    type: "Lecture",
    image: "/placeholder.svg?height=200&width=400&text=5G+and+Beyond",
    description:
      "Join us for an insightful lecture on the future of 5G technology and what lies beyond by industry experts.",
  },
  {
    id: 3,
    title: "Microwave Hackathon 2023",
    date: "July 8-9, 2023",
    time: "9:00 AM - 6:00 PM",
    location: "CUSAT Innovation Center",
    type: "Hackathon",
    image: "/placeholder.svg?height=200&width=400&text=Microwave+Hackathon",
    description: "A 24-hour hackathon focused on solving real-world problems using microwave and RF technologies.",
  },
]

export default function UpcomingEvents() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {upcomingEvents.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-48">
            <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
            <Badge className="absolute top-3 right-3 bg-blue-900">{event.type}</Badge>
          </div>
          <CardHeader className="pb-2">
            <h3 className="text-xl font-bold">{event.title}</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
            </div>
            <p className="text-gray-700 line-clamp-2 mt-2">{event.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline" size="sm">
              <Link href={`/events/${event.id}`}>Details</Link>
            </Button>
            <Button asChild size="sm" className="bg-blue-900 hover:bg-blue-800">
              <Link href={`/events/${event.id}/register`}>Register</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
