import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function PillBadge({
  tag = "Tasks",
  label = "Manage Smarter, Together",
  children,
  to,
  href,
  onClick,
  showArrow = true,
  icon: Icon = ArrowRight,
  className,
  tagClassName,
  labelClassName,
  ...props
}) {
  const content = (
    <>
      {tag && (
        <span
          className={cn(
            "bg-[#0f172a] text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide shrink-0",
            tagClassName
          )}
        >
          {tag}
        </span>
      )}
      <span className={cn("text-slate-700 font-medium text-xs sm:text-sm pr-1", labelClassName)}>
        {children || label}
      </span>
      {showArrow && Icon && (
        <Icon className="h-3.5 w-3.5 text-slate-800 group-hover:translate-x-0.5 transition-transform shrink-0" />
      )}
    </>
  )

  const containerClasses = cn(
    "inline-flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white/90 backdrop-blur-md p-1 pr-3.5 text-xs sm:text-sm font-medium text-slate-800 shadow-sm transition-all hover:border-slate-300 hover:shadow-md cursor-pointer group select-none",
    className
  )

  if (to) {
    return (
      <Link to={to} className={containerClasses} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={containerClasses} {...props}>
        {content}
      </a>
    )
  }

  return (
    <div onClick={onClick} className={containerClasses} {...props}>
      {content}
    </div>
  )
}

export default PillBadge
