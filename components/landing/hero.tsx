"use client"
// import Image from "next/image";
import Navbar from "./Navbar";

export default function Hero() {
  return (
    <div>
       <Navbar /> 
      <section className="min-h-screen pt-20 flex items-center justify-between bg-gray-100"
      >
        <div className="max-w-6xl mx-auto px-4 w-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="flex flex-col gap-5 text-center md:text-left max-w-xl w-full">
            <h1 className="font-bold text-4xl md:text-5xl leading-tight text-gray-900">
              No Stress. No Searching.
            </h1>

            <h3 className="font-medium text-lg text-teal-700">
              Just Student Services Made Easy
            </h3>

            <p className="text-gray-600">
              Your gateway to seamless university services — from food and
              laundry to announcements and campus opportunities.
            </p>

            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <button className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition">
                Get Started
              </button>

              <button className="border border-teal-600 text-teal-600 px-6 py-3 rounded-md hover:bg-teal-50 transition">
                Explore Services
              </button>
            </div>
          </div>

          {/* Visual / Image Placeholder */}
          <div className="bg-emerald-950 w-full h-72 md:w-96 md:h-96 rounded-3xl flex items-center justify-center shadow-lg shrink-0 ">
            {/* future image or illustration */}
            {/* <Image
              src="/landing_assets/students.jpg"
              alt="Students using campus services"
              fill
              className="object-cover rounded-3xl opacity-90 -z-10"
              priority
            /> */}
          </div>
        </div>
      </section>
    </div>
  );
}
