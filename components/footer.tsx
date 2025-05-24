"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"

interface TeamMember {
  name: string;
  linkedin: string;
}

const TeamModal = ({ isVisible, onMouseLeave }: { isVisible: boolean; onMouseLeave: () => void }) => {
  const teamMembers: TeamMember[] = [
    { name: "Revathy", linkedin: "https://linkedin.com/in/revathy" },
    { name: "Ronaq", linkedin: "https://linkedin.com/in/ronaq" },
    { name: "Dheeraj", linkedin: "https://linkedin.com/in/dheeraj" },
    { name: "Lena", linkedin: "https://linkedin.com/in/lena" },
  ];

  if (!isVisible) return null;

  return (
    <div
      className="absolute bottom-full mb-2 bg-white text-gray-900 p-4 rounded-lg shadow-lg"
      onMouseLeave={onMouseLeave}
    >
      <div className="space-y-2">
        {teamMembers.map((member) => (
          <div key={member.name} className="flex items-center gap-2">
            <span>{member.name}</span>
            <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4 text-blue-600" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Footer() {
  const [showTeamModal, setShowTeamModal] = useState(false);

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
              <Link href="https://www.instagram.com/ieeemttscusat" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://www.linkedin.com/in/mtts-cusat-0967a8367" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {/* <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li> */}
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
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <div className="relative">
              <span 
                className="text-gray-400 text-sm cursor-pointer hover:text-white transition-colors"
                onMouseEnter={() => setShowTeamModal(true)}
              >
                Made with ❤️ by <span className="underline">Us!</span>
              </span>
              <TeamModal 
                isVisible={showTeamModal} 
                onMouseLeave={() => setShowTeamModal(false)} 
              />
            </div>
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
