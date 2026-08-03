import React, { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export function SearchableSelect({
  value,
  onValueChange,
  items = [], // Expected format: Array of objects { id/ _id, name }
  placeholder = "Choose an option...",
  searchPlaceholder = "Type to search...",
  id,
  className,
  required = false,
  disabled = false,
  multiple = false,
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const searchInputRef = useRef(null)

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (multiple) {
    const selectedArray = Array.isArray(value)
      ? value
      : typeof value === "string" && value
      ? value.split(",").map((v) => v.trim()).filter(Boolean)
      : []

    const selectedItems = items.filter((item) =>
      selectedArray.includes(item._id || item.id)
    )

    const toggleItem = (itemId) => {
      let newSelected
      if (selectedArray.includes(itemId)) {
        newSelected = selectedArray.filter((id) => id !== itemId)
      } else {
        newSelected = [...selectedArray, itemId]
      }
      onValueChange(newSelected)
    }

    const removeBadge = (e, itemId) => {
      e.stopPropagation()
      const newSelected = selectedArray.filter((id) => id !== itemId)
      onValueChange(newSelected)
    }

    return (
      <Popover
        onOpenChange={(open) => {
          if (!open) setSearchTerm("")
          else {
            setTimeout(() => {
              searchInputRef.current?.focus()
            }, 80)
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal min-h-9 h-auto py-1.5 px-3 text-left bg-background border-input hover:bg-accent/50",
              !selectedArray.length && "text-muted-foreground",
              className
            )}
          >
            <div className="flex flex-wrap gap-1 items-center max-w-[calc(100%-1.5rem)]">
              {selectedItems.length === 0 ? (
                <span>{placeholder}</span>
              ) : (
                selectedItems.map((item) => (
                  <span
                    key={item._id || item.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                  >
                    <span className="truncate max-w-[150px]">{item.name}</span>
                    <IconX
                      className="size-3 hover:text-destructive cursor-pointer shrink-0"
                      onClick={(e) => removeBadge(e, item._id || item.id)}
                    />
                  </span>
                ))
              )}
            </div>
            <IconChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[220px]"
          align="start"
        >
          <div className="p-2 border-b">
            <Input
              ref={searchInputRef}
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-full"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredItems.length === 0 ? (
              <div className="p-2 text-center text-xs text-muted-foreground">
                No results found
              </div>
            ) : (
              filteredItems.map((item) => {
                const itemId = item._id || item.id
                const isSelected = selectedArray.includes(itemId)
                return (
                  <div
                    key={itemId}
                    onClick={() => toggleItem(itemId)}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-md px-2.5 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                      isSelected && "font-medium"
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      className="mr-2 pointer-events-none"
                    />
                    <span className="truncate flex-1">{item.name}</span>
                    {isSelected && (
                      <IconCheck className="ml-auto size-4 text-primary shrink-0" />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Select
      value={value || undefined}
      disabled={disabled}
      onOpenChange={(open) => {
        if (open) {
          setTimeout(() => {
            searchInputRef.current?.focus()
          }, 80)
        } else {
          setSearchTerm("")
        }
      }}
      onValueChange={onValueChange}
    >
      <SelectTrigger id={id} className={className} required={required}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2 border-b">
          <Input
            ref={searchInputRef}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-full"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <SelectGroup>
          {filteredItems.length === 0 ? (
            <div className="p-2 text-center text-xs text-muted-foreground">
              No results found
            </div>
          ) : (
            filteredItems.map((item) => (
              <SelectItem key={item._id || item.id} value={item._id || item.id}>
                {item.name}
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
