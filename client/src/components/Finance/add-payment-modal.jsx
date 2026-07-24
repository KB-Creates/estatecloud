import React, { useEffect, useState } from "react"
import api from "@/lib/api"
import { useSettings } from "@/context/SettingsContext"
import { Button } from "@/components/ui/button"
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
import { IconLoader2 } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PaymentInput } from "@/components/ui/payment-input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function AddPaymentModal({ open, onOpenChange, onSuccess, initialContractId, sourcePayment }) {
  const { getCurrencySymbol } = useSettings()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    property: "",
    unit: "",
    contract: "",
    client: "",
    paymentType: "Monthly Rent",
    paymentMethod: "Cash",
    billingMonth: "May",
    billingYear: 2026,
    baseAmount: 0,
    receivedAmount: 0,
    internalNotes: "",
  })

  useEffect(() => {
    if (open) {
      resetForm()
    }
  }, [open])

  useEffect(() => {
    if (!open || !sourcePayment) return

    const sourcePropertyId = sourcePayment.property?._id || sourcePayment.property?.id || sourcePayment.propertyId || ""
    const sourceUnitId = sourcePayment.unit?._id || sourcePayment.unit?.id || sourcePayment.unitId || ""
    const sourceContractId = sourcePayment.contract?._id || sourcePayment.contract?.id || sourcePayment.contractId || initialContractId || ""

    setFormData((prev) => ({
      ...prev,
      property: sourcePropertyId,
      unit: sourceUnitId,
      contract: sourceContractId,
      client: sourcePayment.client || prev.client,
      baseAmount: sourcePayment.balance ?? sourcePayment.baseAmount ?? prev.baseAmount,
      receivedAmount: sourcePayment.balance ?? sourcePayment.baseAmount ?? prev.receivedAmount,
      paymentType: sourcePayment.paymentType || prev.paymentType,
      paymentMethod: sourcePayment.paymentMethod || prev.paymentMethod,
      billingMonth: sourcePayment.billingMonth || prev.billingMonth,
      billingYear: sourcePayment.billingYear || prev.billingYear,
    }))

    if (sourcePropertyId) {
      setFormData((prev) => ({
        ...prev,
        property: sourcePropertyId,
        unit: sourceUnitId,
      }))
    }
  }, [open, sourcePayment, initialContractId])

  const resetForm = () => {
    setFormData({
      property: "",
      unit: "",
      contract: "",
      client: "",
      paymentType: "Monthly Rent",
      paymentMethod: "Cash",
      billingMonth: "May",
      billingYear: 2026,
      baseAmount: 0,
      receivedAmount: 0,
      internalNotes: "",
    })
  }


  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: id.includes("Amount") || id === "billingYear" ? Number(value) : value }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.property || !formData.client || formData.baseAmount <= 0) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      await api.post("/payments", formData)
      toast.success("Payment recorded successfully!")
      if (onSuccess) onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const years = [2024, 2025, 2026, 2027, 2028]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Collect Payment</DialogTitle>
          <DialogDescription>Record a new payment and keep the due history updated.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <input type="hidden" value={formData.property} readOnly />
          <input type="hidden" value={formData.unit} readOnly />
          <input type="hidden" value={formData.contract} readOnly />
          <input type="hidden" value={formData.client} readOnly />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Payment Type*</Label>
                      <Select onValueChange={(val) => handleSelectChange("paymentType", val)} value={formData.paymentType}>
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
                    <div className="grid gap-2">
                      <Label>Payment Method*</Label>
                      <Select onValueChange={(val) => handleSelectChange("paymentMethod", val)} value={formData.paymentMethod}>
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
                    <div className="grid gap-2">
                      <Label>Billing Month</Label>
                      <Select onValueChange={(val) => handleSelectChange("billingMonth", val)} value={formData.billingMonth}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {months.map((m) => (
                              <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Billing Year</Label>
                      <Select onValueChange={(val) => handleSelectChange("billingYear", val)} value={formData.billingYear.toString()}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {years.map((y) => (
                              <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Internal Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="internalNotes"
                    placeholder="Add payment verification codes or agent notes..."
                    value={formData.internalNotes}
                    onChange={handleInputChange}
                    className="min-h-24 w-full"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Collection Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Base Amount*</Label>
                    <PaymentInput id="baseAmount" type="number" value={formData.baseAmount} onChange={handleInputChange} className="w-full" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Received Amount*</Label>
                    <PaymentInput id="receivedAmount" type="number" value={formData.receivedAmount} onChange={handleInputChange} className="w-full" />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium">Total to Collect</span>
                    <span className="text-xl font-bold">{getCurrencySymbol()}{(formData.baseAmount - formData.receivedAmount).toLocaleString()}</span>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
                    {loading ? "Processing..." : "Submit Payment"}
                  </Button>
                </CardContent>
              </Card>

              <div className="p-4 rounded-lg bg-muted text-xs text-muted-foreground">
                <p className="font-bold mb-1">Invoice Policy</p>
                <p>Submitting this form will generate a unique digital invoice and notify the client.</p>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}