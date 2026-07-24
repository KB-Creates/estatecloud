import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"
import { useSettings } from "@/context/SettingsContext"

const statusColors = {
  New: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Contacted: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Qualified: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Lost: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  Converted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
}

export function AddLeadModal({ open, onOpenChange, onSuccess, initialData }) {
  const [loading, setLoading] = useState(false)
  const { getCurrencySymbol } = useSettings()

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date - tzOffset).toISOString().slice(0, 16);
  }

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    propertyType: "Apartment",
    purpose: "Personal Use",
    budget: "",
    city: "",
    priority: "Medium",
    status: "New",
    remarks: "",
    nextFollowUp: "",
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          phone: initialData.phone || "",
          propertyType: initialData.propertyType || "Apartment",
          purpose: initialData.purpose || "Personal Use",
          budget: initialData.budget || "",
          city: initialData.city || "",
          priority: initialData.priority || "Medium",
          status: initialData.status || "New",
          remarks: initialData.remarks || "",
          nextFollowUp: formatDateTimeLocal(initialData.nextFollowUp),
        })
      } else {
        setFormData({
          name: "",
          phone: "",
          propertyType: "Apartment",
          purpose: "Personal Use",
          budget: "",
          city: "",
          priority: "Medium",
          status: "New",
          remarks: "",
          nextFollowUp: "",
        })
      }
    }
  }, [open, initialData])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.phone) {
      toast.error("Please fill in all required details (Name & Phone)")
      return
    }

    setLoading(true)

    try {
      const submissionData = {
        name: formData.name,
        phone: formData.phone,
        propertyType: formData.propertyType || undefined,
        purpose: formData.purpose || undefined,
        budget: formData.budget || undefined,
        city: formData.city || undefined,
        priority: formData.priority,
        status: formData.status,
        remarks: formData.remarks || undefined,
        nextFollowUp: formData.nextFollowUp || undefined,
      }

      if (initialData) {
        await api.patch(`/inquiries/${initialData._id}`, submissionData)
        toast.success("Lead updated successfully!")
      } else {
        await api.post('/inquiries', submissionData)
        toast.success("Lead added successfully!")
      }

      if (onSuccess) onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-3">
            <DialogTitle>{initialData ? "Edit Lead" : "Add New Lead"}</DialogTitle>
            <DialogDescription>
              Record customer requirements, budget, and contact information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Client Name <span className="text-destructive">*</span></Label>
              <Input id="name" value={formData.name} onChange={handleInputChange} className="w-full" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="phone">Client Phone <span className="text-destructive">*</span></Label>
                <Input id="phone" value={formData.phone} onChange={handleInputChange} className="w-full" required />
              </div>
              <div className="grid gap-3">
                <Label>Property Type</Label>
                <Select onValueChange={(val) => handleSelectChange("propertyType", val)} value={formData.propertyType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Plot">Plot</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="budget">Budget ({getCurrencySymbol()})</Label>
                <Input id="budget" value={formData.budget} onChange={handleInputChange} className="w-full" placeholder={`e.g. 50,000 or 200k`} />
              </div>
              <div className="grid gap-3">
                <Label>Status</Label>
                <Select onValueChange={(val) => handleSelectChange("status", val)} value={formData.status}>
                  <SelectTrigger className={cn("w-full transition-colors font-semibold", statusColors[formData.status || "New"])}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Qualified">Qualified</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                      <SelectItem value="Converted">Converted</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label>Purpose of Purchase</Label>
                <Select onValueChange={(val) => handleSelectChange("purpose", val)} value={formData.purpose}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Personal Use">Personal Use</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Rental Income">Rental Income</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label>Priority</Label>
                <Select onValueChange={(val) => handleSelectChange("priority", val)} value={formData.priority}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="city">City</Label>
              <Textarea
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full min-h-[80px]"
                placeholder="Enter client's city or area details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="remarks">Remarks / Notes</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="w-full min-h-[80px]"
                  placeholder="Enter remarks/notes..."
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="nextFollowUp">Next Follow-up Date & Time</Label>
                <Input
                  id="nextFollowUp"
                  type="datetime-local"
                  value={formData.nextFollowUp}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse mt-2 sm:flex-col-reverse">
            <Button
              type="submit"
              className="w-full rounded-full text-base font-semibold"
              disabled={loading}
            >
              {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              {loading ? "Saving..." : (initialData ? "Update Lead" : "Save Lead")}
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full rounded-full text-base font-semibold"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
