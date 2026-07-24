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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectEmpty } from "@/components/ui/select"
import { IconLoader2, IconCheck } from "@tabler/icons-react"
import { toast } from "sonner"
import { PaymentInput } from "@/components/ui/payment-input";

export function AddUnitModal({ open, onOpenChange, onSuccess, initialData }) {
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState([])
  const [fetchingProperties, setFetchingProperties] = useState(false)

  const [formData, setFormData] = useState({
    property: "",
    block: "",
    floor: "",
    unitNumber: "",
    unitType: "",
    status: "Available",
    price: "",
    areaSize: "",
    areaUnit: "sqft",
    bedrooms: "",
    bathrooms: "",
    windows: "",
  })

  useEffect(() => {
    if (open) {
      fetchProperties()
      if (initialData) {
        setFormData({
          property: initialData.property?._id || initialData.property || "",
          block: initialData.block || "",
          floor: initialData.floor || "",
          unitNumber: initialData.unitNumber || "",
          unitType: initialData.unitType || "",
          status: initialData.status || "Available",
          price: initialData.price || "",
          areaSize: initialData.areaSize || "",
          areaUnit: initialData.areaUnit || "sqft",
          bedrooms: initialData.bedrooms || "",
          bathrooms: initialData.bathrooms || "",
          windows: initialData.windows || "",
        })
      } else {
        setFormData({
          property: "",
          block: "",
          floor: "",
          unitNumber: "",
          unitType: "",
          status: "Available",
          price: "",
          areaSize: "",
          areaUnit: "sqft",
          bedrooms: "",
          bathrooms: "",
          windows: "",
        })
      }
    }
  }, [open, initialData])

  const fetchProperties = async () => {
    try {
      setFetchingProperties(true)
      const response = await api.get('/properties')
      setProperties(response.data)
    } catch (error) {
      toast.error("Could not load properties")
    } finally {
      setFetchingProperties(false)
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
        await api.patch(`/units/${initialData._id}`, formData)
        toast.success("Unit updated successfully!")
      } else {
        await api.post('/units', formData)
        toast.success("Unit added successfully!")
      }

      if (onSuccess) onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-3">
            <DialogTitle>{initialData ? "Edit Unit Details" : "Add New Unit"}</DialogTitle>
            <DialogDescription>
              {initialData ? "Update the specifications and status for this unit." : "Define a new unit and assign it to a property."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label>Select Property <span className="text-destructive">*</span></Label>
                <Select
                  onValueChange={(val) => handleSelectChange("property", val)}
                  value={formData.property}
                  required
                >
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder={fetchingProperties ? "Loading..." : "Select Property"} />
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
              <div className="grid gap-3">
                <Label htmlFor="unitNumber">Unit Number <span className="text-destructive">*</span></Label>
                <Input id="unitNumber" value={formData.unitNumber} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="block">Block / Tower</Label>
                <Input id="block" value={formData.block} onChange={handleInputChange} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="floor">Floor Level</Label>
                <Input id="floor" value={formData.floor} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Unit Type</Label>
              <Select onValueChange={(val) => handleSelectChange("unitType", val)} value={formData.unitType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Shop">Shop</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-3 col-span-1">
                <Label>Status</Label>
                <Select onValueChange={(val) => handleSelectChange("status", val)} value={formData.status}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                      <SelectItem value="Rented">Rented</SelectItem>
                      <SelectItem value="Booked">Booked</SelectItem>
                      <SelectItem value="Reserved">Reserved</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3 col-span-1">
                <Label htmlFor="areaSize">Area Size <span className="text-destructive">*</span></Label>
                <Input id="areaSize" type="number" value={formData.areaSize} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-3 col-span-1">
                <Label>Area Unit</Label>
                <Select onValueChange={(val) => handleSelectChange("areaUnit", val)} value={formData.areaUnit}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="sqft">Sq Ft</SelectItem>
                      <SelectItem value="marla">Marla</SelectItem>
                      <SelectItem value="kanal">Kanal</SelectItem>
                      <SelectItem value="sqm">Sq M</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input id="bedrooms" type="number" value={formData.bedrooms} onChange={handleInputChange} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input id="bathrooms" type="number" value={formData.bathrooms} onChange={handleInputChange} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="windows">Windows</Label>
                <Input id="windows" type="number" value={formData.windows} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse mt-2 sm:flex-col-reverse">
            <Button
              type="submit"
              className="w-full text-base font-semibold"
              disabled={loading}
            >
              {loading ? <IconLoader2 className="mr-2 size-4 animate-spin" /> : null}
              {loading ? "Saving..." : (initialData ? "Update Unit" : "Save Unit")}
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full text-base font-semibold"
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
