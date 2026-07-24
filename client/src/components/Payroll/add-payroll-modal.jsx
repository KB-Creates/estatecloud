import React, { useState, useEffect } from "react"
import api from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
  SelectEmpty,
} from "@/components/ui/select"
import { toast } from "sonner"
import { IconLoader2, IconCalendar, IconUser, IconCash } from "@tabler/icons-react"
import { PaymentInput } from "@/components/ui/payment-input";

export function AddPayrollModal({ open, onOpenChange, onSuccess, initialData }) {
  const [loading, setLoading] = useState(false)
  const [staff, setStaff] = useState([])
  
  const [formData, setFormData] = useState({
    staffId: "",
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString(),
    baseSalary: 0,
    bonus: 0,
    deductions: 0,
    status: "Pending",
    paymentMethod: "Bank Transfer",
    notes: "",
  })

  useEffect(() => {
    if (open) {
      fetchStaff()
      if (initialData) {
        setFormData({
          staffId: initialData.staff?._id || initialData.staffId || "",
          month: initialData.month || "",
          year: initialData.year?.toString() || "",
          baseSalary: initialData.baseSalary || 0,
          bonus: initialData.bonus || 0,
          deductions: initialData.deductions || 0,
          status: initialData.status || "Pending",
          paymentMethod: initialData.paymentMethod || "Bank Transfer",
          notes: initialData.notes || "",
        })
      } else {
        setFormData({
          staffId: "",
          month: new Date().toLocaleString('default', { month: 'long' }),
          year: new Date().getFullYear().toString(),
          baseSalary: 0,
          bonus: 0,
          deductions: 0,
          status: "Pending",
          paymentMethod: "Bank Transfer",
          notes: "",
        })
      }
    }
  }, [open, initialData])

  const fetchStaff = async () => {
    try {
      const response = await api.get('/users')
      setStaff(response.data)
    } catch (error) {
      toast.error("Failed to load staff list")
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    
    if (id === "staffId" && !initialData) {
      const selectedStaff = staff.find(s => s._id === value)
      if (selectedStaff) {
        setFormData(prev => ({
          ...prev,
          baseSalary: selectedStaff.basicSalary || 0
        }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.staffId || !formData.month || !formData.year) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      if (initialData) {
        await api.patch(`/payroll/${initialData._id}`, formData)
        toast.success("Payroll record updated!")
      } else {
        await api.post('/payroll', formData)
        toast.success("Payroll entry created successfully!")
      }
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const years = ["2024", "2025", "2026", "2027"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                    <IconCash className="size-5 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-bold tracking-tight">
                    {initialData ? "Edit Payroll Entry" : "Generate Payroll"}
                </DialogTitle>
            </div>
            <DialogDescription>
              {initialData ? "Modify the existing salary disbursement record." : "Create a new salary disbursement record for a staff member."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
                <Label className="text-sm font-semibold">Staff Member*</Label>
                <Select 
                  onValueChange={(val) => handleSelectChange("staffId", val)} 
                  value={formData.staffId}
                  required
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {staff.length === 0 ? (
                        <SelectEmpty>No staff members found</SelectEmpty>
                      ) : (
                        staff.map((s) => (
                          <SelectItem key={s._id} value={s._id}>{s.name} ({s.designation || "Staff"})</SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label className="text-sm font-semibold">Month*</Label>
                    <Select 
                      onValueChange={(val) => handleSelectChange("month", val)} 
                      value={formData.month}
                      required
                    >
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label className="text-sm font-semibold">Year*</Label>
                    <Select 
                      onValueChange={(val) => handleSelectChange("year", val)} 
                      value={formData.year}
                      required
                    >
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(y => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Base Salary</Label>
                    <Input 
                        id="baseSalary" 
                        type="number"
                        className="bg-background border-none shadow-sm"
                        value={formData.baseSalary} 
                        onChange={handleInputChange} 
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Bonus</Label>
                    <PaymentInput id="bonus" 
                        type="number"
                        className="bg-background border-none shadow-sm"
                        value={formData.bonus} 
                        onChange={handleInputChange} 
                    />
                </div>
                <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Deductions</Label>
                    <PaymentInput id="deductions" 
                        type="number"
                        className="bg-background border-none shadow-sm text-destructive"
                        value={formData.deductions} 
                        onChange={handleInputChange} 
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label className="text-sm font-semibold">Payment Status</Label>
                    <Select 
                        onValueChange={(val) => handleSelectChange("status", val)} 
                        value={formData.status}
                    >
                        <SelectTrigger className="rounded-xl h-11">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label className="text-sm font-semibold">Method</Label>
                    <Select 
                        onValueChange={(val) => handleSelectChange("paymentMethod", val)} 
                        value={formData.paymentMethod}
                    >
                        <SelectTrigger className="rounded-xl h-11">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Cheque">Cheque</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Notes</Label>
              <Textarea 
                id="notes" 
                value={formData.notes} 
                onChange={handleInputChange} 
                className="min-h-[60px] rounded-xl"
                placeholder="Internal notes..."
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
            >
                Cancel
            </Button>
            <Button 
                type="submit" 
                disabled={loading}
                className="rounded-full px-8"
            >
              {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              {loading ? "Saving..." : (initialData ? "Update Entry" : "Confirm Payroll")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
