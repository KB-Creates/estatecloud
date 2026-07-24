import React from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import { TrendingUp, DollarSign, Handshake, Boxes, Building2, Target, Eye, Star, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const specialties = [
    { icon: TrendingUp, title: "Marketers" },
    { icon: DollarSign, title: "Investment Consultant" },
    { icon: Handshake, title: "Dealer & Promoters" },
    { icon: Boxes, title: "Developers" },
    { icon: Building2, title: "Property Advisor" }
  ]

  const testimonials = [
    {
      name: "Nadeem Chaudhary",
      image: "/assets/waseem_avatar.png", // reuse avatar
      text: "Hassan associate's delivers excellence in real estate! Seamless transactions, expert insights, and a commitment to client satisfaction. Highly recommended!",
      stars: 5,
    },
    {
      name: "Ali",
      image: "/assets/ali_avatar.png",
      text: "Absolutely delighted with Hassan associate's real estate prowess! Seamless process, expert guidance, and a results-driven approach. Their team goes above and beyond to ensure client satisfaction. A top-notch experience from start to finish!",
      stars: 5,
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <Helmet>
        <title>About Us | Hassan Associates</title>
        <meta name="description" content="Hassan Associates has proudly served the real estate industry in Lahore, Pakistan for over 20 years, delivering expert property management, construction, development and consultation." />
        <meta name="keywords" content="about hassan associates, property dealer lahore, real estate advisor lahore, construction company lahore" />
      </Helmet>

      {/* Global Header */}
      <Header />

      {/* Panoramic Banner Section */}
      <section className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] bg-slate-950 overflow-hidden">
        {/* Responsive Desktop Banner */}
        <div
          className="hidden md:block w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/about-us.jpg')" }}
        />
        {/* Responsive Mobile Banner */}
        <div
          className="block md:hidden w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/about-us-mobile.png')" }}
        />
      </section>

      {/* Introduction Section */}
      <section className="py-24 bg-white text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column - Text Details */}
            <div className="lg:col-span-7 flex flex-col gap-4 text-left">
              <span className="text-[#cca328] font-bold text-xs tracking-widest uppercase">
                Introduction
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 font-sans leading-tight">
                Hassan Associates
              </h1>
              <div className="flex flex-col gap-4 text-slate-600 text-sm sm:text-base leading-relaxed font-normal mt-2">
                <p>
                  has proudly served the real estate industry for over 20 years, delivering expert services that have shaped countless residential, commercial, and industrial projects. With two decades of hands-on experience, we have honed our understanding of market trends, property values, and client needs to provide a seamless and rewarding experience for each client.
                </p>
                <p>
                  At Hassan Associates, we believe in building long-lasting relationships based on trust, transparency, and a commitment to excellence. Our team of seasoned professionals is dedicated to guiding clients every step of the way, whether they are buying, selling, or investing in real estate. Join us as we continue to transform dreams into reality and help you achieve your property goals.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl border border-slate-100 aspect-[4/3] rounded-none">
                <img
                  src="/assets/service-img.png"
                  alt="Hassan Associates Services"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-slate-50 text-slate-900 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <Card className="bg-white border-0 shadow-lg p-8 rounded-none text-left flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[#cca328] bg-[#cca328]/10 p-3 rounded-none border border-[#cca328]/25">
                  <Target className="h-6 w-6" />
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-sans text-slate-950">
                  Our Mission
                </h2>
              </div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Our mission at Hassan Associates is to provide exceptional real estate services that prioritize client satisfaction and long-term value. We are dedicated to guiding clients with honesty, expertise, and a deep understanding of market trends. By fostering strong relationships and delivering tailored solutions, we aim to make every property transaction smooth, transparent, and rewarding.
              </p>
            </Card>

            {/* Vision */}
            <Card className="bg-white border-0 shadow-lg p-8 rounded-none text-left flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[#cca328] bg-[#cca328]/10 p-3 rounded-none border border-[#cca328]/25">
                  <Eye className="h-6 w-6" />
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-sans text-slate-950">
                  Our Vision
                </h2>
              </div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Our vision at Hassan Associates is to set a new standard in real estate, defined by trust, transparency, and client-focused service. With 20 years of expertise, we aim to empower clients to make confident property decisions, backed by a team that values integrity and professionalism. We strive to make every property journey rewarding and transformative through innovation and dedication.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CEO Message Banner Section */}
      <section
        className="relative w-full h-[400px] md:h-[450px] bg-cover bg-center flex items-center justify-start border-y border-slate-800"
        style={{ backgroundImage: "url('/assets/Azam-Asghar-1920x840-01-2-scaled.jpg')" }}
      >
        {/* Dark subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/45 md:bg-black/30 z-0" />

        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-3 px-8 sm:px-16 md:pl-28 lg:pl-36 max-w-xl md:max-w-2xl text-white">
          <p className="text-white text-lg sm:text-xl md:text-2xl font-light tracking-wide leading-snug font-sans">
            We are Ready to Serve <br className="hidden sm:inline" /> You in Real Estate.
          </p>
          <h2 className="text-[#cca328] font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide mt-1 uppercase font-sans">
            Ch. Azam Asghar Jutt
          </h2>
          <p className="text-white/95 text-xs sm:text-sm md:text-base font-sans uppercase tracking-widest mt-1">
            CEO <span className="font-bold">Hassan Associates</span>
          </p>
          <Link to="/contact">
            <Button className="bg-[#cca328] hover:bg-[#d4af37] text-white font-bold py-3.5 px-8 transition-colors uppercase text-[10px] tracking-widest shadow-md cursor-pointer mt-4 rounded-none h-auto">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose Hassan Associates (Specialties & Testimonials) */}
      <section className="py-24 bg-white text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-sans text-slate-900 tracking-tight">
              Why Choose Hassan Associates
            </h2>
            <div className="h-[2px] w-24 bg-[#cca328] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column - Specialties List */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-left">
              <div className="flex flex-col gap-4">
                {specialties.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div key={idx} className="flex items-center gap-4 p-2 hover:bg-slate-50 transition-colors">
                      <span className="text-[#cca328] bg-[#cca328]/10 p-3 rounded-none border border-[#cca328]/25 shrink-0">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-lg font-bold tracking-wide font-sans text-slate-800">{item.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column - Client Reviews */}
            <div className="lg:col-span-7 flex flex-col gap-6 w-full">
              {testimonials.map((item, idx) => (
                <Card key={idx} className="bg-slate-50 rounded-none border-0 shadow-md p-6 sm:p-8 text-slate-800 flex flex-col gap-4 text-left">
                  {/* User Header */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#cca328] shadow-md"
                    />
                    <div className="flex flex-col">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                        {item.name}
                      </h4>
                      {/* Stars */}
                      <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: item.stars }).map((_, sIdx) => (
                          <Star key={sIdx} className="w-3.5 h-3.5 fill-[#cca328] text-[#cca328]" />
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Text */}
                  <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed italic">
                    "{item.text}"
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}
