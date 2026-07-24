import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"

export function AddAgentModal({ open, onOpenChange, onSuccess, initialData }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    commissionType: "Percentage",
    commissionValue: "",
    experience: "",
    status: "Active",
    specialization: "",
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          email: initialData.email || "",
          password: "", // Leave blank for security
          phone: initialData.phone || "",
          commissionType: initialData.commissionType || "Percentage",
          commissionValue: initialData.commissionValue || "",
          experience: initialData.experience || "",
          status: initialData.status || "Active",
          specialization: Array.isArray(initialData.specialization) 
            ? initialData.specialization.join(", ") 
            : initialData.specialization || "",
        })
      } else {
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          commissionType: "Percentage",
          commissionValue: "",
          experience: "",
          status: "Active",
          specialization: "",
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
    setLoading(true)

    try {
      if (initialData) {
        // Edit mode
        const dataToSubmit = { ...formData }
        if (!dataToSubmit.password) delete dataToSubmit.password // Don't send empty password

        await api.patch(`/agents/${initialData._id}`, dataToSubmit)
        toast.success("Agent updated successfully!")
      } else {
        // Add mode
        await api.post('/agents', formData)
        toast.success("Agent added successfully!")
      }
      
      if (onSuccess) onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-3">
            <DialogTitle>{initialData ? "Edit Agent Profile" : "Add New Agent"}</DialogTitle>
            <DialogDescription>
              {initialData ? "Update professional and contact details for this agent." : "Enter professional and contact details for the new agent."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Full Name*</Label>
                <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Agent's full name" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email address*</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="agent@example.com" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="password">Login Password {initialData && "(Leave blank to keep current)"}</Label>
                <Input id="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Set login password" required={!initialData} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 234 567 890" />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-4 text-primary">Professional Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label>Commission Type</Label>
                  <Select onValueChange={(val) => handleSelectChange("commissionType", val)} value={formData.commissionType}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Fixed">Fixed Amount</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="commissionValue">Commission Value</Label>
                  <Input id="commissionValue" type="number" value={formData.commissionValue} onChange={handleInputChange} placeholder="0" />
                </div>
              </div>
              <div className="grid mt-4 grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input id="experience" type="number" value={formData.experience} onChange={handleInputChange} placeholder="0" />
                </div>
                <div className="grid gap-3">
                  <Label>Account Status</Label>
                  <Select onValueChange={(val) => handleSelectChange("status", val)} value={formData.status}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
              <div className="grid gap-3">
                <Label htmlFor="specialization">Specialization (comma separated)</Label>
                <Textarea id="specialization" value={formData.specialization} onChange={handleInputChange} placeholder="Residential, Commercial, Luxury" />
              </div>
          </div>

          <DialogFooter className="flex flex-col-reverse mt-2 sm:flex-col-reverse gap-2">
            <Button
              variant="outline"
              type="button"
              className="w-full rounded-full text-base font-semibold"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full rounded-full text-base font-semibold"
              disabled={loading}
            >
              {loading ? <IconLoader2 className="mr-2 size-4 animate-spin" /> : null}
              {loading ? (initialData ? "Updating..." : "Creating Account...") : (initialData ? "Save Changes" : "Create Agent Account")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
