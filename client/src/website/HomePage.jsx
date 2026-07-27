import React from "react"
import { Helmet } from "react-helmet-async"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      <Helmet>
        <title>EstateCloud | Coming Soon</title>
        <meta name="description" content="EstateCloud - Real Estate & Property Management" />
      </Helmet>

      {/* Full top background image - unclipped */}
      <img
        src="/templete images/grid-top-scaled.webp"
        alt="Background Grid"
        className="absolute top-0 left-0 w-full h-auto object-contain pointer-events-none z-0"
      />

      {/* Header */}
      <Header />

      {/* Main Content: Clean Centered Coming Soon H1 */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-4 pt-32 pb-24">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight text-center">
          Coming Soon
        </h1>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
