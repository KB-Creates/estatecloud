import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { MapPin, Phone, Menu, ChevronDown, Loader2, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/context/AuthContext"
import logoDark from "@/assets/Hassan Associates Logo.png"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import api from "@/lib/api"

export default function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  // State for Get Quotes modal
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [quoteData, setQuoteData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    message: ""
  })
  const [quoteLoading, setQuoteLoading] = useState(false)

  const handleQuoteChange = (e) => {
    const { name, value } = e.target
    setQuoteData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleQuoteSubmit = async (e) => {
    e.preventDefault()
    setQuoteLoading(true)

    try {
      const payload = {
        ...quoteData,
        message: `Quote Request: ${quoteData.message}`
      }
      const response = await api.post("/inquiries/public", payload)
      if (response.status === 201) {
        toast.success("Quote request submitted successfully! Our team will contact you shortly.")
        setQuoteData({
          firstName: "",
          lastName: "",
          email: "",
          contact: "",
          message: ""
        })
        setIsQuoteOpen(false)
      }
    } catch (error) {
      console.error("Error submitting quote request:", error)
      toast.error(error.response?.data?.message || "Failed to submit quote request. Please try again.")
    } finally {
      setQuoteLoading(false)
    }
  }

  // Custom states for custom dropdowns
  const [activeDropdown, setActiveDropdown] = useState(null) // 'services' | 'societies' | null

  const services = [
    "Construction & Development",
    "Real Estate Consultant",
    "Buying & Selling",
    "Contractor",
  ]

  const getServiceLink = (serviceName) => {
    if (serviceName === "Construction & Development") {
      return "/services/construction-development"
    }
    if (serviceName === "Real Estate Consultant") {
      return "/services/real-estate-consultant"
    }
    if (serviceName === "Buying & Selling") {
      return "/services/buying-selling"
    }
    if (serviceName === "Contractor") {
      return "/services/contractor"
    }
    return "#"
  }

  const getSocietyLink = (societyName) => {
    if (societyName === "Park View City") {
      return "/societies/park-view-city"
    }
    if (societyName === "Bahria Town") {
      return "/societies/bahria-town"
    }
    if (societyName === "Al Noor Orchard") {
      return "/societies/al-noor-orchard"
    }
    if (societyName === "DHA Lahore") {
      return "/societies/dha-lahore"
    }
    if (societyName === "Lahore Meadows City") {
      return "/societies/lahore-meadows-city"
    }
    return "#"
  }

  const societies = [
    "Park View City",
    "Bahria Town",
    "Al Noor Orchard",
    "DHA Lahore",
    "Lahore Meadows City",
    "Blue World Shenzhen City",
    "Deluxe Home",
    "Lahore Smart City",
  ]

  // Custom SVGs for Social Media Icons
  const FacebookIcon = () => (
    <svg className="h-4 w-4 fill-current transition-colors hover:text-[#d4af37]" viewBox="0 0 24 24">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
    </svg>
  )

  const InstagramIcon = () => (
    <svg className="h-4 w-4 fill-none stroke-current stroke-2 transition-colors hover:text-[#d4af37]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  )

  const YoutubeIcon = () => (
    <svg className="h-4 w-4 fill-current transition-colors hover:text-[#d4af37]" viewBox="0 0 24 24">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.522 3.5 12 3.5 12 3.5s-7.522 0-9.388.556a3.003 3.003 0 0 0-2.11 2.107C0 8.029 0 12 0 12s0 3.971.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.478 20.5 12 20.5 12 20.5s7.522 0 9.388-.556a3.003 3.003 0 0 0 2.11-2.107C24 15.971 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )

  const TiktokIcon = () => (
    <svg className="h-4 w-4 fill-current transition-colors hover:text-[#d4af37]" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.43-.43-.63-.67-.07 2.24-.06 4.48-.07 6.71-.05 2.29-.64 4.65-2.26 6.27-1.72 1.76-4.32 2.45-6.73 2.1-2.67-.35-5.11-2.29-5.91-4.88-.93-2.93-.15-6.43 2.05-8.62 1.5-1.53 3.66-2.34 5.82-2.3v4.01c-1.28-.04-2.62.4-3.5 1.34-.96 1-.95 2.7-.02 3.73.91 1.05 2.52 1.25 3.69.52.75-.45 1.13-1.32 1.13-2.19.02-3.82.01-7.65.01-11.48z" />
    </svg>
  )

  return (
    <header className="w-full bg-[#0a192f] text-white">
      {/* 1. Top Bar */}
      <div className="hidden sm:block border-b border-white/10 px-4 py-2 sm:px-6 lg:px-8 bg-[#071224] text-white/90">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs md:flex-row">
          {/* Address & Phone */}

          <div className="flex flex-col items-center gap-4 sm:flex-row md:items-start">
            <a href="www.google.com/maps/search/?api=1&query=39+Tulip+Block,+Main+Commercial+Zone,+Park+View+City,+Lahore,+Pakistan">
              <span className="flex items-center gap-1.5 text-center sm:text-left">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#d4af37]" />
                39 Tulip block, Main commercial zone Park View City Lahore, Lahore, Pakistan
              </span>
            </a>

            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0 text-[#d4af37]" />
              +92 300 4803710
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-white/70">
            <a href="https://www.facebook.com/HassanAcssociates" className="hover:text-[#d4af37] transition-colors"><FacebookIcon /></a>
            <a href="https://www.instagram.com/hassanassociates/profilecard/?igsh=MThtb29zZHIzM2s5aA==" className="hover:text-[#d4af37] transition-colors"><InstagramIcon /></a>
            <a href="https://youtube.com/@hassanassoc?si=ReKWpkP8P4q3XLQi" className="hover:text-[#d4af37] transition-colors"><YoutubeIcon /></a>
            <a href="https://www.tiktok.com/@userwzgkkprjqh?is_from_webapp=1&sender_device=pc" className="hover:text-[#d4af37] transition-colors"><TiktokIcon /></a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoDark}
              alt="Hassan Associates Logo"
              className="h-16 md:h-21 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className={cn(
              "text-sm font-semibold tracking-wide transition-colors",
              location.pathname === "/"
                ? "text-[#d4af37] border-b border-[#d4af37] pb-0.5"
                : "text-white hover:text-[#d4af37]"
            )}>
              Home
            </Link>

            {/* Custom Services Dropdown (Hover controlled) */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown("services")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={cn(
                "flex items-center gap-1 text-sm font-semibold tracking-wide outline-none cursor-pointer transition-colors",
                location.pathname.startsWith("/services")
                  ? "text-[#d4af37] border-b border-[#d4af37] pb-0.5"
                  : "text-white hover:text-[#d4af37]"
              )}>
                Services
                <ChevronDown className="h-4 w-4 text-[#d4af37]" />
              </button>

              {activeDropdown === "services" && (
                <div className="absolute left-0 top-full z-50 w-56 bg-[#0a192f] border border-white/10 text-white shadow-2xl py-1 rounded-none animate-in fade-in slide-in-from-top-1.5 duration-200">
                  {services.map((item) => {
                    const link = getServiceLink(item);
                    return link.startsWith("/") ? (
                      <Link
                        key={item}
                        to={link}
                        className="block px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-[#d4af37]/15 hover:text-[#d4af37] transition-all rounded-none"
                      >
                        {item}
                      </Link>
                    ) : (
                      <a
                        key={item}
                        href={link}
                        className="block px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-[#d4af37]/15 hover:text-[#d4af37] transition-all rounded-none"
                      >
                        {item}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Custom Societies Dropdown (Hover controlled) */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown("societies")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={cn(
                "flex items-center gap-1 text-sm font-semibold tracking-wide outline-none cursor-pointer transition-colors",
                location.pathname.startsWith("/societies")
                  ? "text-[#d4af37] border-b border-[#d4af37] pb-0.5"
                  : "text-white hover:text-[#d4af37]"
              )}>
                Societies
                <ChevronDown className="h-4 w-4 text-[#d4af37]" />
              </button>

              {activeDropdown === "societies" && (
                <div className="absolute left-0 top-full z-50 w-56 bg-[#0a192f] border border-white/10 text-white shadow-2xl py-1 rounded-none animate-in fade-in slide-in-from-top-1.5 duration-200">
                  {societies.map((item) => {
                    const link = getSocietyLink(item);
                    return link.startsWith("/") ? (
                      <Link
                        key={item}
                        to={link}
                        className="block px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-[#d4af37]/15 hover:text-[#d4af37] transition-all rounded-none"
                      >
                        {item}
                      </Link>
                    ) : (
                      <a
                        key={item}
                        href={link}
                        className="block px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-[#d4af37]/15 hover:text-[#d4af37] transition-all rounded-none"
                      >
                        {item}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <Link to="/about" className={cn(
              "text-sm font-semibold tracking-wide transition-colors",
              location.pathname === "/about"
                ? "text-[#d4af37] border-b border-[#d4af37] pb-0.5"
                : "text-white hover:text-[#d4af37]"
            )}>
              About
            </Link>
            <Link to="/contact" className={cn(
              "text-sm font-semibold tracking-wide transition-colors",
              location.pathname === "/contact"
                ? "text-[#d4af37] border-b border-[#d4af37] pb-0.5"
                : "text-white hover:text-[#d4af37]"
            )}>
              Contact
            </Link>
          </nav>

          {/* Desktop Right Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="text-sm font-semibold tracking-wide text-[#d4af37] transition-colors hover:text-white bg-[#d4af37]/10 border border-[#d4af37]/20 px-4 py-2.5 uppercase text-xs tracking-wider">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-semibold tracking-wide text-white transition-colors hover:text-[#d4af37] border border-white/20 px-4 py-2.5 uppercase text-xs tracking-wider">
                Login
              </Link>
            )}
            <button 
              onClick={() => setIsQuoteOpen(true)}
              className="bg-[#cca328] hover:bg-[#d4af37] text-white font-bold px-6 py-2.5 transition-colors border border-transparent shadow-lg text-sm uppercase tracking-wider cursor-pointer"
            >
              Get Quotes
            </button>
          </div>

          {/* Mobile Menu Icon (Drawer Trigger) */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-lg" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80 p-6 flex flex-col border-l border-white/10 bg-[#0a192f] text-white">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <img
                      src={logoDark}
                      alt="Hassan Associates Logo"
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col gap-6 py-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                  <Link to="/" className="text-base font-semibold tracking-wide hover:text-[#d4af37]" onClick={() => setMobileMenuOpen(false)}>
                    Home
                  </Link>

                  {/* Services List */}
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold tracking-wider uppercase text-white/55">Services</span>
                    <div className="pl-4 flex flex-col gap-3 border-l border-white/10">
                      {services.map((item) => {
                        const link = getServiceLink(item);
                        return link.startsWith("/") ? (
                          <Link key={item} to={link} className="text-sm hover:text-[#d4af37]" onClick={() => setMobileMenuOpen(false)}>
                            {item}
                          </Link>
                        ) : (
                          <a key={item} href={link} className="text-sm hover:text-[#d4af37]" onClick={() => setMobileMenuOpen(false)}>
                            {item}
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Societies List */}
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold tracking-wider uppercase text-white/55">Societies</span>
                    <div className="pl-4 flex flex-col gap-3 border-l border-white/10">
                      {societies.map((item) => {
                        const link = getSocietyLink(item);
                        return link.startsWith("/") ? (
                          <Link key={item} to={link} className="text-sm hover:text-[#d4af37]" onClick={() => setMobileMenuOpen(false)}>
                            {item}
                          </Link>
                        ) : (
                          <a key={item} href={link} className="text-sm hover:text-[#d4af37]" onClick={() => setMobileMenuOpen(false)}>
                            {item}
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  <Link to="/about" className="text-base font-semibold tracking-wide hover:text-[#d4af37]" onClick={() => setMobileMenuOpen(false)}>
                    About
                  </Link>
                  <Link to="/contact" className="text-base font-semibold tracking-wide hover:text-[#d4af37]" onClick={() => setMobileMenuOpen(false)}>
                    Contact
                  </Link>
                  {user ? (
                    <Link to="/dashboard" className="w-full text-center bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                  ) : (
                    <Link to="/login" className="w-full text-center border border-white/20 text-white py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors hover:text-[#d4af37]" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                  )}
                </div>

                {/* Mobile Footer Area */}
                <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setTimeout(() => setIsQuoteOpen(true), 200);
                    }}
                    className="w-full bg-[#cca328] hover:bg-[#d4af37] text-white font-bold py-3 uppercase tracking-wider text-center text-sm transition-colors cursor-pointer"
                  >
                    Get Quotes
                  </button>
                  <div className="flex items-center justify-center gap-6 pt-2 text-white/70">
                    <a href="#" className="hover:text-[#d4af37]"><FacebookIcon /></a>
                    <a href="#" className="hover:text-[#d4af37]"><InstagramIcon /></a>
                    <a href="#" className="hover:text-[#d4af37]"><YoutubeIcon /></a>
                    <a href="#" className="hover:text-[#d4af37]"><TiktokIcon /></a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Quote Request Dialog Modal */}
      <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
        <DialogContent className="sm:max-w-md bg-[#0a192f] border border-white/10 text-white rounded-none p-6">
          <DialogHeader className="text-left gap-1">
            <DialogTitle className="text-xl font-bold font-sans text-white uppercase tracking-wider">Get a Quote</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs sm:text-sm">
              Fill out this form and our experts will get back to you with a custom quote shortly.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuoteSubmit} className="space-y-4 mt-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="quote-firstName" className="text-white text-xs font-bold uppercase tracking-wider">First Name *</Label>
                <Input
                  id="quote-firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={quoteData.firstName}
                  onChange={handleQuoteChange}
                  required
                  className="bg-slate-950 border-white/10 text-white rounded-none h-10 focus-visible:ring-[#cca328] focus-visible:border-[#cca328] w-full"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="quote-lastName" className="text-white text-xs font-bold uppercase tracking-wider">Last Name</Label>
                <Input
                  id="quote-lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={quoteData.lastName}
                  onChange={handleQuoteChange}
                  className="bg-slate-950 border-white/10 text-white rounded-none h-10 focus-visible:ring-[#cca328] focus-visible:border-[#cca328] w-full"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="quote-email" className="text-white text-xs font-bold uppercase tracking-wider">Email Address *</Label>
              <Input
                id="quote-email"
                name="email"
                type="email"
                placeholder="Email"
                value={quoteData.email}
                onChange={handleQuoteChange}
                required
                className="bg-slate-950 border-white/10 text-white rounded-none h-10 focus-visible:ring-[#cca328] focus-visible:border-[#cca328] w-full"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="quote-contact" className="text-white text-xs font-bold uppercase tracking-wider">Contact Number *</Label>
              <Input
                id="quote-contact"
                name="contact"
                placeholder="Phone / WhatsApp"
                value={quoteData.contact}
                onChange={handleQuoteChange}
                required
                className="bg-slate-950 border-white/10 text-white rounded-none h-10 focus-visible:ring-[#cca328] focus-visible:border-[#cca328] w-full"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="quote-message" className="text-white text-xs font-bold uppercase tracking-wider">Requirement Details</Label>
              <Textarea
                id="quote-message"
                name="message"
                placeholder="Describe what services or property details you need a quote for..."
                rows={3}
                value={quoteData.message}
                onChange={handleQuoteChange}
                className="bg-slate-950 border-white/10 text-white rounded-none focus-visible:ring-[#cca328] focus-visible:border-[#cca328] w-full"
              />
            </div>
            <Button
              type="submit"
              disabled={quoteLoading}
              className="w-full bg-[#cca328] hover:bg-[#d4af37] text-white font-bold h-11 rounded-none uppercase text-xs tracking-wider transition-colors shadow-lg cursor-pointer"
            >
              {quoteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Submit Request <Send className="ml-2 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  )
}
