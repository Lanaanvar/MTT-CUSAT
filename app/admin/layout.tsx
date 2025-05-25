"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Calendar, FileText } from "lucide-react"

const tabs = [
  { name: "Events", href: "/admin/" },
  { name: "Blogs", href: "/admin/blogs" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-xl font-bold">
              MTT Admin
            </Link>
            <nav className="flex items-center space-x-4">
              <Link
                href="/events"
                className="flex items-center space-x-2 hover:text-blue-200"
              >
                <Calendar className="h-4 w-4" />
                <span>Events</span>
              </Link>
              <Link
                href="/admin/blogs"
                className="flex items-center space-x-2 hover:text-blue-200"
              >
                <FileText className="h-4 w-4" />
                <span>Blogs</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex space-x-4 border-b">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "px-3 py-2 text-sm font-medium",
                pathname === tab.href
                  ? "border-b-2 border-blue-900 text-blue-900"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.name}
            </Link>
          ))}
        </div>
        <div className="py-4">{children}</div>
      </div>
    </div>
  )
} 