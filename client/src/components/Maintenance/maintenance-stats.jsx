import { useSettings } from "@/context/SettingsContext"
import { Badge } from "@/components/ui/badge"
import { TrendingBadge } from "@/components/ui/trending-badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  IconTool,
  IconAlertTriangle,
  IconChecklist,
  IconCoin,
  IconBolt
} from "@tabler/icons-react"

export function MaintenanceStats({ maintenances }) {
  const { getCurrencySymbol } = useSettings()
  const totalRequests = maintenances.length
  const activeTasks = maintenances.filter(m => m.status === 'Pending' || m.status === 'In Progress').length
  const emergencyTasks = maintenances.filter(m => m.type === 'Emergency' && m.status !== 'Completed').length
  const completedTasks = maintenances.filter(m => m.status === 'Completed').length
  const totalCost = maintenances.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0)

  return (
    <div className="grid grid-cols-4 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Tasks</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeTasks}
          </CardTitle>
          <CardAction>
            <IconTool className="size-5 text-primary" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Pending and in-progress requests</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Emergency</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-600">
            {emergencyTasks}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
              <IconAlertTriangle className="size-3 mr-1" />
              High Priority
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Urgent issues requiring immediate action</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {completedTasks}
          </CardTitle>
          <CardAction>
            <TrendingBadge label={`${completedTasks > 0 ? "Up" : "Stable"}`} trend="up" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Tasks successfully resolved</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Estimated Cost</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-emerald-600">
            {getCurrencySymbol()}{totalCost.toLocaleString()}
          </CardTitle>
          <CardAction>
            <IconCoin className="size-5 text-emerald-600" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Total projected expenses for maintenance</div>
        </CardFooter>
      </Card>
    </div>
  )
}
