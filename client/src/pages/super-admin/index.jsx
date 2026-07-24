import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Search, 
  Layers,
  Sparkles,
  RefreshCw,
  MoreVertical,
  Plus
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function SuperAdminPage() {
  const [stats, setStats] = useState(null)
  const [companies, setCompanies] = useState([])
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Edit / Plan change state
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [newPlanId, setNewPlanId] = useState("")
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)

  // Plan creation state
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false)
  const [planForm, setPlanForm] = useState({
    name: "",
    slug: "",
    description: "",
    priceMonthly: "",
    priceYearly: "",
    maxProperties: "",
    maxStaff: "",
    maxUnits: "",
    featuresText: "",
    isPopular: false
  })

  const token = localStorage.getItem("token")
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, companiesRes, plansRes] = await Promise.all([
        axios.get(`${API_URL}/super-admin/stats`, authHeaders),
        axios.get(`${API_URL}/super-admin/companies`, authHeaders),
        axios.get(`${API_URL}/super-admin/plans`, authHeaders)
      ])
      setStats(statsRes.data)
      setCompanies(companiesRes.data)
      setPlans(plansRes.data)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load super admin data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleToggleStatus = async (companyId, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active"
    try {
      await axios.patch(`${API_URL}/super-admin/companies/${companyId}/status`, { status: nextStatus }, authHeaders)
      toast.success(`Company status updated to ${nextStatus}`)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status")
    }
  }

  const handleChangePlan = async () => {
    if (!selectedCompany || !newPlanId) return
    try {
      await axios.patch(`${API_URL}/super-admin/companies/${selectedCompany.id}/plan`, { planId: newPlanId }, authHeaders)
      toast.success("Subscription plan updated successfully")
      setIsPlanModalOpen(false)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update plan")
    }
  }

  const handleCreatePlan = async (e) => {
    e.preventDefault()
    try {
      const features = planForm.featuresText.split("\n").filter(f => f.trim().length > 0)
      await axios.post(`${API_URL}/super-admin/plans`, { ...planForm, features }, authHeaders)
      toast.success("New Subscription Plan created!")
      setIsCreatePlanOpen(false)
      setPlanForm({
        name: "",
        slug: "",
        description: "",
        priceMonthly: "",
        priceYearly: "",
        maxProperties: "",
        maxStaff: "",
        maxUnits: "",
        featuresText: "",
        isPopular: false
      })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create plan")
    }
  }

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 font-medium text-slate-600">Loading SaaS Admin Portal...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">EstateCloud SaaS Platform Admin</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Super Admin</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">Manage tenant companies, SaaS subscription plans, and platform revenue metrics.</p>
        </div>
        <Button onClick={fetchData} variant="outline" className="w-full md:w-auto gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Tenant Agencies</CardTitle>
            <Building2 className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeCompanies || 0} / {stats?.totalCompanies || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Companies registered on EstateCloud</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Estimated MRR</CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.mrr || 0} / mo</div>
            <p className="text-xs text-emerald-600 mt-1">ARR: ${stats?.arr || 0} / year</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Platform Properties</CardTitle>
            <Layers className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProperties || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Properties managed across all tenants</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Users</CardTitle>
            <Users className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Agents, Staff & Property Owners</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="tenants" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="tenants" className="gap-2">
            <Building2 className="h-4 w-4" /> Tenant Companies ({companies.length})
          </TabsTrigger>
          <TabsTrigger value="plans" className="gap-2">
            <Sparkles className="h-4 w-4" /> Subscription Plans ({plans.length})
          </TabsTrigger>
        </TabsList>

        {/* Tenants Tab */}
        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Registered Agencies & Companies</CardTitle>
                  <CardDescription>View, activate, suspend, or upgrade tenant companies.</CardDescription>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search companies or email..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Slug / Email</TableHead>
                      <TableHead>Current Plan</TableHead>
                      <TableHead>Usage (Properties / Users)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                          No tenant companies found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCompanies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-semibold text-slate-900">
                            {company.name}
                          </TableCell>
                          <TableCell className="text-sm text-slate-500">
                            <div>{company.slug}</div>
                            <div className="text-xs text-slate-400">{company.email || "No email"}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-slate-50 border-slate-300 font-medium">
                              {company.plan?.name || "Free"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            <span className="font-medium text-slate-700">{company._count?.properties || 0}</span> / {company.plan?.maxProperties || 10} Props
                            <div className="text-xs text-slate-500">{company._count?.users || 0} users</div>
                          </TableCell>
                          <TableCell>
                            {company.status === "Active" ? (
                              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none">
                                <CheckCircle2 className="h-3 w-3 mr-1 inline" /> Active
                              </Badge>
                            ) : (
                              <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-none">
                                <ShieldAlert className="h-3 w-3 mr-1 inline" /> Suspended
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Tenant Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {
                                  setSelectedCompany(company)
                                  setNewPlanId(company.planId || "")
                                  setIsPlanModalOpen(true)
                                }}>
                                  Change Subscription Plan
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleToggleStatus(company.id, company.status)}
                                  className={company.status === "Active" ? "text-rose-600" : "text-emerald-600"}
                                >
                                  {company.status === "Active" ? "Suspend Company" : "Activate Company"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">EstateCloud SaaS Tier Plans</h3>
              <p className="text-sm text-slate-500">Configure tier limits and pricing for agencies.</p>
            </div>
            <Button onClick={() => setIsCreatePlanOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Create New Plan
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative flex flex-col justify-between border ${plan.isPopular ? 'border-primary ring-2 ring-primary/20 shadow-md' : ''}`}>
                {plan.isPopular && (
                  <Badge className="absolute -top-3 right-4 bg-primary text-white">Most Popular</Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-slate-900">${plan.priceMonthly}</span>
                    <span className="text-slate-500"> / month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between py-1 border-b">
                      <span>Max Properties:</span>
                      <span className="font-semibold">{plan.maxProperties}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span>Max Staff Members:</span>
                      <span className="font-semibold">{plan.maxStaff}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span>Max Units:</span>
                      <span className="font-semibold">{plan.maxUnits}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Features Included:</h5>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {Array.isArray(plan.features) && plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Change Plan Dialog */}
      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Plan for {selectedCompany?.name}</DialogTitle>
            <DialogDescription>
              Select a new SaaS subscription tier for this tenant agency.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Subscription Plan</label>
              <Select value={newPlanId} onValueChange={setNewPlanId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available Plans</SelectLabel>
                    {plans.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} (${p.priceMonthly}/mo - Max {p.maxProperties} props)
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanModalOpen(false)}>Cancel</Button>
            <Button onClick={handleChangePlan}>Update Subscription</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Plan Dialog */}
      <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Subscription Plan</DialogTitle>
            <DialogDescription>Add a new tier plan for EstateCloud agencies.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePlan} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plan Name</label>
                <Input 
                  required 
                  placeholder="e.g. Agency Plus" 
                  value={planForm.name} 
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Price ($)</label>
                <Input 
                  required 
                  type="number" 
                  placeholder="149" 
                  value={planForm.priceMonthly} 
                  onChange={(e) => setPlanForm({ ...planForm, priceMonthly: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">Max Properties</label>
                <Input 
                  required 
                  type="number" 
                  placeholder="250" 
                  value={planForm.maxProperties} 
                  onChange={(e) => setPlanForm({ ...planForm, maxProperties: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Max Staff</label>
                <Input 
                  required 
                  type="number" 
                  placeholder="20" 
                  value={planForm.maxStaff} 
                  onChange={(e) => setPlanForm({ ...planForm, maxStaff: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Max Units</label>
                <Input 
                  required 
                  type="number" 
                  placeholder="1000" 
                  value={planForm.maxUnits} 
                  onChange={(e) => setPlanForm({ ...planForm, maxUnits: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input 
                placeholder="Plan description for marketing" 
                value={planForm.description} 
                onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Features (one per line)</label>
              <textarea 
                rows={3} 
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Unlimited Reports&#10;24/7 Phone Support"
                value={planForm.featuresText}
                onChange={(e) => setPlanForm({ ...planForm, featuresText: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreatePlanOpen(false)}>Cancel</Button>
              <Button type="submit">Save Plan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
