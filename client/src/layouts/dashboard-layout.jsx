import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet, Link } from "react-router-dom"
import Footer from "@/components/footer"
import { IconDeviceDesktop, IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function DashboardLayout() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      // 1024px is Tailwind's lg breakpoint where dashboard is fully usable
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 select-none">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center flex flex-col items-center gap-6">
          {/* Desktop Icon Container */}
          <div className="size-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <IconDeviceDesktop className="size-8 stroke-[1.5]" />
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase tracking-wider">
              Desktop Access Required
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To manage properties, inquiries, and view dashboards, please open this panel on a <strong className="text-slate-900 font-semibold">PC or Desktop</strong> computer.
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Mobile screens are too small to support the extensive data tables, complex forms, and administrative management panels.
            </p>
          </div>

          <Button asChild className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-xs py-5">
            <Link to="/" className="flex items-center justify-center gap-2">
              <IconArrowLeft className="size-4" />
              Back to Homepage
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col gap-4 p-5 lg:gap-6 lg:p-8">
          <Outlet />
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}

