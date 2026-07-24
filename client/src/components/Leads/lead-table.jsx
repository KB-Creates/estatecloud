import { useSettings } from '@/context/SettingsContext';
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  IconDotsVertical,
  IconUser,
  IconPhone,
} from "@tabler/icons-react"
import { ReusableDataTable } from "@/components/ui/reusable-data-table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { LeadCellViewer } from "@/components/Leads/lead-cell-viewer"
import { AssignAgentModal } from "@/components/Leads/assign-agent-modal"
import { UpdateStatusModal } from "@/components/Leads/update-status-modal"

import { DeleteConfirm } from "@/components/delete-confirm"
import { IconEdit, IconTrash, IconUserShare } from "@tabler/icons-react"

export function LeadTable({ leads, onStatusUpdate, onAddClick, onEdit, onDelete, onUpdate, onBulkDelete, onBulkStatusUpdate, onBulkAssign, staff = [], actions }) {
  const { formatDate } = useSettings();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [leadsToAssign, setLeadsToAssign] = useState([]);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalData, setStatusModalData] = useState({
    leadId: "",
    leadName: "",
    newStatus: ""
  });

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
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <LeadCellViewer lead={row.original} onUpdate={onUpdate} />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.original.phone;
        if (!phone) return <span className="text-sm text-muted-foreground">N/A</span>;

        const handleCopy = () => {
          navigator.clipboard.writeText(phone);
          toast.success("Phone number copied!");
        };

        return (
          <button
            onClick={handleCopy}
            className="text-sm font-medium hover:text-primary hover:underline cursor-pointer transition-colors text-left focus:outline-none"
            title="Click to copy phone number"
          >
            {phone}
          </button>
        );
      },
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => (
        <div className="max-w-[120px] truncate text-sm font-medium" title={row.original.city}>
          {row.original.city}
        </div>
      ),
    },
    {
      id: "assignedTo",
      accessorFn: row => row.assignedTo ? row.assignedTo._id : "unassigned",
      header: "Agent",
      filterFn: "equals",
      cell: ({ row }) => (
        <Badge variant={row.original.assignedTo ? "secondary" : "outline"} className="font-medium">
          {row.original.assignedTo ? row.original.assignedTo.name : "Unassigned"}
        </Badge>
      ),
    },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: ({ row }) => (
        <span className="text-sm font-bold text-primary">{row.original.budget}</span>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.original.priority || "Medium"
        const colors = {
          High: "destructive",
          Medium: "secondary",
          Low: "outline",
        }
        return (
          <Badge variant={colors[priority] || "outline"}>
            {priority}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: "equals",
      cell: ({ row }) => {
        const status = row.original.status || "New";
        const colorClass =
          status === "New" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
            status === "Contacted" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
              status === "Qualified" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                status === "Lost" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" :
                  status === "Converted" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    "bg-muted text-muted-foreground";

        return onStatusUpdate ? (
          <Select
            onValueChange={(val) => {
              if (val !== status) {
                setStatusModalData({
                  leadId: row.original._id,
                  leadName: row.original.name,
                  newStatus: val
                });
                setStatusModalOpen(true);
              }
            }}
            value={status}
          >
            <SelectTrigger className={cn("w-fit h-7 text-xs font-bold border-none px-2.5 rounded-full", colorClass)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <Badge className={cn("text-[10px] px-2.5 py-0.5 rounded-full border-none", colorClass)} variant="outline">
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const rawDate = row.getValue("createdAt");
        if (!rawDate) return <span className="text-muted-foreground text-xs">-</span>;
        const formatted = formatDate ? formatDate(rawDate) : new Date(rawDate).toLocaleString();
        const parts = formatted.split(" - ");
        const datePart = parts[0];
        const timePart = parts[1];

        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground text-xs">{datePart}</span>
            {timePart && <span className="text-muted-foreground text-[12px]">{timePart}</span>}
          </div>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const hasActions = onEdit || onBulkAssign || onDelete;
        if (!hasActions) return null;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {onEdit && (
                <DropdownMenuItem className="gap-2" onClick={() => onEdit(row.original)}>
                  Edit Lead
                </DropdownMenuItem>
              )}

              {onBulkAssign && (
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => {
                    setLeadsToAssign([row.original._id])
                    setIsAssignModalOpen(true)
                  }}
                >
                  Assign Agent
                </DropdownMenuItem>
              )}

              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DeleteConfirm
                    title="Delete Lead?"
                    description="This will permanently remove this lead and all associated notes."
                    onConfirm={() => onDelete(row.original._id)}
                  >
                    <DropdownMenuItem
                      className="gap-2 text-destructive font-medium"
                      onSelect={(e) => e.preventDefault()}
                    >
                      Delete Lead
                    </DropdownMenuItem>
                  </DeleteConfirm>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [onStatusUpdate, onEdit, onDelete, onUpdate, formatDate, onBulkAssign])

  const renderBulkActions = ({ selectedRows }) => {
    const hasBulkActions = onBulkAssign || onBulkStatusUpdate;
    if (!hasBulkActions) return null;

    return (
      <div className="flex items-center gap-2">
        {onBulkAssign && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => {
              setLeadsToAssign(selectedRows.map(r => r.original._id))
              setIsAssignModalOpen(true)
            }}
          >
            <IconUserShare className="size-4 mr-1.5" />
            Assign Agent
          </Button>
        )}

        {onBulkStatusUpdate && (
          <Select
            onValueChange={(val) => {
              if (val) onBulkStatusUpdate(selectedRows.map(r => r.original._id), val);
            }}
          >
            <SelectTrigger className="w-fit h-8">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="New">Mark as New</SelectItem>
                <SelectItem value="Contacted">Mark as Contacted</SelectItem>
                <SelectItem value="Qualified">Mark as Qualified</SelectItem>
                <SelectItem value="Lost">Mark as Lost</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
    );
  }

  const filterElement = ({ table }) => (
    <div className="flex items-center gap-2">
      <Select
        value={table.getColumn("assignedTo")?.getFilterValue() ?? "all"}
        onValueChange={(val) => table.getColumn("assignedTo")?.setFilterValue(val === "all" ? "" : val)}
      >
        <SelectTrigger className="w-[150px] bg-muted/50 border-none h-9">
          <SelectValue placeholder="All Agents" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Agents</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
          </SelectGroup>
          {staff.map((s) => (
            <SelectGroup key={s._id}>
              <SelectItem value={s._id}>{s.name}</SelectItem>
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={table.getColumn("status")?.getFilterValue() ?? "all"}
        onValueChange={(val) => table.getColumn("status")?.setFilterValue(val === "all" ? "" : val)}
      >
        <SelectTrigger className="w-[140px] bg-muted/50 border-none h-9">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
            <SelectItem value="Converted">Converted</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <>
      <ReusableDataTable
        data={leads}
        columns={columns}
        searchColumn="name"
        searchPlaceholder="Search leads..."
        addButtonLabel="New Lead"
        onAddClick={onAddClick}
        onBulkDelete={onBulkDelete}
        bulkActions={renderBulkActions}
        actions={actions}
        filterElement={filterElement}
      />

      <AssignAgentModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        staff={staff}
        selectedCount={leadsToAssign.length}
        onAssign={(agentId) => onBulkAssign(leadsToAssign, agentId)}
      />

      <UpdateStatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        leadName={statusModalData.leadName}
        newStatus={statusModalData.newStatus}
        onSave={async (extraData) => {
          await onStatusUpdate(statusModalData.leadId, statusModalData.newStatus, extraData);
        }}
      />
    </>
  )
}
