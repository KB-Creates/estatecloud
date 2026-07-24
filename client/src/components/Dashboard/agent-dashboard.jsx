import React from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SalesOverview } from "@/components/sales-overview"
import { RecentActivity } from "@/components/recent-activity"
import { BookingTable } from "@/components/Bookings/booking-table"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { TrendingBadge } from "@/components/ui/trending-badge"
import { useSettings } from "@/context/SettingsContext"
import { 
  IconBuilding, 
  IconUsers, 
  IconCash, 
  IconCalendarCheck,
  IconTrendingUp
} from "@tabler/icons-react"

export default function AgentDashboard({ data, user }) {
  const { getCurrencySymbol } = useSettings();
  const stats = data?.stats || {};
  const symbol = getCurrencySymbol();

  const formatCurrency = (val) => {
    return `${symbol}${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0)}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/10 shadow-xs backdrop-blur-md">
        <h2 className="text-2xl font-bold text-foreground">Welcome back, {user?.name}!</h2>
        <p className="text-muted-foreground text-sm mt-1">Here is a quick overview of your assigned properties, active inquiries, and personal earnings.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assigned Properties */}
        <Card className="bg-gradient-to-t from-primary/5 to-card border shadow-xs relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Assigned Properties
              <IconBuilding className="size-5 text-primary opacity-80" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight mt-1">
              {stats?.activeProperties || 0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Currently listed in your portfolio
          </CardFooter>
        </Card>

        {/* Card 2: Active Leads */}
        <Card className="bg-gradient-to-t from-primary/5 to-card border shadow-xs relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Active Leads (Inquiries)
              <IconUsers className="size-5 text-blue-500 opacity-80" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight mt-1">
              {stats?.openInquiries || 0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Assigned inquiries awaiting response
          </CardFooter>
        </Card>

        {/* Card 3: Closed Bookings */}
        <Card className="bg-gradient-to-t from-primary/5 to-card border shadow-xs relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Closed Bookings
              <IconCalendarCheck className="size-5 text-emerald-500 opacity-80" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight mt-1">
              {stats?.totalBookings || 0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Successful property deals concluded
          </CardFooter>
        </Card>

        {/* Card 4: Estimated Commission */}
        <Card className="bg-gradient-to-t from-primary/5 to-card border border-primary/20 shadow-xs relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Commission Estimate
              <IconCash className="size-5 text-yellow-500 opacity-80" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight mt-1 text-primary">
              {formatCurrency(stats?.commissionEstimate)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0 flex justify-between items-center w-full">
            <span>Based on role payroll rates</span>
            <TrendingBadge label="Commission" trend="up" />
          </CardFooter>
        </Card>
      </div>

      {/* Main Charts & Activity Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <ChartAreaInteractive data={data?.chartData} />
          <SalesOverview data={data?.chartData} />
        </div>
        <div className="xl:col-span-1">
          <RecentActivity activity={data?.activity} />
        </div>
      </div>

      {/* Recent Bookings List */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground px-1">Your Recent Property Bookings</h3>
        <BookingTable bookings={data?.recentBookings || []} />
      </div>
    </div>
  );
}
