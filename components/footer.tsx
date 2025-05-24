import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">IEEE MTT-S CUSAT SB</h3>
            <p className="text-gray-400 mb-4">
              Advancing microwave theory, techniques, and applications through innovation and education.
            </p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/members" className="text-gray-400 hover:text-white transition-colors">
                  Members
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://www.ieee.org/" className="text-gray-400 hover:text-white transition-colors">
                  IEEE
                </Link>
              </li>
              <li>
                <Link href="https://mtt.org/" className="text-gray-400 hover:text-white transition-colors">
                  IEEE MTT-S
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.ieee.org/membership/join/index.html"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  IEEE Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400">
                  Cochin University of Science and Technology, Kalamassery, Kochi, Kerala, India
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <Link
                  href="mailto:mttscusatofficial@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  mttscusatofficial@gmail.com
                </Link>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <Link href="tel:+918078404116" className="text-gray-400 hover:text-white transition-colors">
                  +91 8078 404 116
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} IEEE MTT-S CUSAT SB. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/credits" className="text-gray-400 hover:text-white transition-colors">
                  Credits
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
