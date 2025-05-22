import Link from "next/link"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// upcoming events data
const upcomingEvents = [
   {
      id: "1",
    title: "Inaguration and Talk Session",
    date: "June 07, 2025",
    time: "09:00 AM",
    location: "DOE CUSAT",
    type: "Talk Session",
    image: "/Events/inaguration/mtdinvitation@4x.png",
    description: "Inaguration Ceremony of the IEEE Microwaves Theory and Techniques Society CUSAT SB",
    status: "upcoming",
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
