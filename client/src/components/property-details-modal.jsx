import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSettings } from "@/context/SettingsContext"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { 
  IconBed, 
  IconBath, 
  IconMaximize, 
  IconCalendar, 
  IconUser, 
  IconPhone, 
  IconMail, 
  IconMapPin, 
  IconCar, 
  IconHistory, 
  IconCheck, 
  IconBuilding,
  IconChevronLeft,
  IconChevronRight
} from "@tabler/icons-react"

export function PropertyDetailsModal({ property, open, onOpenChange }) {
  const { getCurrencySymbol } = useSettings()
  const [agents, setAgents] = useState([])
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const typeLower = property?.propertyType?.toLowerCase() || "";
  const isResidential = ["apartment", "house", "villa"].includes(typeLower);
  const isCommercial = ["commercial", "office", "shop"].includes(typeLower);

  useEffect(() => {
    if (open && property) {
      const fetchAgentAndOwner = async () => {
        try {
          setLoading(true)
          const [agentsRes, ownersRes] = await Promise.all([
            api.get('/agents'),
            api.get('/owners')
          ])
          setAgents(agentsRes.data)
          setOwners(ownersRes.data)
        } catch (error) {
          console.error("Failed to load agent/owner data", error)
        } finally {
          setLoading(false)
        }
      }
      fetchAgentAndOwner()
      setActiveImageIndex(0)
    }
  }, [open, property])

  if (!property) return null

  const agentIds = Array.isArray(property.agent)
    ? property.agent
    : typeof property.agent === 'string' && property.agent
      ? property.agent.split(',').map(s => s.trim()).filter(Boolean)
      : []
  const assignedAgents = agents.filter(a => agentIds.includes(a._id) || a._id === property.agent)
  const assignedOwner = owners.find(o => o._id === property.owner)
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
    if (s === 'available') return 'bg-emerald-500/90 text-white hover:bg-emerald-600'
    if (s === 'sold') return 'bg-red-500/90 text-white hover:bg-red-600'
    if (s === 'rented') return 'bg-blue-500/90 text-white hover:bg-blue-600'
    if (s === 'booked') return 'bg-amber-500/90 text-white hover:bg-amber-600'
    return 'bg-secondary text-secondary-foreground'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[60%] md:max-w-[50%] lg:max-w-[50%] xl:max-w-[50%] w-full max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-none shadow-2xl bg-background text-foreground flex flex-col">
        
        {/* Gallery / Header Image Hero */}
        <div className="relative w-full h-[180px] sm:h-[260px] md:h-[320px] bg-muted overflow-hidden group shrink-0">
          <img 
            src={images[activeImageIndex]} 
            alt={property.title} 
            className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
          
          {/* Badges on Hero */}
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
                Hot Property
              </Badge>
            )}
          </div>

          {/* Navigation Arrows for Gallery */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white size-10 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all shadow-md"
              >
                <IconChevronLeft className="size-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white size-10 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all shadow-md"
              >
                <IconChevronRight className="size-6" />
              </button>
              
              {/* Pagination Dots */}
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 md:p-7 space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary/80 bg-primary/5 px-2.5 py-1 rounded-md inline-block">
                {property.propertyType || "Property"}
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">{property.title}</h2>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <IconMapPin className="size-4 shrink-0 text-primary" />
                <span>{property.address}, {property.city}, {property.state ? `${property.state}, ` : ""}{property.country || "India"}</span>
              </div>
            </div>
            
            {/* Price View */}
            <div className="flex flex-col shrink-0 bg-primary/5 border border-primary/10 rounded-2xl p-4 min-w-[200px] text-center md:text-right">
              <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Asking Price</span>
              <span className="text-2xl md:text-3xl font-black text-primary tracking-tight mt-1">
                {getCurrencySymbol()}{Number(property.price).toLocaleString()}
              </span>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Specs Highlights */}
          <div className={cn(
            "grid gap-3",
            isResidential ? "grid-cols-2 sm:grid-cols-4" :
            isCommercial ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1"
          )}>
            {isResidential && (
              <div className="flex items-center gap-3 bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <IconBed className="size-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Bedrooms</span>
                  <span className="text-base font-black text-foreground">{property.bedrooms || 0} Beds</span>
                </div>
              </div>
            )}

            {(isResidential || isCommercial) && (
              <div className="flex items-center gap-3 bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <IconBath className="size-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Bathrooms</span>
                  <span className="text-base font-black text-foreground">{property.bathrooms || 0} Baths</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <IconMaximize className="size-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Area Size</span>
                <span className="text-base font-black text-foreground">{property.areaSize || 0} {property.areaUnit || "sqft"}</span>
              </div>
            </div>

            {(isResidential || isCommercial) && (
              <div className="flex items-center gap-3 bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <IconBuilding className="size-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Property Age</span>
                  <span className="text-base font-black text-foreground">{property.propertyAge ? `${property.propertyAge} Years` : "Brand New"}</span>
                </div>
              </div>
            )}
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Description & Amenities (Left/Center) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Description */}
              {property.description && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold tracking-tight text-foreground">About Property</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line bg-muted/50 border border-border/20 rounded-2xl p-4">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold tracking-tight text-foreground">Amenities & Features</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {property.amenities.map((amenity, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 border border-border/40 bg-card rounded-xl p-3 text-xs font-semibold text-foreground"
                      >
                        <div className="size-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <IconCheck className="size-3.5 text-emerald-500" />
                        </div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Assigned Personnel (Right) */}
            <div className="space-y-6 bg-muted/40 border border-border/40 rounded-3xl p-5 md:p-6 h-fit">
              <h3 className="text-base font-bold tracking-tight text-foreground">Management & Contact</h3>
              
              {/* Agent card */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-muted-foreground">
                  {assignedAgents.length > 1 ? "Assigned Agents" : "Assigned Agent"}
                </span>
                {assignedAgents.length > 0 ? (
                  assignedAgents.map((agentItem) => (
                    <div key={agentItem._id} className="bg-card border border-border/50 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm uppercase">
                          {agentItem.name?.substring(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{agentItem.name}</h4>
                          <span className="text-[10px] text-muted-foreground uppercase font-mono">{agentItem.uniqueId || "Agent"}</span>
                        </div>
                      </div>
                      <Separator className="bg-border/40" />
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        {agentItem.phone && (
                          <div className="flex items-center gap-2">
                            <IconPhone className="size-3.5 text-primary" />
                            <span>{agentItem.phone}</span>
                          </div>
                        )}
                        {agentItem.email && (
                          <div className="flex items-center gap-2">
                            <IconMail className="size-3.5 text-primary font-bold" />
                            <span className="truncate">{agentItem.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground italic p-3 border border-dashed rounded-xl bg-card">
                    No active agent assigned
                  </div>
                )}
              </div>

              {/* Owner card */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-muted-foreground">Property Owner</span>
                {assignedOwner ? (
                  <div className="bg-card border border-border/50 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground text-sm uppercase">
                        {assignedOwner.name?.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{assignedOwner.name}</h4>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono">{assignedOwner.uniqueId || "Owner"}</span>
                      </div>
                    </div>
                    <Separator className="bg-border/40" />
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      {assignedOwner.phone && (
                        <div className="flex items-center gap-2">
                          <IconPhone className="size-3.5 text-muted-foreground" />
                          <span>{assignedOwner.phone}</span>
                        </div>
                      )}
                      {assignedOwner.email && (
                        <div className="flex items-center gap-2">
                          <IconMail className="size-3.5 text-muted-foreground" />
                          <span className="truncate">{assignedOwner.email}</span>
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

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" className="rounded-full px-6" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}
