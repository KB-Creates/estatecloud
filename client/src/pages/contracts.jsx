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
  IconPlus,
  IconUser,
  IconCalendar,
  IconCash,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddContractModal } from "@/components/Contracts/add-contract-modal"
import { ContractCellViewer } from "@/components/Contracts/contract-cell-viewer"
import { ContractStats } from "@/components/Contracts/contract-stats"

import { IconEdit, IconTrash } from "@tabler/icons-react"
import { DeleteConfirm } from "@/components/delete-confirm"

export default function ContractsPage() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)

  const handleBulkDelete = async (selectedRows) => {
    try {
      const ids = selectedRows.map(row => row.original._id)
      const toastId = toast.loading("Deleting selected contracts...")
      await Promise.all(ids.map(id => api.delete(`/contracts/${id}`)))
      toast.dismiss(toastId)
      toast.success("Selected contracts deleted successfully")
      fetchContracts()
    } catch (error) {
      toast.error("Failed to delete selected contracts")
    }
  }

  const handleBulkStatusUpdate = async (selectedRows, newStatus) => {
    try {
      const ids = selectedRows.map(row => row.original._id)
      const toastId = toast.loading(`Updating status to ${newStatus}...`)
      await Promise.all(ids.map(id => api.patch(`/contracts/${id}`, { status: newStatus })))
      toast.dismiss(toastId)
      toast.success(`Selected contracts updated to ${newStatus}`)
      fetchContracts()
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/contracts')
      setContracts(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (contractId, newStatus) => {
    try {
      await api.patch(`/contracts/${contractId}`, { status: newStatus })
      toast.success(`Contract status updated to ${newStatus}`)
      fetchContracts()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/contracts/${id}`)
      toast.success("Contract deleted")
      fetchContracts()
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  const handleEdit = (contract) => {
    setSelectedContract(contract)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedContract(null)
    setModalOpen(true)
  }

  const { formatDate, getCurrencySymbol } = useSettings();
  const columns = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "clientName",
      header: "Tenant Details",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <ContractCellViewer contract={row.original} onUpdate={fetchContracts} />
          </div>
          <span className="text-[10px] text-muted-foreground">
            {row.original.tenantContact || "No contact info"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "property",
      header: "Property / Unit",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 max-w-[150px]">
            <IconBuilding className="size-3 text-muted-foreground" />
            <span className="text-xs truncate">{row.original.property?.title || "N/A"}</span>
          </div>
          <Badge variant="outline" className="w-fit h-4.5 px-1.5 text-[10px] bg-muted/50">
            Unit {row.original.unit?.unitNumber || "N/A"}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "duration",
      header: "Contract Duration",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <IconCalendar className="size-3" />
            <span>{new Date(row.original.startDate).toLocaleDateString()} - {row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : "Open"}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "rentAmount",
      header: "Rent Amount",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconCash className="size-3.5 text-primary" />
          <span className="text-primary font-medium">{getCurrencySymbol()}{row.original.rentAmount?.toLocaleString()}</span>
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
          <SelectTrigger className="w-fit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Terminated">Terminated</SelectItem>
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2" onClick={() => handleEdit(row.original)}>
              <IconEdit className="size-4" />
              Edit Contract
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteConfirm 
                title="Delete Contract?"
                description="This will permanently cancel this agreement and release the associated unit."
                onConfirm={() => handleDelete(row.original._id)}
            >
                <DropdownMenuItem 
                    className="gap-2 text-destructive font-medium" 
                    onSelect={(e) => e.preventDefault()}
                >
                    <IconTrash className="size-4" />
                    Delete Contract
                </DropdownMenuItem>
            </DeleteConfirm>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [handleStatusUpdate, handleEdit, handleDelete, getCurrencySymbol, formatDate])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contract Management</h2>
          <p className="text-muted-foreground">Manage rental agreements, tenants, and lease durations.</p>
        </div>
      </div>

      <ContractStats contracts={contracts} />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : contracts.length === 0 ? (
        <Empty className="rounded-2xl border-2 border-dashed bg-muted/50">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconInbox className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No contracts found.</EmptyTitle>
            <EmptyDescription>
              Create a new rental contract to get started.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={() => setModalOpen(true)}>
              Add Your First Contract
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ReusableDataTable 
          data={contracts} 
          columns={columns} 
          searchColumn="clientName" 
          searchPlaceholder="Search tenants..."
          addButtonLabel="New Contract"
          onAddClick={handleAdd}
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
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Terminated">Terminated</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <DeleteConfirm
                title="Delete Selected Contracts?"
                description={`Are you sure you want to delete ${selectedRows.length} selected contracts? This action cannot be undone.`}
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

      <AddContractModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        initialData={selectedContract}
        onSuccess={fetchContracts}
      />
    </div>
  )
}
