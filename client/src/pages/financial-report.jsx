import React, { useState, useEffect } from "react"
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Wallet,
  Receipt,
  PieChart,
  MoreHorizontal,
  ChevronDown,
  Loader2,
  Calendar as CalendarIcon,
  X
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardAction,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts"
import { TrendingBadge } from "@/components/ui/trending-badge"
import api from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useSettings } from "@/context/SettingsContext"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { toast } from "sonner"

export default function FinancialReportPage() {
  const { getCurrencySymbol } = useSettings()
  const [year, setYear] = useState("2026")
  const [dateRange, setDateRange] = useState(undefined)
  const [rangeOpen, setRangeOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState({
    summary: {
      totalReceipts: 0,
      operatingOutflow: 0,
      netProfit: 0,
      profitMargin: "0.0",
      reserved: 0
    },
    chartData: [],
    ledgerData: [],
    breakdown: {
      salaries: 0,
      operating: 0,
      commissions: 0
    }
  })

  const fetchReport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (dateRange?.from) params.set("from", dateRange.from.toISOString())
      if (dateRange?.to) params.set("to", dateRange.to.toISOString())
      if (!dateRange?.from && !dateRange?.to) params.set("year", year)

      const response = await api.get(`/reports/financial?${params.toString()}`)
      setReportData(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load financial report")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [year, dateRange])

  const customDateLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
      : format(dateRange.from, "MMM d, yyyy")
    : "Custom Date"

  const handleRangeSelect = (range) => {
    setDateRange(range)
    if (range?.from) {
      setRangeOpen(false)
    }
  }

  const formatCurrency = (value) => {
    return `${getCurrencySymbol()}${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0)}`
  }

  return (
    <div className="flex flex-col gap-6 p-1 md:p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Report</h1>
          <p className="text-muted-foreground">Detailed overview of your property portfolio's financial performance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Popover open={rangeOpen} onOpenChange={setRangeOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 min-w-[180px] justify-between">
                <span className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="truncate max-w-[120px] text-left">{customDateLabel}</span>
                </span>
                {dateRange?.from ? (
                  <span
                    role="button"
                    tabIndex={0}
                    className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDateRange(undefined)
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </span>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleRangeSelect}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Receipts</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? <Skeleton className="h-8 w-24" /> : formatCurrency(reportData.summary.totalReceipts)}
            </CardTitle>
            <CardAction>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                <Receipt className="h-5 w-5" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Gross Income • FY {year}</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Operating Outflow</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? <Skeleton className="h-8 w-24" /> : formatCurrency(reportData.summary.operatingOutflow)}
            </CardTitle>
            <CardAction>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
                <TrendingDown className="h-5 w-5" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Payroll + Expenses • FY {year}</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Net Profit</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? <Skeleton className="h-8 w-24" /> : formatCurrency(reportData.summary.netProfit)}
            </CardTitle>
            <CardAction>
              <TrendingBadge trend="up" label={`${reportData.summary.profitMargin}%`} />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Profit Margin • FY {year}</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Reserved (Tax/Misc)</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? <Skeleton className="h-8 w-24" /> : formatCurrency(reportData.summary.reserved)}
            </CardTitle>
            <CardAction>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                <Wallet className="h-5 w-5" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Est. 20% Provision • FY {year}</div>
          </CardFooter>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenditure Chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue vs Expenditure</CardTitle>
            <CardDescription>Comparing monthly cash flow performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#888', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#888', fontSize: 12 }}
                      tickFormatter={(value) => `${getCurrencySymbol()}${value / 1000}k`}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Legend verticalAlign="top" align="right" iconType="circle" />
                    <Bar 
                      name="Income" 
                      dataKey="income" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]} 
                      barSize={30}
                    />
                    <Bar 
                      name="Expense" 
                      dataKey="expense" 
                      fill="#f97316" 
                      radius={[4, 4, 0, 0]} 
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Breakdown & Health Indicator */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Outflow Source</CardTitle>
              <CardDescription>Monthly expenditure breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">Staff Salaries</span>
                </div>
                <span className="text-sm font-bold">{formatCurrency(reportData.breakdown.salaries)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-sm font-medium">Operating Expenses</span>
                </div>
                <span className="text-sm font-bold">{formatCurrency(reportData.breakdown.operating)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-sm font-medium">Agent Commissions</span>
                </div>
                <span className="text-sm font-bold">{formatCurrency(reportData.breakdown.commissions)}</span>
              </div>
              <div className="pt-4 border-t border-dashed">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Total Spent</span>
                  <span className="text-lg font-bold">{formatCurrency(reportData.summary.operatingOutflow)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-l-4 border-l-green-500 bg-green-50/20 dark:bg-green-900/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Financial Health Indicator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold">95</span>
                <span className="text-muted-foreground">/ 100</span>
                <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Efficiency Score
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your current profit margin of <span className="font-bold text-foreground">{reportData.summary.profitMargin}%</span> is considered 
                <span className="font-bold text-green-600 mx-1">Healthy</span> 
                compared to industry standards.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Ledger Section */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
          <div>
            <CardTitle>Detailed Ledger Digest</CardTitle>
            <CardDescription>Monthly performance breakdown</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-bold">Accounting Period</TableHead>
                  <TableHead className="font-bold">Revenue Inflow</TableHead>
                  <TableHead className="font-bold">Total Expenditure</TableHead>
                  <TableHead className="font-bold">Gains / Losses</TableHead>
                  <TableHead className="text-right font-bold">Yield</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  reportData.ledgerData.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/10 transition-colors">
                      <TableCell className="font-medium">{row.period}</TableCell>
                      <TableCell>{formatCurrency(row.revenue)}</TableCell>
                      <TableCell>{formatCurrency(row.expenditure)}</TableCell>
                      <TableCell className={row.gains > 0 ? "text-green-600 font-medium" : row.gains < 0 ? "text-red-600" : ""}>
                        {formatCurrency(row.gains)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          parseFloat(row.yield) > 0 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                          : parseFloat(row.yield) < 0 
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-muted text-muted-foreground"
                        }`}>
                          {row.yield}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
