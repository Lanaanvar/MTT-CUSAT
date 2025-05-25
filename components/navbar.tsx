"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/context/auth-context"

const navItems = [
  { name: "Home", href: "/" },
  // { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Blog", href: "/blog" },
  { name: "Members", href: "/members" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className={cn(
      "bg-white border-b border-gray-200 sticky top-0 z-50 transition-shadow duration-300",
      scrolled ? "shadow-md" : ""
    )}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-900">MTT-S</span>
            <span className="ml-1 text-lg font-medium text-gray-600">CUSAT</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-blue-900 bg-blue-50"
                    : "text-gray-700 hover:text-blue-900 hover:bg-blue-50",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                {user.isAdmin && (
                  <Button asChild variant="outline">
                    <Link href="/admin">Admin Panel</Link>
                  </Button>
                )}
                <Button variant="ghost" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button asChild className="bg-blue-900 hover:bg-blue-800">
                <Link href="/login">Log in</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "md:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container mx-auto px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                pathname === item.href
                  ? "text-blue-900 bg-blue-50"
                  : "text-gray-700 hover:text-blue-900 hover:bg-blue-50",
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                {user.isAdmin && (
                  <Button asChild variant="outline" className="w-full justify-center">
                    <Link href="/admin">Admin Panel</Link>
                  </Button>
                )}
                <Button variant="ghost" onClick={signOut} className="w-full justify-center">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button asChild className="w-full bg-blue-900 hover:bg-blue-800 justify-center">
                <Link href="/login">Log in</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
