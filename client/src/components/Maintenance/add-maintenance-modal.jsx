import React, { useState, useEffect } from "react"
import { useSettings } from "@/context/SettingsContext"
import api from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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
import { toast } from "sonner"
import { IconLoader2, IconCalendar, IconTool, IconAlertTriangle, IconClock, IconSearch, IconMail, IconPhone, IconShare } from "@tabler/icons-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { PaymentInput } from "@/components/ui/payment-input";

export function AddMaintenanceModal({ open, onOpenChange, onSuccess }) {
  const { getCurrencySymbol } = useSettings()
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState([])
  const [units, setUnits] = useState([])
  const [fetchingUnits, setFetchingUnits] = useState(false)

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
    if (open) {
      fetchProperties()
    } else {
        setFormData({
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
    }
  }, [open])

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties')
      setProperties(response.data)
    } catch (error) {
      toast.error("Failed to load properties")
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
      await api.post('/maintenance', formData)
      toast.success("Maintenance request created successfully!")
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                    <IconTool className="size-5 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-bold tracking-tight">New Maintenance Request</DialogTitle>
            </div>
            <DialogDescription>
              Create a new maintenance or repair task for a property unit.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-semibold">Property*</Label>
                <Select 
                  onValueChange={(val) => handleSelectChange("property", val)} 
                  value={formData.property}
                  required
                >
                  <SelectTrigger>
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
                <Label className="text-sm font-semibold">Unit*</Label>
                <Select 
                  onValueChange={(val) => handleSelectChange("unit", val)} 
                  value={formData.unit}
                  disabled={!formData.property || fetchingUnits}
                  required
                >
                  <SelectTrigger>
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
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 grid gap-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/70 px-1">Requester Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label className="text-sm font-semibold">Requested By*</Label>
                        <Input 
                            id="requestedBy" 
                            placeholder="Full Name"
                            value={formData.requestedBy} 
                            onChange={handleInputChange} 
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-sm font-semibold">Source</Label>
                        <Select 
                            onValueChange={(val) => handleSelectChange("source", val)} 
                            value={formData.source}
                        >
                            <SelectTrigger>
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
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label className="text-sm font-semibold">Email Address*</Label>
                        <div className="relative">
                            <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input 
                                id="email" 
                                type="email"
                                className="pl-9"
                                placeholder="email@example.com"
                                value={formData.email} 
                                onChange={handleInputChange} 
                                required
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-sm font-semibold">Phone Number*</Label>
                        <div className="relative">
                            <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input 
                                id="phone" 
                                className="pl-9"
                                placeholder="+92 300 0000000"
                                value={formData.phone} 
                                onChange={handleInputChange} 
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-2">
                <Label className="text-sm font-semibold">Issue Title / Summary*</Label>
                <Input 
                    id="title" 
                    placeholder="Brief description of the problem"
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label className="text-sm font-semibold">Maintenance Type</Label>
                    <Select 
                        onValueChange={(val) => handleSelectChange("type", val)} 
                        value={formData.type}
                    >
                        <SelectTrigger>
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
                    <Label className="text-sm font-semibold">Priority</Label>
                    <Select 
                        onValueChange={(val) => handleSelectChange("priority", val)} 
                        value={formData.priority}
                    >
                        <SelectTrigger>
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
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Detailed Description</Label>
              <Textarea 
                id="description" 
                placeholder="Provide more details..."
                value={formData.description} 
                onChange={handleInputChange} 
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label className="text-sm font-semibold">Scheduled Date</Label>
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
                    <Label className="text-sm font-semibold">Est. Cost ({getCurrencySymbol()})</Label>
                    <PaymentInput id="estimatedCost" 
                        type="number" 
                        value={formData.estimatedCost} 
                        onChange={handleInputChange} 
                    />
                </div>
                <div className="grid gap-2">
                    <Label className="text-sm font-semibold">Status</Label>
                    <Select 
                        onValueChange={(val) => handleSelectChange("status", val)} 
                        value={formData.status}
                    >
                        <SelectTrigger>
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
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button 
                type="button" 
                variant="outline" 
                className="flex-1 rounded-full h-11"
                onClick={() => onOpenChange(false)}
            >
                Cancel
            </Button>
            <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 rounded-full h-11"
            >
              {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              {loading ? "Creating..." : "Save Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
