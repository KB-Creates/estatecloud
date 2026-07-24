import { TrendingBadge } from "@/components/ui/trending-badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { useSettings } from "@/context/SettingsContext"

export function SectionCards({ stats }) {
  const { getCurrencySymbol } = useSettings();

  const formatCurrency = (val) => {
    return `${getCurrencySymbol()}${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0)}`;
  };

  return (
    <div className="grid grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(stats?.totalRevenue)}
          </CardTitle>
          <CardAction>
            <TrendingBadge label="+0%" trend="up" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-3 font-medium">
            Lifetime Earnings <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Calculated from all payments
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Bookings</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.totalBookings || 0}
          </CardTitle>
          <CardAction>
            <TrendingBadge label="+0%" trend="up" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-3 font-medium">
            Properties Booked <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total successful bookings
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Properties</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.activeProperties || 0}
          </CardTitle>
          <CardAction>
            <TrendingBadge label="+0%" trend="up" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Managed Units <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Currently in portfolio</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Open Leads</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.openInquiries || 0}
          </CardTitle>
          <CardAction>
            <TrendingBadge label="New" trend="up" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pending Leads <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Awaiting response</div>
        </CardFooter>
      </Card>
    </div>
  )
}
