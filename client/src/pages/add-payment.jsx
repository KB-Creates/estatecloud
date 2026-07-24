import React, { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import api from "@/lib/api"
import { useSettings } from "@/context/SettingsContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectEmpty,
} from "@/components/ui/select"
import { toast } from "sonner"
import { IconLoader2, IconCalendar, IconChevronLeft, IconReceipt } from "@tabler/icons-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PaymentInput } from "@/components/ui/payment-input";
import { SearchableSelect } from "@/components/ui/searchable-select"

export default function AddPaymentPage() {
  const { getCurrencySymbol } = useSettings()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [properties, setProperties] = useState([])
  const [units, setUnits] = useState([])
  const [contracts, setContracts] = useState([])
  const [fetchingUnits, setFetchingUnits] = useState(false)
  const [customers, setCustomers] = useState([])
  const [fetchingCustomers, setFetchingCustomers] = useState(false)

  const [formData, setFormData] = useState({
    property: "",
    unit: "",
    contract: "",
    client: "",
    paymentType: "Monthly Rent",
    paymentMethod: "Cash",
    billingMonth: "May",
    billingYear: 2026,
    baseAmount: 0,
    receivedAmount: 0,
    internalNotes: "",
  })

  useEffect(() => {
    const contractId = searchParams.get("contract")

    const init = async () => {
      await Promise.all([fetchProperties(), fetchContracts(), fetchCustomers()])
      if (!id && contractId) {
        await applyContractSelection(contractId)
      }
      if (id) {
        await fetchPaymentDetails()
      }
    }
    init()
  }, [id, searchParams])

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties')
      setProperties(response.data)
    } catch (error) {
      toast.error("Failed to load properties")
    }
  }

  const fetchContracts = async () => {
    try {
      const response = await api.get('/contracts')
      setContracts(response.data.filter(c => c.status === 'Active'))
    } catch (error) {
      console.error("Failed to load contracts", error)
    }
  }

  const fetchCustomers = async () => {
    try {
      setFetchingCustomers(true)
      const response = await api.get('/users?role=Customer')
      const data = Array.isArray(response.data) ? response.data : (response.data.users || [])
      setCustomers(data.filter(u => u.role?.toLowerCase() === 'customer'))
    } catch (error) {
      console.error("Failed to load customers:", error)
      toast.error("Failed to load customers list")
    } finally {
      setFetchingCustomers(false)
    }
  }

  const fetchPaymentDetails = async () => {
    try {
      setFetching(true)
      const response = await api.get(`/payments/${id}`)
      const p = response.data

      if (p.property?._id || p.property) {
        await fetchUnits(p.property?._id || p.property)
      }

      setFormData({
        ...p,
        property: p.property?._id || p.property || "",
        unit: p.unit?._id || p.unit || "",
        contract: p.contract?._id || p.contract || "",
        billingYear: p.billingYear || 2026,
      })
    } catch (error) {
      toast.error("Failed to load payment details")
    } finally {
      setFetching(false)
    }
  }

  const fetchUnits = async (propertyId) => {
    try {
      setFetchingUnits(true)
      const response = await api.get(`/units/property/${propertyId}`)
      setUnits(response.data)
    } catch (error) {
      toast.error("Failed to load units")
    } finally {
      setFetchingUnits(false)
    }
  }

  const applyContractSelection = async (contractId) => {
    const selected = contracts.find(c => c._id === contractId)
    if (!selected) return

    const selectedPropertyId = selected.property?._id || selected.property?.id || selected.propertyId || ""
    const selectedUnitId = selected.unit?._id || selected.unit?.id || selected.unitId || ""

    setFormData(prev => ({
      ...prev,
      contract: selected._id,
      property: selectedPropertyId,
      unit: selectedUnitId,
      client: selected.clientName || prev.client,
      baseAmount: selected.rentAmount || prev.baseAmount,
      receivedAmount: selected.rentAmount || prev.receivedAmount,
    }))

    if (selectedPropertyId) {
      await fetchUnits(selectedPropertyId)
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: id.includes('Amount') || id === 'billingYear' ? Number(value) : value }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (id === "property") {
      setFormData(prev => ({ ...prev, unit: "" }))
      fetchUnits(value)
    }
    if (id === "contract") {
      const selected = contracts.find(c => c._id === value)
      if (selected) {
        const selectedPropertyId = selected.property?._id || selected.property?.id || selected.propertyId || ""
        const selectedUnitId = selected.unit?._id || selected.unit?.id || selected.unitId || ""
        setFormData(prev => ({
          ...prev,
          property: selectedPropertyId || prev.property,
          unit: selectedUnitId || prev.unit,
          client: selected.clientName || prev.client,
          baseAmount: selected.rentAmount || prev.baseAmount,
          receivedAmount: selected.rentAmount || prev.receivedAmount
        }))
        if (selectedPropertyId) fetchUnits(selectedPropertyId)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.property || !formData.client || formData.baseAmount <= 0) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      if (id) {
        await api.patch(`/payments/${id}`, formData)
        toast.success("Payment record updated!")
      } else {
        await api.post('/payments', formData)
        toast.success("Payment recorded successfully!")
      }
      navigate('/payments')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <IconLoader2 className="size-10 animate-spin text-primary" />
      </div>
    )
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const years = [2024, 2025, 2026, 2027, 2028]

  return (
    <div className="container mx-auto max-w-4xl py-6 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <IconChevronLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">{id ? "Edit Payment Record" : "Collect Payment"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">

            <Card>
              <CardHeader>
                <CardTitle>Source of Funds</CardTitle>
                <CardDescription>Link to an existing contract to auto-fill details.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <SearchableSelect
                    value={formData.contract}
                    onValueChange={(val) => handleSelectChange("contract", val)}
                    items={contracts.map((c) => ({
                      _id: c._id,
                      name: `${c.clientName} - Unit ${c.unit?.unitNumber || 'N/A'}`
                    }))}
                    placeholder="Select an active contract..."
                    searchPlaceholder="Search active contract..."
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Attribution</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Property*</Label>
                    <Select onValueChange={(val) => handleSelectChange("property", val)} value={formData.property} required>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select property..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {properties.length === 0 ? (
                            <SelectEmpty>No properties found</SelectEmpty>
                          ) : (
                            properties.map((prop) => (
                              <SelectItem key={prop._id} value={prop._id}>{prop.title}</SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Unit (Optional)</Label>
                    <Select onValueChange={(val) => handleSelectChange("unit", val)} value={formData.unit} disabled={!formData.property}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select unit..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {fetchingUnits ? (
                            <SelectEmpty>Loading units...</SelectEmpty>
                          ) : units.length === 0 ? (
                            <SelectEmpty>No units found for this property</SelectEmpty>
                          ) : (
                            units.map((unit) => (
                              <SelectItem key={unit._id} value={unit._id}>Unit {unit.unitNumber}</SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Client*</Label>
                  <SearchableSelect
                    value={formData.client}
                    onValueChange={(val) => setFormData({...formData, client: val})}
                    items={customers.map((c) => ({
                      _id: c.name,
                      name: c.name + (c.uniqueId ? ` — ${c.uniqueId}` : "")
                    }))}
                    placeholder={fetchingCustomers ? "Loading customers..." : "Select Client"}
                    searchPlaceholder="Search customer..."
                    className="w-full"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Payment Type*</Label>
                    <Select onValueChange={(val) => handleSelectChange("paymentType", val)} value={formData.paymentType}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Monthly Rent">Monthly Rent</SelectItem>
                          <SelectItem value="Security Deposit">Security Deposit</SelectItem>
                          <SelectItem value="Maintenance Fee">Maintenance Fee</SelectItem>
                          <SelectItem value="Late Fee">Late Fee</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Payment Method*</Label>
                    <Select onValueChange={(val) => handleSelectChange("paymentMethod", val)} value={formData.paymentMethod}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                          <SelectItem value="Online">Online</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Billing Month</Label>
                    <Select onValueChange={(val) => handleSelectChange("billingMonth", val)} value={formData.billingMonth}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {months.map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Billing Year</Label>
                    <Select onValueChange={(val) => handleSelectChange("billingYear", val)} value={formData.billingYear.toString()}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {years.map(y => (
                            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  id="internalNotes"
                  placeholder="Add payment verification codes or agent notes..."
                  value={formData.internalNotes}
                  onChange={handleInputChange}
                  className="flex min-h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Collection Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Base Amount*</Label>
                  <PaymentInput id="baseAmount" type="number" value={formData.baseAmount} onChange={handleInputChange} className="w-full" />
                </div>
                <div className="grid gap-2">
                  <Label>Received Amount*</Label>
                  <PaymentInput id="receivedAmount" type="number" value={formData.receivedAmount} onChange={handleInputChange} className="w-full" />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Total to Collect</span>
                  <span className="text-xl font-bold">{getCurrencySymbol()}{(formData.baseAmount - formData.receivedAmount).toLocaleString()}</span>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
                  {loading ? "Processing..." : (id ? "Update Payment" : "Submit Payment")}
                </Button>
              </CardContent>
            </Card>

            <div className="p-4 rounded-lg bg-muted text-xs text-muted-foreground">
              <p className="font-bold mb-1">Invoice Policy</p>
              <p>Submitting this form will generate a unique digital invoice and notify the client.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
