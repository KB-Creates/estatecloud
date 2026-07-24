import { useState } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconMapPin, IconBed, IconBath, IconMaximize, IconEdit, IconTrash } from "@tabler/icons-react"
import { DeleteConfirm } from "@/components/delete-confirm"
import { useAuth } from "@/context/AuthContext"
import { useSettings } from "@/context/SettingsContext"
const slugify = (text) => {
  if (!text) return ""
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

export function PropertyCard({ property, onDelete }) {
  const { hasPermission } = useAuth()
  const { getCurrencySymbol } = useSettings()

  return (
    <Card className="group overflow-hidden border-none shadow-md transition-all bg-card flex flex-col h-full p-0 gap-0">
      {/* Image Section with Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden">
        <Link to={`/properties/${slugify(property.title)}`} className="block h-full w-full">
          <img
            src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop"}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bg-emerald-500/90 text-white border-none backdrop-blur-sm px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
            {property.status || "Available"}
          </Badge>
          {property.isFeatured && (
            <Badge className="bg-amber-500/90 text-white border-none backdrop-blur-sm px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
              Featured
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-80 transition-opacity duration-300">
          {hasPermission('properties', 'edit') && (
            <Button size="icon" variant="secondary" className="size-8 backdrop-blur-sm rounded-full shadow-lg" asChild>
              <Link to={`/add-property/${slugify(property.title)}-${property._id}`}>
                <IconEdit className="size-4" />
              </Link>
            </Button>
          )}
          {hasPermission('properties', 'delete') && (
            <DeleteConfirm
              title="Delete Property?"
              description={`Are you sure you want to delete ${property.title}?`}
              onConfirm={() => onDelete(property._id)}
            >
              <Button size="icon" variant="destructive" className="size-8 backdrop-blur-sm rounded-full shadow-lg">
                <IconTrash className="size-4" />
              </Button>
            </DeleteConfirm>
          )}
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="p-4 pb-0">
        <div className="text-[10px] uppercase font-bold tracking-widest text-primary/70 mb-1">
          {property.propertyType || "Property"}
        </div>
        <CardTitle className="text-lg font-bold leading-tight truncate transition-colors">
          <Link to={`/properties/${slugify(property.title)}`} className="hover:text-primary transition-colors">
            {property.title}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <IconMapPin className="size-3 shrink-0" />
          <span className="truncate">{property.city}, {property.country || "India"}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        {/* Specs Grid */}
        <div className={cn(
          "grid gap-2 py-3 border-y border-border/50",
          ["apartment", "house", "villa"].includes(property.propertyType?.toLowerCase()) ? "grid-cols-3" :
          ["commercial", "office", "shop"].includes(property.propertyType?.toLowerCase()) ? "grid-cols-2" : "grid-cols-1"
        )}>
          {["apartment", "house", "villa"].includes(property.propertyType?.toLowerCase()) && (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <IconBed className="size-3.5 text-primary" />
                <span>{property.bedrooms || 0}</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Beds</span>
            </div>
          )}
          {["apartment", "house", "villa", "commercial", "office", "shop"].includes(property.propertyType?.toLowerCase()) && (
            <div className={cn(
              "flex flex-col items-center gap-1 px-2",
              ["apartment", "house", "villa"].includes(property.propertyType?.toLowerCase()) && "border-x border-border/50"
            )}>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <IconBath className="size-3.5 text-primary" />
                <span>{property.bathrooms || 0}</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Baths</span>
            </div>
          )}
          <div className={cn(
            "flex flex-col items-center gap-1",
            ["commercial", "office", "shop"].includes(property.propertyType?.toLowerCase()) && "border-l border-border/50 pl-2"
          )}>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <IconMaximize className="size-3.5 text-primary" />
              <span>{property.areaSize || 0}</span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">{property.areaUnit || "sqft"}</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Price</span>
            <span className="text-xl font-black text-foreground tracking-tight">
              {getCurrencySymbol()}{Number(property.price).toLocaleString()}
            </span>
          </div>
          <Button
            size="sm"
            className="px-4 h-9 font-semibold transition-all"
            asChild
          >
            <Link to={`/properties/${slugify(property.title)}`}>
              Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}