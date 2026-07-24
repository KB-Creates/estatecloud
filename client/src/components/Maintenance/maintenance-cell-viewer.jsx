import * as React from "react"
import { useSettings } from "@/context/SettingsContext"
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
import { IconLoader2, IconTool, IconCalendar, IconUser } from "@tabler/icons-react"
import { format } from "date-fns"
import api from "@/lib/api"
import { PaymentInput } from "@/components/ui/payment-input";

export function MaintenanceCellViewer({ maintenance, onUpdate }) {
  const { getCurrencySymbol } = useSettings()
  const isMobile = useIsMobile()
  const [loading, setLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    title: maintenance.title || "",
    status: maintenance.status || "Pending",
    priority: maintenance.priority || "Medium",
    type: maintenance.type || "Repair",
    estimatedCost: maintenance.estimatedCost || 0,
    description: maintenance.description || "",
  })

  React.useEffect(() => {
    setFormData({
      title: maintenance.title || "",
      status: maintenance.status || "Pending",
      priority: maintenance.priority || "Medium",
      type: maintenance.type || "Repair",
      estimatedCost: maintenance.estimatedCost || 0,
      description: maintenance.description || "",
    })
  }, [maintenance])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: id === 'estimatedCost' ? Number(value) : value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.patch(`/maintenance/${maintenance._id}`, formData)
      toast.success("Maintenance task updated")
      if (onUpdate) onUpdate()
      setIsOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="link" className="h-fit py-0.5 w-fit px-0 text-left text-foreground text-sm font-bold">
          {maintenance.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-h-[100dvh]">
        <DrawerHeader className="gap-1">
          <DrawerTitle className="flex items-center gap-2">
            <IconTool className="size-5 text-primary" />
            {maintenance.title}
          </DrawerTitle>
          <DrawerDescription>
            Task for {maintenance.property?.title || "Property"} - Unit {maintenance.unit?.unitNumber || "N/A"}
          </DrawerDescription>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 px-4">
          <div className="flex flex-col gap-6 py-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <IconUser className="size-3.5" />
                <span>Requester</span>
              </div>
              <div className="bg-muted/30 p-3 rounded-md border text-sm">
                <p className="font-bold">{maintenance.requestedBy}</p>
                <p className="text-muted-foreground">{maintenance.email}</p>
                <p className="text-muted-foreground">{maintenance.phone}</p>
              </div>
            </div>

            <form id="maintenance-edit-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-3">
                <Label htmlFor="title">Issue Title</Label>
                <Input id="title" value={formData.title} onChange={handleInputChange} className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(v) => handleSelectChange("type", v)}>
                    <SelectTrigger className="w-full">
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
                <div className="grid gap-3">
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(v) => handleSelectChange("priority", v)}>
                    <SelectTrigger className="w-full">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                    <SelectTrigger className="w-full">
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
                <div className="grid gap-3">
                  <Label htmlFor="estimatedCost">Est. Cost ({getCurrencySymbol()})</Label>
                  <PaymentInput id="estimatedCost" type="number" value={formData.estimatedCost} onChange={handleInputChange} className="w-full" />
                </div>
              </div>

              <Separator />

              <div className="grid gap-3">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea id="description" value={formData.description} onChange={handleInputChange} className="w-full min-h-[100px]" />
              </div>
            </form>
          </div>
        </ScrollArea>

        <DrawerFooter>
          <Button type="submit" form="maintenance-edit-form" disabled={loading} className="w-full">
            {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
            Update Task
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
