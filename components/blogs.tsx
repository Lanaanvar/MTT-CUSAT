import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Dummy data (can be fetched from CMS or API)
const blogPosts = [
  {
    id: 1,
    title: "Advancements in 5G Technology",
    date: "May 11, 2023",
    image: "/placeholder.svg?height=200&width=400&text=Blog+Image+1",
    excerpt: "Exploring the latest developments in 5G technology and its applications in modern communication systems.",
    slug: "post-1",
  },
  {
    id: 2,
    title: "AI in Everyday Life",
    date: "May 12, 2023",
    image: "/placeholder.svg?height=200&width=400&text=Blog+Image+2",
    excerpt: "Discover how artificial intelligence is being used in consumer apps, home automation, and healthcare.",
    slug: "post-2",
  },
  {
    id: 3,
    title: "Sustainable Tech Innovations",
    date: "May 13, 2023",
    image: "/placeholder.svg?height=200&width=400&text=Blog+Image+3",
    excerpt: "An overview of how technology is driving sustainable development and greener alternatives in industries.",
    slug: "post-3",
  },
];

export default function LatestBlogs() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-sm text-blue-600 mb-2">{post.date}</p>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{post.title}</h3>
                <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-900 font-medium hover:underline inline-flex items-center"
                >
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
