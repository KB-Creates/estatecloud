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
  IconPercentage, 
  IconCash, 
  IconAlertTriangle,
  IconReceipt2,
  IconTrendingUp
} from "@tabler/icons-react"

export default function OwnerDashboard({ data, user }) {
  const { getCurrencySymbol } = useSettings();
  const stats = data?.stats || {};
  const symbol = getCurrencySymbol();

  const formatCurrency = (val) => {
    return `${symbol}${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0)}`;
  };

  const netIncome = (stats?.totalRevenue || 0) - (stats?.totalExpenses || 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-6 rounded-2xl border border-emerald-500/10 shadow-xs backdrop-blur-md">
        <h2 className="text-2xl font-bold text-foreground">Assalam-o-Alaikum, {user?.name}!</h2>
        <p className="text-muted-foreground text-sm mt-1">Here is the financial performance and occupancy breakdown of your real estate investment portfolio.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Properties Owned */}
        <Card className="bg-gradient-to-t from-emerald-500/5 to-card border shadow-xs relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Properties Owned
              <IconBuilding className="size-5 text-emerald-500 opacity-80" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight mt-1">
              {stats?.activeProperties || 0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Total active properties in PMS
          </CardFooter>
        </Card>

        {/* Card 2: Occupancy Rate */}
        <Card className="bg-gradient-to-t from-teal-500/5 to-card border shadow-xs relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Portfolio Occupancy
              <IconPercentage className="size-5 text-teal-500 opacity-80" />
            </CardDescription>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-3xl font-bold tracking-tight">
                {stats?.occupancyRate || 0}%
              </span>
              <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 rounded-full transition-all duration-500" 
                  style={{ width: `${stats?.occupancyRate || 0}%` }}
                />
              </div>
            </div>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Percentage of rented units
          </CardFooter>
        </Card>

        {/* Card 3: Net Profit */}
        <Card className="bg-gradient-to-t from-primary/5 to-card border shadow-xs relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Net profit
              <IconCash className="size-5 text-primary opacity-80" />
            </CardDescription>
            <CardTitle className={`text-3xl font-bold tracking-tight mt-1 ${netIncome >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formatCurrency(netIncome)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Total Rent minus maintenance costs
          </CardFooter>
        </Card>

        {/* Card 4: Outstanding Rents */}
        <Card className={`bg-gradient-to-t to-card border shadow-xs relative overflow-hidden ${stats?.outstandingDues > 0 ? 'from-rose-500/5 border-rose-500/20' : 'from-primary/5'}`}>
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Outstanding Rents
              <IconAlertTriangle className={`size-5 opacity-80 ${stats?.outstandingDues > 0 ? 'text-rose-500' : 'text-muted-foreground'}`} />
            </CardDescription>
            <CardTitle className={`text-3xl font-bold tracking-tight mt-1 ${stats?.outstandingDues > 0 ? 'text-rose-500' : 'text-foreground'}`}>
              {formatCurrency(stats?.outstandingDues)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0 flex justify-between items-center w-full">
            <span>Pending tenant payments</span>
            {stats?.outstandingDues > 0 && <TrendingBadge label="Attention" trend="down" />}
          </CardFooter>
        </Card>
      </div>

      {/* Main Income Chart / Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <Card className="p-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <IconReceipt2 className="size-5 text-emerald-500" />
                Earnings & Maintenance Progression
              </CardTitle>
              <CardDescription>Visual chart comparing your rental income against logged maintenance expenses.</CardDescription>
            </CardHeader>
            <ChartAreaInteractive data={data?.chartData} />
          </Card>
          <SalesOverview data={data?.chartData} />
        </div>
        <div className="xl:col-span-1">
          <RecentActivity activity={data?.activity} />
        </div>
      </div>

      {/* Recent Bookings List */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground px-1">Bookings on your Properties</h3>
        <BookingTable bookings={data?.recentBookings || []} />
      </div>
    </div>
  );
}
