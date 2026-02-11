import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* Top grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-16">

          {/* Brand */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">
              Uniserve
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Simplifying campus life by connecting students to essential services
              and important announcements — all in one platform.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-medium mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/announcements" className="hover:text-white transition">Announcements</Link></li>
              <li><Link href="/get-started" className="hover:text-white transition">Get Started</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-medium mb-4">Student Services</h4>
            <ul className="space-y-3 text-sm">
              <li>Laundry</li>
              <li>Food Delivery</li>
              <li>Cleaning</li>
              <li>Barbering & Salon</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-medium mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Uniserve. All rights reserved.</p>

          <p>Built for students, by students.</p>
        </div>

      </div>
    </footer>
  )
}
