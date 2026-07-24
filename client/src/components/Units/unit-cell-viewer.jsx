import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { IconLoader2 } from "@tabler/icons-react"
import { PaymentInput } from "@/components/ui/payment-input";

export function UnitCellViewer({ unit, onUpdate }) {
  const isMobile = useIsMobile()
  const [loading, setLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    unitNumber: unit.unitNumber || "",
    unitType: unit.unitType || "Apartment",
    status: unit.status || "Available",
    price: unit.price || "",
    areaSize: unit.areaSize || "",
    areaUnit: unit.areaUnit || "sqft",
    bedrooms: unit.bedrooms || 0,
    bathrooms: unit.bathrooms || 0,
    windows: unit.windows || 0,
  })

  React.useEffect(() => {
    setFormData({
      unitNumber: unit.unitNumber || "",
      unitType: unit.unitType || "Apartment",
      status: unit.status || "Available",
      price: unit.price || "",
      areaSize: unit.areaSize || "",
      areaUnit: unit.areaUnit || "sqft",
      bedrooms: unit.bedrooms || 0,
      bathrooms: unit.bathrooms || 0,
      windows: unit.windows || 0,
    })
  }, [unit])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/units/${unit._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update unit")
      
      toast.success("Unit updated successfully")
      if (onUpdate) onUpdate()
      setIsOpen(false)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          Unit {unit.unitNumber}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Unit {unit.unitNumber}</DrawerTitle>
          <DrawerDescription>
            View and update unit details.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form id="unit-edit-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="unitNumber">Unit Number <span className="text-destructive">*</span></Label>
              <Input id="unitNumber" value={formData.unitNumber} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="unitType">Type</Label>
                <Select value={formData.unitType} onValueChange={(v) => handleSelectChange("unitType", v)}>
                  <SelectTrigger id="unitType" className="w-full">
                    <SelectValue placeholder="Select a type" />
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
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
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
            </div>
             <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="areaSize">Area Size <span className="text-destructive">*</span></Label>
                <Input id="areaSize" type="number" value={formData.areaSize} onChange={handleInputChange} className="w-full" />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Area Unit</Label>
                <Select value={formData.areaUnit} onValueChange={(v) => handleSelectChange("areaUnit", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unit" />
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
              <div className="flex flex-col gap-3">
                <Label htmlFor="bedrooms">Beds</Label>
                <Input id="bedrooms" type="number" value={formData.bedrooms} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="bathrooms">Baths</Label>
                <Input id="bathrooms" type="number" value={formData.bathrooms} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="windows">Windows</Label>
                <Input id="windows" type="number" value={formData.windows} onChange={handleInputChange} />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button type="submit" form="unit-edit-form" disabled={loading}>
            {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
            Submit
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
