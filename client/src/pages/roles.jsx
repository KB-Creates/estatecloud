import { useSettings } from '@/context/SettingsContext';
import { useMemo, useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Link } from "react-router-dom"
import {
  IconShieldLock,
  IconUserShield,
  IconUsers,
  IconBuildingSkyscraper,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconLoader2,
  IconPlus,
  IconUserPlus
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ReusableDataTable } from "@/components/ui/reusable-data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import api from "@/lib/api"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

import { DeleteConfirm } from "@/components/delete-confirm"
import { UserModal } from "@/components/Users/user-modal"

export default function RolesPage() {
  const { hasPermission } = useAuth()
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [defaultRole, setDefaultRole] = useState(null)

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const response = await api.get('/roles')
      const filteredRoles = response.data.filter(r => r.name.toLowerCase() !== 'admin')
      setRoles(filteredRoles)
    } catch (error) {
      toast.error("Failed to fetch roles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleDeleteRole = async (id) => {
    try {
      const res = await api.delete(`/roles/${id}`)
      toast.success("Role deleted successfully", {
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
      fetchRoles()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete role")
    }
  }

  const iconMap = {
    admin: <IconShieldLock className="size-4 text-red-600" />,
    agent: <IconUserShield className="size-4 text-blue-600" />,
    staff: <IconUsers className="size-4 text-emerald-600" />,
    owner: <IconBuildingSkyscraper className="size-4 text-amber-600" />,
    customer: <IconUsers className="size-4 text-purple-600" />,
  }

  const { formatDate } = useSettings();
  const columns = useMemo(() => [
    // ... existing columns
    {
      accessorKey: "name",
      header: "Role Name",
      cell: ({ row }) => {
        const canEdit = hasPermission('roles', 'edit');
        const content = (
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
              {iconMap[row.original.name.toLowerCase()] || <IconShieldLock className="size-4 text-muted-foreground" />}
            </div>
            <span className="font-bold hover:underline">{row.original.name}</span>
          </div>
        );

        if (canEdit) {
          return (
            <Link to={`/roles/edit/${row.original._id}`} className="hover:text-primary transition-colors">
              {content}
            </Link>
          );
        }

        return content;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground max-w-[400px] inline-block">
          {row.original.description || "No description provided."}
        </span>
      ),
    },
    {
      accessorKey: "userCount",
      header: "Users Assigned",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono px-3 py-1 bg-muted/50 text-foreground border-none">
          {row.original.userCount || 0} Users
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          {row.original.status || "Active"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => <div className="text-muted-foreground">{formatDate ? formatDate(row.getValue("createdAt")) : new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
    },
    {
      id: "actions",
      cell: ({ row }) => {
        if (row.original.name.toLowerCase() === 'admin') {
          return null
        }

        if (!hasPermission('roles', 'edit') && !hasPermission('roles', 'delete') && !hasPermission('users', 'create')) {
          return null
        }

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <IconDotsVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {hasPermission('roles', 'edit') && (
                  <DropdownMenuItem className="gap-2" asChild>
                    <Link to={`/roles/edit/${row.original._id}`}>
                      Edit Role
                    </Link>
                  </DropdownMenuItem>
                )}
                {hasPermission('users', 'create') && (
                  <DropdownMenuItem
                    className="gap-2"
                    onClick={() => {
                      setDefaultRole(row.original.name.toLowerCase())
                      setUserModalOpen(true)
                    }}
                  >

                    Add User to Role
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {hasPermission('roles', 'delete') && (
                  <DeleteConfirm
                    title="Delete Role?"
                    description={`Are you sure you want to delete the "${row.original.name}" role? This cannot be undone.`}
                    onConfirm={() => handleDeleteRole(row.original._id)}
                  >
                    <DropdownMenuItem
                      className="gap-2 text-destructive"
                      onSelect={(e) => e.preventDefault()}
                      disabled={row.original.isSystem}
                    >

                      Delete Role
                    </DropdownMenuItem>
                  </DeleteConfirm>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ], [roles, hasPermission])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <IconShieldLock className="size-6 text-primary" />
            System Roles
          </h2>
          <p className="text-muted-foreground">Manage system roles, permissions and user assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          {hasPermission('users', 'create') && (
            <Button
              variant="outline"
              className="rounded-full gap-2"
              onClick={() => {
                setDefaultRole(null)
                setUserModalOpen(true)
              }}
            >
              <IconUserPlus className="size-4" />
              Add User
            </Button>
          )}
          {hasPermission('roles', 'create') && (
            <Button asChild>
              <Link to="/roles/create">
                <IconPlus className="size-4" />
                Add New Role
              </Link>
            </Button>
          )}
        </div>
      </div>

      <UserModal
        open={userModalOpen}
        onOpenChange={setUserModalOpen}
        onSuccess={fetchRoles}
        initialData={defaultRole ? { role: defaultRole } : null}
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <ReusableDataTable
          data={roles}
          columns={columns}
          searchColumn="name"
          searchPlaceholder="Search roles..."
        />
      )}
    </div>
  )
}
