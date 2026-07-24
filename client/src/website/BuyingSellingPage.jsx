import React from "react"
import { Helmet } from "react-helmet-async"
import Header from "./Header"
import Footer from "./Footer"
import { Check } from "lucide-react"

export default function BuyingSellingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <Helmet>
        <title>Buying & Selling | Hassan Associates</title>
        <meta name="description" content="A seamless property buying and selling process. We assist buyers in finding their dream homes and help sellers get maximum value with tailored marketing in Lahore." />
        <meta name="keywords" content="buy property lahore, sell property lahore, real estate sales lahore, house for sale lahore, purchase plot lahore, hassan associates sales" />
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
            {/* Left Column - Image (Mockup shows image on left) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-md overflow-hidden bg-white shadow-xl border border-slate-100 aspect-[4/3]">
                <img
                  src="/assets/buying_selling_service.png"
                  alt="Buying & Selling Service"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column - Text Details (Mockup shows text on right) */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 font-sans leading-tight">
                Buying & Selling
              </h1>
              <div className="flex flex-col gap-4 text-slate-600 text-sm sm:text-base leading-relaxed font-normal mt-2">
                <p>
                  <strong>Hassan Associates</strong> is dedicated to making the buying and selling process seamless and rewarding for our clients. With our comprehensive market knowledge and strategic approach, we assist buyers in finding properties that align with their goals, whether they seek a family home or a high-potential investment.
                </p>
                <p>
                  For sellers, we offer tailored marketing strategies, detailed property evaluations, and skilled negotiation techniques to ensure maximum value and swift transactions. Our commitment to transparency, client satisfaction, and industry expertise sets us apart, making Hassan Associates a trusted partner in all real estate transactions.
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
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Property Valuation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Market Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Closing Deals</span>
                </div>
              </div>
              {/* Right Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Negotiation Expertise</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                  <span className="text-slate-800 font-medium font-sans text-base sm:text-lg">Legal Guidance</span>
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
