import React from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
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

      {/* Top Background Perspective Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none z-0 overflow-hidden opacity-90">
        <img
          src="/templete images/grid-top-scaled.webp"
          alt="Background Grid"
          className="w-full h-full object-cover object-top"
        />
        {/* Soft radial fade out */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50" />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content / Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-36 pb-28 max-w-6xl mx-auto w-full text-center">
        
        {/* Floating Icon Badges positioned symmetrically around the Hero area */}
        {/* 1. Top Left: Analytics / Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.6 },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="hidden md:flex absolute left-4 lg:left-12 top-28 items-center justify-center p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <BarChart3 className="w-5 h-5" />
          </div>
        </motion.div>

        {/* 2. Mid Left: Property Pin */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.2 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="hidden md:flex absolute left-8 lg:left-24 top-64 items-center justify-center p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
            <MapPin className="w-5 h-5 fill-rose-500/20" />
          </div>
        </motion.div>

        {/* 3. Top Right: Growth / Rocket */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.3 },
            y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="hidden md:flex absolute right-4 lg:right-12 top-28 items-center justify-center p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
            <Rocket className="w-5 h-5" />
          </div>
        </motion.div>

        {/* 4. Mid Right: Verified Success / Check */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.4 },
            y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="hidden md:flex absolute right-8 lg:right-24 top-64 items-center justify-center p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#029474]">
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          </div>
        </motion.div>

        {/* Central Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/about"
            className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:shadow-md cursor-pointer mb-8 group"
          >
            <span className="bg-slate-900 text-white px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase">
              Real Estate
            </span>
            <span className="text-slate-600 font-medium">Manage Smarter, Together</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-center max-w-4xl"
        >
          All-in-One Workspace <br className="hidden sm:inline" />
          for Modern Real Estate
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl text-center leading-relaxed font-normal"
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
