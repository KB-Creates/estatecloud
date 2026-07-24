import React from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { RecentActivity } from "@/components/recent-activity"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingBadge } from "@/components/ui/trending-badge"
import { useSettings } from "@/context/SettingsContext"
import { Link } from "react-router-dom"
import {
  IconFileText,
  IconCash,
  IconCreditCard,
  IconTools,
  IconArrowRight,
  IconCalendarWeek
} from "@tabler/icons-react"

export default function TenantDashboard({ data, user }) {
  const { getCurrencySymbol } = useSettings();
  const stats = data?.stats || {};
  const symbol = getCurrencySymbol();

  const formatCurrency = (val) => {
    return `${symbol}${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0)}`;
  };

  const myContracts = data?.myContracts || [];
  const myBookings = data?.myBookings || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent p-6 rounded-2xl border border-blue-500/10 shadow-xs backdrop-blur-md">
        <h2 className="text-2xl font-bold text-foreground">Salam, {user?.name}!</h2>
        <p className="text-muted-foreground text-sm mt-1">Welcome to your Tenant Portal. Here you can track your active leases, review rent balances, and submit maintenance tickets.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Lease Contracts */}
        <Card className="bg-gradient-to-t from-blue-500/5 to-card border shadow-xs relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Active Leases
              <IconFileText className="size-5 text-blue-500 opacity-80" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight mt-1">
              {stats?.activeContracts || 0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Your current active rental contracts
          </CardFooter>
        </Card>

        {/* Card 2: Rent Paid */}
        <Card className="bg-gradient-to-t from-emerald-500/5 to-card border shadow-xs relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Rent Paid (Lifetime)
              <IconCash className="size-5 text-emerald-500 opacity-80" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight mt-1 text-emerald-500">
              {formatCurrency(stats?.paidRent)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Total rent paid successfully
          </CardFooter>
        </Card>

        {/* Card 3: Outstanding Rent Balance */}
        <Card className={`bg-gradient-to-t to-card border shadow-xs relative overflow-hidden ${stats?.outstandingRent > 0 ? 'from-rose-500/5 border-rose-500/20' : 'from-primary/5'}`}>
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Outstanding Balance
              <IconCreditCard className={`size-5 opacity-80 ${stats?.outstandingRent > 0 ? 'text-rose-500' : 'text-muted-foreground'}`} />
            </CardDescription>
            <CardTitle className={`text-3xl font-bold tracking-tight mt-1 ${stats?.outstandingRent > 0 ? 'text-rose-500' : 'text-foreground'}`}>
              {formatCurrency(stats?.outstandingRent)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0 flex justify-between items-center w-full">
            <span>Current pending payments</span>
            {stats?.outstandingRent > 0 && <TrendingBadge label="Due Now" trend="down" />}
          </CardFooter>
        </Card>

        {/* Card 4: Open Maintenance Requests */}
        <Card className="bg-gradient-to-t from-yellow-500/5 to-card border shadow-xs relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-sm font-medium">
              Maintenance Tickets
              <IconTools className="size-5 text-yellow-500 opacity-80" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight mt-1">
              {stats?.openMaintenanceRequests || 0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Raised requests in resolution progress
          </CardFooter>
        </Card>
      </div>

      {/* Tenant Quick Actions / Shortcuts Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border shadow-xs hover:border-blue-500/50 transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-semibold flex items-center gap-2">
              <IconTools className="size-5 text-yellow-500" />
              Need Something Fixed?
            </CardTitle>
            <CardDescription className="text-xs">Raise a quick maintenance issue for your unit.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button asChild size="sm" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Link to="/maintenance">
                Submit Maintenance Request <IconArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border shadow-xs hover:border-emerald-500/50 transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-semibold flex items-center gap-2">
              <IconCash className="size-5 text-emerald-500" />
              Rent Ledger & Receipts
            </CardTitle>
            <CardDescription className="text-xs">View invoices and download paid rent statements.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button asChild size="sm" variant="outline" className="w-full border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">
              <Link to="/payments">
                View Payments History <IconArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border shadow-xs hover:border-violet-500/50 transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-semibold flex items-center gap-2">
              <IconFileText className="size-5 text-violet-500" />
              Signed Leases
            </CardTitle>
            <CardDescription className="text-xs">Verify leasing terms, dates and security deposit details.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button asChild size="sm" variant="outline" className="w-full border-violet-500/20 text-violet-500 hover:bg-violet-500/10">
              <Link to="/contracts">
                View Active Contracts <IconArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Leases, Bookings & Activity Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          {/* Active Lease Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <IconFileText className="size-5 text-blue-500" />
                Your Active Lease Overview
              </CardTitle>
              <CardDescription>Details of your current signed lease contracts.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              {myContracts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  You don't have any active rental leases listed.
                </div>
              ) : (
                myContracts.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border bg-muted/40 space-y-3">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{c.property?.title || "Property"} - Unit {c.unit?.unitNumber || "N/A"}</h4>
                        <span className="text-xs text-muted-foreground">Contract: {c.contractNumber}</span>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-none">{c.status}</Badge>
                    </div>
                    <hr className="border-muted" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Rent Amount</span>
                        <strong className="text-foreground">{formatCurrency(c.rentAmount)} / {c.billingCycle}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Deposit</span>
                        <strong className="text-foreground">{formatCurrency(c.securityDeposit)}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Start Date</span>
                        <strong className="text-foreground">{new Date(c.startDate).toLocaleDateString()}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">End Date</span>
                        <strong className="text-foreground">{c.endDate ? new Date(c.endDate).toLocaleDateString() : "Flexible"}</strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Bookings Tracker */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <IconCalendarWeek className="size-5 text-emerald-500" />
                Your Pending Property Bookings
              </CardTitle>
              <CardDescription>View status updates on properties you reserved.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              {myBookings.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No active booking reservations found.
                </div>
              ) : (
                myBookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl border bg-muted/40 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{b.property?.title || "Property"}</h4>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                        <span>Total Price: {formatCurrency(b.totalPrice)}</span>
                        <span>Advance: {formatCurrency(b.advancePayment)}</span>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-none">{b.status}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-1">
          <RecentActivity activity={data?.activity} />
        </div>
      </div>
    </div>
  );
}
