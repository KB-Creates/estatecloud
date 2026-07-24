import { useState, useEffect } from "react"
import { useSettings } from "@/context/SettingsContext"
import api from "@/lib/api"
import { IconLoader2, IconUserBolt, IconPlus, IconBriefcase } from "@tabler/icons-react"
import { toast } from "sonner"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { AddStaffModal } from "@/components/Staff/add-staff-modal"
import { StaffTable } from "@/components/Staff/staff-table"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingBadge } from "@/components/ui/trending-badge"

export default function StaffPage() {
  const { getCurrencySymbol } = useSettings()
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await api.get('/staff')
      setStaff(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedStaff(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    setSelectedStaff(item)
    setIsModalOpen(true)
  }

  const handleBulkDelete = async (ids) => {
    try {
      const toastId = toast.loading("Deleting selected staff profiles...")
      await Promise.all(ids.map(id => api.delete(`/staff/${id}`)))
      toast.dismiss(toastId)
      toast.success("Selected staff profiles deleted successfully")
      fetchStaff()
    } catch (error) {
      toast.error("Failed to delete selected staff profiles")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff Management</h2>
          <p className="text-muted-foreground">Manage your company employees, roles and payroll information.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 rounded-full shadow-lg">
          <IconPlus className="size-4" />
          Add New Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Staff</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {staff.length}
            </CardTitle>
            <CardAction>
              <IconUserBolt className="size-5 text-primary" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Total active employees</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Monthly Payroll</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {getCurrencySymbol()}{staff.reduce((acc, s) => acc + (s.basicSalary || 0), 0).toLocaleString()}
            </CardTitle>
            <CardAction>
              <IconBriefcase className="size-5 text-blue-500" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Total basic salary commitment</div>
          </CardFooter>
        </Card>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : staff.length === 0 ? (
        <Empty className="rounded-2xl border-2 border-dashed bg-muted/50">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconUserBolt className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No staff members yet.</EmptyTitle>
            <EmptyDescription>
              Start by adding your first employee to the system.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" className="rounded-full" onClick={handleAdd}>
              Add Your First Employee
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <StaffTable 
          staff={staff} 
          onUpdate={fetchStaff}
          onEdit={handleEdit}
          onBulkDelete={handleBulkDelete}
        />
      )}

      <AddStaffModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSuccess={fetchStaff} 
        initialData={selectedStaff}
      />
    </div>
  )
}
