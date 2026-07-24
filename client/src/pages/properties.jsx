import { useSettings } from '@/context/SettingsContext';
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { socket } from "@/lib/socket"
import api from "@/lib/api"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconPlus,
  IconLoader2,
  IconHome,
  IconLayoutGrid,
  IconList,
  IconMapPin,
  IconBed,
  IconBath,
  IconMaximize,
  IconEdit,
  IconTrash
} from "@tabler/icons-react"
import { toast } from "sonner"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { DeleteConfirm } from "@/components/delete-confirm"
import { PropertyCard } from "@/components/Property-card"
import { cn } from "@/lib/utils"



export default function PropertiesPage() {
  const { hasPermission } = useAuth()
  const { getCurrencySymbol } = useSettings()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")

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

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    socket.on("properties_updated", () => {
      fetchProperties()
    })
    return () => {
      socket.off("properties_updated")
    }
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await api.get('/properties')
      setProperties(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/properties/${id}`)
      toast.success("Property deleted successfully", {
        action: {
          label: "Undo",
          onClick: async () => {
            if (res.data?.trashId) {
              try {
                await api.post(`/trash/restore/${res.data.trashId}`);
                toast.success("Restored successfully");
                typeof fetchUsers === 'function' ? fetchUsers() :
                  typeof fetchUnits === 'function' ? fetchUnits() :
                    typeof fetchRoles === 'function' ? fetchRoles() :
                      typeof fetchProperties === 'function' ? fetchProperties() :
                        typeof fetchExpenses === 'function' ? fetchExpenses() :
                          typeof onUpdate === 'function' ? onUpdate() : window.location.reload();
              } catch (e) {
                toast.error("Failed to restore");
              }
            } else {
              toast.info("Cannot restore this item");
            }
          }
        }
      })
      fetchProperties()
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Properties</h2>
          <p className="text-muted-foreground">Manage your real estate listings here.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggler */}
          <div className="flex items-center border rounded-lg p-0.5 bg-muted/50">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="size-8 rounded-lg"
              onClick={() => setViewMode("grid")}
            >
              <IconLayoutGrid className="size-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="size-8 rounded-lg"
              onClick={() => setViewMode("list")}
            >
              <IconList className="size-4" />
            </Button>
          </div>

          {hasPermission('properties', 'create') && (
            <Button asChild className="px-6">
              <Link to="/add-property">
                <IconPlus className="mr-2 size-4" /> Add Property
              </Link>
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : properties.length === 0 ? (
        <Empty className="rounded-2xl border-2 border-dashed bg-muted/50">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconHome className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No properties found.</EmptyTitle>
            <EmptyDescription>
              Start by adding your first property listing to the platform.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/add-property">Add Your First Property</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {properties.map((property) => (
            <Card key={property._id} className="group overflow-hidden border-none shadow-md transition-all bg-card flex flex-col md:flex-row p-4 gap-4 items-center">
              {/* Image Section */}
              <div className="relative aspect-16/10 md:w-48 w-full shrink-0 overflow-hidden rounded-xl">
                <Link to={`/properties/${slugify(property.title)}`} className="block h-full w-full">
                  <img
                    src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop"}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <Badge className="bg-emerald-500/90 text-white border-none backdrop-blur-sm px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                    {property.status || "Available"}
                  </Badge>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-grow flex flex-col justify-between w-full h-full min-w-0">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-primary/70 block mb-1">
                    {property.propertyType || "Property"}
                  </span>
                  <h3 className="text-lg font-bold leading-tight truncate transition-colors">
                    <Link to={`/properties/${slugify(property.title)}`} className="hover:text-primary transition-colors">
                      {property.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <IconMapPin className="size-3 shrink-0" />
                    <span className="truncate">{property.city}, {property.country || "India"}</span>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="flex items-center gap-4 mt-3 py-2 border-t border-border/50 text-xs text-muted-foreground">
                  {["apartment", "house", "villa"].includes(property.propertyType?.toLowerCase()) && (
                    <div className="flex items-center gap-1">
                      <IconBed className="size-3.5 text-primary" />
                      <span>{property.bedrooms || 0} Beds</span>
                    </div>
                  )}
                  {["apartment", "house", "villa", "commercial", "office", "shop"].includes(property.propertyType?.toLowerCase()) && (
                    <div className={cn(
                      "flex items-center gap-1",
                      ["apartment", "house", "villa"].includes(property.propertyType?.toLowerCase()) && "border-l border-border/50 pl-3"
                    )}>
                      <IconBath className="size-3.5 text-primary" />
                      <span>{property.bathrooms || 0} Baths</span>
                    </div>
                  )}
                  <div className={cn(
                    "flex items-center gap-1",
                    ["apartment", "house", "villa", "commercial", "office", "shop"].includes(property.propertyType?.toLowerCase()) && "border-l border-border/50 pl-3"
                  )}>
                    <IconMaximize className="size-3.5 text-primary" />
                    <span>{property.areaSize || 0} {property.areaUnit || "sqft"}</span>
                  </div>
                </div>

              </div>

              {/* Price & Action Section */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 w-full md:w-auto shrink-0 md:pl-4 md:border-l border-border/50">
                <div className="flex flex-col md:items-end">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Price</span>
                  <span className="text-xl font-black text-foreground tracking-tight">
                    {getCurrencySymbol()}{Number(property.price).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasPermission('properties', 'edit') && (
                    <Button size="icon" variant="secondary" className="size-8 rounded-full shadow-md" asChild>
                      <Link to={`/add-property/${slugify(property.title)}-${property._id}`}>
                        <IconEdit className="size-4" />
                      </Link>
                    </Button>
                  )}
                  {hasPermission('properties', 'delete') && (
                    <DeleteConfirm
                      title="Delete Property?"
                      description={`Are you sure you want to delete ${property.title}?`}
                      onConfirm={() => handleDelete(property._id)}
                    >
                      <Button size="icon" variant="destructive" className="size-8 rounded-full shadow-md">
                        <IconTrash className="size-4" />
                      </Button>
                    </DeleteConfirm>
                  )}
                  <Button size="sm" className="rounded-full px-4 h-8 text-xs font-semibold shadow-md" asChild>
                    <Link to={`/properties/${slugify(property.title)}`}>
                      Details
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}