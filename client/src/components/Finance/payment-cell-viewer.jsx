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
import { IconLoader2, IconReceipt2, IconCalendar, IconUser } from "@tabler/icons-react"
import { format } from "date-fns"
import api from "@/lib/api"
import { PaymentInput } from "@/components/ui/payment-input";

export function PaymentCellViewer({ payment, onUpdate, triggerLabel }) {
  const { getCurrencySymbol } = useSettings()
  const isMobile = useIsMobile()
  const [loading, setLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    client: payment.client || "",
    paymentType: payment.paymentType || "Monthly Rent",
    paymentMethod: payment.paymentMethod || "Cash",
    receivedAmount: payment.receivedAmount || 0,
    baseAmount: payment.baseAmount || 0,
    internalNotes: payment.internalNotes || "",
  })

  React.useEffect(() => {
    setFormData({
      client: payment.client || "",
      paymentType: payment.paymentType || "Monthly Rent",
      paymentMethod: payment.paymentMethod || "Cash",
      receivedAmount: payment.receivedAmount || 0,
      baseAmount: payment.baseAmount || 0,
      internalNotes: payment.internalNotes || "",
    })
  }, [payment])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: id.includes('Amount') ? Number(value) : value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.patch(`/payments/${payment._id}`, formData)
      toast.success("Payment details updated")
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
          {triggerLabel || payment.verificationCode}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-h-[100dvh]">
        <DrawerHeader className="gap-1">
          <DrawerTitle className="flex items-center gap-2">
            <IconReceipt2 className="size-5 text-primary" />
            Invoice {payment.verificationCode}
          </DrawerTitle>
          <DrawerDescription>
            Payment record for {payment.client} - {payment.property?.title || "Property"}
          </DrawerDescription>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 px-4">
          <div className="flex flex-col gap-6 py-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <IconCalendar className="size-3.5" />
                <span>Transaction Details</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-md border">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold">Billing Period</span>
                  <span>{payment.billingMonth} {payment.billingYear}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold">Recorded On</span>
                  <span>{format(new Date(payment.createdAt), "PPP")}</span>
                </div>
              </div>
            </div>

            <form id="payment-edit-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-3">
                <Label htmlFor="client">Client Name</Label>
                <Input id="client" value={formData.client} onChange={handleInputChange} className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label>Payment Type</Label>
                  <Select value={formData.paymentType} onValueChange={(v) => handleSelectChange("paymentType", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Monthly Rent">Monthly Rent</SelectItem>
                        <SelectItem value="Security Deposit">Security Deposit</SelectItem>
                        <SelectItem value="Maintenance Fee">Maintenance Fee</SelectItem>
                        <SelectItem value="Late Fee">Late Fee</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label>Method</Label>
                  <Select value={formData.paymentMethod} onValueChange={(v) => handleSelectChange("paymentMethod", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="baseAmount">Base Amount ({getCurrencySymbol()})</Label>
                  <PaymentInput id="baseAmount" type="number" value={formData.baseAmount} onChange={handleInputChange} className="w-full" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="receivedAmount">Received Amount ({getCurrencySymbol()})</Label>
                  <PaymentInput id="receivedAmount" type="number" value={formData.receivedAmount} onChange={handleInputChange} className="w-full" />
                </div>
              </div>

              <Separator />

              <div className="grid gap-3">
                <Label htmlFor="internalNotes">Internal Notes</Label>
                <Textarea id="internalNotes" value={formData.internalNotes} onChange={handleInputChange} className="w-full min-h-[100px]" />
              </div>
            </form>
          </div>
        </ScrollArea>

        <DrawerFooter>
          <Button type="submit" form="payment-edit-form" disabled={loading} className="w-full">
            {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
            Update Record
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
