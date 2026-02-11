'use client';

import Link from "next/dist/client/link";

export default function Navbar() {
  return (
    <nav className="bg-teal-600 w-full fixed">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="text-white text-xl font-bold">
          Uniserve
        </div>

        {/* Links */}
        <ul className="flex items-center gap-6 text-white">
          <li>
            <Link href="#" className="hover:text-teal-200 transition">
              Services
            </Link>
          </li>

          <li>
            <Link href="/announcements" className="hover:text-teal-200 transition">
              Announcements
            </Link>
          </li>

              </ul>
          <div>
            <Link 
              href="#"
              className="bg-white text-teal-600 px-4 py-2 rounded-md font-medium hover:bg-teal-100 transition"
            >
              Get Started
            </Link>
          </div>

      </div>
    </nav>
  )
}
