import React, { useState, useEffect, useRef } from "react"
import { useSettings } from "@/context/SettingsContext"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectEmpty } from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { IconArrowLeft, IconArrowRight, IconCheck, IconUpload, IconMapPin, IconHome, IconCurrencyDollar, IconBed, IconBath, IconLoader2, IconTrash } from "@tabler/icons-react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { PaymentInput } from "@/components/ui/payment-input";

const steps = [
  { id: 1, title: "Basic Information" },
  { id: 2, title: "Specs & Amenities" },
  { id: 3, title: "Location Details" },
  { id: 4, title: "Media & Documents" },
]

const amenitiesMapping = {
  residential: ["Swimming Pool", "Parking", "Security", "Elevator", "Garden", "WiFi", "Air Conditioning"],
  commercial: ["Parking", "Security", "Elevator", "WiFi", "Air Conditioning"],
  land: ["Electricity", "Water", "Gas", "Sewerage", "Boundary Wall"]
}

const getAvailableAmenities = (type) => {
  const t = type?.toLowerCase() || ""
  if (["apartment", "house", "villa"].includes(t)) return amenitiesMapping.residential
  if (["commercial", "office", "shop"].includes(t)) return amenitiesMapping.commercial
  if (["plot", "land"].includes(t)) return amenitiesMapping.land
  return []
}

export default function AddPropertyPage() {
  const { getCurrencySymbol } = useSettings()
  const { id: paramId } = useParams()
  const id = paramId ? (paramId.match(/[a-f0-9]{24}$/)?.[0] || paramId) : null
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const [fetching, setFetching] = useState(false)
  const [agents, setAgents] = useState([])
  const [owners, setOwners] = useState([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    purpose: "",
    price: "",
    status: "available",
    areaSize: "",
    areaUnit: "sqm",
    bedrooms: "",
    bathrooms: "",
    parkingSpots: "",
    propertyAge: "",
    amenities: [],
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    lat: "",
    lng: "",
    agent: [],
    owner: "",
    isFeatured: false,
    isHot: false,
    images: [],
  })


  const typeLower = formData.propertyType?.toLowerCase() || "";
  const showBedrooms = ["apartment", "house", "villa"].includes(typeLower);
  const showBathrooms = ["apartment", "house", "villa", "commercial", "office", "shop"].includes(typeLower);
  const showPropertyAge = ["apartment", "house", "villa", "commercial", "office", "shop"].includes(typeLower);
  const availableAmenities = getAvailableAmenities(formData.propertyType);
  const showAmenities = availableAmenities.length > 0;

  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapSearching, setMapSearching] = useState(false)
  const [mapViewMode, setMapViewMode] = useState("street")
  const mapRef = useRef(null)
  const markerRef = useRef(null)
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
    if (!mapLoaded || currentStep !== 3) return

    const timer = setTimeout(() => {
      const defaultLat = parseFloat(formData.lat) || 31.5204
      const defaultLng = parseFloat(formData.lng) || 74.3587

      if (!mapRef.current) {
        const container = document.getElementById("property-map")
        if (!container) return

        const map = window.L.map("property-map").setView([defaultLat, defaultLng], 13)
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

        const marker = window.L.marker([defaultLat, defaultLng], {
          draggable: true
        }).addTo(map)
        markerRef.current = marker

        marker.on("dragend", () => {
          const position = marker.getLatLng()
          setFormData((prev) => ({
            ...prev,
            lat: position.lat.toFixed(6),
            lng: position.lng.toFixed(6)
          }))
          handleReverseGeocodeRef.current?.(position.lat, position.lng)
        })

        map.on("click", (e) => {
          const { lat, lng } = e.latlng
          marker.setLatLng([lat, lng])
          setFormData((prev) => ({
            ...prev,
            lat: lat.toFixed(6),
            lng: lng.toFixed(6)
          }))
          handleReverseGeocodeRef.current?.(lat, lng)
        })

      } else {
        if (markerRef.current) {
          const currentPos = markerRef.current.getLatLng()
          if (
            Math.abs(currentPos.lat - defaultLat) > 0.0001 ||
            Math.abs(currentPos.lng - defaultLng) > 0.0001
          ) {
            markerRef.current.setLatLng([defaultLat, defaultLng])
            mapRef.current.setView([defaultLat, defaultLng], mapRef.current.getZoom())
          }
        }
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
        streetLayerRef.current = null
        satelliteLayerRef.current = null
      }
    }
  }, [mapLoaded, currentStep, formData.lat, formData.lng])

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



  const handleReverseGeocodeRef = useRef(null)

  useEffect(() => {
    handleReverseGeocodeRef.current = handleReverseGeocode
  })

  const updateAddressFieldsFromData = (addressObj) => {
    if (!addressObj) return

    const city = addressObj.city || addressObj.town || addressObj.suburb || addressObj.village || addressObj.municipality || addressObj.county || ""
    const state = addressObj.state || addressObj.state_district || addressObj.region || ""
    const country = addressObj.country || ""
    const zipCode = addressObj.postcode || ""

    setFormData((prev) => ({
      ...prev,
      city: city || prev.city,
      state: state || prev.state,
      country: country || prev.country,
      zipCode: zipCode || prev.zipCode,
    }))
  }

  const handleReverseGeocode = async (lat, lng) => {
    try {
      setMapSearching(true)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      )
      const data = await response.json()
      if (data && data.address) {
        updateAddressFieldsFromData(data.address)
        setFormData(prev => {
          if (!prev.address && data.display_name) {
            return { ...prev, address: data.display_name }
          }
          return prev
        })
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error)
    } finally {
      setMapSearching(false)
    }
  }

  const handleGeocode = async () => {
    const query = [formData.address, formData.city, formData.state, formData.country]
      .filter(Boolean)
      .join(", ")
    if (!query) {
      toast.error("Please enter address or city first")
      return
    }

    try {
      setMapSearching(true)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}`
      )
      const data = await response.json()
      if (data && data.length > 0) {
        const { lat, lon, address } = data[0]
        const newLat = parseFloat(lat)
        const newLng = parseFloat(lon)

        setFormData((prev) => ({
          ...prev,
          lat: newLat.toFixed(6),
          lng: newLng.toFixed(6)
        }))

        if (address) {
          updateAddressFieldsFromData(address)
        }

        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([newLat, newLng], 15)
          markerRef.current.setLatLng([newLat, newLng])
        }
        toast.success("Location found on map!")
      } else {
        toast.error("Location not found on map. Try adjusting details.")
      }
    } catch (error) {
      console.error("Geocoding error:", error)
      toast.error("Error searching map")
    } finally {
      setMapSearching(false)
    }
  }


  useEffect(() => {
    if (!mapLoaded || currentStep !== 3) return

    const queryParts = [formData.address, formData.city, formData.state, formData.country]
      .filter(Boolean)
      .map(part => part.trim());

    if (queryParts.length === 0) return;

    const query = queryParts.join(", ");
    if (query.length < 3) return;

    setMapSearching(true)

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        )
        const data = await response.json()
        if (data && data.length > 0) {
          const { lat, lon } = data[0]
          const newLat = parseFloat(lat)
          const newLng = parseFloat(lon)

          setFormData((prev) => ({
            ...prev,
            lat: newLat.toFixed(6),
            lng: newLng.toFixed(6)
          }))
        }
      } catch (error) {
        console.error("Auto geocoding error:", error)
      } finally {
        setMapSearching(false)
      }
    }, 1000)

    return () => {
      clearTimeout(delayDebounce)
      setMapSearching(false)
    }
  }, [formData.address, formData.city, formData.state, formData.country, mapLoaded, currentStep])




  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, ownersRes] = await Promise.all([
          api.get('/agents'),
          api.get('/owners')
        ])
        setAgents(agentsRes.data)
        setOwners(ownersRes.data)

        // If not editing an existing property, preselect the first owner
        // when owners are available so the combobox doesn't appear empty.
        if (!id && ownersRes.data && ownersRes.data.length > 0) {
          const first = ownersRes.data[0]
          setFormData((prev) => ({ ...prev, owner: prev.owner || first._id }))
        }

        if (id) {
          setFetching(true)
          const propertyRes = await api.get(`/properties/${id}`)
          const p = propertyRes.data
          setFormData({
            ...p,
            agent: p.agent
              ? (Array.isArray(p.agent)
                  ? p.agent
                  : typeof p.agent === "string" && p.agent.startsWith("[") && p.agent.endsWith("]")
                  ? JSON.parse(p.agent)
                  : p.agent.split(",").map((s) => s.trim()).filter(Boolean))
              : [],
            owner: p.owner?._id || p.owner || "",
            images: p.images || [],
            lat: p.lat !== undefined && p.lat !== null ? p.lat.toString() : "",
            lng: p.lng !== undefined && p.lng !== null ? p.lng.toString() : "",
          })
        }

      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load property details")
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [id])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [id]: value }
      if (id === "propertyType") {
        const validAmenities = getAvailableAmenities(value)
        updated.amenities = prev.amenities.filter((a) => validAmenities.includes(a))
      }
      return updated
    })
  }

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
      return { ...prev, amenities }
    })
  }

  const handleCheckboxChange = (id, checked) => {
    setFormData((prev) => ({ ...prev, [id]: checked }))
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.title?.trim()) {
        toast.error("Property Title is required.")
        return
      }
      if (!formData.propertyType) {
        toast.error("Property Type is required.")
        return
      }
      if (!formData.purpose) {
        toast.error("Purpose is required.")
        return
      }
      if (!formData.price) {
        toast.error("Price is required.")
        return
      }
    } else if (currentStep === 2) {
      if (!formData.areaSize) {
        toast.error("Area Size is required.")
        return
      }
    } else if (currentStep === 3) {
      if (!formData.address?.trim()) {
        toast.error("Address is required.")
        return
      }
      if (!formData.city?.trim()) {
        toast.error("City is required.")
        return
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  }
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    if (currentStep < steps.length) {
      nextStep()
      return
    }

    if (!formData.title?.trim() || !formData.propertyType || !formData.purpose || !formData.price || !formData.areaSize || !formData.address?.trim() || !formData.city?.trim()) {
      toast.error("Please ensure all required fields are filled.")
      return
    }

    const hasAgent = Array.isArray(formData.agent)
      ? formData.agent.length > 0
      : Boolean(formData.agent && formData.agent.toString().trim());

    if (!hasAgent) {
      toast.error("Please assign at least one agent before saving.")
      return
    }

    if (loading) return

    const cleanedPayload = { ...formData };
    cleanedPayload.agent = Array.isArray(cleanedPayload.agent)
      ? cleanedPayload.agent.join(",")
      : (cleanedPayload.agent || null);
    if (!showBedrooms) {
      cleanedPayload.bedrooms = null;
    } else if (cleanedPayload.bedrooms !== "" && cleanedPayload.bedrooms !== null) {
      cleanedPayload.bedrooms = parseInt(cleanedPayload.bedrooms, 10);
    }
    if (!showBathrooms) {
      cleanedPayload.bathrooms = null;
    } else if (cleanedPayload.bathrooms !== "" && cleanedPayload.bathrooms !== null) {
      cleanedPayload.bathrooms = parseInt(cleanedPayload.bathrooms, 10);
    }
    if (!showPropertyAge) {
      cleanedPayload.propertyAge = null;
    } else if (cleanedPayload.propertyAge !== "" && cleanedPayload.propertyAge !== null) {
      cleanedPayload.propertyAge = parseInt(cleanedPayload.propertyAge, 10);
    }
    if (!showAmenities) {
      cleanedPayload.amenities = [];
    }

    if (cleanedPayload.lat !== "" && cleanedPayload.lat !== null && cleanedPayload.lat !== undefined) {
      cleanedPayload.lat = parseFloat(cleanedPayload.lat);
    } else {
      cleanedPayload.lat = null;
    }
    if (cleanedPayload.lng !== "" && cleanedPayload.lng !== null && cleanedPayload.lng !== undefined) {
      cleanedPayload.lng = parseFloat(cleanedPayload.lng);
    } else {
      cleanedPayload.lng = null;
    }


    setLoading(true)
    try {
      if (id) {
        await api.patch(`/properties/${id}`, cleanedPayload)
        toast.success("Property updated successfully!")
      } else {
        await api.post('/properties', cleanedPayload)
        toast.success("Property saved successfully!")
      }
      navigate("/properties")
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/properties">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{id ? "Edit Property" : "Add New Property"}</h2>
            <p className="text-muted-foreground">{id ? "Update the details for this property listing." : "Fill in the details to list your property."}</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="relative flex justify-between before:absolute before:top-5 before:left-0 before:h-0.5 before:w-full before:bg-muted">
        {steps.map((step) => (
          <div key={step.id} className="relative flex flex-col items-center gap-2">
            <div
              className={cn(
                "z-10 flex size-10 items-center justify-center rounded-full border-2 bg-background font-semibold transition-all",
                currentStep === step.id ? "border-primary text-primary ring-4 ring-primary/10" :
                  currentStep > step.id ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground"
              )}
            >
              {currentStep > step.id ? <IconCheck className="size-5" /> : step.id}
            </div>
            <span className={cn("hidden text-xs font-medium sm:block", currentStep >= step.id ? "text-foreground" : "text-muted-foreground")}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="mt-4">
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Tell us the fundamental details of the property.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="title">Property Title*</Label>
                <Input
                  id="title"
                  placeholder="e.g. Luxurious 3BHK Apartment"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Write a catchy description..."
                  className="min-h-32"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-3">
                  <Label>Property Type*</Label>
                  <Select onValueChange={(val) => handleSelectChange("propertyType", val)} value={formData.propertyType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="plot">Plot</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="shop">Shop</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label>Purpose*</Label>
                  <Select onValueChange={(val) => handleSelectChange("purpose", val)} value={formData.purpose}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="lease">For Lease</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label>Status</Label>
                  <Select onValueChange={(val) => handleSelectChange("status", val)} value={formData.status}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="booked">Booked</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="price">Price ({getCurrencySymbol()})*</Label>
                  <div className="relative w-full">
                    <PaymentInput id="price"
                      type="number"
                      placeholder="Enter amount"
                      className="w-full"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Specs & Amenities</CardTitle>
              <CardDescription>Details about size, rooms, and features.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="areaSize">Area Size*</Label>
                  <Input
                    id="areaSize"
                    type="number"
                    placeholder="e.g. 1500"
                    value={formData.areaSize}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label>Area Unit</Label>
                  <Select onValueChange={(val) => handleSelectChange("areaUnit", val)} value={formData.areaUnit}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="sqm">Sq M</SelectItem>
                        <SelectItem value="sqft">Sq Ft</SelectItem>
                        <SelectItem value="marla">Marla</SelectItem>
                        <SelectItem value="kanal">Kanal</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {showBedrooms && (
                  <div className="grid gap-3">
                    <Label className="flex items-center gap-2"><IconBed className="size-4" /> Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="Count"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                {showBathrooms && (
                  <div className="grid gap-3">
                    <Label className="flex items-center gap-2"><IconBath className="size-4" /> Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      placeholder="Count"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                {showPropertyAge && (
                  <div className="grid gap-3">
                    <Label htmlFor="propertyAge">Property Age</Label>
                    <Input
                      id="propertyAge"
                      type="number"
                      placeholder="Years"
                      value={formData.propertyAge}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>

              {showAmenities && (
                <div className="grid gap-4">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {availableAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <Checkbox
                          id={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={() => handleAmenityChange(amenity)}
                        />
                        <label htmlFor={amenity} className="text-sm font-medium leading-none cursor-pointer">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        )}


        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>Provide the exact address of the property.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="address">Address*</Label>
                <Input
                  id="address"
                  placeholder="Full street address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="city">City*</Label>
                  <Input
                    id="city"
                    placeholder="e.g. New York"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="state">State / Province</Label>
                  <Input
                    id="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
               <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <Label>Map Location (Click or Drag Marker to Set)</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGeocode}
                    className="h-8 text-xs font-semibold rounded-full border-border/80"
                    disabled={mapSearching}
                  >
                    {mapSearching ? (
                      <>
                        <IconLoader2 className="mr-1.5 size-3 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      "Find Address on Map"
                    )}
                  </Button>
                </div>
                <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-border/40 z-10">
                  <div id="property-map" className="h-full w-full"></div>
                  
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

                  {mapSearching && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                      <div className="flex flex-col items-center gap-2 rounded-xl bg-card border px-4 py-3 shadow-md">
                        <IconLoader2 className="size-6 animate-spin text-primary" />
                        <span className="text-xs font-semibold text-muted-foreground">Searching location...</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>


              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    placeholder="Latitude"
                    value={formData.lat}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    placeholder="Longitude"
                    value={formData.lng}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Media & Documents</CardTitle>
              <CardDescription>Upload images and assign management details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Agent - Required */}
                <div className="grid gap-3">
                  <Label>
                    Assign Agent <span className="text-destructive">*</span>
                  </Label>
                  <SearchableSelect
                    multiple
                    value={formData.agent}
                    onValueChange={(val) => handleSelectChange("agent", val)}
                    items={agents.map((agent) => ({
                      _id: agent._id,
                      name: agent.name + (agent.uniqueId ? ` — ${agent.uniqueId}` : "")
                    }))}
                    placeholder="Search agent by name or ID..."
                    searchPlaceholder="Search agent..."
                    className="w-full"
                    required
                  />
                </div>

                {/* Owner - Combobox with Search */}
                <div className="grid gap-3">
                  <Label>Property Owner (Optional)</Label>
                  <SearchableSelect
                    value={formData.owner}
                    onValueChange={(val) => handleSelectChange("owner", val)}
                    items={owners.map((owner) => ({
                      _id: owner._id,
                      name: owner.name + (owner.uniqueId ? ` — ${owner.uniqueId}` : "")
                    }))}
                    placeholder="Search by name or ID..."
                    searchPlaceholder="Search owner..."
                    className="w-full"
                  />
                </div>
              </div>


              <div className="grid gap-3">
                <Label>Property Gallery</Label>
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 p-8 transition-colors hover:bg-muted/50 relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <IconUpload className="mb-4 size-10 text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-medium">Click or drag images here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formData.images.length > 0 ? `${formData.images.length} files selected` : "No file chosen"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG, WEBP (Max 5MB each)</p>
                  </div>
                  <Button variant="outline" className="mt-6" type="button" onClick={triggerFileInput}>
                    Select Files
                  </Button>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx)
                          }))}
                          className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <IconTrash className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(val) => handleCheckboxChange("isFeatured", val)}
                  />
                  <Label htmlFor="isFeatured" className="font-medium cursor-pointer">Mark as Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isHot"
                    checked={formData.isHot}
                    onCheckedChange={(val) => handleCheckboxChange("isHot", val)}
                  />
                  <Label htmlFor="isHot" className="font-medium cursor-pointer">Mark as Hot Property</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 flex items-center justify-between border-t pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={cn(currentStep === 1 && "invisible")}
          >
            <IconArrowLeft className="mr-2 size-4" /> Previous
          </Button>

          <div className="flex gap-4">
            <Button variant="outline" type="button" onClick={() => navigate("/properties")}>
              Cancel
            </Button>
            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  nextStep()
                }}
              >
                Next Step <IconArrowRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="px-8">
                {loading ? "Saving..." : (id ? "Update Property" : "Save Property")}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
