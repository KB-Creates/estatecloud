import React from "react"
import { Helmet } from "react-helmet-async"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Helmet>
        <title>EstateCloud | Coming Soon</title>
        <meta name="description" content="EstateCloud - Real Estate & Property Management" />
      </Helmet>

      {/* Header */}
      <Header />

      {/* Main Content: Clean Centered Coming Soon H1 */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden bg-[url('/templete%20images/grid-top-scaled.webp')] bg-top bg-no-repeat bg-cover px-4 py-24">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight text-center">
          Coming Soon
        </h1>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
