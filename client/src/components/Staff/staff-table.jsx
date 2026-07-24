import { useSettings } from '@/context/SettingsContext';
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  IconDotsVertical,
  IconUser,
  IconMail,
  IconTrash,
  IconEdit,
  IconBriefcase,
  IconPhone,
  IconCash
} from "@tabler/icons-react"
import { ReusableDataTable } from "@/components/ui/reusable-data-table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import api from "@/lib/api"
import { toast } from "sonner"

import { DeleteConfirm } from "@/components/delete-confirm"

export function StaffTable({ staff, onUpdate, onEdit, onBulkDelete }) {
  const handleDelete = async (id) => {
    try {
      await api.delete(`/staff/${id}`)
      toast.success("Staff profile deleted")
      onUpdate()
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed")
    }
  }

  const { formatDate, getCurrencySymbol } = useSettings();
  const columns = useMemo(() => [
    // ... existing columns
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
      header: "Employee",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
            {row.original.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <IconMail className="size-3" />
              <span>{row.original.email || "No email"}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "designation",
      header: "Designation",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconBriefcase className="size-3.5 text-muted-foreground" />
          <span className="text-sm">{row.original.designation || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "basicSalary",
      header: "Salary",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconCash className="size-3.5 text-blue-600" />
          <span className="text-sm font-bold">{getCurrencySymbol()}{(row.original.basicSalary || 0).toLocaleString()}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "Active"
        return (
          <Badge variant="outline" className={
            status === 'Active' 
            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
            : "bg-gray-50 text-gray-700 border-gray-200"
          }>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => <div className="text-muted-foreground">{formatDate ? formatDate(row.getValue("createdAt")) : new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
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
              <DropdownMenuItem className="gap-2" onClick={() => onEdit(row.original)}>
                <IconEdit className="size-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteConfirm 
                title="Delete Staff?"
                description={`Are you sure you want to delete ${row.original.name}? This will remove their profile and records.`}
                onConfirm={() => handleDelete(row.original._id)}
              >
                <DropdownMenuItem 
                  className="gap-2 text-destructive" 
                  onSelect={(e) => e.preventDefault()}
                >
                  <IconTrash className="size-4" />
                  Delete Staff
                </DropdownMenuItem>
              </DeleteConfirm>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ], [onUpdate, onEdit])

  return (
    <ReusableDataTable 
      data={staff} 
      columns={columns} 
      searchColumn="name" 
      searchPlaceholder="Search staff members..."
      onBulkDelete={onBulkDelete}
    />
  )
}
