import * as React from "react"
import { Link } from "react-router-dom"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { useAuth } from "@/context/AuthContext"
import { useSettings } from "@/context/SettingsContext"
import SidebarLogo from "/g1.svg"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  IconDashboard,
  IconActivity,
  IconBuildingSkyscraper,
  IconSmartHome,
  IconFileCertificate,
  IconMail,
  IconChartBar,
  IconUsers,
  IconFileAi,
  IconSettings,
  IconHelp,
  IconReport,
  IconFileWord,
  IconCalendarCheck,
  IconTool,
  IconReceipt2,
  IconReceiptOff,
  IconAlertCircle,
  IconUserCode,
  IconUserBolt,
  IconShieldCheck,
  IconLockAccess,
} from "@tabler/icons-react"

const data = {
  platform: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <IconDashboard />,
    },
  ],
  realEstate: [
    {
      title: "Properties",
      url: "/properties",
      icon: <IconBuildingSkyscraper />,
    },
    {
      title: "Units",
      url: "/units",
      icon: <IconSmartHome />,
    },
    {
      title: "Contracts",
      url: "/contracts",
      icon: <IconFileCertificate />,
    },
    {
      title: "Leads",
      url: "/leads",
      icon: <IconMail />,
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: <IconCalendarCheck />,
    },
    {
      title: "Maintenance",
      url: "/maintenance",
      icon: <IconTool />,
    },
  ],
  finance: [
    {
      title: "Payments",
      url: "/payments",
      icon: <IconReceipt2 />,
    },
    {
      title: "Due Collection",
      url: "/due-collection",
      icon: <IconAlertCircle />,
    },
    {
      title: "Expenses",
      url: "/expenses",
      icon: <IconReceiptOff />,
    },
    {
      title: "Reports",
      url: "/financial-report",
      icon: <IconReport />,
    },
    {
      title: "Payroll",
      url: "/payroll",
      icon: <IconReceipt2 />,
    },
  ],
  people: [
    {
      title: "Agents",
      url: "/agents",
      icon: <IconUsers />,
    },
    {
      title: "Owners",
      url: "/owners",
      icon: <IconUserCode />,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: <IconUserBolt />,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: <IconUsers />,
    }
  ],
  admin: [
    {
      title: "Subscription & Billing",
      url: "/subscription",
      icon: <IconReceipt2 />,
    },
    {
      title: "Users",
      url: "/users",
      icon: <IconShieldCheck />,
    },
    {
      title: "Roles",
      url: "/roles",
      icon: <IconLockAccess />,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <IconSettings />,
    },
  ],
  navSecondary: [],
}

export function AppSidebar({ ...props }) {
  const { user, hasPermission } = useAuth()
  const { settings } = useSettings()

  // Feature mapping for sidebar items
  const featureMap = {
    "Dashboard": "dashboard",
    "Subscription & Billing": "settings",
    "Properties": "properties",
    "Units": "units",
    "Contracts": "contracts",
    "Leads": "inquiries",
    "Bookings": "bookings",
    "Maintenance": "maintenance",
    "Payments": "payments",
    "Due Collection": "due_collection",
    "Expenses": "expenses",
    "Reports": "financial_report",
    "Payroll": "payroll",
    "Agents": "agents",
    "Owners": "property_owners",
    "Staff": "staff",
    "Customers": "customers",
    "Users": "users",
    "Roles": "roles",
    "Settings": "settings"
  }

  const filterItems = (items) => {
    return items.filter(item => {
      const featureId = featureMap[item.title];
      if (!featureId || featureId === 'dashboard') return true;
      return hasPermission(featureId, 'view');
    });
  }

  const filteredPlatform = filterItems(data.platform);
  const filteredRealEstate = filterItems(data.realEstate);
  const filteredFinance = filterItems(data.finance);
  const filteredPeople = filterItems(data.people);
  
  let adminItems = [...data.admin];
  if (user?.role === 'superadmin') {
    adminItems.unshift({
      title: "Super Admin Portal",
      url: "/super-admin",
      icon: <IconShieldCheck />,
    });
  }
  const filteredAdmin = filterItems(adminItems);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-3 py-2 font-black text-xl tracking-tight text-primary">
          <img src={SidebarLogo} alt="EstateCloud Logo" className="h-9 w-auto object-contain shrink-0" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {filteredPlatform.length > 0 && <NavMain items={filteredPlatform} showQuickCreate={hasPermission('properties', 'create')} />}
        {filteredRealEstate.length > 0 && <NavMain items={filteredRealEstate} label="Real Estate" className="pt-0" />}
        {filteredFinance.length > 0 && <NavMain items={filteredFinance} label="Finance" className="pt-0" />}
        {filteredPeople.length > 0 && <NavMain items={filteredPeople} label="People" className="pt-0" />}
        {filteredAdmin.length > 0 && <NavMain items={filteredAdmin} label="Admin" className="pt-0" />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
