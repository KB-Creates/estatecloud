import { Badge } from "@/components/ui/badge"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export function TrendingBadge({ label, trend = "up", className }) {
  const isUp = trend === "up"
  const Icon = isUp ? IconTrendingUp : IconTrendingDown
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "gap-1 font-medium px-2 py-0.5 h-6",
        isUp 
          ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500/30 dark:bg-emerald-500/10" 
          : "text-rose-600 border-rose-200 bg-rose-50 dark:text-rose-400 dark:border-rose-500/30 dark:bg-rose-500/10",
        className
      )}
    >
      <Icon className="size-3" />
      {label}
    </Badge>
  )
}
