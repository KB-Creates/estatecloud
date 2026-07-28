import React from "react"
import { Star } from "lucide-react"

export default function ClientLogos() {
  const logos = [
    {
      name: "mparticle",
      icon: (
        <svg className="h-5 w-auto text-slate-900" viewBox="0 0 32 24" fill="currentColor">
          <path d="M0 0h8l6 6H6zM10 8h8l6 6h-8zM20 16h8l6 6h-8z" />
        </svg>
      ),
      textColor: "text-slate-900 font-bold",
    },
    {
      name: "loom",
      icon: (
        <svg className="h-6 w-6 text-[#625DF5]" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      textColor: "text-slate-900 font-bold",
    },
    {
      name: "pendo",
      icon: (
        <svg className="h-6 w-6 text-[#FF406E]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4h10c4.4 0 8 3.6 8 8s-3.6 8-8 8H4V4z" />
        </svg>
      ),
      textColor: "text-slate-900 font-bold",
    },
    {
      name: "Optimizely",
      icon: (
        <svg className="h-6 w-6 text-[#0052FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M4 16c2-4 6-8 10-6s4 6 6 8" />
        </svg>
      ),
      textColor: "text-slate-900 font-bold",
    },
    {
      name: "draftbit",
      icon: (
        <svg className="h-6 w-6 text-[#6366F1]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8L18.6 8 12 11.2 5.4 8 12 4.8zM4 9.6l7 3.5v6.9l-7-3.5V9.6zm16 6.9l-7 3.5v-6.9l7-3.5v6.9z" />
        </svg>
      ),
      textColor: "text-slate-900 font-bold",
    },
    {
      name: "Typedream",
      icon: (
        <svg className="h-6 w-6 text-[#A855F7]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
      ),
      textColor: "text-slate-900 font-bold",
    },
  ]

  return (
    <section className="w-full bg-slate-50 py-10 sm:py-14 relative z-20">
      <div className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        {/* Title Badge with Star */}
        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Trusted by 100,000+ marketers, writers, and entrepreneurs</span>
        </div>

        {/* Client Logos Grid */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-14 lg:gap-16 opacity-90">
          {logos.map((logo) => (
            <div key={logo.name} className="flex items-center gap-2.5 cursor-pointer">
              {logo.icon}
              <span className={`text-base sm:text-lg tracking-tight ${logo.textColor}`}>
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
