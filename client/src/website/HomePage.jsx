import React from "react"
import { Helmet } from "react-helmet-async"
import Header from "./components/Header"
import Hero from "./components/Hero"
import ClientLogos from "./components/ClientLogos"
import Features from "./components/Features"
import Benefits from "./components/Benefits"
import TrustedTeams from "./components/TrustedTeams"
import Footer from "./components/Footer"

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

      {/* Website Header */}
      <Header />

      {/* Website Hero Section Component */}
      <Hero />

      {/* Client Logos Component */}
      <ClientLogos />

      {/* Features Grid Section Component */}
      <Features />

      {/* Benefits Section Component */}
      <Benefits />

      {/* Trusted Teams / Testimonials Section Component */}
      <TrustedTeams />

      {/* Website Footer */}
      <Footer />
    </div>
  )
}
