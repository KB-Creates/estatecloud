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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectGroup, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { IconLoader2, IconUsers, IconChevronDown, IconCheck, IconBuildingEstate } from "@tabler/icons-react"
import { toast } from "sonner"

export function AddCustomerModal({ open, onOpenChange, onSuccess, initialData }) {
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState([])
  const [owners, setOwners] = useState([])
  const [ownerOpen, setOwnerOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Customer",
    address: "",
    notes: "",
    status: "Active",
    assignedAgents: [],
    owner: "",
  })

  useEffect(() => {
    if (open) {
      fetchAgents()
      fetchOwners()
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          email: initialData.email || "",
          password: "", // Security
          phone: initialData.phone || "",
          role: initialData.role || "Customer",
          address: initialData.address || "",
          notes: initialData.notes || "",
          status: initialData.status || "Active",
          assignedAgents: initialData.assignedAgents || [],
          owner: initialData.owner || "",
        })
      } else {
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          role: "Customer",
          address: "",
          notes: "",
          status: "Active",
          assignedAgents: [],
          owner: "",
        })
      }
    }
  }, [open, initialData])

  const fetchAgents = async () => {
    try {
      const response = await api.get('/agents')
      setAgents(response.data)
    } catch (error) {
      console.error("Error fetching agents:", error)
    }
  }

  const fetchOwners = async () => {
    try {
      const response = await api.get('/owners')
      setOwners(response.data)
    } catch (error) {
      console.error("Error fetching owners:", error)
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
    if (formData.assignedAgents.length === 0) {
      toast.error("Please select at least one agent.")
      return
    }
    setLoading(true)

    try {
      if (initialData) {
        const dataToSubmit = { ...formData }
        if (!dataToSubmit.password) delete dataToSubmit.password
        await api.patch(`/users/${initialData._id}`, dataToSubmit)
        toast.success("Customer profile updated!")
      } else {
        await api.post('/users', { ...formData, role: 'Customer' })
        toast.success("Customer added successfully!")
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
      <DialogContent className="sm:max-w-[700px] w-full overflow-y-auto max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle>{initialData ? "Edit Customer Profile" : "Add New Customer"}</DialogTitle>
            <DialogDescription>
              {initialData ? "Update the customer profile details." : "Create a new customer profile with personal and management details."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Customer Name*</Label>
                <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Enter customer name" required className="w-full" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="admin@example.com" className="w-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="password">Password {initialData && "(Leave blank to keep)"}</Label>
                <Input id="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••" required={!initialData} className="w-full" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter phone number" className="w-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label>System Role*</Label>
                <Select onValueChange={(val) => handleSelectChange("role", val)} value={formData.role}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Customer">Customer</SelectItem>
                      <SelectItem value="Tenant">Tenant</SelectItem>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label>Status*</Label>
                <Select onValueChange={(val) => handleSelectChange("status", val)} value={formData.status}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Banned">Banned</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={formData.address} onChange={handleInputChange} placeholder="Enter full address" className="min-h-20 w-full" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" value={formData.notes} onChange={handleInputChange} placeholder="Any extra information..." className="min-h-24 w-full" />
            </div>

            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assigned Agents - Required */}
              <div className="grid gap-3">
                <Label className="flex items-center gap-2 font-medium">
                  <IconUsers className="size-4 text-primary" /> Assigned Agents*
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal"
                    >
                      <span className="truncate">
                        {formData.assignedAgents.length > 0
                          ? agents
                              .filter((a) => formData.assignedAgents.includes(a._id))
                              .map((a) => a.name)
                              .join(", ")
                          : "Select agents..."}
                      </span>
                      <IconChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start" style={{ width: "var(--radix-popover-trigger-width)" }}>
                    <Command>
                      <CommandInput placeholder="Search agents..." />
                      <CommandList>
                        <CommandEmpty>No agents found.</CommandEmpty>
                        <CommandGroup>
                          {agents.map((agent) => {
                            const isSelected = formData.assignedAgents.includes(agent._id)
                            return (
                              <CommandItem
                                key={agent._id}
                                value={agent.name}
                                onSelect={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    assignedAgents: isSelected
                                      ? prev.assignedAgents.filter((id) => id !== agent._id)
                                      : [...prev.assignedAgents, agent._id],
                                  }))
                                }}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  className="pointer-events-none mr-2"
                                />
                                {agent.name}
                                {isSelected && <IconCheck className="ml-auto size-4" />}
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Property Owner - Searchable */}
              <div className="grid gap-3">
                <Label className="flex items-center gap-2 font-medium">
                  <IconBuildingEstate className="size-4 text-primary" /> Property Owner
                </Label>
                <Popover open={ownerOpen} onOpenChange={setOwnerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={ownerOpen}
                      className="w-full justify-between font-normal"
                    >
                      <span className="truncate">
                        {formData.owner
                          ? owners.find((o) => o._id === formData.owner)?.name || "Select owner..."
                          : "Select owner..."}
                      </span>
                      <IconChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start" style={{ width: "var(--radix-popover-trigger-width)" }}>
                    <Command>
                      <CommandInput placeholder="Search owner..." />
                      <CommandList>
                        <CommandEmpty>No owner found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="none"
                            onSelect={() => {
                              setFormData((prev) => ({ ...prev, owner: "" }))
                              setOwnerOpen(false)
                            }}
                          >
                            -- No Owner --
                            {!formData.owner && <IconCheck className="ml-auto size-4" />}
                          </CommandItem>
                          {owners.map((owner) => (
                            <CommandItem
                              key={owner._id}
                              value={owner.name}
                              onSelect={() => {
                                setFormData((prev) => ({ ...prev, owner: owner._id }))
                                setOwnerOpen(false)
                              }}
                            >
                              {owner.name}
                              {formData.owner === owner._id && <IconCheck className="ml-auto size-4" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button 
              variant="outline" 
              type="button" 
              className="w-full rounded-full h-11" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full rounded-full h-11" 
              disabled={loading}
            >
              {loading ? <IconLoader2 className="mr-2 size-4 animate-spin" /> : null}
              {loading ? "Saving..." : (initialData ? "Update Profile" : "Save Customer")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
