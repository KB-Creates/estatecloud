import { useEffect, useState } from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SalesOverview } from "@/components/sales-overview"
import { RecentActivity } from "@/components/recent-activity"
import { BookingTable } from "@/components/Bookings/booking-table"
import { SectionCards } from "@/components/section-cards"
import api from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"

// Import Role-Specific Dashboard Views
import AgentDashboard from "@/components/Dashboard/agent-dashboard"
import OwnerDashboard from "@/components/Dashboard/owner-dashboard"
import StaffDashboard from "@/components/Dashboard/staff-dashboard"
import TenantDashboard from "@/components/Dashboard/tenant-dashboard"

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await api.get('/reports/dashboard')
        setData(response.data)
      } catch (err) {
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  // Segment dashboards dynamically by user roles
  const roleName = user?.role?.toLowerCase();
  
  if (roleName === 'agent') {
    return <AgentDashboard data={data} user={user} />;
  }
  
  if (roleName === 'owner') {
    return <OwnerDashboard data={data} user={user} />;
  }
  
  if (roleName === 'staff') {
    return <StaffDashboard data={data} user={user} />;
  }
  
  if (roleName === 'customer') {
    return <TenantDashboard data={data} user={user} />;
  }

  // Default Admin / System Owner layout
  return (
    <div className="space-y-6">
      <SectionCards stats={data?.stats} />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <ChartAreaInteractive data={data?.chartData} />
          <SalesOverview data={data?.chartData} />
        </div>
        <div className="xl:col-span-1">
          <RecentActivity activity={data?.activity} />
        </div>
      </div>

      <div className="">
         <h3 className="text-lg font-semibold mb-4 text-foreground px-4">Recent Bookings</h3>
         <BookingTable bookings={data?.recentBookings || []} />
      </div>
    </div>
  )
}