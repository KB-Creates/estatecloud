import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  IconPlus, 
  IconBuilding, 
  IconSmartHome, 
  IconFileCertificate, 
  IconCalendarCheck, 
  IconTool, 
  IconReceipt2, 
  IconReceiptOff 
} from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"
import { ScrollArea } from "@/components/ui/scroll-area"

export function QuickCreateModal({ trigger }) {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  const quickActions = [
    {
      title: "New Property",
      description: "Register a new building or land.",
      icon: <IconBuilding className="size-6 text-blue-500" />,
      url: "/add-property",
    },
    {
      title: "Add Unit",
      description: "Create a room or floor in a property.",
      icon: <IconSmartHome className="size-6 text-indigo-500" />,
      url: "/units",
    },
    {
      title: "Create Contract",
      description: "Draft a new agreement with a client.",
      icon: <IconFileCertificate className="size-6 text-emerald-500" />,
      url: "/contracts",
    },
    {
      title: "Schedule Visit",
      description: "Book a property tour for a lead.",
      icon: <IconCalendarCheck className="size-6 text-amber-500" />,
      url: "/bookings",
    },
    {
      title: "Log Maintenance",
      description: "Report a repair or service task.",
      icon: <IconTool className="size-6 text-rose-500" />,
      url: "/maintenance",
    },
    {
      title: "Collect Payment",
      description: "Record a new rent or fee payment.",
      icon: <IconReceipt2 className="size-6 text-cyan-500" />,
      url: "/payments/new",
    },
    {
      title: "Record Expense",
      description: "Log a business or maintenance cost.",
      icon: <IconReceiptOff className="size-6 text-slate-500" />,
      url: "/expenses",
    }
  ]

  const handleAction = (url) => {
    setOpen(false)
    navigate(url)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="gap-2 rounded-full h-9 px-4">
            <IconPlus className="size-4" />
            Quick Create
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Quick Create</DialogTitle>
          <DialogDescription>
            Choose an action to quickly add a new record to your system.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70dvh] px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleAction(action.url)}
                className="flex flex-col items-start gap-2 p-4 rounded-xl border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-background border group-hover:border-primary/50 transition-colors">
                  {action.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm tracking-tight">{action.title}</span>
                  <span className="text-xs text-muted-foreground leading-tight">{action.description}</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
