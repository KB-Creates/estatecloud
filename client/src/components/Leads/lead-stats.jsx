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
import { IconTrendingUp, IconUsers, IconMessageDots, IconBolt } from "@tabler/icons-react"

export function LeadStats({ leads }) {
  const totalLeads = leads.length
  const newLeads = leads.filter(i => i.status === 'New').length
  const contacted = leads.filter(i => i.status === 'Contacted').length
  const qualified = leads.filter(i => i.status === 'Qualified' || i.status === 'Converted').length

  const conversionRate = totalLeads > 0 
    ? ((leads.filter(i => i.status === 'Converted').length / totalLeads) * 100).toFixed(1)
    : 0

  return (
    <div className="grid grid-cols-4 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Leads</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalLeads}
          </CardTitle>
          <CardAction>
            <IconUsers className="size-5 text-primary" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Overall leads received</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Leads</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {newLeads}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
              <IconBolt className="size-3 mr-1" />
              New
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Leads awaiting first contact</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Qualified Leads</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {qualified}
          </CardTitle>
          <CardAction>
            <TrendingBadge label={`${qualified > 0 ? "Up" : "Stable"}`} trend="up" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Leads that are high potential</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Conversion Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {conversionRate}%
          </CardTitle>
          <CardAction>
            <IconMessageDots className="size-5 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Percentage of leads converted</div>
        </CardFooter>
      </Card>
    </div>
  )
}
