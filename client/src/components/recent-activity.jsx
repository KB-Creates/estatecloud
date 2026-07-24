"use client"

import * as React from "react"
import { formatDistanceToNow } from "date-fns"
import {
  IconCreditCard,
  IconMessageCircle,
  IconTool,
  IconCircleFilled,
  IconHome,
  IconBuilding,
  IconReceipt,
  IconCalendar,
  IconFileText,
  IconWallet,
  IconUserPlus
} from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSettings } from "@/context/SettingsContext"

const iconMap = {
  payment: <IconCreditCard className="size-4 text-emerald-500" />,
  inquiry: <IconMessageCircle className="size-4 text-blue-500" />,
  lead: <IconMessageCircle className="size-4 text-blue-500" />,
  maintenance: <IconTool className="size-4 text-amber-500" />,
  unit: <IconBuilding className="size-4 text-purple-500" />,
  property: <IconHome className="size-4 text-indigo-500" />,
  expense: <IconReceipt className="size-4 text-rose-500" />,
  booking: <IconCalendar className="size-4 text-teal-500" />,
  contract: <IconFileText className="size-4 text-blue-500" />,
  payroll: <IconWallet className="size-4 text-emerald-600" />,
  user: <IconUserPlus className="size-4 text-sky-500" />,
}

export function RecentActivity({ activity = [] }) {
  const { getCurrencySymbol } = useSettings()
  const currencySymbol = getCurrencySymbol()

  return (
    <Card className="w-full max-h-[950px] overflow-y-auto">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates from across your properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activity.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No recent activity found.
            </div>
          ) : (
            activity.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="mt-1 bg-muted p-2 rounded-full">
                  {iconMap[item.icon] || <IconCircleFilled className="size-4" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.description ? item.description.replace(/\$/g, currencySymbol) : ""}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 font-medium">
                    by {item.user}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                  {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
