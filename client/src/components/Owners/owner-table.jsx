import { useSettings } from '@/context/SettingsContext';
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  IconDotsVertical,
  IconMail,
  IconBuildings,
  IconPhone
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

export function OwnerTable({ owners, onUpdate, onEdit, onBulkDelete }) {
  const handleDelete = async (id) => {
    try {
      await api.delete(`/owners/${id}`)
      toast.success("Owner profile deleted")
      onUpdate()
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed")
    }
  }

  const { formatDate } = useSettings();
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
      accessorKey: "uniqueId",
      header: "Owner ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.uniqueId || "—"}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Owner",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
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
      accessorKey: "companyName",
      header: "Entity / Company",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <IconBuildings className="size-3.5 text-muted-foreground" />
            <span className="text-sm font-medium">{row.original.companyName || "N/A"}</span>
          </div>
          {row.original.taxId && (
            <span className="text-[10px] text-muted-foreground px-1 bg-muted w-fit rounded uppercase">
              ID: {row.original.taxId}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <IconPhone className="size-3.5 text-muted-foreground" />
          <span>{row.original.phone || "No phone"}</span>
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
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteConfirm
                title="Delete Owner?"
                description={`Are you sure you want to delete ${row.original.name}? This will remove all their property associations.`}
                onConfirm={() => handleDelete(row.original._id)}
              >
                <DropdownMenuItem
                  className="gap-2 text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  Delete Owner
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
      data={owners}
      columns={columns}
      searchColumn="name"
      searchPlaceholder="Search owners..."
      onBulkDelete={onBulkDelete}
    />
  )
}
