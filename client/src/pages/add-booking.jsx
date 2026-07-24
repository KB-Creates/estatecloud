import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSettings } from "@/context/SettingsContext"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PaymentInput } from "@/components/ui/payment-input"
import { toast } from "sonner"
import { IconLoader2, IconUser, IconBuilding, IconCurrencyDollar, IconChevronLeft } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SearchableSelect } from "@/components/ui/searchable-select"

export default function AddBookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCurrencySymbol } = useSettings()
  const currency = getCurrencySymbol()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [properties, setProperties] = useState([])
  const [units, setUnits] = useState([])
  const [fetchingUnits, setFetchingUnits] = useState(false)
  const [contacts, setContacts] = useState([])

  const initialFormState = {
    customerName: "",
    email: "",
    phone: "",
    property: "",
    unit: "",
    lead: "",
    agent: "",
    status: "Pending Request",
    totalPrice: "",
    tokenAmount: "",
    advancePayment: "",
    notes: "",
  }

  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchProperties(), fetchContacts()])
      if (id) {
        await fetchBookingDetails()
      }
    }
    init()
  }, [id])

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties')
      setProperties(response.data)
    } catch (error) {
      toast.error("Failed to load properties")
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await api.get('/users?role=Customer')
      const usersDataRaw = Array.isArray(response.data) ? response.data : (response.data.users || [])
      const customersData = usersDataRaw.filter(u => u.role?.toLowerCase() === 'customer').map(c => ({
        _id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        type: 'Customer'
      }))
      setContacts(customersData)
    } catch (error) {
      console.error("Failed to load contacts")
    }
  }

  const fetchBookingDetails = async () => {
    try {
      setFetching(true)
      const response = await api.get(`/bookings/${id}`)
      const b = response.data
      
      if (b.property?._id || b.property) {
        await fetchUnits(b.property?._id || b.property)
      }

      setFormData({
        ...b,
        property: b.property?._id || b.property || "",
        unit: b.unit?._id || b.unit || "",
        totalPrice: b.totalPrice || "",
        tokenAmount: b.tokenAmount || "",
        advancePayment: b.advancePayment || "",
      })
    } catch (error) {
      toast.error("Failed to load booking details")
    } finally {
      setFetching(false)
    }
  }

  const fetchUnits = async (propertyId) => {
    try {
      setFetchingUnits(true)
      const response = await api.get(`/units/property/${propertyId}`)
      // Temporarily removed status filter to debug if units exist
      setUnits(response.data)
    } catch (error) {
      toast.error("Failed to load units")
    } finally {
      setFetchingUnits(false)
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id, value) => {
    if (id === "property") {
      setFormData((prev) => ({ ...prev, property: value, unit: "" }))
      fetchUnits(value)
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.property || !formData.lead || !formData.customerName || !formData.phone || !formData.totalPrice) {
      toast.error("Please fill in all required fields, including selecting a Contact")
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        totalPrice: Number(formData.totalPrice) || 0,
        tokenAmount: Number(formData.tokenAmount) || 0,
        advancePayment: Number(formData.advancePayment) || 0,
        remainingAmount: Math.max(0, (Number(formData.totalPrice) || 0) - (Number(formData.tokenAmount) || 0) - (Number(formData.advancePayment) || 0))
      }

      if (id) {
        await api.patch(`/bookings/${id}`, payload)
        toast.success("Booking updated successfully!")
      } else {
        await api.post('/bookings', payload)
        toast.success("Booking created successfully!")
      }
      navigate('/bookings')
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

  const agents = ["Ahmad Khan", "Sarah Ali", "M. Saleem", "Zoya Sheikh"]

  const totalPrice = Number(formData.totalPrice) || 0
  const token = Number(formData.tokenAmount) || 0
  const advance = Number(formData.advancePayment) || 0
  const remaining = Math.max(0, totalPrice - token - advance)

  const selectedProperty = properties.find(p => p._id === formData.property)
  const selectedUnit = units.find(u => u._id === formData.unit)

  return (
    <div className="container mx-auto max-w-5xl py-6 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <IconChevronLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">{id ? "Edit Booking" : "Create New Booking"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-6 items-start">
        
        {/* LEFT COLUMN: Form Cards */}
        <div className="flex flex-col gap-6">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconBuilding className="size-5 text-primary" /> Property Details
              </CardTitle>
              <CardDescription>Select the property and unit for the booking.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Target Property*</Label>
                <Select onValueChange={(val) => handleSelectChange("property", val)} value={formData.property || undefined} required>
                  <SelectTrigger className="w-full bg-muted/50">
                    <SelectValue placeholder="Select Property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {properties.map((prop) => (
                        <SelectItem key={prop._id} value={prop._id}>{prop.title}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Unit (Optional)</Label>
                <Select onValueChange={(val) => handleSelectChange("unit", val)} value={formData.unit || undefined} disabled={!formData.property || fetchingUnits}>
                  <SelectTrigger className="w-full bg-muted/50">
                    <SelectValue placeholder={fetchingUnits ? "Loading..." : "Select Unit"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {units.map((unit) => (
                        <SelectItem key={unit._id} value={unit._id}>Unit {unit.unitNumber} ({unit.block})</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconUser className="size-5 text-primary" /> Customer Information
              </CardTitle>
              <CardDescription>Enter contact details or select from existing contacts.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label>Select Customer*</Label>
                <SearchableSelect 
                  value={formData.lead}
                  onValueChange={(val) => {
                    const selected = contacts.find(i => i._id === val)
                    if (selected) {
                      setFormData(prev => ({
                        ...prev,
                        lead: val,
                        customerName: selected.name,
                        email: selected.email || "",
                        phone: selected.phone || prev.phone
                      }))
                    }
                  }}
                  items={contacts}
                  placeholder="Choose a customer..."
                  searchPlaceholder="Type to search..."
                  className="w-full border-dashed"
                />
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Customer Full Name*</Label>
                  <Input id="customerName" placeholder="e.g. John Doe" value={formData.customerName} onChange={handleInputChange} required className="w-full bg-muted/50" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} className="w-full bg-muted/50" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Phone Number*</Label>
                    <Input id="phone" placeholder="+92 300 0000000" value={formData.phone} onChange={handleInputChange} required className="w-full bg-muted/50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconCurrencyDollar className="size-5 text-primary" /> Financial Details
              </CardTitle>
              <CardDescription>Enter the agreed price and payment breakdown.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2 sm:col-span-2">
                <Label>Total Price*</Label>
                <PaymentInput id="totalPrice" min="0" placeholder="0" value={formData.totalPrice} onChange={handleInputChange} required className="w-full bg-muted/50 font-semibold" />
              </div>
              <div className="grid gap-2">
                <Label>Token Amount</Label>
                <PaymentInput id="tokenAmount" min="0" placeholder="0" value={formData.tokenAmount} onChange={handleInputChange} className="w-full bg-muted/50" />
              </div>
              <div className="grid gap-2">
                <Label>Advance Payment</Label>
                <PaymentInput id="advancePayment" min="0" placeholder="0" value={formData.advancePayment} onChange={handleInputChange} className="w-full bg-muted/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Assign Agent</Label>
                <SearchableSelect
                  value={formData.agent}
                  onValueChange={(val) => handleSelectChange("agent", val)}
                  items={agents.map(a => ({ _id: a, name: a }))}
                  placeholder="Select Agent"
                  searchPlaceholder="Search agent..."
                  className="w-full bg-muted/50"
                />
              </div>
              <div className="grid gap-2">
                <Label>Booking Status</Label>
                <Select onValueChange={(val) => handleSelectChange("status", val)} value={formData.status}>
                  <SelectTrigger className="w-full bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Pending Request">Pending Request</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label>Internal Notes</Label>
                <Textarea id="notes" placeholder="Any special requests or details..." value={formData.notes} onChange={handleInputChange} className="min-h-[80px] w-full bg-muted/50" />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* RIGHT COLUMN: Summary Card (Sticky) */}
        <div className="sticky top-6 flex flex-col gap-4">
          <Card className="border-primary/20 shadow-md">
            <CardHeader className="pb-4 border-b bg-muted/20">
              <CardTitle className="text-lg">Booking Summary</CardTitle>
              <CardDescription>Live preview of this booking</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold">Property</p>
                <p className="font-semibold text-sm">{selectedProperty ? selectedProperty.title : "Not selected"}</p>
                {selectedUnit && (
                  <p className="text-xs text-muted-foreground font-medium">Unit {selectedUnit.unitNumber} • {selectedUnit.block} Block</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold">Customer</p>
                <p className="font-semibold text-sm truncate">{formData.customerName || "Not provided"}</p>
                <p className="text-xs text-muted-foreground">{formData.phone || "No phone"}</p>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Total Price</span>
                  <span className="font-bold">{currency}{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Token Amount</span>
                  <span>- {currency}{token.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Advance</span>
                  <span>- {currency}{advance.toLocaleString()}</span>
                </div>
                
                <div className="pt-3 border-t mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">Remaining</span>
                    <span className="font-bold text-lg text-primary">{currency}{remaining.toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} size="lg" className="w-full font-bold shadow-md">
            {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
            {loading ? "Saving..." : (id ? "Update Booking" : "Confirm Booking")}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/bookings')} className="w-full text-muted-foreground">
            Cancel
          </Button>
        </div>

      </form>
    </div>
  )
}
