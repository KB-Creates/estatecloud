import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { IconUpload, IconFileSpreadsheet, IconLoader2, IconArrowRight, IconCheck } from "@tabler/icons-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import api from "@/lib/api"

export function ImportLeadsModal({ onSuccess }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState("upload") // "upload" or "mapping"
  const [loading, setLoading] = useState(false)
  const [rawJson, setRawJson] = useState([])
  const [headers, setHeaders] = useState([])
  const [mapping, setMapping] = useState({
    name: "",
    phone: "",
    city: "",
    propertyType: "",
    budget: "",
    purpose: ""
  })
  const fileInputRef = useRef(null)

  const guessMapping = (headersList) => {
    const newMapping = {
      name: "",
      phone: "",
      city: "",
      propertyType: "",
      budget: "",
      purpose: ""
    }
    
    headersList.forEach(header => {
      const h = header.toLowerCase()
      if (!newMapping.name && (h.includes("name") || h.includes("customer"))) newMapping.name = header
      if (!newMapping.phone && (h.includes("phone") || h.includes("contact") || h.includes("number"))) newMapping.phone = header
      if (!newMapping.city && h.includes("city")) newMapping.city = header
      if (!newMapping.propertyType && (h.includes("property") || h.includes("type"))) newMapping.propertyType = header
      if (!newMapping.budget && (h.includes("budget") || h.includes("price") || h.includes("range"))) newMapping.budget = header
      if (!newMapping.purpose && (h.includes("purpose") || h.includes("buy"))) newMapping.purpose = header
    })
    
    return newMapping
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" })
        
        if (json.length === 0) {
          toast.error("File is empty.")
          return
        }

        const extractedHeaders = Object.keys(json[0])
        setHeaders(extractedHeaders)
        setRawJson(json)
        setMapping(guessMapping(extractedHeaders))
        setStep("mapping")
        
      } catch (error) {
        console.error(error)
        toast.error("Failed to parse the file. Please ensure it is a valid Excel file.")
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleImport = async () => {
    if (!mapping.name || !mapping.phone) {
      toast.error("Name and Phone are mandatory fields.")
      return
    }

    setLoading(true)
    try {
      const mappedLeads = rawJson.map(row => {
        let purposeValue = row[mapping.purpose] || 'Other'
        if (typeof purposeValue === 'string') {
          const lp = purposeValue.toLowerCase()
          if (lp.includes('own') || lp.includes('personal')) purposeValue = 'Personal Use'
          else if (lp.includes('invest')) purposeValue = 'Investment'
          else purposeValue = 'Other'
        }

        let propertyTypeValue = row[mapping.propertyType] || 'N/A'
        if (typeof propertyTypeValue === 'string') {
          propertyTypeValue = propertyTypeValue.replace(/_/g, ' ')
        }

        return {
          name: row[mapping.name] || 'Unknown',
          phone: row[mapping.phone] ? String(row[mapping.phone]) : '',
          city: row[mapping.city] || 'Unknown',
          budget: row[mapping.budget] ? String(row[mapping.budget]) : '',
          propertyType: propertyTypeValue,
          purpose: purposeValue,
          priority: 'Medium',
          status: 'New'
        }
      }).filter(lead => lead.phone) // filter out completely empty rows

      await api.post("/inquiries/bulk", mappedLeads)
      toast.success(`${mappedLeads.length} leads imported successfully!`)
      
      // Reset
      setOpen(false)
      setStep("upload")
      setRawJson([])
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to import leads")
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const resetState = () => {
    if (!open) {
      setStep("upload")
      setRawJson([])
      setHeaders([])
      setMapping({ name: "", phone: "", city: "", propertyType: "", budget: "", purpose: "" })
    }
  }

  const onOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (!isOpen) {
      setTimeout(resetState, 300)
    }
  }

  const renderMappingSelect = (fieldKey, label, required = false) => (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Select 
        value={mapping[fieldKey]} 
        onValueChange={(val) => setMapping(prev => ({ ...prev, [fieldKey]: val === "skip" ? "" : val }))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select column..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="skip" className="text-muted-foreground italic">-- Skip this field --</SelectItem>
            {headers.map((h, i) => (
              <SelectItem key={i} value={h}>{h}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          <IconUpload className="mr-1.5 size-4" />
          <span>Import Leads</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={step === "mapping" ? "sm:max-w-[600px]" : ""}>
        <DialogHeader>
          <DialogTitle>Import Leads</DialogTitle>
          <DialogDescription>
            {step === "upload" 
              ? "Upload a Facebook Leads Excel (.xlsx) file to import into the CRM." 
              : "Map the columns from your Excel file to the CRM lead fields."}
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 bg-muted/30">
              <IconFileSpreadsheet className="size-12 text-muted-foreground mb-4" />
              <Button onClick={() => fileInputRef.current?.click()}>
                Select Excel File
              </Button>
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <p className="mt-4 text-xs text-muted-foreground">
                Supported formats: .xlsx, .xls, .csv
              </p>
            </div>
          </div>
        )}

        {step === "mapping" && (
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="bg-primary/10 text-primary p-3 rounded-md text-sm font-medium flex items-center gap-2 mb-2">
              <IconCheck className="size-4" />
              Found {rawJson.length} rows. Please verify column mapping below.
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {renderMappingSelect("name", "Customer Name", true)}
              {renderMappingSelect("phone", "Phone Number", true)}
              {renderMappingSelect("city", "City")}
              {renderMappingSelect("propertyType", "Property Type / Interest")}
              {renderMappingSelect("budget", "Budget Range")}
              {renderMappingSelect("purpose", "Purpose of Purchase")}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          {step === "mapping" && (
            <Button onClick={handleImport} disabled={loading || !mapping.name || !mapping.phone}>
              {loading ? <IconLoader2 className="mr-2 size-4 animate-spin" /> : <IconUpload className="mr-2 size-4" />}
              Import {rawJson.length} Leads
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
