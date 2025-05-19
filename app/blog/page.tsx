import Link from "next/link"
import { Calendar, ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Advancements in 5G Technology and Its Applications",
    excerpt: "Exploring the latest developments in 5G technology and its applications in modern communication systems.",
    date: "May 15, 2023",
    author: "Dr. Anand Kumar",
    category: "Technology",
    image: "/placeholder.svg?height=300&width=600&text=5G+Technology",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The Future of Microwave Engineering in Space Communications",
    excerpt: "How microwave engineering is shaping the future of space communications and satellite technology.",
    date: "April 28, 2023",
    author: "Priya Menon",
    category: "Research",
    image: "/placeholder.svg?height=300&width=600&text=Space+Communications",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "IEEE MTT-S CUSAT SB Hosts Successful Technical Workshop",
    excerpt: "A recap of the recent technical workshop on RF circuit design hosted by IEEE MTT-S CUSAT SB.",
    date: "April 10, 2023",
    author: "Rahul Sharma",
    category: "Events",
    image: "/placeholder.svg?height=300&width=600&text=Technical+Workshop",
    readTime: "4 min read",
  },
  {
    id: 4,
    title: "Understanding Antenna Design for Modern Wireless Systems",
    excerpt: "A comprehensive guide to antenna design principles for modern wireless communication systems.",
    date: "March 22, 2023",
    author: "Dr. Meera Nair",
    category: "Education",
    image: "/placeholder.svg?height=300&width=600&text=Antenna+Design",
    readTime: "10 min read",
  },
  {
    id: 5,
    title: "Interview with Industry Expert: Career Paths in RF Engineering",
    excerpt: "Insights from an industry expert on career opportunities and growth paths in RF engineering.",
    date: "March 5, 2023",
    author: "Arun Mohan",
    category: "Career",
    image: "/placeholder.svg?height=300&width=600&text=RF+Engineering+Careers",
    readTime: "7 min read",
  },
  {
    id: 6,
    title: "Microwave Theory Fundamentals: A Student's Guide",
    excerpt: "A beginner-friendly guide to understanding the fundamental concepts of microwave theory.",
    date: "February 18, 2023",
    author: "Sneha Patel",
    category: "Education",
    image: "/placeholder.svg?height=300&width=600&text=Microwave+Theory",
    readTime: "6 min read",
  },
]

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore articles, insights, and updates from IEEE MTT-S CUSAT SB on microwave theory, techniques, and
          applications.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-10 bg-gray-50 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search articles..." className="pl-10" />
          </div>
          <div className="w-full md:w-48">
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="career">Career</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-blue-900 hover:bg-blue-800">Search</Button>
        </div>
      </div>

      {/* Featured Post */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Featured Article</h2>
        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg overflow-hidden shadow-md">
          <div className="h-full">
            <img
              src="/placeholder.svg?height=400&width=600&text=Featured+Article"
              alt="Featured Article"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-4">
                <Badge className="bg-blue-900 mr-2">Featured</Badge>
                <Badge variant="outline" className="text-blue-900 border-blue-900">
                  Technology
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-3">
                The Evolution of Microwave Technology in Modern Communications
              </h3>
              <p className="text-gray-700 mb-4">
                An in-depth look at how microwave technology has evolved over the decades and its crucial role in modern
                communication systems, from 5G networks to satellite communications.
              </p>
              <div className="flex items-center text-gray-500 text-sm mb-6">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">June 1, 2023</span>
                <span>12 min read</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-4">By Dr. Rajesh Kumar, Professor, CUSAT</p>
              <Button asChild className="bg-blue-900 hover:bg-blue-800">
                <Link href="/blog/featured">
                  Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Articles */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Latest Articles</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Badge variant="outline" className="text-blue-900 border-blue-900">
                    {post.category}
                  </Badge>
                  <span className="ml-auto text-sm text-gray-500">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">By {post.author}</span>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-blue-900 font-medium hover:underline inline-flex items-center"
                  >
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Articles */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-blue-900">All Articles</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.slice(3).map((post) => (
            <div
              key={post.id}
              className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="md:w-1/3">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex items-center mb-3">
                  <Badge variant="outline" className="text-blue-900 border-blue-900">
                    {post.category}
                  </Badge>
                  <span className="ml-auto text-sm text-gray-500">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-gray-600 text-sm">By {post.author}</span>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-blue-900 font-medium hover:underline inline-flex items-center"
                  >
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <nav className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            <span className="sr-only">Previous page</span>
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Button>
          <Button variant="outline" size="sm" className="bg-blue-900 text-white hover:bg-blue-800">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="icon">
            <span className="sr-only">Next page</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </div>
  )
}
