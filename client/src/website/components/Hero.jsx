import React, { useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
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
        className="relative"
      >
        {/* Accent Color (#029474) Glow behind image */}
        <div className="absolute -inset-8 bg-[#029474]/15 rounded-[40px] blur-3xl opacity-60 pointer-events-none -z-10" />

        <img
          src="/dashboard-preview.png"
          alt="EstateCloud Dashboard Preview"
          className="w-full h-auto rounded-xl sm:rounded-lg border border-slate-200/80 object-cover relative z-10"
        />
      </motion.div>
    </div>
  )
}

export default function Hero() {
  return (
    <>
      {/* Full top background image - unclipped */}
      <img
        src="/templete images/grid-top-scaled.webp"
        alt="Background Grid"
        className="absolute top-0 left-0 w-full h-auto object-contain pointer-events-none z-0"
      />

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

      {/* Bottom Grid Shape SVG Background */}
      <div className="relative w-full overflow-hidden flex justify-center pointer-events-none -mt-20 sm:-mt-32 pb-8 z-0">
        <img
          src="/templete images/shape-grid-bottom.svg"
          alt="Bottom Grid Shape"
          className="w-full min-w-full h-auto object-cover opacity-90"
        />
      </div>
    </>
  )
}
