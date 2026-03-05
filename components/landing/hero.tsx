"use client"

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-purple-100 overflow-hidden border-b-8 border-black pt-16">
      {/* Decorative floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Yellow circle */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300 rounded-full border-3 border-black animate-float" style={{ "--float-rotate": "0deg" } as CSSProperties} />
        {/* Pink diamond */}
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-400 rotate-1 border-4 border-black animate-float-reverse" style={{ "--float-rotate": "45deg" } as CSSProperties} />
        
        {/* Sticker elements */}
        <div className="absolute top-32 right-1/4 bg-orange-400 border-3 border-black px-4 py-2 font-black text-lg rotate-12 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-float" style={{ "--float-rotate": "12deg" } as CSSProperties}>
          HOT! 🔥
        </div>
        <div className="absolute bottom-40 left-20 bg-pink-300 border-4 border-black px-4 py-2 font-black -rotate-12 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-float-reverse" style={{ "--float-rotate": "-12deg" } as CSSProperties}>
          NEW ⚡
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center z-10">
        {/* Trust badge */}
        <div className="inline-block mb-8 animate-slide-in-up">
          <div className="bg-black text-white px-8 py-3 font-black text-sm border-4 border-black rotate-1 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            ✨ 10,000+ STUDENTS TRUST US ✨
          </div>
        </div>
        
        {/* Main heading - stacked brutalist blocks */}
        <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black mb-8 leading-none tracking-tighter">
          <span className="inline-block bg-white border-7 border-black px-8 py-4 -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
            CAMPUS
          </span>
          <br />
          <span className="inline-block bg-yellow-300 border-7 border-black px-8 py-4 rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            LIFE
          </span>
          <br />
          <span className="inline-block bg-pink-400 border-7 border-black px-8 py-4 -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-6">
            SIMPLIFIED!
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl font-bold max-w-3xl mx-auto mb-12 leading-relaxed">
          Everything you need on campus—laundry, food, tech fixes—all in one place. 
          No BS, just services that work. 🎯
        </p>
        
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <Link href="/services" className="group">
            <div className="bg-black text-white px-10 py-6 font-black text-xl border-5 border-black hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 active:translate-y-0.5 active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              BROWSE SERVICES
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
          <Link href="/auth/sign-up">
            <div className="bg-cyan-300 text-black px-10 py-6 font-black text-xl border-6 border-black hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              SIGN UP FREE
            </div>
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { value: "10K+", label: "Students", color: "bg-blue-300" },
            { value: "50+", label: "Providers", color: "bg-purple-300" },
            { value: "99%", label: "Happy", color: "bg-orange-300" },
            { value: "24/7", label: "Available", color: "bg-green-300" },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all ${index % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
            >
              <div className="text-4xl font-black mb-1">{stat.value}</div>
              <div className="text-sm font-black uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
