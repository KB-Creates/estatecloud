import { useEffect, useState } from "react"
import { RecentActivity } from "@/components/recent-activity"
import api from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { 
  IconActivity,
  IconRefresh
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export default function ActivitiesPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await api.get('/reports/dashboard')
      setData(response.data)
    } catch (err) {
      toast.error("Failed to load activities")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <IconActivity className="size-6 text-primary" />
            Activities Log
          </h2>
          <p className="text-muted-foreground">
            Monitor all actions and changes across your property management system
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchActivities}
          disabled={loading}
          className="gap-2"
        >
          <IconRefresh className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <RecentActivity activity={data?.activity} />
      </div>
    </div>
  )
}
