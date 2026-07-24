import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { IconArrowLeft, IconUsers, IconLoader2 } from "@tabler/icons-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function AddCustomerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [agents, setAgents] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Customer",
    address: "",
    notes: "",
    status: "Active",
    assignedAgents: [],
  })

  useEffect(() => {
    const init = async () => {
      await fetchAgents()
      if (id) {
        await fetchCustomerDetails()
      }
    }
    init()
  }, [id])

  const fetchAgents = async () => {
    try {
      const response = await api.get('/agents')
      setAgents(response.data)
    } catch (error) {
      console.error("Error fetching agents:", error)
    }
  }

  const fetchCustomerDetails = async () => {
    try {
      setFetching(true)
      const response = await api.get(`/users/${id}`)
      const c = response.data
      setFormData({
        ...c,
        password: "", // Don't show existing password
        assignedAgents: c.assignedAgents?.map(a => a._id || a) || [],
      })
    } catch (error) {
      toast.error("Failed to load customer details")
    } finally {
      setFetching(false)
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    try {
      const payload = { ...formData, role: 'Customer' }
      if (!id && !formData.password) {
        toast.error("Password is required for new customers")
        setLoading(false)
        return
      }
      
      if (id) {
        // Remove password from payload if it's empty during edit
        if (!payload.password) delete payload.password
        await api.patch(`/users/${id}`, payload)
        toast.success("Customer updated successfully!")
      } else {
        await api.post('/users', payload)
        toast.success("Customer created successfully!")
      }
      navigate("/customers")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save customer")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <IconLoader2 className="size-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/customers">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{id ? "Edit Customer Details" : "Add New Customer"}</h2>
            <p className="text-muted-foreground">{id ? "Update the account details for this customer." : "Fill in the details to create a new customer account."}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential details of the customer.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Customer Name*</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter customer name" 
                    className="w-full" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="admin@example.com" 
                      className="w-full" 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Password{id ? "" : "*"}</Label>
                    <Input 
                      id="password" 
                      type="password"
                      placeholder={id ? "Leave empty to keep current" : "••••••"} 
                      className="w-full" 
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!id} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-3">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      placeholder="Enter phone number" 
                      className="w-full" 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label>System Role*</Label>
                    <Select onValueChange={(val) => handleSelectChange("role", val)} value={formData.role}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Customer">Customer</SelectItem>
                          <SelectItem value="Tenant">Tenant</SelectItem>
                          <SelectItem value="Prospect">Prospect</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address" 
                    placeholder="Enter address" 
                    className="min-h-24 w-full" 
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Additional notes" 
                    className="min-h-32 w-full" 
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Management</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label>Status*</Label>
                  <Select onValueChange={(val) => handleSelectChange("status", val)} value={formData.status}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Banned">Banned</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label className="flex items-center gap-2">
                    <IconUsers className="size-4" /> Assigned Agents
                  </Label>
                  <div className="rounded-md border p-4">
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {agents.length > 0 ? agents.map((agent) => (
                        <div key={agent._id} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id={`agent-${agent._id}`}
                            className="rounded border-gray-300 h-4 w-4"
                            checked={formData.assignedAgents.includes(agent._id)}
                            onChange={(e) => {
                              const checked = e.target.checked
                              setFormData(prev => ({
                                ...prev,
                                assignedAgents: checked 
                                  ? [...prev.assignedAgents, agent._id]
                                  : prev.assignedAgents.filter(id => id !== agent._id)
                              }))
                            }}
                          />
                          <label htmlFor={`agent-${agent._id}`} className="text-sm font-medium cursor-pointer">
                            {agent.name}
                          </label>
                        </div>
                      )) : (
                        <p className="text-xs text-muted-foreground italic">No agents found</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 pt-4">
              <Button type="submit" disabled={loading} className="w-full h-11">
                {loading ? "Saving..." : (id ? "Update Customer" : "Save Customer")}
              </Button>
              <Button variant="outline" type="button" className="w-full h-11" onClick={() => navigate("/customers")}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
