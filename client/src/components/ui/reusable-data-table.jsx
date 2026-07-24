import * as React from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  IconLayoutColumns,
  IconChevronDown,
  IconPlus,
  IconSearch,
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
  IconTrash,
  IconChevronUp,
  IconArrowsSort,
  IconGripHorizontal,
  IconX,
  IconFilterOff,
} from "@tabler/icons-react"

import { DeleteConfirm } from "@/components/delete-confirm"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const DraggableTableHeader = ({ header }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: header.column.id,
  })

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    whiteSpace: "nowrap",
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      colSpan={header.colSpan}
      className="h-9 text-[10px] font-bold text-muted-foreground uppercase tracking-wider group/header relative bg-muted/30"
    >
      <div className="flex items-center relative">
        {header.column.id !== 'select' && header.column.id !== 'actions' && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="absolute -left-4 cursor-grab hover:bg-muted/50 p-0.5 rounded opacity-0 group-hover/header:opacity-100 transition-opacity"
          >
            <IconGripHorizontal className="size-3" />
          </button>
        )}
        {header.isPlaceholder ? null : (
          header.column.getCanSort() && typeof header.column.columnDef.header === 'string' ? (
            <div
              className="flex items-center gap-1.5 cursor-pointer select-none hover:text-foreground transition-colors"
              onClick={header.column.getToggleSortingHandler()}
            >
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
              {{
                asc: <IconChevronUp className="size-3.5" />,
                desc: <IconChevronDown className="size-3.5" />,
              }[header.column.getIsSorted()] ?? <IconArrowsSort className="size-3.5 text-muted-foreground/30" />}
            </div>
          ) : (
            flexRender(
              header.column.columnDef.header,
              header.getContext()
            )
          )
        )}
      </div>
    </TableHead>
  )
}

const DragAlongCell = ({ cell }) => {
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
  })

  const [isOverflowing, setIsOverflowing] = React.useState(false)
  const [tooltipText, setTooltipText] = React.useState("")
  const cellRef = React.useRef(null)

  const handleRef = (node) => {
    setNodeRef(node)
    cellRef.current = node
  }

  React.useEffect(() => {
    if (!cellRef.current) return;

    const checkOverflow = () => {
      // Find the element with truncate class, or use the cell itself
      const el = cellRef.current.querySelector('.truncate') || cellRef.current;
      if (el && el.scrollWidth > el.clientWidth) {
        setIsOverflowing(true)
        setTooltipText(el.textContent)
      } else {
        setIsOverflowing(false)
      }
    }

    checkOverflow()
    const observer = new ResizeObserver(checkOverflow)
    if (cellRef.current) {
      observer.observe(cellRef.current)
      Array.from(cellRef.current.children).forEach(child => observer.observe(child))
    }

    return () => observer.disconnect()
  }, [cell.column.id, cell.row.original])

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  }

  const content = flexRender(cell.column.columnDef.cell, cell.getContext())

  if (isOverflowing && cell.column.id !== 'actions' && cell.column.id !== 'select') {
    return (
      <TableCell ref={handleRef} style={style} className="py-2 bg-card">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              {content}
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={-2} className="max-w-[300px] whitespace-normal break-words z-50">
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </TableCell>
    )
  }

  return (
    <TableCell ref={handleRef} style={style} className="py-2 bg-card">
      {content}
    </TableCell>
  )
}


export function ReusableDataTable({
  columns,
  data: initialData,
  searchPlaceholder = "Search...",
  searchColumn = "",
  filterPlaceholder,
  filterColumn,
  onAddClick,
  addButtonLabel = "Add New",
  actions,
  filterElement,
  bulkActions,
  onBulkDelete,
  bulkDeleteLabel = "Delete Selected"
}) {
  const activeSearchColumn = searchColumn || filterColumn
  const activeSearchPlaceholder = searchPlaceholder !== "Search..." ? searchPlaceholder : (filterPlaceholder || searchPlaceholder)

  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const [columnOrder, setColumnOrder] = React.useState(() =>
    columns.map((c) => c.id || c.accessorKey)
  )
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    getRowId: (row) => (row.id || row._id).toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelection = selectedRows.length > 0

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      if (active.id === 'select' || over.id === 'select' || active.id === 'actions' || over.id === 'actions') {
        return // Prevent moving pinned columns
      }
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id)
        const newIndex = columnOrder.indexOf(over.id)
        return arrayMove(columnOrder, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasSelection ? (
            <div className="flex items-center gap-3 text-sm font-medium">
              <span>{selectedRows.length} selected</span>
              <div className="h-4 w-px bg-border" />
              {bulkActions && (
                typeof bulkActions === "function"
                  ? bulkActions({ table, selectedRows })
                  : bulkActions
              )}
              {onBulkDelete && (
                <DeleteConfirm
                  title={`Delete ${selectedRows.length} selected items?`}
                  description="This action cannot be undone and will permanently remove all selected records."
                  onConfirm={async () => {
                    const ids = selectedRows.map(row => row.original._id || row.original.id)
                    await onBulkDelete(ids)
                    table.resetRowSelection()
                  }}
                >
                  <Button variant="destructive" size="sm" className="h-8">
                    <IconTrash className="size-4 mr-1.5" />
                    {bulkDeleteLabel} ({selectedRows.length})
                  </Button>
                </DeleteConfirm>
              )}
            </div>
          ) : (
            <>
              {activeSearchColumn && (
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={activeSearchPlaceholder}
                    value={(table.getColumn(activeSearchColumn)?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                      table.getColumn(activeSearchColumn)?.setFilterValue(event.target.value)
                    }
                    className="w-72 bg-muted/50 border-none pl-9"
                  />
                </div>
              )}
              {filterElement && (
                typeof filterElement === "function"
                  ? filterElement({ table })
                  : filterElement
              )}
              {table.getState().columnFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => table.resetColumnFilters()}
                  className="size-9 text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Clear filters"
                >
                  <IconFilterOff className="size-4" />
                </Button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-dashed">
                <IconLayoutColumns className="size-4 mr-2" />
                Columns
                <IconChevronDown className="size-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {onAddClick && (
            <Button size="sm" onClick={onAddClick}>
              <IconPlus className="mr-1.5 size-4" />
              <span>{addButtonLabel}</span>
            </Button>
          )}

          {actions}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <ScrollArea className="w-full">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Table>
              <TableHeader className="bg-muted/30">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header) => (
                        <DraggableTableHeader key={header.id} header={header} />
                      ))}
                    </SortableContext>
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="group border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <SortableContext
                        items={columnOrder}
                        strategy={horizontalListSortingStrategy}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <DragAlongCell key={cell.id} cell={cell} />
                        ))}
                      </SortableContext>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-64 text-center text-muted-foreground font-medium"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectGroup>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
