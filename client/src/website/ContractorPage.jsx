import React from "react"
import { Helmet } from "react-helmet-async"
import Header from "./Header"
import Footer from "./Footer"
import { Check } from "lucide-react"

export default function ContractorPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <Helmet>
        <title>Contractor Services | Hassan Associates</title>
        <meta name="description" content="Trusted contractor services in Lahore. Hassan Associates manages budgeting, scheduling, quality control, and on-site coordination for your construction projects." />
        <meta name="keywords" content="construction contractor lahore, building contractor lahore, civil contractor, project management construction, hassan associates contractor" />
      </Helmet>
      {/* Global Header */}
      <Header />

      {/* Panoramic Banner Section */}
      <section className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] bg-slate-950">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/contractor_banner.png')" }}
        />
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-white text-slate-900 flex-1 flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column - Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-md overflow-hidden bg-white shadow-xl border border-slate-100 aspect-[4/3]">
                <img
                  src="/assets/contractor_engineer.png"
                  alt="Contractor Engineer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column - Text Details */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 font-sans leading-tight">
                Contractor
              </h1>
              <div className="flex flex-col gap-4 text-slate-600 text-sm sm:text-base leading-relaxed font-normal mt-2">
                <p>
                  <strong>Hassan Associates</strong> provides trusted contractor services, managing every aspect of construction with precision, reliability, and a commitment to excellence. Our skilled team oversees each project phase—from budgeting and scheduling to on-site coordination and quality control—ensuring seamless progress and timely delivery.
                </p>
                <p>
                  We work with highly qualified subcontractors and suppliers, adhering to the highest industry standards to guarantee outstanding results. Whether it's a residential build, commercial project, or large-scale development, Hassan Associates is dedicated to executing projects that meet client expectations while maintaining strict safety and regulatory compliance. Our dedication to quality craftsmanship and efficient project management makes us a valued contractor in the industry.
                </p>
              </div>
            </div>
          </div>

          {/* Why This Service Section */}
          <div className="mt-16 w-full">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#cca328] font-sans text-left mb-4">
              Why This Service
            </h2>
            <hr className="border-t border-slate-800 w-full mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 max-w-4xl text-left">
              {/* Left Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Project Budgeting & Scheduling</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">On-Site Coordination</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Quality Control & Safety</span>
                </div>
              </div>
              {/* Right Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Subcontractor Management</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Regulatory Compliance</span>
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
