import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { toast } from "sonner"
import api from "@/lib/api"
import { useSettings } from "@/context/SettingsContext"
import { 
  IconLoader2, 
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
import { 
  Empty, 
  EmptyContent, 
  EmptyDescription, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle 
} from "@/components/ui/empty"
import { ReusableDataTable } from "@/components/ui/reusable-data-table"
import { PaymentStats } from "@/components/Finance/payment-stats"
import { PaymentCellViewer } from "@/components/Finance/payment-cell-viewer"

export default function PaymentsPage() {
  const navigate = useNavigate()
  const { getCurrencySymbol } = useSettings()
  const currencySymbol = getCurrencySymbol()
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState({ totalCollected: 0, totalDues: 0, totalRecords: 0, thisMonthCollected: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
    fetchStats()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await api.get('/payments')
      setPayments(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/payments/stats')
      setStats(response.data)
    } catch (error) {
      toast.error("Failed to load payment statistics")
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/payments/${id}`)
      toast.success("Payment record deleted")
      fetchPayments()
      fetchStats()
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  const columns = [
    {
      accessorKey: "client",
      header: "Client",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <PaymentCellViewer payment={row.original} triggerLabel={row.original.client} onUpdate={fetchPayments} />
          <span className="text-[10px] text-muted-foreground uppercase">{row.original.verificationCode}</span>
        </div>
      ),
    },
    {
      accessorKey: "property",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.original.property?.title || "N/A"}</span>
          <span className="text-xs text-muted-foreground">Unit {row.original.unit?.unitNumber || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "paymentType",
      header: "Type",
      cell: ({ row }) => <span className="text-sm">{row.original.paymentType}</span>,
    },
    {
        accessorKey: "receivedAmount",
        header: "Amount",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-bold">{currencySymbol}{row.original.receivedAmount.toLocaleString()}</span>
            {row.original.balance > 0 && (
                <span className="text-[10px] text-destructive">Due: {currencySymbol}{row.original.balance.toLocaleString()}</span>
            )}
          </div>
        ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'Paid' ? 'success' : row.original.status === 'Partial' ? 'warning' : 'destructive'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{format(new Date(row.original.createdAt), "MMM dd, yyyy")}</span>
        ),
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
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="gap-2" onClick={() => navigate(`/payments/edit/${row.original._id}`)}>
                <IconEdit className="size-4" />
                Edit Record
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteConfirm 
                title="Delete Payment Record?"
                description="This record will be permanently removed from financial history."
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
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">Manage records and financial transactions.</p>
        </div>
      </div>

      <PaymentStats stats={stats} />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : payments.length === 0 ? (
        <Empty className="rounded-2xl border-2 border-dashed bg-muted/50">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconReceipt2 className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyTitle>No payments yet.</EmptyTitle>
            <EmptyDescription>
              Start tracking your income by logging your first payment.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={() => navigate('/payments/new')}>
              Add Payment
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ReusableDataTable 
          data={payments} 
          columns={columns} 
          filterColumn="client" 
          filterPlaceholder="Search clients..."
          actions={
            <Button onClick={() => navigate('/payments/new')} className="gap-2">
              <IconPlus className="size-4" />
              Collect Payment
            </Button>
          }
        />
      )}
    </div>
  )
}
