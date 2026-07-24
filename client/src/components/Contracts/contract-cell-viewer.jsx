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
  SelectLabel,
} from "@/components/ui/select"
import { toast } from "sonner"
import { IconLoader2, IconUser, IconCalendar, IconCash } from "@tabler/icons-react"
import { format } from "date-fns"
import { PaymentInput } from "@/components/ui/payment-input";

export function ContractCellViewer({ contract, onUpdate }) {
  const isMobile = useIsMobile()
  const [loading, setLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    clientName: contract.clientName || contract.tenantName || "",
    contractType: contract.contractType || "Rental Agreement",
    status: contract.status || "Draft",
    rentAmount: contract.rentAmount || "",
    billingCycle: contract.billingCycle || "Monthly",
    securityDeposit: contract.securityDeposit || "",
    lateFee: contract.lateFee || "",
    notes: contract.notes || "",
  })

  React.useEffect(() => {
    setFormData({
      clientName: contract.clientName || contract.tenantName || "",
      contractType: contract.contractType || "Rental Agreement",
      status: contract.status || "Draft",
      rentAmount: contract.rentAmount || "",
      billingCycle: contract.billingCycle || "Monthly",
      securityDeposit: contract.securityDeposit || "",
      lateFee: contract.lateFee || "",
      notes: contract.notes || "",
    })
  }, [contract])

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contracts/${contract._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update contract")
      
      toast.success("Contract updated successfully")
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
        <Button variant="link" className="h-fit py-0.5 w-fit px-0 text-left text-foreground text-sm">
          {contract.clientName || contract.tenantName}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-h-[100dvh]">
        <DrawerHeader className="gap-1">
          <DrawerTitle className="flex items-center gap-2">
            <IconUser className="size-5 text-primary" />
            {contract.clientName || contract.tenantName}
          </DrawerTitle>
          <DrawerDescription>
            Agreement Details for {contract.property?.title || "Property"} - Unit {contract.unit?.unitNumber || "N/A"}
          </DrawerDescription>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 px-4">
          <div className="flex flex-col gap-6 py-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <IconCalendar className="size-3.5" />
                <span>Timeline</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-md border">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold">Start Date</span>
                  <span>{contract.startDate ? format(new Date(contract.startDate), "PPP") : "N/A"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold">End Date</span>
                  <span>{contract.endDate ? format(new Date(contract.endDate), "PPP") : "Open Ended"}</span>
                </div>
              </div>
            </div>

            <form id="contract-edit-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-3">
                <Label htmlFor="clientName">Client Name</Label>
                <Input id="clientName" value={formData.clientName} onChange={handleInputChange} className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label>Contract Type</Label>
                  <Select value={formData.contractType} onValueChange={(v) => handleSelectChange("contractType", v)}>
                    <SelectTrigger >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Types</SelectLabel>
                        <SelectItem value="Rental Agreement">Rental Agreement</SelectItem>
                        <SelectItem value="Lease Agreement">Lease Agreement</SelectItem>
                        <SelectItem value="Sales Contract">Sales Contract</SelectItem>
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
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <IconCash className="size-3.5" />
                  <span>Financials</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="rentAmount">Rent Amount</Label>
                    <PaymentInput id="rentAmount" type="number" value={formData.rentAmount} onChange={handleInputChange} className="w-full" />
                  </div>
                  <div className="grid gap-3">
                    <Label>Billing Cycle</Label>
                    <Select value={formData.billingCycle} onValueChange={(v) => handleSelectChange("billingCycle", v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Cycles</SelectLabel>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Yearly">Yearly</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="securityDeposit">Security Deposit</Label>
                    <PaymentInput id="securityDeposit" type="number" value={formData.securityDeposit} onChange={handleInputChange} className="w-full" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="lateFee">Late Fee</Label>
                    <PaymentInput id="lateFee" type="number" value={formData.lateFee} onChange={handleInputChange} className="w-full" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-3">
                <Label htmlFor="notes">Notes & Special Clauses</Label>
                <Textarea id="notes" value={formData.notes} onChange={handleInputChange} className="w-full min-h-[100px]" />
              </div>

              {contract.attachmentUrl && (
                <div className="grid gap-3 mt-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Contract Document</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md border text-sm">
                    <span className="truncate max-w-[200px] text-xs text-muted-foreground font-medium">
                      Attachment Uploaded
                    </span>
                    <Button variant="outline" size="sm" asChild className="h-8">
                      <a 
                        href={contract.attachmentUrl} 
                        download={`contract-${contract.contractNumber || 'document'}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View / Download
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </ScrollArea>

        <DrawerFooter>
          <Button type="submit" form="contract-edit-form" disabled={loading} className="w-full">
            {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
            Update Contract Details
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
