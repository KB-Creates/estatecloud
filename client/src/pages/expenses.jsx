import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { toast } from "sonner"
import api from "@/lib/api"
import { useSettings } from "@/context/SettingsContext"
import {
  IconLoader2,
  IconReceiptOff,
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
import { ExpenseCellViewer } from "@/components/Finance/expense-cell-viewer"
import { AddExpenseModal } from "@/components/Finance/add-expense-modal"

export default function ExpensesPage() {
  const { getCurrencySymbol, formatDate } = useSettings()
  const currencySymbol = getCurrencySymbol()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const response = await api.get('/expenses')
      setExpenses(response.data)
    } catch (error) {
      toast.error("Failed to load expenses")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/expenses/${id}`)
      toast.success("Expense deleted successfully", {
        action: {
          label: "Undo",
          onClick: async () => {
            if (res.data?.trashId) {
              try {
                await api.post(`/trash/restore/${res.data.trashId}`);
                toast.success("Restored successfully");
                typeof fetchUsers === 'function' ? fetchUsers() :
                  typeof fetchUnits === 'function' ? fetchUnits() :
                    typeof fetchRoles === 'function' ? fetchRoles() :
                      typeof fetchProperties === 'function' ? fetchProperties() :
                        typeof fetchExpenses === 'function' ? fetchExpenses() :
                          typeof onUpdate === 'function' ? onUpdate() : window.location.reload();
              } catch (e) {
                toast.error("Failed to restore");
              }
            } else {
              toast.info("Cannot restore this item");
            }
          }
        }
      })
      fetchExpenses()
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  const handleEdit = (expense) => {
    setSelectedExpense(expense)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedExpense(null)
    setIsModalOpen(true)
  }

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <ExpenseCellViewer expense={row.original} onUpdate={fetchExpenses} />,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-bold text-destructive">{currencySymbol}{row.original.amount.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{format(new Date(row.original.date), "MMM dd, yyyy")}</span>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment",
      cell: ({ row }) => <span className="text-xs font-medium">{row.original.paymentMethod}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => <div className="text-muted-foreground">{formatDate ? formatDate(row.getValue("createdAt")) : new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
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
                Edit Expense
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteConfirm
                title="Delete Expense Record?"
                description="Are you sure you want to delete this expense record? This will be removed from financial logs."
                onConfirm={() => handleDelete(row.original._id)}
              >
                <DropdownMenuItem
                  className="gap-2 text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  Delete Expense
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Expense Management</h2>
          <p className="text-muted-foreground">Track business costs, utilities, and salaries.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <IconPlus className="size-4" />
          Add Expense
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : expenses.length === 0 ? (
        <Empty className="rounded-2xl border-2 border-dashed bg-muted/50">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconReceiptOff className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyTitle>No expenses yet.</EmptyTitle>
            <EmptyDescription>
              Start tracking your business spending by recording your first expense.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={handleAdd}>Record First Expense</Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ReusableDataTable
          data={expenses}
          columns={columns}
          filterColumn="title"
          filterPlaceholder="Search expenses..."
        />
      )}

      <AddExpenseModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={selectedExpense}
        onRefresh={fetchExpenses}
      />
    </div>
  )
}
