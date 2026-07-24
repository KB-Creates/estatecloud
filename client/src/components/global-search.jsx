import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandLoading,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { Skeleton } from "@/components/ui/skeleton"
import {
  IconSearch,
  IconDashboard,
  IconBuildingSkyscraper,
  IconSmartHome,
  IconFileCertificate,
  IconMail,
  IconCalendarCheck,
  IconTool,
  IconReceipt2,
  IconAlertCircle,
  IconReceiptOff,
  IconReport,
  IconUsers,
  IconUserCode,
  IconUserBolt,
  IconShieldCheck,
  IconLockAccess,
  IconSettings,
  IconLoader2
} from "@tabler/icons-react"

const slugify = (text) => {
  if (!text) return ""
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

function SearchSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-12" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [properties, setProperties] = React.useState([])
  const [leads, setLeads] = React.useState([])
  const [units, setUnits] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [dataLoaded, setDataLoaded] = React.useState(false)
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const [shortcutText, setShortcutText] = React.useState("Ctrl+K")

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
        (navigator.userAgentData && navigator.userAgentData.platform.toUpperCase().indexOf('MACOS') >= 0);
      if (isMac) {
        setShortcutText("⌘K")
      }
    }
  }, [])

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Fetch only when user starts typing (query.length > 1) and we haven't loaded yet
  React.useEffect(() => {
    if (open && query.trim().length > 1 && !dataLoaded) {
      fetchGlobalData()
    }
  }, [open, query, dataLoaded])

  // Reset loaded status and data when dialog closes
  React.useEffect(() => {
    if (!open) {
      setDataLoaded(false)
      setProperties([])
      setLeads([])
      setUnits([])
      setQuery("")
    }
  }, [open])

  const fetchGlobalData = async () => {
    try {
      setLoading(true)
      const [propRes, leadRes, unitRes] = await Promise.all([
        hasPermission('properties', 'view') ? api.get('/properties').catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        hasPermission('inquiries', 'view') ? api.get('/inquiries').catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        hasPermission('units', 'view') ? api.get('/units').catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
      ])
      setProperties(propRes.data || [])
      setLeads(leadRes.data || [])
      setUnits(unitRes.data || [])
      setDataLoaded(true)
    } catch (error) {
      console.error("Failed to fetch search data", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (url) => {
    setOpen(false)
    setQuery("")
    navigate(url)
  }

  // Filter lists based on query
  const filteredProperties = properties.filter((p) =>
    p.title?.toLowerCase().includes(query.toLowerCase()) ||
    p.city?.toLowerCase().includes(query.toLowerCase()) ||
    p.address?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)

  const filteredLeads = leads.filter((l) =>
    l.name?.toLowerCase().includes(query.toLowerCase()) ||
    l.phone?.toLowerCase().includes(query.toLowerCase()) ||
    l.city?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)

  const filteredUnits = units.filter((u) =>
    u.unitNumber?.toLowerCase().includes(query.toLowerCase()) ||
    u.property?.title?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)

  const pages = [
    { title: "Dashboard", url: "/", icon: <IconDashboard className="size-4" />, perm: true },
    { title: "Properties", url: "/properties", icon: <IconBuildingSkyscraper className="size-4" />, perm: hasPermission('properties', 'view') },
    { title: "Units", url: "/units", icon: <IconSmartHome className="size-4" />, perm: hasPermission('units', 'view') },
    { title: "Contracts", url: "/contracts", icon: <IconFileCertificate className="size-4" />, perm: hasPermission('contracts', 'view') },
    { title: "Leads", url: "/leads", icon: <IconMail className="size-4" />, perm: hasPermission('inquiries', 'view') },
    { title: "Bookings", url: "/bookings", icon: <IconCalendarCheck className="size-4" />, perm: hasPermission('bookings', 'view') },
    { title: "Maintenance", url: "/maintenance", icon: <IconTool className="size-4" />, perm: hasPermission('maintenance', 'view') },
    { title: "Payments", url: "/payments", icon: <IconReceipt2 className="size-4" />, perm: hasPermission('payments', 'view') },
    { title: "Due Collection", url: "/due-collection", icon: <IconAlertCircle className="size-4" />, perm: hasPermission('due_collection', 'view') },
    { title: "Expenses", url: "/expenses", icon: <IconReceiptOff className="size-4" />, perm: hasPermission('expenses', 'view') },
    { title: "Reports", url: "/financial-report", icon: <IconReport className="size-4" />, perm: hasPermission('financial_report', 'view') },
    { title: "Payroll", url: "/payroll", icon: <IconReceipt2 className="size-4" />, perm: hasPermission('payroll', 'view') },
    { title: "Agents", url: "/agents", icon: <IconUsers className="size-4" />, perm: hasPermission('agents', 'view') },
    { title: "Owners", url: "/owners", icon: <IconUserCode className="size-4" />, perm: hasPermission('property_owners', 'view') },
    { title: "Staff", url: "/staff", icon: <IconUserBolt className="size-4" />, perm: hasPermission('staff', 'view') },
    { title: "Customers", url: "/customers", icon: <IconUsers className="size-4" />, perm: hasPermission('customers', 'view') },
    { title: "Users", url: "/users", icon: <IconShieldCheck className="size-4" />, perm: hasPermission('users', 'view') },
    { title: "Roles", url: "/roles", icon: <IconLockAccess className="size-4" />, perm: hasPermission('roles', 'view') },
    { title: "Settings", url: "/settings", icon: <IconSettings className="size-4" />, perm: hasPermission('settings', 'view') },
  ].filter(p => p.perm)



  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-8 w-65 items-center gap-2 rounded-sm border border-input bg-muted/40 px-3 py-2 text-sm text-muted-foreground shadow-xs transition-colors hover:bg-muted/80 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
      >
        <IconSearch className="size-4 shrink-0 opacity-50" />
        <span className="text-muted-foreground">Search...</span>
        <Kbd className="ml-auto">
          <span>{shortcutText}</span>
        </Kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type to search properties, units, leads or pages..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading ? (
            <CommandLoading>
              <SearchSkeleton />
            </CommandLoading>
          ) : (
            <>
              {/* Only show CommandEmpty when loading is false and query is typed and no results are found */}
              {query.trim().length > 1 &&
                filteredProperties.length === 0 &&
                filteredUnits.length === 0 &&
                filteredLeads.length === 0 &&
                pages.filter(p => p.title.toLowerCase().includes(query.toLowerCase())).length === 0 && (
                  <CommandEmpty>No results found.</CommandEmpty>
                )}

              {/* Dynamic Search Results */}
              {query && filteredProperties.length > 0 && (
                <CommandGroup heading="Properties">
                  {filteredProperties.map((p) => (
                    <CommandItem
                      key={`prop-item-${p._id || p.id}`}
                      value={`prop-${p.title} ${p.city} ${p.address}`.toLowerCase()}
                      onSelect={() => handleSelect(`/properties/${slugify(p.title)}`)}
                    >
                      <IconBuildingSkyscraper className="size-4 mr-2 text-blue-500 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium text-left">{p.title}</span>
                        <span className="text-xs text-muted-foreground text-left">{p.address}, {p.city}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {query && filteredUnits.length > 0 && (
                <CommandGroup heading="Units">
                  {filteredUnits.map((u) => (
                    <CommandItem
                      key={`unit-item-${u._id || u.id}`}
                      value={`unit-${u.unitNumber} ${u.property?.title || ""}`.toLowerCase()}
                      onSelect={() => handleSelect(`/units`)}
                    >
                      <IconSmartHome className="size-4 mr-2 text-indigo-500 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium text-left">Unit {u.unitNumber}</span>
                        {u.property?.title && (
                          <span className="text-xs text-muted-foreground text-left">Property: {u.property.title}</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {query && filteredLeads.length > 0 && (
                <CommandGroup heading="Leads">
                  {filteredLeads.map((l) => (
                    <CommandItem
                      key={`lead-item-${l._id || l.id}`}
                      value={`lead-${l.name} ${l.phone} ${l.city}`.toLowerCase()}
                      onSelect={() => handleSelect(`/leads`)}
                    >
                      <IconMail className="size-4 mr-2 text-amber-500 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium text-left">{l.name}</span>
                        <span className="text-xs text-muted-foreground text-left">{l.phone} | {l.city}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}


              {/* Navigation Pages */}
              <CommandGroup heading="Pages">
                {pages.map((page) => (
                  <CommandItem
                    key={`page-item-${page.url}`}
                    value={`page-${page.title}`.toLowerCase()}
                    onSelect={() => handleSelect(page.url)}
                  >
                    <div className="mr-2 text-muted-foreground shrink-0">{page.icon}</div>
                    <span className="text-left">{page.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
