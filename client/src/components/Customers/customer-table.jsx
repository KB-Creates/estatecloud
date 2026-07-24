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
  IconPhone,
  IconMapPin
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

export function CustomerTable({ customers, onUpdate, onEdit, onDelete, onBulkDelete }) {
  const { formatDate } = useSettings();
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
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {row.original.name?.charAt(0).toUpperCase()}
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
      accessorKey: "phone",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm">
            <IconPhone className="size-3.5 text-muted-foreground" />
            <span>{row.original.phone || "No phone"}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground max-w-[200px] truncate">
          <IconMapPin className="size-3.5 shrink-0" />
          <span>{row.original.address || "No address"}</span>
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
      cell: ({ row }) => {
        const hasActions = onEdit || onDelete;
        if (!hasActions) return null;

        return (
          <div className="flex items-center justify-end gap-1">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                  <IconDotsVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {onEdit && (
                  <DropdownMenuItem className="gap-2" onClick={() => onEdit(row.original)}>
                    <IconEdit className="size-4" />
                    Edit Profile
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DeleteConfirm 
                      title="Delete Customer?"
                      description={`Are you sure you want to delete ${row.original.name}? This action cannot be undone.`}
                      onConfirm={() => onDelete(row.original._id)}
                    >
                      <DropdownMenuItem 
                        className="gap-2 text-destructive" 
                        onSelect={(e) => e.preventDefault()}
                      >
                        <IconTrash className="size-4" />
                        Delete Customer
                      </DropdownMenuItem>
                    </DeleteConfirm>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ], [onUpdate, onEdit, onDelete, formatDate])

  return (
    <ReusableDataTable 
      data={customers} 
      columns={columns} 
      searchColumn="name" 
      searchPlaceholder="Search customers..."
      onBulkDelete={onBulkDelete}
    />
  )
}
