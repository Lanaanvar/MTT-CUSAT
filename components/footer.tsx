"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface TeamMember {
  name: string;
  linkedin: string;
}

const TeamModal = ({
  isVisible,
  onClose,
  position,
}: {
  isVisible: boolean;
  onClose: () => void;
  position: { x: number; y: number } | null;
}) => {
  const teamMembers: TeamMember[] = [
    { name: "Revathy", linkedin: "http://www.linkedin.com/in/revuz" },
    { name: "Ronaq", linkedin: "https://linkedin.com/in/ronaq" },
    { name: "Dheeraj", linkedin: "http://linkedin.com/in/dheerajjagadeesh" },
    { name: "Lana", linkedin: "https://www.linkedin.com/in/lana-anvar" },
  ];

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close the modal when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible || !position) return null;

  // Calculate position to ensure modal stays within viewport
  const style: React.CSSProperties = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translateY(-100%)',
    zIndex: 50,
  };

  return (
    <div
      ref={modalRef}
      className="bg-white text-gray-900 p-4 rounded-lg shadow-lg w-64"
      style={style}
    >
      <div className="space-y-3">
        <h3 className="font-semibold text-center mb-2 border-b pb-1">Team Members</h3>
        {teamMembers.map((member) => (
          <div key={member.name} className="flex items-center justify-between">
            <span className="font-medium">{member.name}</span>
            <Link
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Footer() {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number } | null>(null);
  const teamLinkRef = useRef<HTMLSpanElement>(null);

  const handleTeamClick = (e: React.MouseEvent) => {
    // Get position for the modal
    if (teamLinkRef.current) {
      const rect = teamLinkRef.current.getBoundingClientRect();
      setModalPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
    setShowTeamModal(true);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">IEEE MTT-S CUSAT SB</h3>
            <p className="text-gray-400 mb-4">
              Advancing microwave theory, techniques, and applications through
              innovation and education.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.instagram.com/ieeemttscusat"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/mtts-cusat-0967a8367"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
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
                <Link
                  href="/events"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/members"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Members
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
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
                <Link
                  href="https://www.ieee.org/"
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IEEE
                </Link>
              </li>
              <li>
                <Link
                  href="https://mtt.org/"
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IEEE MTT-S
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.ieee.org/membership/join/index.html"
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
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
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  Cochin University of Science and Technology, Kalamassery,
                  Kochi, Kerala, India
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <Link
                  href="mailto:mttscusatofficial@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  mttscusatofficial@gmail.com
                </Link>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <Link
                  href="tel:+918078404116"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  +91 8078 404 116
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} IEEE MTT-S. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <span
              ref={teamLinkRef}
              className="text-gray-400 text-sm cursor-pointer hover:text-white transition-colors"
              onClick={handleTeamClick}
            >
              Made with ❤️ by <span className="underline">Us!</span>
            </span>
            <TeamModal
              isVisible={showTeamModal}
              onClose={() => setShowTeamModal(false)}
              position={modalPosition}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
