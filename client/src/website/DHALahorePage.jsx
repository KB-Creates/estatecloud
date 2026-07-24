import React, { useState } from "react"
import { Helmet } from "react-helmet-async"
import Header from "./Header"
import Footer from "./Footer"
import { Check } from "lucide-react"
import { toast } from "sonner"

export default function DHALahorePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const galleryImages = [
    "/assets/dha_1.jpg",
    "/assets/dha_2.jpg",
    "/assets/dha_3.jpg",
    "/assets/dha_4.jpg",
    "/assets/dha_5.jpg",
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) {
      toast.error("Please fill in your Name and Phone number.")
      return
    }

    setSubmitting(true)
    // Simulate API request
    setTimeout(() => {
      toast.success("Inquiry submitted successfully! Our team will contact you shortly.")
      setFormData({ name: "", email: "", phone: "", message: "" })
      setSubmitting(false)
    }, 1000)
  }

  // Custom SVGs for Social Media Icons
  const FacebookIcon = () => (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
    </svg>
  )

  const InstagramIcon = () => (
    <svg className="h-5 w-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  )

  const YoutubeIcon = () => (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.522 3.5 12 3.5 12 3.5s-7.522 0-9.388.556a3.003 3.003 0 0 0-2.11 2.107C0 8.029 0 12 0 12s0 3.971.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.478 20.5 12 20.5 12 20.5s7.522 0 9.388-.556a3.003 3.003 0 0 0 2.11-2.107C24 15.971 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )

  const TiktokIcon = () => (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.43-.43-.63-.67-.07 2.24-.06 4.48-.07 6.71-.05 2.29-.64 4.65-2.26 6.27-1.72 1.76-4.32 2.45-6.73 2.1-2.67-.35-5.11-2.29-5.91-4.88-.93-2.93-.15-6.43 2.05-8.62 1.5-1.53 3.66-2.34 5.82-2.3v4.01c-1.28-.04-2.62.4-3.5 1.34-.96 1-.95 2.7-.02 3.73.91 1.05 2.52 1.25 3.69.52.75-.45 1.13-1.32 1.13-2.19.02-3.82.01-7.65.01-11.48z" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <Helmet>
        <title>DHA Lahore | Hassan Associates</title>
        <meta name="description" content="Welcome to DHA Lahore, an emblem of elegance and sophistication in the heart of Pakistan. Explore elite residential plots, parks, modern infrastructure, and education." />
        <meta name="keywords" content="dha lahore, defence housing authority, dha lahore plots, dha phase 6, housing society lahore, hassan associates" />
      </Helmet>

      {/* Global Header */}
      <Header />

      {/* Panoramic Banner Section */}
      <section className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] bg-slate-950">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/DHA-Lahore-.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-wide uppercase text-center px-4">
            DHA Lahore
          </h1>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-white text-slate-900 flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Content Area (8 columns) */}
            <div className="lg:col-span-8 flex flex-col gap-10 text-left">
              
              {/* Description Section */}
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 border-b pb-3 border-slate-100">
                  About DHA Lahore
                </h2>
                <div className="text-slate-600 text-sm sm:text-base leading-relaxed flex flex-col gap-4 font-normal">
                  <p>
                    Welcome to <strong>DHA Lahore,</strong> an emblem of elegance and sophistication in the heart of Pakistan. Developed by the Defence Housing Authority, this prestigious residential society offers a lifestyle that seamlessly blends modernity with tranquility. Discover the gold standard of secure community living with state-of-the-art facilities and beautifully manicured spaces.
                  </p>
                </div>
              </div>

              {/* Showcase Image */}
              <div className="w-full overflow-hidden shadow-lg border border-slate-100 rounded-sm">
                <img
                  src="/assets/DHA-Lahore-.jpg"
                  alt="DHA Lahore Showcase"
                  className="w-full h-auto object-cover max-h-[450px]"
                />
              </div>

              {/* Gallery Section */}
              <div className="flex flex-col gap-6">
                <h3 className="text-xl sm:text-2xl font-bold text-[#cca328]">
                  Explore DHA Lahore
                </h3>
                <hr className="border-t border-slate-200 w-full" />
                <div className="columns-1 sm:columns-2 md:columns-3 gap-6">
                  {galleryImages.map((src, index) => (
                    <div
                      key={index}
                      className="group relative mb-6 break-inside-avoid overflow-hidden shadow-md hover:shadow-xl rounded-lg border border-slate-100 bg-slate-50 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedImage(src)}
                    >
                      <img
                        src={src}
                        alt={`DHA Lahore view ${index + 1}`}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-[#cca328] text-white p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                          <svg className="h-5 w-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Section */}
              <div className="flex flex-col gap-6">
                <h3 className="text-xl sm:text-2xl font-bold text-[#cca328]">
                  Key Features of DHA Lahore
                </h3>
                <hr className="border-t border-slate-200 w-full" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                    <span className="text-slate-800 font-medium text-base">Prime Location</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                    <span className="text-slate-800 font-medium text-base">Educational Opportunities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                    <span className="text-slate-800 font-medium text-base">Green Spaces and Parks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                    <span className="text-slate-800 font-medium text-base">Unmatched Security (24/7 Patrol)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                    <span className="text-slate-800 font-medium text-base">Elite Residential Communities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#cca328] shrink-0" />
                    <span className="text-slate-800 font-medium text-base">Modern Commercial Hubs</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar Area (4 columns) */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              {/* Contact Form Card */}
              <div className="bg-slate-50 border border-slate-100 p-6 sm:p-8 rounded-none shadow-sm text-left">
                <h3 className="text-xl font-bold text-slate-950 mb-6 border-b border-slate-200 pb-3">
                  Contact Form
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white text-slate-900 border border-slate-200 px-4 py-2.5 outline-none focus:border-[#cca328] text-sm transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white text-slate-900 border border-slate-200 px-4 py-2.5 outline-none focus:border-[#cca328] text-sm transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Your Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white text-slate-900 border border-slate-200 px-4 py-2.5 outline-none focus:border-[#cca328] text-sm transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</label>
                    <textarea
                      rows="4"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white text-slate-900 border border-slate-200 px-4 py-2.5 outline-none focus:border-[#cca328] text-sm transition-colors resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#cca328] hover:bg-[#d4af37] disabled:bg-[#cca328]/60 text-white font-bold py-3 transition-colors uppercase text-xs tracking-widest mt-2 cursor-pointer shadow-md"
                  >
                    {submitting ? "Sending..." : "Submit Inquiry"}
                  </button>
                </form>
              </div>

              {/* Social Links Card */}
              <div className="bg-slate-50 border border-slate-100 p-6 sm:p-8 rounded-none shadow-sm text-left">
                <h3 className="text-xl font-bold text-slate-950 mb-6 border-b border-slate-200 pb-3">
                  Social Links
                </h3>
                <div className="flex items-center gap-4 text-slate-600">
                  <a
                    href="https://www.facebook.com/HassanAcssociates"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 border border-slate-200 flex items-center justify-center rounded-none hover:text-[#cca328] hover:border-[#cca328] transition-all"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href="https://www.instagram.com/hassanassociates/profilecard/?igsh=MThtb29zZHIzM2s5aA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 border border-slate-200 flex items-center justify-center rounded-none hover:text-[#cca328] hover:border-[#cca328] transition-all"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href="https://youtube.com/@hassanassoc?si=ReKWpkP8P4q3XLQi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 border border-slate-200 flex items-center justify-center rounded-none hover:text-[#cca328] hover:border-[#cca328] transition-all"
                  >
                    <YoutubeIcon />
                  </a>
                  <a
                    href="https://www.tiktok.com/@userwzgkkprjqh?is_from_webapp=1&sender_device=pc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 border border-slate-200 flex items-center justify-center rounded-none hover:text-[#cca328] hover:border-[#cca328] transition-all"
                  >
                    <TiktokIcon />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 focus:outline-none"
            onClick={() => setSelectedImage(null)}
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Image Container */}
          <div 
            className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-lg shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="Zoomed view" 
              className="w-full h-auto object-contain max-h-[85vh] animate-in zoom-in-95 duration-200" 
            />
          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  )
}
