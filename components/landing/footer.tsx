import type { CSSProperties } from "react";
import Link from "next/link";


export default function Footer() {
  return (
    <>
      {/* Final CTA Section */}
      <section className="py-32 bg-cyan-300 border-b-8 border-black relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-pink-400 border-4 border-black rotate-45 animate-float" style={{ "--float-rotate": "45deg" } as CSSProperties} />
          <div className="absolute top-20 right-20 w-24 h-24 bg-yellow-300 rounded-full border-4 border-black animate-float-reverse" style={{ "--float-rotate": "0deg" } as CSSProperties} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 leading-tight">
            <span className="inline-block bg-white border-6 border-black px-6 py-3 rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
              READY TO
            </span>
            <br />
            <span className="inline-block bg-pink-400 border-6 border-black px-6 py-3 -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              UPGRADE YOUR
            </span>
            <br />
            <span className="inline-block bg-yellow-300 border-6 border-black px-6 py-3 rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-4">
              CAMPUS LIFE?
            </span>
          </h2>
          <p className="text-2xl font-bold mb-12">
            Join 10,000+ students living their best life
          </p>
          <Link href="/auth/sign-up" className="inline-block">
            <div className="bg-black text-white px-12 py-6 font-black text-2xl border-6 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1 hover:rotate-0 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              GET STARTED FREE &rarr;
            </div>
          </Link>
          <p className="mt-8 font-bold text-lg">
            No credit card &bull; Just vibes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="inline-block bg-yellow-300 text-black border-4 border-white px-4 py-2 font-black text-xl mb-4 rotate-2">
                CAMPUS
              </div>
              <p className="font-bold text-gray-300">
                Making campus life easier, one service at a time.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-4 text-xl">SERVICES</h4>
              <ul className="space-y-2 font-bold">
                <li>
                  <Link href="/services" className="hover:text-yellow-300 transition-colors">
                    &rarr; Laundry
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-yellow-300 transition-colors">
                    &rarr; Grooming
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-yellow-300 transition-colors">
                    &rarr; Tech Support
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-yellow-300 transition-colors">
                    &rarr; Food Delivery
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-xl">COMPANY</h4>
              <ul className="space-y-2 font-bold">
                <li>
                  <Link href="#" className="hover:text-pink-300 transition-colors">
                    &rarr; About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-pink-300 transition-colors">
                    &rarr; Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-pink-300 transition-colors">
                    &rarr; Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-pink-300 transition-colors">
                    &rarr; Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-xl">LEGAL</h4>
              <ul className="space-y-2 font-bold">
                <li>
                  <Link href="/privacy" className="hover:text-cyan-300 transition-colors">
                    &rarr; Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-cyan-300 transition-colors">
                    &rarr; Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-300 transition-colors">
                    &rarr; Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t-4 border-white text-center">
            <p className="font-black text-lg">
              &copy; 2026 CAMPUSSERVICES &bull; MADE WITH &hearts; BY STUDENTS
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
