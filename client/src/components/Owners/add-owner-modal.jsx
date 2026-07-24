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
import { Select, SelectContent, SelectItem, SelectGroup, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"

export function AddOwnerModal({ open, onOpenChange, onSuccess, initialData }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    taxId: "",
    status: "Active",
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          companyName: initialData.companyName || "",
          taxId: initialData.taxId || "",
          status: initialData.status || "Active",
        })
      } else {
        setFormData({
          name: "",
          email: "",
          phone: "",
          companyName: "",
          taxId: "",
          status: "Active",
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
        await api.patch(`/owners/${initialData._id}`, formData)
        toast.success("Owner profile updated!")
      } else {
        await api.post('/owners', formData)
        toast.success("Owner added successfully!")
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
      <DialogContent className="sm:max-w-2xl w-full">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-3">
            <DialogTitle>{initialData ? "Edit Owner Profile" : "Add New Owner"}</DialogTitle>
            <DialogDescription>
              {initialData ? "Update the owner and business information." : "Enter personal and business information for the property owner."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Owner's full name" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email address*</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="owner@example.com" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="phone">Contact Number</Label>
                <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 234 567 890" />
              </div>
              <div className="grid gap-3">
                <Label>Status</Label>
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

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-4 text-primary">Business Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="companyName">Company / Entity Name</Label>
                  <Input id="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Business or Entity Name" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="taxId">Tax / Registration ID</Label>
                  <Input id="taxId" value={formData.taxId} onChange={handleInputChange} placeholder="Tax or Reg Number" />
                </div>
              </div>
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
              {loading ? "Saving..." : (initialData ? "Update Owner" : "Save Owner Profile")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
