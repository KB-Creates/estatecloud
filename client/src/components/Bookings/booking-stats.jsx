import { TrendingBadge } from "@/components/ui/trending-badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconCalendarCheck, IconClock, IconMapPin, IconUserCheck } from "@tabler/icons-react"

export function BookingStats({ bookings }) {
  const totalVisits = bookings.length
  const confirmed = bookings.filter(b => b.status === 'Confirmed').length
  const pending = bookings.filter(b => b.status === 'Pending Request').length
  const completed = bookings.filter(b => b.status === 'Completed').length

  return (
    <div className="grid grid-cols-4 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Visits</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalVisits}
          </CardTitle>
          <CardAction>
            <IconCalendarCheck className="size-5 text-primary" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Total scheduled viewings</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Confirmed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {confirmed}
          </CardTitle>
          <CardAction>
            <TrendingBadge label="Active" trend="up" />
          </CardAction>
        </CardHeader>
        <CardHeader className="pt-0">
           <div className="text-muted-foreground text-sm">Secured appointments</div>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Request</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pending}
          </CardTitle>
          <CardAction>
             <IconClock className="size-5 text-amber-500" />
          </CardAction>
        </CardHeader>
        <CardHeader className="pt-0">
           <div className="text-muted-foreground text-sm">Awaiting agent response</div>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {completed}
          </CardTitle>
          <CardAction>
             <IconUserCheck className="size-5 text-emerald-500" />
          </CardAction>
        </CardHeader>
        <CardHeader className="pt-0">
           <div className="text-muted-foreground text-sm">Successful property tours</div>
        </CardHeader>
      </Card>
    </div>
  )
}
