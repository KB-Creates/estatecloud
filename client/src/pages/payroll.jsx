import { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import api from "@/lib/api"
import { useSettings } from "@/context/SettingsContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  IconLoader2, 
  IconPlus, 
  IconWallet, 
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
import { DeleteConfirm } from "@/components/delete-confirm"
import { ReusableDataTable } from "@/components/ui/reusable-data-table"
import { PayrollStats } from "@/components/Payroll/payroll-stats"
import { AddPayrollModal } from "@/components/Payroll/add-payroll-modal"

export default function PayrollPage() {
  const { getCurrencySymbol } = useSettings()
  const [payrolls, setPayrolls] = useState([])
  const [stats, setStats] = useState({ totalPaid: 0, totalPending: 0, count: 0 })
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPayroll, setSelectedPayroll] = useState(null)

  useEffect(() => {
    fetchPayrolls()
    fetchStats()
  }, [])

  const fetchPayrolls = async () => {
    try {
      setLoading(true)
      const response = await api.get('/payroll')
      setPayrolls(response.data)
    } catch (error) {
      toast.error("Failed to load payroll records")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/payroll/stats')
      setStats(response.data)
    } catch (error) {
      console.error("Failed to load payroll stats")
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/payroll/${id}`)
      toast.success("Payroll record deleted")
      fetchPayrolls()
      fetchStats()
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  const handleEdit = (payroll) => {
    setSelectedPayroll(payroll)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedPayroll(null)
    setIsModalOpen(true)
  }

  const columns = [
    {
      accessorKey: "staff",
      header: "Staff Member",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.original.staff?.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.staff?.designation || "Staff"}</span>
        </div>
      ),
    },
    {
      accessorKey: "month",
      header: "Period",
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.original.month} {row.original.year}
        </span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Total Salary",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{getCurrencySymbol()}{row.original.totalAmount?.toLocaleString()}</span>
          <span className="text-[10px] text-muted-foreground">Base: {getCurrencySymbol()}{row.original.baseSalary?.toLocaleString()}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge 
          variant={
            row.original.status === 'Paid' ? 'success' : 
            row.original.status === 'Pending' ? 'warning' : 'secondary'
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => <span className="text-sm">{row.original.paymentMethod}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
        </span>
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
              <DropdownMenuItem className="gap-2" onClick={() => handleEdit(row.original)}>
                <IconEdit className="size-4" />
                Edit Record
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteConfirm 
                title="Delete Payroll Record?"
                description="Are you sure you want to delete this payroll entry? This cannot be undone."
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
          <h2 className="text-2xl font-bold tracking-tight">Payroll Management</h2>
          <p className="text-muted-foreground">Manage staff salaries and disbursements.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <IconPlus className="size-4" /> Generate Payroll
        </Button>
      </div>

      <PayrollStats stats={stats} />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <ReusableDataTable 
          data={payrolls} 
          columns={columns} 
          filterColumn="month" 
          filterPlaceholder="Search by month..." 
        />
      )}

      <AddPayrollModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        initialData={selectedPayroll}
        onSuccess={() => {
          fetchPayrolls()
          fetchStats()
        }}
      />
    </div>
  )
}
