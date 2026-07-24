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
import { IconLoader2, IconReceiptOff, IconCalendar, IconCurrencyDollar } from "@tabler/icons-react"
import { format } from "date-fns"
import api from "@/lib/api"
import { PaymentInput } from "@/components/ui/payment-input";

export function ExpenseCellViewer({ expense, onUpdate }) {
  const { getCurrencySymbol } = useSettings()
  const isMobile = useIsMobile()
  const [loading, setLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    title: expense.title || "",
    category: expense.category || "Other",
    amount: expense.amount || 0,
    paymentMethod: expense.paymentMethod || "Cash",
    notes: expense.notes || "",
    status: expense.status || "Paid",
  })

  React.useEffect(() => {
    setFormData({
      title: expense.title || "",
      category: expense.category || "Other",
      amount: expense.amount || 0,
      paymentMethod: expense.paymentMethod || "Cash",
      notes: expense.notes || "",
      status: expense.status || "Paid",
    })
  }, [expense])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: id === 'amount' ? Number(value) : value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.patch(`/expenses/${expense._id}`, formData)
      toast.success("Expense updated successfully")
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
          {expense.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-h-[100dvh]">
        <DrawerHeader className="gap-1">
          <DrawerTitle className="flex items-center gap-2">
            <IconReceiptOff className="size-5 text-primary" />
            Expense {expense.referenceNumber}
          </DrawerTitle>
          <DrawerDescription>
            Details for: {expense.title}
          </DrawerDescription>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 px-4">
          <div className="flex flex-col gap-6 py-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <IconCalendar className="size-3.5" />
                <span>Basic Info</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-md border">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold">Date</span>
                  <span>{format(new Date(expense.date), "PPP")}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold">Ref #</span>
                  <span className="uppercase">{expense.referenceNumber}</span>
                </div>
              </div>
            </div>

            <form id="expense-edit-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-3">
                <Label htmlFor="title">Expense Title</Label>
                <Input id="title" value={formData.title} onChange={handleInputChange} className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(v) => handleSelectChange("category", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Salaries">Salaries</SelectItem>
                        <SelectItem value="Supplies">Supplies</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="amount">Amount ({getCurrencySymbol()})</Label>
                  <PaymentInput id="amount" type="number" value={formData.amount} onChange={handleInputChange} className="w-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label>Payment Method</Label>
                  <Select value={formData.paymentMethod} onValueChange={(v) => handleSelectChange("paymentMethod", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid gap-3">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={formData.notes} onChange={handleInputChange} className="w-full min-h-[100px]" />
              </div>
            </form>
          </div>
        </ScrollArea>

        <DrawerFooter>
          <Button type="submit" form="expense-edit-form" disabled={loading} className="w-full">
            {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
            Update Expense
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
