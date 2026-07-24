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
import { IconLoader2, IconUser, IconCalendar, IconBuildingStore } from "@tabler/icons-react"
import { format } from "date-fns"
import api from "@/lib/api"
import { PaymentInput } from "@/components/ui/payment-input";

export function BookingCellViewer({ booking, onUpdate }) {
  const isMobile = useIsMobile()
  const [loading, setLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    customerName: booking.customerName || "",
    email: booking.email || "",
    phone: booking.phone || "",
    status: booking.status || "Pending Request",
    totalPrice: booking.totalPrice || 0,
    tokenAmount: booking.tokenAmount || 0,
    advancePayment: booking.advancePayment || 0,
    notes: booking.notes || "",
  })

  React.useEffect(() => {
    setFormData({
      customerName: booking.customerName || "",
      email: booking.email || "",
      phone: booking.phone || "",
      status: booking.status || "Pending Request",
      totalPrice: booking.totalPrice || 0,
      tokenAmount: booking.tokenAmount || 0,
      advancePayment: booking.advancePayment || 0,
      notes: booking.notes || "",
    })
  }, [booking])

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
      await api.patch(`/bookings/${booking._id}`, formData)
      toast.success("Booking updated successfully")
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
          {booking.customerName}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-h-[100dvh]">
        <DrawerHeader className="gap-1">
          <DrawerTitle className="flex items-center gap-2">
            <IconUser className="size-5 text-primary" />
            {booking.customerName}
          </DrawerTitle>
          <DrawerDescription>
            Booking details for {booking.property?.title || "Property"} - Unit {booking.unit?.unitNumber || "N/A"}
          </DrawerDescription>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 px-4">
          <div className="flex flex-col gap-6 py-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <IconBuildingStore className="size-3.5" />
                <span>Financial Breakdown</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-md border">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold">Total Price</span>
                  <span className="font-semibold text-primary">Rs {(booking.totalPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold">Remaining</span>
                  <span className="font-semibold text-destructive">Rs {(booking.remainingAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <form id="booking-edit-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-3">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={formData.email} onChange={handleInputChange} className="w-full" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={formData.phone} onChange={handleInputChange} className="w-full" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="totalPrice">Total Price</Label>
                  <PaymentInput id="totalPrice" type="number" value={formData.totalPrice} onChange={handleInputChange} className="w-full" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tokenAmount">Token</Label>
                  <PaymentInput id="tokenAmount" type="number" value={formData.tokenAmount} onChange={handleInputChange} className="w-full" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="advancePayment">Advance</Label>
                  <PaymentInput id="advancePayment" type="number" value={formData.advancePayment} onChange={handleInputChange} className="w-full" />
                </div>
              </div>

              <div className="grid gap-3">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Pending Request">Pending Request</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="grid gap-3">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea id="notes" value={formData.notes} onChange={handleInputChange} className="w-full min-h-[100px]" />
              </div>
            </form>
          </div>
        </ScrollArea>

        <DrawerFooter>
          <Button type="submit" form="booking-edit-form" disabled={loading} className="w-full">
            {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
            Update Booking
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
