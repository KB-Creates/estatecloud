import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCash, IconClock, IconUsers, IconWallet } from "@tabler/icons-react"
import { useSettings } from "@/context/SettingsContext"

export function PayrollStats({ stats }) {
  const { getCurrencySymbol } = useSettings()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-primary/5 border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Staff</CardTitle>
          <div className="p-2 bg-primary/10 rounded-lg">
            <IconUsers className="size-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.count || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Active on payroll</p>
        </CardContent>
      </Card>
 
      <Card className="bg-emerald-500/5 border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Paid This Period</CardTitle>
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <IconCash className="size-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getCurrencySymbol()}{(stats.totalPaid || 0).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1 text-emerald-600">Disbursed amount</p>
        </CardContent>
      </Card>
 
      <Card className="bg-amber-500/5 border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Dues</CardTitle>
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <IconClock className="size-4 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getCurrencySymbol()}{(stats.totalPending || 0).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1 text-amber-600">Awaiting payment</p>
        </CardContent>
      </Card>
 
      <Card className="bg-blue-500/5 border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Net Liability</CardTitle>
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <IconWallet className="size-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getCurrencySymbol()}{((stats.totalPaid || 0) + (stats.totalPending || 0)).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Total payroll volume</p>
        </CardContent>
      </Card>
    </div>
  )
}

