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
import { PaymentInput } from "@/components/ui/payment-input";

export function AddStaffModal({ open, onOpenChange, onSuccess, initialData }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    basicSalary: "",
    status: "Active",
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          designation: initialData.designation || "",
          basicSalary: initialData.basicSalary || "",
          status: initialData.status || "Active",
        })
      } else {
        setFormData({
          name: "",
          email: "",
          phone: "",
          designation: "",
          basicSalary: "",
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
        await api.patch(`/staff/${initialData._id}`, formData)
        toast.success("Staff profile updated!")
      } else {
        await api.post('/staff', formData)
        toast.success("Staff member added successfully!")
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
            <DialogTitle>{initialData ? "Edit Staff Profile" : "Add New Staff Member"}</DialogTitle>
            <DialogDescription>
              {initialData ? "Update the employee profile details." : "Create a new employee profile with their contact and payroll details."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Full Name*</Label>
                <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@company.com" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 234 567 890" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" value={formData.designation} onChange={handleInputChange} placeholder="Property Manager / Receptionist" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="basicSalary">Basic Salary</Label>
                <PaymentInput id="basicSalary" type="number" value={formData.basicSalary} onChange={handleInputChange} placeholder="0.00" />
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
              {loading ? "Saving..." : (initialData ? "Update Profile" : "Add Staff Member")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
