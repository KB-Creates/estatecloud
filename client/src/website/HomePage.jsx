import React, { useRef } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Rocket,
  CheckCircle2,
  ArrowRight,
  MapPin,
  ShoppingBag,
  Smartphone,
  Headphones,
  LayoutGrid,
} from "lucide-react"
import PillBadge from "@/components/ui/pill-badge"

function HeroScrollPreview() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  })

  // Start with 25deg tilt back in 3D perspective, unskew to 0deg on scroll
  const rotateX = useTransform(scrollYProgress, [0, 1], [25, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1])

  return (
    <div
      ref={containerRef}
      className="w-full max-w-6xl mx-auto px-4 pt-4 pb-24 relative z-20"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white/70 backdrop-blur-xl p-2 sm:p-4 shadow-2xl shadow-slate-300/40 transition-shadow duration-300"
      >
        <img
          src="/dashboard-preview.png"
          alt="EstateCloud Dashboard Preview"
          className="w-full h-auto rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-md object-cover"
        />
      </motion.div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans relative overflow-hidden select-none">
      <Helmet>
        <title>EstateCloud | All-in-One Real Estate Workspace</title>
        <meta
          name="description"
          content="EstateCloud - The all-in-one real estate cloud platform to manage properties, leads, contracts, and financial reports in one unified workspace."
        />
      </Helmet>

      {/* Full top background image - unclipped */}
      <img
        src="/templete images/grid-top-scaled.webp"
        alt="Background Grid"
        className="absolute top-0 left-0 w-full h-auto object-contain pointer-events-none z-0"
      />

      {/* Header */}
      <Header />

      {/* Main Content / Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-36 pb-8 max-w-6xl mx-auto w-full text-center">
        
        {/* Static 4 Icons positioned exactly like reference image (No animations) */}
        {/* 1. Top Left Icon (Chart): Next to top pill badge */}
        <div className="hidden md:block absolute top-28 left-[20%] lg:left-[28%] pointer-events-none z-10">
          <img
            src="/hero-icons/icon-1.png"
            alt="Hero Icon 1"
            className="w-12 h-12 lg:w-14 lg:h-14 object-contain"
          />
        </div>

        {/* 2. Top Right Icon (Rocket): Next to top pill badge */}
        <div className="hidden md:block absolute top-28 right-[20%] lg:right-[28%] pointer-events-none z-10">
          <img
            src="/hero-icons/icon-3.png"
            alt="Hero Icon 3"
            className="w-12 h-12 lg:w-14 lg:h-14 object-contain"
          />
        </div>

        {/* 3. Mid Left Icon (Pushpin): On the far left of H1 title */}
        <div className="hidden md:block absolute top-48 left-[4%] lg:left-[12%] pointer-events-none z-10">
          <img
            src="/hero-icons/icon-2.png"
            alt="Hero Icon 2"
            className="w-14 h-14 lg:w-16 lg:h-16 object-contain"
          />
        </div>

        {/* 4. Mid Right Icon (Green Check): On the far right of H1 title */}
        <div className="hidden md:block absolute top-52 right-[4%] lg:right-[12%] pointer-events-none z-10">
          <img
            src="/hero-icons/icon-4.png"
            alt="Hero Icon 4"
            className="w-14 h-14 lg:w-16 lg:h-16 object-contain"
          />
        </div>

        {/* Central Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <PillBadge
            tag="Real Estate"
            label="Manage Smarter, Together"
            to="/about"
          />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl/tight text-black font-medium tracking-tight text-center max-w-4xl"
        >
          All-in-One Workspace <br className="hidden sm:inline" />
          for Modern Real Estate
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xs lg:text-base font-normal text-slate-600 max-w-2xl text-center leading-relaxed"
        >
          Plan, collaborate, and track properties, contracts, leads, and financials — all in one beautiful, unified cloud workspace.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
        >
          <Button
            asChild
            className="w-full sm:w-auto bg-[#029474] hover:bg-[#027a60] text-white font-bold text-sm sm:text-base px-7 py-6 rounded-xl shadow-lg shadow-[#029474]/20 transition-all hover:shadow-xl hover:shadow-[#029474]/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer border-0"
          >
            <Link to="/signup">
              <span>👉 Try It Free</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="w-full sm:w-auto text-slate-700 hover:text-[#029474] hover:bg-slate-100 font-semibold text-sm sm:text-base px-6 py-6 rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Link to="/dashboard">
              <span>See It in Action</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </main>

      {/* 3D Scroll Perspective Image Preview */}
      <HeroScrollPreview />

      {/* Floating Side Toolbar on Right */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200/90 shadow-xl text-slate-600">
        <button title="Properties" className="p-2.5 rounded-xl hover:bg-slate-100 hover:text-[#029474] transition-colors cursor-pointer">
          <ShoppingBag className="w-4 h-4" />
        </button>
        <button title="Mobile Responsive" className="p-2.5 rounded-xl hover:bg-slate-100 hover:text-[#029474] transition-colors cursor-pointer">
          <Smartphone className="w-4 h-4" />
        </button>
        <button title="24/7 Support" className="p-2.5 rounded-xl hover:bg-slate-100 hover:text-[#029474] transition-colors cursor-pointer">
          <Headphones className="w-4 h-4" />
        </button>
        <button title="Dashboard Apps" className="p-2.5 rounded-xl hover:bg-slate-100 hover:text-[#029474] transition-colors cursor-pointer">
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
