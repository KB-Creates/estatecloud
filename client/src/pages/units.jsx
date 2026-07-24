import { useSettings } from '@/context/SettingsContext';
import { useState, useEffect, useMemo } from "react"
import api from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  IconLoader2,
  IconInbox,
  IconBuilding,
  IconDotsVertical,
  IconBed,
  IconBath,
  IconWindow,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { AddUnitModal } from "@/components/Units/add-unit-modal"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ReusableDataTable } from "@/components/ui/reusable-data-table"
import { Checkbox } from "@/components/ui/checkbox"
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
import { UnitCellViewer } from "@/components/Units/unit-cell-viewer"

import { DeleteConfirm } from "@/components/delete-confirm"

export default function UnitsPage() {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState(null)

  const propertiesList = useMemo(() => {
    const list = []
    const seen = new Set()
    units?.forEach(unit => {
      const prop = unit.property
      if (prop && !seen.has(prop._id || prop)) {
        seen.add(prop._id || prop)
        list.push({
          id: prop._id || prop,
          title: prop.title || "N/A"
        })
      }
    })
    return list
  }, [units])

  const handleBulkDelete = async (selectedRows) => {
    try {
      const ids = selectedRows.map(row => row.original._id)
      const toastId = toast.loading("Deleting selected units...")
      await Promise.all(ids.map(id => api.delete(`/units/${id}`)))
      toast.dismiss(toastId)
      toast.success("Selected units deleted successfully")
      fetchUnits()
    } catch (error) {
      toast.error("Failed to delete selected units")
    }
  }

  const handleBulkStatusUpdate = async (selectedRows, newStatus) => {
    try {
      const ids = selectedRows.map(row => row.original._id)
      const toastId = toast.loading(`Updating status to ${newStatus}...`)
      await Promise.all(ids.map(id => api.patch(`/units/${id}`, { status: newStatus })))
      toast.dismiss(toastId)
      toast.success(`Selected units updated to ${newStatus}`)
      fetchUnits()
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  useEffect(() => {
    fetchUnits()
  }, [])

  const fetchUnits = async () => {
    try {
      setLoading(true)
      const response = await api.get('/units')
      setUnits(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (unitId, newStatus) => {
    try {
      await api.patch(`/units/${unitId}`, { status: newStatus })
      toast.success(`Unit status updated to ${newStatus}`)
      fetchUnits()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/units/${id}`)
      toast.success("Unit deleted successfully", {
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
      fetchUnits()
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed")
    }
  }

  const handleEdit = (unit) => {
    setSelectedUnit(unit)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedUnit(null)
    setModalOpen(true)
  }

  const { formatDate, getCurrencySymbol } = useSettings();
  const columns = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "unitDetails",
      header: "Unit Details",
      cell: ({ row }) => <UnitCellViewer unit={row.original} onUpdate={fetchUnits} />,
    },
    {
      accessorKey: "property",
      header: "Property",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 max-w-[180px] truncate">
          <IconBuilding className="size-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium truncate">{row.original.property?.title || "N/A"}</span>
        </div>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "all") return true
        const prop = row.getValue(columnId)
        const propId = prop?._id || prop
        return propId === filterValue
      },
    },
    {
      accessorKey: "specs",
      header: "Specs",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1 border-muted-foreground/20">
            <IconBed className="size-3 text-primary" />
            <span>{row.original.bedrooms || 0}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 border-muted-foreground/20">
            <IconBath className="size-3 text-primary" />
            <span>{row.original.bathrooms || 0}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 border-muted-foreground/20">
            <IconWindow className="size-3 text-primary" />
            <span>{row.original.windows || 0}</span>
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className=" text-primary">
          {getCurrencySymbol()}{row.original.price?.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Select
          onValueChange={(val) => handleStatusUpdate(row.original._id, val)}
          defaultValue={row.original.status}
        >
          <SelectTrigger className="w-[120px] bg-muted/50 ">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
              <SelectItem value="Rented">Rented</SelectItem>
              <SelectItem value="Booked">Booked</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "all") return true
        return row.getValue(columnId) === filterValue
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteConfirm
              title="Delete Unit?"
              description={`Are you sure you want to delete unit ${row.original.unitNumber}? This action cannot be undone.`}
              onConfirm={() => handleDelete(row.original._id)}
            >
              <DropdownMenuItem
                className="text-destructive font-medium"
                onSelect={(e) => e.preventDefault()}
              >
                Delete
              </DropdownMenuItem>
            </DeleteConfirm>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [fetchUnits, getCurrencySymbol, formatDate])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Unit Management</h2>
          <p className="text-muted-foreground">Detailed list view of all units across your properties.</p>
        </div>
      </div>

      <AddUnitModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={fetchUnits}
        initialData={selectedUnit}
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : units.length === 0 ? (
        <Empty className="rounded-2xl border-2 border-dashed bg-muted/50">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconInbox className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No units defined yet.</EmptyTitle>
            <EmptyDescription>
              Start by creating your first unit and assigning it to a property.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={handleAdd} variant="outline" className="rounded-full">
              Create Your First Unit
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ReusableDataTable
          data={units}
          columns={columns}
          searchColumn="unitDetails"
          searchPlaceholder="Search units..."
          onAddClick={handleAdd}
          addButtonLabel="Add Unit"
          filterElement={({ table }) => (
            <div className="flex items-center gap-2">
              <Select
                value={(table.getColumn("property")?.getFilterValue()) ?? "all"}
                onValueChange={(val) => {
                  table.getColumn("property")?.setFilterValue(val === "all" ? undefined : val)
                }}
              >
                <SelectTrigger className="w-[180px] bg-muted/50 border-none h-9 text-muted-foreground">
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Properties</SelectItem>
                    {propertiesList.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={(table.getColumn("status")?.getFilterValue()) ?? "all"}
                onValueChange={(val) => {
                  table.getColumn("status")?.setFilterValue(val === "all" ? undefined : val)
                }}
              >
                <SelectTrigger className="w-[150px] bg-muted/50 border-none h-9 text-muted-foreground">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Rented">Rented</SelectItem>
                    <SelectItem value="Booked">Booked</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          bulkActions={({ table, selectedRows }) => (
            <div className="flex items-center gap-2">
              <Select
                onValueChange={(val) => {
                  handleBulkStatusUpdate(selectedRows, val)
                  table.resetRowSelection()
                }}
              >
                <SelectTrigger className="h-8 w-[140px]">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Rented">Rented</SelectItem>
                    <SelectItem value="Booked">Booked</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <DeleteConfirm
                title="Delete Selected Units?"
                description={`Are you sure you want to delete ${selectedRows.length} selected units? This action cannot be undone.`}
                onConfirm={async () => {
                  await handleBulkDelete(selectedRows)
                  table.resetRowSelection()
                }}
              >
                <Button variant="destructive" size="sm" className="h-8">
                  <IconTrash className="size-4 mr-1.5" />
                  Delete ({selectedRows.length})
                </Button>
              </DeleteConfirm>
            </div>
          )}
        />
      )}
    </div>
  )
}
