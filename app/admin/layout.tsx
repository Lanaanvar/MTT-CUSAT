"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Calendar, FileText } from "lucide-react"

const tabs = [
  { name: "Events", href: "/admin" },
  { name: "Registrations", href: "/admin/registrations" },
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
                href="/admin"
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
      <div>
        <div className="border-b">
          <nav className="container mx-auto px-4">
            <ul className="flex gap-4">
              {tabs.map((tab) => (
                <li key={tab.name}>
                  <Link
                    href={tab.href}
                    className={cn(
                      "inline-block px-4 py-2 border-b-2 -mb-[2px]",
                      pathname === tab.href
                        ? "border-blue-900 text-blue-900"
                        : "border-transparent hover:text-blue-900"
                    )}
                  >
                    {tab.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </div>
  )
} 