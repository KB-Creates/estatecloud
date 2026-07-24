import { useMemo } from "react"
import { useSettings } from "@/context/SettingsContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  IconDotsVertical,
  IconUser,
  IconMail,
  IconTrash,
  IconEdit,
  IconActivity,
  IconWallet
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

export function AgentTable({ agents, onUpdate, onEdit }) {
  const { getCurrencySymbol , formatDate } = useSettings()
  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/agents/${id}`)
      toast.success("Agent deleted successfully", {
        action: {
          label: "Undo",
          onClick: async () => {
            if (res.data?.trashId) {
                try {
                    await api.post(`/trash/restore/${res.data.trashId}`);
                    toast.success("Restored successfully");
                    onUpdate();
                } catch (e) {
                    toast.error("Failed to restore");
                }
            } else {
                toast.info("Cannot restore this item");
            }
          }
        }
      })
      onUpdate()
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed")
    }
  }

  const columns = useMemo(() => [
    // ... existing columns (select, name, activity, earnings, status)
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
      header: "Agent",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {row.original.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      id: "activity",
      header: "Activity",
      cell: () => (
        <div className="flex items-center gap-2">
          <IconActivity className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">0 Tasks</span>
        </div>
      ),
    },
    {
      id: "earnings",
      header: "Earnings",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconWallet className="size-4 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-600">{getCurrencySymbol()}0.00</span>
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
                title="Delete Agent?"
                description={`This will permanently delete ${row.original.name} and remove their access to the system.`}
                onConfirm={() => handleDelete(row.original._id)}
              >
                <DropdownMenuItem 
                  className="gap-2 text-destructive" 
                  onSelect={(e) => e.preventDefault()}
                >
                  <IconTrash className="size-4" />
                  Delete Agent
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
      data={agents} 
      columns={columns} 
      searchColumn="name" 
      searchPlaceholder="Search agents..."
    />
  )
}
