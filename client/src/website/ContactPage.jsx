import React, { useState } from "react"
import { Helmet } from "react-helmet-async"
import Header from "./Header"
import Footer from "./Footer"
import { MapPin, Mail, Phone, Send, Loader2, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import api from "@/lib/api"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post("/inquiries/public", formData)
      if (response.status === 201) {
        toast.success("Thank you! Your message has been sent successfully. We will get back to you shortly.")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          contact: "",
          message: ""
        })
      }
    } catch (error) {
      console.error("Error submitting contact form:", error)
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <Helmet>
        <title>Contact Us | Hassan Associates</title>
        <meta name="description" content="Get in touch with Hassan Associates. Contact us for bookings, queries, property consultations, and real estate services in Lahore, Pakistan." />
        <meta name="keywords" content="contact hassan associates, property dealer lahore, real estate advisor lahore, hassan associates contact number, hassan associates email" />
      </Helmet>

      {/* Global Header */}
      <Header />

      {/* Banner Section */}
      <section className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] bg-slate-950 overflow-hidden">
        {/* Responsive Desktop Banner */}
        <div
          className="hidden md:block w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/contact-Us-2-scaled.jpg')" }}
        />
        {/* Responsive Mobile Banner */}
        <div
          className="block md:hidden w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/contact-us-mobile.jpg')" }}
        />
      </section>

      {/* Google Maps Section */}
      <section className="w-full bg-[#071224] border-b border-white/10">
        <div className="w-full h-[300px] sm:h-[400px]">
          <iframe
            src="https://maps.google.com/maps?q=39%20Tulip%20block%2C%20Main%20commercial%20zone%20Park%20View%20City%20Lahore%2C%20Lahore%2C%20Pakistan&t=m&z=14&output=embed&iwloc=near"
            title="Hassan Associates Office Location Map"
            aria-label="Hassan Associates Office Location Map"
            className="w-full h-full border-0 grayscale opacity-85 contrast-125"
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* Contact Form and Details Section */}
      <section className="py-20 bg-white text-slate-900 flex-1 flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column - Contact details */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-left">
              <div>
                <span className="text-[#cca328] font-bold text-xs tracking-widest uppercase block mb-1">
                  Stay Tuned
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 font-sans leading-tight">
                  Keep Connected With
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal mt-4">
                  For bookings, queries and information contact us on our WhatsApp or Email Address. You can also connect with us through our live chat option.
                </p>
              </div>

              <hr className="border-slate-200 w-full" />

              <div className="flex flex-col gap-5">
                {/* Location */}
                <a
                  href="https://www.google.com/maps/search/?api=1&query=39+Tulip+Block,+Main+Commercial+Zone,+Park+View+City,+Lahore,+Pakistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-3 hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-[#cca328] bg-[#cca328]/10 p-3 rounded-none border border-[#cca328]/25 group-hover:bg-[#cca328] group-hover:text-white transition-all">
                    <MapPin className="h-6 w-6" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Office Address</span>
                    <span className="text-slate-800 font-medium font-sans text-sm sm:text-base mt-0.5 leading-snug">
                      39 Tulip block, Main commercial zone Park View City Lahore, Lahore, Pakistan
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:hassanassociatesofficial@gmail.com"
                  className="flex items-start gap-4 p-3 hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-[#cca328] bg-[#cca328]/10 p-3 rounded-none border border-[#cca328]/25 group-hover:bg-[#cca328] group-hover:text-white transition-all">
                    <Mail className="h-6 w-6" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</span>
                    <span className="text-slate-800 font-medium font-sans text-sm sm:text-base mt-0.5">
                      hassanassociatesofficial@gmail.com
                    </span>
                  </div>
                </a>

                {/* WhatsApp / Call */}
                <a
                  href="https://wa.me/923004803710"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-3 hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-[#cca328] bg-[#cca328]/10 p-3 rounded-none border border-[#cca328]/25 group-hover:bg-[#cca328] group-hover:text-white transition-all">
                    <Phone className="h-6 w-6" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone & WhatsApp</span>
                    <span className="text-slate-800 font-medium font-sans text-sm sm:text-base mt-0.5">
                      +92 300 4803710
                    </span>
                  </div>
                </a>

                {/* Live Chat Option */}
                <a
                  href="https://wa.me/923004803710?text=Hello%20Hassan%20Associates%2C%20I%20would%20like%20to%20query%20about%20your%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-3 hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-[#cca328] bg-[#cca328]/10 p-3 rounded-none border border-[#cca328]/25 group-hover:bg-[#cca328] group-hover:text-white transition-all">
                    <MessageSquare className="h-6 w-6" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Chat</span>
                    <span className="text-[#cca328] font-bold font-sans text-sm sm:text-base mt-0.5 hover:underline">
                      Connect via Live Chat Option
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-7 w-full">
              <Card className="border-0 shadow-2xl rounded-none bg-slate-50">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div className="space-y-2 text-left">
                        <Label htmlFor="firstName" className="text-slate-700 font-bold uppercase tracking-wider text-xs">First Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="bg-white border-slate-200 text-slate-900 rounded-none h-11 focus-visible:ring-[#cca328] focus-visible:border-[#cca328] w-full"
                        />
                      </div>
                      
                      {/* Last Name */}
                      <div className="space-y-2 text-left">
                        <Label htmlFor="lastName" className="text-slate-700 font-bold uppercase tracking-wider text-xs">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="bg-white border-slate-200 text-slate-900 rounded-none h-11 focus-visible:ring-[#cca328] focus-visible:border-[#cca328] w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Email */}
                      <div className="space-y-2 text-left">
                        <Label htmlFor="email" className="text-slate-700 font-bold uppercase tracking-wider text-xs">Email Address <span className="text-red-500">*</span></Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-white border-slate-200 text-slate-900 rounded-none h-11 focus-visible:ring-[#cca328] focus-visible:border-[#cca328] w-full"
                        />
                      </div>

                      {/* Contact */}
                      <div className="space-y-2 text-left">
                        <Label htmlFor="contact" className="text-slate-700 font-bold uppercase tracking-wider text-xs">Contact <span className="text-red-500">*</span></Label>
                        <Input
                          id="contact"
                          name="contact"
                          placeholder="Contact"
                          value={formData.contact}
                          onChange={handleChange}
                          required
                          className="bg-white border-slate-200 text-slate-900 rounded-none h-11 focus-visible:ring-[#cca328] focus-visible:border-[#cca328] w-full"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2 text-left">
                      <Label htmlFor="message" className="text-slate-700 font-bold uppercase tracking-wider text-xs">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="bg-white border-slate-200 text-slate-900 rounded-none focus-visible:ring-[#cca328] focus-visible:border-[#cca328] w-full"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#cca328] hover:bg-[#d4af37] text-white font-bold h-12 rounded-none transition-colors uppercase text-sm tracking-wider shadow-lg cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          Send Message <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}
