import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { toast } from "sonner"
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  BarChart3, 
  Layers, 
  CheckCircle2, 
  Mail, 
  Lock, 
  Clock, 
  ChevronRight,
  Globe
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleNotifySubmit = (e) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.")
      return
    }
    setSubmitted(true)
    toast.success("Thank you! You're on the EstateCloud early access launch list.")
  }

  return (
    <>
      <Helmet>
        <title>EstateCloud - Smart Real Estate SaaS | Coming Soon</title>
        <meta name="description" content="EstateCloud is coming soon. The all-in-one multi-tenant real estate and property management SaaS platform for agencies, property managers, and owners." />
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-primary selection:text-white relative overflow-hidden font-sans">
        
        {/* Glowing Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Navbar */}
        <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                E
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                EstateCloud
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium">
                  Log In
                </Button>
              </Link>
              <Link to="/register-company">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all">
                  Register Agency
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero & Coming Soon Section */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex-1 flex flex-col justify-center items-center text-center">
          
          {/* Launch Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md text-blue-400 font-semibold text-xs md:text-sm tracking-wide mb-8 animate-pulse">
            <Clock className="h-4 w-4 text-blue-400" />
            <span>EXCITING ANNOUNCEMENT</span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            <span className="text-white">NEXT-GEN PROPERTY SAAS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
            EstateCloud is <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">Coming Soon</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            We are building the ultimate multi-tenant Real Estate & Property Management SaaS platform. Streamline agency operations, properties, unit bookings, tenant contracts, staff payroll, and automated financial accounting in one powerful cloud portal.
          </p>

          {/* Early Access / Notify Me Form */}
          <div className="mt-10 w-full max-w-md">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-2xl p-2 sm:p-3">
              {submitted ? (
                <div className="p-4 text-center space-y-2">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">You're on the VIP list!</h4>
                  <p className="text-xs text-slate-400">We will send you an exclusive early access invitation as soon as we launch.</p>
                </div>
              ) : (
                <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input 
                      required 
                      type="email" 
                      placeholder="Enter your work email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 pl-10 h-11 focus-visible:ring-blue-500"
                    />
                  </div>
                  <Button type="submit" className="h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 shadow-md shadow-blue-600/30 whitespace-nowrap gap-2">
                    Notify Me <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </Card>
            <p className="text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-400" /> No spam. Unsubscribe anytime.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
            <Card className="bg-slate-900/50 border-slate-800/80 backdrop-blur-lg hover:border-blue-500/40 transition-all hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                  <Building2 className="h-5 w-5" />
                </div>
                <CardTitle className="text-base text-white font-bold">Multi-Tenant Agencies</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400 text-xs leading-relaxed">
                  Isolated workspace per agency with custom domain, branding, staff roles, and property portfolios.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800/80 backdrop-blur-lg hover:border-indigo-500/40 transition-all hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
                  <Layers className="h-5 w-5" />
                </div>
                <CardTitle className="text-base text-white font-bold">Units & Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400 text-xs leading-relaxed">
                  Seamlessly manage unit inventory, rental contracts, automated lease renewals, and security deposits.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800/80 backdrop-blur-lg hover:border-sky-500/40 transition-all hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-2">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <CardTitle className="text-base text-white font-bold">Financial Accounting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400 text-xs leading-relaxed">
                  Real-time rent collection tracking, expense logging, staff payroll, and profit & loss analytics.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800/80 backdrop-blur-lg hover:border-emerald-500/40 transition-all hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <CardTitle className="text-base text-white font-bold">Enterprise Cloud</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400 text-xs leading-relaxed">
                  PostgreSQL database isolation, encrypted JWT security, 99.9% uptime SLA, and automated daily backups.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Quick Agency Portal Banner */}
          <div className="mt-16 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/40 border border-blue-500/20 rounded-2xl p-6 sm:p-8 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl text-left">
            <div>
              <h3 className="text-xl font-bold text-white">Are you a Real Estate Agency Owner?</h3>
              <p className="text-xs text-slate-300 mt-1">Register your agency today to claim early bird subscription discounts.</p>
            </div>
            <Link to="/register-company">
              <Button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 h-11 whitespace-nowrap gap-2">
                Register Agency <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-white font-bold text-xs">E</div>
              <span className="font-semibold text-slate-300">EstateCloud SaaS Platform</span>
            </div>
            <div>
              © 2026 EstateCloud. All rights reserved. Built with precision for property managers.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
