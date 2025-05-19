import { Mail, Linkedin, Twitter, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample members data
const execomMembers = {
  current: [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      position: "Faculty Advisor",
      image: "/placeholder.svg?height=300&width=300&text=RK",
      department: "Electronics Engineering",
      bio: "Dr. Rajesh Kumar is a Professor at CUSAT with over 15 years of experience in microwave engineering and RF design.",
      email: "rajesh.kumar@cusat.ac.in",
      linkedin: "https://linkedin.com/in/rajeshkumar",
      twitter: "https://twitter.com/rajeshkumar",
      website: "https://rajeshkumar.com",
    },
    {
      id: 2,
      name: "Arun Mohan",
      position: "Chairperson",
      image: "/placeholder.svg?height=300&width=300&text=AM",
      department: "Electronics Engineering",
      bio: "Arun is a final year B.Tech student with a passion for RF circuit design and wireless communications.",
      email: "arun.mohan@ieee.org",
      linkedin: "https://linkedin.com/in/arunmohan",
      twitter: "https://twitter.com/arunmohan",
      website: null,
    },
    {
      id: 3,
      name: "Priya Menon",
      position: "Vice Chairperson",
      image: "/placeholder.svg?height=300&width=300&text=PM",
      department: "Electronics Engineering",
      bio: "Priya is a third-year B.Tech student specializing in antenna design and electromagnetic theory.",
      email: "priya.menon@ieee.org",
      linkedin: "https://linkedin.com/in/priyamenon",
      twitter: null,
      website: null,
    },
    {
      id: 4,
      name: "Rahul Sharma",
      position: "Secretary",
      image: "/placeholder.svg?height=300&width=300&text=RS",
      department: "Electronics Engineering",
      bio: "Rahul is a third-year B.Tech student with interests in digital signal processing and embedded systems.",
      email: "rahul.sharma@ieee.org",
      linkedin: "https://linkedin.com/in/rahulsharma",
      twitter: null,
      website: null,
    },
    {
      id: 5,
      name: "Sneha Patel",
      position: "Treasurer",
      image: "/placeholder.svg?height=300&width=300&text=SP",
      department: "Electronics Engineering",
      bio: "Sneha is a second-year B.Tech student with a focus on microwave circuit design and simulation.",
      email: "sneha.patel@ieee.org",
      linkedin: "https://linkedin.com/in/snehapatel",
      twitter: null,
      website: null,
    },
    {
      id: 6,
      name: "Kiran Nair",
      position: "Technical Coordinator",
      image: "/placeholder.svg?height=300&width=300&text=KN",
      department: "Electronics Engineering",
      bio: "Kiran is a third-year B.Tech student specializing in RF system design and testing.",
      email: "kiran.nair@ieee.org",
      linkedin: "https://linkedin.com/in/kirannair",
      twitter: null,
      website: null,
    },
    {
      id: 7,
      name: "Meera Suresh",
      position: "Event Coordinator",
      image: "/placeholder.svg?height=300&width=300&text=MS",
      department: "Electronics Engineering",
      bio: "Meera is a second-year B.Tech student with interests in wireless communications and IoT applications.",
      email: "meera.suresh@ieee.org",
      linkedin: "https://linkedin.com/in/meerasuresh",
      twitter: null,
      website: null,
    },
    {
      id: 8,
      name: "Arjun Krishnan",
      position: "Webmaster",
      image: "/placeholder.svg?height=300&width=300&text=AK",
      department: "Computer Science",
      bio: "Arjun is a third-year B.Tech student with expertise in web development and UI/UX design.",
      email: "arjun.krishnan@ieee.org",
      linkedin: "https://linkedin.com/in/arjunkrishnan",
      twitter: null,
      website: "https://arjunkrishnan.com",
    },
  ],
  past: [
    {
      id: 101,
      name: "Dr. Anand Kumar",
      position: "Faculty Advisor (2021-2022)",
      image: "/placeholder.svg?height=300&width=300&text=AK",
      department: "Electronics Engineering",
      bio: "Dr. Anand Kumar served as the Faculty Advisor for IEEE MTT-S CUSAT SB from 2021 to 2022.",
      email: "anand.kumar@cusat.ac.in",
      linkedin: "https://linkedin.com/in/anandkumar",
      twitter: null,
      website: null,
    },
    {
      id: 102,
      name: "Ravi Menon",
      position: "Chairperson (2021-2022)",
      image: "/placeholder.svg?height=300&width=300&text=RM",
      department: "Electronics Engineering",
      bio: "Ravi served as the Chairperson for IEEE MTT-S CUSAT SB from 2021 to 2022.",
      email: "ravi.menon@ieee.org",
      linkedin: "https://linkedin.com/in/ravimenon",
      twitter: null,
      website: null,
    },
    {
      id: 103,
      name: "Sanjana Nair",
      position: "Vice Chairperson (2021-2022)",
      image: "/placeholder.svg?height=300&width=300&text=SN",
      department: "Electronics Engineering",
      bio: "Sanjana served as the Vice Chairperson for IEEE MTT-S CUSAT SB from 2021 to 2022.",
      email: "sanjana.nair@ieee.org",
      linkedin: "https://linkedin.com/in/sanjananair",
      twitter: null,
      website: null,
    },
    {
      id: 104,
      name: "Vikram Singh",
      position: "Secretary (2021-2022)",
      image: "/placeholder.svg?height=300&width=300&text=VS",
      department: "Electronics Engineering",
      bio: "Vikram served as the Secretary for IEEE MTT-S CUSAT SB from 2021 to 2022.",
      email: "vikram.singh@ieee.org",
      linkedin: "https://linkedin.com/in/vikramsingh",
      twitter: null,
      website: null,
    },
  ],
}

export default function MembersPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Our Team</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Meet the dedicated team behind IEEE MTT-S CUSAT Student Branch who work tirelessly to organize events,
          workshops, and activities.
        </p>
      </div>

      <Tabs defaultValue="current" className="mb-12">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="current">Current Execom</TabsTrigger>
            <TabsTrigger value="past">Past Execom</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="current">
          {/* Faculty Advisor */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-blue-900 text-center">Faculty Advisor</h2>
            <div className="flex justify-center">
              <Card className="max-w-md overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={execomMembers.current[0].image || "/placeholder.svg"}
                    alt={execomMembers.current[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{execomMembers.current[0].name}</CardTitle>
                  <CardDescription className="text-blue-900 font-medium">
                    {execomMembers.current[0].position}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{execomMembers.current[0].bio}</p>
                  <p className="text-sm text-gray-500">{execomMembers.current[0].department}</p>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4">
                  <Button asChild size="icon" variant="ghost">
                    <a href={`mailto:${execomMembers.current[0].email}`} aria-label="Email">
                      <Mail className="h-5 w-5" />
                    </a>
                  </Button>
                  {execomMembers.current[0].linkedin && (
                    <Button asChild size="icon" variant="ghost">
                      <a
                        href={execomMembers.current[0].linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  {execomMembers.current[0].twitter && (
                    <Button asChild size="icon" variant="ghost">
                      <a
                        href={execomMembers.current[0].twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  {execomMembers.current[0].website && (
                    <Button asChild size="icon" variant="ghost">
                      <a
                        href={execomMembers.current[0].website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Website"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Executive Committee */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-blue-900 text-center">Executive Committee</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {execomMembers.current.slice(1).map((member) => (
                <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription className="text-blue-900 font-medium">{member.position}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 line-clamp-3">{member.bio}</p>
                    <p className="text-sm text-gray-500">{member.department}</p>
                  </CardContent>
                  <CardFooter className="flex justify-center space-x-4">
                    <Button asChild size="icon" variant="ghost">
                      <a href={`mailto:${member.email}`} aria-label="Email">
                        <Mail className="h-5 w-5" />
                      </a>
                    </Button>
                    {member.linkedin && (
                      <Button asChild size="icon" variant="ghost">
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                    {member.twitter && (
                      <Button asChild size="icon" variant="ghost">
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                          <Twitter className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                    {member.website && (
                      <Button asChild size="icon" variant="ghost">
                        <a href={member.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                          <Globe className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="past">
          <h2 className="text-2xl font-bold mb-8 text-blue-900 text-center">Past Executive Committee (2021-2022)</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {execomMembers.past.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription className="text-blue-900 font-medium">{member.position}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-2">{member.bio}</p>
                  <p className="text-sm text-gray-500">{member.department}</p>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4">
                  <Button asChild size="icon" variant="ghost">
                    <a href={`mailto:${member.email}`} aria-label="Email">
                      <Mail className="h-5 w-5" />
                    </a>
                  </Button>
                  {member.linkedin && (
                    <Button asChild size="icon" variant="ghost">
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Join the Team Section */}
      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Join Our Team</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Interested in becoming a part of IEEE MTT-S CUSAT SB? We're always looking for passionate students to join our
          team and contribute to our activities.
        </p>
        <Button asChild className="bg-blue-900 hover:bg-blue-800">
          <a href="/join">Apply to Join</a>
        </Button>
      </div>
    </div>
  )
}
