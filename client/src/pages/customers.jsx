import { useState, useEffect } from "react"
import api from "@/lib/api"
import { IconLoader2, IconUsers, IconPlus, IconUserCheck, IconUserX } from "@tabler/icons-react"
import { toast } from "sonner"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { CustomerTable } from "@/components/Customers/customer-table"
import { AddCustomerModal } from "@/components/Customers/add-customer-modal"
import { useAuth } from "@/context/AuthContext"
import { socket } from "@/lib/socket"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingBadge } from "@/components/ui/trending-badge"

export default function CustomersPage() {
  const { hasPermission } = useAuth()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    socket.on("users_updated", () => {
      fetchCustomers()
    })
    return () => {
      socket.off("users_updated")
    }
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users?role=Customer')
      const data = Array.isArray(response.data) ? response.data : (response.data.users || [])
      setCustomers(data.filter(u => u.role?.toLowerCase() === 'customer'))
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedCustomer(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    setSelectedCustomer(item)
    setIsModalOpen(true)
  }

  const handleBulkDelete = async (ids) => {
    try {
      const toastId = toast.loading("Deleting selected customers...")
      await Promise.all(ids.map(id => api.delete(`/users/${id}`)))
      toast.dismiss(toastId)
      toast.success("Selected customers deleted successfully")
      fetchCustomers()
    } catch (error) {
      toast.error("Failed to delete selected customers")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Manage your property customers, tenants, and leads.</p>
        </div>
        {hasPermission('customers', 'create') && (
          <Button onClick={handleAdd} className="gap-2 rounded-full px-5 h-11">
            <IconPlus className="size-4" />
            Add New Customer
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {customers.length}
            </CardTitle>
            <CardAction>
              <IconUsers className="size-5 text-primary" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Registered customers in system</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active Customers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {customers.filter(c => c.status === 'Active').length}
            </CardTitle>
            <CardAction>
              <IconUserCheck className="size-5 text-emerald-500" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground flex items-center gap-1">
                <TrendingBadge trend="up" label="Active" />
                <span>current status</span>
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Inactive / Banned</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {customers.filter(c => c.status !== 'Active').length}
            </CardTitle>
            <CardAction>
              <IconUserX className="size-5 text-destructive" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Customers requiring attention</div>
          </CardFooter>
        </Card>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : customers.length === 0 ? (
        <Empty className="rounded-2xl border-2 border-dashed bg-muted/50">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconUsers className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No customers found.</EmptyTitle>
            <EmptyDescription>
              Start by adding your first customer to the system.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {hasPermission('customers', 'create') && (
              <Button variant="outline" className="rounded-full" onClick={handleAdd}>
                Add Your First Customer
              </Button>
            )}
          </EmptyContent>
        </Empty>
      ) : (
        <CustomerTable 
          customers={customers} 
          onUpdate={fetchCustomers}
          onEdit={hasPermission('customers', 'edit') ? handleEdit : undefined}
          onDelete={hasPermission('customers', 'delete') ? (id) => handleBulkDelete([id]) : undefined}
          onBulkDelete={hasPermission('customers', 'delete') ? handleBulkDelete : undefined}
        />
      )}

      <AddCustomerModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSuccess={fetchCustomers} 
        initialData={selectedCustomer}
      />
    </div>
  )
}
