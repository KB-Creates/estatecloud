import { TrendingBadge } from "@/components/ui/trending-badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconReceipt2, IconWallet, IconAlertCircle, IconCalendarStats, IconDatabase } from "@tabler/icons-react"
import { useSettings } from "@/context/SettingsContext"

export function PaymentStats({ stats }) {
  const { getCurrencySymbol } = useSettings()
  const currencySymbol = getCurrencySymbol()
  return (
    <div className="grid grid-cols-4 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Collected</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currencySymbol}{stats.totalCollected?.toLocaleString() || 0}
          </CardTitle>
          <CardAction>
            <IconWallet className="size-5 text-primary" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Total revenue received</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Dues</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currencySymbol}{stats.totalDues?.toLocaleString() || 0}
          </CardTitle>
          <CardAction>
             <IconAlertCircle className="size-5 text-rose-500" />
          </CardAction>
        </CardHeader>
        <CardHeader className="pt-0">
           <div className="text-muted-foreground text-sm">Outstanding payments</div>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>This Month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currencySymbol}{stats.thisMonthCollected?.toLocaleString() || 0}
          </CardTitle>
          <CardAction>
             <IconCalendarStats className="size-5 text-blue-500" />
          </CardAction>
        </CardHeader>
        <CardHeader className="pt-0">
           <div className="text-muted-foreground text-sm">Collected in current month</div>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Records</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalRecords || 0}
          </CardTitle>
          <CardAction>
             <IconDatabase className="size-5 text-primary" />
          </CardAction>
        </CardHeader>
        <CardHeader className="pt-0">
           <div className="text-muted-foreground text-sm">Total payment entries</div>
        </CardHeader>
      </Card>
    </div>
  )
}
