import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Sparkles, Building2, Users, Layers, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function SubscriptionPage() {
  const [company, setCompany] = useState(null)
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [compRes, plansRes] = await Promise.all([
        axios.get(`${API_URL}/companies/current`, authHeaders),
        axios.get(`${API_URL}/super-admin/plans`, authHeaders)
      ])
      setCompany(compRes.data)
      setPlans(plansRes.data)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load subscription details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 font-medium text-slate-600">Loading Billing & Plan Details...</span>
      </div>
    )
  }

  const usage = company?.usage || {}
  const propPercent = Math.min(100, Math.round(((usage.propertiesCount || 0) / (usage.maxProperties || 1)) * 100))
  const staffPercent = Math.min(100, Math.round(((usage.staffCount || 0) / (usage.maxStaff || 1)) * 100))

  return (
    <div className="space-y-8 p-2 md:p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Subscription & Billing</h1>
          <Badge className="bg-emerald-600 text-white">Active Subscription</Badge>
        </div>
        <p className="text-sm text-slate-500 mt-1">Manage your agency's EstateCloud plan, view resource usage, and upgrade tiers.</p>
      </div>

      {/* Current Plan Overview Card */}
      <Card className="border-l-4 border-l-primary shadow-sm bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Current Active Plan</span>
              </div>
              <h2 className="text-3xl font-extrabold">{company?.plan?.name || "Pro Plan"}</h2>
              <p className="text-sm text-slate-300">
                {company?.plan?.description || "High performance real estate management suite for growing agencies."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <div>
                <div className="text-3xl font-black">${company?.plan?.priceMonthly || 99}<span className="text-sm font-normal text-slate-300">/mo</span></div>
                <div className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> Subscription Status: <strong className="text-white capitalize">{company?.subscriptionStatus || "Active"}</strong>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Meter Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Properties Usage */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> Properties Limit Usage
              </CardTitle>
              <span className="text-sm font-bold text-slate-900">
                {usage.propertiesCount || 0} / {usage.maxProperties || 10}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${propPercent >= 90 ? 'bg-rose-500' : 'bg-primary'}`} 
                style={{ width: `${propPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {usage.propertiesCount || 0} properties added out of {usage.maxProperties || 10} allowed on your current plan.
            </p>
          </CardContent>
        </Card>

        {/* Staff Members Usage */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" /> Staff & Agents Usage
              </CardTitle>
              <span className="text-sm font-bold text-slate-900">
                {usage.staffCount || 0} / {usage.maxStaff || 3}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${staffPercent >= 90 ? 'bg-rose-500' : 'bg-emerald-600'}`} 
                style={{ width: `${staffPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {usage.staffCount || 0} active team members out of {usage.maxStaff || 3} allowed on your current plan.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Plans Grid */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-xl font-bold text-slate-900">Available Upgrade Tiers</h3>
          <p className="text-sm text-slate-500">Upgrade your plan to unlock more properties, team members, & features.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = company?.plan?.id === plan.id || company?.plan?.slug === plan.slug
            return (
              <Card key={plan.id} className={`flex flex-col justify-between border ${isCurrent ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    {isCurrent && <Badge className="bg-primary text-white">Current Plan</Badge>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-slate-900">${plan.priceMonthly}</span>
                    <span className="text-slate-500"> / month</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-2 text-sm text-slate-700 border-t pt-3">
                    <div className="flex justify-between py-1 border-b">
                      <span>Max Properties:</span>
                      <span className="font-semibold">{plan.maxProperties}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span>Max Staff Members:</span>
                      <span className="font-semibold">{plan.maxStaff}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Key Features:</h5>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {Array.isArray(plan.features) && plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Button 
                      disabled={isCurrent} 
                      className={`w-full ${isCurrent ? 'bg-slate-200 text-slate-700' : ''}`}
                      onClick={() => toast.info(`To upgrade to ${plan.name}, please contact sales or superadmin support.`)}
                    >
                      {isCurrent ? "Active Plan" : `Upgrade to ${plan.name}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
