import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import api from "@/lib/api"
import { 
  IconLoader2, 
  IconAlertCircle, 
  IconReceipt2, 
  IconPlus, 
  IconDotsVertical, 
  IconEdit, 
  IconTrash 
} from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DeleteConfirm } from "@/components/delete-confirm"
import { AddPaymentModal } from "@/components/Finance/add-payment-modal"
import { 
  Empty, 
  EmptyContent, 
  EmptyDescription, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle 
} from "@/components/ui/empty"
import { ReusableDataTable } from "@/components/ui/reusable-data-table"
import { PaymentCellViewer } from "@/components/Finance/payment-cell-viewer"

import { useSettings } from '@/context/SettingsContext';

export default function DueCollectionPage() {
  const navigate = useNavigate()
  const { getCurrencySymbol } = useSettings()
  const [dues, setDues] = useState([])
  const [loading, setLoading] = useState(true)
  const [collectPaymentOpen, setCollectPaymentOpen] = useState(false)
  const [selectedDueRecord, setSelectedDueRecord] = useState(null)

  useEffect(() => {
    fetchDues()
  }, [])

  const fetchDues = async () => {
    try {
      setLoading(true)
      const response = await api.get('/payments')
      // Filter payments that have a balance > 0
      const duePayments = response.data.filter(p => p.balance > 0)
      setDues(duePayments)
    } catch (error) {
      toast.error("Failed to load due collections")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/payments/${id}`)
      toast.success("Payment record deleted")
      fetchDues()
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  const columns = [
    {
        accessorKey: "verificationCode",
        header: "Invoice",
        cell: ({ row }) => <PaymentCellViewer payment={row.original} onUpdate={fetchDues} />,
    },
    {
      accessorKey: "client",
      header: "Client",
      cell: ({ row }) => <span className="font-bold">{row.original.client}</span>,
    },
    {
      accessorKey: "property",
      header: "Property",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.original.property?.title || "N/A"}</span>
          <span className="text-xs text-muted-foreground italic">Unit {row.original.unit?.unitNumber || "N/A"}</span>
        </div>
      ),
    },
    {
        accessorKey: "balance",
        header: "Amount Due",
        cell: ({ row }) => (
          <span className="font-bold text-destructive">{getCurrencySymbol()}{row.original.balance?.toLocaleString()}</span>
        ),
    },
    {
        accessorKey: "paymentType",
        header: "Type",
        cell: ({ row }) => <Badge variant="outline" className="font-normal">{row.original.paymentType}</Badge>,
    },
    {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <IconDotsVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-45">
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => {
                    setSelectedDueRecord(row.original)
                    setCollectPaymentOpen(true)
                  }}
                >
                  <IconReceipt2 className="size-4" />
                  Collect Payment
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={() => navigate(`/payments/edit/${row.original._id}`)}>
                  <IconEdit className="size-4" />
                  Edit Record
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteConfirm 
                  title="Delete Payment Record?"
                  description="This will permanently remove this due record from history."
                  onConfirm={() => handleDelete(row.original._id)}
                >
                  <DropdownMenuItem 
                    className="gap-2 text-destructive" 
                    onSelect={(e) => e.preventDefault()}
                  >
                    <IconTrash className="size-4" />
                    Delete Record
                  </DropdownMenuItem>
                </DeleteConfirm>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      <AddPaymentModal
        open={collectPaymentOpen}
        onOpenChange={setCollectPaymentOpen}
        initialContractId={selectedDueRecord?.contract?._id || selectedDueRecord?.contract?.id || selectedDueRecord?.contractId || ""}
        sourcePayment={selectedDueRecord}
        onSuccess={fetchDues}
      />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Due Collection</h2>
          <p className="text-muted-foreground">List of outstanding balances requiring collection.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : dues.length === 0 ? (
        <Empty className="rounded-2xl border-2 border-dashed bg-muted/50">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconAlertCircle className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyTitle>No dues found.</EmptyTitle>
            <EmptyDescription>
              All payments are currently up to date.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ReusableDataTable 
          data={dues} 
          columns={columns} 
          filterColumn="client" 
          filterPlaceholder="Search clients..."
        />
      )}
    </div>
  )
}
