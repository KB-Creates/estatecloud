import React from "react"
import { PillBadge } from "@/components/ui/pill-badge"
import {
  Layers,
  Users,
  Sparkles,
  Clock,
  Sliders,
  ShieldCheck,
} from "lucide-react"

export default function Benefits() {
  const benefitsList = [
    {
      icon: <Layers className="w-6 h-6 text-[#029474]" />,
      iconBg: "bg-[#029474]/10",
      title: "All-in-One Real Estate Workspace",
      description:
        "Say goodbye to fragmented tools. Manage property listings, leases, tenant records, and client deals in one unified cloud.",
    },
    {
      icon: <Users className="w-6 h-6 text-[#029474]" />,
      iconBg: "bg-[#029474]/10",
      title: "Collaborate in Real Time",
      description:
        "Seamless team collaboration between property managers, brokers, and agents with instant updates and shared notes.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#029474]" />,
      iconBg: "bg-[#029474]/10",
      title: "AI-Powered Property Insights",
      description:
        "EstateCloud auto-suggests market valuation, generates tenant lease agreements, and prioritizes deal pipelines with AI.",
    },
    {
      icon: <Clock className="w-6 h-6 text-[#029474]" />,
      iconBg: "bg-[#029474]/10",
      title: "Automated Rent & Lease Tracking",
      description:
        "Track lease expiration dates and automated rent payment reminders automatically. No more spreadsheet errors.",
    },
    {
      icon: <Sliders className="w-6 h-6 text-[#029474]" />,
      iconBg: "bg-[#029474]/10",
      title: "Custom Property Workflows",
      description:
        "Create drag-and-drop property management pipelines tailored to your agency — no technical skills needed.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#029474]" />,
      iconBg: "bg-[#029474]/10",
      title: "Secure & Scalable Infrastructure",
      description:
        "From boutique real estate agencies to enterprise property chains, EstateCloud keeps your data safe, encrypted, and reliable.",
    },
  ]

  return (
    <section className="w-full bg-slate-50 py-16 sm:py-24 relative z-20 overflow-hidden select-none">
      <div className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        
        {/* Top Pill Badge */}
        <PillBadge tag="Benefits" label="Designed for Real Estate" />

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-slate-900 tracking-tight text-center mt-6 leading-[1.15] max-w-4xl">
          Why Agencies <span className="inline-block hover:rotate-12 transition-transform cursor-pointer">🌟</span> Love <br />
          Working <span className="inline-block hover:scale-110 transition-transform cursor-pointer">🤝</span> with EstateCloud
        </h2>

        {/* 6-Card Grid Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 w-full text-left">
          {benefitsList.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Icon Badge */}
                <div className={`${item.iconBg} p-3.5 rounded-2xl w-max`}>
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-medium text-slate-900 tracking-tight">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
