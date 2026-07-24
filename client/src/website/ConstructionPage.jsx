import React from "react"
import { Helmet } from "react-helmet-async"
import Header from "./Header"
import Footer from "./Footer"
import { Check } from "lucide-react"

export default function ConstructionPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <Helmet>
        <title>Construction & Development | Hassan Associates</title>
        <meta name="description" content="Transforming visions into reality. Hassan Associates offers exceptional construction and development services in Lahore, managing projects from initial design to completion." />
        <meta name="keywords" content="construction company lahore, home development lahore, builder lahore, real estate development, hassan associates construction" />
      </Helmet>
      {/* Global Header */}
      <Header />

      {/* Panoramic Banner Section */}
      <section className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] bg-slate-950">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/construction.jpg')" }}
        />
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-white text-slate-900 flex-1 flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column - Text Details */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 font-sans leading-tight">
                Construction &<br />Development
              </h1>
              <div className="flex flex-col gap-4 text-slate-600 text-sm sm:text-base leading-relaxed font-normal mt-2">
                <p>
                  <strong>Hassan Associates</strong> offers a comprehensive Construction & Development service that transforms visions into reality. From initial planning to project completion, we work closely with clients to create spaces that are both functional and inspiring. Our team brings together innovative design, meticulous project management, and sustainable building practices to deliver projects on time and within budget.
                </p>
                <p>
                  Whether developing residential communities, commercial spaces, or mixed-use properties, Hassan Associates ensures that each project reflects the highest standards of quality and aligns with our clients' goals. Our commitment to excellence and our collaborative approach make us a trusted partner in construction and development.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md overflow-hidden bg-white shadow-xl border border-slate-100 aspect-[4/3]">
                <img
                  src="/assets/construction_engineers.png"
                  alt="Construction & Development Engineers"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Elements Section */}
          <div className="mt-16 w-full">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#cca328] font-sans text-left mb-4">
              Elements of Our Construction & Development Services
            </h2>
            <hr className="border-t border-slate-800 w-full mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 max-w-4xl text-left">
              {/* Left Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Innovative Design Solutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Cost-Effective Solutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Transparent Communication</span>
                </div>
              </div>
              {/* Right Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Quality Construction</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Timely Project Delivery</span>
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
