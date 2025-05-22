import Link from "next/link"
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// This would typically come from a database
const getEventById = (id: string) => {
  const events = [
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
      speakers: [
        {
          name: "Dr. Arya Menon",
          designation: "Assistant Professor, Department of Electrical and Computer Engineering, TAMU",
          image: "/Events/inaguration/Dr.AryaMenon.webp",
          bio: "Dr. Arya Menon is an Assistant Professor in the Department of Electrical and Computer Engineering at Texas A&M University (TAMU). Her research interests include radars, radiometers, electromagnetic modeling, high-frequency dielectric characterization, datasets for wireless signals, and microwave calibration techniques.She has won several awards, including being nominated as a Protégé at the Texas Academy of Medicine, Engineering, Science, and Technology (TAMEST) 2023 Annual Conference, selected as a 2022 DARPA Riser, and receiving the 2020 ARTFG Roger Pollard Student Fellowship (Silver) and the 2019 IEEE Microwave Theory and Techniques Society Graduate Fellowship.",
        },
        
      ],
      agenda: [
        { time: "09:00 AM - 12:00 PM", activity: "Talk Session" },
        // { time: "10:30 AM - 12:00 PM", activity: "Introduction to RF Circuit Design" },
        // { time: "12:00 PM - 1:00 PM", activity: "Lunch Break" },
        // { time: "1:00 PM - 3:00 PM", activity: "Hands-on Session with Simulation Tools" },
        // { time: "3:00 PM - 3:30 PM", activity: "Tea Break" },
        // { time: "3:30 PM - 4:00 PM", activity: "Q&A and Closing Remarks" },
      ],
      prerequisites: [
        
      ],
      capacity: 100,
      registrationFee: "Free For all",
    },
    // More events would be here
  ]

  return events.find((event) => event.id === id)
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = getEventById(params.id)

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

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </Button>
      </div>

      {/* Event Header */}
      <div className="relative rounded-lg overflow-hidden mb-8">
        <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-64 md:h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <Badge className="self-start mb-3 bg-blue-900">{event.type}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-white">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>Capacity: {event.capacity} participants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Description */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">About This Event</h2>
            <p className="text-gray-700 mb-6">{event.description}</p>

            {/* Prerequisites */}
            <h3 className="text-xl font-semibold mb-3 text-blue-900">Prerequisites</h3>
            <ul className="list-disc pl-5 mb-6 text-gray-700">
              {event.prerequisites.map((prerequisite, index) => (
                <li key={index} className="mb-1">
                  {prerequisite}
                </li>
              ))}
            </ul>

            {/* Agenda */}
            <h3 className="text-xl font-semibold mb-3 text-blue-900">Agenda</h3>
            <div className="border rounded-lg overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {event.agenda.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Speakers */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Speakers</h2>
            <div className="space-y-6">
              {event.speakers.map((speaker, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                  <img
                    src={speaker.image || "/placeholder.svg"}
                    alt={speaker.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{speaker.name}</h3>
                    <p className="text-blue-900 mb-2">{speaker.designation}</p>
                    <p className="text-gray-700">{speaker.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Registration Card */}
        <div>
          <div className="bg-gray-50 border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Registration Details</h2>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Registration Fee</h3>
              <p className="text-gray-700">{event.registrationFee}</p>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-1">Available Seats</h3>
              <p className="text-gray-700">{event.capacity} seats</p>
            </div>
            <Button asChild className="w-full bg-blue-900 hover:bg-blue-800 mb-3">
              <Link href={`/events/${event.id}/register`}>Register Now</Link>
            </Button>
            <p className="text-sm text-gray-500 text-center">Registration closes on June 07, 2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}
