import { useSettings } from '@/context/SettingsContext';
import React, { useMemo } from "react"
import { ReusableDataTable } from "@/components/ui/reusable-data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  IconBuilding, 
  IconPlus, 
  IconDotsVertical
} from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { toast } from "sonner"
import { MaintenanceCellViewer } from "./maintenance-cell-viewer"

const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        case 'In Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        case 'Completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        case 'Cancelled': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
        default: return 'bg-muted text-muted-foreground'
    }
}

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'High': return 'destructive'
        case 'Medium': return 'secondary'
        case 'Low': return 'outline'
        default: return 'outline'
    }
}

import { DeleteConfirm } from "@/components/delete-confirm"

import { Link } from "react-router-dom"

export function MaintenanceTable({ data, onAddClick, onUpdate }) {
  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/maintenance/${id}`)
      toast.success("Task deleted successfully", {
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
      onUpdate()
    } catch (e) {
      toast.error("Failed to delete")
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/maintenance/${id}`, { status })
      toast.success("Status updated")
      onUpdate()
    } catch (e) {
      toast.error("Failed to update status")
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
      accessorKey: "title",
      header: "Issue / Task",
      cell: ({ row }) => <MaintenanceCellViewer maintenance={row.original} onUpdate={onUpdate} />,
    },
    {
      accessorKey: "property",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <IconBuilding className="size-3.5 text-primary shrink-0" />
            <span className="truncate">{row.original.property?.title || "N/A"}</span>
          </div>
          <span className="text-[10px] text-muted-foreground pl-5 uppercase font-bold tracking-wider">
            Unit {row.original.unit?.unitNumber}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <Badge 
          variant={getPriorityColor(row.original.priority)} 
          className="px-2"
        >
          {row.original.priority}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Select 
            defaultValue={row.original.status} 
            onValueChange={(val) => handleStatusChange(row.original._id, val)}
        >
            <SelectTrigger className={cn("w-fit h-7 text-[10px] font-bold border-none", getStatusColor(row.original.status))}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "estimatedCost",
      header: "Cost",
      cell: ({ row }) => (
        <div className="font-bold text-emerald-600 text-sm">
          {getCurrencySymbol()}{row.original.estimatedCost?.toLocaleString() || 0}
        </div>
      ),
    },
    {
      accessorKey: "scheduledDate",
      header: "Scheduled",
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground font-medium">
          {row.original.scheduledDate ? format(new Date(row.original.scheduledDate), "MMM dd, yyyy") : "TBD"}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => <div className="text-muted-foreground">{formatDate ? formatDate(row.getValue("createdAt")) : new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/maintenance/edit/${row.original._id}`}>
                Edit Task
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteConfirm 
                title="Delete Task?"
                description="This will permanently delete this maintenance task from the logs."
                onConfirm={() => handleDelete(row.original._id)}
            >
                <DropdownMenuItem 
                    className="gap-2 text-destructive font-medium" 
                    onSelect={(e) => e.preventDefault()}
                >
                    Delete Task
                </DropdownMenuItem>
            </DeleteConfirm>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [onUpdate])

  return (
    <ReusableDataTable 
      data={data} 
      columns={columns} 
      filterColumn="title" 
      filterPlaceholder="Search tasks..."
      actions={
        <Button onClick={onAddClick} className="gap-2">
          <IconPlus className="size-4" />
          Log Maintenance
        </Button>
      }
    />
  )
}
