import React, { useState, useEffect, useRef } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useSettings } from "@/context/SettingsContext"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { 
  IconArrowLeft, 
  IconBed, 
  IconBath, 
  IconMaximize, 
  IconBuilding, 
  IconMapPin, 
  IconPhone, 
  IconMail, 
  IconCheck, 
  IconChevronLeft, 
  IconChevronRight, 
  IconEdit, 
  IconLoader2 
} from "@tabler/icons-react"

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

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCurrencySymbol } = useSettings()
  const { hasPermission } = useAuth()
  
  const [property, setProperty] = useState(null)
  const [agent, setAgent] = useState(null)
  const [owner, setOwner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapViewMode, setMapViewMode] = useState("street")
  const mapRef = useRef(null)
  const streetLayerRef = useRef(null)
  const satelliteLayerRef = useRef(null)

  useEffect(() => {
    if (window.L) {
      setMapLoaded(true)
      return
    }
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.async = true
    script.onload = () => {
      setMapLoaded(true)
    }
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (!mapLoaded || !property?.lat || !property?.lng) return

    const timer = setTimeout(() => {
      const lat = parseFloat(property.lat)
      const lng = parseFloat(property.lng)

      if (!mapRef.current) {
        const container = document.getElementById("details-map")
        if (!container) return

        const map = window.L.map("details-map").setView([lat, lng], 15)
        mapRef.current = map

        const streetLayer = window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
        const satelliteLayer = window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        })

        streetLayerRef.current = streetLayer
        satelliteLayerRef.current = satelliteLayer

        if (mapViewMode === "street") {
          streetLayer.addTo(map)
        } else {
          satelliteLayer.addTo(map)
        }

        window.L.marker([lat, lng]).addTo(map)
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        streetLayerRef.current = null
        satelliteLayerRef.current = null
      }
    }
  }, [mapLoaded, property])

  useEffect(() => {
    if (!mapRef.current || !streetLayerRef.current || !satelliteLayerRef.current) return

    if (mapViewMode === "street") {
      mapRef.current.removeLayer(satelliteLayerRef.current)
      streetLayerRef.current.addTo(mapRef.current)
    } else {
      mapRef.current.removeLayer(streetLayerRef.current)
      satelliteLayerRef.current.addTo(mapRef.current)
    }
  }, [mapViewMode])


  const typeLower = property?.propertyType?.toLowerCase() || "";

  const isResidential = ["apartment", "house", "villa"].includes(typeLower);
  const isCommercial = ["commercial", "office", "shop"].includes(typeLower);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true)
        let propData;
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

        if (isObjectId) {
          const propertyRes = await api.get(`/properties/${id}`)
          propData = propertyRes.data
        } else {
          // If it's a slug, get all properties and find the matching one
          const propertiesRes = await api.get('/properties')
          propData = propertiesRes.data?.find(p => slugify(p.title) === id)
          
          if (!propData) {
            throw new Error("Property not found by slug")
          }
        }

        setProperty(propData)

        // Fetch Agent & Owner details if they are assigned
        if (propData.agent || propData.owner) {
          const [agentsRes, ownersRes] = await Promise.all([
            api.get('/agents'),
            api.get('/owners')
          ])
          
          if (propData.agent) {
            const foundAgent = agentsRes.data?.find(a => a._id === propData.agent)
            setAgent(foundAgent || null)
          }
          if (propData.owner) {
            const foundOwner = ownersRes.data?.find(o => o._id === propData.owner)
            setOwner(foundOwner || null)
          }
        }
      } catch (error) {
        console.error("Error loading property:", error)
        toast.error("Failed to load property details")
        navigate("/properties")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPropertyData()
    }
  }, [id, navigate])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <IconLoader2 className="size-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!property) return null

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop"]

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const getStatusColor = (status) => {
    const s = status?.toLowerCase()
    if (s === 'available') return 'bg-emerald-500/90 text-white'
    if (s === 'sold') return 'bg-red-500/90 text-white'
    if (s === 'rented') return 'bg-blue-500/90 text-white'
    if (s === 'booked') return 'bg-amber-500/90 text-white'
    return 'bg-secondary text-secondary-foreground'
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-12">
      {/* Top Navigation & Action Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full" asChild>
            <Link to="/properties">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Property Details</h2>
            <p className="text-sm text-muted-foreground">View detailed information of this property listing.</p>
          </div>
        </div>

        {hasPermission('properties', 'edit') && (
          <Button asChild className="rounded-full px-5">
            <Link to={`/add-property/${slugify(property.title)}-${property._id}`}>
              <IconEdit className="mr-2 size-4" /> Edit Property
            </Link>
          </Button>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column (Images, Title, Specs, Info) - Spans 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Gallery Carousel */}
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] bg-muted overflow-hidden rounded-3xl border border-border/50 group shadow-md">
            <img 
              src={images[activeImageIndex]} 
              alt={property.title} 
              className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={`${getStatusColor(property.status)} uppercase font-bold tracking-wider px-3 py-1 text-[10px]`}>
                {property.status || "Available"}
              </Badge>
              <Badge className="bg-primary text-primary-foreground uppercase font-bold tracking-wider px-3 py-1 text-[10px]">
                For {property.purpose || "Sale"}
              </Badge>
              {property.isFeatured && (
                <Badge className="bg-amber-500 text-white uppercase font-bold tracking-wider px-3 py-1 text-[10px]">
                  Featured
                </Badge>
              )}
              {property.isHot && (
                <Badge className="bg-rose-500 text-white uppercase font-bold tracking-wider px-3 py-1 text-[10px]">
                  Hot
                </Badge>
              )}
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white size-12 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                >
                  <IconChevronLeft className="size-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white size-12 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                >
                  <IconChevronRight className="size-6" />
                </button>
                
                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`size-2.5 rounded-full transition-all ${activeImageIndex === idx ? 'bg-primary w-5' : 'bg-white/60 hover:bg-white'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Title & Overview Card */}
          <Card className="rounded-3xl border-none shadow-md overflow-hidden bg-card">
            <CardContent className="p-6 md:p-8 space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
                {property.propertyType || "Property"}
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">{property.title}</h1>
              
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <IconMapPin className="size-4 text-primary shrink-0" />
                <span>{property.address}, {property.city}, {property.state ? `${property.state}, ` : ""}{property.country || "India"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Specs Grid */}
          <div className={cn(
            "grid gap-4",
            isResidential ? "grid-cols-2 sm:grid-cols-4" :
            isCommercial ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1"
          )}>
            {isResidential && (
              <div className="flex items-center gap-3 bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <IconBed className="size-5.5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Bedrooms</span>
                  <span className="text-base font-black text-foreground">{property.bedrooms || 0} Beds</span>
                </div>
              </div>
            )}

            {(isResidential || isCommercial) && (
              <div className="flex items-center gap-3 bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <IconBath className="size-5.5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Bathrooms</span>
                  <span className="text-base font-black text-foreground">{property.bathrooms || 0} Baths</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
              <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <IconMaximize className="size-5.5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Area Size</span>
                <span className="text-base font-black text-foreground">{property.areaSize || 0} {property.areaUnit || "sqft"}</span>
              </div>
            </div>

            {(isResidential || isCommercial) && (
              <div className="flex items-center gap-3 bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <IconBuilding className="size-5.5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Property Age</span>
                  <span className="text-base font-black text-foreground">{property.propertyAge ? `${property.propertyAge} Years` : "Brand New"}</span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {property.description && (
            <Card className="rounded-3xl border border-border/40 shadow-sm bg-card">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h3 className="text-lg font-bold tracking-tight text-foreground">About Property</h3>
                <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                  {property.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <Card className="rounded-3xl border border-border/40 shadow-sm bg-card">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h3 className="text-lg font-bold tracking-tight text-foreground">Amenities & Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 border border-border/40 bg-card rounded-2xl p-3.5 text-xs font-semibold text-foreground shadow-sm"
                    >
                      <div className="size-5.5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <IconCheck className="size-4 text-emerald-500" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Map */}
          {property.lat && property.lng && (
            <Card className="rounded-3xl border border-border/40 shadow-sm bg-card overflow-hidden">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h3 className="text-lg font-bold tracking-tight text-foreground">Location Map</h3>
                <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-border/40 z-10">
                  <div id="details-map" className="h-full w-full"></div>
                  
                  {/* View Mode Toggle Buttons */}
                  <div className="absolute top-2 right-2 z-[400] flex gap-1 bg-background/80 backdrop-blur-md border rounded-lg p-0.5 shadow-sm">
                    <Button
                      type="button"
                      variant={mapViewMode === "street" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setMapViewMode("street")}
                      className="h-7 text-[10px] font-bold px-2.5 rounded-md"
                    >
                      Map
                    </Button>
                    <Button
                      type="button"
                      variant={mapViewMode === "satellite" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setMapViewMode("satellite")}
                      className="h-7 text-[10px] font-bold px-2.5 rounded-md"
                    >
                      Satellite
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}


        </div>


        {/* Right Column (Pricing & Contact Details Sidebar) - Spans 1 col */}
        <div className="space-y-6 lg:h-fit lg:sticky lg:top-6">
          
          {/* Price & Action Card */}
          <Card className="rounded-3xl border-none shadow-md overflow-hidden bg-primary/5 border border-primary/10">
            <CardContent className="p-6 md:p-8 space-y-6 text-center lg:text-left">
              <div>
                <span className="text-xs uppercase font-extrabold text-muted-foreground tracking-wider">Asking Price</span>
                <div className="text-3xl md:text-4xl font-black text-primary tracking-tight mt-1.5">
                  {getCurrencySymbol()}{Number(property.price).toLocaleString()}
                </div>
              </div>

              <Separator className="bg-primary/10" />

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Status</span>
                  <Badge className={`${getStatusColor(property.status)} uppercase font-bold tracking-wider text-[10px]`}>
                    {property.status || "Available"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Purpose</span>
                  <span className="font-extrabold text-foreground uppercase text-xs">For {property.purpose}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Personnel Card */}
          <div className="space-y-6 bg-muted/40 border border-border/40 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-bold tracking-tight text-foreground">Management & Contact</h3>
            
            {/* Agent card */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-muted-foreground">Assigned Agent</span>
              {agent ? (
                <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-sm uppercase">
                      {agent.name?.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{agent.name}</h4>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono">{agent.uniqueId || "Agent"}</span>
                    </div>
                  </div>
                  <Separator className="bg-border/40" />
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {agent.phone && (
                      <div className="flex items-center gap-2">
                        <IconPhone className="size-3.5 text-primary" />
                        <span>{agent.phone}</span>
                      </div>
                    )}
                    {agent.email && (
                      <div className="flex items-center gap-2">
                        <IconMail className="size-3.5 text-primary" />
                        <span className="truncate">{agent.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground italic p-3 border border-dashed rounded-xl bg-card">
                  No active agent assigned
                </div>
              )}
            </div>

            {/* Owner card */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-muted-foreground">Property Owner</span>
              {owner ? (
                <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-secondary flex items-center justify-center font-black text-foreground text-sm uppercase">
                      {owner.name?.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{owner.name}</h4>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono">{owner.uniqueId || "Owner"}</span>
                    </div>
                  </div>
                  <Separator className="bg-border/40" />
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {owner.phone && (
                      <div className="flex items-center gap-2">
                        <IconPhone className="size-3.5 text-muted-foreground" />
                        <span>{owner.phone}</span>
                      </div>
                    )}
                    {owner.email && (
                      <div className="flex items-center gap-2">
                        <IconMail className="size-3.5 text-muted-foreground" />
                        <span className="truncate">{owner.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground italic p-3 border border-dashed rounded-xl bg-card">
                  No owner assigned
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
