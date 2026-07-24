import React, { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const searchInputRef = useRef(null)

  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
