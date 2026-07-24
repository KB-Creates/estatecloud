import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { Building2, User, Mail, Lock, Phone, MapPin, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function RegisterCompanyPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [plans, setPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    companyName: "",
    slug: "",
    phone: "",
    address: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    planSlug: "pro"
  })

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${API_URL}/super-admin/plans`)
        setPlans(res.data)
      } catch (error) {
        // Fallback default plans if superadmin plans fails
        setPlans([
          { slug: "starter", name: "Starter", priceMonthly: 49, maxProperties: 25, maxStaff: 3 },
          { slug: "pro", name: "Pro", priceMonthly: 99, maxProperties: 100, maxStaff: 10, isPopular: true },
          { slug: "enterprise", name: "Enterprise", priceMonthly: 199, maxProperties: 9999, maxStaff: 100 }
        ])
      } finally {
        setLoadingPlans(false)
      }
    }
    fetchPlans()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      if (name === "companyName" && !prev.slugEdited) {
        updated.slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")
      }
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await axios.post(`${API_URL}/companies/register`, formData)
      toast.success("Welcome to EstateCloud! Your Agency account has been created.")
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("user", JSON.stringify(res.data))
        window.location.href = "/dashboard"
      } else {
        navigate("/login")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register company. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-primary font-semibold text-sm mb-2">
          <Sparkles className="h-4 w-4" /> EstateCloud SaaS Platform
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Register Your Real Estate Agency</h2>
        <p className="mt-2 text-sm text-slate-600">Start your 14-day free trial. Manage properties, units, staff, & financials in one place.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <Card className="shadow-lg border-slate-200">
          {/* Stepper Bar */}
          <div className="border-b bg-slate-50/50 px-6 py-4">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span className={`flex items-center gap-1 ${step >= 1 ? 'text-primary' : ''}`}>
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-200'}`}>1</span> Agency Details
              </span>
              <span className="h-0.5 w-12 bg-slate-200" />
              <span className={`flex items-center gap-1 ${step >= 2 ? 'text-primary' : ''}`}>
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-200'}`}>2</span> Admin Account
              </span>
              <span className="h-0.5 w-12 bg-slate-200" />
              <span className={`flex items-center gap-1 ${step >= 3 ? 'text-primary' : ''}`}>
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-primary text-white' : 'bg-slate-200'}`}>3</span> Choose Plan
              </span>
            </div>
          </div>

          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* STEP 1: Agency Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Agency / Company Name *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        required 
                        name="companyName" 
                        placeholder="e.g. Al-Raza Real Estate Group" 
                        value={formData.companyName}
                        onChange={handleChange}
                        className="pl-9 w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Agency Subdomain / Slug</label>
                    <div className="flex items-center gap-2">
                      <Input 
                        name="slug" 
                        placeholder="al-raza-real-estate" 
                        value={formData.slug}
                        onChange={(e) => {
                          setFormData({ ...formData, slug: e.target.value, slugEdited: true })
                        }}
                        className="w-full"
                      />
                      <span className="text-xs text-slate-500 font-mono whitespace-nowrap">.estatecloud.com</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-800">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          name="phone" 
                          placeholder="+92 300 1234567" 
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-9 w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-800">Office Address / City</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          name="address" 
                          placeholder="Gulberg III, Lahore" 
                          value={formData.address}
                          onChange={handleChange}
                          className="pl-9 w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button 
                      type="button" 
                      disabled={!formData.companyName.trim()} 
                      onClick={() => setStep(2)}
                      className="w-full md:w-auto gap-2"
                    >
                      Next: Admin Account <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: Admin Account */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Admin Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        required 
                        name="adminName" 
                        placeholder="Muhammad Mudassir" 
                        value={formData.adminName}
                        onChange={handleChange}
                        className="pl-9 w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Work Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        required 
                        type="email" 
                        name="adminEmail" 
                        placeholder="admin@alrazaestate.com" 
                        value={formData.adminEmail}
                        onChange={handleChange}
                        className="pl-9 w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        required 
                        type="password" 
                        name="adminPassword" 
                        placeholder="••••••••" 
                        value={formData.adminPassword}
                        onChange={handleChange}
                        className="pl-9 w-full"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      disabled={!formData.adminName || !formData.adminEmail || !formData.adminPassword} 
                      onClick={() => setStep(3)}
                      className="gap-2"
                    >
                      Next: Choose Plan <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Plan Selection & Submit */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-900">Select EstateCloud SaaS Subscription</h3>
                    <p className="text-xs text-slate-500">Includes 14 days free trial. No credit card required to start.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <div 
                        key={plan.slug}
                        onClick={() => setFormData({ ...formData, planSlug: plan.slug })}
                        className={`cursor-pointer rounded-lg border p-4 transition-all ${
                          formData.planSlug === plan.slug 
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900">{plan.name}</h4>
                          {plan.isPopular && <Badge className="bg-primary text-white text-[10px]">Popular</Badge>}
                        </div>
                        <div className="text-2xl font-black text-slate-900">${plan.priceMonthly}<span className="text-xs font-normal text-slate-500">/mo</span></div>
                        <div className="mt-3 text-xs text-slate-600 space-y-1">
                          <div>✓ Up to <strong>{plan.maxProperties}</strong> Properties</div>
                          <div>✓ Up to <strong>{plan.maxStaff}</strong> Staff Members</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button type="submit" disabled={submitting} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                      {submitting ? "Registering Agency..." : "Create Agency Account & Launch"} <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-slate-500">
          Already have an EstateCloud account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  )
}
