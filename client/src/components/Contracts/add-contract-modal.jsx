import { useState, useEffect, useRef } from "react"
import api from "@/lib/api"
import { format } from "date-fns"
import { 
  IconChevronRight, 
  IconChevronLeft, 
  IconCheck, 
  IconCalendar, 
  IconUpload,
  IconLoader2
} from "@tabler/icons-react"
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
  SelectLabel,
  SelectEmpty,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { PaymentInput } from "@/components/ui/payment-input";
import { SearchableSelect } from "@/components/ui/searchable-select"

const STEPS = [
  { id: 1, title: "Agreement Basics" },
  { id: 2, title: "Timeline & Terms" },
  { id: 3, title: "Financial Terms" },
  { id: 4, title: "Attachments" },
]

export function AddContractModal({ open, onOpenChange, onSuccess, initialData }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState([])
  const [units, setUnits] = useState([])
  const [customers, setCustomers] = useState([])
  const [fetchingData, setFetchingData] = useState(false)
  const [fetchingUnits, setFetchingUnits] = useState(false)
  const [fetchingCustomers, setFetchingCustomers] = useState(false)
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    property: "",
    unit: "",
    contractType: "Rental Agreement",
    clientName: "",
    status: "Draft",
    startDate: null,
    endDate: null,
    notes: "",
    rentAmount: "",
    billingCycle: "Monthly",
    securityDeposit: "",
    lateFee: "",
    attachmentUrl: null
  })

  useEffect(() => {
    if (open) {
      fetchProperties()
      fetchCustomers()
      setCurrentStep(1)
      if (initialData) {
        setFormData({
          property: initialData.property?._id || initialData.property || "",
          unit: initialData.unit?._id || initialData.unit || "",
          contractType: initialData.contractType || "Rental Agreement",
          clientName: initialData.clientName || "",
          status: initialData.status || "Draft",
          startDate: initialData.startDate ? new Date(initialData.startDate) : null,
          endDate: initialData.endDate ? new Date(initialData.endDate) : null,
          notes: initialData.notes || "",
          rentAmount: initialData.rentAmount || "",
          billingCycle: initialData.billingCycle || "Monthly",
          securityDeposit: initialData.securityDeposit || "",
          lateFee: initialData.lateFee || "",
          attachmentUrl: initialData.attachmentUrl || initialData.attachment || null
        })
        if (initialData.property?._id || initialData.property) {
          fetchUnits(initialData.property?._id || initialData.property)
        }
      } else {
        setFormData({
          property: "",
          unit: "",
          contractType: "Rental Agreement",
          clientName: "",
          status: "Draft",
          startDate: null,
          endDate: null,
          notes: "",
          rentAmount: "",
          billingCycle: "Monthly",
          securityDeposit: "",
          lateFee: "",
          attachmentUrl: null
        })
      }
    }
  }, [open, initialData])

  useEffect(() => {
    if (formData.property && !initialData) {
      fetchUnits(formData.property)
    }
  }, [formData.property, initialData])

  const fetchProperties = async () => {
    try {
      setFetchingData(true)
      const response = await api.get('/properties')
      setProperties(response.data)
    } catch (error) {
      toast.error("Failed to load properties")
    } finally {
      setFetchingData(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      setFetchingCustomers(true)
      const response = await api.get('/users?role=Customer')
      const data = Array.isArray(response.data) ? response.data : (response.data.users || [])
      setCustomers(data.filter(u => u.role?.toLowerCase() === 'customer'))
    } catch (error) {
      toast.error("Failed to load customers")
    } finally {
      setFetchingCustomers(false)
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

  const handleNext = () => {
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        attachmentUrl: reader.result
      }))
      toast.success("File uploaded successfully!")
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const handleSubmit = async () => {
    if (!formData.property || !formData.clientName || !formData.startDate || !formData.rentAmount) {
      toast.error("Please fill in all required fields marked with *")
      return
    }


    try {
      setLoading(true)
      if (initialData) {
        await api.patch(`/contracts/${initialData._id}`, formData)
        toast.success("Contract updated successfully!")
      } else {
        await api.post('/contracts', formData)
        toast.success("Contract created successfully!")
      }
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{STEPS[currentStep - 1].title}</DialogTitle>
          <DialogDescription>Fill in the details to generate a new agreement.</DialogDescription>
          
          <div className="flex items-center justify-between w-full mt-4">
            {STEPS.map((step) => (
              <div key={step.id} className={cn("flex items-center", step.id < STEPS.length ? "flex-1" : "flex-none")}>
                <div 
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                    currentStep >= step.id ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-input"
                  )}
                >
                  {currentStep > step.id ? <IconCheck className="h-3 w-3" /> : step.id}
                </div>
                {step.id < STEPS.length && (
                  <div className={cn("h-[1px] flex-1 mx-2", currentStep > step.id ? "bg-primary" : "bg-input")} />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {currentStep === 1 && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="property">Select Property <span className="text-destructive">*</span></Label>
                <Select onValueChange={(val) => setFormData({...formData, property: val})} value={formData.property}>
                  <SelectTrigger id="property" className="w-full">
                    <SelectValue placeholder={fetchingData ? "Loading..." : "Choose a property"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {fetchingData ? (
                        <SelectEmpty>Loading properties...</SelectEmpty>
                      ) : properties.length === 0 ? (
                        <SelectEmpty>No properties found</SelectEmpty>
                      ) : (
                        properties.map(p => (
                          <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Select Unit</Label>
                <Select onValueChange={(val) => setFormData({...formData, unit: val})} value={formData.unit} disabled={!formData.property || fetchingUnits}>
                  <SelectTrigger id="unit" className="w-full">
                    <SelectValue placeholder={
                      fetchingUnits 
                        ? "Loading units..." 
                        : (formData.property && units.length === 0) 
                          ? "No units available" 
                          : "Choose a unit"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {fetchingUnits ? (
                        <SelectEmpty>Fetching units...</SelectEmpty>
                      ) : units.length === 0 ? (
                        <SelectEmpty>No units found for this property</SelectEmpty>
                      ) : (
                        units.map(u => (
                          <SelectItem key={u._id} value={u._id}>Unit {u.unitNumber}</SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contractType">Contract Type</Label>
                <Select onValueChange={(val) => setFormData({...formData, contractType: val})} value={formData.contractType}>
                  <SelectTrigger id="contractType" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Rental Agreement">Rental Agreement</SelectItem>
                      <SelectItem value="Lease Agreement">Lease Agreement</SelectItem>
                      <SelectItem value="Sales Contract">Sales Contract</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clientName">Client Name <span className="text-destructive">*</span></Label>
                <SearchableSelect
                  value={formData.clientName}
                  onValueChange={(val) => setFormData({...formData, clientName: val})}
                  items={customers.map((c) => ({
                    _id: c.name,
                    name: c.name + (c.uniqueId ? ` — ${c.uniqueId}` : "")
                  }))}
                  placeholder={fetchingCustomers ? "Loading customers..." : "Select Client"}
                  searchPlaceholder="Search client..."
                  className="w-full"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Initial Status</Label>
                <Select onValueChange={(val) => setFormData({...formData, status: val})} value={formData.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active (Sign Now)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Start Date <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <IconCalendar className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => setFormData({...formData, startDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <IconCalendar className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => setFormData({...formData, endDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes"
                  placeholder="Enter any special terms..." 
                  className="w-full min-h-[100px]"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rentAmount">
                  {formData.contractType === "Sales Contract" ? "Sale Price" : formData.contractType === "Lease Agreement" ? "Lease Amount" : "Rent Amount"} <span className="text-destructive">*</span>
                </Label>
                <PaymentInput id="rentAmount"
                  type="number"
                  placeholder="0.00" 
                  className="w-full"
                  value={formData.rentAmount}
                  onChange={(e) => setFormData({...formData, rentAmount: e.target.value})}
                />
              </div>

              {formData.contractType !== "Sales Contract" && (
                <div className="grid gap-2">
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
                  <Select onValueChange={(val) => setFormData({...formData, billingCycle: val})} value={formData.billingCycle}>
                    <SelectTrigger id="billingCycle" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="securityDeposit">
                  {formData.contractType === "Sales Contract" ? "Down Payment" : "Security Deposit"}
                </Label>
                <PaymentInput id="securityDeposit"
                  type="number"
                  placeholder="0.00" 
                  className="w-full"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({...formData, securityDeposit: e.target.value})}
                />
              </div>

              {formData.contractType !== "Sales Contract" && (
                <div className="grid gap-2">
                  <Label htmlFor="lateFee">Late Fee (Penalty)</Label>
                  <PaymentInput id="lateFee"
                    type="number"
                    placeholder="0.00" 
                    className="w-full"
                    value={formData.lateFee}
                    onChange={(e) => setFormData({...formData, lateFee: e.target.value})}
                  />
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col items-center justify-center py-10 border border-dashed rounded-md bg-muted/50 relative w-full">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx,image/*"
                onChange={handleFileChange}
              />
              {formData.attachmentUrl ? (
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                    <IconCheck className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-center text-primary">Contract Document Selected</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Ready to save</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={triggerFileInput} type="button">
                      Change File
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setFormData(prev => ({ ...prev, attachmentUrl: null }))} type="button">
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <IconUpload className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium text-center">Upload Contract Document</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOC, DOCX or Images (Max 5MB)</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={triggerFileInput} type="button">
                    Choose File
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
          >
            <IconChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {currentStep === STEPS.length ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Contract
            </Button>
          ) : (
            <Button
              onClick={handleNext}
            >
              Next
              <IconChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
