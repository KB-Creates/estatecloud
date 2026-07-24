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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"

export function UserModal({ open, onOpenChange, onSuccess, initialData }) {
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "staff",
    password: "",
  })

  useEffect(() => {
    if (open) {
      fetchRoles()
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          email: initialData.email || "",
          role: initialData.role || "staff",
          password: "",
        })
      } else {
        setFormData({
          name: "",
          email: "",
          role: "staff",
          password: "",
        })
      }
    }
  }, [open, initialData])

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles')
      setRoles(response.data)
    } catch (error) {
      console.error("Error fetching roles:", error)
    }
  }

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
        const dataToSubmit = { ...formData }
        if (!dataToSubmit.password) delete dataToSubmit.password
        await api.patch(`/users/${initialData._id}`, dataToSubmit)
        toast.success("User updated successfully!")
      } else {
        await api.post('/users', formData)
        toast.success("User created successfully!")
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
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-3">
            <DialogTitle>{initialData ? "Edit System User" : "Create New User"}</DialogTitle>
            <DialogDescription>
              {initialData ? "Update user profile and system permissions." : "Add a new user with specific role and access."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-5 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Full Name*</Label>
              <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Enter name" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email address*</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="user@example.com" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password {initialData && "(Leave blank to keep)"}</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••" required={!initialData} />
            </div>
            <div className="grid gap-3">
              <Label>System Role*</Label>
              <Select onValueChange={(val) => handleSelectChange("role", val)} value={formData.role}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {formData.email.toLowerCase() === 'azam.asghar26@gmail.com' && (
                      <SelectItem value="admin">Admin</SelectItem>
                    )}
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    {roles.map(r => (
                      !['admin', 'agent', 'owner', 'staff', 'customer'].includes(r.name.toLowerCase()) && (
                        <SelectItem key={r._id} value={r.name.toLowerCase()}>{r.name}</SelectItem>
                      )
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse mt-2 sm:flex-col-reverse gap-2">
            <Button 
              variant="outline" 
              type="button" 
              className="w-full rounded-full" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full rounded-full" 
              disabled={loading}
            >
              {loading ? <IconLoader2 className="mr-2 size-4 animate-spin" /> : null}
              {loading ? "Saving..." : (initialData ? "Update User" : "Create User")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
