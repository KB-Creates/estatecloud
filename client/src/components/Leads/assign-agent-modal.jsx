import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { IconUserShare, IconSelector, IconCheck } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export function AssignAgentModal({ open, onOpenChange, staff = [], selectedCount = 0, onAssign }) {
  const [selectedAgentId, setSelectedAgentId] = useState(null)
  const [openCombobox, setOpenCombobox] = useState(false)

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedAgentId(null)
      setOpenCombobox(false)
    }
  }, [open])

  const handleAssign = () => {
    if (selectedAgentId) {
      onAssign(selectedAgentId)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Agent</DialogTitle>
          <DialogDescription>
            Select an agent to assign {selectedCount === 1 ? "this lead" : `these ${selectedCount} leads`} to.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label>Select Agent</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between bg-muted/50 font-normal"
                >
                  {selectedAgentId
                    ? staff.find((s) => s._id === selectedAgentId)?.name
                    : "Choose an agent..."}
                  <IconSelector className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[375px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search agent..." />
                  <CommandList>
                    <CommandEmpty>No agent found.</CommandEmpty>
                    <CommandGroup>
                      {staff.map((s) => (
                        <CommandItem
                          key={s._id}
                          value={s.name}
                          onSelect={() => {
                            setSelectedAgentId(s._id)
                            setOpenCombobox(false)
                          }}
                        >
                          <IconCheck
                            className={cn(
                              "mr-2 size-4",
                              selectedAgentId === s._id ? "opacity-100 text-primary" : "opacity-0"
                            )}
                          />
                          {s.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedAgentId}>
            Assign {selectedCount > 0 ? `(${selectedCount})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}