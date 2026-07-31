import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserMenu } from "./user-menu"
import { AppBreadcrumb } from "./app-breadcrumb"
import NotificationsWithActions from "@/components/notifications-center";
import { GlobalSearch } from "./global-search"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/60 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex items-center h-14 pr-6 gap-4 px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="h-4 w-1 border-l "></div>
        <AppBreadcrumb />
        <div className="ml-auto flex items-center gap-3">
          <GlobalSearch />
          <NotificationsWithActions />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}