import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, ChevronDown, Loader2, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import g1Logo from "/g1.svg"
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

  const services = [
    "Construction & Development",
    "Real Estate Consultant",
    "Buying & Selling",
    "Contractor",
  ]

  const getServiceLink = (serviceName) => {
    if (serviceName === "Construction & Development") return "/services/construction-development"
    if (serviceName === "Real Estate Consultant") return "/services/real-estate-consultant"
    if (serviceName === "Buying & Selling") return "/services/buying-selling"
    if (serviceName === "Contractor") return "/services/contractor"
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

  const getSocietyLink = (societyName) => {
    if (societyName === "Park View City") return "/societies/park-view-city"
    if (societyName === "Bahria Town") return "/societies/bahria-town"
    if (societyName === "Al Noor Orchard") return "/societies/al-noor-orchard"
    if (societyName === "DHA Lahore") return "/societies/dha-lahore"
    if (societyName === "Lahore Meadows City") return "/societies/lahore-meadows-city"
    return "#"
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full bg-transparent border-b border-slate-200/40">
      <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={g1Logo}
            alt="EstateCloud Logo"
            className="h-5 sm:h-6 w-auto object-contain"
          />
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-[#029474] flex items-center gap-1 py-1",
              location.pathname === "/" ? "text-[#029474] font-semibold" : "text-slate-700"
            )}
          >
            Home
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Link>

          <Link
            to="/about"
            className={cn(
              "text-sm font-medium transition-colors hover:text-[#029474] py-1",
              location.pathname === "/about" ? "text-[#029474] font-semibold" : "text-slate-700"
            )}
          >
            About Us
          </Link>

          {/* Services Dropdown via Shadcn */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 text-sm font-medium outline-none cursor-pointer transition-colors hover:text-[#029474] py-1",
                  location.pathname.startsWith("/services") ? "text-[#029474] font-semibold" : "text-slate-700"
                )}
              >
                Services
                <ChevronDown className="h-4 w-4 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-1.5 bg-white border border-slate-200 shadow-lg rounded-xl animate-in fade-in-80 duration-150">
              {services.map((item) => {
                const link = getServiceLink(item);
                return (
                  <DropdownMenuItem key={item} asChild className="rounded-lg cursor-pointer text-slate-700 focus:bg-[#029474]/10 focus:text-[#029474]">
                    <Link to={link} className="w-full px-3 py-2 text-sm font-medium">
                      {item}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Societies Dropdown via Shadcn */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 text-sm font-medium outline-none cursor-pointer transition-colors hover:text-[#029474] py-1",
                  location.pathname.startsWith("/societies") ? "text-[#029474] font-semibold" : "text-slate-700"
                )}
              >
                Societies
                <ChevronDown className="h-4 w-4 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-1.5 bg-white border border-slate-200 shadow-lg rounded-xl animate-in fade-in-80 duration-150 max-h-80 overflow-y-auto">
              {societies.map((item) => {
                const link = getSocietyLink(item);
                return (
                  <DropdownMenuItem key={item} asChild className="rounded-lg cursor-pointer text-slate-700 focus:bg-[#029474]/10 focus:text-[#029474]">
                    <Link to={link} className="w-full px-3 py-2 text-sm font-medium">
                      {item}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/contact"
            className={cn(
              "text-sm font-medium transition-colors hover:text-[#029474] py-1",
              location.pathname === "/contact" ? "text-[#029474] font-semibold" : "text-slate-700"
            )}
          >
            Contact
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center gap-5">
          {user ? (
            <Button asChild variant="ghost" className="text-slate-700 hover:text-[#029474] font-medium">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" className="text-slate-700 hover:text-[#029474] font-medium">
              <Link to="/login">Log In</Link>
            </Button>
          )}

          <Button
            onClick={() => setIsQuoteOpen(true)}
            className="rounded-xl bg-[#029474] hover:bg-[#027a60] text-white font-semibold px-6 py-2.5 h-10 text-sm shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
          >
            Sign Up (Free)
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-100">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-6 flex flex-col bg-white text-slate-900">
              <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

              {/* Mobile Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <img src={g1Logo} alt="EstateCloud Logo" className="h-10 w-auto object-contain" />
                </Link>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-5 py-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                <Link to="/" className="text-base font-medium text-slate-800 hover:text-[#029474]" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/about" className="text-base font-medium text-slate-800 hover:text-[#029474]" onClick={() => setMobileMenuOpen(false)}>
                  About Us
                </Link>

                {/* Services Accordion List */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Services</span>
                  <div className="pl-3 flex flex-col gap-2 border-l-2 border-[#029474]/20">
                    {services.map((item) => (
                      <Link key={item} to={getServiceLink(item)} className="text-sm text-slate-600 hover:text-[#029474]" onClick={() => setMobileMenuOpen(false)}>
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Societies Accordion List */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Societies</span>
                  <div className="pl-3 flex flex-col gap-2 border-l-2 border-[#029474]/20">
                    {societies.map((item) => (
                      <Link key={item} to={getSocietyLink(item)} className="text-sm text-slate-600 hover:text-[#029474]" onClick={() => setMobileMenuOpen(false)}>
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link to="/contact" className="text-base font-medium text-slate-800 hover:text-[#029474]" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </div>

              {/* Mobile Footer Buttons */}
              <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3">
                {user ? (
                  <Button asChild variant="outline" className="w-full justify-center">
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full justify-center">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setTimeout(() => setIsQuoteOpen(true), 200)
                  }}
                  className="w-full bg-[#029474] hover:bg-[#027a60] text-white font-semibold rounded-xl"
                >
                  Sign Up (Free)
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Quote Request Dialog Modal */}
      <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
        <DialogContent className="sm:max-w-md bg-white text-slate-900 border border-slate-200 rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="text-left gap-1">
            <DialogTitle className="text-xl font-bold text-slate-900">Get a Quote / Sign Up</DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Fill out this form and our team will get back to you with a custom quote shortly.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuoteSubmit} className="space-y-4 mt-2 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="quote-firstName" className="text-slate-700 text-xs font-semibold">First Name *</Label>
                <Input
                  id="quote-firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={quoteData.firstName}
                  onChange={handleQuoteChange}
                  required
                  className="w-full rounded-lg border-slate-200 focus-visible:ring-[#029474]"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quote-lastName" className="text-slate-700 text-xs font-semibold">Last Name</Label>
                <Input
                  id="quote-lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={quoteData.lastName}
                  onChange={handleQuoteChange}
                  className="w-full rounded-lg border-slate-200 focus-visible:ring-[#029474]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quote-email" className="text-slate-700 text-xs font-semibold">Email Address *</Label>
              <Input
                id="quote-email"
                name="email"
                type="email"
                placeholder="Email"
                value={quoteData.email}
                onChange={handleQuoteChange}
                required
                className="w-full rounded-lg border-slate-200 focus-visible:ring-[#029474]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quote-contact" className="text-slate-700 text-xs font-semibold">Contact Number *</Label>
              <Input
                id="quote-contact"
                name="contact"
                placeholder="Phone / WhatsApp"
                value={quoteData.contact}
                onChange={handleQuoteChange}
                required
                className="w-full rounded-lg border-slate-200 focus-visible:ring-[#029474]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quote-message" className="text-slate-700 text-xs font-semibold">Requirement Details</Label>
              <Textarea
                id="quote-message"
                name="message"
                placeholder="Describe what services or property details you need..."
                rows={3}
                value={quoteData.message}
                onChange={handleQuoteChange}
                className="w-full rounded-lg border-slate-200 focus-visible:ring-[#029474] resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={quoteLoading}
              className="w-full bg-[#029474] hover:bg-[#027a60] text-white font-semibold h-11 rounded-xl shadow-md transition-all cursor-pointer"
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
