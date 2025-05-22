import { Mail, Linkedin, Twitter, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Members data
const execomMembers = {
  current: [
    {
      id: 1,
      name: "Dr. Anju Pradeep",
      position: "Branch Counceller",
      image: "/Execom/Branch-Counceller.jpg",
      department: "Electronics Engineering",
      email: "rajesh.kumar@cusat.ac.in",
      linkedin: "https://linkedin.com/in/rajeshkumar",
      twitter: "https://twitter.com/rajeshkumar",
      website: "https://rajeshkumar.com",
    },
    {
    id: 9,
    name: "Dr. Deepthi Das Krishna",
    position: "Society Chapter Advisor",
    image: "/Execom/Advisor.jpg",
    department: "Electronics Engineering",
    email: "lakshmi.nair@cusat.ac.in",
    linkedin: "https://linkedin.com/in/lakshminair",
    twitter: "https://twitter.com/lakshminair",
    website: "https://lakshminair.com",
    },
    {
      id: 2,
      name: "Fida Abdul Rasheed",
      position: "Chairperson",
      image: "/Execom/chair.jpg",
      department: "Electronics Engineering",
      email: "fidaar666@gmail.com",
      linkedin: "https://www.linkedin.com/in/fida-abdulrasheed-705309308",
      twitter:null,
      website: null,
    },
    {
      id: 3,
      name: "Azil Ahmed Moopan",
      position: "Vice Chairperson",
      image: "/Execom/vice-chair.png",
      department: "Electronics Engineering",
      email: "azilahamed1@gmail.com",
      linkedin: "https://www.linkedin.com/in/azil-moopan-8b2360327",
      twitter: null,
      website: null,
    },
    {
      id: 4,
      name: "Geethanjali V",
      position: "Secretary",
      image: "/placeholder.svg?height=300&width=300&text=RS",
      department: "Electronics Engineering",
      email: "",
      linkedin: "",
      twitter: null,
      website: null,
    },
    {
      id: 5,
      name: "Sowrav C",
      position: "Membership Development Coordinator",
      image: "/Execom/mdc.jpg",
      department: "Electronics Engineering",
      email: "",
      linkedin: "http://www.linkedin.com/in/sowrav-c565456",
      twitter: null,
      website: null,
    },
    {
      id: 6,
      name: "Febin Tom Prince",
      position: "Technical Coordinator",
      image: "Execom/technical-coordinator.jpg",
      department: "Electronics Engineering",
      email: "",
      linkedin: "https://www.linkedin.com/in/febin-tom-prince-188857221/",
      twitter: null,
      website: null,
    },
    {
      id: 7,
      name: "Vishnu A M",
      position: "Webmaster",
      image: "/Execom/webmaster.jpg",
      department: "Electronics Engineering",
      email: "vishnuayilliath@gmail.com",
      linkedin: "https://www.linkedin.com/in/vishnu-prasad-27aa3825b",
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

        <TabsContent value="current">
          {/* Faculty Advisor */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-blue-900 text-center">Faculty Advisors</h2>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
  {[execomMembers.current[0], execomMembers.current[1]].map((advisor) => (
    <Card key={advisor.id} className="max-w-md overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={advisor.image || "/placeholder.svg"}
          alt={advisor.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{advisor.name}</CardTitle>
        <CardDescription className="text-blue-900 font-medium">
          {advisor.position}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{advisor.department}</p>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4">
        <Button asChild size="icon" variant="ghost">
          <a href={`mailto:${advisor.email}`} aria-label="Email">
            <Mail className="h-5 w-5" />
          </a>
        </Button>
        {advisor.linkedin && (
          <Button asChild size="icon" variant="ghost">
            <a href={advisor.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
        )}
        {advisor.twitter && (
          <Button asChild size="icon" variant="ghost">
            <a href={advisor.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
          </Button>
        )}
        {advisor.website && (
          <Button asChild size="icon" variant="ghost">
            <a href={advisor.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
              <Globe className="h-5 w-5" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  ))}
            </div>
          </div>

          {/* Executive Committee */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-blue-900 text-center">Executive Committee</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {execomMembers.current.slice(2).map((member) => (
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
      </Tabs>
    </div>
  )
}
