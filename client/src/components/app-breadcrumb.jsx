import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import api from "@/lib/api"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function AppBreadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)
  const [entityNames, setEntityNames] = React.useState({})

  React.useEffect(() => {
    const fetchNames = async () => {
      for (let i = 0; i < pathnames.length; i++) {
        const value = pathnames[i]
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(value)
        const prevSegment = i > 0 ? pathnames[i - 1] : null

        if (prevSegment === "properties" && !isObjectId && !entityNames[value]) {
          try {
            const res = await api.get("/properties")
            const prop = res.data?.find((p) => {
              const slug = p.title
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '')
              return slug === value
            })
            if (prop?.title) {
              setEntityNames((prev) => ({ ...prev, [value]: prop.title }))
            }
          } catch (error) {
            console.error("Error fetching property for slug breadcrumb:", error)
          }
        }
        
        if (isObjectId && !entityNames[value]) {
          try {
            if (prevSegment === "properties" || prevSegment === "add-property") {
              const res = await api.get(`/properties/${value}`)
              if (res.data?.title) {
                setEntityNames((prev) => ({ ...prev, [value]: res.data.title }))
              }
            } else if (prevSegment === "agents") {
              const res = await api.get("/agents")
              const agent = res.data?.find((a) => a._id === value)
              if (agent?.name) {
                setEntityNames((prev) => ({ ...prev, [value]: agent.name }))
              }
            } else if (prevSegment === "owners") {
              const res = await api.get("/owners")
              const owner = res.data?.find((o) => o._id === value)
              if (owner?.name) {
                setEntityNames((prev) => ({ ...prev, [value]: owner.name }))
              }
            } else if (prevSegment === "customers" || (prevSegment === "edit" && pathnames[i - 2] === "customers")) {
              const res = await api.get(`/customers/${value}`)
              if (res.data?.name) {
                setEntityNames((prev) => ({ ...prev, [value]: res.data.name }))
              }
            }
          } catch (error) {
            console.error("Error fetching name for breadcrumb ID:", error)
          }
        }
      }
    }

    fetchNames()
  }, [location.pathname])

  return (
    <Breadcrumb className="flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`
          const isLast = index === pathnames.length - 1

          // Handle special cases or formatting
          let name = entityNames[value] || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ")
          if (name === "Financial report") name = "Financial Report"
          if (name === "Due collection") name = "Due Collection"

          return (
            <React.Fragment key={to}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={to}>{name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

