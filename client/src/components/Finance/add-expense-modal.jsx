import React, { useState, useEffect } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectGroup, 
  SelectItem 
} from "@/components/ui/select"
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import { IconCalendar, IconLoader2 } from "@tabler/icons-react"
import { format } from "date-fns"
import { PaymentInput } from "@/components/ui/payment-input";

export function AddExpenseModal({ open, onOpenChange, onRefresh, initialData }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "Other",
    amount: 0,
    date: new Date(),
    paymentMethod: "Cash",
    notes: "",
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          title: initialData.title || "",
          category: initialData.category || "Other",
          amount: initialData.amount || 0,
          date: initialData.date ? new Date(initialData.date) : new Date(),
          paymentMethod: initialData.paymentMethod || "Cash",
          notes: initialData.notes || "",
        })
      } else {
        setFormData({
          title: "",
          category: "Other",
          amount: 0,
          date: new Date(),
          paymentMethod: "Cash",
          notes: "",
        })
      }
    }
  }, [open, initialData])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: id === 'amount' ? Number(value) : value }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.category || formData.amount <= 0) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      if (initialData) {
        await api.patch(`/expenses/${initialData._id}`, formData)
        toast.success("Expense updated successfully!")
      } else {
        await api.post('/expenses', formData)
        toast.success("Expense recorded successfully!")
      }
      onOpenChange(false)
      if (onRefresh) onRefresh()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Expense Details" : "Record New Expense"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the details of the business expense below." : "Enter the details of the business expense below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Expense Title*</Label>
            <Input
              id="title"
              placeholder="e.g. Office Rent, Electric Bill"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount*</Label>
              <PaymentInput id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category*</Label>
              <Select onValueChange={(val) => handleSelectChange("category", val)} value={formData.category}>
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <IconCalendar className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <Select onValueChange={(val) => handleSelectChange("paymentMethod", val)} value={formData.paymentMethod}>
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
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information..."
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full min-h-[80px]"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              {loading ? "Saving..." : (initialData ? "Update Expense" : "Record Expense")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
