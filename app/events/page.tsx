import Link from "next/link"
import { Calendar, Clock, MapPin, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample events data
const events = [
  {
    id: 1,
    title: "Inaguration and Talk Session",
    date: "June 07, 2025",
    time: "09:00 AM",
    location: "DOE CUSAT",
    type: "Talk Session",
    image: "/Events/inaguration/mtdinvitation@4x.png",
    description: "Inaguration Ceremony of the IEEE Microwaves Theory and Techniques Society CUSAT SB",
    status: "upcoming",
  },
  // {
  //   id: 2,
  //   title: "Guest Lecture: 5G and Beyond",
  //   date: "June 22, 2023",
  //   time: "2:00 PM - 4:00 PM",
  //   location: "Online (Zoom)",
  //   type: "Lecture",
  //   image: "/placeholder.svg?height=200&width=400&text=5G+and+Beyond",
  //   description:
  //     "Join us for an insightful lecture on the future of 5G technology and what lies beyond by industry experts.",
  //   status: "upcoming",
  // },
  // {
  //   id: 3,
  //   title: "Microwave Hackathon 2023",
  //   date: "July 8-9, 2023",
  //   time: "9:00 AM - 6:00 PM",
  //   location: "CUSAT Innovation Center",
  //   type: "Hackathon",
  //   image: "/placeholder.svg?height=200&width=400&text=Microwave+Hackathon",
  //   description: "A 24-hour hackathon focused on solving real-world problems using microwave and RF technologies.",
  //   status: "upcoming",
  // },
  // {
  //   id: 4,
  //   title: "Technical Paper Presentation",
  //   date: "May 10, 2023",
  //   time: "11:00 AM - 5:00 PM",
  //   location: "CUSAT Auditorium",
  //   type: "Competition",
  //   image: "/placeholder.svg?height=200&width=400&text=Paper+Presentation",
  //   description: "Present your research papers on microwave theory and techniques to a panel of experts.",
  //   status: "past",
  // },
  // {
  //   id: 5,
  //   title: "Industry Visit: RF Solutions Ltd",
  //   date: "April 25, 2023",
  //   time: "9:00 AM - 3:00 PM",
  //   location: "RF Solutions Ltd, Kochi",
  //   type: "Industry Visit",
  //   image: "/placeholder.svg?height=200&width=400&text=Industry+Visit",
  //   description: "Visit to RF Solutions Ltd to understand industrial applications of microwave technologies.",
  //   status: "past",
  // },
  // {
  //   id: 6,
  //   title: "Antenna Design Workshop",
  //   date: "March 18, 2023",
  //   time: "10:00 AM - 4:00 PM",
  //   location: "CUSAT Electronics Lab",
  //   type: "Workshop",
  //   image: "/placeholder.svg?height=200&width=400&text=Antenna+Design",
  //   description: "Hands-on workshop on designing and simulating various types of antennas for wireless communication.",
  //   status: "past",
  // },
]

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Events</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover our upcoming and past events, workshops, seminars, and competitions focused on microwave theory and
          techniques.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 bg-gray-50 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search events..." className="pl-10" />
          </div>
          <div className="w-full md:w-48">
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="lecture">Lecture</SelectItem>
                <SelectItem value="hackathon">Hackathon</SelectItem>
                <SelectItem value="competition">Competition</SelectItem>
                <SelectItem value="visit">Industry Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select defaultValue="upcoming">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-blue-900 hover:bg-blue-800">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Upcoming Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events
            .filter((event) => event.status === "upcoming")
            .map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
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
      </section>

      {/* Past Events Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Past Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events
            .filter((event) => event.status === "past")
            .map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-gray-600">{event.type}</Badge>
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <Badge className="bg-red-600 text-white px-3 py-1 text-sm">Past Event</Badge>
                  </div>
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
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </section>
    </div>
  )
}
