import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import api from "@/lib/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { IconArrowLeft, IconLoader2, IconShieldLock } from "@tabler/icons-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CreateRolePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [roleName, setRoleName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  const features = [
    { id: "properties", name: "Properties", actions: ["create", "edit", "delete"] },
    { id: "inquiries", name: "Leads", actions: ["create", "edit", "delete", "assignLead"] },
    { id: "customers", name: "Customers", actions: ["create", "edit", "delete"] },
    { id: "bookings", name: "Bookings", actions: ["create", "edit", "cancel", "approve"] },
    { id: "payments", name: "Payments", actions: ["receivePayment", "editPayment", "deletePayment"] },
    { id: "due_collection", name: "Due Collection", actions: ["manageRecovery"] },
    { id: "contracts", name: "Contracts", actions: ["create", "edit", "delete"] },
    { id: "financial_reports", name: "Reports", actions: ["viewReports", "exportReports"] },
    { id: "agents", name: "Agents", actions: ["create", "edit", "delete"] },
    { id: "property_owners", name: "Owners", actions: ["create", "edit", "delete"] },
    { id: "staff", name: "Staff", actions: ["create", "edit", "delete"] },
    { id: "users", name: "Users", actions: ["create", "edit", "delete"] },
    { id: "roles", name: "Roles", actions: ["create", "edit", "delete"] },
    { id: "settings", name: "Settings", actions: ["edit"] },
  ]

  const getActionLabel = (actionKey) => {
    switch (actionKey) {
      case "create": return "Create";
      case "edit": return "Edit";
      case "delete": return "Delete";
      case "assignLead": return "Assign Lead";
      case "cancel": return "Cancel";
      case "approve": return "Approve";
      case "receivePayment": return "Receive Payment";
      case "editPayment": return "Edit Payment";
      case "deletePayment": return "Delete Payment";
      case "manageRecovery": return "Manage Recovery";
      case "viewReports": return "View Reports";
      case "exportReports": return "Export Reports";
      default: return actionKey.charAt(0).toUpperCase() + actionKey.slice(1);
    }
  };

  const [permissions, setPermissions] = useState(
    features.map(f => {
      const initialActions = {};
      f.actions.forEach(act => {
        initialActions[act] = false;
      });
      return {
        featureId: f.id,
        viewScope: "none",
        actions: initialActions,
        enabled: true
      };
    })
  )

  useEffect(() => {
    if (id) {
      fetchRoleDetails()
    }
  }, [id])

  const fetchRoleDetails = async () => {
    try {
      setFetching(true)
      const response = await api.get(`/roles/${id}`)
      const role = response.data
      setRoleName(role.name)
      setDescription(role.description)

      if (role.permissions && role.permissions.length > 0) {
        // Merge fetched permissions with full feature list
        const mergedPermissions = features.map(f => {
          const existing = role.permissions.find(p => p.featureId === f.id)
          const initialActions = {};
          f.actions.forEach(act => {
            initialActions[act] = existing?.actions?.[act] || false;
          });
          return {
            featureId: f.id,
            viewScope: existing?.viewScope || "none",
            actions: initialActions,
            enabled: existing?.enabled !== undefined ? existing.enabled : true
          }
        })
        setPermissions(mergedPermissions)
      }
    } catch (error) {
      console.error("Error fetching role details:", error)
      const msg = error.response?.data?.message || error.message
      toast.error(`Failed to load role details: ${msg}`)
    } finally {
      setFetching(false)
    }
  }

  const handlePermissionChange = async (featureId, field, value) => {
    const updatedPermissions = permissions.map(p => {
      if (p.featureId === featureId) {
        if (field === 'viewScope') {
          return { ...p, viewScope: value }
        }
        return { ...p, actions: { ...p.actions, [field]: value } }
      }
      return p
    })

    setPermissions(updatedPermissions)

    if (id) {
      try {
        const payload = {
          name: roleName,
          description,
          permissions: updatedPermissions
        }
        await api.put(`/roles/${id}`, payload)
        toast.success("Permissions updated successfully", { duration: 1000 })
      } catch (error) {
        toast.error("Auto-save failed: " + (error.response?.data?.message || error.message))
      }
    }
  }

  const handleMetaBlur = async () => {
    if (id && roleName) {
      try {
        const payload = {
          name: roleName,
          description,
          permissions
        }
        await api.put(`/roles/${id}`, payload)
        toast.success("Role details updated", { duration: 1000 })
      } catch (error) {
        toast.error("Failed to save role details: " + (error.response?.data?.message || error.message))
      }
    }
  }

  const handleSubmit = async () => {
    if (!roleName) {
      toast.error("Role name is required")
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: roleName,
        description,
        permissions
      }

      if (id) {
        await api.put(`/roles/${id}`, payload)
        toast.success("Role updated successfully")
      } else {
        await api.post('/roles', payload)
        toast.success("Role created successfully")
        navigate('/roles')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save role")
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
    <div className="flex flex-col mx-auto w-full max-w-6xl gap-6 pb-10 px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} >
          <IconArrowLeft className="size-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold ">{id ? "Edit Role" : "Create New Role"}</h2>
          <p className="text-muted-foreground text-sm">Define access permissions for this role</p>
        </div>
      </div>

      <Card className="shadow-sm border-muted/60">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <IconShieldLock className="size-5" />
            <span>Role Details</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-3">
              <Label htmlFor="roleName">Role Name *</Label>
              <Input
                id="roleName"
                placeholder="e.g. Sales Manager"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                onBlur={handleMetaBlur}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of responsibilities"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleMetaBlur}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-muted/60 overflow-hidden">
        <CardHeader className="bg-muted/10 border-b pb-4">
          <CardTitle className="text-lg">Access Permissions</CardTitle>
          <CardDescription>Configure what users with this role can see and do.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead className="w-[200px] font-bold text-foreground">Feature</TableHead>
                  <TableHead className="w-[300px] font-bold text-foreground text-center">View Scope</TableHead>
                  <TableHead className="font-bold text-foreground text-left px-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feature) => {
                  const perm = permissions.find(p => p.featureId === feature.id) || {
                    viewScope: "none",
                    actions: { create: false, edit: false, delete: false }
                  }

                  return (
                    <TableRow key={feature.id} className="hover:bg-muted/5">
                      <TableCell className="font-semibold py-4">{feature.name}</TableCell>
                      <TableCell className="py-4">
                        <RadioGroup
                          value={perm.viewScope}
                          onValueChange={(val) => handlePermissionChange(feature.id, 'viewScope', val)}
                          className="flex items-center justify-center gap-6"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="none" id={`${feature.id}-none`} />
                            <Label htmlFor={`${feature.id}-none`} className="text-sm text-muted-foreground cursor-pointer">None</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="own" id={`${feature.id}-own`} />
                            <Label htmlFor={`${feature.id}-own`} className="text-sm text-muted-foreground cursor-pointer">Own Only</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="all" id={`${feature.id}-all`} />
                            <Label htmlFor={`${feature.id}-all`} className="text-sm text-muted-foreground cursor-pointer">All</Label>
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center justify-start flex-wrap gap-6 px-8">
                          {feature.actions.map(actionKey => {
                            const label = getActionLabel(actionKey);
                            return (
                              <div className="flex items-center gap-2" key={actionKey}>
                                <Checkbox
                                  id={`${feature.id}-${actionKey}`}
                                  checked={!!perm.actions?.[actionKey]}
                                  onCheckedChange={(val) => handlePermissionChange(feature.id, actionKey, val)}
                                />
                                <Label htmlFor={`${feature.id}-${actionKey}`} className="text-sm text-muted-foreground cursor-pointer">{label}</Label>
                              </div>
                            );
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3 pt-4">
        {id ? (
          <Button className="rounded-full px-8 shadow-lg" onClick={() => navigate('/roles')}>
            Done
          </Button>
        ) : (
          <>
            <Button variant="outline" className="rounded-full px-8" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button className="rounded-full px-8 shadow-lg shadow-primary/20" onClick={handleSubmit} disabled={loading}>
              {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              Save Role
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
