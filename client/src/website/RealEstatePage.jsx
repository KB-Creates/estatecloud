import React from "react"
import { Helmet } from "react-helmet-async"
import Header from "./Header"
import Footer from "./Footer"
import { Check } from "lucide-react"

export default function RealEstatePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <Helmet>
        <title>Real Estate Consultant | Hassan Associates</title>
        <meta name="description" content="Professional real estate consultancy in Lahore. Get expert advice, market insights, and strategic guidance for buying, selling, and investing in property." />
        <meta name="keywords" content="real estate consultant lahore, property advisor lahore, invest in lahore property, dha lahore advisor, park view city lahore, hassan associates consultancy" />
      </Helmet>
      {/* Global Header */}
      <Header />

      {/* Panoramic Banner Section */}
      <section className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] bg-slate-950">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/real-state-.jpg')" }}
        />
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-white text-slate-900 flex-1 flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column - Text Details */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 font-sans leading-tight">
                Real Estate Consultant
              </h1>
              <div className="flex flex-col gap-4 text-slate-600 text-sm sm:text-base leading-relaxed font-normal mt-2">
                <p>
                  <strong>At Hassan Associates</strong>, we pride ourselves on delivering exceptional real estate consultancy services that blend market expertise with a client-focused approach. Our consultants offer in-depth insights into property trends, investment opportunities, and strategic growth avenues, helping clients make confident, well-informed decisions.
                </p>
                <p>
                  Whether it's navigating complex commercial transactions, maximizing returns on investments, or guiding clients through residential acquisitions, we provide end-to-end support that is personalized to meet diverse needs. Hassan Associates is committed to fostering strong client relationships built on trust, transparency, and a shared vision for long-term success in real estate.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md overflow-hidden bg-white shadow-xl border border-slate-100 aspect-[4/3]">
                <img
                  src="/assets/real_estate_consultants.png"
                  alt="Real Estate Consultants"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Aspects Section */}
          <div className="mt-16 w-full">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#cca328] font-sans text-left mb-4">
              Essential Aspects of Real Estate Consultancy
            </h2>
            <hr className="border-t border-slate-800 w-full mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 max-w-4xl text-left">
              {/* Left Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Strategic Guidance</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Tailored Solutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Comprehensive Support</span>
                </div>
              </div>
              {/* Right Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Market Expertise</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Integrity and Excellence</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Your Success, Our Priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}
