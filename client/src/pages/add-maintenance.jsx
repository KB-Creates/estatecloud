import React, { useState, useEffect } from "react"
import { useSettings } from "@/context/SettingsContext"
import { useParams, useNavigate } from "react-router-dom"
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
  SelectEmpty,
} from "@/components/ui/select"
import { toast } from "sonner"
import { IconLoader2, IconCalendar, IconChevronLeft } from "@tabler/icons-react"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PaymentInput } from "@/components/ui/payment-input";

export default function AddMaintenancePage() {
  const { getCurrencySymbol } = useSettings()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [properties, setProperties] = useState([])
  const [units, setUnits] = useState([])
  const [fetchingUnits, setFetchingUnits] = useState(false)
  const [requesters, setRequesters] = useState([])
  const [fetchingRequesters, setFetchingRequesters] = useState(false)

  const [formData, setFormData] = useState({
    property: "",
    unit: "",
    requestedBy: "",
    email: "",
    phone: "",
    title: "",
    type: "Repair",
    description: "",
    source: "Phone",
    priority: "Medium",
    status: "Pending",
    estimatedCost: 0,
    scheduledDate: undefined,
  })

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchProperties(), fetchRequesters()])
      if (id) {
        await fetchMaintenanceDetails()
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

  const fetchRequesters = async () => {
    try {
      setFetchingRequesters(true)
      const response = await api.get('/users')
      const data = Array.isArray(response.data) ? response.data : (response.data.users || [])
      setRequesters(data)
    } catch (error) {
      console.error("Failed to load users:", error)
      toast.error("Failed to load users list")
    } finally {
      setFetchingRequesters(false)
    }
  }

  const fetchMaintenanceDetails = async () => {
    try {
      setFetching(true)
      const response = await api.get(`/maintenance/${id}`)
      const m = response.data

      if (m.property?._id || m.property) {
        await fetchUnits(m.property?._id || m.property)
      }

      setFormData({
        ...m,
        property: m.property?._id || m.property || "",
        unit: m.unit?._id || m.unit || "",
        scheduledDate: m.scheduledDate ? new Date(m.scheduledDate) : undefined,
      })
    } catch (error) {
      toast.error("Failed to load maintenance details")
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

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (id === "property") {
      setFormData(prev => ({ ...prev, unit: "" }))
      fetchUnits(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.property || !formData.unit || !formData.title || !formData.requestedBy || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      if (id) {
        await api.patch(`/maintenance/${id}`, formData)
        toast.success("Maintenance request updated!")
      } else {
        await api.post('/maintenance', formData)
        toast.success("Maintenance request created successfully!")
      }
      navigate('/maintenance')
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

  return (
    <div className="container mx-auto max-w-4xl py-6 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <IconChevronLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">{id ? "Edit Maintenance Task" : "Log Maintenance Task"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">

            <Card>
              <CardHeader>
                <CardTitle>Issue Location</CardTitle>
                <CardDescription>Select the affected property and unit.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Property*</Label>
                  <Select
                    onValueChange={(val) => handleSelectChange("property", val)}
                    value={formData.property}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Property" />
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
                  <Label>Unit*</Label>
                  <Select
                    onValueChange={(val) => handleSelectChange("unit", val)}
                    value={formData.unit}
                    disabled={!formData.property || fetchingUnits}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={fetchingUnits ? "Loading..." : "Select Unit"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {fetchingUnits ? (
                          <SelectEmpty>Fetching units...</SelectEmpty>
                        ) : units.length === 0 ? (
                          <SelectEmpty>No units found for this property</SelectEmpty>
                        ) : (
                          units.map((unit) => (
                            <SelectItem key={unit._id} value={unit._id}>Unit {unit.unitNumber} ({unit.block})</SelectItem>
                          ))
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requester Information</CardTitle>
                <CardDescription>Details of the person reporting the issue.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Requested By*</Label>
                    <SearchableSelect
                      value={formData.requestedBy}
                      onValueChange={(val) => {
                        const selected = requesters.find(r => r.name === val)
                        if (selected) {
                          setFormData(prev => ({
                            ...prev,
                            requestedBy: selected.name,
                            email: selected.email || "",
                            phone: selected.phone || prev.phone
                          }))
                        } else {
                          setFormData(prev => ({ ...prev, requestedBy: val }))
                        }
                      }}
                      items={requesters.map((r) => ({
                        _id: r.name,
                        name: `${r.name} (${r.role ? r.role.charAt(0).toUpperCase() + r.role.slice(1) : 'User'})${r.uniqueId ? ` — ${r.uniqueId}` : ''}`
                      }))}
                      placeholder={fetchingRequesters ? "Loading users..." : "Tenant or Staff Name"}
                      searchPlaceholder="Search tenant, agent, owner, or staff..."
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Request Source</Label>
                    <Select
                      onValueChange={(val) => handleSelectChange("source", val)}
                      value={formData.source}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Website">Website</SelectItem>
                          <SelectItem value="Phone">Phone</SelectItem>
                          <SelectItem value="Walk-in">Walk-in</SelectItem>
                          <SelectItem value="Social Media">Social Media</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Email Address*</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tenant@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Phone Number*</Label>
                    <Input
                      id="phone"
                      placeholder="+92 300 0000000"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Issue Description</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Issue Title*</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Broken AC Unit, Water Leak"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Detailed Notes</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="min-h-[100px] w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Settings</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Maintenance Type</Label>
                  <Select
                    onValueChange={(val) => handleSelectChange("type", val)}
                    value={formData.type}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Repair">Repair</SelectItem>
                        <SelectItem value="Routine Maintenance">Routine Maintenance</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Inspection">Inspection</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Priority Level</Label>
                  <Select
                    onValueChange={(val) => handleSelectChange("priority", val)}
                    value={formData.priority}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Execution</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Scheduled Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.scheduledDate && "text-muted-foreground"
                        )}
                      >
                        <IconCalendar className="mr-2 h-4 w-4" />
                        {formData.scheduledDate ? format(formData.scheduledDate, "PPP") : <span>Pick date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.scheduledDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, scheduledDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label>Est. Cost ({getCurrencySymbol()})</Label>
                  <PaymentInput id="estimatedCost"
                    type="number"
                    value={formData.estimatedCost}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Current Status</Label>
                  <Select
                    onValueChange={(val) => handleSelectChange("status", val)}
                    value={formData.status}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 mt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
                {loading ? "Saving..." : (id ? "Update Request" : "Save Request")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate('/maintenance')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
