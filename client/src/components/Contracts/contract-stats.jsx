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
import { IconClock, IconFileText } from "@tabler/icons-react"
import { useSettings } from "@/context/SettingsContext"

export function ContractStats({ contracts }) {
  const { getCurrencySymbol } = useSettings()
  // Calculations
  const activeLeases = contracts.filter(c => c.status === 'Active').length
  const totalRevenue = contracts.filter(c => c.status === 'Active').reduce((sum, c) => sum + (c.rentAmount || 0), 0)
  
  const expiringSoon = contracts.filter(c => {
    if (!c.endDate || c.status !== 'Active') return false
    const daysLeft = (new Date(c.endDate) - new Date()) / (1000 * 60 * 60 * 24)
    return daysLeft >= 0 && daysLeft <= 30
  }).length

  const pendingDrafts = contracts.filter(c => c.status === 'Draft' || c.status === 'Pending').length

  return (
    <div className="grid grid-cols-4 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Contracts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeLeases}
          </CardTitle>
          <CardAction>
            <TrendingBadge label="Live" trend="up" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Currently active rental agreements</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {getCurrencySymbol()}{totalRevenue.toLocaleString()}
          </CardTitle>
          <CardAction>
            <TrendingBadge label={`${totalRevenue > 0 ? "Up" : "Stable"}`} trend="up" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Monthly revenue from active leases</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Expiring Soon</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {expiringSoon}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
              <IconClock className="size-3 mr-1" />
              30 Days
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Contracts ending in the next month</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Drafts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingDrafts}
          </CardTitle>
          <CardAction>
            <IconFileText className="size-5 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Contracts awaiting signature or review</div>
        </CardFooter>
      </Card>
    </div>
  )
}