import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { IconLoader2, IconTool } from "@tabler/icons-react"
import { toast } from "sonner"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { MaintenanceStats } from "@/components/Maintenance/maintenance-stats"
import { MaintenanceTable } from "@/components/Maintenance/maintenance-table"

export default function MaintenancePage() {
  const navigate = useNavigate()
  const [maintenances, setMaintenances] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMaintenances()
  }, [])

  const fetchMaintenances = async () => {
    try {
      setLoading(true)
      const response = await api.get('/maintenance')
      setMaintenances(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Maintenance & Repairs</h2>
          <p className="text-muted-foreground">Track issues, schedule routine maintenance, and manage repair costs.</p>
        </div>
      </div>

      <MaintenanceStats maintenances={maintenances} />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : maintenances.length === 0 ? (
        <Empty className="rounded-2xl border-2 border-dashed bg-muted/50">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconTool className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyTitle>No maintenance tasks yet.</EmptyTitle>
            <EmptyDescription>
              Maintenance requests and repair logs will appear here once you add them.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" className="rounded-full" onClick={() => navigate('/maintenance/new')}>
              Log Maintenance Task
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <MaintenanceTable 
          data={maintenances} 
          onAddClick={() => navigate('/maintenance/new')} 
          onUpdate={fetchMaintenances}
        />
      )}
    </div>
  )
}
