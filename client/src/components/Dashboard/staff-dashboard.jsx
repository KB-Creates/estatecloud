import React from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SalesOverview } from "@/components/sales-overview"
import { RecentActivity } from "@/components/recent-activity"
import { BookingTable } from "@/components/Bookings/booking-table"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { TrendingBadge } from "@/components/ui/trending-badge"
import { 
  IconTools, 
  IconFileText, 
  IconBuildingCommunity, 
  IconCalendar,
  IconClock
} from "@tabler/icons-react"

export default function StaffDashboard({ data, user }) {
  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent p-6 rounded-2xl border border-violet-500/10 shadow-xs backdrop-blur-md">
        <h2 className="text-2xl font-bold text-foreground">Assalam-o-Alaikum, {user?.name}!</h2>
        <p className="text-muted-foreground text-sm mt-1">Here is your daily operational summary. Manage pending maintenance issues, oversee active tenant leases, and track recent checkins.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Maintenance */}
        <Card className={`bg-gradient-to-t to-card border shadow-xs relative overflow-hidden ${stats?.pendingMaintenance > 0 ? 'from-rose-500/5 border-rose-500/20' : 'from-primary/5'}`}>
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Pending Maintenance
              <IconTools className={`size-5 opacity-80 ${stats?.pendingMaintenance > 0 ? 'text-rose-500 animate-pulse' : 'text-primary'}`} />
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight mt-1">
              {stats?.pendingMaintenance || 0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0 flex justify-between items-center w-full">
            <span>Requests needing attention</span>
            {stats?.pendingMaintenance > 0 && <TrendingBadge label="Urgent" trend="down" />}
          </CardFooter>
        </Card>

        {/* Card 2: Active Contracts */}
        <Card className="bg-gradient-to-t from-violet-500/5 to-card border shadow-xs relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Active Contracts
              <IconFileText className="size-5 text-violet-500 opacity-80" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight mt-1">
              {stats?.activeContracts || 0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Leases currently active in PMS
          </CardFooter>
        </Card>

        {/* Card 3: Managed Properties */}
        <Card className="bg-gradient-to-t from-primary/5 to-card border shadow-xs relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Managed Properties
              <IconBuildingCommunity className="size-5 text-primary opacity-80" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight mt-1">
              {stats?.activeProperties || 0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Units listed across all domains
          </CardFooter>
        </Card>

        {/* Card 4: Total Bookings */}
        <Card className="bg-gradient-to-t from-emerald-500/5 to-card border shadow-xs relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              System Bookings
              <IconCalendar className="size-5 text-emerald-500 opacity-80" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight mt-1">
              {stats?.totalBookings || 0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Total bookings in current database
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
        <h3 className="text-lg font-semibold mb-4 text-foreground px-1">Active Booking Registrations</h3>
        <BookingTable bookings={data?.recentBookings || []} />
      </div>
    </div>
  );
}
