import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/context/AuthContext"
import { useSettings } from "@/context/SettingsContext"
import api from "@/lib/api"
import { 
  IconLoader2,
  IconUsers,
  IconTrash,
  IconDotsVertical,
  IconUserShield,
  IconMail,
  IconShieldCheck,
  IconPlus
} from "@tabler/icons-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ReusableDataTable } from "@/components/ui/reusable-data-table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { DeleteConfirm } from "@/components/delete-confirm"

import { UserModal } from "@/components/Users/user-modal"

export default function UsersPage() {
  const { hasPermission } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const handleBulkDelete = async (ids) => {
    try {
      const toastId = toast.loading("Deleting selected users...")
      await Promise.all(ids.map(id => api.delete(`/users/${id}`)))
      toast.dismiss(toastId)
      toast.success("Selected users deleted successfully")
      fetchUsers()
    } catch (error) {
      toast.error("Failed to delete selected users")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/users/${id}`)
      toast.success("User deleted successfully", {
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
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed")
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedUser(null)
    setModalOpen(true)
  }

  const { formatDate } = useSettings()
  const columns = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {row.original.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <IconMail className="size-3" />
              <span>{row.original.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role || 'user'
        const variants = {
          admin: "bg-red-50 text-red-700 border-red-200",
          agent: "bg-blue-50 text-blue-700 border-blue-200",
          owner: "bg-amber-50 text-amber-700 border-amber-200",
          staff: "bg-emerald-50 text-emerald-700 border-emerald-200",
          customer: "bg-purple-50 text-purple-700 border-purple-200",
        }
        return (
          <Badge variant="outline" className={`capitalize ${variants[role] || "bg-gray-50 text-gray-700"}`}>
            {role}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate ? formatDate(row.original.createdAt) : new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                  <IconDotsVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="gap-2" onClick={() => handleEdit(row.original)}>
                  <IconUserShield className="size-4" />
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteConfirm 
                  title="Delete User?"
                  description={`Are you sure you want to delete ${row.original.name}? This action cannot be undone.`}
                  onConfirm={() => handleDelete(row.original._id)}
                >
                  <DropdownMenuItem 
                    className="gap-2 text-destructive" 
                    onSelect={(e) => e.preventDefault()}
                  >
                    <IconTrash className="size-4" />
                    Delete User
                  </DropdownMenuItem>
                </DeleteConfirm>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
  ], [fetchUsers])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Users</h2>
          <p className="text-muted-foreground">Manage all users across the system including Admins, Agents, Owners and Staff.</p>
        </div>
        {hasPermission('users', 'create') && (
          <Button onClick={handleAdd} className="gap-2 rounded-full shadow-lg">
            <IconPlus className="size-4" />
            Add User
          </Button>
        )}
      </div>

      <UserModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        onSuccess={fetchUsers} 
        initialData={selectedUser}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {users.length}
            </CardTitle>
            <CardAction>
              <IconUsers className="size-5 text-primary" />
            </CardAction>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>System Admins</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {users.filter(u => u.role === 'admin').length}
            </CardTitle>
            <CardAction>
              <IconShieldCheck className="size-5 text-red-500" />
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <ReusableDataTable 
          data={users} 
          columns={columns} 
          searchColumn="name" 
          searchPlaceholder="Search all users..."
          onAddClick={handleAdd}
          addButtonLabel="Add User"
          onBulkDelete={handleBulkDelete}
        />
      )}
    </div>
  )
}
