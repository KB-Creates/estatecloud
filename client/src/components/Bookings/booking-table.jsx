import { useSettings } from '@/context/SettingsContext';
import React, { useMemo } from "react"
import { ReusableDataTable } from "@/components/ui/reusable-data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  IconBuilding, 
  IconPlus, 
  IconCalendar,
  IconClock,
  IconUser,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconCurrencyDollar,
  IconWallet
} from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirm } from "@/components/delete-confirm"
import { BookingCellViewer } from "./booking-cell-viewer"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function BookingTable({ bookings, onStatusUpdate, onAddClick, onEdit, onDelete, onUpdate }) {
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
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => <BookingCellViewer booking={row.original} onUpdate={onUpdate} />,
    },
    {
      accessorKey: "property",
      header: "Target Property",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 truncate max-w-[180px]">
            <IconBuilding className="size-3.5 text-primary" />
            <span className="text-xs font-semibold truncate">{row.original.property?.title || "N/A"}</span>
          </div>
          {row.original.unit && (
            <span className="text-[10px] text-muted-foreground pl-5">
              Unit {row.original.unit.unitNumber} ({row.original.unit.block})
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "totalPrice",
      header: "Financials",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <IconCurrencyDollar className="size-3.5" />
            <span>Total: Rs {(row.original.totalPrice || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
             <IconWallet className="size-3.5 text-amber-500" />
             <span>Rem: Rs {(row.original.remainingAmount || 0).toLocaleString()}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "agent",
      header: "Assigned Agent",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="bg-muted p-1 rounded-full">
            <IconUser className="size-3 text-muted-foreground" />
          </div>
          <span className="text-xs font-medium">{row.original.agent || "Unassigned"}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Current Status",
      cell: ({ row }) => (
        <Select 
          onValueChange={(val) => onStatusUpdate(row.original._id, val)} 
          defaultValue={row.original.status}
        >
          <SelectTrigger className={cn(
            "w-fit h-7 text-[10px] font-bold border-none",
            row.original.status === 'Pending Request' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
            row.original.status === 'Confirmed' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            row.original.status === 'Cancelled' && "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
          )}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Pending Request">Pending Request</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
            <DropdownMenuItem className="gap-2" onClick={() => onEdit(row.original._id)}>
              <IconEdit className="size-4" />
              Edit Booking
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteConfirm 
                title="Cancel Booking?"
                description="This will permanently cancel this reservation. This action cannot be undone."
                onConfirm={() => onDelete(row.original._id)}
            >
                <DropdownMenuItem 
                    className="gap-2 text-destructive font-medium" 
                    onSelect={(e) => e.preventDefault()}
                >
                    <IconTrash className="size-4" />
                    Cancel Booking
                </DropdownMenuItem>
            </DeleteConfirm>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [onStatusUpdate, onEdit, onDelete, onUpdate])

  return (
    <ReusableDataTable 
      data={bookings} 
      columns={columns}
      filterColumn="customerName"
      filterPlaceholder="Search customer..."
      actions={
        <Button onClick={onAddClick} className="gap-2 rounded-full h-9">
          <IconPlus className="size-4" />
          Create Booking
        </Button>
      }
    />
  )
}